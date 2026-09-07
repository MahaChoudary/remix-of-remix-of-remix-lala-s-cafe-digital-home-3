-- Roles
CREATE TYPE public.app_role AS ENUM ('admin', 'staff');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT public.has_role(auth.uid(), 'admin')
$$;

CREATE POLICY "Users read own roles" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Admins manage roles" ON public.user_roles FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

-- Site settings
CREATE TABLE public.site_settings (
  id text PRIMARY KEY DEFAULT 'default',
  cafe_name text NOT NULL DEFAULT '',
  tagline text NOT NULL DEFAULT '',
  phone text NOT NULL DEFAULT '',
  whatsapp text NOT NULL DEFAULT '',
  email text,
  address_line text,
  city text NOT NULL DEFAULT '',
  maps_url text,
  hours jsonb NOT NULL DEFAULT '[]'::jsonb,
  socials jsonb NOT NULL DEFAULT '[]'::jsonb,
  logo_url text,
  order_phones jsonb NOT NULL DEFAULT '[]'::jsonb,
  complaint_phone text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.site_settings TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.site_settings TO authenticated;
GRANT ALL ON public.site_settings TO service_role;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read settings" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Admins manage settings" ON public.site_settings FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE TRIGGER site_settings_updated BEFORE UPDATE ON public.site_settings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Menu categories
CREATE TABLE public.menu_categories (
  id text PRIMARY KEY,
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  description text,
  sort_order integer NOT NULL DEFAULT 0,
  is_published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.menu_categories TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.menu_categories TO authenticated;
GRANT ALL ON public.menu_categories TO service_role;
ALTER TABLE public.menu_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read categories" ON public.menu_categories FOR SELECT USING (is_published);
CREATE POLICY "Admins manage categories" ON public.menu_categories FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE TRIGGER menu_categories_updated BEFORE UPDATE ON public.menu_categories FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Menu items
CREATE TABLE public.menu_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id text NOT NULL REFERENCES public.menu_categories(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text NOT NULL DEFAULT '',
  price integer,
  image_url text,
  is_available boolean NOT NULL DEFAULT true,
  is_featured boolean NOT NULL DEFAULT false,
  is_bestseller boolean NOT NULL DEFAULT false,
  is_new boolean NOT NULL DEFAULT false,
  is_published boolean NOT NULL DEFAULT true,
  moods text[] NOT NULL DEFAULT '{}',
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.menu_items TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.menu_items TO authenticated;
GRANT ALL ON public.menu_items TO service_role;
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read items" ON public.menu_items FOR SELECT USING (is_published);
CREATE POLICY "Admins manage items" ON public.menu_items FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE TRIGGER menu_items_updated BEFORE UPDATE ON public.menu_items FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Gallery
CREATE TABLE public.gallery_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  url text NOT NULL,
  alt text NOT NULL DEFAULT '',
  caption text,
  tag text NOT NULL DEFAULT 'ambience',
  sort_order integer NOT NULL DEFAULT 0,
  is_published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.gallery_images TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.gallery_images TO authenticated;
GRANT ALL ON public.gallery_images TO service_role;
ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read gallery" ON public.gallery_images FOR SELECT USING (is_published);
CREATE POLICY "Admins manage gallery" ON public.gallery_images FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE TRIGGER gallery_images_updated BEFORE UPDATE ON public.gallery_images FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Events
CREATE TABLE public.events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  starts_at timestamptz,
  location text,
  image_url text,
  is_published boolean NOT NULL DEFAULT false,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.events TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.events TO authenticated;
GRANT ALL ON public.events TO service_role;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read events" ON public.events FOR SELECT USING (is_published);
CREATE POLICY "Admins manage events" ON public.events FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE TRIGGER events_updated BEFORE UPDATE ON public.events FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Offers
CREATE TABLE public.offers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  terms text,
  valid_until date,
  image_url text,
  is_active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.offers TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.offers TO authenticated;
GRANT ALL ON public.offers TO service_role;
ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read offers" ON public.offers FOR SELECT USING (is_active);
CREATE POLICY "Admins manage offers" ON public.offers FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE TRIGGER offers_updated BEFORE UPDATE ON public.offers FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- FAQs
CREATE TABLE public.faqs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question text NOT NULL,
  answer text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  is_published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.faqs TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.faqs TO authenticated;
GRANT ALL ON public.faqs TO service_role;
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read faqs" ON public.faqs FOR SELECT USING (is_published);
CREATE POLICY "Admins manage faqs" ON public.faqs FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE TRIGGER faqs_updated BEFORE UPDATE ON public.faqs FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Reservations
CREATE TABLE public.reservations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  phone text NOT NULL,
  email text,
  party_size integer NOT NULL,
  reserve_date date NOT NULL,
  reserve_time text NOT NULL,
  seating text,
  notes text,
  status text NOT NULL DEFAULT 'new',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.reservations TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.reservations TO authenticated;
GRANT ALL ON public.reservations TO service_role;
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can request a table" ON public.reservations FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins manage reservations" ON public.reservations FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE TRIGGER reservations_updated BEFORE UPDATE ON public.reservations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Contact messages
CREATE TABLE public.contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  phone text NOT NULL,
  email text,
  subject text NOT NULL,
  message text NOT NULL,
  status text NOT NULL DEFAULT 'new',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.contact_messages TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.contact_messages TO authenticated;
GRANT ALL ON public.contact_messages TO service_role;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can send a message" ON public.contact_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins manage messages" ON public.contact_messages FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE TRIGGER contact_messages_updated BEFORE UPDATE ON public.contact_messages FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Private event inquiries
CREATE TABLE public.private_event_inquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  phone text NOT NULL,
  email text,
  event_type text NOT NULL,
  guests integer NOT NULL,
  event_date date NOT NULL,
  details text,
  status text NOT NULL DEFAULT 'new',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.private_event_inquiries TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.private_event_inquiries TO authenticated;
GRANT ALL ON public.private_event_inquiries TO service_role;
ALTER TABLE public.private_event_inquiries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can enquire" ON public.private_event_inquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins manage enquiries" ON public.private_event_inquiries FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE TRIGGER private_event_inquiries_updated BEFORE UPDATE ON public.private_event_inquiries FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Storage policies for the site-images bucket
CREATE POLICY "Public read site images" ON storage.objects FOR SELECT USING (bucket_id = 'site-images');
CREATE POLICY "Admins upload site images" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'site-images' AND public.is_admin());
CREATE POLICY "Admins update site images" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'site-images' AND public.is_admin());
CREATE POLICY "Admins delete site images" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'site-images' AND public.is_admin());

