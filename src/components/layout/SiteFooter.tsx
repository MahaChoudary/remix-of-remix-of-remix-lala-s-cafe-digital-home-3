import { Link } from "@tanstack/react-router";
import { Phone, MapPin, Clock } from "lucide-react";
import { useSiteSettings } from "@/lib/content";

const columns = [
  {
    title: "Explore",
    links: [
      { to: "/menu", label: "Menu" },
      { to: "/experience", label: "Experience" },
      { to: "/gallery", label: "Gallery" },
      { to: "/story", label: "Our Story" },
    ],
  },
  {
    title: "Plan a visit",
    links: [
      { to: "/reservations", label: "Reservations" },
      { to: "/private-events", label: "Private Events" },
      { to: "/visit", label: "Visit Us" },
      { to: "/contact", label: "Contact" },
    ],
  },
  {
    title: "More",
    links: [
      { to: "/events", label: "Events" },
      { to: "/offers", label: "Offers" },
      { to: "/faq", label: "FAQ" },
      { to: "/mood-menu", label: "Mood Menu" },
    ],
  },
] as const;

export function SiteFooter() {
  const siteSettings = useSiteSettings();
  const socials = siteSettings.socials.filter((s) => s.url);

  return (
    <footer className="border-t border-border bg-surface/40">
      <div className="container-lux grid gap-12 py-16 md:grid-cols-[1.3fr_repeat(3,1fr)]">
        <div>
          <p className="font-display text-2xl">{siteSettings.cafeName}</p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground">
            {siteSettings.tagline}
          </p>
          <div className="mt-6 space-y-2 text-sm text-muted-foreground">
            <p className="flex items-center gap-2">
              <Phone size={15} className="text-primary" />
              <a href={`tel:${siteSettings.phone.replace(/\s/g, "")}`} className="hover:text-primary">
                {siteSettings.phone}
              </a>
            </p>
            <p className="flex items-center gap-2">
              <MapPin size={15} className="text-primary" />
              {siteSettings.city}
            </p>
            {siteSettings.hours.map((h) => (
              <p key={h.label} className="flex items-center gap-2">
                <Clock size={15} className="text-primary" />
                {h.label}: {h.value}
              </p>
            ))}
          </div>
          {socials.length > 0 && (
            <div className="mt-6 flex gap-3">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="rounded-full border border-border px-4 py-2 text-xs tracking-wide transition-colors hover:border-primary hover:text-primary"
                >
                  {s.label}
                </a>
              ))}
            </div>
          )}
        </div>

        {columns.map((col) => (
          <div key={col.title}>
            <p className="text-eyebrow">{col.title}</p>
            <ul className="mt-5 space-y-3 text-sm">
              {col.links.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="text-muted-foreground transition-colors hover:text-primary">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-border/70">
        <div className="container-lux flex flex-col gap-3 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} {siteSettings.cafeName}. All rights reserved.</p>
          <div className="flex gap-5">
            <Link to="/privacy" className="hover:text-primary">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-primary">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
