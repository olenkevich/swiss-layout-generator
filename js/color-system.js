// Enhanced Color System - Beautiful palettes with harmony and contrast

import { 
  rgbToHex, 
  hexToRgb, 
  getBrightness, 
  rgbToHsl, 
  hslToRgb, 
  getLuminance, 
  getContrastRatio 
} from './utils.js';

// Global state
let availablePalettes = [];
let currentPaletteIndex = 0;
let hasImagePalettes = false;

// Make available globally for other modules
window.availablePalettes = availablePalettes;
window.currentPaletteIndex = currentPaletteIndex;

// Beautiful predefined color palettes with harmony rules
const BEAUTIFUL_PALETTES = [
  // Warm & Cozy
  { name: 'Warm Sunset', colors: [{ h: 25, s: 0.8, l: 0.6 }, { h: 15, s: 0.7, l: 0.5 }, { h: 35, s: 0.9, l: 0.7 }] },
  { name: 'Autumn Leaves', colors: [{ h: 30, s: 0.9, l: 0.5 }, { h: 15, s: 0.8, l: 0.4 }, { h: 45, s: 0.7, l: 0.6 }] },
  
  // Cool & Calm  
  { name: 'Ocean Breeze', colors: [{ h: 200, s: 0.7, l: 0.5 }, { h: 190, s: 0.8, l: 0.4 }, { h: 210, s: 0.6, l: 0.6 }] },
  { name: 'Forest Mist', colors: [{ h: 120, s: 0.5, l: 0.4 }, { h: 140, s: 0.6, l: 0.5 }, { h: 100, s: 0.4, l: 0.3 }] },
  
  // Vibrant & Energetic
  { name: 'Tropical Paradise', colors: [{ h: 180, s: 0.8, l: 0.5 }, { h: 300, s: 0.7, l: 0.6 }, { h: 60, s: 0.9, l: 0.7 }] },
  { name: 'Spring Garden', colors: [{ h: 90, s: 0.6, l: 0.5 }, { h: 320, s: 0.8, l: 0.6 }, { h: 270, s: 0.7, l: 0.5 }] },
  
  // Sophisticated & Modern
  { name: 'Urban Sunset', colors: [{ h: 280, s: 0.6, l: 0.4 }, { h: 20, s: 0.8, l: 0.6 }, { h: 350, s: 0.5, l: 0.3 }] },
  { name: 'Nordic Minimalism', colors: [{ h: 220, s: 0.3, l: 0.4 }, { h: 200, s: 0.4, l: 0.6 }, { h: 240, s: 0.2, l: 0.3 }] },
  
  // Earth Tones
  { name: 'Desert Sand', colors: [{ h: 40, s: 0.5, l: 0.6 }, { h: 25, s: 0.6, l: 0.4 }, { h: 55, s: 0.4, l: 0.7 }] },
  { name: 'Mountain Stone', colors: [{ h: 20, s: 0.2, l: 0.4 }, { h: 200, s: 0.3, l: 0.5 }, { h: 60, s: 0.4, l: 0.3 }] },
];

// Apply colors to the canvas
export function applyColors() {
  const root = document.documentElement;
  const bg = document.getElementById('bgColor').value;
  const text = document.getElementById('textColor').value;
  const accent = document.getElementById('accentColor').value;
  
  root.style.setProperty('--bg', bg);
  root.style.setProperty('--ink', text);
  root.style.setProperty('--accent', accent);
}

// Enhanced shuffle colors - cycle through beautiful palettes
export function shuffleColors() {
  // If no palettes available, generate random beautiful ones
  if (!availablePalettes.length) {
    generateRandomBeautifulPalettes();
  }
  
  // Cycle to next palette
  currentPaletteIndex = (currentPaletteIndex + 1) % availablePalettes.length;
  const palette = availablePalettes[currentPaletteIndex];
  
  // Apply the palette
  document.getElementById('bgColor').value = palette.bg;
  document.getElementById('textColor').value = palette.text;
  document.getElementById('accentColor').value = palette.accent;
  
  // Update palette name display
  const paletteNameEl = document.getElementById('currentPalette');
  if (paletteNameEl) {
    paletteNameEl.textContent = palette.name || 'Custom Palette';
  }
  
  applyColors();
  
  // Visual feedback
  console.log(`Applied palette: ${palette.name || 'Custom'}`);
}

