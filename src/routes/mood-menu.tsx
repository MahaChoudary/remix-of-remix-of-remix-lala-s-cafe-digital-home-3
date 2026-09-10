import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Flame, HeartHandshake, Leaf, IceCreamCone, Drumstick } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { Reveal } from "@/components/motion/Reveal";
import { luxButton } from "@/components/ui-kit/Button";
import { useSuspenseQuery } from "@tanstack/react-query";
import { publicContentQuery } from "@/lib/content";
import { photos } from "@/lib/site-content";
import type { MoodTag } from "@/lib/types";

export const Route = createFileRoute("/mood-menu")({
  head: () => ({
    meta: [
      { title: "Mood Menu — Eat by How You Feel | Lala's Cafe Daska" },
      {
        name: "description",
        content:
          "Pick a mood — fired up, comforted, refreshed, sweet or savoury — and see what to eat at Lala's Cafe in Daska.",
      },
      { property: "og:title", content: "Mood Menu at Lala's Cafe" },
      { property: "og:description", content: "Choose a mood and we'll show you the dishes that match it." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(publicContentQuery),
  component: MoodMenuPage,
});

const moods: {
  id: MoodTag;
  label: string;
  line: string;
  icon: typeof Flame;
}[] = [
  { id: "energy", label: "Fired up", line: "Heat, spice and something with a kick.", icon: Flame },
  { id: "comfort", label: "Comforted", line: "Cheesy, creamy, warm — the soft landing.", icon: HeartHandshake },
  { id: "refreshing", label: "Refreshed", line: "Cold, crisp and light on the palate.", icon: Leaf },
  { id: "sweet", label: "Sweet tooth", line: "Shakes, sugar and everything after dinner.", icon: IceCreamCone },
  { id: "savoury", label: "Properly hungry", line: "Full plates and serious mains.", icon: Drumstick },
];

const formatPrice = (price: number | null) => (price === null ? "Ask the team" : `Rs ${price.toLocaleString("en-PK")}`);

function MoodMenuPage() {
  const [mood, setMood] = useState<MoodTag | null>(null);
  const reduced = useReducedMotion();

  const { data: content } = useSuspenseQuery(publicContentQuery);
  const categories = content.categories;
  const items = content.items;

  const matches = useMemo(() => {
    if (!mood) return [];
    return items.filter((i) => i.isAvailable && i.moods.includes(mood)).slice(0, 12);
  }, [items, mood]);

  const categoryName = (id: string) => categories.find((c) => c.id === id)?.name ?? "";
  const active = moods.find((m) => m.id === mood);

  return (
    <>
      <PageHero
        eyebrow="Mood Menu"
        title="Order by how you feel, not what you know."
        intro="Five moods. Pick the one that matches your evening and we'll pull the dishes that fit."
        image={photos.terrace}
        imageAlt="Terrace walkway at Lala's Cafe strung with star and moon lights"
      />

      <section className="container-lux py-20">
        <Reveal>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {moods.map((m) => {
              const selected = mood === m.id;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setMood(selected ? null : m.id)}
                  aria-pressed={selected}
                  className={`surface-panel rounded-3xl p-6 text-left transition-all duration-300 ${
                    selected
                      ? "glow-ring -translate-y-1 border-primary text-foreground"
                      : "hover:-translate-y-1 hover:border-primary/60"
                  }`}
                >
                  <m.icon className={selected ? "text-primary" : "text-muted-foreground"} size={24} />
                  <p className="mt-4 font-display text-xl">{m.label}</p>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{m.line}</p>
                </button>
              );
            })}
          </div>
        </Reveal>

        <div className="mt-14" aria-live="polite">
          <AnimatePresence mode="wait">
            {mood && active ? (
              <motion.div
                key={mood}
                initial={reduced ? false : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduced ? { opacity: 0 } : { opacity: 0, y: -12 }}
                transition={{ duration: reduced ? 0 : 0.35, ease: "easeOut" }}
              >
                <div className="flex flex-wrap items-end justify-between gap-4">
                  <div>
                    <p className="text-eyebrow">{active.label}</p>
                    <h2 className="mt-2 text-3xl sm:text-4xl">
                      {matches.length} {matches.length === 1 ? "dish" : "dishes"} for that mood
                    </h2>
                  </div>
                  <Link to="/menu" className={luxButton("outline")}>
                    See the full menu
                  </Link>
                </div>

                <ul className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {matches.map((item, i) => (
                    <motion.li
                      key={item.id}
                      initial={reduced ? false : { opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: reduced ? 0 : 0.3, delay: reduced ? 0 : Math.min(i * 0.04, 0.3) }}
                      className="surface-panel rounded-3xl p-6"
                    >
                      <p className="text-[0.65rem] tracking-[0.2em] text-muted-foreground uppercase">
                        {categoryName(item.categoryId)}
                      </p>
                      <div className="mt-3 flex items-start justify-between gap-4">
                        <h3 className="font-display text-xl leading-tight">{item.name}</h3>
                        <span className="shrink-0 text-sm text-primary">{formatPrice(item.price)}</span>
                      </div>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            ) : (
              <motion.p
                key="empty"
                initial={reduced ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="surface-panel rounded-3xl p-10 text-center text-sm text-muted-foreground"
              >
                Choose a mood above and the menu rearranges itself around it.
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </section>
    </>
  );
}
