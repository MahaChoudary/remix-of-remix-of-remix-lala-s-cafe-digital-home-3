import { createFileRoute, Link } from "@tanstack/react-router";
import { Tag } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { Reveal } from "@/components/motion/Reveal";
import { luxButton } from "@/components/ui-kit/Button";
import { useSuspenseQuery } from "@tanstack/react-query";
import { publicContentQuery } from "@/lib/content";
import { photos } from "@/lib/site-content";
import { useSiteSettings } from "@/lib/content";

export const Route = createFileRoute("/offers")({
  head: () => ({
    meta: [
      { title: "Offers — Lala's Cafe Daska" },
      {
        name: "description",
        content: "Current deals and promotions at Lala's Cafe in Daska.",
      },
      { property: "og:title", content: "Offers — Lala's Cafe Daska" },
      { property: "og:description", content: "Current deals and promotions at Lala's Cafe." },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(publicContentQuery),
  component: OffersPage,
});

function OffersPage() {
  const { data: content } = useSuspenseQuery(publicContentQuery);
  const offers = content.offers;
  const siteSettings = useSiteSettings();

  return (
    <>
      <PageHero
        eyebrow="Offers"
        title="Deals worth the drive."
        image={photos.courtyard}
        imageAlt="Neon-lit pergola seating at Lala's Cafe"
      />

      <section className="container-lux py-20">
        {offers.length === 0 ? (
          <Reveal>
            <div className="surface-panel mx-auto max-w-2xl rounded-3xl p-10 text-center sm:p-14">
              <Tag className="mx-auto text-primary" size={28} />
              <h2 className="mt-6 text-3xl">No promotions running today</h2>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                We'd rather show you nothing than a deal that's expired. Offers appear here as
                soon as Lala's publishes them — message us and we'll tell you what's on this week.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <a
                  href={`https://wa.me/${siteSettings.whatsapp}`}
                  target="_blank"
                  rel="noreferrer noopener"
                  className={luxButton("ember")}
                >
                  Ask about deals
                </a>
                <Link to="/menu" className={luxButton("outline")}>
                  See the menu
                </Link>
              </div>
            </div>
          </Reveal>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {offers.map((o, i) => (
              <Reveal key={o.id} delay={i * 0.08}>
                <article className="surface-panel overflow-hidden rounded-3xl">
                  {o.imageUrl && (
                    <img src={o.imageUrl} alt={o.title} loading="lazy" className="aspect-[16/9] w-full object-cover" />
                  )}
                  <div className="p-7">
                    <h2 className="text-2xl">{o.title}</h2>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{o.description}</p>
                    {o.validUntil && (
                      <p className="mt-4 text-sm text-primary">
                        Valid until {new Date(o.validUntil).toLocaleDateString()}
                      </p>
                    )}
                    {o.terms && <p className="mt-3 text-xs text-muted-foreground">{o.terms}</p>}
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
