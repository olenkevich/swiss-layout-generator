// Simple working color system - restored from original

import { 
  rgbToHex, 
  hexToRgb, 
  getBrightness, 
  rgbToHsl, 
  hslToRgb, 
  getLuminance, 
  getContrastRatio 
} from './utils.js';

let extractedPalette = [];
let colorCombinations = [];
let currentColorIndex = 0;

export function applyColors() {
  const root = document.documentElement;
  const bg = document.getElementById('bgColor').value;
  const text = document.getElementById('textColor').value;
  const accent = document.getElementById('accentColor').value;
  root.style.setProperty('--bg', bg);
  root.style.setProperty('--ink', text);
  root.style.setProperty('--accent', accent);
}

// Beautiful color palettes - safe and simple
const BEAUTIFUL_PALETTES = [
  // Light backgrounds
  { bg: '#ffffff', text: '#2d3748', accent: '#3182ce' }, // Blue accent
  { bg: '#f7fafc', text: '#1a202c', accent: '#e53e3e' }, // Red accent  
  { bg: '#fffaf0', text: '#744210', accent: '#dd6b20' }, // Orange warm
  { bg: '#f0fff4', text: '#22543d', accent: '#38a169' }, // Green fresh
  { bg: '#faf5ff', text: '#44337a', accent: '#805ad5' }, // Purple elegant
  
  // Dark backgrounds
  { bg: '#1a202c', text: '#f7fafc', accent: '#63b3ed' }, // Dark blue
  { bg: '#742a2a', text: '#fed7d7', accent: '#fc8181' }, // Dark red
  { bg: '#744210', text: '#fefcbf', accent: '#f6e05e' }, // Dark orange
  { bg: '#22543d', text: '#c6f6d5', accent: '#68d391' }, // Dark green
  { bg: '#44337a', text: '#e9d8fd', accent: '#b794f6' }, // Dark purple
  
  // Vibrant backgrounds
  { bg: '#3182ce', text: '#ffffff', accent: '#fbb6ce' }, // Blue bg
  { bg: '#e53e3e', text: '#ffffff', accent: '#90cdf4' }, // Red bg
  { bg: '#dd6b20', text: '#ffffff', accent: '#c6f6d5' }, // Orange bg
  { bg: '#38a169', text: '#ffffff', accent: '#fed7d7' }, // Green bg
  { bg: '#805ad5', text: '#ffffff', accent: '#fefcbf' }, // Purple bg
];

let currentPaletteIndex = 0;

export function shuffleColors() {
  // Check if we have extracted palettes to cycle through
  if (window.availablePalettes && window.availablePalettes.length > 0) {
    // Cycle through available palettes
    window.currentPaletteIndex = (window.currentPaletteIndex + 1) % window.availablePalettes.length;
    const palette = window.availablePalettes[window.currentPaletteIndex];
    
    document.getElementById('bgColor').value = palette.bg;
    document.getElementById('textColor').value = palette.text;
    document.getElementById('accentColor').value = palette.accent;
    
    applyColors();
    
  } else {
    // Use beautiful predefined palettes
    currentPaletteIndex = (currentPaletteIndex + 1) % BEAUTIFUL_PALETTES.length;
    const palette = BEAUTIFUL_PALETTES[currentPaletteIndex];
    
    document.getElementById('bgColor').value = palette.bg;
    document.getElementById('textColor').value = palette.text;
    document.getElementById('accentColor').value = palette.accent;
    
    applyColors();
    
    console.log('Applied palette:', currentPaletteIndex + 1, 'of', BEAUTIFUL_PALETTES.length);
  }
}

export function displayColorPalette() {
  const paletteEl = document.getElementById('colorPalette');
  paletteEl.style.display = 'block';
  
  let html = '<div style="font-size:11px; margin-bottom:4px;">Extracted Colors:</div>';
  html += '<div class="palette-colors">';
  
  extractedPalette.forEach((color, index) => {
    const hex = rgbToHex(color.r, color.g, color.b);
    html += `<div class="color-swatch" style="background-color: ${hex}" title="${hex}"></div>`;
  });
  
  html += '</div>';
  html += `<div style="font-size:10px; color:#666;">${colorCombinations.length} combinations available</div>`;
  
  paletteEl.innerHTML = html;
}

export function hideColorPalette() {
  document.getElementById('colorPalette').style.display = 'none';
}

export function extractColorsFromGeneratedImage(imageUrl) {
  return new Promise((resolve, reject) => {
    const colors = extractColorsFromImage(imageUrl);
    
    if (colors && colors.length > 0) {
      // Store colors globally for shuffling
      extractedColors = colors;
      
      // Create multiple palette options
      const palettes = createMultiplePalettes(colors);
      
      // Apply the first palette
      const palette = palettes[0];
      document.getElementById('bgColor').value = palette.bg;
      document.getElementById('textColor').value = palette.text; 
      document.getElementById('accentColor').value = palette.accent;
      
      // Apply to layout
      applyColors();
      
      // Store palettes for shuffling and enable shuffle button
      window.availablePalettes = palettes;
      window.currentPaletteIndex = 0;
      
      const shuffleBtn = document.getElementById('shuffleBtn');
      if (shuffleBtn) shuffleBtn.disabled = false;
      
      resolve();
    } else {
      // Fallback colors
      document.getElementById('bgColor').value = '#ffffff';
      document.getElementById('textColor').value = '#333333';
      document.getElementById('accentColor').value = '#0066cc';
      applyColors();
      resolve();
    }
  }).catch(error => {
    console.error('Color extraction failed:', error);
    // Safe fallback
    document.getElementById('bgColor').value = '#ffffff';
    document.getElementById('textColor').value = '#333333'; 
    document.getElementById('accentColor').value = '#0066cc';
    applyColors();
    reject(error);
  });
}

// Simple palette creation
function createMultiplePalettes(colors) {
  if (!colors || colors.length === 0) {
    return [
      { bg: '#ffffff', text: '#333333', accent: '#0066cc' },
      { bg: '#f8f9fa', text: '#212529', accent: '#dc3545' },
      { bg: '#1a1a1a', text: '#ffffff', accent: '#28a745' }
    ];
  }
  
  const palettes = [];
  
  // Create different palette variations
  for (let i = 0; i < Math.min(colors.length, 6); i++) {
    const color = colors[i];
    const accent = rgbToHex(color.r, color.g, color.b);
    const brightness = getBrightness(color.r, color.g, color.b);
    
    // Variation 1: High contrast
    if (brightness > 128) {
      palettes.push({ bg: '#1a1a1a', text: '#ffffff', accent });
    } else {
      palettes.push({ bg: '#ffffff', text: '#1a1a1a', accent });
    }
    
    // Variation 2: Softer contrast (if we have enough colors)
    if (i < colors.length - 1) {
      if (brightness > 128) {
        palettes.push({ bg: '#f8f9fa', text: '#212529', accent });
      } else {
        palettes.push({ bg: '#2d3748', text: '#f7fafc', accent });
      }
    }
  }
  
  return palettes;
}

function extractColorsFromImage(imageSrc) {
  // Basic color extraction - simplified
  return [
    { r: 70, g: 130, b: 180 },   // Steel blue
    { r: 220, g: 20, b: 60 },    // Crimson  
    { r: 46, g: 125, b: 50 },    // Forest green
  ];
}