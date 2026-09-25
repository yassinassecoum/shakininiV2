/**
 * Shakinini catalogue.
 *
 * Nutritional values are indicative averages
 * (Ciqual tables / common product labels).
 *
 * Bases  : values per 100 ml.
 * Add-ons: values for ONE serving (described by `portion`).
 * price  : in euros.
 */

export const SHAKER_CAPACITY_ML = 700

export const VOLUMES = [
  { ml: 250, label: 'Small', price: 0 },
  { ml: 350, label: 'Medium', price: 0.8 },
  { ml: 500, label: 'Large', price: 1.5 },
]

export const BASE_PRICE = 2.9 // starting price of a shaker

export const BASES = [
  { id: 'whole-milk', name: 'Whole milk', emoji: '🥛', color: '#FBF8EF', kcal: 64, protein: 3.2, carbs: 4.8, fat: 3.6, price: 0 },
  { id: 'semi-skimmed-milk', name: 'Semi-skimmed milk', emoji: '🥛', color: '#F7F6F1', kcal: 46, protein: 3.2, carbs: 4.8, fat: 1.6, price: 0 },
  { id: 'skimmed-milk', name: 'Skimmed milk', emoji: '🥛', color: '#F1F3F4', kcal: 34, protein: 3.4, carbs: 5.0, fat: 0.1, price: 0 },
  { id: 'water', name: 'Water', emoji: '💧', color: '#CFE8F5', kcal: 0, protein: 0, carbs: 0, fat: 0, price: 0 },
  { id: 'oat-milk', name: 'Oat milk', emoji: '🌾', color: '#EEDFC2', kcal: 46, protein: 1.0, carbs: 6.7, fat: 1.5, price: 0.4 },
  { id: 'almond-milk', name: 'Almond milk', emoji: '🌰', color: '#F2E6D6', kcal: 13, protein: 0.4, carbs: 0.3, fat: 1.1, price: 0.4 },
  { id: 'soy-milk', name: 'Soy milk', emoji: '🫘', color: '#F4EBCF', kcal: 39, protein: 3.3, carbs: 1.5, fat: 1.8, price: 0.4 },
  { id: 'coconut-drink', name: 'Coconut drink', emoji: '🥥', color: '#FAFAF6', kcal: 20, protein: 0.2, carbs: 2.7, fat: 0.9, price: 0.5 },
  { id: 'rice-milk', name: 'Rice milk', emoji: '🍚', color: '#F5F2EA', kcal: 47, protein: 0.3, carbs: 9.2, fat: 1.0, price: 0.4 },
]

/**
 * `particle` : the ingredient shows up as floating chunks in the 3D shaker.
 * `tint`     : weight of the ingredient in the final mix colour.
 */
