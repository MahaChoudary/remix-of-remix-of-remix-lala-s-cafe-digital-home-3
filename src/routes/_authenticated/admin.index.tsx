import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { LuxButton } from "@/components/ui-kit/Button";
import { Field, fieldClass } from "@/components/forms/Field";
import { supabase } from "@/integrations/supabase/client";
import {
  deleteRow,
  listRows,
  saveRow,
  sections,
  uploadImage,
  type FieldDef,
  type Row,
  type Section,
} from "@/lib/admin";
import { SettingsPanel } from "@/components/admin/SettingsPanel";

export const Route = createFileRoute("/_authenticated/admin/")({
  head: () => ({
    meta: [
      { title: "Manage the site — Lala's Cafe" },
      { name: "description", content: "Update the Lala's Cafe menu, gallery, events and offers." },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Manage the site — Lala's Cafe" },
      { property: "og:description", content: "Private control panel for the Lala's Cafe team." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AdminDashboard,
});

function AdminDashboard() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<string>("settings");
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    supabase.rpc("claim_admin").then(({ data, error }) => {
      setIsAdmin(error ? false : Boolean(data));
    });
  }, []);

  const section = sections.find((s) => s.id === tab);

  if (isAdmin === null) {
    return <p className="container-lux py-32 text-muted-foreground">Checking your access…</p>;
  }

  if (!isAdmin) {
    return (
      <section className="container-lux py-32">
        <h1 className="text-3xl">This account can't manage the site</h1>
        <p className="mt-4 max-w-prose text-muted-foreground">
          Ask whoever set the site up to grant your account access, then sign in again.
        </p>
        <LuxButton
          variant="outline"
          className="mt-8"
          onClick={async () => {
            await supabase.auth.signOut();
            navigate({ to: "/admin/login", replace: true });
          }}
        >
          Sign out
        </LuxButton>
      </section>
    );
  }

  return (
    <section className="container-lux py-24">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-eyebrow">Control panel</p>
          <h1 className="mt-2 text-4xl">Manage Lala's Cafe</h1>
        </div>
        <LuxButton
          variant="outline"
          onClick={async () => {
            await supabase.auth.signOut();
            navigate({ to: "/admin/login", replace: true });
          }}
        >
          Sign out
        </LuxButton>
      </div>

      <nav className="mt-10 flex flex-wrap gap-2">
        {[{ id: "settings", label: "Cafe details" }, ...sections].map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setTab(s.id)}
            className={`rounded-full border px-4 py-2 text-sm transition-colors ${
              tab === s.id
                ? "border-primary bg-primary/15 text-primary"
                : "border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            {s.label}
          </button>
        ))}
      </nav>

      <div className="mt-10">
        {tab === "settings" ? <SettingsPanel /> : section ? <SectionPanel section={section} /> : null}
      </div>
    </section>
  );
}

function SectionPanel({ section }: { section: Section }) {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<Row | "new" | null>(null);

  const { data, isPending, error } = useQuery({
    queryKey: ["admin", section.id],
    queryFn: () => listRows(section),
  });

  const remove = useMutation({
    mutationFn: (id: string) => deleteRow(section, id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", section.id] });
      qc.invalidateQueries({ queryKey: ["public-content"] });
    },
  });

  if (isPending) return <p className="text-muted-foreground">Loading…</p>;
  if (error) return <p className="text-destructive">Couldn't load this list. Try again.</p>;

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-2xl">{section.label}</h2>
        {!section.readOnly && (
          <LuxButton onClick={() => setEditing("new")}>Add new</LuxButton>
        )}
      </div>

      {editing && (
        <RowEditor
          section={section}
          row={editing === "new" ? {} : editing}
          onClose={() => setEditing(null)}
        />
      )}

      <ul className="mt-8 grid gap-3">
        {(data ?? []).length === 0 && (
          <li className="text-muted-foreground">Nothing here yet.</li>
        )}
        {(data ?? []).map((row) => (
          <li
            key={String(row['id'])}
            className="surface-panel flex flex-wrap items-center justify-between gap-4 rounded-2xl p-5"
          >
            <div className="min-w-0">
              <p className="truncate font-semibold">{String(row[section.titleKey] ?? "Untitled")}</p>
              {section.subtitleKey && (
                <p className="truncate text-sm text-muted-foreground">
                  {String(row[section.subtitleKey] ?? "")}
                </p>
              )}
              {section.readOnly && (
                <p className="mt-2 text-xs text-muted-foreground">
                  {Object.entries(row)
                    .filter(([k, v]) => !["id"].includes(k) && v !== null && v !== "")
                    .map(([k, v]) => `${k.replace(/_/g, " ")}: ${String(v)}`)
                    .join(" · ")}
                </p>
              )}
            </div>
            <div className="flex gap-2">
              <LuxButton variant="outline" onClick={() => setEditing(row)}>
                Edit
              </LuxButton>
              <LuxButton
                variant="ghost"
                onClick={() => {
                  if (confirm("Delete this permanently?")) remove.mutate(String(row['id']));
                }}
              >
                Delete
              </LuxButton>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function RowEditor({
  section,
  row,
  onClose,
}: {
  section: Section;
  row: Row;
  onClose: () => void;
}) {
  const qc = useQueryClient();
  const [draft, setDraft] = useState<Row>({ ...row });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isNew = row['id'] === undefined;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const payload: Row = {};
      for (const f of section.fields) {
        if (f.key === "id" && !isNew) continue;
        payload[f.key] = draft[f.key] ?? defaultFor(f);
      }
      await saveRow(section, payload, isNew ? null : String(row['id']));
      qc.invalidateQueries({ queryKey: ["admin", section.id] });
      qc.invalidateQueries({ queryKey: ["public-content"] });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't save that.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="surface-panel mt-6 grid gap-5 rounded-3xl p-6 sm:p-8">
      <h3 className="text-xl">{isNew ? `New ${section.label.toLowerCase()}` : "Edit"}</h3>
      {section.fields.map((f) => (
        <FieldInput
          key={f.key}
          field={f}
          value={draft[f.key]}
          onChange={(v) => setDraft((d) => ({ ...d, [f.key]: v }))}
        />
      ))}
      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
      <div className="flex gap-3">
        <LuxButton type="submit" disabled={busy}>
          {busy ? "Saving…" : "Save"}
        </LuxButton>
        <LuxButton type="button" variant="outline" onClick={onClose}>
          Cancel
        </LuxButton>
      </div>
    </form>
  );
}

function defaultFor(f: FieldDef) {
  if (f.type === "boolean") return false;
  if (f.type === "number") return null;
  if (f.type === "tags") return [];
  return null;
}

export function FieldInput({
  field,
  value,
  onChange,
}: {
  field: FieldDef;
  value: unknown;
  onChange: (v: unknown) => void;
}) {
  const id = `f-${field.key}`;
  const [uploading, setUploading] = useState(false);

  if (field.type === "boolean") {
    return (
      <label htmlFor={id} className="flex items-center gap-3 text-sm">
        <input
          id={id}
          type="checkbox"
          checked={Boolean(value)}
          onChange={(e) => onChange(e.target.checked)}
          className="size-4 accent-[var(--primary)]"
        />
        {field.label}
      </label>
    );
  }

  if (field.type === "image") {
    const url = typeof value === "string" ? value : "";
    return (
      <Field label={field.label} htmlFor={id} hint={field.help ?? ""}>
        {url && (
          <img src={url} alt="" className="mb-3 h-32 w-full rounded-xl object-cover" loading="lazy" />
        )}
        <input
          id={id}
          type="file"
          accept="image/*"
          className={fieldClass}
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            setUploading(true);
            try {
              onChange(await uploadImage(file));
            } finally {
              setUploading(false);
            }
          }}
        />
        {uploading && <p className="mt-2 text-xs text-muted-foreground">Uploading…</p>}
      </Field>
    );
  }

  if (field.type === "tags") {
    const list = Array.isArray(value) ? (value as string[]) : [];
    return (
      <Field label={field.label} htmlFor={id}>
        <div className="flex flex-wrap gap-2">
          {(field.options ?? []).map((opt) => {
            const on = list.includes(opt);
            return (
              <button
                key={opt}
                type="button"
                onClick={() => onChange(on ? list.filter((x) => x !== opt) : [...list, opt])}
                className={`rounded-full border px-3 py-1.5 text-xs capitalize ${
                  on ? "border-primary bg-primary/15 text-primary" : "border-border text-muted-foreground"
                }`}
              >
                {opt}
              </button>
            );
          })}
        </div>
      </Field>
    );
  }

  if (field.type === "textarea") {
    return (
      <Field label={field.label} htmlFor={id} hint={field.help ?? ""}>
        <textarea
          id={id}
          rows={3}
          className={fieldClass}
          value={typeof value === "string" ? value : ""}
          onChange={(e) => onChange(e.target.value)}
        />
      </Field>
    );
  }

  return (
    <Field label={field.label} htmlFor={id} hint={field.help ?? ""}>
      <input
        id={id}
        type={field.type === "number" ? "number" : field.type === "date" ? "date" : "text"}
        className={fieldClass}
        value={value === null || value === undefined ? "" : String(value)}
        onChange={(e) => {
          const v = e.target.value;
          onChange(field.type === "number" ? (v === "" ? null : Number(v)) : v === "" ? null : v);
        }}
      />
    </Field>
  );
}
