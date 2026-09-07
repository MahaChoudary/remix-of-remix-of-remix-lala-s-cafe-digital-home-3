import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CakeSlice, PartyPopper, Users } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { Reveal } from "@/components/motion/Reveal";
import { Field, fieldClass } from "@/components/forms/Field";
import { whatsappUrl } from "@/components/forms/whatsapp";
import { LuxButton } from "@/components/ui-kit/Button";
import { dataSource } from "@/lib/data-source";
import { photos } from "@/lib/site-content";

export const Route = createFileRoute("/private-events")({
  head: () => ({
    meta: [
      { title: "Private Events & Celebrations — Lala's Cafe Daska" },
      {
        name: "description",
        content:
          "Host a birthday, family dinner or private gathering at Lala's Cafe in Daska — cabanas, courtyard pergola and the star-light terrace.",
      },
      { property: "og:title", content: "Private Events at Lala's Cafe" },
      {
        property: "og:description",
        content: "Cabanas, courtyard and terrace spaces for birthdays and private gatherings in Daska.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PrivateEventsPage,
});

const spaces = [
  {
    icon: Users,
    title: "Private cabanas",
    body: "Slatted white cabanas with neon trim and hanging plants — closed-in enough for a small group to have the evening to themselves.",
  },
  {
    icon: PartyPopper,
    title: "Courtyard pergola",
    body: "The colourful pergola bench beside the calligraphy wall. Open air, plenty of room to move around, and the best backdrop for photos.",
  },
  {
    icon: CakeSlice,
    title: "Star-light terrace",
    body: "The strung terrace walkway and rooftop seating — our largest space, and the one guests ask for on birthdays.",
  },
];

const eventTypes = ["Birthday", "Family gathering", "Friends' get-together", "Corporate / team dinner", "Something else"];

function PrivateEventsPage() {
  const [status, setStatus] = useState<"idle" | "sending">("idle");
  const [sent, setSent] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);
    const data = {
      name: String(fd.get("name") ?? "").trim(),
      phone: String(fd.get("phone") ?? "").trim(),
      eventType: String(fd.get("eventType") ?? eventTypes[0]),
      guests: Number(fd.get("guests") ?? 0),
      date: String(fd.get("date") ?? ""),
      details: String(fd.get("details") ?? "").trim(),
    };
    if (!data.name || !data.phone || !data.date || !data.guests) {
      setError("Please add your name, phone, a date and roughly how many guests.");
      return;
    }
    setStatus("sending");
    const result = await dataSource.submitPrivateEventInquiry(data);
    setStatus("idle");
    if (result.ok) {
      setSent("Thanks — your enquiry is with the team and someone will call you to plan it.");
      e.currentTarget.reset();
      return;
    }
    const url = whatsappUrl([
      "Private event enquiry for Lala's Cafe",
      `Name: ${data.name}`,
      `Phone: ${data.phone}`,
      `Occasion: ${data.eventType}`,
      `Guests: ${data.guests}`,
      `Date: ${data.date}`,
      data.details && `Details: ${data.details}`,
    ]);
    window.open(url, "_blank", "noopener");
    setSent("We've opened WhatsApp with your enquiry so the team can plan it with you.");
  }

  return (
    <>
      <PageHero
        eyebrow="Private Events"
        title="Your night, your corner of the cafe."
        intro="Birthdays, family dinners and get-togethers under the lights. Tell us what you're planning and we'll build it around you."
        image={photos.cabana}
        imageAlt="Private white cabana seating with neon trim at Lala's Cafe"
      />

      <section className="container-lux grid gap-6 py-20 md:grid-cols-3">
        {spaces.map((s, i) => (
          <Reveal key={s.title} delay={i * 0.08}>
            <article className="surface-panel h-full rounded-3xl p-8">
              <s.icon className="text-primary" size={24} />
              <h2 className="mt-5 text-2xl">{s.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
            </article>
          </Reveal>
        ))}
      </section>

      <section className="container-lux pb-24">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <Reveal>
            <form onSubmit={onSubmit} className="surface-panel grid gap-5 rounded-3xl p-8 sm:p-10">
              <div>
                <p className="text-eyebrow">Enquiry</p>
                <h2 className="mt-3 text-3xl">Tell us about the occasion</h2>
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Name" htmlFor="name">
                  <input id="name" name="name" className={fieldClass} placeholder="Your name" required />
                </Field>
                <Field label="Phone" htmlFor="phone">
                  <input id="phone" name="phone" type="tel" className={fieldClass} placeholder="03xx xxxxxxx" required />
                </Field>
                <Field label="Occasion" htmlFor="eventType">
                  <select id="eventType" name="eventType" className={fieldClass} defaultValue={eventTypes[0]}>
                    {eventTypes.map((t) => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Guests" htmlFor="guests">
                  <input id="guests" name="guests" type="number" min={2} max={200} defaultValue={12} className={fieldClass} required />
                </Field>
                <Field label="Date" htmlFor="date">
                  <input id="date" name="date" type="date" className={fieldClass} required />
                </Field>
              </div>
              <Field
                label="What are you planning?"
                htmlFor="details"
                hint="Cake, decoration, a preferred space, timing — anything helps."
              >
                <textarea id="details" name="details" rows={5} className={fieldClass} />
              </Field>
              {error && (
                <p role="alert" className="text-sm text-destructive">
                  {error}
                </p>
              )}
              {sent && <p className="text-sm text-primary">{sent}</p>}
              <div>
                <LuxButton type="submit" disabled={status === "sending"}>
                  {status === "sending" ? "Sending…" : "Send enquiry"}
                </LuxButton>
              </div>
            </form>
          </Reveal>

          <Reveal delay={0.1}>
            <aside className="surface-panel h-full rounded-3xl p-8 sm:p-10">
              <h2 className="text-2xl">How we plan it</h2>
              <ol className="mt-5 space-y-4 text-sm leading-relaxed text-muted-foreground">
                <li>
                  <span className="text-foreground">1. You send the basics.</span> Date, guest count and the kind of
                  evening you want.
                </li>
                <li>
                  <span className="text-foreground">2. We call you back.</span> We go through the space, timing and
                  what the kitchen can prepare for your group.
                </li>
                <li>
                  <span className="text-foreground">3. We hold the space.</span> Once everything is agreed, the area is
                  yours for the evening.
                </li>
              </ol>
              <p className="mt-6 text-sm text-muted-foreground">
                Nothing is confirmed until the team has spoken with you.
              </p>
            </aside>
          </Reveal>
        </div>
      </section>
    </>
  );
}
