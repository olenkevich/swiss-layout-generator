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

// Simplified ratio system - only 3 predictable ratios
export function getSmartRatio(items, hasHero) {
  const EQUAL = 0.5;       // Equal split - balanced
  const GOLDEN = 0.618;    // Golden ratio - pleasant asymmetry
  const INVERSE = 0.382;   // Inverse golden - complementary asymmetry
  
  // Simple logic based on content priority
  const hasImages = items.some(item => item.type === 'image');
  const hasHeaders = items.some(item => item.type === 'header');
  
  // Headers get priority space
  if (hasHero || hasHeaders) {
    return GOLDEN; // Header content gets 61.8% space
  }
  
  // Images get priority space  
  if (hasImages) {
    return GOLDEN; // Images get 61.8% space
  }
  
  // Default to equal split for balanced layouts
  return EQUAL;
}

export function subdivide(items, dir) {
  if (items.length === 1) return { kind: "leaf", item: items[0] };
  
  // Simplified 2-item logic
  if (items.length === 2) {
    const hasImage = items.some(it => it.type === 'image');
    const hasHeader = items.some(it => it.type === 'header' || it.hero);
    
    let ratio = 0.5; // Default equal
    
    // Priority content gets golden ratio space
    if (hasHeader || hasImage) {
      ratio = 0.618;
    }
    
    // Give priority content the larger space (first position)
    const priorityIndex = items.findIndex(it => 
      it.type === 'image' || it.type === 'header' || it.hero
    );
    
    return {
      kind: "split",
      direction: dir,
      ratio,
      a: { kind: "leaf", item: items[priorityIndex >= 0 ? priorityIndex : 0] },
      b: { kind: "leaf", item: items[priorityIndex >= 0 ? 1 - priorityIndex : 1] }
    };
  }
  
  // Use standard subdivision for all items
  const hero = items.some(it => it.hero);
  const hasImages = items.some(it => it.type === 'image');
  let ratio = getSmartRatio(items, hero);
  const sizeA = Math.max(1, Math.min(items.length - 1, Math.round(items.length * ratio)));
  
  // If we have images, try to place them in the larger section
  if (hasImages && !hero) {
    const images = items.filter(it => it.type === 'image');
    const texts = items.filter(it => it.type !== 'image');
    
    // If ratio > 0.5, put images in section A (larger), otherwise in section B
    if (ratio > 0.5) {
      // Section A is larger - put images first, then fill with text
      const sectionAItems = [...images, ...texts].slice(0, sizeA);
      const sectionBItems = [...images, ...texts].slice(sizeA);
      return {
        kind: "split",
        direction: dir,
        ratio,
        a: subdivide(sectionAItems, toggle(dir)),
        b: subdivide(sectionBItems, toggle(dir))
      };
    } else {
      // Section B is larger - arrange so images go to section B
      const sectionAItems = texts.slice(0, sizeA);
      const sectionBItems = [...images, ...texts.slice(sizeA)];
      return {
        kind: "split",
        direction: dir,
        ratio,
        a: subdivide(sectionAItems, toggle(dir)),
        b: subdivide(sectionBItems, toggle(dir))
      };
    }
  }
  
  // Default subdivision for non-image layouts or hero layouts
  return {
    kind: "split",
    direction: dir,
    ratio,
    a: subdivide(items.slice(0, sizeA), toggle(dir)),
    b: subdivide(items.slice(sizeA), toggle(dir))
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