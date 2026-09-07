import type {
  CafeEvent,
  GalleryImage,
  MenuCategory,
  MenuItem,
  MoodTag,
  Offer,
  SiteSettings,
} from "./types";

import cafe1 from "@/assets/cafe-1.jpg.asset.json";
import cafe2 from "@/assets/cafe-2.jpg.asset.json";
import cafe3 from "@/assets/cafe-3.jpg.asset.json";
import cafe5 from "@/assets/cafe-5.jpg.asset.json";
import cafe6 from "@/assets/cafe-6.jpg.asset.json";
import cafe7 from "@/assets/cafe-7.jpg.asset.json";
import logo from "@/assets/lalas-logo.png.asset.json";

/**
 * SINGLE SOURCE OF TRUTH for content the cafe supplied.
 * Menu data below is transcribed from the cafe's printed menu boards.
 * Anything not supplied is left blank on purpose.
 */

export const photos = {
  entrance: cafe1.url,
  helipad: cafe2.url,
  cabana: cafe3.url,
  courtyard: cafe5.url,
  terrace: cafe6.url,
  lounge: cafe7.url,
  logo: logo.url,
};

export const siteSettings: SiteSettings = {
  cafeName: "Lala's Cafe",
  tagline: "Indoor & rooftop dining in Daska — foodies welcome here.",
  phone: "+92 336 7999122",
  whatsapp: "923414067238",
  email: "",
  addressLine: "Nisbat Road, next to Just Smile Family Dental Clinic",
  city: "Daska, Punjab",
  mapsUrl: "",
  hours: [
    { label: "Breakfast", value: "7:00 AM onwards" },
    { label: "Cafe hours", value: "2:00 PM – 2:00 AM, daily" },
  ],
  socials: [
    { label: "TikTok", url: "https://www.tiktok.com/@lalascafedaska" },
    { label: "Facebook", url: "" }, // awaiting the cafe's page link
  ],
};

/** Extra numbers printed on the cafe's menu board. */
export const orderPhones = ["+92 336 7999122", "+92 307 1851212"];
export const complaintPhone = "+92 341 4067238";

export const menuCategories: MenuCategory[] = [
  { id: "platters", slug: "platters", name: "Platters", description: "Sharing plates built around the world's flavours.", sortOrder: 1 },
  { id: "pizza", slug: "pizza", name: "Pizza", description: "Small, medium, large — plus pocket and one-metre pizzas.", sortOrder: 2 },
  { id: "meals", slug: "meals", name: "Fast Food Meals", description: "Combo deals for one, two or the whole table.", sortOrder: 3 },
  { id: "kids", slug: "kids-meals", name: "Kids Meals", description: "Little plates for little foodies.", sortOrder: 4 },
  { id: "burgers", slug: "burgers", name: "Burgers", description: "Served with fries.", sortOrder: 5 },
  { id: "wraps", slug: "wraps-shawarma", name: "Wraps & Shawarma", description: "Rolled, wrapped and ready.", sortOrder: 6 },
  { id: "chinese", slug: "chinese", name: "Chinese", description: "Wok-fired classics.", sortOrder: 7 },
  { id: "rice", slug: "rice", name: "Rice", description: "Sides that go with everything.", sortOrder: 8 },
  { id: "broast", slug: "broast", name: "Broast", description: "Crisp fried chicken by the quarter, half or full.", sortOrder: 9 },
  { id: "wings", slug: "wings", name: "Wings", description: "Saucy, smoky and spicy.", sortOrder: 10 },
  { id: "fish", slug: "fish", name: "Fish", description: "From the grill and the fryer.", sortOrder: 11 },
  { id: "steaks", slug: "steaks", name: "Steaks", description: "Chicken steaks with signature sauces.", sortOrder: 12 },
  { id: "italian", slug: "italian", name: "Italian", description: "Chicken done the Italian way.", sortOrder: 13 },
  { id: "pasta", slug: "pasta", name: "Pasta", description: "Creamy, baked and house special.", sortOrder: 14 },
  { id: "sandwich", slug: "sandwiches", name: "Sandwiches", description: "Served with fries.", sortOrder: 15 },
  { id: "salad", slug: "salads", name: "Salads", description: "Fresh and light.", sortOrder: 16 },
  { id: "soup", slug: "soup", name: "Soup", description: "Half and full portions.", sortOrder: 17 },
  { id: "appetizer", slug: "appetizers", name: "Appetizers", description: "Starters, baskets and loaded fries.", sortOrder: 18 },
  { id: "drinks", slug: "hot-cold-bar", name: "Hot & Cold Bar", description: "Mojitos, mocktails, shakes and coffee.", sortOrder: 19 },
  { id: "juice", slug: "fresh-juice", name: "Fresh Juice", description: "Pressed to order.", sortOrder: 20 },
  { id: "sauce", slug: "sauces", name: "Sauces", description: "Add a dip to anything.", sortOrder: 21 },
];

