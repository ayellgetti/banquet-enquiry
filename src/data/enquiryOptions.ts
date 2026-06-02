export type PackageSlot = { id: string; label: string; hours: number };

export type Package = {
  id: string;
  name: string;
  tagline: string;
  pricePerPlate: number;
  perks: string[];
  minPax?: number;
  hourlyRate?: number;
  slots?: PackageSlot[];
};

export type MenuItem = { id: string; name: string; category: string; price: number };
export type MenuCategory =
  | "Welcome Drink"
  | "Starter"
  | "Farsan"
  | "Main Course Bhaji"
  | "Bread"
  | "Rice"
  | "Dal"
  | "Sweet";

export type PlatePackage = {
  id: string;
  name: string;
  basePrice: number;
  limits: Partial<Record<MenuCategory, number>>;
  extras?: string[];
};

export type DecorOption = { id: string; name: string; price: number; description: string };
export type ChairOption = { id: string; name: string; pricePerUnit: number };
export type ExtraService = { id: string; name: string; price: number; unit: string };
export type VenueOption = { id: string; name: string; pricePerHour: number; description: string };

export const EVENT_TYPES = [
  "Birthday",
  "Wedding",
  "Engagement",
  "Silver Jubilee",
  "Golden Jubilee",
  "Platinum Jubilee",
  "Corporate",
  "Other",
];

export const SOURCES = [
  "Walk-in",
  "Referral",
  "Instagram",
  "Facebook",
  "Google",
  "WhatsApp",
  "Wedding Wire",
  "Other",
];

const SILVER_PERKS = [
  "Hall Rent + AC Electricity",
  "Basic Decoration",
  "Changing Room",
  "Mic & Music",
  "Stage Light",
  "Stage Sofa",
  "Chair",
  "Separate Dining Area",
  "Dedicated Elevator",
  "2 Parking Spaces",
];

const slotPkg = (
  id: string,
  name: string,
  label: string,
  hours: number,
): Package => ({
  id,
  name,
  tagline: `${label} · ${hours}h × ₹6,000/hr`,
  pricePerPlate: 0,
  minPax: 100,
  hourlyRate: 6000,
  slots: [{ id, label, hours }],
  perks: SILVER_PERKS,
});

export const PACKAGES: Package[] = [
  slotPkg("silver-morning", "Morning", "Morning 08:00 AM – 02:00 PM", 6),
  slotPkg("silver-evening", "Evening", "Evening 04:00 PM – 10:00 PM", 6),
  slotPkg("silver-fullday-1", "Full Day (Early)", "Full Day 08:00 AM – 08:00 PM", 12),
  slotPkg("silver-fullday-2", "Full Day (Late)", "Full Day 10:00 AM – 10:00 PM", 12),
];

// `price` = per-plate cost charged ONLY when this dish is selected beyond
// the plate's allowed limit for its category. Within the limit it is included.
export const MENU_ITEMS: MenuItem[] = [
  // Welcome Drink
  { id: "wd1", name: "Masala Soda", category: "Welcome Drink", price: 30 },
  { id: "wd2", name: "Jaljeera", category: "Welcome Drink", price: 30 },
  { id: "wd3", name: "Aam Panna", category: "Welcome Drink", price: 40 },
  { id: "wd4", name: "Mocktail", category: "Welcome Drink", price: 60 },

  // Starter
  { id: "st1", name: "Paneer Tikka", category: "Starter", price: 70 },
  { id: "st2", name: "Veg Spring Rolls", category: "Starter", price: 60 },
  { id: "st3", name: "Hara Bhara Kebab", category: "Starter", price: 60 },
  { id: "st4", name: "Crispy Corn", category: "Starter", price: 60 },
  { id: "st5", name: "Chicken Malai Tikka", category: "Starter", price: 120 },

  // Farsan
  { id: "fa1", name: "Khaman Dhokla", category: "Farsan", price: 40 },
  { id: "fa2", name: "Khandvi", category: "Farsan", price: 50 },
  { id: "fa3", name: "Patra", category: "Farsan", price: 40 },
  { id: "fa4", name: "Methi Gota", category: "Farsan", price: 40 },

  // Main Course Bhaji
  { id: "mc1", name: "Paneer Butter Masala", category: "Main Course Bhaji", price: 90 },
  { id: "mc2", name: "Mix Veg", category: "Main Course Bhaji", price: 70 },
  { id: "mc3", name: "Aloo Gobi", category: "Main Course Bhaji", price: 70 },
  { id: "mc4", name: "Shahi Paneer", category: "Main Course Bhaji", price: 100 },
  { id: "mc5", name: "Butter Chicken", category: "Main Course Bhaji", price: 150 },

  // Bread
  { id: "br1", name: "Butter Roti", category: "Bread", price: 20 },
  { id: "br2", name: "Tawa Roti", category: "Bread", price: 15 },
  { id: "br3", name: "Butter Naan", category: "Bread", price: 30 },
  { id: "br4", name: "Garlic Naan", category: "Bread", price: 40 },

  // Rice
  { id: "ri1", name: "Jeera Rice", category: "Rice", price: 50 },
  { id: "ri2", name: "Veg Pulao", category: "Rice", price: 60 },
  { id: "ri3", name: "Veg Biryani", category: "Rice", price: 90 },

  // Dal
  { id: "dl1", name: "Dal Tadka", category: "Dal", price: 50 },
  { id: "dl2", name: "Dal Fry", category: "Dal", price: 50 },
  { id: "dl3", name: "Dal Makhani", category: "Dal", price: 80 },

  // Sweet
  { id: "sw1", name: "Gulab Jamun", category: "Sweet", price: 40 },
  { id: "sw2", name: "Rasmalai", category: "Sweet", price: 60 },
  { id: "sw3", name: "Moong Dal Halwa", category: "Sweet", price: 70 },
  { id: "sw4", name: "Ice Cream", category: "Sweet", price: 50 },
];

