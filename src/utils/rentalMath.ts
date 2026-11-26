import type {
  BasketItem,
  CheckoutFormData,
  EquipmentItem,
  RentalDates,
} from '../types/rental';

export function formatNaira(amount: number): string {
  return `₦${Math.round(amount).toLocaleString('en-NG')}`;
}

export function getTodayIsoDate(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getTomorrowIsoDate(): string {
  const now = new Date();
  now.setDate(now.getDate() + 1);
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function parseIsoDateUtc(dateStr: string): number | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    return null;
  }
  const [y, m, d] = dateStr.split('-').map(Number);
  const utc = Date.UTC(y, m - 1, d);
  const check = new Date(utc);
  if (
    check.getUTCFullYear() !== y ||
    check.getUTCMonth() !== m - 1 ||
    check.getUTCDate() !== d
  ) {
    return null;
  }
  return utc;
}

export interface DateValidationResult {
  isValid: boolean;
  rentalDays: number;
  collectionError: string | null;
  returnError: string | null;
}

export function validateRentalDates(dates: RentalDates): DateValidationResult {
  const todayUtc = parseIsoDateUtc(getTodayIsoDate())!;
  const collectionUtc = parseIsoDateUtc(dates.collectionDate);
  const returnUtc = parseIsoDateUtc(dates.returnDate);

  let collectionError: string | null = null;
  let returnError: string | null = null;

  if (!dates.collectionDate || collectionUtc === null || collectionUtc < todayUtc) {
    collectionError = 'Please select a valid collection date.';
  }

  if (!dates.returnDate || returnUtc === null) {
    returnError = 'Your return date must be after your collection date.';
  } else if (collectionUtc !== null && returnUtc <= collectionUtc) {
    returnError = 'Your return date must be after your collection date.';
  }

  if (collectionError || returnError || collectionUtc === null || returnUtc === null) {
    return {
      isValid: false,
      rentalDays: 0,
      collectionError,
      returnError,
    };
  }

  const diffDays = Math.round((returnUtc - collectionUtc) / 86400000);
  return {
    isValid: diffDays >= 1,
    rentalDays: diffDays,
    collectionError: null,
    returnError: null,
  };
}

export function validateQuantityValue(
  rawQty: number,
  availableStock: number
): { valid: boolean; error: string | null } {
  if (!Number.isFinite(rawQty) || !Number.isInteger(rawQty) || rawQty < 1) {
    return { valid: false, error: 'Please enter a valid quantity.' };
  }
  if (rawQty > availableStock) {
    return {
      valid: false,
      error: 'You cannot rent more units than are currently listed as available.',
    };
  }
  return { valid: true, error: null };
}

export function formatReadableDate(dateStr: string): string {
  const utc = parseIsoDateUtc(dateStr);
  if (utc === null) return dateStr;
  return new Intl.DateTimeFormat('en-NG', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(utc));
}

export interface CalculatedLineItem {
  product: EquipmentItem;
  quantity: number;
  dailySubtotal: number;
  lineTotal: number;
}

export function buildBasketCalculation(
  basket: BasketItem[],
  inventory: EquipmentItem[],
  rentalDays: number
): {
  lines: CalculatedLineItem[];
  totalDailyRate: number;
  totalEstimatedCost: number;
  hasInvalidQuantity: boolean;
} {
  let totalDailyRate = 0;
  let totalEstimatedCost = 0;
  let hasInvalidQuantity = false;
  const lines: CalculatedLineItem[] = [];

  for (const item of basket) {
    const product = inventory.find((p) => p.id === item.productId);
    if (!product) continue;

    const qCheck = validateQuantityValue(item.quantity, product.availableStock);
    if (!qCheck.valid) {
      hasInvalidQuantity = true;
    }

    const safeQty = Number.isInteger(item.quantity) && item.quantity > 0 ? item.quantity : 0;
    const dailySubtotal = product.dailyPrice * safeQty;
    const lineTotal = rentalDays > 0 ? dailySubtotal * rentalDays : 0;

    totalDailyRate += dailySubtotal;
    totalEstimatedCost += lineTotal;

    lines.push({
      product,
      quantity: item.quantity,
      dailySubtotal,
      lineTotal,
    });
  }

  return {
    lines,
    totalDailyRate,
    totalEstimatedCost,
    hasInvalidQuantity,
  };
}

