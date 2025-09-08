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
    size: 'large'
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
  const preserveAspect = document.getElementById("preserveAspect").checked;
  
  blocks.push({
    id, 
    type: 'image', 
    src: imageSrc, 
    size: 'large',
    preserveAspect: preserveAspect
  });
  
  updateBlockList();
  render();
  
  // Check if "Use image colors" is enabled
  const useImageColors = document.getElementById("useImageColors").checked;
  
  if (useImageColors) {
    // Simple color extraction for uploaded images
    console.log('Image color extraction would happen here');
  }
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
      // Image block - simple layout
      const row = document.createElement('div');
      row.className = 'element-row';
      
      const contentField = document.createElement('input');
      contentField.className = 'element-content';
      contentField.type = 'text';
      contentField.value = 'Image';
      contentField.readOnly = true;
      
      const typeSelector = document.createElement('select');
      typeSelector.className = 'element-type';
      typeSelector.innerHTML = '<option value="image" selected>Image</option>';
      typeSelector.disabled = true;
      
      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'element-delete';
      deleteBtn.textContent = '×';
      deleteBtn.onclick = () => window.deleteBlock(block.id);
      
      row.appendChild(contentField);
      row.appendChild(typeSelector);
      row.appendChild(deleteBtn);
      item.appendChild(row);
      
    } else {
      // Text block - simple layout with editable content
      const row = document.createElement('div');
      row.className = 'element-row';
      
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
      
      const typeSelector = document.createElement('select');
      typeSelector.className = 'element-type';
      typeSelector.innerHTML = `
        <option value="header" ${block.type === 'header' ? 'selected' : ''}>Header</option>
        <option value="body" ${block.type === 'body' ? 'selected' : ''}>Body</option>
      `;
      
      typeSelector.onchange = () => {
        window.changeBlockType(block.id, typeSelector.value);
      };
      
      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'element-delete';
      deleteBtn.textContent = '×';
      deleteBtn.onclick = () => window.deleteBlock(block.id);
      
      row.appendChild(contentInput);
      row.appendChild(typeSelector);
      row.appendChild(deleteBtn);
      item.appendChild(row);
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