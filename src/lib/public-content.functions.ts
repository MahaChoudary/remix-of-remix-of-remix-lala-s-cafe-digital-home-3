import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import type {
  CafeEvent,
  Faq,
  GalleryImage,
  MenuCategory,
  MenuItem,
  MoodTag,
  Offer,
  SiteSettings,
} from "./types";

export interface PublicContent {
  settings: SiteSettings | null;
  categories: MenuCategory[];
  items: MenuItem[];
  gallery: GalleryImage[];
  events: CafeEvent[];
  offers: Offer[];
  faqs: Faq[];
}

/** Reads every published row the public site renders, in one round trip. */
export const getPublicContent = createServerFn({ method: "GET" }).handler(
  async (): Promise<PublicContent> => {
    const { publicServerClient } = await import("./supabase-public.server");
    const supabase = publicServerClient();

    const [settings, categories, items, gallery, events, offers, faqs] = await Promise.all([
      supabase.from("site_settings").select("*").eq("id", "default").maybeSingle(),
      supabase.from("menu_categories").select("*").order("sort_order"),
      supabase.from("menu_items").select("*").order("sort_order"),
      supabase.from("gallery_images").select("*").order("sort_order"),
      supabase.from("events").select("*").order("sort_order"),
      supabase.from("offers").select("*").order("sort_order"),
      supabase.from("faqs").select("*").order("sort_order"),
    ]);

    const s = settings.data;

    return {
      settings: s
        ? {
            cafeName: s.cafe_name,
            tagline: s.tagline,
            phone: s.phone,
            whatsapp: s.whatsapp,
            email: s.email ?? "",
            addressLine: s.address_line ?? "",
            city: s.city,
            mapsUrl: s.maps_url ?? "",
            logoUrl: s.logo_url ?? "",
            complaintPhone: s.complaint_phone ?? "",
            orderPhones: Array.isArray(s.order_phones) ? (s.order_phones as string[]) : [],
            hours: Array.isArray(s.hours)
              ? (s.hours as { label: string; value: string }[])
              : [],
            socials: Array.isArray(s.socials)
              ? (s.socials as { label: string; url: string }[]).filter((x) => x?.url)
              : [],
          }
        : null,
      categories: (categories.data ?? []).map((c) => ({
        id: c.id,
        slug: c.slug,
        name: c.name,
        description: c.description ?? undefined,
        sortOrder: c.sort_order,
      })),
      items: (items.data ?? []).map((i) => ({
        id: i.id,
        categoryId: i.category_id,
        name: i.name,
        description: i.description,
        price: i.price,
        imageUrl: i.image_url ?? undefined,
        isAvailable: i.is_available,
        isFeatured: i.is_featured,
        isBestseller: i.is_bestseller,
        isNew: i.is_new,
        moods: (i.moods ?? []) as MoodTag[],
        sortOrder: i.sort_order,
      })),
      gallery: (gallery.data ?? []).map((g) => ({
        id: g.id,
        url: g.url,
        alt: g.alt,
        caption: g.caption ?? undefined,
        tag: (g.tag as GalleryImage["tag"]) ?? "ambience",
        sortOrder: g.sort_order,
      })),
      events: (events.data ?? []).map((e) => ({
        id: e.id,
        title: e.title,
        description: e.description,
        startsAt: e.starts_at,
        location: e.location ?? undefined,
        imageUrl: e.image_url ?? undefined,
        isPublished: e.is_published,
      })),
      offers: (offers.data ?? []).map((o) => ({
        id: o.id,
        title: o.title,
        description: o.description,
        terms: o.terms ?? undefined,
        validUntil: o.valid_until,
        imageUrl: o.image_url ?? undefined,
        isActive: o.is_active,
      })),
      faqs: (faqs.data ?? []).map((f) => ({
        id: f.id,
        question: f.question,
        answer: f.answer,
        sortOrder: f.sort_order,
      })),
    };
  },
);

const reservationSchema = z.object({
  name: z.string().trim().min(2).max(80),
  phone: z.string().trim().min(7).max(30),
  email: z.string().trim().email().max(120).optional().or(z.literal("")),
  partySize: z.number().int().min(1).max(200),
  date: z.string().min(4),
  time: z.string().min(3),
  seating: z.string().max(60).optional(),
  notes: z.string().max(1000).optional(),
});

const contactSchema = z.object({
  name: z.string().trim().min(2).max(80),
  phone: z.string().trim().min(7).max(30),
  email: z.string().trim().email().max(120).optional().or(z.literal("")),
  subject: z.string().trim().min(2).max(120),
  message: z.string().trim().min(5).max(2000),
});

const inquirySchema = z.object({
  name: z.string().trim().min(2).max(80),
  phone: z.string().trim().min(7).max(30),
  email: z.string().trim().email().max(120).optional().or(z.literal("")),
  eventType: z.string().trim().min(2).max(80),
  guests: z.number().int().min(1).max(1000),
  date: z.string().min(4),
  details: z.string().max(2000).optional(),
});

export const submitReservation = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => reservationSchema.parse(data))
  .handler(async ({ data }) => {
    const { publicServerClient } = await import("./supabase-public.server");
    const { error } = await publicServerClient().from("reservations").insert({
      name: data.name,
      phone: data.phone,
      email: data.email || null,
      party_size: data.partySize,
      reserve_date: data.date,
      reserve_time: data.time,
      seating: data.seating || null,
      notes: data.notes || null,
    });
    if (error) {
      console.error("reservation insert failed", error.message);
      return { ok: false as const, error: "SAVE_FAILED" };
    }
    return { ok: true as const };
  });

export const submitContactMessage = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => contactSchema.parse(data))
  .handler(async ({ data }) => {
    const { publicServerClient } = await import("./supabase-public.server");
    const { error } = await publicServerClient().from("contact_messages").insert({
      name: data.name,
      phone: data.phone,
      email: data.email || null,
      subject: data.subject,
      message: data.message,
    });
    if (error) {
      console.error("contact insert failed", error.message);
      return { ok: false as const, error: "SAVE_FAILED" };
    }
    return { ok: true as const };
  });

export const submitPrivateEventInquiry = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => inquirySchema.parse(data))
  .handler(async ({ data }) => {
    const { publicServerClient } = await import("./supabase-public.server");
    const { error } = await publicServerClient().from("private_event_inquiries").insert({
      name: data.name,
      phone: data.phone,
      email: data.email || null,
      event_type: data.eventType,
      guests: data.guests,
      event_date: data.date,
      details: data.details || null,
    });
    if (error) {
      console.error("private event insert failed", error.message);
      return { ok: false as const, error: "SAVE_FAILED" };
    }
    return { ok: true as const };
  });
