import { createFileRoute, Link } from "@tanstack/react-router";
import { CalendarDays } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { Reveal } from "@/components/motion/Reveal";
import { luxButton } from "@/components/ui-kit/Button";
import { useSuspenseQuery } from "@tanstack/react-query";
import { publicContentQuery } from "@/lib/content";
import { photos } from "@/lib/site-content";
import { useSiteSettings } from "@/lib/content";

export const Route = createFileRoute("/events")({
  head: () => ({
    meta: [
      { title: "Events — Lala's Cafe Daska" },
      {
        name: "description",
        content:
          "Upcoming nights, live evenings and celebrations at Lala's Cafe in Daska. Ask us about hosting your own.",
      },
      { property: "og:title", content: "Events — Lala's Cafe Daska" },
      {
        property: "og:description",
        content: "What's on at Lala's Cafe, and how to host your own night with us.",
      },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(publicContentQuery),
  component: EventsPage,
});

function EventsPage() {
  const { data: content } = useSuspenseQuery(publicContentQuery);
  const events = content.events;
  const siteSettings = useSiteSettings();

  return (
    <>
      <PageHero
        eyebrow="Events"
        title="Nights worth clearing your calendar for."
        image={photos.helipad}
        imageAlt="Lit helicopter installation at Lala's Cafe surrounded by seating"
      />

      <section className="container-lux py-20">
        {events.length === 0 ? (
          <Reveal>
            <div className="surface-panel mx-auto max-w-2xl rounded-3xl p-10 text-center sm:p-14">
              <CalendarDays className="mx-auto text-primary" size={30} />
              <h2 className="mt-6 text-3xl">No events listed right now</h2>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                Nothing is scheduled on the site at the moment. When Lala's announces a night,
                it'll appear here. In the meantime, message us on WhatsApp — we'll tell you what's
                happening this week, and we can host your celebration on request.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <a
                  href={`https://wa.me/${siteSettings.whatsapp}`}
                  target="_blank"
                  rel="noreferrer noopener"
                  className={luxButton("ember")}
                >
                  Ask what's on
                </a>
                <Link to="/private-events" className={luxButton("outline")}>
                  Host a private event
                </Link>
              </div>
            </div>
          </Reveal>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {events.map((e, i) => (
              <Reveal key={e.id} delay={i * 0.08}>
                <article className="surface-panel overflow-hidden rounded-3xl">
                  {e.imageUrl && (
                    <img src={e.imageUrl} alt={e.title} loading="lazy" className="aspect-[16/9] w-full object-cover" />
                  )}
                  <div className="p-7">
                    {e.startsAt && (
                      <p className="text-eyebrow">
                        {new Date(e.startsAt).toLocaleDateString(undefined, {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                    )}
                    <h2 className="mt-3 text-2xl">{e.title}</h2>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{e.description}</p>
                    {e.location && <p className="mt-4 text-sm text-primary">{e.location}</p>}
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