INSERT INTO public.site_settings (id, cafe_name, tagline, phone, whatsapp, email, address_line, city, maps_url, hours, socials, logo_url, order_phones, complaint_phone) VALUES
('default', 'Lala''s Cafe', 'Indoor & rooftop dining in Daska — foodies welcome here.', '+92 336 7999122', '923414067238', NULL, 'Nisbat Road, next to Just Smile Family Dental Clinic', 'Daska, Punjab', NULL, '[{"label":"Breakfast","value":"7:00 AM onwards"},{"label":"Cafe hours","value":"2:00 PM – 2:00 AM, daily"}]'::jsonb, '[{"label":"TikTok","url":"https://www.tiktok.com/@lalascafedaska"},{"label":"Facebook","url":""}]'::jsonb, '/__l5e/assets-v1/776d4f2e-45de-4124-8448-96397df9294a/lalas-logo.png', '["+92 336 7999122","+92 307 1851212"]'::jsonb, '+92 341 4067238');
INSERT INTO public.menu_categories (id, slug, name, description, sort_order) VALUES
('platters', 'platters', 'Platters', 'Sharing plates built around the world''s flavours.', 1),
('pizza', 'pizza', 'Pizza', 'Small, medium, large — plus pocket and one-metre pizzas.', 2),
('meals', 'meals', 'Fast Food Meals', 'Combo deals for one, two or the whole table.', 3),
('kids', 'kids-meals', 'Kids Meals', 'Little plates for little foodies.', 4),
('burgers', 'burgers', 'Burgers', 'Served with fries.', 5),
('wraps', 'wraps-shawarma', 'Wraps & Shawarma', 'Rolled, wrapped and ready.', 6),
('chinese', 'chinese', 'Chinese', 'Wok-fired classics.', 7),
('rice', 'rice', 'Rice', 'Sides that go with everything.', 8),
('broast', 'broast', 'Broast', 'Crisp fried chicken by the quarter, half or full.', 9),
('wings', 'wings', 'Wings', 'Saucy, smoky and spicy.', 10),
('fish', 'fish', 'Fish', 'From the grill and the fryer.', 11),
('steaks', 'steaks', 'Steaks', 'Chicken steaks with signature sauces.', 12),
('italian', 'italian', 'Italian', 'Chicken done the Italian way.', 13),
('pasta', 'pasta', 'Pasta', 'Creamy, baked and house special.', 14),
('sandwich', 'sandwiches', 'Sandwiches', 'Served with fries.', 15),
('salad', 'salads', 'Salads', 'Fresh and light.', 16),
('soup', 'soup', 'Soup', 'Half and full portions.', 17),
('appetizer', 'appetizers', 'Appetizers', 'Starters, baskets and loaded fries.', 18),
('drinks', 'hot-cold-bar', 'Hot & Cold Bar', 'Mojitos, mocktails, shakes and coffee.', 19),
('juice', 'fresh-juice', 'Fresh Juice', 'Pressed to order.', 20),
('sauce', 'sauces', 'Sauces', 'Add a dip to anything.', 21);
INSERT INTO public.menu_items (category_id, name, description, price, is_available, is_featured, is_bestseller, is_new, moods, sort_order) VALUES
('platters', 'Malaysia Express', 'Chicken Manchurian, egg fried rice, 2 honey wings, 1 tin pack.', 999, true, true, true, false, ARRAY['savoury','comfort']::text[], 1),
('platters', 'Hong Kong Express', 'Red dragon chicken, chicken chow mein, vegetable rice, fresh lime.', 1199, true, false, false, false, ARRAY['savoury']::text[], 2),
('platters', 'Thailand Express', 'Chicken chilli dry, chicken chow mein, egg fried rice, 1.5 ltr drink.', 1150, true, false, false, false, ARRAY['savoury']::text[], 3),
('platters', 'China Express', 'Mongolian chicken, kung pao chicken, vegetable rice, egg fried rice, 1.5 ltr drink.', 1299, true, false, false, false, ARRAY['savoury']::text[], 4),
('platters', 'Royal Express', 'Chicken cashew nut, masala rice, 4 honey wings, mint margarita.', 1099, true, false, false, false, ARRAY['savoury','comfort']::text[], 5),
('pizza', 'Pocket Pizza', 'Handheld pizza pocket.', 399, true, false, false, false, ARRAY['savoury']::text[], 6),
('pizza', 'Special Pocket Pizza', 'Loaded pizza pocket.', 499, true, false, false, false, ARRAY['savoury']::text[], 7),
('pizza', '1 Meter Pizza', 'A full metre of pizza built for the table.', 2999, true, true, true, false, ARRAY['savoury','comfort']::text[], 8),
('pizza', 'Prawn Pizza', 'Small 1200 · Medium 2000 · Large 2850.', 1200, true, false, false, false, ARRAY['savoury']::text[], 9),
('pizza', 'Chicken Patty Pizza', 'Small 700 · Medium 1200 · Large 1800.', 700, true, false, false, false, ARRAY['savoury']::text[], 10),
('pizza', 'Beef Patty Pizza', 'Small 800 · Medium 1300 · Large 1900.', 800, true, false, false, false, ARRAY['savoury']::text[], 11),
('pizza', 'Malai Botti Pizza', 'Small 900 · Medium 1350 · Large 1750.', 900, true, false, false, false, ARRAY['savoury','comfort']::text[], 12),
('pizza', 'Pepperoni Pizza', 'Small 850 · Medium 1350 · Large 1750.', 850, true, false, false, false, ARRAY['savoury']::text[], 13),
('pizza', 'Donner Pizza', 'Medium 1450 · Large 1850.', 1450, true, false, false, false, ARRAY['savoury']::text[], 14),
('pizza', 'Cheese Crust Pizza', 'Small 800 · Medium 1350 · Large 1750.', 800, true, false, false, false, ARRAY['comfort']::text[], 15),
('pizza', 'Chicken Tikka Pizza', 'Small 700 · Medium 1200 · Large 1600.', 700, true, false, false, false, ARRAY['savoury']::text[], 16),
('pizza', 'Fajita Pizza', 'Small 700 · Medium 1200 · Large 1600.', 700, true, false, false, false, ARRAY['savoury']::text[], 17),
('pizza', 'Chicken Hot & Spicy Pizza', 'Small 750 · Medium 1250 · Large 1650.', 750, true, false, false, false, ARRAY['energy','savoury']::text[], 18),
('pizza', 'Bone Fire Pizza', 'Small 700 · Medium 1200 · Large 1600.', 700, true, false, false, false, ARRAY['savoury']::text[], 19),
('pizza', 'Smokey Pizza', 'Small 700 · Medium 1250 · Large 1600.', 700, true, false, false, false, ARRAY['savoury']::text[], 20),
('pizza', 'Chicken Tandoori Pizza', 'Small 750 · Medium 1250 · Large 1650.', 750, true, false, false, false, ARRAY['savoury']::text[], 21),
('pizza', 'Mexican Pizza', 'Small 700 · Medium 1200 · Large 1600.', 700, true, false, false, false, ARRAY['energy','savoury']::text[], 22),
('pizza', 'Cheese Lover Pizza', 'Small 800 · Medium 1300 · Large 1700.', 800, true, false, false, false, ARRAY['comfort']::text[], 23),
('pizza', 'Cheese Stick', 'Baked cheese sticks.', 700, true, false, false, false, ARRAY['comfort']::text[], 24),
('meals', 'Meal 1', '1 small pizza, 2 nuggets, 2 hot wings, 1 tin pack drink, 1 reg. fries.', 1150, true, false, false, false, ARRAY['comfort']::text[], 25),
('meals', 'Meal 2', '1 zinger burger, 1 shawarma, 1 tin pack drink, 1 reg. fries.', 950, true, false, false, false, ARRAY['comfort']::text[], 26),
('meals', 'Meal 3', '1 zinger burger, 1 small pizza, 5 hot wings, 1 ltr drink, 1 reg. fries.', 1650, true, false, false, false, ARRAY['comfort']::text[], 27),
('meals', 'Meal 4', '1 medium pizza, 2 zinger burgers, 1 loaded fries, 1 ltr drink, 1 reg. fries.', 2500, true, false, false, false, ARRAY['comfort']::text[], 28),
('meals', 'Meal 5', '1 large pizza, 5 hot wings, 5 nuggets, 1.5 ltr drink, 1 reg. fries.', 2850, true, false, false, false, ARRAY['comfort']::text[], 29),
('meals', 'Meal 6', '1 medium pizza, 1 small pizza, 1 loaded fries, 1 ltr drink.', 2750, true, false, false, false, ARRAY['comfort']::text[], 30),
('meals', 'Meal 7', '1 zinger burger, 1 reg. fries, 1 drink.', 700, true, false, false, false, ARRAY['comfort']::text[], 31),
('meals', 'Meal 8', '1 wrap, 1 tikka paratha roll, 1 hf. ltr drink, 1 reg. fries.', 1050, true, false, false, false, ARRAY['comfort']::text[], 32),
('kids', 'Chotu Express', '1 mini burger, 2 nuggets, 2 wings, 1 reg. fries.', 750, true, false, false, false, ARRAY['comfort']::text[], 33),
('kids', 'Junior Star', '4 nuggets, 4 wings, 1 reg. fries.', 599, true, false, false, false, ARRAY['comfort']::text[], 34),
('kids', 'Motu Patlu', '2 mini burgers, 8 nuggets, 4 honey wings, 1 reg. fries.', 1150, true, false, false, false, ARRAY['comfort']::text[], 35),
('kids', 'Mickey Mouse', '4 mini burgers, 10 nuggets, 6 crispy wings, 1 reg. fries.', 1850, true, false, false, false, ARRAY['comfort']::text[], 36),
('burgers', 'Lacha Pratha Burger', 'House special burger.', 750, true, false, false, false, ARRAY['savoury']::text[], 37),
('burgers', 'Japanese Cheese Burger', 'House special burger.', 999, true, false, false, false, ARRAY['comfort']::text[], 38),
('burgers', 'Malaysia Banjo Burger', 'House special burger.', 750, true, false, false, false, ARRAY['savoury']::text[], 39),
('burgers', 'Spicy Fillet Burger', 'Served with fries.', 750, true, false, false, false, ARRAY['energy']::text[], 40),
('burgers', 'Beef Smash Burger', 'Served with fries.', 1150, true, false, false, false, ARRAY['savoury']::text[], 41),
('burgers', 'Mighty Burger', 'Served with fries.', 750, true, false, false, false, ARRAY['comfort']::text[], 42),
('burgers', 'Fish Burger', 'Served with fries.', 750, true, false, false, false, ARRAY['savoury']::text[], 43),
('burgers', 'Swiss Mushroom Burger', 'Served with fries.', 1050, true, false, false, false, ARRAY['comfort']::text[], 44),
('burgers', 'Chilli Cheetos Burger', 'Served with fries.', 650, true, false, false, false, ARRAY['energy']::text[], 45),
('burgers', 'Zinger Burger', 'Served with fries.', 450, true, true, true, false, ARRAY['comfort']::text[], 46),
('wraps', 'Mexican Wrap', 'Served with fries.', 599, true, false, false, false, ARRAY['energy']::text[], 47),
('wraps', 'Grill Chicken Wrap', 'Served with fries.', 500, true, false, false, false, ARRAY['savoury']::text[], 48),
('wraps', 'Fajita Wrap', 'Served with fries.', 550, true, false, false, false, ARRAY['savoury']::text[], 49),
('wraps', 'Chicken Shawarma', 'Classic shawarma.', 300, true, false, false, false, ARRAY['savoury']::text[], 50),
('wraps', 'Zinger Shawarma', 'Crispy zinger shawarma.', 350, true, false, false, false, ARRAY['comfort']::text[], 51),
('wraps', 'Turkish Wrap', 'Served with fries.', 700, true, false, false, false, ARRAY['savoury']::text[], 52),
('wraps', 'Tikka Paratha Roll', 'Paratha roll.', 350, true, false, false, false, ARRAY['savoury']::text[], 53),
('wraps', 'Special Paratha Roll', 'Loaded paratha roll.', 450, true, false, false, false, ARRAY['savoury']::text[], 54),
('wraps', 'Twister', 'Twister wrap.', 400, true, false, false, false, ARRAY['savoury']::text[], 55),
('chinese', 'Chicken Chilli Dry', 'Wok-fired chilli chicken.', 1250, true, false, false, false, ARRAY['energy','savoury']::text[], 56),
('chinese', 'Chicken Manchurian', 'Chinese classic.', 1250, true, false, false, false, ARRAY['savoury']::text[], 57),
('chinese', 'Chicken Cashew Nut', 'Chinese classic.', 1250, true, false, false, false, ARRAY['savoury']::text[], 58),
('chinese', 'Kung Pao Chicken', 'Chinese classic.', 1200, true, false, false, false, ARRAY['energy']::text[], 59),
('chinese', 'Red Dragon Chicken', 'Chinese classic.', 1250, true, false, false, false, ARRAY['energy']::text[], 60),
('chinese', 'Mongolian Chicken', 'Chinese classic.', 1275, true, false, false, false, ARRAY['savoury']::text[], 61),
('chinese', 'Black Pepper Chicken', 'Chinese classic.', 1299, true, false, false, false, ARRAY['savoury']::text[], 62),
('chinese', 'Lala Special Chow Mein', 'House chow mein.', 1399, true, true, true, false, ARRAY['comfort']::text[], 63),
('chinese', 'Chicken Chow Mein', 'Classic chow mein.', 1099, true, false, false, false, ARRAY['comfort']::text[], 64),
('chinese', 'Chicken Momos (6 pcs)', 'Steamed momos.', 799, true, false, false, false, ARRAY['comfort']::text[], 65),
('rice', 'Vegetable Rice', 'Wok-tossed vegetable rice.', 750, true, false, false, false, ARRAY['comfort']::text[], 66),
('rice', 'Egg Fried Rice', 'Classic egg fried rice.', 750, true, false, false, false, ARRAY['comfort']::text[], 67),
('rice', 'Masala Rice', 'Spiced masala rice.', 899, true, false, false, false, ARRAY['energy']::text[], 68),
('broast', 'Quarter Broast', 'Crisp fried chicken.', 750, true, false, false, false, ARRAY['comfort']::text[], 69),
('broast', 'Half Broast', 'Crisp fried chicken.', 1399, true, false, false, false, ARRAY['comfort']::text[], 70),
('broast', 'Full Broast', 'Crisp fried chicken.', 2450, true, false, false, false, ARRAY['comfort']::text[], 71),
('wings', 'King Jaon Dynamite Wings (6 pcs)', 'Fiery dynamite glaze.', 899, true, false, false, false, ARRAY['energy']::text[], 72),
('wings', 'Hot Buffalo Wings (6 pcs)', 'Classic buffalo heat.', 799, true, false, false, false, ARRAY['energy']::text[], 73),
('wings', 'Smoky Ranch Wings (6 pcs)', 'Smoky ranch coating.', 799, true, false, false, false, ARRAY['savoury']::text[], 74),
('wings', 'Honey BBQ Wings (6 pcs)', 'Sweet and smoky.', 750, true, false, false, false, ARRAY['sweet','savoury']::text[], 75),
('wings', 'Crispy Wings (10 pcs)', 'Plain crispy wings.', 750, true, false, false, false, ARRAY['comfort']::text[], 76),
('fish', 'Mexican Salsa Fish', 'Grilled fish with Mexican salsa. Ask us for today''s price.', NULL, true, false, false, false, ARRAY['energy']::text[], 77),
('fish', 'Grill Fish with Lemon Butter Sauce', 'Ask us for today''s price.', NULL, true, false, false, false, ARRAY['savoury']::text[], 78),
('fish', 'Grill Fish with Jalapeno Sauce', 'Ask us for today''s price.', NULL, true, false, false, false, ARRAY['energy']::text[], 79),
('fish', 'Fish & Chips', 'Fried fish with chips.', 1350, true, false, false, false, ARRAY['comfort']::text[], 80),
('fish', 'Finger Fish (8 pcs)', 'Crisp fish fingers.', 1299, true, false, false, false, ARRAY['comfort']::text[], 81),
('steaks', 'Mexican Chicken Steak', 'Chicken steak with Mexican sauce.', 1599, true, false, false, false, ARRAY['energy']::text[], 82),
('steaks', 'Mushroom Chicken Steak', 'Chicken steak with mushroom sauce.', 1499, true, false, false, false, ARRAY['comfort']::text[], 83),
('steaks', 'American Chicken Steak', 'Chicken steak, American style.', 1599, true, false, false, false, ARRAY['savoury']::text[], 84),
('steaks', 'Tarragon Chicken Steak', 'Chicken steak with tarragon sauce.', 1499, true, false, false, false, ARRAY['savoury']::text[], 85),
('steaks', 'Moroccan Chicken Steak', 'Chicken steak, Moroccan spices.', 1499, true, false, false, false, ARRAY['energy']::text[], 86),
('italian', 'Parmesan Chicken', 'Italian style chicken.', 1050, true, false, false, false, ARRAY['comfort']::text[], 87),
('italian', 'Swiss Polo Chicken', 'Italian style chicken.', 1350, true, false, false, false, ARRAY['comfort']::text[], 88),
('italian', 'Stuffed Chicken', 'Italian style stuffed chicken.', 1399, true, false, false, false, ARRAY['comfort']::text[], 89),
('pasta', 'Alfredo Pasta', 'Creamy alfredo.', 1050, true, false, false, false, ARRAY['comfort']::text[], 90),
('pasta', 'South Bake Pasta', 'Oven-baked pasta.', 999, true, false, false, false, ARRAY['comfort']::text[], 91),
('pasta', 'Lala''s Special Pasta', 'House special pasta.', 1199, true, true, true, false, ARRAY['comfort']::text[], 92),
('sandwich', 'Grill Chicken Cheese Sandwich', 'Served with fries.', 750, true, false, false, false, ARRAY['comfort']::text[], 93),
('sandwich', 'Club Sandwich', 'Served with fries.', 850, true, false, false, false, ARRAY['comfort']::text[], 94),
('sandwich', 'Lala''s Special Sandwich', 'Served with fries.', 1099, true, false, false, false, ARRAY['comfort']::text[], 95),
('salad', 'Lala''s Special Salad', 'House salad.', 1099, true, false, false, false, ARRAY['refreshing']::text[], 96),
('salad', 'Chicken Caesar Salad', 'Classic caesar.', 1050, true, false, false, false, ARRAY['refreshing']::text[], 97),
('salad', 'Russian Salad', 'Creamy Russian salad.', 899, true, false, false, false, ARRAY['refreshing']::text[], 98),
('soup', 'Hot & Sour Soup', 'Half 750 · Full 1250.', 750, true, false, false, false, ARRAY['comfort']::text[], 99),
('soup', 'Corn Soup', 'Half 750 · Full 1250.', 750, true, false, false, false, ARRAY['comfort']::text[], 100),
('soup', 'Lala''s Special Soup', 'Half 799 · Full 1399.', 799, true, false, false, false, ARRAY['comfort']::text[], 101),
('appetizer', 'Stuffed Peri Peri Chicken', 'Peri peri stuffed chicken.', 1199, true, false, false, false, ARRAY['energy']::text[], 102),
('appetizer', 'Dynamite Chicken (10 pcs)', 'Spicy dynamite chicken.', 899, true, false, false, false, ARRAY['energy']::text[], 103),
('appetizer', 'Chicken Nuggets (10 pcs)', 'Crispy nuggets.', 699, true, false, false, false, ARRAY['comfort']::text[], 104),
('appetizer', 'Dynamite Prawns (6 pcs)', 'Spicy dynamite prawns.', 1599, true, false, false, false, ARRAY['energy']::text[], 105),
('appetizer', 'Tempura Prawns (6 pcs)', 'Crisp tempura prawns.', 1599, true, false, false, false, ARRAY['savoury']::text[], 106),
('appetizer', 'Cheesy Sticks (6 pcs)', 'Molten cheese sticks.', 799, true, false, false, false, ARRAY['comfort']::text[], 107),
('appetizer', 'Loaded Cheese Fries', 'Fries loaded with cheese.', 750, true, false, false, false, ARRAY['comfort']::text[], 108),
('appetizer', 'French Fries Basket', 'Classic fries basket.', 350, true, false, false, false, ARRAY['comfort']::text[], 109),
('appetizer', 'Crispy Loaded Fries', 'Crispy loaded fries.', 750, true, false, false, false, ARRAY['comfort']::text[], 110),
('appetizer', 'Fish Cracker Basket', 'Crisp fish crackers.', 350, true, false, false, false, ARRAY['savoury']::text[], 111),
('appetizer', 'Cheesy Bites', 'Bite-size cheese pops.', 700, true, false, false, false, ARRAY['comfort']::text[], 112),
('drinks', 'Pina Colada American', 'Creamy pina colada.', 400, true, false, false, false, ARRAY['refreshing','sweet']::text[], 113),
('drinks', 'Pina Colada Blue', 'Blue pina colada.', 380, true, false, false, false, ARRAY['refreshing','sweet']::text[], 114),
('drinks', 'Peach Smoothie', 'Peach smoothie.', 400, true, false, false, false, ARRAY['refreshing']::text[], 115),
('drinks', 'Blue Lagoon', 'Blue citrus cooler.', 430, true, false, false, false, ARRAY['refreshing']::text[], 116),
('drinks', 'Pink Lady', 'Pink berry cooler.', 350, true, false, false, false, ARRAY['refreshing','sweet']::text[], 117),
('drinks', 'Peach Mojito', 'Peach mojito.', 300, true, false, false, false, ARRAY['refreshing']::text[], 118),
('drinks', 'Strawberry Mojito', 'Strawberry mojito.', 320, true, false, false, false, ARRAY['refreshing']::text[], 119),
('drinks', 'Mango Mojito', 'Mango mojito.', 340, true, false, false, false, ARRAY['refreshing']::text[], 120),
('drinks', 'Mint Mojito', 'Classic mint mojito.', 350, true, true, true, false, ARRAY['refreshing']::text[], 121),
('drinks', 'Orange Margarita', 'Orange margarita mocktail.', 350, true, false, false, false, ARRAY['refreshing']::text[], 122),
('drinks', 'Fresh Lime', 'Fresh lime soda.', 280, true, false, false, false, ARRAY['refreshing']::text[], 123),
('drinks', 'Cold Coffee', 'Iced cold coffee.', 500, true, false, false, false, ARRAY['energy']::text[], 124),
('drinks', 'Ice Cream Shake', 'Thick ice cream shake.', 400, true, false, false, false, ARRAY['sweet']::text[], 125),
('drinks', 'Milk Shake', 'Classic milkshake.', 300, true, false, false, false, ARRAY['sweet']::text[], 126),
('drinks', 'Dry Fruit Shake', 'Loaded dry fruit shake.', 600, true, false, false, false, ARRAY['sweet','comfort']::text[], 127),
('drinks', 'Kit Kat Shake', 'Chocolate wafer shake.', 500, true, false, false, false, ARRAY['sweet']::text[], 128),
('drinks', 'Oreo Shake', 'Cookies and cream shake.', 500, true, false, false, false, ARRAY['sweet']::text[], 129),
('drinks', 'Mango Shake', 'Fresh mango shake.', 350, true, false, false, false, ARRAY['sweet','refreshing']::text[], 130),
('drinks', 'Green Apple Mocktail', 'Green apple mocktail.', 600, true, false, false, false, ARRAY['refreshing']::text[], 131),
('drinks', 'Lichi Fizz', 'Fizzy lychee cooler.', 400, true, false, false, false, ARRAY['refreshing']::text[], 132),
('juice', 'Apple Juice', 'Freshly pressed.', 300, true, false, false, false, ARRAY['refreshing']::text[], 133),
('juice', 'Strawberry Juice', 'Freshly pressed.', 250, true, false, false, false, ARRAY['refreshing']::text[], 134),
('juice', 'Orange Juice', 'Freshly pressed.', 350, true, false, false, false, ARRAY['refreshing']::text[], 135),
('juice', 'Mango Juice', 'Freshly pressed.', 350, true, false, false, false, ARRAY['refreshing']::text[], 136),
('sauce', 'Cocktail Sauce', 'Dip.', 90, true, false, false, false, ARRAY['savoury']::text[], 137),
('sauce', 'BBQ Sauce', 'Dip.', 90, true, false, false, false, ARRAY['savoury']::text[], 138),
('sauce', 'Mustard Sauce', 'Dip.', 140, true, false, false, false, ARRAY['savoury']::text[], 139),
('sauce', 'Dynamite Sauce', 'Dip.', 90, true, false, false, false, ARRAY['energy']::text[], 140),
('sauce', 'Garlic Sauce', 'Dip.', 90, true, false, false, false, ARRAY['savoury']::text[], 141),
('sauce', 'Mayonnaise Sauce', 'Dip.', 90, true, false, false, false, ARRAY['comfort']::text[], 142);
INSERT INTO public.gallery_images (url, alt, caption, tag, sort_order) VALUES
('/__l5e/assets-v1/01aef015-b22f-4cd6-8157-91b2c30b32a4/cafe-2.jpg', 'Lit-up wooden helicopter seating installation at Lala''s Cafe', 'The helicopter booth', 'ambience', 1),
('/__l5e/assets-v1/f2523342-d958-47ea-9378-4b4e28c07ccb/cafe-3.jpg', 'White slatted private cabana with neon trim and hanging plants', 'Private cabanas', 'ambience', 2),
('/__l5e/assets-v1/18176976-be3f-41a3-8983-e121bcef1a49/cafe-7.jpg', 'Brown leather booths in front of a painted street-art mural', 'Mural lounge', 'ambience', 3),
('/__l5e/assets-v1/dba86b00-7019-4b34-9265-e42153c9afb2/cafe-6.jpg', 'Terrace walkway strung with star and moon fairy lights', 'Star-light terrace', 'ambience', 4),
('/__l5e/assets-v1/6c0e6738-46d7-40e9-9046-23e57ae5b6b4/cafe-5.jpg', 'Colourful pergola bench under neon light beside a calligraphy wall piece', 'Courtyard pergola', 'ambience', 5),
('/__l5e/assets-v1/416312f4-44c1-4c2c-9c2d-b610efeb767c/cafe-1.jpg', 'Entrance hallway with a vine-covered wooden ceiling and warm pendant lights', 'The welcome', 'ambience', 6);
INSERT INTO public.offers (title, description, terms, valid_until, is_active) VALUES
('Free home delivery', 'Order by phone and we deliver around Daska free of charge.', 'As printed on the cafe''s menu board.', NULL, true);
INSERT INTO public.faqs (question, answer, sort_order) VALUES
('Where exactly is Lala''s Cafe?', 'Nisbat Road in Daska, right next to Just Smile Family Dental Clinic. Look for the lit entrance with the vine-covered ceiling.', 1),
('What time are you open?', 'Breakfast: 7:00 AM onwards · Cafe hours: 2:00 PM – 2:00 AM, daily', 2),
('Do I need to book a table?', 'Walk-ins are welcome. For weekends, larger groups or a specific spot such as a cabana or the rooftop, send a table request and we''ll confirm it with you.', 3),
('Is my table request confirmed straight away?', 'No. A request reaches the team and someone replies to confirm it. Until you hear back, the table isn''t held.', 4),
('Do you deliver?', 'Yes — free home delivery around Daska. Call +92 336 7999122 or +92 307 1851212 to place an order.', 5),
('What seating is there?', 'Indoor lounge booths, private cabanas, a courtyard pergola, the star-light terrace and the helicopter booth. Tell us which you''d like when you request a table.', 6),
('Can you host a birthday or a private gathering?', 'Yes. Send a private-event enquiry with your date, guest count and what you have in mind, and the team will work out the details with you directly.', 7),
('I have an allergy — can you help?', 'Tell us before you order. Our kitchen prepares dishes side by side so we can''t promise a dish is free of any ingredient, but we''ll always tell you honestly what we can do.', 8),
('Something went wrong. Who do I speak to?', 'Call the complaints line on +92 341 4067238 and it goes straight to management.', 9);