import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShoppingBag,
  Trash2,
  Minus,
  Plus,
  Calendar,
  AlertCircle,
  CheckCircle2,
  MessageCircle,
  Send,
  ArrowRight,
  Info,
  Copy,
  Check,
} from 'lucide-react';
import { BUSINESS_INFO, EQUIPMENT_ITEMS } from '../data/equipment';
import { useBasket } from '../context/BasketContext';
import type { CheckoutFormData, FulfilmentMethod } from '../types/rental';
import {
  buildBasketCalculation,
  buildWhatsAppEnquiryMessage,
  buildWhatsAppUrl,
  encodeFormUrlParams,
  formatNaira,
  formatReadableDate,
  getTodayIsoDate,
  validateCheckoutForm,
  validateQuantityValue,
  validateRentalDates,
  type CheckoutErrors,
} from '../utils/rentalMath';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { ResilientImage } from '../components/ResilientImage';
import { BrandSymbol } from '../components/BrandLogo';

export const BasketPage: React.FC = () => {
  useDocumentTitle(
    'Rental Basket & Cost Calculator',
    'Review your selected event rentals, set collection and return dates, calculate your Naira cost, and send your rental enquiry.'
  );

  const {
    items,
    dates,
    setDates,
    updateItemQuantity,
    removeItem,
    clearBasket,
  } = useBasket();

  const [confirmClear, setConfirmClear] = useState(false);

  const [checkout, setCheckout] = useState<CheckoutFormData>({
    fullName: '',
    phoneNumber: '',
    emailAddress: '',
    fulfilmentMethod: 'Delivery to the event location',
    eventLocation: '',
    additionalInstructions: '',
  });
  const [checkoutErrors, setCheckoutErrors] = useState<CheckoutErrors>({});
  const [generatedEnquiry, setGeneratedEnquiry] = useState<{
    message: string;
    whatsappUrl: string;
  } | null>(null);
  const [copiedMessage, setCopiedMessage] = useState(false);
  const [netlifySubmitting, setNetlifySubmitting] = useState(false);
  const [netlifyStatus, setNetlifyStatus] = useState<{
    type: 'success' | 'preview' | 'error';
    text: string;
  } | null>(null);

  const todayIso = getTodayIsoDate();
  const dateValidation = useMemo(() => validateRentalDates(dates), [dates]);

  const calculation = useMemo(
    () =>
      buildBasketCalculation(
        items,
        EQUIPMENT_ITEMS,
        dateValidation.isValid ? dateValidation.rentalDays : 0
      ),
    [items, dateValidation]
  );

  const isBasketReadyForEnquiry =
    items.length > 0 &&
    !calculation.hasInvalidQuantity &&
    dateValidation.isValid &&
    calculation.totalEstimatedCost > 0;

  const handleQuantityInput = (productId: string, rawVal: string) => {
    setGeneratedEnquiry(null);
    if (rawVal.trim() === '') {
      updateItemQuantity(productId, 0);
      return;
    }
    const parsed = Number(rawVal);
    if (Number.isNaN(parsed)) {
      updateItemQuantity(productId, 0);
      return;
    }
    updateItemQuantity(productId, parsed);
  };

  const handleStepQuantity = (productId: string, currentQty: number, delta: number) => {
    setGeneratedEnquiry(null);
    const safeCurrent = Number.isInteger(currentQty) && currentQty >= 1 ? currentQty : 1;
    const next = Math.max(1, safeCurrent + delta);
    updateItemQuantity(productId, next);
  };

  const updateFulfilment = (method: FulfilmentMethod) => {
    setCheckout((prev) => ({ ...prev, fulfilmentMethod: method }));
  };

  const runEnquiryValidation = (): boolean => {
    const errors = validateCheckoutForm(checkout);
    setCheckoutErrors(errors);

    if (items.length === 0 || calculation.hasInvalidQuantity || !dateValidation.isValid) {
      return false;
    }
    if (Object.keys(errors).length > 0) {
      return false;
    }
    return true;
  };

  const handleSendWhatsAppEnquiry = (e: React.FormEvent) => {
    e.preventDefault();
    setNetlifyStatus(null);

    if (!runEnquiryValidation()) {
      setGeneratedEnquiry(null);
      return;
    }

    const message = buildWhatsAppEnquiryMessage({
      customer: checkout,
      lines: calculation.lines,
      dates,
      rentalDays: dateValidation.rentalDays,
      totalEstimatedCost: calculation.totalEstimatedCost,
    });
    const whatsappUrl = buildWhatsAppUrl(message);

    setGeneratedEnquiry({ message, whatsappUrl });

    // Trigger anchor navigation safely inside user click event (avoids window.open block)
    const link = document.createElement('a');
    link.href = whatsappUrl;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleNetlifyFormSubmit = async () => {
    setNetlifyStatus(null);
    if (!runEnquiryValidation()) {
      return;
    }

    setNetlifySubmitting(true);
    try {
      const productNames = calculation.lines.map((l) => l.product.name).join(' | ');
      const productQuantities = calculation.lines
        .map(
          (l) =>
            `${l.product.name}: ${l.quantity} units (${formatNaira(l.product.dailyPrice)}/day, subtotal ${formatNaira(l.lineTotal)})`
        )
        .join('\n');

      const payload: Record<string, string> = {
        'form-name': 'vvichelae-rental-enquiries',
        'full-name': checkout.fullName.trim(),
        'phone-number': checkout.phoneNumber.trim(),
        'email-address': checkout.emailAddress.trim() || 'Not provided',
        'rental-products': productNames,
        'product-quantities': productQuantities,
        'collection-date': dates.collectionDate,
        'return-date': dates.returnDate,
        'rental-duration': `${dateValidation.rentalDays} ${
          dateValidation.rentalDays === 1 ? 'day' : 'days'
        }`,
        'estimated-total': formatNaira(calculation.totalEstimatedCost),
        'fulfilment-preference': checkout.fulfilmentMethod,
        'event-location': checkout.eventLocation.trim(),
        'additional-instructions': checkout.additionalInstructions.trim() || 'None',
      };

      const res = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: encodeFormUrlParams(payload),
      });

      const host = window.location.hostname;
      const isLocalOrPreview =
        import.meta.env.DEV ||
        host === 'localhost' ||
        host === '127.0.0.1' ||
        host.endsWith('.run.app');

      if (!res.ok) {
        setNetlifyStatus({
          type: 'error',
          text: 'Web form submission failed on this server. Please click SEND RENTAL ENQUIRY above to send your full enquiry directly via WhatsApp.',
        });
      } else if (isLocalOrPreview) {
        setNetlifyStatus({
          type: 'preview',
          text: 'Your enquiry data passed validation and posted to `/`, however Netlify Forms only receives submissions once deployed to Netlify. In this preview environment, please use SEND RENTAL ENQUIRY (WhatsApp) above—or deploy to Netlify to test live form capture.',
        });
      } else {
        setNetlifyStatus({
          type: 'success',
          text: 'Your rental enquiry form has been submitted to Vvichelae Event Rentals. Please note this is a rental enquiry, not a confirmed reservation; we will review availability and contact you shortly.',
        });
        clearBasket();
      }
    } catch {
      setNetlifyStatus({
        type: 'error',
        text: 'Could not reach the form endpoint due to a network error. Please use SEND RENTAL ENQUIRY via WhatsApp instead.',
      });
    } finally {
      setNetlifySubmitting(false);
    }
  };

  const handleCopyMessage = async () => {
    if (!generatedEnquiry) return;
    try {
      await navigator.clipboard.writeText(generatedEnquiry.message);
      setCopiedMessage(true);
      window.setTimeout(() => setCopiedMessage(false), 1800);
    } catch {
      // Clipboard API unavailable
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-[#245B59]/12">
        <div>
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#245B59]/70">
            Interactive Cost Calculator & Enquiry
          </p>
          <h1 className="mt-2 font-serif text-4xl sm:text-5xl font-semibold text-[#245B59] tracking-tight">
            Rental Basket
          </h1>
        </div>

        {items.length > 0 && (
          <div className="flex items-center gap-3">
            <Link
              to="/equipment"
              className="text-xs sm:text-sm font-semibold text-[#245B59] underline decoration-[#E8C994] underline-offset-4"
            >
              + Add More Equipment
            </Link>
            {!confirmClear ? (
              <button
                type="button"
                onClick={() => setConfirmClear(true)}
                className="rounded-lg border border-[#245B59]/20 bg-white px-3.5 py-2 text-xs font-semibold text-[#245B59] hover:border-[#245B59] hover:bg-[#E8C994]/25 min-h-[40px] cursor-pointer transition-colors"
              >
                Clear Basket
              </button>
            ) : (
              <div className="flex items-center gap-2 rounded-lg border border-[#245B59] bg-[#E8C994]/30 px-3 py-1.5">
                <span className="text-xs font-semibold text-[#245B59]">Clear all items?</span>
                <button
                  type="button"
                  onClick={() => {
                    clearBasket();
                    setConfirmClear(false);
                    setGeneratedEnquiry(null);
                  }}
                  className="rounded bg-[#245B59] px-2.5 py-1 text-xs font-semibold text-[#FFF9F0] cursor-pointer"
                >
                  Yes
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmClear(false)}
                  className="rounded border border-[#245B59]/30 bg-white px-2.5 py-1 text-xs font-semibold text-[#245B59] cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* EMPTY BASKET DESIGN */}
      {items.length === 0 ? (
        <div className="mt-12 rounded-xl border border-[#E8C994] bg-white px-6 py-16 text-center max-w-2xl mx-auto shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#245B59] text-[#E8C994]">
            <ShoppingBag className="w-6 h-6" aria-hidden="true" />
          </div>
          <h2 className="mt-5 font-serif text-3xl font-semibold text-[#245B59]">
            Your Rental Basket Is Empty
          </h2>
          <p className="mt-2.5 text-sm sm:text-base text-[#245B59]/80 leading-relaxed">
            Explore our Lagos event inventory to add chairs, tables, canopies, decorative fabrics,
            staging accessories, or catering equipment. Your selections stay saved here as you
            browse.
          </p>
          <Link
            to="/equipment"
            className="mt-7 inline-flex items-center justify-center gap-2 rounded-lg bg-[#245B59] px-6 py-3.5 text-sm font-semibold text-[#FFF9F0] hover:bg-[#245B59]/90 transition-colors min-h-[44px]"
          >
            <span>Explore Equipment</span>
            <ArrowRight className="w-4 h-4 text-[#E8C994]" aria-hidden="true" />
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* LEFT COLUMN: Basket Items + Rental Dates */}
          <div className="lg:col-span-7 space-y-8">
            {/* Selected Products */}
            <section aria-label="Selected equipment items" className="space-y-4">
              <h2 className="font-serif text-2xl font-semibold text-[#245B59]">
                1. Selected Equipment ({items.length})
              </h2>

              <div className="divide-y divide-[#245B59]/12 rounded-xl border border-[#245B59]/12 bg-white px-4 sm:px-6 shadow-sm">
                {calculation.lines.map((line) => {
                  const qtyValidation = validateQuantityValue(
                    line.quantity,
                    line.product.availableStock
                  );
                  return (
                    <div key={line.product.id} className="py-5 space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-start gap-4">
                          <Link
                            to={`/equipment/${line.product.slug}`}
                            className="h-20 w-24 shrink-0 overflow-hidden rounded-lg border border-[#245B59]/12"
                          >
                            <ResilientImage
                              src={line.product.image}
                              alt={line.product.name}
                              className="h-full w-full object-cover"
                            />
                          </Link>
                          <div>
                            <p className="text-xs text-[#245B59]/70">
                              {line.product.category} ·{' '}
                              <span className="tabular-nums">
                                {line.product.availableStock} max available
                              </span>
                            </p>
                            <h3 className="mt-0.5 font-serif text-xl font-semibold text-[#245B59]">
                              <Link
                                to={`/equipment/${line.product.slug}`}
                                className="hover:underline decoration-[#E8C994]"
                              >
                                {line.product.name}
                              </Link>
                            </h3>
                            <p className="mt-1 text-sm font-medium text-[#245B59]/85 tabular-nums">
                              {formatNaira(line.product.dailyPrice)} per day
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between sm:justify-end gap-4">
                          {/* Quantity Controls */}
                          <div className="inline-flex items-center rounded-lg border border-[#245B59]/20 bg-[#FFF9F0]">
                            <button
                              type="button"
                              onClick={() =>
                                handleStepQuantity(line.product.id, line.quantity, -1)
                              }
                              aria-label={`Decrease ${line.product.name} quantity`}
                              className="p-2.5 text-[#245B59] hover:bg-[#E8C994]/30 cursor-pointer min-h-[40px] min-w-[40px] flex items-center justify-center transition-colors"
                            >
                              <Minus className="w-3.5 h-3.5" aria-hidden="true" />
                            </button>
                            <input
                              type="number"
                              aria-label={`${line.product.name} quantity`}
                              min={1}
                              max={line.product.availableStock}
                              step={1}
                              value={line.quantity === 0 ? '' : line.quantity}
                              onChange={(e) =>
                                handleQuantityInput(line.product.id, e.target.value)
                              }
                              className="w-16 bg-transparent text-center text-sm font-semibold text-[#245B59] tabular-nums focus:outline-none"
                            />
                            <button
                              type="button"
                              onClick={() =>
                                handleStepQuantity(line.product.id, line.quantity, 1)
                              }
                              aria-label={`Increase ${line.product.name} quantity`}
                              className="p-2.5 text-[#245B59] hover:bg-[#E8C994]/30 cursor-pointer min-h-[40px] min-w-[40px] flex items-center justify-center transition-colors"
                            >
                              <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                            </button>
                          </div>

                          <div className="text-right min-w-[100px]">
                            <p className="text-xs text-[#245B59]/70">Subtotal</p>
                            <p className="text-sm sm:text-base font-semibold text-[#245B59] tabular-nums">
                              {dateValidation.isValid && qtyValidation.valid
                                ? formatNaira(line.lineTotal)
                                : '—'}
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              removeItem(line.product.id);
                              setGeneratedEnquiry(null);
                            }}
                            aria-label={`Remove ${line.product.name}`}
                            className="p-2 text-[#245B59]/60 hover:text-[#245B59] cursor-pointer min-h-[40px] min-w-[40px] flex items-center justify-center"
                          >
                            <Trash2 className="w-4 h-4" aria-hidden="true" />
                          </button>
                        </div>
                      </div>

                      {!qtyValidation.valid && qtyValidation.error && (
                        <div
                          role="alert"
                          className="flex items-start gap-2 rounded-lg border border-[#245B59] bg-[#E8C994]/30 p-3 text-xs font-medium text-[#245B59]"
                        >
                          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
                          <span>{qtyValidation.error}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Rental Dates Section */}
            <section
              aria-label="Rental period and cost calculation"
              className="rounded-xl border border-[#245B59]/12 bg-white p-6 space-y-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="font-serif text-2xl font-semibold text-[#245B59] flex items-center gap-2">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[#E8C994]/35 text-[#245B59]">
                      <Calendar className="w-4 h-4" aria-hidden="true" />
                    </span>
                    <span>2. Select Rental Period</span>
                  </h2>
                  <p className="mt-1.5 text-xs sm:text-sm text-[#245B59]/80">
                    One rental period applies to all equipment in your basket. Returning the next
                    day counts as 1 rental day.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="collection-date"
                    className="block text-xs font-semibold text-[#245B59] mb-1.5"
                  >
                    Collection Date <span aria-hidden="true">*</span>
                  </label>
                  <input
                    id="collection-date"
                    type="date"
                    min={todayIso}
                    value={dates.collectionDate}
                    onChange={(e) => {
                      setDates({ ...dates, collectionDate: e.target.value });
                      setGeneratedEnquiry(null);
                    }}
                    className="w-full rounded-lg border border-[#245B59]/20 bg-[#FFF9F0] px-3.5 py-2.5 text-sm text-[#245B59] focus:border-[#245B59] focus:outline-none min-h-[44px]"
                  />
                  {dateValidation.collectionError && (
                    <p
                      role="alert"
                      className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-[#245B59]"
                    >
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                      <span>{dateValidation.collectionError}</span>
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="return-date"
                    className="block text-xs font-semibold text-[#245B59] mb-1.5"
                  >
                    Return Date <span aria-hidden="true">*</span>
                  </label>
                  <input
                    id="return-date"
                    type="date"
                    min={dates.collectionDate || todayIso}
                    value={dates.returnDate}
                    onChange={(e) => {
                      setDates({ ...dates, returnDate: e.target.value });
                      setGeneratedEnquiry(null);
                    }}
                    className="w-full rounded-lg border border-[#245B59]/20 bg-[#FFF9F0] px-3.5 py-2.5 text-sm text-[#245B59] focus:border-[#245B59] focus:outline-none min-h-[44px]"
                  />
                  {dateValidation.returnError && (
                    <p
                      role="alert"
                      className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-[#245B59]"
                    >
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                      <span>{dateValidation.returnError}</span>
                    </p>
                  )}
                </div>
              </div>

              {dateValidation.isValid ? (
                <div className="rounded-lg border border-[#E8C994] bg-[#E8C994]/22 px-4 py-3 text-xs sm:text-sm text-[#245B59] flex flex-wrap items-center justify-between gap-2">
                  <span>
                    Period:{' '}
                    <strong>{formatReadableDate(dates.collectionDate)}</strong> to{' '}
                    <strong>{formatReadableDate(dates.returnDate)}</strong>
                  </span>
                  <span className="font-semibold tabular-nums">
                    Rental Duration: {dateValidation.rentalDays}{' '}
                    {dateValidation.rentalDays === 1 ? 'day' : 'days'}
                  </span>
                </div>
              ) : (
                <div
                  role="alert"
                  className="rounded-lg border border-[#245B59] bg-[#E8C994]/30 px-4 py-3 text-xs font-medium text-[#245B59] flex items-start gap-2"
                >
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
                  <span>
                    Please select valid collection and return dates to calculate your rental total
                    and proceed with an enquiry.
                  </span>
                </div>
              )}
            </section>
          </div>

          {/* RIGHT COLUMN: Rental Summary + Checkout & Enquiry */}
          <div className="lg:col-span-5 space-y-6">
            {/* Rental Summary Card */}
            <section
              aria-label="Rental cost summary"
              className="rounded-xl bg-[#245B59] text-[#FFF9F0] p-6 space-y-4 shadow-sm"
            >
              <div className="flex items-center justify-between gap-4">
                <h2 className="font-serif text-2xl font-semibold text-[#E8C994]">
                  Rental Summary
                </h2>
                <div className="inline-flex items-center justify-center rounded-lg border border-[#E8C994]/60 bg-[#FFF9F0] px-2.5 py-1.5 shrink-0">
                  <BrandSymbol className="h-7" />
                </div>
              </div>

              <div className="space-y-2 text-xs sm:text-sm border-b border-[#E8C994]/25 pb-4">
                <div className="flex justify-between gap-3">
                  <span className="text-[#FFF9F0]/80">Collection Date</span>
                  <span className="font-medium tabular-nums">
                    {dateValidation.isValid
                      ? formatReadableDate(dates.collectionDate)
                      : 'Select valid date'}
                  </span>
                </div>
                <div className="flex justify-between gap-3">
                  <span className="text-[#FFF9F0]/80">Return Date</span>
                  <span className="font-medium tabular-nums">
                    {dateValidation.isValid
                      ? formatReadableDate(dates.returnDate)
                      : 'Select valid date'}
                  </span>
                </div>
                <div className="flex justify-between gap-3">
                  <span className="text-[#FFF9F0]/80">Rental Duration</span>
                  <span className="font-semibold text-[#E8C994] tabular-nums">
                    {dateValidation.isValid
                      ? `${dateValidation.rentalDays} ${
                          dateValidation.rentalDays === 1 ? 'day' : 'days'
                        }`
                      : '—'}
                  </span>
                </div>
              </div>

              <div className="space-y-2.5 text-xs sm:text-sm border-b border-[#E8C994]/25 pb-4">
                {calculation.lines.map((line) => (
                  <div key={line.product.id} className="flex justify-between gap-3">
                    <span className="text-[#FFF9F0]/90">
                      {line.product.name} ({line.quantity} × {formatNaira(line.product.dailyPrice)}
                      )
                    </span>
                    <span className="font-semibold tabular-nums shrink-0">
                      {dateValidation.isValid && !calculation.hasInvalidQuantity
                        ? formatNaira(line.lineTotal)
                        : '—'}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex items-baseline justify-between gap-4 pt-1">
                <span className="text-sm font-medium text-[#FFF9F0]/90">
                  Total Estimated Rental Cost
                </span>
                <span className="font-serif text-3xl font-semibold text-[#E8C994] tabular-nums">
                  {isBasketReadyForEnquiry
                    ? formatNaira(calculation.totalEstimatedCost)
                    : '—'}
                </span>
              </div>

              <p className="text-[11px] text-[#FFF9F0]/80 leading-relaxed">
                Calculated as Daily Price × Quantity × Rental Days. No security deposit or
                invented fees added. Delivery charges, if applicable, will be confirmed separately.
              </p>
            </section>

            {/* Checkout Form */}
            <section
              aria-label="Customer checkout and enquiry details"
              className="rounded-xl border border-[#245B59]/12 bg-white p-6 space-y-5 shadow-sm"
            >
              <div>
                <h2 className="font-serif text-2xl font-semibold text-[#245B59]">
                  3. Checkout & Send Enquiry
                </h2>
                <p className="mt-1 text-xs text-[#245B59]/80">
                  Complete your details to generate your structured WhatsApp enquiry or submit
                  through our web form.
                </p>
              </div>

              <form onSubmit={handleSendWhatsAppEnquiry} noValidate className="space-y-4">
                <div>
                  <label
                    htmlFor="checkout-name"
                    className="block text-xs font-semibold text-[#245B59] mb-1.5"
                  >
                    Full Name <span aria-hidden="true">*</span>
                  </label>
                  <input
                    id="checkout-name"
                    type="text"
                    value={checkout.fullName}
                    onChange={(e) =>
                      setCheckout((prev) => ({ ...prev, fullName: e.target.value }))
                    }
                    placeholder="e.g. Adebisi Ogunleye"
                    className="w-full rounded-lg border border-[#245B59]/20 bg-[#FFF9F0] px-3.5 py-2.5 text-sm text-[#245B59] placeholder:text-[#245B59]/45 focus:border-[#245B59] focus:outline-none min-h-[44px]"
                  />
                  {checkoutErrors.fullName && (
                    <p className="mt-1 flex items-center gap-1 text-xs font-medium text-[#245B59]">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                      <span>{checkoutErrors.fullName}</span>
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="checkout-phone"
                    className="block text-xs font-semibold text-[#245B59] mb-1.5"
                  >
                    Phone Number <span aria-hidden="true">*</span>
                  </label>
                  <input
                    id="checkout-phone"
                    type="tel"
                    value={checkout.phoneNumber}
                    onChange={(e) =>
                      setCheckout((prev) => ({ ...prev, phoneNumber: e.target.value }))
                    }
                    placeholder="e.g. 0803 123 4567"
                    className="w-full rounded-lg border border-[#245B59]/20 bg-[#FFF9F0] px-3.5 py-2.5 text-sm text-[#245B59] placeholder:text-[#245B59]/45 focus:border-[#245B59] focus:outline-none min-h-[44px]"
                  />
                  {checkoutErrors.phoneNumber && (
                    <p className="mt-1 flex items-center gap-1 text-xs font-medium text-[#245B59]">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                      <span>{checkoutErrors.phoneNumber}</span>
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="checkout-email"
                    className="block text-xs font-semibold text-[#245B59] mb-1.5"
                  >
                    Email Address (Optional, recommended)
                  </label>
                  <input
                    id="checkout-email"
                    type="email"
                    value={checkout.emailAddress}
                    onChange={(e) =>
                      setCheckout((prev) => ({ ...prev, emailAddress: e.target.value }))
                    }
                    placeholder="you@example.com"
                    className="w-full rounded-lg border border-[#245B59]/20 bg-[#FFF9F0] px-3.5 py-2.5 text-sm text-[#245B59] placeholder:text-[#245B59]/45 focus:border-[#245B59] focus:outline-none min-h-[44px]"
                  />
                  {checkoutErrors.emailAddress && (
                    <p className="mt-1 flex items-center gap-1 text-xs font-medium text-[#245B59]">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                      <span>{checkoutErrors.emailAddress}</span>
                    </p>
                  )}
                </div>

                <div>
                  <span className="block text-xs font-semibold text-[#245B59] mb-2">
                    Preferred Fulfilment Method <span aria-hidden="true">*</span>
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {(
                      [
                        'Customer collection',
                        'Delivery to the event location',
                      ] as FulfilmentMethod[]
                    ).map((option) => {
                      const selected = checkout.fulfilmentMethod === option;
                      return (
                        <button
                          key={option}
                          type="button"
                          onClick={() => updateFulfilment(option)}
                          className={`rounded-lg border px-3.5 py-2.5 text-left text-xs font-semibold transition-colors min-h-[44px] cursor-pointer ${
                            selected
                              ? 'border-[#245B59] bg-[#245B59] text-[#FFF9F0]'
                              : 'border-[#245B59]/20 bg-[#FFF9F0] text-[#245B59] hover:border-[#E8C994]'
                          }`}
                        >
                          {option}
                        </button>
                      );
                    })}
                  </div>
                  <p className="mt-1.5 text-[11px] text-[#245B59]/75">
                    Delivery arrangements and any associated fees will be confirmed separately.
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="checkout-location"
                    className="block text-xs font-semibold text-[#245B59] mb-1.5"
                  >
                    Event Location <span aria-hidden="true">*</span>
                  </label>
                  <input
                    id="checkout-location"
                    type="text"
                    value={checkout.eventLocation}
                    onChange={(e) =>
                      setCheckout((prev) => ({ ...prev, eventLocation: e.target.value }))
                    }
                    placeholder="e.g. Lekki Phase 1, Victoria Island, Ikeja, Lagos"
                    className="w-full rounded-lg border border-[#245B59]/20 bg-[#FFF9F0] px-3.5 py-2.5 text-sm text-[#245B59] placeholder:text-[#245B59]/45 focus:border-[#245B59] focus:outline-none min-h-[44px]"
                  />
                  {checkoutErrors.eventLocation && (
                    <p className="mt-1 flex items-center gap-1 text-xs font-medium text-[#245B59]">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                      <span>{checkoutErrors.eventLocation}</span>
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="checkout-instructions"
                    className="block text-xs font-semibold text-[#245B59] mb-1.5"
                  >
                    Additional Instructions (Optional)
                  </label>
                  <textarea
                    id="checkout-instructions"
                    rows={3}
                    value={checkout.additionalInstructions}
                    onChange={(e) =>
                      setCheckout((prev) => ({
                        ...prev,
                        additionalInstructions: e.target.value,
                      }))
                    }
                    placeholder="Event timing, gate access notes, colour preferences, or setup details..."
                    className="w-full rounded-lg border border-[#245B59]/20 bg-[#FFF9F0] px-3.5 py-2.5 text-sm text-[#245B59] placeholder:text-[#245B59]/45 focus:border-[#245B59] focus:outline-none"
                  />
                </div>

                {/* Clear Enquiry Disclaimer */}
                <div className="rounded-lg border border-[#E8C994] bg-[#E8C994]/22 p-3.5 text-xs text-[#245B59] leading-relaxed">
                  <strong>Important:</strong> This is a rental enquiry, not a confirmed
                  reservation. Vvichelae Event Rentals will review your request, confirm
                  availability and communicate the final booking arrangements.
                </div>

                {/* Primary WhatsApp CTA + Netlify Form Submit */}
                <div className="space-y-3 pt-1">
                  <button
                    type="submit"
                    disabled={!isBasketReadyForEnquiry}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#245B59] px-6 py-3.5 text-sm font-bold tracking-wide text-[#FFF9F0] hover:bg-[#245B59]/90 transition-colors disabled:opacity-45 disabled:cursor-not-allowed min-h-[48px] cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4 text-[#E8C994]" aria-hidden="true" />
                    <span>SEND RENTAL ENQUIRY</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleNetlifyFormSubmit}
                    disabled={!isBasketReadyForEnquiry || netlifySubmitting}
                    className="flex w-full items-center justify-center gap-2 rounded-lg border border-[#E8C994] bg-[#E8C994]/25 px-5 py-3 text-xs font-semibold text-[#245B59] hover:bg-[#E8C994]/45 transition-colors disabled:opacity-45 disabled:cursor-not-allowed min-h-[44px] cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>
                      {netlifySubmitting
                        ? 'Submitting Enquiry Form...'
                        : 'Submit Enquiry via Netlify Web Form'}
                    </span>
                  </button>
                </div>
              </form>

              {/* Netlify Status Output */}
              {netlifyStatus && (
                <div
                  role="status"
                  className="rounded-lg border border-[#245B59] bg-[#E8C994]/25 p-4 text-xs leading-relaxed text-[#245B59] flex items-start gap-2.5"
                >
                  {netlifyStatus.type === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
                  ) : netlifyStatus.type === 'preview' ? (
                    <Info className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
                  ) : (
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />
                  )}
                  <span>{netlifyStatus.text}</span>
                </div>
              )}

              {/* Generated WhatsApp Message Preview & Direct Link */}
              {generatedEnquiry && (
                <div className="rounded-xl border border-[#E8C994] bg-[#245B59] p-5 text-[#FFF9F0] space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-serif text-lg font-semibold text-[#E8C994]">
                      WhatsApp Rental Enquiry Ready
                    </h3>
                    <button
                      type="button"
                      onClick={handleCopyMessage}
                      className="inline-flex items-center gap-1 rounded border border-[#E8C994]/45 px-2.5 py-1 text-[11px] font-semibold text-[#E8C994] hover:bg-[#E8C994]/15 cursor-pointer"
                    >
                      {copiedMessage ? (
                        <>
                          <Check className="w-3 h-3" aria-hidden="true" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" aria-hidden="true" />
                          <span>Copy Text</span>
                        </>
                      )}
                    </button>
                  </div>

                  <pre className="max-h-56 overflow-y-auto whitespace-pre-wrap rounded-lg bg-[#FFF9F0]/10 p-3 text-[11px] leading-relaxed text-[#FFF9F0]/95 font-sans">
                    {generatedEnquiry.message}
                  </pre>

                  <a
                    href={generatedEnquiry.whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#E8C994] px-4 py-3 text-xs font-semibold text-[#245B59] hover:bg-[#FFF9F0] transition-colors min-h-[44px]"
                  >
                    <MessageCircle className="w-4 h-4" aria-hidden="true" />
                    <span>Open in WhatsApp ({BUSINESS_INFO.whatsappDisplay})</span>
                  </a>
                </div>
              )}
            </section>
          </div>
        </div>
      )}
    </div>
  );
};