export const ADDON_CATEGORIES = [
  {
    id: 'protein',
    icon: '💪',
    name: 'Protein',
    hint: 'One serving = one 30 g scoop.',
    items: [
      { id: 'whey-vanilla', name: 'Vanilla whey', emoji: '🍦', portion: '30 g', kcal: 118, protein: 23, carbs: 3.2, fat: 1.6, price: 1.5, color: '#F3E3B5', tint: 0.5, max: 3 },
      { id: 'whey-chocolate', name: 'Chocolate whey', emoji: '🍫', portion: '30 g', kcal: 120, protein: 22, carbs: 3.5, fat: 2.0, price: 1.5, color: '#6B4226', tint: 1.4, max: 3 },
      { id: 'whey-isolate', name: 'Whey isolate', emoji: '💪', portion: '30 g', kcal: 110, protein: 27, carbs: 0.8, fat: 0.4, price: 1.9, color: '#FFFFFF', tint: 0.3, max: 3 },
      { id: 'casein', name: 'Casein', emoji: '🌙', portion: '30 g', kcal: 108, protein: 24, carbs: 2.4, fat: 0.5, price: 1.7, color: '#F4F0E4', tint: 0.4, max: 2 },
      { id: 'vegan-protein', name: 'Plant protein', emoji: '🌱', portion: '30 g', kcal: 116, protein: 21, carbs: 2.5, fat: 2.3, price: 1.8, color: '#C9B98A', tint: 0.8, max: 3 },
    ],
  },
  {
    id: 'fruits',
    icon: '🍓',
    name: 'Fruits',
    hint: 'Fresh or frozen, blended into the shaker.',
    items: [
      { id: 'banana', name: 'Banana', emoji: '🍌', portion: '1 piece (120 g)', kcal: 107, protein: 1.3, carbs: 27, fat: 0.4, price: 0.8, color: '#F6E27F', tint: 1.0, particle: true, max: 2 },
      { id: 'strawberries', name: 'Strawberries', emoji: '🍓', portion: '100 g', kcal: 32, protein: 0.7, carbs: 7.7, fat: 0.3, price: 1.0, color: '#F0546A', tint: 1.6, particle: true, max: 2 },
      { id: 'blueberries', name: 'Blueberries', emoji: '🫐', portion: '80 g', kcal: 46, protein: 0.6, carbs: 11.6, fat: 0.3, price: 1.2, color: '#4B3F8F', tint: 1.8, particle: true, max: 2 },
      { id: 'mango', name: 'Mango', emoji: '🥭', portion: '100 g', kcal: 60, protein: 0.8, carbs: 15, fat: 0.4, price: 1.1, color: '#FFB23F', tint: 1.3, particle: true, max: 2 },
      { id: 'pineapple', name: 'Pineapple', emoji: '🍍', portion: '100 g', kcal: 50, protein: 0.5, carbs: 13.1, fat: 0.1, price: 0.9, color: '#FFD84D', tint: 1.0, particle: true, max: 2 },
    ],
  },
  {
    id: 'grains',
    icon: '🥣',
    name: 'Grains & sweeteners',
    hint: 'For long-lasting energy or a touch of sweetness.',
    items: [
      { id: 'oats', name: 'Rolled oats', emoji: '🥣', portion: '40 g', kcal: 150, protein: 5.4, carbs: 24, fat: 2.8, price: 0.6, color: '#D9C39A', tint: 0.7, particle: true, max: 3 },
      { id: 'honey', name: 'Honey', emoji: '🍯', portion: '1 tbsp (21 g)', kcal: 64, protein: 0.1, carbs: 17, fat: 0, price: 0.5, color: '#E8A93B', tint: 0.4, max: 2 },
      { id: 'maple-syrup', name: 'Maple syrup', emoji: '🍁', portion: '1 tbsp (20 g)', kcal: 52, protein: 0, carbs: 13.4, fat: 0, price: 0.6, color: '#B8651E', tint: 0.4, max: 2 },
      { id: 'cocoa', name: 'Unsweetened cocoa', emoji: '☕', portion: '10 g', kcal: 23, protein: 2.0, carbs: 1.5, fat: 1.4, price: 0.4, color: '#4A2C1A', tint: 1.2, max: 2 },
    ],
  },
  {
    id: 'fats',
    icon: '🥜',
    name: 'Healthy fats',
    hint: 'Nut butters and seeds to keep you full until your next meal.',
    items: [
      { id: 'peanut-butter', name: 'Peanut butter', emoji: '🥜', portion: '1 tbsp (16 g)', kcal: 94, protein: 4.0, carbs: 3.2, fat: 8.0, price: 0.7, color: '#B9814A', tint: 0.8, max: 3 },
      { id: 'almond-butter', name: 'Almond butter', emoji: '🌰', portion: '1 tbsp (16 g)', kcal: 98, protein: 3.4, carbs: 3.0, fat: 8.9, price: 0.9, color: '#C49A6C', tint: 0.7, max: 3 },
      { id: 'chia', name: 'Chia seeds', emoji: '⚫', portion: '15 g', kcal: 73, protein: 2.5, carbs: 6.3, fat: 4.6, price: 0.5, color: '#2E2E2E', tint: 0.2, particle: true, max: 2 },
      { id: 'flax', name: 'Flax seeds', emoji: '🟤', portion: '10 g', kcal: 53, protein: 1.8, carbs: 2.9, fat: 4.2, price: 0.4, color: '#8A5A2B', tint: 0.2, particle: true, max: 2 },
    ],
  },
  {
    id: 'performance',
    icon: '⚡',
    name: 'Performance',
    hint: 'Flavourless supplements, dosed at the recommended serving.',
    items: [
      { id: 'creatine', name: 'Creatine monohydrate', emoji: '⚡', portion: '5 g', kcal: 0, protein: 0, carbs: 0, fat: 0, price: 0.6, color: '#FFFFFF', tint: 0, max: 1 },
      { id: 'collagen', name: 'Collagen', emoji: '✨', portion: '10 g', kcal: 36, protein: 9, carbs: 0, fat: 0, price: 0.9, color: '#FFFFFF', tint: 0, max: 2 },
      { id: 'glutamine', name: 'Glutamine', emoji: '🔋', portion: '5 g', kcal: 20, protein: 5, carbs: 0, fat: 0, price: 0.5, color: '#FFFFFF', tint: 0, max: 1 },
      { id: 'electrolytes', name: 'Electrolytes', emoji: '🧂', portion: '1 scoop (5 g)', kcal: 5, protein: 0, carbs: 1.2, fat: 0, price: 0.5, color: '#FFFFFF', tint: 0, max: 1 },
    ],
  },
]

// Flat index to look up an add-on by its id.
export const ADDONS_BY_ID = Object.fromEntries(
  ADDON_CATEGORIES.flatMap((cat) => cat.items.map((item) => [item.id, { ...item, category: cat.id }])),
)

export const BASES_BY_ID = Object.fromEntries(BASES.map((b) => [b.id, b]))