type Row = [category: string, name: string, price: number | null, description: string, moods: MoodTag[]];

const rows: Row[] = [
  // Platters
  ["platters", "Malaysia Express", 999, "Chicken Manchurian, egg fried rice, 2 honey wings, 1 tin pack.", ["savoury", "comfort"]],
  ["platters", "Hong Kong Express", 1199, "Red dragon chicken, chicken chow mein, vegetable rice, fresh lime.", ["savoury"]],
  ["platters", "Thailand Express", 1150, "Chicken chilli dry, chicken chow mein, egg fried rice, 1.5 ltr drink.", ["savoury"]],
  ["platters", "China Express", 1299, "Mongolian chicken, kung pao chicken, vegetable rice, egg fried rice, 1.5 ltr drink.", ["savoury"]],
  ["platters", "Royal Express", 1099, "Chicken cashew nut, masala rice, 4 honey wings, mint margarita.", ["savoury", "comfort"]],
  // Pizza
  ["pizza", "Pocket Pizza", 399, "Handheld pizza pocket.", ["savoury"]],
  ["pizza", "Special Pocket Pizza", 499, "Loaded pizza pocket.", ["savoury"]],
  ["pizza", "1 Meter Pizza", 2999, "A full metre of pizza built for the table.", ["savoury", "comfort"]],
  ["pizza", "Prawn Pizza", 1200, "Small 1200 · Medium 2000 · Large 2850.", ["savoury"]],
  ["pizza", "Chicken Patty Pizza", 700, "Small 700 · Medium 1200 · Large 1800.", ["savoury"]],
  ["pizza", "Beef Patty Pizza", 800, "Small 800 · Medium 1300 · Large 1900.", ["savoury"]],
  ["pizza", "Malai Botti Pizza", 900, "Small 900 · Medium 1350 · Large 1750.", ["savoury", "comfort"]],
  ["pizza", "Pepperoni Pizza", 850, "Small 850 · Medium 1350 · Large 1750.", ["savoury"]],
  ["pizza", "Donner Pizza", 1450, "Medium 1450 · Large 1850.", ["savoury"]],
  ["pizza", "Cheese Crust Pizza", 800, "Small 800 · Medium 1350 · Large 1750.", ["comfort"]],
  ["pizza", "Chicken Tikka Pizza", 700, "Small 700 · Medium 1200 · Large 1600.", ["savoury"]],
  ["pizza", "Fajita Pizza", 700, "Small 700 · Medium 1200 · Large 1600.", ["savoury"]],
  ["pizza", "Chicken Hot & Spicy Pizza", 750, "Small 750 · Medium 1250 · Large 1650.", ["energy", "savoury"]],
  ["pizza", "Bone Fire Pizza", 700, "Small 700 · Medium 1200 · Large 1600.", ["savoury"]],
  ["pizza", "Smokey Pizza", 700, "Small 700 · Medium 1250 · Large 1600.", ["savoury"]],
  ["pizza", "Chicken Tandoori Pizza", 750, "Small 750 · Medium 1250 · Large 1650.", ["savoury"]],
  ["pizza", "Mexican Pizza", 700, "Small 700 · Medium 1200 · Large 1600.", ["energy", "savoury"]],
  ["pizza", "Cheese Lover Pizza", 800, "Small 800 · Medium 1300 · Large 1700.", ["comfort"]],
  ["pizza", "Cheese Stick", 700, "Baked cheese sticks.", ["comfort"]],
  // Meals
  ["meals", "Meal 1", 1150, "1 small pizza, 2 nuggets, 2 hot wings, 1 tin pack drink, 1 reg. fries.", ["comfort"]],
  ["meals", "Meal 2", 950, "1 zinger burger, 1 shawarma, 1 tin pack drink, 1 reg. fries.", ["comfort"]],
  ["meals", "Meal 3", 1650, "1 zinger burger, 1 small pizza, 5 hot wings, 1 ltr drink, 1 reg. fries.", ["comfort"]],
  ["meals", "Meal 4", 2500, "1 medium pizza, 2 zinger burgers, 1 loaded fries, 1 ltr drink, 1 reg. fries.", ["comfort"]],
  ["meals", "Meal 5", 2850, "1 large pizza, 5 hot wings, 5 nuggets, 1.5 ltr drink, 1 reg. fries.", ["comfort"]],
  ["meals", "Meal 6", 2750, "1 medium pizza, 1 small pizza, 1 loaded fries, 1 ltr drink.", ["comfort"]],
  ["meals", "Meal 7", 700, "1 zinger burger, 1 reg. fries, 1 drink.", ["comfort"]],
  ["meals", "Meal 8", 1050, "1 wrap, 1 tikka paratha roll, 1 hf. ltr drink, 1 reg. fries.", ["comfort"]],
  // Kids
  ["kids", "Chotu Express", 750, "1 mini burger, 2 nuggets, 2 wings, 1 reg. fries.", ["comfort"]],
  ["kids", "Junior Star", 599, "4 nuggets, 4 wings, 1 reg. fries.", ["comfort"]],
  ["kids", "Motu Patlu", 1150, "2 mini burgers, 8 nuggets, 4 honey wings, 1 reg. fries.", ["comfort"]],
  ["kids", "Mickey Mouse", 1850, "4 mini burgers, 10 nuggets, 6 crispy wings, 1 reg. fries.", ["comfort"]],
  // Burgers
  ["burgers", "Lacha Pratha Burger", 750, "House special burger.", ["savoury"]],
  ["burgers", "Japanese Cheese Burger", 999, "House special burger.", ["comfort"]],
  ["burgers", "Malaysia Banjo Burger", 750, "House special burger.", ["savoury"]],
  ["burgers", "Spicy Fillet Burger", 750, "Served with fries.", ["energy"]],
  ["burgers", "Beef Smash Burger", 1150, "Served with fries.", ["savoury"]],
  ["burgers", "Mighty Burger", 750, "Served with fries.", ["comfort"]],
  ["burgers", "Fish Burger", 750, "Served with fries.", ["savoury"]],
  ["burgers", "Swiss Mushroom Burger", 1050, "Served with fries.", ["comfort"]],
  ["burgers", "Chilli Cheetos Burger", 650, "Served with fries.", ["energy"]],
  ["burgers", "Zinger Burger", 450, "Served with fries.", ["comfort"]],
  // Wraps
  ["wraps", "Mexican Wrap", 599, "Served with fries.", ["energy"]],
  ["wraps", "Grill Chicken Wrap", 500, "Served with fries.", ["savoury"]],
  ["wraps", "Fajita Wrap", 550, "Served with fries.", ["savoury"]],
  ["wraps", "Chicken Shawarma", 300, "Classic shawarma.", ["savoury"]],
  ["wraps", "Zinger Shawarma", 350, "Crispy zinger shawarma.", ["comfort"]],
  ["wraps", "Turkish Wrap", 700, "Served with fries.", ["savoury"]],
  ["wraps", "Tikka Paratha Roll", 350, "Paratha roll.", ["savoury"]],
  ["wraps", "Special Paratha Roll", 450, "Loaded paratha roll.", ["savoury"]],
  ["wraps", "Twister", 400, "Twister wrap.", ["savoury"]],
  // Chinese
  ["chinese", "Chicken Chilli Dry", 1250, "Wok-fired chilli chicken.", ["energy", "savoury"]],
  ["chinese", "Chicken Manchurian", 1250, "Chinese classic.", ["savoury"]],
  ["chinese", "Chicken Cashew Nut", 1250, "Chinese classic.", ["savoury"]],
  ["chinese", "Kung Pao Chicken", 1200, "Chinese classic.", ["energy"]],
  ["chinese", "Red Dragon Chicken", 1250, "Chinese classic.", ["energy"]],
  ["chinese", "Mongolian Chicken", 1275, "Chinese classic.", ["savoury"]],
  ["chinese", "Black Pepper Chicken", 1299, "Chinese classic.", ["savoury"]],
  ["chinese", "Lala Special Chow Mein", 1399, "House chow mein.", ["comfort"]],
  ["chinese", "Chicken Chow Mein", 1099, "Classic chow mein.", ["comfort"]],
  ["chinese", "Chicken Momos (6 pcs)", 799, "Steamed momos.", ["comfort"]],
  // Rice
  ["rice", "Vegetable Rice", 750, "Wok-tossed vegetable rice.", ["comfort"]],
  ["rice", "Egg Fried Rice", 750, "Classic egg fried rice.", ["comfort"]],
  ["rice", "Masala Rice", 899, "Spiced masala rice.", ["energy"]],
  // Broast
  ["broast", "Quarter Broast", 750, "Crisp fried chicken.", ["comfort"]],
  ["broast", "Half Broast", 1399, "Crisp fried chicken.", ["comfort"]],
  ["broast", "Full Broast", 2450, "Crisp fried chicken.", ["comfort"]],
  // Wings
  ["wings", "King Jaon Dynamite Wings (6 pcs)", 899, "Fiery dynamite glaze.", ["energy"]],
  ["wings", "Hot Buffalo Wings (6 pcs)", 799, "Classic buffalo heat.", ["energy"]],
  ["wings", "Smoky Ranch Wings (6 pcs)", 799, "Smoky ranch coating.", ["savoury"]],
  ["wings", "Honey BBQ Wings (6 pcs)", 750, "Sweet and smoky.", ["sweet", "savoury"]],
  ["wings", "Crispy Wings (10 pcs)", 750, "Plain crispy wings.", ["comfort"]],
  // Fish
  ["fish", "Mexican Salsa Fish", null, "Grilled fish with Mexican salsa. Ask us for today's price.", ["energy"]],
  ["fish", "Grill Fish with Lemon Butter Sauce", null, "Ask us for today's price.", ["savoury"]],
  ["fish", "Grill Fish with Jalapeno Sauce", null, "Ask us for today's price.", ["energy"]],
  ["fish", "Fish & Chips", 1350, "Fried fish with chips.", ["comfort"]],
  ["fish", "Finger Fish (8 pcs)", 1299, "Crisp fish fingers.", ["comfort"]],
  // Steaks
  ["steaks", "Mexican Chicken Steak", 1599, "Chicken steak with Mexican sauce.", ["energy"]],
  ["steaks", "Mushroom Chicken Steak", 1499, "Chicken steak with mushroom sauce.", ["comfort"]],
  ["steaks", "American Chicken Steak", 1599, "Chicken steak, American style.", ["savoury"]],
  ["steaks", "Tarragon Chicken Steak", 1499, "Chicken steak with tarragon sauce.", ["savoury"]],
  ["steaks", "Moroccan Chicken Steak", 1499, "Chicken steak, Moroccan spices.", ["energy"]],
  // Italian
  ["italian", "Parmesan Chicken", 1050, "Italian style chicken.", ["comfort"]],
  ["italian", "Swiss Polo Chicken", 1350, "Italian style chicken.", ["comfort"]],
  ["italian", "Stuffed Chicken", 1399, "Italian style stuffed chicken.", ["comfort"]],
  // Pasta
  ["pasta", "Alfredo Pasta", 1050, "Creamy alfredo.", ["comfort"]],
  ["pasta", "South Bake Pasta", 999, "Oven-baked pasta.", ["comfort"]],
  ["pasta", "Lala's Special Pasta", 1199, "House special pasta.", ["comfort"]],
  // Sandwich
  ["sandwich", "Grill Chicken Cheese Sandwich", 750, "Served with fries.", ["comfort"]],
  ["sandwich", "Club Sandwich", 850, "Served with fries.", ["comfort"]],
  ["sandwich", "Lala's Special Sandwich", 1099, "Served with fries.", ["comfort"]],
  // Salad
  ["salad", "Lala's Special Salad", 1099, "House salad.", ["refreshing"]],
  ["salad", "Chicken Caesar Salad", 1050, "Classic caesar.", ["refreshing"]],
  ["salad", "Russian Salad", 899, "Creamy Russian salad.", ["refreshing"]],
  // Soup
  ["soup", "Hot & Sour Soup", 750, "Half 750 · Full 1250.", ["comfort"]],
  ["soup", "Corn Soup", 750, "Half 750 · Full 1250.", ["comfort"]],
  ["soup", "Lala's Special Soup", 799, "Half 799 · Full 1399.", ["comfort"]],
  // Appetizers
  ["appetizer", "Stuffed Peri Peri Chicken", 1199, "Peri peri stuffed chicken.", ["energy"]],
  ["appetizer", "Dynamite Chicken (10 pcs)", 899, "Spicy dynamite chicken.", ["energy"]],
  ["appetizer", "Chicken Nuggets (10 pcs)", 699, "Crispy nuggets.", ["comfort"]],
  ["appetizer", "Dynamite Prawns (6 pcs)", 1599, "Spicy dynamite prawns.", ["energy"]],
  ["appetizer", "Tempura Prawns (6 pcs)", 1599, "Crisp tempura prawns.", ["savoury"]],
  ["appetizer", "Cheesy Sticks (6 pcs)", 799, "Molten cheese sticks.", ["comfort"]],
  ["appetizer", "Loaded Cheese Fries", 750, "Fries loaded with cheese.", ["comfort"]],
  ["appetizer", "French Fries Basket", 350, "Classic fries basket.", ["comfort"]],
  ["appetizer", "Crispy Loaded Fries", 750, "Crispy loaded fries.", ["comfort"]],
  ["appetizer", "Fish Cracker Basket", 350, "Crisp fish crackers.", ["savoury"]],
  ["appetizer", "Cheesy Bites", 700, "Bite-size cheese pops.", ["comfort"]],
  // Hot & cold bar
  ["drinks", "Pina Colada American", 400, "Creamy pina colada.", ["refreshing", "sweet"]],
  ["drinks", "Pina Colada Blue", 380, "Blue pina colada.", ["refreshing", "sweet"]],
  ["drinks", "Peach Smoothie", 400, "Peach smoothie.", ["refreshing"]],
  ["drinks", "Blue Lagoon", 430, "Blue citrus cooler.", ["refreshing"]],
  ["drinks", "Pink Lady", 350, "Pink berry cooler.", ["refreshing", "sweet"]],
  ["drinks", "Peach Mojito", 300, "Peach mojito.", ["refreshing"]],
  ["drinks", "Strawberry Mojito", 320, "Strawberry mojito.", ["refreshing"]],
  ["drinks", "Mango Mojito", 340, "Mango mojito.", ["refreshing"]],
  ["drinks", "Mint Mojito", 350, "Classic mint mojito.", ["refreshing"]],
  ["drinks", "Orange Margarita", 350, "Orange margarita mocktail.", ["refreshing"]],
  ["drinks", "Fresh Lime", 280, "Fresh lime soda.", ["refreshing"]],
  ["drinks", "Cold Coffee", 500, "Iced cold coffee.", ["energy"]],
  ["drinks", "Ice Cream Shake", 400, "Thick ice cream shake.", ["sweet"]],
  ["drinks", "Milk Shake", 300, "Classic milkshake.", ["sweet"]],
  ["drinks", "Dry Fruit Shake", 600, "Loaded dry fruit shake.", ["sweet", "comfort"]],
  ["drinks", "Kit Kat Shake", 500, "Chocolate wafer shake.", ["sweet"]],
  ["drinks", "Oreo Shake", 500, "Cookies and cream shake.", ["sweet"]],
  ["drinks", "Mango Shake", 350, "Fresh mango shake.", ["sweet", "refreshing"]],
  ["drinks", "Green Apple Mocktail", 600, "Green apple mocktail.", ["refreshing"]],
  ["drinks", "Lichi Fizz", 400, "Fizzy lychee cooler.", ["refreshing"]],
  // Juice
  ["juice", "Apple Juice", 300, "Freshly pressed.", ["refreshing"]],
  ["juice", "Strawberry Juice", 250, "Freshly pressed.", ["refreshing"]],
  ["juice", "Orange Juice", 350, "Freshly pressed.", ["refreshing"]],
  ["juice", "Mango Juice", 350, "Freshly pressed.", ["refreshing"]],
  // Sauces
  ["sauce", "Cocktail Sauce", 90, "Dip.", ["savoury"]],
  ["sauce", "BBQ Sauce", 90, "Dip.", ["savoury"]],
  ["sauce", "Mustard Sauce", 140, "Dip.", ["savoury"]],
  ["sauce", "Dynamite Sauce", 90, "Dip.", ["energy"]],
  ["sauce", "Garlic Sauce", 90, "Dip.", ["savoury"]],
  ["sauce", "Mayonnaise Sauce", 90, "Dip.", ["comfort"]],
];

