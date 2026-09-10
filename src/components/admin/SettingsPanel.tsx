import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { LuxButton } from "@/components/ui-kit/Button";
import { Field, fieldClass } from "@/components/forms/Field";
import { supabase } from "@/integrations/supabase/client";
import { uploadImage } from "@/lib/admin";

type HourRow = Record<string, string>;
type SocialRow = Record<string, string>;

interface SettingsForm {
  cafe_name: string;
  tagline: string;
  phone: string;
  whatsapp: string;
  email: string;
  address_line: string;
  city: string;
  maps_url: string;
  complaint_phone: string;
  logo_url: string;
  order_phones: string[];
  hours: HourRow[];
  socials: SocialRow[];
}

const blank: SettingsForm = {
  cafe_name: "",
  tagline: "",
  phone: "",
  whatsapp: "",
  email: "",
  address_line: "",
  city: "",
  maps_url: "",
  complaint_phone: "",
  logo_url: "",
  order_phones: [],
  hours: [],
  socials: [],
};

export function SettingsPanel() {
  const qc = useQueryClient();
  const [form, setForm] = useState<SettingsForm>(blank);
  const [saved, setSaved] = useState(false);
  const [uploading, setUploading] = useState(false);

  const { data, isPending, error } = useQuery({
    queryKey: ["admin", "settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_settings")
        .select("*")
        .eq("id", "default")
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    if (!data) return;
    setForm({
      cafe_name: data.cafe_name ?? "",
      tagline: data.tagline ?? "",
      phone: data.phone ?? "",
      whatsapp: data.whatsapp ?? "",
      email: data.email ?? "",
      address_line: data.address_line ?? "",
      city: data.city ?? "",
      maps_url: data.maps_url ?? "",
      complaint_phone: data.complaint_phone ?? "",
      logo_url: data.logo_url ?? "",
      order_phones: Array.isArray(data.order_phones) ? (data.order_phones as string[]) : [],
      hours: Array.isArray(data.hours) ? (data.hours as unknown as HourRow[]) : [],
      socials: Array.isArray(data.socials) ? (data.socials as unknown as SocialRow[]) : [],
    });
  }, [data]);

  const save = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("site_settings")
        .upsert({ id: "default", ...form } as never);
      if (error) throw error;
    },
    onSuccess: () => {
      setSaved(true);
      qc.invalidateQueries({ queryKey: ["admin", "settings"] });
      qc.invalidateQueries({ queryKey: ["public-content"] });
      setTimeout(() => setSaved(false), 3000);
    },
  });

  if (isPending) return <p className="text-muted-foreground">Loading…</p>;
  if (error) return <p className="text-destructive">Couldn't load the cafe details.</p>;

  const set = <K extends keyof SettingsForm>(k: K, v: SettingsForm[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        save.mutate();
      }}
      className="surface-panel grid gap-6 rounded-3xl p-6 sm:p-8"
    >
      <h2 className="text-2xl">Cafe details</h2>
      <p className="-mt-3 text-sm text-muted-foreground">
        These appear across the whole website — header, footer and contact pages.
      </p>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Cafe name" htmlFor="cafe_name">
          <input
            id="cafe_name"
            className={fieldClass}
            value={form.cafe_name}
            onChange={(e) => set("cafe_name", e.target.value)}
          />
        </Field>
        <Field label="Tagline" htmlFor="tagline">
          <input
            id="tagline"
            className={fieldClass}
            value={form.tagline}
            onChange={(e) => set("tagline", e.target.value)}
          />
        </Field>
        <Field label="Main phone" htmlFor="phone">
          <input
            id="phone"
            className={fieldClass}
            value={form.phone}
            onChange={(e) => set("phone", e.target.value)}
          />
        </Field>
        <Field label="WhatsApp number" htmlFor="whatsapp" hint="Digits only, e.g. 923414067238">
          <input
            id="whatsapp"
            className={fieldClass}
            value={form.whatsapp}
            onChange={(e) => set("whatsapp", e.target.value)}
          />
        </Field>
        <Field label="Complaints phone" htmlFor="complaint_phone">
          <input
            id="complaint_phone"
            className={fieldClass}
            value={form.complaint_phone}
            onChange={(e) => set("complaint_phone", e.target.value)}
          />
        </Field>
        <Field label="Email" htmlFor="email">
          <input
            id="email"
            type="email"
            className={fieldClass}
            value={form.email}
            onChange={(e) => set("email", e.target.value)}
          />
        </Field>
        <Field label="Street address" htmlFor="address_line">
          <input
            id="address_line"
            className={fieldClass}
            value={form.address_line}
            onChange={(e) => set("address_line", e.target.value)}
          />
        </Field>
        <Field label="Town / city" htmlFor="city">
          <input
            id="city"
            className={fieldClass}
            value={form.city}
            onChange={(e) => set("city", e.target.value)}
          />
        </Field>
        <Field label="Google Maps link" htmlFor="maps_url" hint="Paste the link people can tap for directions">
          <input
            id="maps_url"
            className={fieldClass}
            value={form.maps_url}
            onChange={(e) => set("maps_url", e.target.value)}
          />
        </Field>
        <Field
          label="Ordering phone numbers"
          htmlFor="order_phones"
          hint="Separate several numbers with a comma"
        >
          <input
            id="order_phones"
            className={fieldClass}
            value={form.order_phones.join(", ")}
            onChange={(e) =>
              set(
                "order_phones",
                e.target.value
                  .split(",")
                  .map((s) => s.trim())
                  .filter(Boolean),
              )
            }
          />
        </Field>
      </div>

      <div>
        <p className="mb-2 text-xs tracking-[0.16em] text-muted-foreground uppercase">Logo</p>
        {form.logo_url && (
          <img
            src={form.logo_url}
            alt="Current logo"
            className="mb-3 h-20 w-20 rounded-full object-cover"
          />
        )}
        <input
          type="file"
          accept="image/*"
          aria-label="Upload a new logo"
          className={fieldClass}
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            setUploading(true);
            try {
              set("logo_url", await uploadImage(file));
            } finally {
              setUploading(false);
            }
          }}
        />
        {uploading && <p className="mt-2 text-xs text-muted-foreground">Uploading…</p>}
      </div>

      <RowList
        title="Opening hours"
        rows={form.hours}
        labelA="Label (e.g. Breakfast)"
        labelB="Times"
        keyA="label"
        keyB="value"
        onChange={(rows) => set("hours", rows as HourRow[])}
      />

      <RowList
        title="Social links"
        rows={form.socials}
        labelA="Name (e.g. Facebook)"
        labelB="Link"
        keyA="label"
        keyB="url"
        onChange={(rows) => set("socials", rows as SocialRow[])}
      />

      {save.isError && (
        <p role="alert" className="text-sm text-destructive">
          Couldn't save. Please try again.
        </p>
      )}
      {saved && <p className="text-sm text-primary">Saved — the website is updated.</p>}

      <div>
        <LuxButton type="submit" disabled={save.isPending}>
          {save.isPending ? "Saving…" : "Save changes"}
        </LuxButton>
      </div>
    </form>
  );
}

