import { Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { luxButton } from "@/components/ui-kit/Button";
import { photos } from "@/lib/site-content";
import { useSiteSettings } from "@/lib/content";

const primaryLinks = [
  { to: "/menu", label: "Menu" },
  { to: "/experience", label: "Experience" },
  { to: "/gallery", label: "Gallery" },
  { to: "/events", label: "Events" },
  { to: "/offers", label: "Offers" },
  { to: "/visit", label: "Visit" },
] as const;

const secondaryLinks = [
  { to: "/story", label: "Our Story" },
  { to: "/mood-menu", label: "Mood Menu" },
  { to: "/what-should-i-order", label: "What Should I Order?" },
  { to: "/private-events", label: "Private Events" },
  { to: "/contact", label: "Contact" },
  { to: "/faq", label: "FAQ" },
] as const;

export function SiteHeader() {
  const siteSettings = useSiteSettings();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-background/85 backdrop-blur-xl border-b border-border/70"
          : "bg-transparent"
      }`}
    >
      <nav
        aria-label="Main"
        className="container-lux flex h-[72px] items-center justify-between gap-4"
      >
        <Link to="/" className="flex items-center gap-3" aria-label="Lala's Cafe home">
          <img
            src={siteSettings.logoUrl || photos.logo}
            alt=""
            aria-hidden="true"
            width={44}
            height={44}
            className="h-11 w-11 rounded-full object-cover"
          />
          <span className="font-display text-lg leading-none tracking-tight">
            {siteSettings.cafeName}
            <span className="mt-1 block text-[0.6rem] font-sans tracking-[0.28em] text-muted-foreground uppercase">
              Daska
            </span>
          </span>
        </Link>

        <div className="hidden items-center gap-7 lg:flex">
          {primaryLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="relative text-sm text-foreground/75 transition-colors hover:text-primary"
              activeProps={{ className: "text-primary" }}
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Link to="/reservations" className={luxButton("ember", "hidden px-6 py-2.5 sm:inline-flex")}>
            Reserve a table
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
            className="grid h-11 w-11 place-items-center rounded-full border border-border text-foreground transition-colors hover:border-primary hover:text-primary"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="max-h-[calc(100vh-72px)] overflow-y-auto border-t border-border bg-background/98 backdrop-blur-xl"
          >
            <div className="container-lux grid gap-1 py-6 sm:grid-cols-2">
              {[...primaryLinks, ...secondaryLinks].map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  onClick={() => setOpen(false)}
                  className="rounded-xl px-4 py-3.5 font-display text-lg text-foreground/85 transition-colors hover:bg-surface hover:text-primary"
                  activeProps={{ className: "text-primary" }}
                >
                  {l.label}
                </Link>
              ))}
              <Link
                to="/reservations"
                onClick={() => setOpen(false)}
                className={luxButton("ember", "mt-3 w-full sm:hidden")}
              >
                Reserve a table
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
