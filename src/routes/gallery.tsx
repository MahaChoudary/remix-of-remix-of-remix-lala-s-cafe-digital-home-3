import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { Reveal } from "@/components/motion/Reveal";
import { useSuspenseQuery } from "@tanstack/react-query";
import { publicContentQuery } from "@/lib/content";
import { photos } from "@/lib/site-content";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Gallery — Lala's Cafe Daska" },
      {
        name: "description",
        content:
          "Photographs of Lala's Cafe in Daska: neon cabanas, the star-light terrace, the mural lounge and the helicopter booth.",
      },
      { property: "og:title", content: "Gallery — Lala's Cafe Daska" },
      {
        property: "og:description",
        content: "Neon cabanas, star lights and hand-built seating — see Lala's Cafe.",
      },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(publicContentQuery),
  component: GalleryPage,
});

function GalleryPage() {
  const { data: content } = useSuspenseQuery(publicContentQuery);
  const images = content.gallery;
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const close = useCallback(() => setOpenIndex(null), []);
  const step = useCallback(
    (dir: number) =>
      setOpenIndex((i) => (i === null ? i : (i + dir + images.length) % images.length)),
    [images.length],
  );

  useEffect(() => {
    if (openIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [openIndex, close, step]);

  const current = openIndex === null ? null : images[openIndex];

  return (
    <>
      <PageHero
        eyebrow="Gallery"
        title="Every corner is a different room."
        intro="Real photographs from inside Lala's — no stock imagery, no filters we didn't earn."
        image={photos.lounge}
        imageAlt="Leather booths in front of a colourful street-art mural at Lala's Cafe"
      />

      <section className="container-lux py-20">
        <div className="columns-1 gap-5 sm:columns-2 lg:columns-3 [&>*]:mb-5">
          {images.map((img, i) => (
            <Reveal key={img.id} delay={Math.min(i * 0.06, 0.4)}>
              <button
                type="button"
                onClick={() => setOpenIndex(i)}
                className="group relative block w-full overflow-hidden rounded-2xl"
                aria-label={`Open photo: ${img.caption ?? img.alt}`}
              >
                <img
                  src={img.url}
                  alt={img.alt}
                  loading="lazy"
                  decoding="async"
                  className="w-full object-cover transition-transform duration-[1100ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05]"
                />
                <span className="veil pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                {img.caption && (
                  <span className="pointer-events-none absolute bottom-4 left-4 translate-y-2 text-sm text-foreground opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                    {img.caption}
                  </span>
                )}
              </button>
            </Reveal>
          ))}
        </div>
      </section>

      <AnimatePresence>
        {current && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={current.caption ?? current.alt}
            className="fixed inset-0 z-[70] flex items-center justify-center bg-background/95 p-4 backdrop-blur-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
          >
            <button
              onClick={close}
              aria-label="Close photo"
              className="absolute right-5 top-5 grid h-11 w-11 place-items-center rounded-full border border-border text-foreground hover:text-primary"
            >
              <X size={18} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                step(-1);
              }}
              aria-label="Previous photo"
              className="absolute left-3 grid h-11 w-11 place-items-center rounded-full border border-border text-foreground hover:text-primary sm:left-8"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                step(1);
              }}
              aria-label="Next photo"
              className="absolute right-3 grid h-11 w-11 place-items-center rounded-full border border-border text-foreground hover:text-primary sm:right-8"
            >
              <ChevronRight size={20} />
            </button>

            <motion.figure
              key={current.id}
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="max-h-[85vh] w-full max-w-4xl"
            >
              <img
                src={current.url}
                alt={current.alt}
                className="max-h-[76vh] w-full rounded-2xl object-contain"
              />
              {current.caption && (
                <figcaption className="mt-4 text-center text-sm text-muted-foreground">
                  {current.caption}
                </figcaption>
              )}
            </motion.figure>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
