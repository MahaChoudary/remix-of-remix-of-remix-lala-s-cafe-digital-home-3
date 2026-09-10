import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { Reveal } from "@/components/motion/Reveal";
import { useSuspenseQuery } from "@tanstack/react-query";
import { publicContentQuery } from "@/lib/content";
import { photos } from "@/lib/site-content";
import type { MenuItem } from "@/lib/types";

export const Route = createFileRoute("/menu")({
  head: () => ({
    meta: [
      { title: "Menu — Lala's Cafe Daska" },
      {
        name: "description",
        content:
          "Browse the Lala's Cafe menu: breakfast from 7 AM, chai and coffee, shakes, fast food, mains and desserts in Daska.",
      },
      { property: "og:title", content: "Menu — Lala's Cafe Daska" },
      {
        property: "og:description",
        content: "Breakfast, chai, fast food, mains and desserts at Lala's Cafe in Daska.",
      },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(publicContentQuery),
  component: MenuPage,
});

function MenuPage() {
  const { data: content } = useSuspenseQuery(publicContentQuery);
  const categories = content.categories;
  const items = content.items;
  const [active, setActive] = useState<string>("all");
  const [query, setQuery] = useState("");

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter(
      (i) =>
        (active === "all" || i.categoryId === active) &&
        (q === "" || i.name.toLowerCase().includes(q) || i.description.toLowerCase().includes(q)),
    );
  }, [items, active, query]);

  const grouped = categories
    .map((c) => ({ category: c, items: visible.filter((i) => i.categoryId === c.id) }))
    .filter((g) => g.items.length > 0);

  const awaitingPrices = items.length === 0;

  return (
    <>
      <PageHero
        eyebrow="The menu"
        title="Breakfast at 7, chai at midnight."
        intro="Our kitchen runs from early morning right through to 2 AM. Here's how it's laid out."
        image={photos.entrance}
        imageAlt="Warm pendant lights and a vine-covered ceiling at the Lala's Cafe entrance"
      />

      <section className="container-lux py-16">
        {awaitingPrices && (
          <Reveal className="mb-10 rounded-2xl border border-primary/35 bg-primary/5 p-5 text-sm leading-relaxed text-foreground/85">
            The menu isn't showing right now. Call or WhatsApp us on the number in the footer and
            we'll tell you exactly what's cooking today.
          </Reveal>
        )}

        <div className="sticky top-[72px] z-30 -mx-5 mb-12 border-y border-border bg-background/90 px-5 py-4 backdrop-blur-xl md:-mx-8 md:px-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div
              role="tablist"
              aria-label="Menu categories"
              className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1"
            >
              {[{ id: "all", name: "Everything" }, ...categories].map((c) => (
                <button
                  key={c.id}
                  role="tab"
                  aria-selected={active === c.id}
                  onClick={() => setActive(c.id)}
                  className={`shrink-0 rounded-full border px-4 py-2 text-sm transition-colors ${
                    active === c.id
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border text-muted-foreground hover:border-primary hover:text-primary"
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>

            <div className="relative lg:w-72">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search the menu"
                aria-label="Search the menu"
                className="w-full rounded-full border border-input bg-background/60 py-2.5 pl-11 pr-4 text-sm focus:border-primary focus:outline-none"
              />
            </div>
          </div>
        </div>

        {grouped.length === 0 ? (
          <p className="py-16 text-center text-muted-foreground">
            Nothing matches “{query}”. Try a different search.
          </p>
        ) : (
          <div className="space-y-20">
            {grouped.map(({ category, items: rows }) => (
              <div key={category.id}>
                <Reveal>
                  <h2 className="text-3xl sm:text-4xl">{category.name}</h2>
                  {category.description && (
                    <p className="mt-2 text-sm text-muted-foreground">{category.description}</p>
                  )}
                </Reveal>
                <ul className="mt-8 grid gap-4 md:grid-cols-2">
                  {rows.map((item, i) => (
                    <Reveal as="li" key={item.id} delay={Math.min(i * 0.05, 0.3)}>
                      <MenuRow item={item} />
                    </Reveal>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
}

function MenuRow({ item }: { item: MenuItem }) {
  return (
    <article
      className={`surface-panel flex h-full gap-4 rounded-2xl p-5 transition-transform duration-500 hover:-translate-y-0.5 ${
        item.isAvailable ? "" : "opacity-55"
      }`}
    >
      {item.imageUrl && (
        <img
          src={item.imageUrl}
          alt={item.name}
          loading="lazy"
          className="h-20 w-20 shrink-0 rounded-xl object-cover"
        />
      )}
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-lg leading-snug">{item.name}</h3>
          <p className="shrink-0 text-sm text-primary">
            {item.price === null ? "Ask us" : `Rs ${item.price}`}
          </p>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {item.isBestseller && <Tag>Bestseller</Tag>}
          {item.isNew && <Tag>New</Tag>}
          {item.isFeatured && <Tag>Signature</Tag>}
          {!item.isAvailable && <Tag>Unavailable today</Tag>}
        </div>
      </div>
    </article>
  );
}

function Tag({ children }: { children: string }) {
  return (
    <span className="rounded-full border border-accent/45 px-2.5 py-1 text-[0.6rem] tracking-[0.18em] text-accent uppercase">
      {children}
    </span>
  );
}
