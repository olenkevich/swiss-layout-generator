// Layout Engine - Swiss Grid System with mathematical ratios

import { toggle } from './utils.js';

// Smart direction selection based on content and image aspects
export function getSmartDirection(blocks) {
  const images = blocks.filter(b => b.type === 'image');
  const imageCount = images.length;
  const textCount = blocks.filter(b => ['header', 'subheader', 'body'].includes(b.type)).length;
  
  // Check image aspect ratios for layout decisions
  const hasLandscapeImage = images.some(img => img.preserveAspect && img.isLandscape);
  const hasPortraitImage = images.some(img => img.preserveAspect && img.isPortrait);
  
  // Portrait images work better in rows (horizontal layout) to give them width
  if (hasPortraitImage && textCount >= 1) {
    return 'row';
  }
  
  // Landscape images can work well in columns (vertical stacking)
  if (hasLandscapeImage && textCount >= 1) {
    return 'col';
  }
  
  // Text-heavy layouts work better in columns (vertical stacking)
  if (textCount > imageCount && textCount > 2) {
    return 'col';
  }
  
  // Image + text combinations work better in rows (horizontal layout)
  if (imageCount >= 1 && textCount >= 1) {
    return 'row';
  }
  
  // Multiple images create gallery-like arrangements in rows
  if (imageCount > 1) {
    return 'row';
  }
  
  // Default to column for simple layouts
  return 'col';
}

// Weight-based ratio calculation system
export function getWeightBasedRatio(itemsA, itemsB) {
  // Calculate total weights for each group
  const weightA = itemsA.reduce((sum, item) => sum + (item.sizeWeight || 2), 0);
  const weightB = itemsB.reduce((sum, item) => sum + (item.sizeWeight || 2), 0);
  const totalWeight = weightA + weightB;
  
  // Convert to ratio (what portion does group A get)
  const ratio = weightA / totalWeight;
  
  // Ensure reasonable bounds (don't let any section get too small)
  const MIN_SECTION = 0.2;  // Minimum 20% for readability
  const MAX_SECTION = 0.8;  // Maximum 80% to keep balance
  
  return Math.max(MIN_SECTION, Math.min(MAX_SECTION, ratio));
}

// Simplified ratio system - fallback for backward compatibility  
export function getSmartRatio(items, hasHero) {
  const EQUAL = 0.5;       // Equal split - balanced
  const GOLDEN = 0.618;    // Golden ratio - pleasant asymmetry
  
  // Simple logic based on content priority
  const hasImages = items.some(item => item.type === 'image');
  const hasHeaders = items.some(item => item.type === 'header');
  
  // Check for large elements (weight > 2)
  const hasLargeElements = items.some(item => (item.sizeWeight || 2) > 2);
  
  if (hasLargeElements || hasHero || hasHeaders) {
    return GOLDEN; // Priority content gets golden ratio space
  }
  
  // Images get priority space  
  if (hasImages) {
    return GOLDEN;
  }
  
  // Default to equal split for balanced layouts
  return EQUAL;
}

export function subdivide(items, dir) {
  if (items.length === 1) return { kind: "leaf", item: items[0] };
  
  // Weight-based 2-item logic
  if (items.length === 2) {
    // Use weight-based calculation
    const ratio = getWeightBasedRatio([items[0]], [items[1]]);
    
    return {
      kind: "split",
      direction: dir,
      ratio,
      a: { kind: "leaf", item: items[0] },
      b: { kind: "leaf", item: items[1] }
    };
  }
  
  // Weight-based subdivision for multiple items
  // Sort items by weight (heaviest first) to prioritize placement
  const sortedItems = [...items].sort((a, b) => (b.sizeWeight || 2) - (a.sizeWeight || 2));
  
  // Calculate optimal split point based on cumulative weights
  const totalWeight = sortedItems.reduce((sum, item) => sum + (item.sizeWeight || 2), 0);
  let cumulativeWeight = 0;
  let optimalSplit = Math.ceil(items.length / 2); // Default to middle
  
  // Find split point where first group has roughly 40-70% of total weight
  for (let i = 1; i < sortedItems.length; i++) {
    cumulativeWeight += sortedItems[i - 1].sizeWeight || 2;
    const ratio = cumulativeWeight / totalWeight;
    
    if (ratio >= 0.4 && ratio <= 0.7) {
      optimalSplit = i;
      break;
    }
  }
  
  // Split items into two groups at calculated point
  const sectionA = items.slice(0, optimalSplit);
  const sectionB = items.slice(optimalSplit);
  
  // Calculate weight-based ratio between the two sections
  const ratio = getWeightBasedRatio(sectionA, sectionB);
  
  // Recursively subdivide each section
  return {
    kind: "split",
    direction: dir,
    ratio,
    a: subdivide(sectionA, toggle(dir)),
    b: subdivide(sectionB, toggle(dir))
  };
}

export function renderNode(node) {
  if (node.kind === "leaf") {
    const el = document.createElement("div"); 
    let className = "leaf";
    
    // Add aspect-specific classes for images
    if (node.item.type === "image" && node.item.preserveAspect) {
      if (node.item.isLandscape) {
        className += " image-landscape";
      } else if (node.item.isPortrait) {
        className += " image-portrait";
      } else if (node.item.isSquare) {
        className += " image-square";
      }
    }
    
    el.className = className;
    
    if (["header", "subheader", "body"].includes(node.item.type)) {
      const t = document.createElement("div");
      t.className = "text"; 
      t.textContent = node.item.content; 
      t.dataset.id = node.item.id;
      t.dataset.type = node.item.type;
      el.appendChild(t);
    }
    
    if (node.item.type === "image") {
      const img = document.createElement("img"); 
      img.className = node.item.preserveAspect ? "image preserve-aspect" : "image";
      img.src = node.item.src; 
      el.appendChild(img);
    }
    
    if (node.item.type === "logo") {
      const t = document.createElement("div"); 
      t.className = "logo"; 
      t.textContent = node.item.content; 
      el.appendChild(t);
    }
    
    return el;
  }
  
  const wrap = document.createElement("div"); 
  wrap.className = node.direction === "row" ? "row" : "col";
  
  // Consistent ratio assignment - no random flipping
  const ratioA = node.ratio;
  const ratioB = 1 - node.ratio;
  
  const a = document.createElement("div"); 
  a.className = node.direction === "row" ? "row" : "col"; 
  a.style.flex = ratioA;
  
  const b = document.createElement("div"); 
  b.className = node.direction === "row" ? "row" : "col"; 
  b.style.flex = ratioB;
  
  a.appendChild(renderNode(node.a)); 
  b.appendChild(renderNode(node.b));
  wrap.appendChild(a); 
  wrap.appendChild(b); 
  
  return wrap;
}