function RowList({
  title,
  rows,
  labelA,
  labelB,
  keyA,
  keyB,
  onChange,
}: {
  title: string;
  rows: Record<string, string>[];
  labelA: string;
  labelB: string;
  keyA: string;
  keyB: string;
  onChange: (rows: Record<string, string>[]) => void;
}) {
  return (
    <fieldset>
      <legend className="mb-3 text-xs tracking-[0.16em] text-muted-foreground uppercase">
        {title}
      </legend>
      <div className="grid gap-3">
        {rows.map((row, i) => (
          <div key={i} className="grid gap-3 sm:grid-cols-[1fr_1.5fr_auto]">
            <input
              aria-label={`${title} — ${labelA}`}
              placeholder={labelA}
              className={fieldClass}
              value={row[keyA] ?? ""}
              onChange={(e) => {
                const next = [...rows];
                next[i] = { ...row, [keyA]: e.target.value };
                onChange(next);
              }}
            />
            <input
              aria-label={`${title} — ${labelB}`}
              placeholder={labelB}
              className={fieldClass}
              value={row[keyB] ?? ""}
              onChange={(e) => {
                const next = [...rows];
                next[i] = { ...row, [keyB]: e.target.value };
                onChange(next);
              }}
            />
            <LuxButton
              type="button"
              variant="ghost"
              onClick={() => onChange(rows.filter((_, x) => x !== i))}
            >
              Remove
            </LuxButton>
          </div>
        ))}
      </div>
      <LuxButton
        type="button"
        variant="outline"
        className="mt-3"
        onClick={() => onChange([...rows, { [keyA]: "", [keyB]: "" }])}
      >
        Add row
      </LuxButton>
    </fieldset>
  );
}