export const COMMON_PLATE_ITEMS = [
  "Salad", "Papad", "Achar", "Raita", "Chutney", "Mukhwas", "Packaged Drinking Water",
];

export const PLATE_PACKAGES: PlatePackage[] = [
  {
    id: "plate1",
    name: "Plate Package #1",
    basePrice: 750,
    limits: {
      "Welcome Drink": 2,
      "Starter": 2,
      "Farsan": 1,
      "Main Course Bhaji": 2,
      "Bread": 2,
      "Rice": 1,
      "Dal": 1,
      "Sweet": 2,
    },
    extras: ["Includes 1 Ice Cream as a Sweet"],
  },
  {
    id: "plate2",
    name: "Plate Package #2",
    basePrice: 550,
    limits: {
      "Welcome Drink": 1,
      "Starter": 1,
      "Farsan": 1,
      "Main Course Bhaji": 2,
      "Bread": 1,
      "Rice": 1,
      "Dal": 1,
      "Sweet": 1,
    },
  },
  {
    id: "plate3",
    name: "Plate Package #3",
    basePrice: 475,
    limits: {
      "Welcome Drink": 1,
      "Starter": 1,
      "Farsan": 1,
      "Main Course Bhaji": 2,
      "Bread": 1,
      "Rice": 1,
      "Dal": 1,
      "Sweet": 1,
    },
  },
  {
    id: "plate4",
    name: "Plate Package #4",
    basePrice: 300,
    limits: {
      "Welcome Drink": 1,
      "Starter": 1,
      "Main Course Bhaji": 1,
      "Bread": 1,
      "Rice": 1,
      "Dal": 1,
      "Sweet": 1,
    },
  },
  {
    id: "plate-custom",
    name: "Custom Plate",
    basePrice: 0,
    limits: {},
    extras: ["Build your own menu — every dish is charged per plate"],
  },
];

export const DECOR_OPTIONS: DecorOption[] = [
  { id: "d1", name: "Floral Entrance Arch", price: 8000, description: "Fresh flower entry gate" },
  { id: "d2", name: "Fairy Light Canopy", price: 6000, description: "Warm fairy lights overhead" },
  { id: "d3", name: "Balloon Décor", price: 4500, description: "Themed balloon arrangements" },
  { id: "d4", name: "Centerpieces", price: 3500, description: "Table centerpiece per 10 tables" },
  { id: "d5", name: "Theme Backdrop", price: 7000, description: "Custom photo backdrop" },
];

export const STAGE_OPTIONS: DecorOption[] = [
  { id: "s0", name: "Basic Stage Decoration", price: 10000, description: "Basic stage setup" },
  { id: "s1", name: "Classic Floral Stage", price: 15000, description: "Roses + drapes" },
  { id: "s2", name: "Royal Mandap", price: 35000, description: "Traditional wedding mandap" },
  { id: "s3", name: "LED Wall Stage", price: 45000, description: "Full LED backdrop with visuals" },
  { id: "s4", name: "Minimal Modern", price: 18000, description: "Clean geometric stage design" },
  { id: "s5", name: "Birthday Theme Stage", price: 12000, description: "Character / theme based" },
];

export const CHAIR_OPTIONS: ChairOption[] = [
  { id: "c1", name: "Standard Chair", pricePerUnit: 25 },
  { id: "c2", name: "Cushioned Chair", pricePerUnit: 60 },
  { id: "c3", name: "Chiavari Chair", pricePerUnit: 120 },
  { id: "c4", name: "VIP Sofa Seating", pricePerUnit: 350 },
];

export const EXTRA_SERVICES: ExtraService[] = [
  { id: "e1", name: "Photography", price: 25000, unit: "package" },
  { id: "e2", name: "Videography + Drone", price: 35000, unit: "package" },
  { id: "e3", name: "DJ & Sound", price: 18000, unit: "event" },
  { id: "e4", name: "Live Band", price: 40000, unit: "event" },
  { id: "e5", name: "Valet Parking", price: 8000, unit: "event" },
  { id: "e6", name: "Anchor / MC", price: 12000, unit: "event" },
  { id: "e7", name: "Fireworks", price: 22000, unit: "show" },
  { id: "e8", name: "Return Gifts", price: 150, unit: "per guest" },
];

export const VENUE_OPTIONS: VenueOption[] = [
  { id: "v1", name: "Main Banquet Hall", pricePerHour: 6000, description: "Indoor AC hall · up to 400 guests" },
  { id: "v2", name: "Garden Lawn", pricePerHour: 4500, description: "Open-air lawn · up to 300 guests" },
  { id: "v3", name: "Rooftop Terrace", pricePerHour: 5500, description: "Open rooftop · up to 200 guests" },
  { id: "v4", name: "Poolside Deck", pricePerHour: 7500, description: "Premium poolside · up to 150 guests" },
  { id: "v5", name: "Conference Room", pricePerHour: 2500, description: "Compact AC room · up to 60 guests" },
];