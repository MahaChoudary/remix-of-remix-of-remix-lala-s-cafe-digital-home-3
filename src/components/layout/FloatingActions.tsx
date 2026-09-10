import { MessageCircle, Phone } from "lucide-react";
import { useSiteSettings } from "@/lib/content";

export function FloatingActions() {
  const siteSettings = useSiteSettings();

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col gap-3">
      <a
        href={`tel:${siteSettings.phone.replace(/\s/g, "")}`}
        aria-label="Call Lala's Cafe"
        className="grid h-12 w-12 place-items-center rounded-full border border-border bg-surface text-foreground shadow-[var(--shadow-soft)] transition-transform hover:-translate-y-0.5 hover:text-primary sm:hidden"
      >
        <Phone size={19} />
      </a>
      <a
        href={`https://wa.me/${siteSettings.whatsapp}`}
        target="_blank"
        rel="noreferrer noopener"
        aria-label="Chat with Lala's Cafe on WhatsApp"
        className="grid h-14 w-14 place-items-center rounded-full bg-[oklch(0.72_0.15_150)] text-[oklch(0.15_0.04_305)] shadow-[0_18px_40px_-16px_oklch(0.72_0.15_150)] transition-transform hover:-translate-y-0.5"
      >
        <MessageCircle size={24} />
      </a>
    </div>
  );
}
