/**
 * Color conversion and harmony scoring library.
 */

/**
 * Converts a hex color string to an RGB object.
 * @param {string} hex - The hex color string.
 * @returns {{r: number, g: number, b: number}} The RGB representation.
 */
export function hexToRgb(hex) {
  let h = hex.replace(/^#/, '');
  if (h.length === 3) {
    h = h.split('').map(c => c + c).join('');
  }
  const int = parseInt(h, 16);
  return {
    r: (int >> 16) & 255,
    g: (int >> 8) & 255,
    b: int & 255
  };
}

/**
 * Converts RGB values to a hex color string.
 * @param {number} r - Red (0-255).
 * @param {number} g - Green (0-255).
 * @param {number} b - Blue (0-255).
 * @returns {string} The hex color string.
 */
export function rgbToHex(r, g, b) {
  return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
}

/**
 * Converts a hex color string to an HSL object.
 * @param {string} hex - The hex color string.
 * @returns {{h: number, s: number, l: number}} The HSL representation.
 */
export function hexToHsl(hex) {
  const { r, g, b } = hexToRgb(hex);
  const rNorm = r / 255;
  const gNorm = g / 255;
  const bNorm = b / 255;
  
  const max = Math.max(rNorm, gNorm, bNorm);
  const min = Math.min(rNorm, gNorm, bNorm);
  
  let h = 0, s = 0, l = (max + min) / 2;
  
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case rNorm: h = (gNorm - bNorm) / d + (gNorm < bNorm ? 6 : 0); break;
      case gNorm: h = (bNorm - rNorm) / d + 2; break;
      case bNorm: h = (rNorm - gNorm) / d + 4; break;
    }
    h /= 6;
  }
  
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

/**
 * Converts HSL values to a hex color string.
 * @param {number} h - Hue (0-360).
 * @param {number} s - Saturation (0-100).
 * @param {number} l - Lightness (0-100).
 * @returns {string} The hex color string.
 */
export function hslToHex(h, s, l) {
  s /= 100;
  l /= 100;
  
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  
  let r = 0, g = 0, b = 0;
  
  if (h >= 0 && h < 60) { r = c; g = x; b = 0; }
  else if (h >= 60 && h < 120) { r = x; g = c; b = 0; }
  else if (h >= 120 && h < 180) { r = 0; g = c; b = x; }
  else if (h >= 180 && h < 240) { r = 0; g = x; b = c; }
  else if (h >= 240 && h < 300) { r = x; g = 0; b = c; }
  else if (h >= 300 && h < 360) { r = c; g = 0; b = x; }
  
  return rgbToHex(Math.round((r + m) * 255), Math.round((g + m) * 255), Math.round((b + m) * 255));
}

const COLOR_NAMES = [
  { name: 'red', h: 0, s: 100, l: 50 },
  { name: 'rose', h: 330, s: 80, l: 70 },
  { name: 'pink', h: 350, s: 80, l: 80 },
  { name: 'coral', h: 15, s: 80, l: 65 },
  { name: 'orange', h: 30, s: 100, l: 50 },
  { name: 'amber', h: 45, s: 100, l: 50 },
  { name: 'gold', h: 50, s: 100, l: 50 },
  { name: 'yellow', h: 60, s: 100, l: 50 },
  { name: 'lime', h: 90, s: 100, l: 50 },
  { name: 'green', h: 120, s: 100, l: 50 },
  { name: 'emerald', h: 150, s: 100, l: 40 },
  { name: 'teal', h: 180, s: 100, l: 30 },
  { name: 'cyan', h: 180, s: 100, l: 50 },
  { name: 'sky', h: 210, s: 100, l: 70 },
  { name: 'blue', h: 240, s: 100, l: 50 },
  { name: 'indigo', h: 275, s: 100, l: 25 },
  { name: 'violet', h: 285, s: 100, l: 50 },
  { name: 'purple', h: 300, s: 100, l: 25 },
  { name: 'magenta', h: 300, s: 100, l: 50 },
  { name: 'fuchsia', h: 300, s: 100, l: 50 },
  { name: 'brown', h: 30, s: 70, l: 30 },
  { name: 'tan', h: 35, s: 50, l: 70 },
  { name: 'beige', h: 40, s: 30, l: 85 },
  { name: 'cream', h: 50, s: 20, l: 95 },
  { name: 'white', h: 0, s: 0, l: 100 },
  { name: 'ivory', h: 60, s: 10, l: 95 },
  { name: 'gray', h: 0, s: 0, l: 50 },
  { name: 'charcoal', h: 0, s: 0, l: 25 },
  { name: 'black', h: 0, s: 0, l: 0 },
  { name: 'navy', h: 240, s: 100, l: 20 },
  { name: 'olive', h: 60, s: 100, l: 25 },
  { name: 'maroon', h: 0, s: 100, l: 25 },
  { name: 'burgundy', h: 345, s: 50, l: 25 },
  { name: 'khaki', h: 45, s: 40, l: 70 },
  { name: 'crimson', h: 348, s: 90, l: 45 }
];

