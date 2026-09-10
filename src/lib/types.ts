/**
 * Domain models for Lala's Cafe.
 *
 * These types are the contract between the UI and the data layer. Swapping the
 * local content source for Supabase (or any other backend) must not require
 * changing a single component — only `src/lib/data-source.ts`.
 */

export type ID = string;

export interface MenuCategory {
  id: ID;
  slug: string;
  name: string;
  description?: string;
  sortOrder: number;
}

export type MoodTag = "energy" | "comfort" | "refreshing" | "sweet" | "savoury";

export interface MenuItem {
  id: ID;
  categoryId: ID;
  name: string;
  description: string;
  /** Price in PKR. `null` means not yet supplied by the cafe. */
  price: number | null;
  imageUrl?: string;
  isAvailable: boolean;
  isFeatured: boolean;
  isBestseller: boolean;
  isNew: boolean;
  moods: MoodTag[];
  sortOrder: number;
  /** True while the item is awaiting real menu data from the cafe. */
  isPlaceholder?: boolean;
}

export interface GalleryImage {
  id: ID;
  url: string;
  alt: string;
  caption?: string;
  tag: "ambience" | "food" | "events";
  sortOrder: number;
}

export interface CafeEvent {
  id: ID;
  title: string;
  description: string;
  startsAt: string | null;
  location?: string;
  imageUrl?: string;
  isPublished: boolean;
}

export interface Offer {
  id: ID;
  title: string;
  description: string;
  terms?: string;
  validUntil: string | null;
  imageUrl?: string;
  isActive: boolean;
}

export interface Reservation {
  name: string;
  phone: string;
  email?: string;
  partySize: number;
  date: string;
  time: string;
  seating?: string;
  notes?: string;
}

export interface ContactMessage {
  name: string;
  phone: string;
  email?: string;
  subject: string;
  message: string;
}

export interface PrivateEventInquiry {
  name: string;
  phone: string;
  eventType: string;
  guests: number;
  date: string;
  details?: string;
}

export interface OpeningHours {
  label: string;
  value: string;
}

export interface SiteSettings {
  cafeName: string;
  tagline: string;
  phone: string;
  whatsapp: string;
  email?: string;
  addressLine?: string;
  city: string;
  mapsUrl?: string;
  logoUrl?: string;
  complaintPhone?: string;
  orderPhones?: string[];
  hours: OpeningHours[];
  socials: { label: string; url: string }[];
}

export interface Faq {
  id: ID;
  question: string;
  answer: string;
  sortOrder: number;
}

export type SubmissionResult =
  | { ok: true }
  | { ok: false; error: string };
