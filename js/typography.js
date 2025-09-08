// Typography System - Swiss precision text fitting

import { SCALE, TYPE_PROPS, BASELINE } from './utils.js';

export function fitText(container, el, item) {
  const maxW = container.offsetWidth;
  const maxH = container.offsetHeight;
  
  // Safety check - if container has no dimensions, skip fitting
  if (maxW <= 0 || maxH <= 0) {
    console.warn('Container has no dimensions, skipping text fitting');
    return;
  }
  
  // Get base size and properties for this type
  const originalSize = SCALE[item.type] || SCALE.body;
  let fontSize = originalSize;
  const props = TYPE_PROPS[item.type] || TYPE_PROPS.body;
  
  // Preserve hierarchy - don't scale headers below 75% of original
  const minSizeRatio = item.type === 'header' ? 0.75 : 
                       item.type === 'subheader' ? 0.8 : 
                       item.type === 'logo' ? 0.8 : 0.6;
  const hierarchyMinSize = Math.floor(originalSize * minSizeRatio);
  
  // Apply Swiss design principles
  const applyTypography = () => {
    el.style.fontSize = fontSize + 'px';
    el.style.fontWeight = props.weight;
    el.style.letterSpacing = props.letterSpacing;
    
    // Calculate line height with baseline grid alignment
    const rawLineHeight = fontSize * props.lineHeight;
    const baselineAlignedHeight = Math.max(
      BASELINE, 
      Math.round(rawLineHeight / BASELINE) * BASELINE
    );
    el.style.lineHeight = baselineAlignedHeight + 'px';
    
    // Swiss/German optical corrections with contextual awareness
    if (fontSize >= 48) {
      // Large display text - aggressive tightening for impact
      el.style.letterSpacing = 'calc(' + props.letterSpacing + ' - 0.02em)';
    } else if (fontSize >= 32) {
      // Medium headers - moderate tightening
      el.style.letterSpacing = 'calc(' + props.letterSpacing + ' - 0.005em)';
    } else if (fontSize <= 18) {
      // Small text - expanded for legibility (Soviet influence)
      el.style.letterSpacing = 'calc(' + props.letterSpacing + ' + 0.025em)';
    }
    
    // Contextual adjustments based on container size
    const containerArea = maxW * maxH;
    if (containerArea < 10000) {
      // Tight spaces - compress slightly more
      el.style.letterSpacing = 'calc(' + el.style.letterSpacing + ' - 0.005em)';
    }
  };
  
  applyTypography();
  
  // Swiss precision - maintain hierarchy while fitting, more flexible for headers
  const isHeader = item.type === 'header';
  const minSize = isHeader ? 
    Math.max(14, fontSize * 0.45) :  // Headers can shrink more but stay readable
    Math.max(12, fontSize * 0.6);   // Other text maintains stricter limits
  let guard = 100;
  
  while (guard-- > 0 && fontSize > minSize) {
    // More accurate overflow detection - check against actual container dimensions
    // Use getBoundingClientRect for more precise measurements
    const containerRect = container.getBoundingClientRect();
    const textRect = el.getBoundingClientRect();
    
    // Account for leaf padding (24px) and some safety margin
    const safetyMargin = 8;
    const availableWidth = maxW - safetyMargin;
    const availableHeight = maxH - safetyMargin;
    
    // Check if text is overflowing the container
    const isOverflowing = el.scrollWidth > availableWidth || el.scrollHeight > availableHeight;
    if (!isOverflowing) break;
    
    fontSize = Math.max(minSize, fontSize - 2); // Reduce in larger steps for efficiency
    applyTypography();
  }
  
  // Final baseline alignment check
  const computedHeight = parseFloat(el.style.lineHeight);
  if (computedHeight % BASELINE !== 0) {
    el.style.lineHeight = (Math.round(computedHeight / BASELINE) * BASELINE) + 'px';
  }
}

export function recalcAllText(canvas, blocks) {
  canvas.querySelectorAll(".text").forEach(el => {
    const block = blocks.find(b => b.id === el.dataset.id);
    if (block) fitText(el.parentElement, el, block);
  });
}

// Format chooser functionality
export function setFormat(fmt) {
  const root = document.documentElement;
  let w = 1600, h = 900;  // Increased base size for better density
  if (fmt === "1-1") { w = 1200; h = 1200; }  // Larger square format
  if (fmt === "a4") { w = 1000; h = 1400; }   // Larger A4
  if (fmt === "a4landscape") { w = 1400; h = 1000; }  // Larger A4 landscape
  root.style.setProperty("--canvas-w", w + "px");
  root.style.setProperty("--canvas-h", h + "px");
  return { w, h };
}