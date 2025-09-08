// UI Controls - Sidebar interactions and block management

import { generateId } from './utils.js';
import { applyColors } from './color-system-simple.js';

export function addTextBlock(blocks, updateBlockList, render) {
  const content = document.getElementById("textContent").value;
  const type = document.getElementById("textType").value;
  
  if (!content.trim()) {
    alert('Please enter some text content');
    return;
  }
  
  const id = generateId();
  const block = {
    id, 
    type, 
    content: content.trim(), 
    size: 'large',
    sizeWeight: 2 // Default to Medium size
  };
  
  if (type === 'header') block.hero = true;
  
  blocks.push(block);
  document.getElementById("textContent").value = '';
  updateBlockList();
  render();
}

export function addImageBlock(blocks, updateBlockList, render) {
  const file = document.getElementById("imageFile").files[0];
  
  if (!file) {
    return; // No file selected, do nothing
  }
  
  const id = generateId();
  const imageSrc = URL.createObjectURL(file);
  const preserveAspect = true; // Default to preserve aspect, user can change via dropdown
  
  // Create image element to get dimensions
  const img = new Image();
  img.onload = function() {
    const aspectRatio = this.width / this.height;
    const isLandscape = aspectRatio > 1;
    const isPortrait = aspectRatio < 1;
    const isSquare = Math.abs(aspectRatio - 1) < 0.1;
    
    blocks.push({
      id, 
      type: 'image', 
      src: imageSrc, 
      size: 'large',
      sizeWeight: 2, // Default to Medium size
      preserveAspect: preserveAspect,
      aspectRatio: aspectRatio,
      isLandscape: isLandscape,
      isPortrait: isPortrait,
      isSquare: isSquare,
      width: this.width,
      height: this.height
    });
    
    updateBlockList();
    render();
  };
  
  img.src = imageSrc;
}

export function deleteBlock(blockId, blocks, updateBlockList, render) {
  const index = blocks.findIndex(b => b.id === blockId);
  if (index !== -1) {
    blocks.splice(index, 1);
    updateBlockList();
    render();
  }
}

export function changeBlockType(blockId, newType, blocks, updateBlockList, render) {
  const block = blocks.find(b => b.id === blockId);
  if (block) {
    block.type = newType;
    updateBlockList();
    render();
  }
}

export function changeImageAspect(blockId, preserveAspect, blocks, updateBlockList, render) {
  const block = blocks.find(b => b.id === blockId);
  if (block && block.type === 'image') {
    block.preserveAspect = preserveAspect;
    updateBlockList();
    render();
  }
}

export function changeElementSize(blockId, sizeWeight, blocks, updateBlockList, render) {
  const block = blocks.find(b => b.id === blockId);
  if (block) {
    block.sizeWeight = sizeWeight;
    updateBlockList();
    render();
  }
}