// Generate beautiful random palettes when no image is present
function generateRandomBeautifulPalettes() {
  availablePalettes = [];
  hasImagePalettes = false;
  
  // Create variations of each beautiful palette
  BEAUTIFUL_PALETTES.forEach(basePalette => {
    const variations = createPaletteVariations(basePalette);
    availablePalettes.push(...variations);
  });
  
  // Add some completely random but harmonious palettes
  for (let i = 0; i < 5; i++) {
    const randomPalette = generateHarmoniousPalette();
    availablePalettes.push(randomPalette);
  }
  
  currentPaletteIndex = 0;
  
  // Sync global state
  window.availablePalettes = availablePalettes;
  window.currentPaletteIndex = currentPaletteIndex;
}

// Create light/dark variations of a base palette
function createPaletteVariations(basePalette) {
  const variations = [];
  const primaryColor = basePalette.colors[0];
  const secondaryColor = basePalette.colors[1];
  
  // Light variation - tinted background
  const lightBg = hslToRgb(primaryColor.h, 0.15, 0.95);
  const lightText = hslToRgb(secondaryColor.h, 0.8, 0.15);
  const lightAccent = hslToRgb(primaryColor.h, 0.7, 0.4);
  
  variations.push({
    name: `${basePalette.name} Light`,
    bg: rgbToHex(lightBg),
    text: rgbToHex(lightText),
    accent: rgbToHex(lightAccent),
    mood: 'light'
  });
  
  // Dark variation - deep background
  const darkBg = hslToRgb(secondaryColor.h, 0.4, 0.1);
  const darkText = hslToRgb(primaryColor.h, 0.3, 0.9);
  const darkAccent = hslToRgb(primaryColor.h, 0.8, 0.6);
  
  variations.push({
    name: `${basePalette.name} Dark`,
    bg: rgbToHex(darkBg),
    text: rgbToHex(darkText),
    accent: rgbToHex(darkAccent),
    mood: 'dark'
  });
  
  // Vibrant variation - colored background
  const vibrantBg = hslToRgb(primaryColor.h, 0.6, 0.7);
  const vibrantText = hslToRgb((primaryColor.h + 180) % 360, 0.8, 0.1); // Complementary
  const vibrantAccent = hslToRgb(secondaryColor.h, 0.9, 0.3);
  
  // Ensure contrast for vibrant
  if (getContrastRatio(hexToRgb(rgbToHex(vibrantBg)), hexToRgb(rgbToHex(vibrantText))) < 4.5) {
    vibrantText.l = 0.05; // Make text very dark
  }
  
  variations.push({
    name: `${basePalette.name} Vibrant`,
    bg: rgbToHex(vibrantBg),
    text: rgbToHex(vibrantText),
    accent: rgbToHex(vibrantAccent),
    mood: 'vibrant'
  });
  
  return variations;
}

// Generate a harmonious palette using color theory
function generateHarmoniousPalette() {
  // Pick a random base hue
  const baseHue = Math.random() * 360;
  
  // Choose a harmony type
  const harmonyTypes = ['monochromatic', 'analogous', 'complementary', 'triadic'];
  const harmonyType = harmonyTypes[Math.floor(Math.random() * harmonyTypes.length)];
  
  let colors = [];
  
  switch (harmonyType) {
    case 'monochromatic':
      colors = [
        { h: baseHue, s: 0.7, l: 0.3 },
        { h: baseHue, s: 0.5, l: 0.6 },
        { h: baseHue, s: 0.8, l: 0.4 }
      ];
      break;
      
    case 'analogous':
      colors = [
        { h: baseHue, s: 0.7, l: 0.4 },
        { h: (baseHue + 30) % 360, s: 0.6, l: 0.5 },
        { h: (baseHue - 30 + 360) % 360, s: 0.8, l: 0.3 }
      ];
      break;
      
    case 'complementary':
      colors = [
        { h: baseHue, s: 0.8, l: 0.4 },
        { h: (baseHue + 180) % 360, s: 0.7, l: 0.5 },
        { h: (baseHue + 30) % 360, s: 0.6, l: 0.6 }
      ];
      break;
      
    case 'triadic':
      colors = [
        { h: baseHue, s: 0.7, l: 0.4 },
        { h: (baseHue + 120) % 360, s: 0.6, l: 0.5 },
        { h: (baseHue + 240) % 360, s: 0.8, l: 0.3 }
      ];
      break;
  }
  
  // Create variations
  const variations = createPaletteVariations({ 
    name: `Random ${harmonyType}`, 
    colors 
  });
  
  // Return one random variation
  return variations[Math.floor(Math.random() * variations.length)];
}

