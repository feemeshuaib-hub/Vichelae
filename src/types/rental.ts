export type EquipmentCategory =
  | 'Seating & Furniture'
  | 'Tents & Canopies'
  | 'Fabrics & Decoration'
  | 'Event Setup & Accessories'
  | 'Catering & Serving Equipment';

export interface EquipmentItem {
  id: string;
  slug: string;
  name: string;
  category: EquipmentCategory;
  dailyPrice: number;
  availableStock: number;
  shortDescription: string;
  fullDescription: string;
  rentalInfo: string[];
  specifications: { label: string; value: string }[];
  image: string;
  galleryImages: { src: string; caption: string }[];
  featured?: boolean;
}

export interface BasketItem {
  productId: string;
  quantity: number;
}

export interface RentalDates {
  collectionDate: string;
  returnDate: string;
}

export type FulfilmentMethod =
  | 'Customer collection'
  | 'Delivery to the event location';

export interface CheckoutFormData {
  fullName: string;
  phoneNumber: string;
  emailAddress: string;
  fulfilmentMethod: FulfilmentMethod;
  eventLocation: string;
  additionalInstructions: string;
}

export interface CategoryMeta {
  name: EquipmentCategory;
  slug: string;
  tagline: string;
  description: string;
  image: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  featuredOnHome?: boolean;
}

export interface SampleReview {
  id: string;
  customerName: string;
  serviceRented: string;
  quote: string;
}
