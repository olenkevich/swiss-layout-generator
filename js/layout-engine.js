// Layout Engine - Swiss Grid System with mathematical ratios

import { toggle } from './utils.js';

// Smart direction selection based on content
export function getSmartDirection(blocks) {
  const imageCount = blocks.filter(b => b.type === 'image').length;
  const textCount = blocks.filter(b => ['header', 'subheader', 'body'].includes(b.type)).length;
  const hasLogo = blocks.some(b => b.type === 'logo');
  
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

// Smart ratio selection based on content importance
export function getSmartRatio(items, hasHero) {
  // Swiss/German mathematical ratios
  const GOLDEN = 0.618;      // φ - Golden ratio
  const SILVER = 0.414;      // √2-1 - Silver ratio  
  const PERFECT_FIFTH = 0.6; // 3:5 - Musical harmony
  const FIBONACCI_MAJOR = 0.618; // 8:13 Fibonacci
  const FIBONACCI_MINOR = 0.382; // 5:13 Fibonacci
  
  // Hero content gets prominent space
  if (hasHero) {
    const heroRatios = [GOLDEN, SILVER + 0.2, PERFECT_FIFTH];
    return heroRatios[Math.floor(Math.random() * heroRatios.length)];
  }
  
  // Check content types for intelligent sizing
  const hasImages = items.some(item => item.type === 'image');
  const hasHeaders = items.some(item => item.type === 'header');
  const textItems = items.filter(item => ['header', 'subheader', 'body'].includes(item.type));
  
  // Images get more prominent space (2/3 ratios)
  if (hasImages) {
    const imageProminent = [
      0.67,                 // 2:1 - Image gets 2/3
      0.7,                  // 7:3 - Even more prominent
      0.65,                 // 13:7 - Strong presence
      0.75,                 // 3:1 - Very dominant
      GOLDEN,               // 0.618 - Golden ratio
      0.6                   // 3:2 - Moderate dominance
    ];
    return imageProminent[Math.floor(Math.random() * imageProminent.length)];
  }
  
  // Content-agnostic ratios for text-only layouts
  const allRatios = [
    0.5,                    // Equal split
    GOLDEN,                 // 0.618 - Golden ratio
    1 - GOLDEN,             // 0.382 - Inverse golden
    0.67,                   // 2:1 ratio
    0.33,                   // 1:2 ratio  
    PERFECT_FIFTH,          // 0.6 - Musical harmony
    1 - PERFECT_FIFTH,      // 0.4 - Inverse
    SILVER + 0.2,           // 0.614 - Silver variation
    FIBONACCI_MINOR + 0.12  // 0.502 - Near equal
  ];
  
  return allRatios[Math.floor(Math.random() * allRatios.length)];
}

export function subdivide(items, dir) {
  if (items.length === 1) return { kind: "leaf", item: items[0] };
  
  // For 2 items, create more layout variations
  if (items.length === 2) {
    const hero = items.some(it => it.hero);
    const hasImage = items.some(it => it.type === 'image');
    
    let ratios, flip;
    
    if (hasImage) {
      // Images get larger space - biased ratios
      ratios = [0.65, 0.7, 0.67, 0.75, 0.6]; // Image gets 60-75%
      // Find which item is the image and give it the larger space
      const imageIndex = items.findIndex(it => it.type === 'image');
      flip = imageIndex === 1; // If image is second, flip to give it larger space
    } else if (hero) {
      ratios = [0.65, 0.7, 0.6, 0.75]; // Hero variations
      flip = Math.random() < 0.5; // Random for hero
    } else {
      ratios = [0.5, 0.618, 0.382, 0.55, 0.45, 0.6, 0.4]; // Non-hero variations
      flip = Math.random() < 0.5; // Random for regular content
    }
    
    const ratio = ratios[Math.floor(Math.random() * ratios.length)];
    
    return {
      kind: "split",
      direction: dir,
      ratio,
      a: { kind: "leaf", item: items[flip ? 1 : 0] },
      b: { kind: "leaf", item: items[flip ? 0 : 1] }
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
    el.className = "leaf";
    
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
  
  // Simple random ratio assignment
  const flip = Math.random() < 0.5;
  const ratioA = flip ? node.ratio : 1 - node.ratio;
  const ratioB = flip ? 1 - node.ratio : node.ratio;
  
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