/**
 * Clothing taxonomy, style attributes, and fashion data constants.
 */

export const CATEGORIES = {
  tops: { label: 'Tops', items: ['t-shirt', 'blouse', 'shirt', 'polo', 'tank-top', 'crop-top', 'sweater', 'hoodie', 'cardigan', 'turtleneck'] },
  bottoms: { label: 'Bottoms', items: ['jeans', 'chinos', 'trousers', 'shorts', 'skirt', 'leggings', 'joggers', 'cargo-pants'] },
  outerwear: { label: 'Outerwear', items: ['jacket', 'blazer', 'coat', 'parka', 'vest', 'windbreaker', 'denim-jacket', 'leather-jacket'] },
  dresses: { label: 'Dresses', items: ['casual-dress', 'formal-dress', 'maxi-dress', 'mini-dress', 'sundress', 'wrap-dress'] },
  shoes: { label: 'Shoes', items: ['sneakers', 'boots', 'loafers', 'heels', 'sandals', 'flats', 'oxfords', 'running-shoes'] },
  accessories: { label: 'Accessories', items: ['watch', 'belt', 'scarf', 'hat', 'sunglasses', 'bag', 'necklace', 'bracelet', 'ring', 'earrings'] }
};

export const STYLE_PERSONAS = [
  { id: 'minimalist', label: 'Minimalist', emoji: '◻️', description: 'Clean lines, neutral palettes, less is more', colors: ['black', 'white', 'gray', 'navy', 'beige'] },
  { id: 'classic', label: 'Classic', emoji: '👔', description: 'Timeless pieces, structured fits, refined taste', colors: ['navy', 'white', 'charcoal', 'burgundy', 'camel'] },
  { id: 'streetwear', label: 'Streetwear', emoji: '🔥', description: 'Bold graphics, relaxed fits, urban edge', colors: ['black', 'white', 'red', 'olive', 'gray'] },
  { id: 'bold', label: 'Bold', emoji: '💥', description: 'Vibrant colors, statement pieces, stand out', colors: ['red', 'yellow', 'electric-blue', 'fuchsia', 'orange'] },
  { id: 'bohemian', label: 'Bohemian', emoji: '🌿', description: 'Earthy tones, flowing fabrics, free spirit', colors: ['terracotta', 'sage', 'cream', 'rust', 'mustard'] },
  { id: 'sporty', label: 'Sporty', emoji: '⚡', description: 'Athletic wear, comfort-first, dynamic', colors: ['black', 'gray', 'white', 'neon-green', 'blue'] }
];

export const OCCASIONS = [
  'daily', 'work', 'date-night', 'party', 'outdoor', 'gym', 'formal-event', 'casual-hangout', 'travel', 'beach'
];

export const SEASONS = [
  { id: 'spring', label: 'Spring', emoji: '🌸', tempRange: [10, 22], attributes: ['light layers', 'pastels', 'floral'] },
  { id: 'summer', label: 'Summer', emoji: '☀️', tempRange: [23, 40], attributes: ['breathable', 'shorts', 'bright colors'] },
  { id: 'autumn', label: 'Autumn', emoji: '🍂', tempRange: [5, 18], attributes: ['layering', 'earth tones', 'knitwear'] },
  { id: 'winter', label: 'Winter', emoji: '❄️', tempRange: [-20, 5], attributes: ['heavy coats', 'dark colors', 'insulation'] }
];

export const COLOR_SEASONS = {
  spring: { label: 'Spring', palettes: ['warm pastels', 'coral', 'peach', 'mint green', 'golden yellow'] },
  summer: { label: 'Summer', palettes: ['cool pastels', 'powder blue', 'lavender', 'rose pink', 'soft gray'] },
  autumn: { label: 'Autumn', palettes: ['earth tones', 'rust', 'olive', 'mustard', 'terracotta'] },
  winter: { label: 'Winter', palettes: ['jewel tones', 'emerald', 'sapphire', 'ruby', 'pure white', 'black'] }
};

export const MATERIALS = [
  { id: 'cotton', label: 'Cotton', warmth: 3, breathability: 8, waterproof: 1 },
  { id: 'wool', label: 'Wool', warmth: 9, breathability: 5, waterproof: 3 },
  { id: 'linen', label: 'Linen', warmth: 1, breathability: 10, waterproof: 1 },
  { id: 'polyester', label: 'Polyester', warmth: 5, breathability: 3, waterproof: 6 },
  { id: 'leather', label: 'Leather', warmth: 7, breathability: 2, waterproof: 7 },
  { id: 'silk', label: 'Silk', warmth: 2, breathability: 7, waterproof: 1 },
  { id: 'denim', label: 'Denim', warmth: 6, breathability: 4, waterproof: 2 },
  { id: 'nylon', label: 'Nylon', warmth: 4, breathability: 2, waterproof: 8 }
];

export const DRESS_CODES = [
  'casual', 'smart-casual', 'business-casual', 'business-formal', 'black-tie', 'cocktail', 'athleisure'
];

/**
 * Returns human-readable label for a category.
 * @param {string} categoryId - The category ID (e.g. 'tops').
 * @returns {string} The label.
 */
export function getCategoryLabel(categoryId) {
  return CATEGORIES[categoryId]?.label || categoryId;
}

/**
 * Returns formatted label for an occasion.
 * @param {string} occasionId - The occasion ID.
 * @returns {string} Formatted label (e.g., 'date-night' -> 'Date Night').
 */
export function getOccasionLabel(occasionId) {
  return occasionId
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Returns persona object by ID.
 * @param {string} personaId - The persona ID.
 * @returns {Object|undefined} The persona object.
 */
export function getPersonaById(personaId) {
  return STYLE_PERSONAS.find(p => p.id === personaId);
}

/**
 * Returns material properties (warmth, breathability, waterproof).
 * @param {string} material - The material ID.
 * @returns {Object|undefined} The properties.
 */
export function getMaterialProperties(material) {
  return MATERIALS.find(m => m.id === material);
}

/**
 * Returns array of suitable category IDs based on weather temp and occasion.
 * @param {number} weatherTemp - The temperature in Celsius.
 * @param {string} occasion - The occasion ID.
 * @returns {string[]} Array of category IDs.
 */
export function getSuitableCategories(weatherTemp, occasion) {
  const suitable = ['tops', 'bottoms', 'shoes'];
  
  if (weatherTemp < 18) {
    suitable.push('outerwear');
  }
  
  if (occasion === 'formal-event' || occasion === 'date-night') {
    suitable.push('dresses', 'accessories');
  }
  
  if (occasion === 'gym' || occasion === 'beach') {
    if (weatherTemp > 10) {
      const idx = suitable.indexOf('outerwear');
      if (idx > -1) suitable.splice(idx, 1);
    }
  }
  
  return suitable;
}
