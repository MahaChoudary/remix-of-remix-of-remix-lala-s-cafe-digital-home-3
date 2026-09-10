import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ChevronDown } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { Reveal } from "@/components/motion/Reveal";
import { luxButton } from "@/components/ui-kit/Button";
import { useSuspenseQuery } from "@tanstack/react-query";
import { photos } from "@/lib/site-content";
import { publicContentQuery } from "@/lib/content";
import type { PublicContent } from "@/lib/public-content.functions";

export const Route = createFileRoute("/faq")({
  loader: ({ context }) => context.queryClient.ensureQueryData(publicContentQuery),
  head: ({ loaderData }: { loaderData?: PublicContent }) => ({
    meta: [
      { title: "FAQ — Lala's Cafe Daska" },
      {
        name: "description",
        content:
          "Answers about opening hours, table bookings, seating areas, free home delivery and private gatherings at Lala's Cafe on Nisbat Road, Daska.",
      },
      { property: "og:title", content: "Frequently Asked Questions — Lala's Cafe" },
      { property: "og:description", content: "Hours, bookings, seating, delivery and private events." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: (loaderData?.faqs ?? []).map((f) => ({
            "@type": "Question",
            name: f.question,
            acceptedAnswer: { "@type": "Answer", text: f.answer },
          })),
        }),
      },
    ],
  }),
  component: FaqPage,
});

function FaqPage() {
  const { data: content } = useSuspenseQuery(publicContentQuery);
  const faqs = content.faqs;
  const [open, setOpen] = useState<string | null>(null);
  const reduced = useReducedMotion();

  return (
    <>
      <PageHero
        eyebrow="Questions"
        title="Everything guests ask us."
        intro="Hours, bookings, seating and delivery — answered plainly. If yours isn't here, call us."
        image={photos.courtyard}
        imageAlt="Colourful pergola bench under neon light in the courtyard at Lala's Cafe"
      />

      <section className="container-lux py-20">
        <div className="mx-auto max-w-3xl space-y-3">
          {faqs.map((f, i) => {
            const isOpen = open === f.id;
            return (
              <Reveal key={f.id} delay={Math.min(i * 0.04, 0.24)}>
                <div className="surface-panel overflow-hidden rounded-3xl">
                  <h2>
                    <button
                      type="button"
                      onClick={() => setOpen(isOpen ? null : f.id)}
                      aria-expanded={isOpen}
                      aria-controls={`panel-${f.id}`}
                      className="flex w-full items-center justify-between gap-6 px-7 py-6 text-left transition-colors hover:text-primary"
                    >
                      <span className="font-display text-lg sm:text-xl">{f.question}</span>
                      <ChevronDown
                        size={20}
                        aria-hidden
                        className={`shrink-0 text-primary transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                      />
                    </button>
                  </h2>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        id={`panel-${f.id}`}
                        initial={reduced ? false : { height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={reduced ? { opacity: 0 } : { height: 0, opacity: 0 }}
                        transition={{ duration: reduced ? 0 : 0.3, ease: "easeOut" }}
                        className="overflow-hidden"
                      >
                        <p className="px-7 pb-7 text-sm leading-relaxed text-muted-foreground">
                          {f.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Reveal>
            );
          })}

          <Reveal>
            <div className="surface-panel mt-8 flex flex-wrap items-center justify-between gap-6 rounded-3xl p-8 sm:p-10">
              <div>
                <h2 className="text-2xl">Still wondering?</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Send us a message and we'll get back to you.
                </p>
              </div>
              <Link to="/contact" className={luxButton("ember")}>
                Contact us
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
