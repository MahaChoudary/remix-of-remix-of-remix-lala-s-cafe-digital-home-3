import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { ArrowRight, Clock, MapPin, Phone, Sparkles } from "lucide-react";
import { luxButton } from "@/components/ui-kit/Button";
import { MaskImage, Reveal } from "@/components/motion/Reveal";
import { useSuspenseQuery } from "@tanstack/react-query";
import { publicContentQuery } from "@/lib/content";
import { photos } from "@/lib/site-content";
import { useSiteSettings } from "@/lib/content";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Lala's Cafe Daska — Neon Nights, Chai & Good Food" },
      {
        name: "description",
        content:
          "Lala's Cafe in Daska: neon-lit cabanas, a star-light terrace, breakfast from 7 AM and late nights until 2 AM. Reserve a table or explore the menu.",
      },
      { property: "og:title", content: "Lala's Cafe Daska — Neon Nights, Chai & Good Food" },
      {
        property: "og:description",
        content:
          "Neon-lit cabanas, a star-light terrace and food worth staying up for. Open daily until 2 AM.",
      },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(publicContentQuery),
  component: Home,
});

function Home() {
  const { data: content } = useSuspenseQuery(publicContentQuery);
  const siteSettings = useSiteSettings();
  const featured = content.items.filter((i) => i.isFeatured && i.isAvailable);
  const reduced = useReducedMotion();
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", reduced ? "0%" : "18%"]);

  return (
    <>
      {/* HERO */}
      <section ref={heroRef} className="relative isolate flex min-h-[100svh] items-center overflow-hidden">
        <motion.img
          src={photos.helipad}
          alt="The illuminated wooden helicopter seating installation at Lala's Cafe"
          fetchPriority="high"
          style={{ y: heroY }}
          className="absolute inset-0 -z-20 h-[118%] w-full object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(120%_90%_at_50%_10%,transparent_10%,oklch(0.13_0.04_305/0.75)_60%,oklch(0.13_0.04_305/0.96)_100%)]" />

        <div className="container-lux pt-28 pb-24">
          <motion.span
            className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-background/40 px-4 py-2 text-[0.7rem] tracking-[0.28em] text-primary uppercase backdrop-blur"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <Sparkles size={13} /> Daska · Open till 2 AM
          </motion.span>

          <h1 className="mt-7 max-w-4xl text-[2.6rem] leading-[1.02] sm:text-7xl lg:text-[5.4rem]">
            {["Where the", "night gets", "its glow."].map((line, i) => (
              <span key={line} className="block overflow-hidden">
                <motion.span
                  className="block"
                  initial={{ y: "110%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.95, delay: 0.15 + i * 0.11, ease: [0.22, 1, 0.36, 1] }}
                >
                  {line}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p
            className="mt-7 max-w-lg text-base leading-relaxed text-foreground/80 sm:text-lg"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.55 }}
          >
            {siteSettings.tagline} Cabanas under fairy lights, a terrace full of stars, and a
            kitchen that keeps going long after everywhere else has closed.
          </motion.p>

          <motion.div
            className="mt-9 flex flex-wrap gap-3"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.68 }}
          >
            <Link to="/menu" className={luxButton("ember")}>
              Explore the menu <ArrowRight size={16} />
            </Link>
            <Link to="/reservations" className={luxButton("outline")}>
              Reserve a table
            </Link>
          </motion.div>
        </div>
      </section>

      {/* INFO STRIP */}
      <section className="border-y border-border bg-surface/50">
        <div className="container-lux grid gap-6 py-8 sm:grid-cols-3">
          {[
            { icon: Clock, label: "Hours", value: "2 PM – 2 AM daily · Breakfast from 7 AM" },
            { icon: MapPin, label: "Find us", value: siteSettings.city },
            { icon: Phone, label: "Call or WhatsApp", value: siteSettings.phone },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-start gap-3">
              <Icon size={18} className="mt-0.5 shrink-0 text-primary" />
              <div>
                <p className="text-[0.68rem] tracking-[0.24em] text-muted-foreground uppercase">{label}</p>
                <p className="mt-1 text-sm text-foreground/90">{value}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* STORY TEASER */}
      <section className="container-lux grid items-center gap-12 py-24 lg:grid-cols-2 lg:gap-20">
        <Reveal>
          <p className="text-eyebrow">Our story</p>
          <h2 className="mt-4 text-3xl leading-tight sm:text-5xl">
            Built by hand, lit by hand, run by people who live here.
          </h2>
          <p className="mt-6 text-base leading-relaxed text-muted-foreground">
            Every cabana, pergola and painted pallet at Lala's was put together on site. The
            result is a cafe that doesn't look like anywhere else in Daska — part garden, part
            neon set, entirely ours.
          </p>
          <Link to="/story" className={luxButton("outline", "mt-8")}>
            Read our story
          </Link>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="relative">
            <MaskImage
              src={photos.cabana}
              alt="A private white cabana at Lala's Cafe wrapped in neon trim and hanging plants"
              className="aspect-[4/5] rounded-3xl"
            />
            <MaskImage
              src={photos.entrance}
              alt="Vine-covered wooden ceiling at the entrance of Lala's Cafe"
              className="absolute -bottom-8 -left-8 hidden aspect-square w-40 rounded-2xl border-4 border-background sm:block lg:w-52"
            />
          </div>
        </Reveal>
      </section>

      {/* SIGNATURE ITEMS */}
      <section className="border-y border-border bg-surface/30 py-24">
        <div className="container-lux">
          <Reveal className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="text-eyebrow">On the pass</p>
              <h2 className="mt-4 max-w-xl text-3xl leading-tight sm:text-5xl">
                What people come back for
              </h2>
            </div>
            <Link to="/menu" className={luxButton("ghost")}>
              Full menu <ArrowRight size={15} />
            </Link>
          </Reveal>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {featured.map((item, i) => (
              <Reveal key={item.id} delay={i * 0.08}>
                <article className="surface-panel h-full rounded-2xl p-7 transition-transform duration-500 hover:-translate-y-1">
                  <p className="text-[0.65rem] tracking-[0.24em] text-accent uppercase">Signature</p>
                  <h3 className="mt-3 text-2xl">{item.name}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                  <p className="mt-6 text-sm text-primary">
                    {item.price === null ? "Ask us for today's price" : `Rs ${item.price}`}
                  </p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ATMOSPHERE — sticky storytelling */}
      <AtmosphereSection />

      {/* MOOD TEASER */}
      <section className="container-lux py-24">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-border p-10 sm:p-16">
            <img
              src={photos.courtyard}
              alt=""
              aria-hidden="true"
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover opacity-25"
            />
            <div className="relative max-w-xl">
              <p className="text-eyebrow">Can't decide?</p>
              <h2 className="mt-4 text-3xl leading-tight sm:text-5xl">
                Let your mood pick dinner.
              </h2>
              <p className="mt-5 text-base leading-relaxed text-foreground/85">
                Answer three quick questions, or browse by how you feel — energised, comforted,
                refreshed or sweet. Either way you land on something real off our menu.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link to="/what-should-i-order" className={luxButton("neon")}>
                  What should I order?
                </Link>
                <Link to="/mood-menu" className={luxButton("outline")}>
                  Mood menu
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* VISIT */}
      <section className="border-t border-border bg-surface/40 py-24">
        <div className="container-lux grid gap-12 lg:grid-cols-2 lg:items-center">
          <Reveal>
            <MaskImage
              src={photos.terrace}
              alt="Terrace walkway at Lala's Cafe strung with star and moon fairy lights"
              className="aspect-[16/11] rounded-3xl"
            />
          </Reveal>
          <Reveal delay={0.1}>
            <p className="text-eyebrow">Visit us</p>
            <h2 className="mt-4 text-3xl leading-tight sm:text-5xl">Come as you are, stay late.</h2>
            <dl className="mt-8 space-y-5 text-sm">
              {siteSettings.hours.map((h) => (
                <div key={h.label} className="flex justify-between border-b border-border pb-3">
                  <dt className="text-muted-foreground">{h.label}</dt>
                  <dd className="text-foreground">{h.value}</dd>
                </div>
              ))}
              <div className="flex justify-between border-b border-border pb-3">
                <dt className="text-muted-foreground">Phone / WhatsApp</dt>
                <dd className="text-foreground">{siteSettings.phone}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Area</dt>
                <dd className="text-foreground">{siteSettings.city}</dd>
              </div>
            </dl>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/visit" className={luxButton("ember")}>
                Plan your visit
              </Link>
              <a
                href={`https://wa.me/${siteSettings.whatsapp}`}
                target="_blank"
                rel="noreferrer noopener"
                className={luxButton("outline")}
              >
                WhatsApp us
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="relative isolate overflow-hidden py-28">
        <img
          src={photos.lounge}
          alt=""
          aria-hidden="true"
          loading="lazy"
          className="absolute inset-0 -z-20 h-full w-full object-cover"
        />
        <div className="veil absolute inset-0 -z-10" />
        <div className="container-lux text-center">
          <Reveal>
            <h2 className="mx-auto max-w-2xl text-4xl leading-tight sm:text-6xl">
              A table under the lights is waiting.
            </h2>
            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <Link to="/reservations" className={luxButton("ember")}>
                Reserve a table
              </Link>
              <Link to="/gallery" className={luxButton("outline")}>
                See the cafe
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

const atmosphere = [
  {
    image: photos.lounge,
    alt: "Leather booths at Lala's Cafe in front of a bright painted street mural",
    title: "The mural lounge",
    body: "Deep leather booths against hand-painted street art — the spot for long tables and longer conversations.",
  },
  {
    image: photos.terrace,
    alt: "Star and moon fairy lights hanging along the Lala's Cafe terrace",
    title: "The star terrace",
    body: "Moons, stars and warm bulbs strung the length of the walkway. It photographs even better than it looks.",
  },
  {
    image: photos.cabana,
    alt: "Private slatted cabana with plants and neon lighting at Lala's Cafe",
    title: "Private cabanas",
    body: "Your own slatted room with greenery, soft turf underfoot and a light strip that changes with the night.",
  },
];

function AtmosphereSection() {
  return (
    <section className="container-lux py-24">
      <Reveal>
        <p className="text-eyebrow">The atmosphere</p>
        <h2 className="mt-4 max-w-2xl text-3xl leading-tight sm:text-5xl">
          Three ways to spend an evening here
        </h2>
      </Reveal>

      <div className="mt-14 grid gap-6 lg:grid-cols-3">
        {atmosphere.map((a, i) => (
          <Reveal key={a.title} delay={i * 0.09}>
            <article className="group relative h-[26rem] overflow-hidden rounded-3xl">
              <img
                src={a.image}
                alt={a.alt}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
              />
              <div className="veil absolute inset-0" />
              <div className="absolute inset-x-0 bottom-0 p-7">
                <h3 className="text-2xl">{a.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-foreground/80">{a.body}</p>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
