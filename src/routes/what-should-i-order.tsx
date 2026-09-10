import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { RotateCcw } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { Reveal } from "@/components/motion/Reveal";
import { luxButton, LuxButton } from "@/components/ui-kit/Button";
import { useSuspenseQuery } from "@tanstack/react-query";
import { publicContentQuery } from "@/lib/content";
import { photos } from "@/lib/site-content";
import type { MenuItem, MoodTag } from "@/lib/types";

export const Route = createFileRoute("/what-should-i-order")({
  head: () => ({
    meta: [
      { title: "What Should I Order? — Lala's Cafe Daska" },
      {
        name: "description",
        content:
          "Answer three quick questions and get a dish picked from the real Lala's Cafe menu in Daska — from wings and pizza to shakes and fresh juice.",
      },
      { property: "og:title", content: "What Should I Order at Lala's Cafe?" },
      { property: "og:description", content: "Three questions, one recommendation from our real menu." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(publicContentQuery),
  component: OrderHelperPage,
});

interface Answer {
  label: string;
  categories: string[];
  mood?: MoodTag;
}

interface Question {
  id: string;
  prompt: string;
  helper: string;
  answers: Answer[];
}

const questions: Question[] = [
  {
    id: "appetite",
    prompt: "How hungry are you?",
    helper: "Be honest — it changes everything.",
    answers: [
      { label: "Just something to sip", categories: ["drinks", "juice"] },
      { label: "A little something", categories: ["appetizer", "wings", "sandwich", "salad", "soup"] },
      { label: "A proper meal", categories: ["burgers", "pizza", "pasta", "chinese", "broast", "steaks", "wraps", "fish", "italian", "rice"] },
      { label: "Feeding the whole table", categories: ["platters", "meals", "pizza"] },
    ],
  },
  {
    id: "mood",
    prompt: "What are you in the mood for?",
    helper: "The flavour you're chasing tonight.",
    answers: [
      { label: "Something with heat", categories: [], mood: "energy" },
      { label: "Warm and comforting", categories: [], mood: "comfort" },
      { label: "Cold and refreshing", categories: [], mood: "refreshing" },
      { label: "Rich and savoury", categories: [], mood: "savoury" },
      { label: "Sweet", categories: [], mood: "sweet" },
    ],
  },
  {
    id: "budget",
    prompt: "What's the budget per person?",
    helper: "We'll keep the suggestion inside it.",
    answers: [
      { label: "Under Rs 500", categories: [] },
      { label: "Rs 500 – 1,000", categories: [] },
      { label: "Rs 1,000 and up", categories: [] },
      { label: "Doesn't matter", categories: [] },
    ],
  },
];

const budgetRanges: Record<string, [number, number]> = {
  "Under Rs 500": [0, 500],
  "Rs 500 – 1,000": [500, 1000],
  "Rs 1,000 and up": [1000, Number.MAX_SAFE_INTEGER],
};

const formatPrice = (price: number | null) => (price === null ? "Ask the team" : `Rs ${price.toLocaleString("en-PK")}`);

function score(item: MenuItem, picks: Answer[]) {
  let value = 0;
  const [appetite, mood, budget] = picks;
  if (appetite?.categories.includes(item.categoryId)) value += 3;
  if (mood?.mood && item.moods.includes(mood.mood)) value += 3;
  if (budget) {
    const range = budgetRanges[budget.label];
    if (!range) value += 1;
    else if (item.price !== null && item.price >= range[0] && item.price <= range[1]) value += 2;
  }
  if (item.isBestseller) value += 1;
  return value;
}

function OrderHelperPage() {
  const [step, setStep] = useState(0);
  const [picks, setPicks] = useState<Answer[]>([]);
  const reduced = useReducedMotion();

  const { data: content } = useSuspenseQuery(publicContentQuery);
  const categories = content.categories;
  const items = useMemo(() => content.items.filter((i) => i.isAvailable), [content.items]);

  const done = picks.length === questions.length;

  const results = useMemo(() => {
    if (!done) return [];
    return items
      .map((item) => ({ item, value: score(item, picks) }))
      .filter((r) => r.value >= 4)
      .sort((a, b) => b.value - a.value)
      .slice(0, 3)
      .map((r) => r.item);
  }, [done, items, picks]);

  const categoryName = (id: string) => categories.find((c) => c.id === id)?.name ?? "";

  function choose(answer: Answer) {
    setPicks((p) => [...p, answer]);
    setStep((s) => s + 1);
  }

  function restart() {
    setPicks([]);
    setStep(0);
  }

  const current = questions[step];

  return (
    <>
      <PageHero
        eyebrow="Can't decide?"
        title="Three questions. One answer."
        intro="Every suggestion comes straight off our real menu — nothing invented."
        image={photos.helipad}
        imageAlt="Lit-up wooden helicopter seating installation at Lala's Cafe"
      />

      <section className="container-lux py-20">
        <div className="mx-auto max-w-3xl">
          <Reveal>
            <div className="mb-8 flex items-center gap-3" aria-hidden>
              {questions.map((q, i) => (
                <span
                  key={q.id}
                  className={`h-1 flex-1 rounded-full transition-colors duration-500 ${
                    i < picks.length ? "bg-primary" : "bg-border"
                  }`}
                />
              ))}
            </div>
          </Reveal>

          <div aria-live="polite">
            <AnimatePresence mode="wait">
              {!done && current ? (
                <motion.div
                  key={current.id}
                  initial={reduced ? false : { opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduced ? { opacity: 0 } : { opacity: 0, y: -14 }}
                  transition={{ duration: reduced ? 0 : 0.32, ease: "easeOut" }}
                  className="surface-panel rounded-3xl p-8 sm:p-10"
                >
                  <p className="text-eyebrow">
                    Question {step + 1} of {questions.length}
                  </p>
                  <h2 className="mt-3 text-3xl sm:text-4xl">{current.prompt}</h2>
                  <p className="mt-2 text-sm text-muted-foreground">{current.helper}</p>
                  <div className="mt-7 grid gap-3 sm:grid-cols-2">
                    {current.answers.map((a) => (
                      <button
                        key={a.label}
                        type="button"
                        onClick={() => choose(a)}
                        className="rounded-2xl border border-border bg-background/40 px-6 py-5 text-left text-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-primary hover:text-primary"
                      >
                        {a.label}
                      </button>
                    ))}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="result"
                  initial={reduced ? false : { opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: reduced ? 0 : 0.35, ease: "easeOut" }}
                >
                  <div className="surface-panel rounded-3xl p-8 sm:p-10">
                    <p className="text-eyebrow">Our pick</p>
                    <h2 className="mt-3 text-3xl sm:text-4xl">
                      {results.length > 0 ? "Order this." : "Nothing matched all three."}
                    </h2>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {results.length > 0
                        ? "Based on your appetite, your mood and your budget."
                        : "Your combination is a narrow one — loosen the budget or the mood, or browse the full menu."}
                    </p>

                    {results.length > 0 && (
                      <ul className="mt-8 space-y-4">
                        {results.map((item, i) => (
                          <motion.li
                            key={item.id}
                            initial={reduced ? false : { opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: reduced ? 0 : 0.3, delay: reduced ? 0 : i * 0.08 }}
                            className="rounded-2xl border border-border bg-background/40 p-6"
                          >
                            <p className="text-[0.65rem] tracking-[0.2em] text-muted-foreground uppercase">
                              {categoryName(item.categoryId)}
                              {i === 0 && <span className="ml-3 text-primary">Top match</span>}
                            </p>
                            <div className="mt-3 flex items-start justify-between gap-4">
                              <h3 className="font-display text-2xl leading-tight">{item.name}</h3>
                              <span className="shrink-0 text-sm text-primary">{formatPrice(item.price)}</span>
                            </div>
                            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
                          </motion.li>
                        ))}
                      </ul>
                    )}

                    <div className="mt-9 flex flex-wrap gap-3">
                      <LuxButton variant="outline" onClick={restart}>
                        <RotateCcw size={16} aria-hidden />
                        Start again
                      </LuxButton>
                      <Link to="/menu" className={luxButton("ember")}>
                        Browse the full menu
                      </Link>
                      <Link to="/reservations" className={luxButton("ghost")}>
                        Book a table
                      </Link>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>
    </>
  );
}
