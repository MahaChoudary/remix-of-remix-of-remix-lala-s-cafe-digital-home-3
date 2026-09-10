import { supabase } from "@/integrations/supabase/client";

export const BUCKET = "site-images";

/** Uploads an image and returns a long-lived URL the public site can render. */
export async function uploadImage(file: File): Promise<string> {
  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const path = `${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: "31536000",
    upsert: false,
  });
  if (error) throw error;

  const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(path);
  // Private buckets need a signed URL; public buckets serve the plain URL.
  const signed = await supabase.storage.from(BUCKET).createSignedUrl(path, 60 * 60 * 24 * 3650);
  return signed.data?.signedUrl ?? pub.publicUrl;
}

export async function deleteImage(url: string) {
  const match = url.match(new RegExp(`${BUCKET}/([^?]+)`));
  if (!match) return;
  await supabase.storage.from(BUCKET).remove([decodeURIComponent(match[1]!)]);
}

export type FieldType = "text" | "textarea" | "number" | "boolean" | "date" | "image" | "tags";

export interface FieldDef {
  key: string;
  label: string;
  type: FieldType;
  required?: boolean;
  options?: string[];
  help?: string;
}

export interface Section {
  id: string;
  label: string;
  table:
    | "menu_categories"
    | "menu_items"
    | "gallery_images"
    | "events"
    | "offers"
    | "faqs"
    | "reservations"
    | "contact_messages"
    | "private_event_inquiries";
  orderBy: string;
  ascending?: boolean;
  readOnly?: boolean;
  titleKey: string;
  subtitleKey?: string;
  fields: FieldDef[];
}

const MOODS = ["energy", "comfort", "refreshing", "sweet", "savoury"];

export const sections: Section[] = [
  {
    id: "categories",
    label: "Menu sections",
    table: "menu_categories",
    orderBy: "sort_order",
    titleKey: "name",
    subtitleKey: "description",
    fields: [
      { key: "id", label: "ID (lowercase, no spaces)", type: "text", required: true },
      { key: "slug", label: "Slug", type: "text", required: true },
      { key: "name", label: "Name", type: "text", required: true },
      { key: "description", label: "Description", type: "textarea" },
      { key: "sort_order", label: "Order", type: "number" },
      { key: "is_published", label: "Show on the site", type: "boolean" },
    ],
  },
  {
    id: "items",
    label: "Dishes & drinks",
    table: "menu_items",
    orderBy: "sort_order",
    titleKey: "name",
    subtitleKey: "description",
    fields: [
      { key: "category_id", label: "Menu section ID", type: "text", required: true },
      { key: "name", label: "Name", type: "text", required: true },
      { key: "description", label: "Description", type: "textarea" },
      { key: "price", label: "Price (Rs) — leave blank for “Ask us”", type: "number" },
      { key: "image_url", label: "Photo", type: "image" },
      { key: "is_available", label: "Available today", type: "boolean" },
      { key: "is_featured", label: "Signature", type: "boolean" },
      { key: "is_bestseller", label: "Bestseller", type: "boolean" },
      { key: "is_new", label: "New", type: "boolean" },
      { key: "is_published", label: "Show on the site", type: "boolean" },
      { key: "moods", label: "Moods", type: "tags", options: MOODS },
      { key: "sort_order", label: "Order", type: "number" },
    ],
  },
  {
    id: "gallery",
    label: "Gallery",
    table: "gallery_images",
    orderBy: "sort_order",
    titleKey: "caption",
    subtitleKey: "alt",
    fields: [
      { key: "url", label: "Photo", type: "image", required: true },
      { key: "alt", label: "Description for screen readers", type: "text", required: true },
      { key: "caption", label: "Caption", type: "text" },
      { key: "tag", label: "Tag (ambience / food / events)", type: "text" },
      { key: "sort_order", label: "Order", type: "number" },
      { key: "is_published", label: "Show on the site", type: "boolean" },
    ],
  },
  {
    id: "events",
    label: "Events",
    table: "events",
    orderBy: "sort_order",
    titleKey: "title",
    subtitleKey: "description",
    fields: [
      { key: "title", label: "Title", type: "text", required: true },
      { key: "description", label: "Description", type: "textarea" },
      { key: "starts_at", label: "Starts at", type: "text", help: "e.g. 2026-10-05 20:00" },
      { key: "location", label: "Where", type: "text" },
      { key: "image_url", label: "Photo", type: "image" },
      { key: "sort_order", label: "Order", type: "number" },
      { key: "is_published", label: "Show on the site", type: "boolean" },
    ],
  },
  {
    id: "offers",
    label: "Offers",
    table: "offers",
    orderBy: "sort_order",
    titleKey: "title",
    subtitleKey: "description",
    fields: [
      { key: "title", label: "Title", type: "text", required: true },
      { key: "description", label: "Description", type: "textarea" },
      { key: "terms", label: "Terms", type: "textarea" },
      { key: "valid_until", label: "Valid until", type: "date" },
      { key: "image_url", label: "Photo", type: "image" },
      { key: "sort_order", label: "Order", type: "number" },
      { key: "is_active", label: "Show on the site", type: "boolean" },
    ],
  },
  {
    id: "faqs",
    label: "FAQs",
    table: "faqs",
    orderBy: "sort_order",
    titleKey: "question",
    subtitleKey: "answer",
    fields: [
      { key: "question", label: "Question", type: "text", required: true },
      { key: "answer", label: "Answer", type: "textarea", required: true },
      { key: "sort_order", label: "Order", type: "number" },
      { key: "is_published", label: "Show on the site", type: "boolean" },
    ],
  },
  {
    id: "reservations",
    label: "Table requests",
    table: "reservations",
    orderBy: "created_at",
    ascending: false,
    readOnly: true,
    titleKey: "name",
    subtitleKey: "phone",
    fields: [
      { key: "status", label: "Status", type: "text" },
      { key: "notes", label: "Notes", type: "textarea" },
    ],
  },
  {
    id: "messages",
    label: "Messages",
    table: "contact_messages",
    orderBy: "created_at",
    ascending: false,
    readOnly: true,
    titleKey: "name",
    subtitleKey: "subject",
    fields: [
      { key: "status", label: "Status", type: "text" },
    ],
  },
  {
    id: "inquiries",
    label: "Private events",
    table: "private_event_inquiries",
    orderBy: "created_at",
    ascending: false,
    readOnly: true,
    titleKey: "name",
    subtitleKey: "event_type",
    fields: [
      { key: "status", label: "Status", type: "text" },
    ],
  },
];

export type Row = Record<string, unknown>;

export async function listRows(section: Section): Promise<Row[]> {
  const { data, error } = await supabase
    .from(section.table)
    .select("*")
    .order(section.orderBy, { ascending: section.ascending ?? true });
  if (error) throw error;
  return (data ?? []) as Row[];
}

export async function saveRow(section: Section, row: Row, id: string | null) {
  if (id === null) {
    const { error } = await supabase.from(section.table).insert(row as never);
    if (error) throw error;
  } else {
    const { error } = await supabase
      .from(section.table)
      .update(row as never)
      .eq("id", id);
    if (error) throw error;
  }
}

export async function deleteRow(section: Section, id: string) {
  const { error } = await supabase.from(section.table).delete().eq("id", id);
  if (error) throw error;
}