/**
 * Maps a hex color to a human-readable name.
 * @param {string} hex - The hex color string.
 * @returns {string} The human-readable color name.
 */
export function getColorName(hex) {
  const { h, s, l } = hexToHsl(hex);
  
  if (l < 10) return 'black';
  if (l > 95 && s < 10) return 'white';
  if (s < 10 && l > 10 && l < 95) return l < 40 ? 'charcoal' : 'gray';

  let closest = COLOR_NAMES[0];
  let minDistance = Infinity;

  for (const color of COLOR_NAMES) {
    let dh = Math.min(Math.abs(h - color.h), 360 - Math.abs(h - color.h)) * 2;
    let ds = Math.abs(s - color.s);
    let dl = Math.abs(l - color.l);
    const distance = Math.sqrt(dh*dh + ds*ds + dl*dl);
    
    if (distance < minDistance) {
      minDistance = distance;
      closest = color;
    }
  }

  return closest.name;
}

/**
 * Determines the color harmony type for an array of colors.
 * @param {string[]} colors - Array of hex colors.
 * @returns {string} The harmony type.
 */
export function getHarmonyType(colors) {
  if (colors.length < 2) return 'monochromatic';
  
  const hslColors = colors.map(hexToHsl);
  let isNeutral = true;
  for (const c of hslColors) {
    if (c.s > 15 && c.l > 15 && c.l < 85) isNeutral = false;
  }
  if (isNeutral) return 'neutral';
  
  if (colors.length === 2) {
    const diff = Math.abs(hslColors[0].h - hslColors[1].h);
    const d = Math.min(diff, 360 - diff);
    if (d < 30) return 'analogous';
    if (d > 150) return 'complementary';
    return 'split-complementary';
  }
  
  const hues = hslColors.map(c => c.h).sort((a,b) => a-b);
  let maxDiff = 0;
  for (let i = 0; i < hues.length; i++) {
    const next = (i === hues.length - 1) ? hues[0] + 360 : hues[i+1];
    const diff = next - hues[i];
    if (diff > maxDiff) maxDiff = diff;
  }
  
  if (maxDiff > 200) return 'split-complementary';
  if (maxDiff > 100 && maxDiff < 140 && colors.length === 3) return 'triadic';
  if (maxDiff < 60) return 'analogous';
  
  return 'complementary';
}

/**
 * Scores the harmony of a palette.
 * @param {string[]} colors - Array of hex colors.
 * @returns {{score: number, type: string, explanation: string}} The harmony score details.
 */
export function scoreColorHarmony(colors) {
  const type = getHarmonyType(colors);
  let score = 80;
  let explanation = `The colors exhibit a ${type} harmony.`;
  
  if (type === 'complementary') {
    score = 90;
    explanation = 'Strong contrast and balance between complementary colors.';
  } else if (type === 'analogous') {
    score = 85;
    explanation = 'Smooth transitions and cohesive feeling with analogous colors.';
  } else if (type === 'neutral') {
    score = 95;
    explanation = 'Highly versatile and universally appealing neutral palette.';
  }
  
  return { score, type, explanation };
}

/**
 * Gets the complementary color of a given hex color.
 * @param {string} hex - The hex color string.
 * @returns {string} The complementary hex color.
 */
export function getComplementaryColor(hex) {
  const { h, s, l } = hexToHsl(hex);
  const newH = (h + 180) % 360;
  return hslToHex(newH, s, l);
}

/**
 * Gets analogous colors.
 * @param {string} hex - The base hex color string.
 * @param {number} [count=2] - The number of analogous colors to generate.
 * @returns {string[]} Array of analogous hex colors.
 */
export function getAnalogousColors(hex, count = 2) {
  const { h, s, l } = hexToHsl(hex);
  const colors = [];
  const step = 30;
  const startOffset = -Math.floor(count / 2) * step;
  
  for (let i = 0; i < count; i++) {
    if (startOffset + (i * step) === 0 && count % 2 !== 0) continue;
    const newH = (h + startOffset + (i * step) + 360) % 360;
    colors.push(hslToHex(newH, s, l));
  }
  
  return colors.slice(0, count);
}

/**
 * Scores compatibility between two colors.
 * @param {string} color1 - The first hex color.
 * @param {string} color2 - The second hex color.
 * @returns {number} Score from 0 to 100.
 */
export function scoreColorCompatibility(color1, color2) {
  const h1 = hexToHsl(color1);
  const h2 = hexToHsl(color2);
  
  const diffH = Math.abs(h1.h - h2.h);
  const minH = Math.min(diffH, 360 - diffH);
  
  let score = 50;
  
  if (minH > 150) score += 40;
  else if (minH < 30) score += 30;
  else if (minH > 30 && minH < 90) score -= 20;
  
  const diffL = Math.abs(h1.l - h2.l);
  if (diffL > 40) score += 20;
  
  return Math.max(0, Math.min(100, score));
}
