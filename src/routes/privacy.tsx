import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/layout/PageHero";
import { Reveal } from "@/components/motion/Reveal";
import { photos, siteSettings } from "@/lib/site-content";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — Lala's Cafe Daska" },
      {
        name: "description",
        content:
          "How Lala's Cafe in Daska handles the details you share when you request a table, send a message or ask about a private event.",
      },
      { property: "og:title", content: "Privacy Policy — Lala's Cafe" },
      { property: "og:description", content: "How we handle the details you share with Lala's Cafe." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PrivacyPage,
});

const sections = [
  {
    heading: "What we collect",
    body: [
      "When you send a table request, a message or a private-event enquiry, we collect only what the form asks for: your name, your phone number, an optional email address, and the details of your request such as date, time, party size and any notes you add.",
      "We do not ask for payment details on this website. Payment happens at the cafe.",
    ],
  },
  {
    heading: "Why we collect it",
    body: [
      "We use your details for one purpose: to reply to you and to arrange the booking, order or enquiry you sent. That normally means a phone call or a WhatsApp message from the cafe.",
    ],
  },
  {
    heading: "Who can see it",
    body: [
      "Only the Lala's Cafe team. We do not sell your details, and we do not share them with advertisers or marketing companies.",
      "Our website and booking records are hosted by service providers who store the data on our behalf. They may not use it for their own purposes.",
    ],
  },
  {
    heading: "How long we keep it",
    body: [
      "We keep booking and enquiry records for as long as they are useful for running the cafe — for example to recognise a returning guest or to look up a past booking. You can ask us to delete your record at any time.",
    ],
  },
  {
    heading: "Cookies",
    body: [
      "This website does not use advertising or tracking cookies. Your browser may store small technical items needed for pages to work correctly.",
    ],
  },
  {
    heading: "Your choices",
    body: [
      "You can ask us what we hold about you, ask us to correct it, or ask us to delete it. Call or message the cafe and we will handle it.",
    ],
  },
];

function PrivacyPage() {
  return (
    <>
      <PageHero
        eyebrow="Privacy"
        title="Your details, handled simply."
        intro="We only ask for what we need to reply to you — and we use it for nothing else."
        image={photos.lounge}
        imageAlt="Leather booth seating at Lala's Cafe in front of a painted mural"
      />

      <section className="container-lux py-20">
        <div className="mx-auto max-w-3xl space-y-10">
          {sections.map((s, i) => (
            <Reveal key={s.heading} delay={i * 0.05}>
              <article className="surface-panel rounded-3xl p-8 sm:p-10">
                <h2 className="text-2xl">{s.heading}</h2>
                {s.body.map((p) => (
                  <p key={p} className="mt-4 text-sm leading-relaxed text-muted-foreground">
                    {p}
                  </p>
                ))}
              </article>
            </Reveal>
          ))}

          <Reveal>
            <div className="surface-panel rounded-3xl p-8 sm:p-10">
              <h2 className="text-2xl">Talk to us about this</h2>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                {siteSettings.cafeName}, {siteSettings.addressLine}, {siteSettings.city}.
                <br />
                Phone:{" "}
                <a
                  href={`tel:${siteSettings.phone.replace(/\s/g, "")}`}
                  className="text-foreground hover:text-primary"
                >
                  {siteSettings.phone}
                </a>
              </p>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
