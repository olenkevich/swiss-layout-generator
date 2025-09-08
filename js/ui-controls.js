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
    listEl.innerHTML = '<div class="empty-state">No elements yet</div>';
    return;
  }
  
  blocks.forEach(block => {
    const item = document.createElement('div');
    item.className = 'block-item';
    item.dataset.blockId = block.id;
    
    if (block.type === 'image') {
      // Image block - stacked layout: main row (type + content), actions row (remove)
      const mainRow = document.createElement('div');
      mainRow.className = 'block-main-row';
      
      const typeLabel = document.createElement('div');
      typeLabel.className = 'block-type';
      typeLabel.textContent = 'IMG';
      
      const contentField = document.createElement('div');
      contentField.className = 'block-content';
      contentField.textContent = 'Image element';
      
      mainRow.appendChild(typeLabel);
      mainRow.appendChild(contentField);
      
      const actionsRow = document.createElement('div');
      actionsRow.className = 'block-actions-row';
      
      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'block-remove';
      deleteBtn.textContent = '×';
      deleteBtn.onclick = () => window.deleteBlock(block.id);
      
      actionsRow.appendChild(deleteBtn);
      
      item.appendChild(mainRow);
      item.appendChild(actionsRow);
      
    } else {
      // Text block - stacked layout: main row (type selector + content field), actions row (remove)
      const mainRow = document.createElement('div');
      mainRow.className = 'block-main-row';
      
      const typeSelector = document.createElement('select');
      typeSelector.className = 'block-type-selector';
      typeSelector.value = block.type;
      
      // Add type options
      const typeOptions = [
        { value: 'header', text: 'Header' },
        { value: 'subheader', text: 'Subhead' },
        { value: 'body', text: 'Body' },
        { value: 'logo', text: 'Logo' },
        { value: 'lead', text: 'Lead' },
        { value: 'small', text: 'Small' },
        { value: 'caption', text: 'Caption' }
      ];
      
      typeOptions.forEach(opt => {
        const option = document.createElement('option');
        option.value = opt.value;
        option.textContent = opt.text;
        option.selected = opt.value === block.type;
        typeSelector.appendChild(option);
      });
      
      // Handle type change
      typeSelector.onchange = () => {
        window.changeBlockType(block.id, typeSelector.value);
      };
      
      // Editable content field
      const contentInput = document.createElement('input');
      contentInput.className = 'block-content-field';
      contentInput.type = 'text';
      contentInput.value = block.content;
      contentInput.placeholder = 'Enter content...';
      
      // Debounced content update
      let updateTimeout;
      contentInput.oninput = (e) => {
        clearTimeout(updateTimeout);
        updateTimeout = setTimeout(() => {
          updateBlockContent(block.id, e.target.value);
        }, 300); // 300ms debounce
      };
      
      mainRow.appendChild(typeSelector);
      mainRow.appendChild(contentInput);
      
      const actionsRow = document.createElement('div');
      actionsRow.className = 'block-actions-row';
      
      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'block-remove';
      deleteBtn.textContent = '×';
      deleteBtn.onclick = () => window.deleteBlock(block.id);
      
      actionsRow.appendChild(deleteBtn);
      
      item.appendChild(mainRow);
      item.appendChild(actionsRow);
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

// Progressive disclosure functionality
export function toggleSection(sectionId) {
  const section = document.querySelector(`[data-section="${sectionId}"]`) || 
                 document.getElementById(sectionId).closest('.collapsible');
  
  if (!section) return;
  
  const content = section.querySelector('.section-content');
  const icon = section.querySelector('.toggle-icon');
  
  if (!content) return;
  
  const isCollapsed = section.classList.contains('collapsed');
  
  if (isCollapsed) {
    // Expand
    section.classList.remove('collapsed');
    content.style.maxHeight = content.scrollHeight + 'px';
    if (icon) icon.textContent = '−';
    
    // Remove max-height after animation completes
    setTimeout(() => {
      if (!section.classList.contains('collapsed')) {
        content.style.maxHeight = 'none';
      }
    }, 300);
  } else {
    // Collapse
    content.style.maxHeight = content.scrollHeight + 'px';
    // Force reflow
    content.offsetHeight;
    content.style.maxHeight = '0px';
    section.classList.add('collapsed');
    if (icon) icon.textContent = '+';
  }
}

// Initialize collapsible sections
export function initializeCollapsibleSections() {
  // Make toggleSection available globally
  window.toggleSection = toggleSection;
  
  // Set up initial state - keep AI section expanded, others collapsed
  const collapsibleSections = document.querySelectorAll('.collapsible');
  
  collapsibleSections.forEach((section, index) => {
    const content = section.querySelector('.section-content');
    const icon = section.querySelector('.toggle-icon');
    
    if (!content) return;
    
    // Collapse sections except the first one (or based on your preference)
    if (index > 0) { // Keep first section (Add Elements) expanded for better UX
      section.classList.add('collapsed');
      content.style.maxHeight = '0px';
      if (icon) icon.textContent = '+';
    } else {
      content.style.maxHeight = 'none';
      if (icon) icon.textContent = '−';
    }
  });
}

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