const featured = new Set([
  "1 Meter Pizza",
  "Lala Special Chow Mein",
  "Malaysia Express",
  "Zinger Burger",
  "Lala's Special Pasta",
  "Mint Mojito",
]);

export const menuItems: MenuItem[] = rows.map(([categoryId, name, price, description, moods], index) => ({
  id: `item-${index + 1}`,
  categoryId,
  name,
  description,
  price,
  isAvailable: true,
  isFeatured: featured.has(name),
  isBestseller: featured.has(name),
  isNew: false,
  moods,
  sortOrder: index + 1,
}));

export const galleryImages: GalleryImage[] = [
  { id: "g1", url: photos.helipad, alt: "Lit-up wooden helicopter seating installation at Lala's Cafe", caption: "The helicopter booth", tag: "ambience", sortOrder: 1 },
  { id: "g2", url: photos.cabana, alt: "White slatted private cabana with neon trim and hanging plants", caption: "Private cabanas", tag: "ambience", sortOrder: 2 },
  { id: "g3", url: photos.lounge, alt: "Brown leather booths in front of a painted street-art mural", caption: "Mural lounge", tag: "ambience", sortOrder: 3 },
  { id: "g4", url: photos.terrace, alt: "Terrace walkway strung with star and moon fairy lights", caption: "Star-light terrace", tag: "ambience", sortOrder: 4 },
  { id: "g5", url: photos.courtyard, alt: "Colourful pergola bench under neon light beside a calligraphy wall piece", caption: "Courtyard pergola", tag: "ambience", sortOrder: 5 },
  { id: "g6", url: photos.entrance, alt: "Entrance hallway with a vine-covered wooden ceiling and warm pendant lights", caption: "The welcome", tag: "ambience", sortOrder: 6 },
];

