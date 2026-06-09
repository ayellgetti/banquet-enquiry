export type ProcurementItem = {
  id: string;
  name: string;
  unit: string;
  category: string;
};

export const PROCUREMENT_CATEGORIES = [
  "Dairy Products",
  "Vegetables",
  "Fruits",
  "Grains & Cereals",
  "Pulses & Legumes",
  "Masala & Seasonings",
  "Oils & Fats",
  "Bakery & Dessert Ingredients",
  "Frozen & Processed Foods",
  "Cooking Utensils",
  "Serving Materials",
  "Packaging Materials",
  "Cleaning & Hygiene",
  "Waste Management",
  "Gas & Fuel",
  "Beverages",
  "Event Consumables",
] as const;

const item = (category: string, name: string, unit: string): ProcurementItem => ({
  id: `${category}-${name}`.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
  name,
  unit,
  category,
});

export const PROCUREMENT_ITEMS: ProcurementItem[] = [
  // 1. Dairy Products
  item("Dairy Products", "Milk", "ltr"),
  item("Dairy Products", "Curd", "kg"),
  item("Dairy Products", "Paneer", "kg"),
  item("Dairy Products", "Cheese", "kg"),
  item("Dairy Products", "Butter", "kg"),
  item("Dairy Products", "Ghee", "kg"),
  item("Dairy Products", "Cream", "ltr"),
  item("Dairy Products", "Khoya", "kg"),

  // 2. Vegetables
  item("Vegetables", "Leafy vegetables", "kg"),
  item("Vegetables", "Root vegetables", "kg"),
  item("Vegetables", "Exotic vegetables", "kg"),
  item("Vegetables", "Seasonal vegetables", "kg"),
  item("Vegetables", "Herbs", "kg"),

  // 3. Fruits
  item("Fruits", "Fresh fruits", "kg"),
  item("Fruits", "Dry fruits", "kg"),
  item("Fruits", "Frozen fruits", "kg"),

  // 4. Grains & Cereals
  item("Grains & Cereals", "Rice", "kg"),
  item("Grains & Cereals", "Wheat", "kg"),
  item("Grains & Cereals", "Atta", "kg"),
  item("Grains & Cereals", "Maida", "kg"),
  item("Grains & Cereals", "Suji", "kg"),
  item("Grains & Cereals", "Poha", "kg"),
  item("Grains & Cereals", "Vermicelli", "kg"),

  // 5. Pulses & Legumes
  item("Pulses & Legumes", "Toor Dal", "kg"),
  item("Pulses & Legumes", "Moong Dal", "kg"),
  item("Pulses & Legumes", "Chana Dal", "kg"),
  item("Pulses & Legumes", "Rajma", "kg"),
  item("Pulses & Legumes", "Chole", "kg"),
  item("Pulses & Legumes", "Black Beans", "kg"),

  // 6. Masala & Seasonings
  item("Masala & Seasonings", "Whole spices", "kg"),
  item("Masala & Seasonings", "Ground spices", "kg"),
  item("Masala & Seasonings", "Salt", "kg"),
  item("Masala & Seasonings", "Sugar", "kg"),
  item("Masala & Seasonings", "Jaggery", "kg"),
  item("Masala & Seasonings", "Food colors", "pack"),
  item("Masala & Seasonings", "Flavouring agents", "pack"),

  // 7. Oils & Fats
  item("Oils & Fats", "Sunflower Oil", "ltr"),
  item("Oils & Fats", "Groundnut Oil", "ltr"),
  item("Oils & Fats", "Mustard Oil", "ltr"),
  item("Oils & Fats", "Vanaspati", "kg"),
  item("Oils & Fats", "Ghee", "kg"),

  // 8. Bakery & Dessert Ingredients
  item("Bakery & Dessert Ingredients", "Baking Powder", "kg"),
  item("Bakery & Dessert Ingredients", "Baking Soda", "kg"),
  item("Bakery & Dessert Ingredients", "Chocolate", "kg"),
  item("Bakery & Dessert Ingredients", "Custard Powder", "kg"),
  item("Bakery & Dessert Ingredients", "Corn Flour", "kg"),
  item("Bakery & Dessert Ingredients", "Jelly Mix", "pack"),
  item("Bakery & Dessert Ingredients", "Dry Fruits", "kg"),

  // 9. Frozen & Processed Foods
  item("Frozen & Processed Foods", "Frozen Peas", "kg"),
  item("Frozen & Processed Foods", "Frozen Corn", "kg"),
  item("Frozen & Processed Foods", "Frozen Snacks", "kg"),
  item("Frozen & Processed Foods", "Ready Mixes", "pack"),

  // 10. Cooking Utensils
  item("Cooking Utensils", "Kadai", "pcs"),
  item("Cooking Utensils", "Patila", "pcs"),
  item("Cooking Utensils", "Tawa", "pcs"),
  item("Cooking Utensils", "Gas Burner", "pcs"),
  item("Cooking Utensils", "Ladles", "pcs"),
  item("Cooking Utensils", "Knives", "pcs"),
  item("Cooking Utensils", "Chopping Boards", "pcs"),

  // 11. Serving Materials
  item("Serving Materials", "Plates", "pcs"),
  item("Serving Materials", "Bowls", "pcs"),
  item("Serving Materials", "Glasses", "pcs"),
  item("Serving Materials", "Cups", "pcs"),
  item("Serving Materials", "Spoons", "pcs"),
  item("Serving Materials", "Forks", "pcs"),
  item("Serving Materials", "Napkins", "pack"),
  item("Serving Materials", "Disposable Items", "pack"),

  // 12. Packaging Materials
  item("Packaging Materials", "Food Containers", "pack"),
  item("Packaging Materials", "Parcel Boxes", "pcs"),
  item("Packaging Materials", "Aluminum Foil", "roll"),
  item("Packaging Materials", "Cling Wrap", "roll"),
  item("Packaging Materials", "Paper Bags", "pack"),
  item("Packaging Materials", "Carry Bags", "pack"),

  // 13. Cleaning & Hygiene
  item("Cleaning & Hygiene", "Dishwash Liquid", "ltr"),
  item("Cleaning & Hygiene", "Floor Cleaner", "ltr"),
  item("Cleaning & Hygiene", "Sanitizer", "ltr"),
  item("Cleaning & Hygiene", "Gloves", "box"),
  item("Cleaning & Hygiene", "Hair Nets", "pack"),
  item("Cleaning & Hygiene", "Aprons", "pcs"),
  item("Cleaning & Hygiene", "Garbage Bags", "pack"),

  // 14. Waste Management
  item("Waste Management", "Wet Waste Bins", "pcs"),
  item("Waste Management", "Dry Waste Bins", "pcs"),
  item("Waste Management", "Compost Bags", "pack"),
  item("Waste Management", "Garbage Collection Supplies", "pack"),

  // 15. Gas & Fuel
  item("Gas & Fuel", "LPG Cylinders", "pcs"),
  item("Gas & Fuel", "Charcoal", "kg"),
  item("Gas & Fuel", "Wood", "kg"),
  item("Gas & Fuel", "Fuel Tracking", "lot"),

  // 16. Beverages
  item("Beverages", "Tea", "kg"),
  item("Beverages", "Coffee", "kg"),
  item("Beverages", "Soft Drinks", "case"),
  item("Beverages", "Juices", "ltr"),
  item("Beverages", "Mineral Water", "case"),

  // 17. Event Consumables
  item("Event Consumables", "Decoration Materials", "lot"),
  item("Event Consumables", "Candles", "pack"),
  item("Event Consumables", "Tissue Papers", "pack"),
  item("Event Consumables", "Table Covers", "pcs"),
];

export const itemsByCategory = PROCUREMENT_CATEGORIES.reduce<Record<string, ProcurementItem[]>>(
  (acc, cat) => {
    acc[cat] = PROCUREMENT_ITEMS.filter((i) => i.category === cat);
    return acc;
  },
  {},
);
