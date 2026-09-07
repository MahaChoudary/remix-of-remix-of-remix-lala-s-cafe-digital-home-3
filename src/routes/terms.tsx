import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/layout/PageHero";
import { Reveal } from "@/components/motion/Reveal";
import { photos, siteSettings } from "@/lib/site-content";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Use — Lala's Cafe Daska" },
      {
        name: "description",
        content:
          "The terms that apply to using the Lala's Cafe website, requesting a table and sending an enquiry.",
      },
      { property: "og:title", content: "Terms of Use — Lala's Cafe" },
      { property: "og:description", content: "Terms for using the Lala's Cafe website and booking requests." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: TermsPage,
});

const sections = [
  {
    heading: "About this website",
    body: [
      "This website is run by Lala's Cafe in Daska. By using it you accept the terms on this page.",
    ],
  },
  {
    heading: "Table requests are requests",
    body: [
      "Sending a table request does not confirm a booking. A table is only held once someone from the cafe replies to confirm it. If you have not heard from us, please call.",
      "If you cannot make a confirmed booking, let us know as early as you can so we can offer the table to someone else.",
    ],
  },
  {
    heading: "Menu, prices and availability",
    body: [
      "The menu and prices shown here are the cafe's current listings. Dishes can sell out, and prices can change. Some items are priced on the day; those are marked on the menu. The prices shown at the cafe are the ones that apply.",
      "Photographs on this site show the cafe itself. Dishes are served as described on the menu.",
    ],
  },
  {
    heading: "Allergies and dietary needs",
    body: [
      "Our kitchen prepares many dishes side by side, so we cannot guarantee that any dish is free of a particular ingredient. If you have an allergy or a dietary requirement, tell us before you order and we will tell you honestly what we can and cannot do.",
    ],
  },
  {
    heading: "Private events and large groups",
    body: [
      "Private events and large-group bookings are arranged case by case with the cafe. Any arrangement about timing, space, minimum spend or deposit is whatever the cafe agrees with you directly.",
    ],
  },
  {
    heading: "In the cafe",
    body: [
      "We ask guests to treat the space, the staff and other guests with respect. The cafe may decline service where that is not the case.",
    ],
  },
  {
    heading: "Content on this site",
    body: [
      "The photographs, menu text, logo and design on this site belong to Lala's Cafe. Please do not reuse them commercially without asking us.",
    ],
  },
  {
    heading: "Changes",
    body: [
      "We may update these terms as the cafe changes. The version on this page is the current one.",
    ],
  },
];

function TermsPage() {
  return (
    <>
      <PageHero
        eyebrow="Terms"
        title="The plain version."
        intro="What to expect when you book, order or send us a message through this site."
        image={photos.terrace}
        imageAlt="Terrace walkway at Lala's Cafe strung with star and moon lights"
      />

      <section className="container-lux py-20">
        <div className="mx-auto max-w-3xl space-y-10">
          {sections.map((s, i) => (
            <Reveal key={s.heading} delay={i * 0.04}>
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
              <h2 className="text-2xl">Questions</h2>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                Call {siteSettings.cafeName} on{" "}
                <a
                  href={`tel:${siteSettings.phone.replace(/\s/g, "")}`}
                  className="text-foreground hover:text-primary"
                >
                  {siteSettings.phone}
                </a>{" "}
                or drop in — {siteSettings.addressLine}, {siteSettings.city}.
              </p>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