/** Empty until the cafe adds real listings. */
export const cafeEvents: CafeEvent[] = [];
export const offers: Offer[] = [
  {
    id: "offer-delivery",
    title: "Free home delivery",
    description: "Order by phone and we deliver around Daska free of charge.",
    terms: "As printed on the cafe's menu board.",
    validUntil: null,
    isActive: true,
  },
];

export interface Faq {
  id: string;
  question: string;
  answer: string;
  sortOrder: number;
}

/** Answers drawn only from what the cafe has confirmed. */
export const faqs: Faq[] = [
  {
    id: "faq-where",
    question: "Where exactly is Lala's Cafe?",
    answer:
      "Nisbat Road in Daska, right next to Just Smile Family Dental Clinic. Look for the lit entrance with the vine-covered ceiling.",
    sortOrder: 1,
  },
  {
    id: "faq-hours",
    question: "What time are you open?",
    answer: siteSettings.hours.map((h) => `${h.label}: ${h.value}`).join(" · "),
    sortOrder: 2,
  },
  {
    id: "faq-booking",
    question: "Do I need to book a table?",
    answer:
      "Walk-ins are welcome. For weekends, larger groups or a specific spot such as a cabana or the rooftop, send a table request and we'll confirm it with you.",
    sortOrder: 3,
  },
  {
    id: "faq-confirm",
    question: "Is my table request confirmed straight away?",
    answer:
      "No. A request reaches the team and someone replies to confirm it. Until you hear back, the table isn't held.",
    sortOrder: 4,
  },
  {
    id: "faq-delivery",
    question: "Do you deliver?",
    answer: `Yes — free home delivery around Daska. Call ${orderPhones.join(" or ")} to place an order.`,
    sortOrder: 5,
  },
  {
    id: "faq-seating",
    question: "What seating is there?",
    answer:
      "Indoor lounge booths, private cabanas, a courtyard pergola, the star-light terrace and the helicopter booth. Tell us which you'd like when you request a table.",
    sortOrder: 6,
  },
  {
    id: "faq-groups",
    question: "Can you host a birthday or a private gathering?",
    answer:
      "Yes. Send a private-event enquiry with your date, guest count and what you have in mind, and the team will work out the details with you directly.",
    sortOrder: 7,
  },
  {
    id: "faq-allergy",
    question: "I have an allergy — can you help?",
    answer:
      "Tell us before you order. Our kitchen prepares dishes side by side so we can't promise a dish is free of any ingredient, but we'll always tell you honestly what we can do.",
    sortOrder: 8,
  },
  {
    id: "faq-complaint",
    question: "Something went wrong. Who do I speak to?",
    answer: `Call the complaints line on ${complaintPhone} and it goes straight to management.`,
    sortOrder: 9,
  },
];