// Extract colors from uploaded images
export async function extractColorsFromImage(imageSrc) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Optimize canvas size for color extraction
        const maxSize = 100;
        const scale = Math.min(maxSize / img.width, maxSize / img.height);
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const dominantColors = extractDominantColors(imageData);
        
        resolve(dominantColors);
      } catch (error) {
        reject(error);
      }
    };
    
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = imageSrc;
  });
}

// Extract dominant colors using improved clustering
function extractDominantColors(imageData) {
  const data = imageData.data;
  const colors = [];
  
  // Sample pixels more efficiently
  for (let i = 0; i < data.length; i += 16) { // Every 4th pixel
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const a = data[i + 3];
    
    // Skip transparent and extreme colors
    if (a < 200) continue;
    if (r + g + b < 50 || r + g + b > 650) continue;
    
    colors.push({ r, g, b });
  }
  
  // Use k-means clustering to find 5 dominant colors
  return kMeansColors(colors, 5);
}

// Simple k-means clustering for color extraction
function kMeansColors(colors, k) {
  if (colors.length === 0) return [];
  
  // Initialize centroids randomly
  let centroids = [];
  for (let i = 0; i < k; i++) {
    centroids.push(colors[Math.floor(Math.random() * colors.length)]);
  }
  
  // Iterate to find stable centroids
  for (let iter = 0; iter < 10; iter++) {
    const clusters = Array(k).fill().map(() => []);
    
    // Assign colors to nearest centroid
    colors.forEach(color => {
      let minDist = Infinity;
      let clusterIndex = 0;
      
      centroids.forEach((centroid, idx) => {
        const dist = colorDistance(color, centroid);
        if (dist < minDist) {
          minDist = dist;
          clusterIndex = idx;
        }
      });
      
      clusters[clusterIndex].push(color);
    });
    
    // Update centroids
    centroids = clusters.map(cluster => {
      if (cluster.length === 0) return centroids[0]; // Fallback
      
      const avgR = cluster.reduce((sum, c) => sum + c.r, 0) / cluster.length;
      const avgG = cluster.reduce((sum, c) => sum + c.g, 0) / cluster.length;
      const avgB = cluster.reduce((sum, c) => sum + c.b, 0) / cluster.length;
      
      return { r: Math.round(avgR), g: Math.round(avgG), b: Math.round(avgB) };
    });
  }
  
  return centroids;
}

// Calculate color distance in RGB space
function colorDistance(c1, c2) {
  return Math.sqrt(
    Math.pow(c1.r - c2.r, 2) +
    Math.pow(c1.g - c2.g, 2) +
    Math.pow(c1.b - c2.b, 2)
  );
}

// Generate palettes from extracted image colors
export async function generateImagePalettes(imageSrc) {
  try {
    const dominantColors = await extractColorsFromImage(imageSrc);
    const imagePalettes = [];
    
    // Create harmonious palettes from each dominant color
    dominantColors.forEach((color, idx) => {
      const hsl = rgbToHsl(color.r, color.g, color.b);
      
      // Create multiple mood variations
      const moods = createImageMoodPalettes(hsl, `Image Color ${idx + 1}`);
      imagePalettes.push(...moods);
    });
    
    // Set as available palettes
    availablePalettes = imagePalettes;
    hasImagePalettes = true;
    currentPaletteIndex = 0;
    
    // Auto-apply the first palette
    if (imagePalettes.length > 0) {
      const firstPalette = imagePalettes[0];
      document.getElementById('bgColor').value = firstPalette.bg;
      document.getElementById('textColor').value = firstPalette.text;
      document.getElementById('accentColor').value = firstPalette.accent;
      
      // Update palette name display
      const paletteNameEl = document.getElementById('currentPalette');
      if (paletteNameEl) {
        paletteNameEl.textContent = firstPalette.name || 'Image Palette';
      }
      
      applyColors();
    }
    
    console.log(`Generated ${imagePalettes.length} palettes from image`);
    
  } catch (error) {
    console.error('Image color extraction failed:', error);
    // Fallback to random palettes
    generateRandomBeautifulPalettes();
  }
}

