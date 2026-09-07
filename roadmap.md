# Lala's Cafe — roadmap

## Done
- Brand system, header, footer, floating WhatsApp/call actions
- Pages: /, /menu, /story, /experience, /gallery, /events, /offers, /visit, /reservations
- Real menu data (21 categories, ~150 items) transcribed from the cafe's boards
- Typed data-access layer (`src/lib/data-source.ts`)

## In progress
- [ ] Missing routes: /contact, /faq, /private-events, /privacy, /terms, /mood-menu, /what-should-i-order

## Blocked — needs the owner to connect the database (Project Settings → Connectors → Supabase)
- [ ] Schema + migrations: site_settings, menu_categories, menu_items, gallery_images, events,
      offers, faqs, reservations, contact_messages, private_event_inquiries, user_roles
- [ ] Seed the existing real content into the database; make it the source of truth
- [ ] RLS: public read of published content, public insert of enquiries, admin-only writes
- [ ] Storage buckets for menu/gallery/event images + admin upload/replace/delete
- [ ] Auth + admin role mechanism; /admin, /admin/login, /admin/dashboard
- [ ] Admin CRUD: categories, items, gallery, events, offers, FAQs, settings,
      reservations, contact messages, private-event inquiries
- [ ] Real persistence for reservations / contact / private events (WhatsApp becomes fallback only)
- [ ] Public pages read from the database via TanStack Query

## Assets
- [ ] Replace the circular "L" header mark with the real supplied logo
- [ ] Confirm the seven cafe photographs render outside Lovable preview

## Missing real-world inputs (do not invent)
- Cafe email address
- Facebook page URL
- Google Maps link
- Event listings
- Food/drink photography for individual menu items