export interface CheckoutErrors {
  fullName?: string;
  phoneNumber?: string;
  emailAddress?: string;
  eventLocation?: string;
}

export function validateCheckoutForm(form: CheckoutFormData): CheckoutErrors {
  const errors: CheckoutErrors = {};

  if (!form.fullName.trim() || form.fullName.trim().length < 2) {
    errors.fullName = 'Please enter your full name.';
  }

  const cleanedPhone = form.phoneNumber.replace(/[\s\-()]/g, '');
  if (!cleanedPhone || !/^\+?\d{7,15}$/.test(cleanedPhone)) {
    errors.phoneNumber = 'Please enter a valid phone number.';
  }

  if (form.emailAddress.trim()) {
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.emailAddress.trim());
    if (!emailOk) {
      errors.emailAddress = 'Please enter a valid email address or leave blank.';
    }
  }

  if (!form.eventLocation.trim() || form.eventLocation.trim().length < 3) {
    errors.eventLocation = 'Please enter your event location or area in Lagos.';
  }

  return errors;
}

export function buildWhatsAppEnquiryMessage(params: {
  customer: CheckoutFormData;
  lines: CalculatedLineItem[];
  dates: RentalDates;
  rentalDays: number;
  totalEstimatedCost: number;
}): string {
  const { customer, lines, dates, rentalDays, totalEstimatedCost } = params;

  const itemLines = lines
    .map(
      (line, idx) =>
        `${idx + 1}. ${line.product.name}\n   Qty: ${line.quantity} units × ${formatNaira(
          line.product.dailyPrice
        )}/day × ${rentalDays} ${rentalDays === 1 ? 'day' : 'days'} = ${formatNaira(
          line.lineTotal
        )}`
    )
    .join('\n');

  const linesArr = [
    '*VVICHELAE EVENT RENTALS — RENTAL ENQUIRY*',
    '----------------------------------------',
    `Customer Name: ${customer.fullName.trim()}`,
    `Phone Number: ${customer.phoneNumber.trim()}`,
    customer.emailAddress.trim() ? `Email: ${customer.emailAddress.trim()}` : null,
    '',
    '*RENTAL PERIOD*',
    `Collection Date: ${formatReadableDate(dates.collectionDate)} (${dates.collectionDate})`,
    `Return Date: ${formatReadableDate(dates.returnDate)} (${dates.returnDate})`,
    `Total Rental Duration: ${rentalDays} ${rentalDays === 1 ? 'day' : 'days'}`,
    '',
    '*SELECTED EQUIPMENT*',
    itemLines,
    '',
    `*TOTAL ESTIMATED RENTAL COST: ${formatNaira(totalEstimatedCost)}*`,
    '(Delivery charges, if applicable, to be confirmed separately.)',
    '',
    '*FULFILMENT & EVENT DETAILS*',
    `Preference: ${customer.fulfilmentMethod}`,
    `Event Location: ${customer.eventLocation.trim()}`,
    customer.additionalInstructions.trim()
      ? `Additional Instructions: ${customer.additionalInstructions.trim()}`
      : 'Additional Instructions: None',
    '',
    '_Note: This is a rental enquiry, not a confirmed reservation. Please review availability and confirm final booking arrangements._',
  ].filter((v): v is string => v !== null);

  return linesArr.join('\n');
}

export function buildWhatsAppUrl(message: string): string {
  return `https://wa.me/2348144084281?text=${encodeURIComponent(message)}`;
}

export function encodeFormUrlParams(data: Record<string, string>): string {
  return Object.keys(data)
    .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`)
    .join('&');
}
