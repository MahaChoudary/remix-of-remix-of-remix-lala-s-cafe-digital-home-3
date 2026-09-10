import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CalendarCheck } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { Reveal } from "@/components/motion/Reveal";
import { Field, fieldClass } from "@/components/forms/Field";
import { whatsappUrl } from "@/components/forms/whatsapp";
import { luxButton, LuxButton } from "@/components/ui-kit/Button";
import { dataSource } from "@/lib/data-source";
import { photos } from "@/lib/site-content";

export const Route = createFileRoute("/reservations")({
  head: () => ({
    meta: [
      { title: "Reserve a Table — Lala's Cafe Daska" },
      {
        name: "description",
        content:
          "Request a table at Lala's Cafe in Daska — indoor booths, private cabanas and rooftop seating. We confirm every request personally.",
      },
      { property: "og:title", content: "Reserve a Table at Lala's Cafe" },
      { property: "og:description", content: "Send a table request for indoor, cabana or rooftop seating." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ReservationsPage,
});

function ReservationsPage() {
  const [status, setStatus] = useState<"idle" | "sending">("idle");
  const [sent, setSent] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);
    const data = {
      name: String(fd.get("name") ?? ""),
      phone: String(fd.get("phone") ?? ""),
      partySize: Number(fd.get("partySize") ?? 2),
      date: String(fd.get("date") ?? ""),
      time: String(fd.get("time") ?? ""),
      seating: String(fd.get("seating") ?? ""),
      notes: String(fd.get("notes") ?? ""),
    };
    if (!data.name || !data.phone || !data.date || !data.time) {
      setError("Please fill in your name, phone, date and time.");
      return;
    }
    setStatus("sending");
    const result = await dataSource.submitReservation(data);
    setStatus("idle");
    if (result.ok) {
      setSent("Request received — we'll confirm shortly.");
      return;
    }
    const url = whatsappUrl([
      "Table request for Lala's Cafe",
      `Name: ${data.name}`,
      `Phone: ${data.phone}`,
      `Guests: ${data.partySize}`,
      `Date: ${data.date} at ${data.time}`,
      data.seating && `Seating: ${data.seating}`,
      data.notes && `Notes: ${data.notes}`,
    ]);
    window.open(url, "_blank", "noopener");
    setSent("We've opened WhatsApp with your request so the team can confirm it directly.");
  }

  return (
    <>
      <PageHero
        eyebrow="Reservations"
        title="Save your spot under the lights."
        intro="Tell us when you're coming and where you'd like to sit. Every request is confirmed by the team."
        image={photos.cabana}
        imageAlt="Private white cabana seating at Lala's Cafe"
      />

      <section className="container-lux py-20">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <Reveal>
            <form onSubmit={onSubmit} className="surface-panel grid gap-5 rounded-3xl p-8 sm:p-10">
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Name" htmlFor="name">
                  <input id="name" name="name" className={fieldClass} placeholder="Your name" required />
                </Field>
                <Field label="Phone" htmlFor="phone">
                  <input id="phone" name="phone" type="tel" className={fieldClass} placeholder="03xx xxxxxxx" required />
                </Field>
                <Field label="Guests" htmlFor="partySize">
                  <input id="partySize" name="partySize" type="number" min={1} max={40} defaultValue={2} className={fieldClass} />
                </Field>
                <Field label="Seating" htmlFor="seating">
                  <select id="seating" name="seating" className={fieldClass} defaultValue="Any">
                    <option>Any</option>
                    <option>Indoor lounge</option>
                    <option>Private cabana</option>
                    <option>Rooftop</option>
                  </select>
                </Field>
                <Field label="Date" htmlFor="date">
                  <input id="date" name="date" type="date" className={fieldClass} required />
                </Field>
                <Field label="Time" htmlFor="time">
                  <input id="time" name="time" type="time" className={fieldClass} required />
                </Field>
              </div>
              <Field label="Anything else?" htmlFor="notes" hint="Birthday, high chair, big group — tell us here.">
                <textarea id="notes" name="notes" rows={4} className={fieldClass} />
              </Field>
              {error && (
                <p role="alert" className="text-sm text-destructive">
                  {error}
                </p>
              )}
              {sent && <p className="text-sm text-primary">{sent}</p>}
              <div>
                <LuxButton type="submit" disabled={status === "sending"}>
                  {status === "sending" ? "Sending…" : "Send request"}
                </LuxButton>
              </div>
            </form>
          </Reveal>

          <Reveal delay={0.1}>
            <aside className="surface-panel h-full rounded-3xl p-8 sm:p-10">
              <CalendarCheck className="text-primary" size={26} />
              <h2 className="mt-5 text-2xl">How it works</h2>
              <ol className="mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground">
                <li>1. Send your request with the date, time and party size.</li>
                <li>2. The team checks availability for that seating area.</li>
                <li>3. You get a confirmation on the number you gave us.</li>
              </ol>
              <p className="mt-6 text-sm text-muted-foreground">
                A request is not a confirmed booking until the cafe replies.
              </p>
              <a href="tel:+923367999122" className={luxButton("outline", "mt-6")}>
                Or call us
              </a>
            </aside>
          </Reveal>
        </div>
      </section>
    </>
  );
}
