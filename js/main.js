// Main application coordination and initialization

import { getSmartDirection, subdivide, renderNode } from './layout-engine.js';
import { recalcAllText, setFormat } from './typography.js';
import { applyColors, shuffleColors } from './color-system-simple.js';
import { generateWithAI, retryGeneration } from './ai-integration.js';
import { 
  addTextBlock, 
  addImageBlock, 
  deleteBlock, 
  changeBlockType, 
  changeImageAspect,
  changeElementSize,
  updateBlockList, 
  handleStyleChange,
  updateClock
} from './ui-controls.js';

// Application state
let blocks = [
  {id: 'demo-header', type: 'header', content: 'Design Made Simple', hero: true, size: 'large', sizeWeight: 2},
  {id: 'demo-body', type: 'body', content: 'Create stunning layouts with our intelligent design generator. Perfect for presentations, social media, and creative projects.', size: 'large', sizeWeight: 2},
  {id: 'demo-subheader', type: 'subheader', content: 'Professional Results in Seconds', size: 'large', sizeWeight: 2},
  {id: 'demo-logo', type: 'logo', content: 'STUDIO', size: 'large', sizeWeight: 2},
  {id: 'demo-image', type: 'image', src: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSJ1cmwoI3BhaW50MF9saW5lYXJfMF8xKSIvPgo8ZGVmcz4KPGXPYW5lYXJHcmFkaWVudCBpZD0icGFpbnQwX2xpbmVhcl8wXzEiIHgxPSIwIiB5MT0iMCIgeDI9IjQwMCIgeTI9IjMwMCIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPgo8c3RvcCBzdG9wLWNvbG9yPSIjNjY2NkZGIi8+CjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI0ZGNjZEQSIvPgo8L2xpbmVhckdyYWRpZW50Pgo8L2RlZnM+Cjwvc3ZnPgo=', size: 'large', sizeWeight: 2}
];

// DOM elements
const canvas = document.getElementById("canvas");
const scaler = document.getElementById("scaler");
const preview = document.getElementById("preview");

// Main render function
function render() {
  canvas.innerHTML = "";
  // Always show the canvas (even if no blocks) so preview is visible
  if (blocks.length === 0) {
    // empty canvas still scales and centers
    scaleToPreview();
    return;
  }
  
  // Layout direction - content agnostic for true randomization
  let dir;
  if (blocks.length === 2) {
    // Equal chance for both directions regardless of content
    dir = Math.random() < 0.5 ? 'row' : 'col';
  } else {
    // 3+ items use smart direction based on layout aesthetics
    dir = getSmartDirection(blocks);
  }
  
  // Random shuffle - headers can appear anywhere
  const shuffled = [...blocks];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  
  const tree = subdivide(shuffled, dir);
  canvas.appendChild(renderNode(tree));
  requestAnimationFrame(() => { 
    scaleToPreview(); 
    // Allow layout to settle before text fitting
    requestAnimationFrame(() => {
      recalcAllText(canvas, blocks);
      // Double-check after micro-delay for random ratio layouts
      setTimeout(() => recalcAllText(canvas, blocks), 10);
    });
  });
}

// Scaling (uses actual preview pane size)
function scaleToPreview() {
  const vw = preview.clientWidth;     // width of the right pane
  const vh = preview.clientHeight;    // height of the right pane
  const cw = canvas.offsetWidth;      // logical canvas size
  const ch = canvas.offsetHeight;
  if (!vw || !vh || !cw || !ch) return;

  // Reserve 40px padding on all sides for scaling calculation
  const availableW = vw - 80;  // 40px on each side
  const availableH = vh - 80;  // 40px on each side
  
  const s = Math.min(availableW / cw, availableH / ch, 1); // only scale down
  scaler.style.width = cw + "px";
  scaler.style.height = ch + "px";
  scaler.style.transform = `translate(-50%, -50%) scale(${s})`;
}

// Wrapper functions for global access
function _updateBlockList() {
  updateBlockList(blocks);
}

function _addTextBlock() {
  addTextBlock(blocks, _updateBlockList, render);
}

function _addImageBlock() {
  addImageBlock(blocks, _updateBlockList, render);
}

function _deleteBlock(blockId) {
  deleteBlock(blockId, blocks, _updateBlockList, render);
}

function _changeBlockType(blockId, newType) {
  changeBlockType(blockId, newType, blocks, _updateBlockList, render);
}

function _changeImageAspect(blockId, preserveAspect) {
  changeImageAspect(blockId, preserveAspect, blocks, _updateBlockList, render);
}

function _changeElementSize(blockId, sizeWeight) {
  changeElementSize(blockId, sizeWeight, blocks, _updateBlockList, render);
}

function _generateWithAI() {
  generateWithAI(blocks, _updateBlockList, render);
}

function _setFormat(fmt) {
  setFormat(fmt);
  scaleToPreview();
}

// Initialize application
function initialize() {
  // Set up global functions for HTML event handlers
  window.addTextBlock = _addTextBlock;
  window.addImageBlock = _addImageBlock;
  window.deleteBlock = _deleteBlock;
  window.changeBlockType = _changeBlockType;
  window.changeImageAspect = _changeImageAspect;
  window.changeElementSize = _changeElementSize;
  window.generateWithAI = _generateWithAI;
  window.render = render;
  window.shuffleColors = shuffleColors;
  window.applyColors = applyColors;
  window.handleStyleChange = handleStyleChange;
  window.retryGeneration = retryGeneration;
  
  // Make blocks array accessible globally for instant editing
  window.currentBlocks = blocks;
  
  // Set up event listeners
  const formatSelect = document.getElementById("format");
  if (formatSelect) {
    formatSelect.addEventListener("change", e => _setFormat(e.target.value));
  }
  
  // Window resize handler
  window.addEventListener("resize", scaleToPreview);
  
  // Initialize format and UI
  const currentFormat = formatSelect ? formatSelect.value : "16-9";
  _setFormat(currentFormat);
  _updateBlockList();
  render();
  
  // Start clock
  updateClock();
  setInterval(updateClock, 1000);
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initialize);
} else {
  initialize();
}