// Create mood-based palettes from image colors
function createImageMoodPalettes(baseHsl, baseName) {
  const palettes = [];
  
  // Soft harmony - desaturated background, rich text
  const softBg = hslToRgb(baseHsl.h, 0.1, 0.95);
  const softText = hslToRgb((baseHsl.h + 15) % 360, 0.8, 0.2);
  const softAccent = hslToRgb(baseHsl.h, 0.6, 0.5);
  
  palettes.push({
    name: `${baseName} Soft`,
    bg: rgbToHex(softBg),
    text: rgbToHex(softText),
    accent: rgbToHex(softAccent),
    mood: 'soft'
  });
  
  // Bold harmony - image color as background
  const boldBg = hslToRgb(baseHsl.h, Math.min(0.4, baseHsl.s), Math.max(0.7, baseHsl.l));
  const boldText = hslToRgb((baseHsl.h + 180) % 360, 0.9, 0.1);
  const boldAccent = hslToRgb((baseHsl.h + 60) % 360, 0.8, 0.3);
  
  // Ensure contrast
  if (getContrastRatio(hexToRgb(rgbToHex(boldBg)), hexToRgb(rgbToHex(boldText))) < 4.5) {
    boldText.l = 0.05;
  }
  
  palettes.push({
    name: `${baseName} Bold`,
    bg: rgbToHex(boldBg),
    text: rgbToHex(boldText),
    accent: rgbToHex(boldAccent),
    mood: 'bold'
  });
  
  // Elegant harmony - muted colors
  const elegantBg = hslToRgb(baseHsl.h, 0.2, 0.9);
  const elegantText = hslToRgb(baseHsl.h, 0.4, 0.15);
  const elegantAccent = hslToRgb(baseHsl.h, 0.7, 0.4);
  
  palettes.push({
    name: `${baseName} Elegant`,
    bg: rgbToHex(elegantBg),
    text: rgbToHex(elegantText),
    accent: rgbToHex(elegantAccent),
    mood: 'elegant'
  });
  
  return palettes;
}

// Initialize color system - called when app starts
export function initializeColorSystem() {
  try {
    generateRandomBeautifulPalettes();
    
    // Apply first palette immediately
    if (availablePalettes.length > 0) {
      const firstPalette = availablePalettes[0];
      
      // Check if DOM elements exist
      const bgColorEl = document.getElementById('bgColor');
      const textColorEl = document.getElementById('textColor');
      const accentColorEl = document.getElementById('accentColor');
      
      if (bgColorEl && textColorEl && accentColorEl) {
        bgColorEl.value = firstPalette.bg;
        textColorEl.value = firstPalette.text;
        accentColorEl.value = firstPalette.accent;
        
        // Update palette name display
        const paletteNameEl = document.getElementById('currentPalette');
        if (paletteNameEl) {
          paletteNameEl.textContent = firstPalette.name || 'Random Palette';
        }
        
        applyColors();
      }
    }
  } catch (error) {
    console.warn('Color system initialization failed:', error);
    // Fallback to basic colors
    const root = document.documentElement;
    root.style.setProperty('--bg', '#ffffff');
    root.style.setProperty('--ink', '#111111');
    root.style.setProperty('--accent', '#111111');
  }
}

// Export state for other modules
export function getColorSystemState() {
  return {
    availablePalettes,
    currentPaletteIndex,
    hasImagePalettes,
    currentPalette: availablePalettes[currentPaletteIndex]
  };
}

// Legacy function for backwards compatibility
export async function extractColorsFromGeneratedImage(imageUrl) {
  return generateImagePalettes(imageUrl);
}

// Legacy function for backwards compatibility  
export function displayColorPalette() {
  // No longer needed - palette name shows in UI
  console.log('Color palette display is now handled in the UI');
}

// Legacy function for backwards compatibility
export function hideColorPalette() {
  // No longer needed
  console.log('Color palette hiding is no longer needed');
}

// Legacy function for backwards compatibility
export function resetColorSystem() {
  generateRandomBeautifulPalettes();
}