export function updateBlockList(blocks) {
  const listEl = document.getElementById('blockList');
  console.log('Updating block list, blocks:', blocks.length, blocks);
  listEl.innerHTML = '';
  
  if (blocks.length === 0) {
    listEl.innerHTML = '<div class="empty-state">No elements</div>';
    return;
  }
  
  blocks.forEach(block => {
    const item = document.createElement('div');
    item.className = 'element-item';
    item.dataset.blockId = block.id;
    
    if (block.type === 'image') {
      // Image block - header with type and delete, then large field
      const header = document.createElement('div');
      header.className = 'element-header';
      
      const aspectSelector = document.createElement('select');
      aspectSelector.className = 'element-type';
      aspectSelector.innerHTML = `
        <option value="preserve" ${block.preserveAspect ? 'selected' : ''}>Preserve Aspect</option>
        <option value="crop" ${!block.preserveAspect ? 'selected' : ''}>Crop to Fit</option>
      `;
      
      aspectSelector.onchange = () => {
        window.changeImageAspect(block.id, aspectSelector.value === 'preserve');
      };
      
      const imageSizeSelector = document.createElement('select');
      imageSizeSelector.className = 'element-type';
      const imageCurrentWeight = block.sizeWeight || 2;
      imageSizeSelector.innerHTML = `
        <option value="1" ${imageCurrentWeight === 1 ? 'selected' : ''}>Small</option>
        <option value="2" ${imageCurrentWeight === 2 ? 'selected' : ''}>Medium</option>
        <option value="3" ${imageCurrentWeight === 3 ? 'selected' : ''}>Large</option>
        <option value="4" ${imageCurrentWeight === 4 ? 'selected' : ''}>Hero</option>
      `;
      
      imageSizeSelector.onchange = () => {
        window.changeElementSize(block.id, parseInt(imageSizeSelector.value));
      };
      
      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'element-delete';
      deleteBtn.textContent = '×';
      deleteBtn.onclick = () => window.deleteBlock(block.id);
      
      header.appendChild(aspectSelector);
      header.appendChild(imageSizeSelector);
      header.appendChild(deleteBtn);
      
      const contentField = document.createElement('input');
      contentField.className = 'element-content';
      contentField.type = 'text';
      const aspectText = block.preserveAspect ? 
        ` (${block.width}×${block.height}, aspect preserved)` : 
        ' (cropped to fit)';
      contentField.value = 'Image' + aspectText;
      contentField.readOnly = true;
      
      item.appendChild(header);
      item.appendChild(contentField);
      
    } else {
      // Text block - header with type and delete, then large editable field
      const header = document.createElement('div');
      header.className = 'element-header';
      
      const typeSelector = document.createElement('select');
      typeSelector.className = 'element-type';
      typeSelector.innerHTML = `
        <option value="header" ${block.type === 'header' ? 'selected' : ''}>Header</option>
        <option value="body" ${block.type === 'body' ? 'selected' : ''}>Body</option>
      `;
      
      typeSelector.onchange = () => {
        window.changeBlockType(block.id, typeSelector.value);
      };
      
      const sizeSelector = document.createElement('select');
      sizeSelector.className = 'element-type';
      const currentWeight = block.sizeWeight || 2;
      sizeSelector.innerHTML = `
        <option value="1" ${currentWeight === 1 ? 'selected' : ''}>Small</option>
        <option value="2" ${currentWeight === 2 ? 'selected' : ''}>Medium</option>
        <option value="3" ${currentWeight === 3 ? 'selected' : ''}>Large</option>
        <option value="4" ${currentWeight === 4 ? 'selected' : ''}>Hero</option>
      `;
      
      sizeSelector.onchange = () => {
        window.changeElementSize(block.id, parseInt(sizeSelector.value));
      };
      
      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'element-delete';
      deleteBtn.textContent = '×';
      deleteBtn.onclick = () => window.deleteBlock(block.id);
      
      header.appendChild(typeSelector);
      header.appendChild(sizeSelector);
      header.appendChild(deleteBtn);
      
      const contentInput = document.createElement('input');
      contentInput.className = 'element-content';
      contentInput.type = 'text';
      contentInput.value = block.content;
      contentInput.placeholder = 'Enter text...';
      
      // Debounced content update
      let updateTimeout;
      contentInput.oninput = (e) => {
        clearTimeout(updateTimeout);
        updateTimeout = setTimeout(() => {
          updateBlockContent(block.id, e.target.value);
        }, 300);
      };
      
      item.appendChild(header);
      item.appendChild(contentInput);
    }
    
    listEl.appendChild(item);
  });
}


// New function to update block content with instant rendering
function updateBlockContent(blockId, newContent) {
  // Find the block and update its content
  const blocks = window.currentBlocks || []; // Access to current blocks array
  const block = blocks.find(b => b.id === blockId);
  
  if (block) {
    block.content = newContent;
    
    // Trigger immediate re-render
    if (window.render) {
      window.render();
    }
    
    console.log('Updated block content:', blockId, newContent);
  }
}

export function handleStyleChange() {
  const styleSelect = document.getElementById('styleSelect');
  const customStyleInput = document.getElementById('customStyleId');
  
  if (styleSelect.value === 'custom') {
    customStyleInput.style.display = 'block';
  } else {
    customStyleInput.style.display = 'none';
  }
}

// Simplified sections - no collapsible functionality needed

// Legacy functions - simplified for basic functionality

// Minimal analog clock
export function updateClock() {
  const now = new Date();
  const hours = now.getHours() % 12;
  const minutes = now.getMinutes();
  
  const hourAngle = (hours * 30) + (minutes * 0.5); // 30 degrees per hour + minute offset
  const minuteAngle = minutes * 6; // 6 degrees per minute
  
  const hourHand = document.getElementById('hour-hand');
  const minuteHand = document.getElementById('minute-hand');
  
  if (hourHand) hourHand.style.transform = `translateX(-50%) rotate(${hourAngle}deg)`;
  if (minuteHand) minuteHand.style.transform = `translateX(-50%) rotate(${minuteAngle}deg)`;
}