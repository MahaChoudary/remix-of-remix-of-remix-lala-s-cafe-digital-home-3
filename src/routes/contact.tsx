import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { Reveal } from "@/components/motion/Reveal";
import { Field, fieldClass } from "@/components/forms/Field";
import { whatsappUrl } from "@/components/forms/whatsapp";
import { LuxButton } from "@/components/ui-kit/Button";
import { dataSource } from "@/lib/data-source";
import { complaintPhone, orderPhones, photos, siteSettings } from "@/lib/site-content";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Lala's Cafe — Nisbat Road, Daska" },
      {
        name: "description",
        content:
          "Message Lala's Cafe in Daska about an order, a booking, feedback or anything else. Phone numbers, address and opening hours included.",
      },
      { property: "og:title", content: "Contact Lala's Cafe" },
      { property: "og:description", content: "Message, call or visit Lala's Cafe on Nisbat Road, Daska." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ContactPage,
});

const subjects = ["General question", "An order", "A booking", "Private event", "Feedback or complaint"];

function ContactPage() {
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
      email: String(fd.get("email") ?? "").trim(),
      subject: String(fd.get("subject") ?? subjects[0]),
      message: String(fd.get("message") ?? "").trim(),
    };
    if (!data.name || !data.phone || !data.message) {
      setError("Please add your name, a phone number and your message.");
      return;
    }
    setStatus("sending");
    const result = await dataSource.submitContactMessage(data);
    setStatus("idle");
    if (result.ok) {
      setSent("Thanks — your message is with the team and we'll reply soon.");
      e.currentTarget.reset();
      return;
    }
    const url = whatsappUrl([
      "Message for Lala's Cafe",
      `Name: ${data.name}`,
      `Phone: ${data.phone}`,
      data.email && `Email: ${data.email}`,
      `Subject: ${data.subject}`,
      data.message,
    ]);
    window.open(url, "_blank", "noopener");
    setSent("We've opened WhatsApp with your message so the team receives it directly.");
  }

  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Say hello, ask anything."
        intro="Questions about an order, a booking or a gathering — we read every message."
        image={photos.lounge}
        imageAlt="Leather booth seating at Lala's Cafe in front of a painted mural"
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
                <Field label="Email" htmlFor="email" hint="Optional">
                  <input id="email" name="email" type="email" className={fieldClass} placeholder="you@example.com" />
                </Field>
                <Field label="Subject" htmlFor="subject">
                  <select id="subject" name="subject" className={fieldClass} defaultValue={subjects[0]}>
                    {subjects.map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </Field>
              </div>
              <Field label="Message" htmlFor="message">
                <textarea id="message" name="message" rows={6} className={fieldClass} required />
              </Field>
              {error && (
                <p role="alert" className="text-sm text-destructive">
                  {error}
                </p>
              )}
              {sent && <p className="text-sm text-primary">{sent}</p>}
              <div>
                <LuxButton type="submit" disabled={status === "sending"}>
                  {status === "sending" ? "Sending…" : "Send message"}
                </LuxButton>
              </div>
            </form>
          </Reveal>

          <Reveal delay={0.1}>
            <aside className="surface-panel grid h-full gap-7 rounded-3xl p-8 sm:p-10">
              <div>
                <Phone className="text-primary" size={22} />
                <h2 className="mt-4 text-xl">Call to order</h2>
                <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                  {orderPhones.map((p) => (
                    <li key={p}>
                      <a href={`tel:${p.replace(/\s/g, "")}`} className="hover:text-primary">
                        {p}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <MessageCircle className="text-primary" size={22} />
                <h2 className="mt-4 text-xl">Complaints</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Straight to management:{" "}
                  <a href={`tel:${complaintPhone.replace(/\s/g, "")}`} className="hover:text-primary">
                    {complaintPhone}
                  </a>
                </p>
              </div>
              <div>
                <MapPin className="text-primary" size={22} />
                <h2 className="mt-4 text-xl">Find us</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {siteSettings.addressLine}
                  <br />
                  {siteSettings.city}
                </p>
              </div>
              <div>
                <Mail className="text-primary" size={22} />
                <h2 className="mt-4 text-xl">Opening hours</h2>
                <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                  {siteSettings.hours.map((h) => (
                    <li key={h.label}>
                      <span className="text-foreground">{h.label}:</span> {h.value}
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          </Reveal>
        </div>
      </section>
    </>
  );
}
