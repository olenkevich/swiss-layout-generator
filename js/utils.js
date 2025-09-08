// Shared utility functions

// Typography Scale - Swiss Design Hierarchy (Enhanced with 1.4x multiplier)
export const SCALE = { 
  header: 120,    // Primary headlines - strong presence
  subheader: 60,  // Secondary headlines - clear hierarchy  
  body: 45,       // Main text - optimal readability
  logo: 90,       // Brand identity - balanced prominence
  lead: 75,       // Introductory text - intermediate hierarchy
  small: 35,      // Supporting text - maintains legibility
  caption: 28     // Fine print - compact but readable
};

// Typography Properties - Swiss/German/Soviet Hierarchy
export const TYPE_PROPS = {
  header: { weight: 600, lineHeight: 1.1, letterSpacing: '-0.03em' },     // Bold for impact
  subheader: { weight: 500, lineHeight: 1.2, letterSpacing: '-0.015em' }, // Medium hierarchy
  body: { weight: 400, lineHeight: 1.4, letterSpacing: '0' },             // Regular readability
  logo: { weight: 500, lineHeight: 1.1, letterSpacing: '-0.02em' },       // Medium brand presence
  lead: { weight: 450, lineHeight: 1.3, letterSpacing: '-0.01em' },       // Slightly bold intro
  small: { weight: 400, lineHeight: 1.5, letterSpacing: '0.015em' },      // Regular with space
  caption: { weight: 400, lineHeight: 1.5, letterSpacing: '0.05em' }      // Extended fine print
};

export const BASELINE = 8;

// Utility functions
export function toggle(d) { 
  return d === 'row' ? 'col' : 'row'; 
}

export function generateId() {
  return (crypto.randomUUID) ? crypto.randomUUID() : ("id-"+Math.random().toString(36).slice(2));
}

// Color utility functions
export function rgbToHex(r, g, b) {
  // Handle both object and individual parameters
  if (typeof r === 'object') {
    const color = r;
    r = color.r;
    g = color.g;
    b = color.b;
  }
  
  // Ensure valid numbers
  r = Math.round(Math.max(0, Math.min(255, Number(r) || 0)));
  g = Math.round(Math.max(0, Math.min(255, Number(g) || 0))); 
  b = Math.round(Math.max(0, Math.min(255, Number(b) || 0)));
  
  return '#' + 
    r.toString(16).padStart(2, '0') +
    g.toString(16).padStart(2, '0') +
    b.toString(16).padStart(2, '0');
}

export function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

export function getBrightness(r, g, b) {
  if (typeof r === 'object') {
    const color = r;
    r = color.r;
    g = color.g; 
    b = color.b;
  }
  return (r * 299 + g * 587 + b * 114) / 1000;
}

export function rgbToHsl(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0; // achromatic
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return { h: h * 360, s, l };
}

export function hslToRgb(h, s, l) {
  h /= 360;
  
  const hue2rgb = (p, q, t) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1/6) return p + (q - p) * 6 * t;
    if (t < 1/2) return q;
    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
    return p;
  };

  let r, g, b;
  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255)
  };
}

export function getLuminance(r, g, b) {
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

export function getContrastRatio(color1, color2) {
  const lum1 = getLuminance(color1.r, color1.g, color1.b);
  const lum2 = getLuminance(color2.r, color2.g, color2.b);
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  return (lighter + 0.05) / (darker + 0.05);
}