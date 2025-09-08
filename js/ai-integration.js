// AI Integration - Text generation with DeepSeek and image generation with Recraft

import { extractColorsFromGeneratedImage } from './color-system-simple.js';

// Store last prompt for retry functionality
let lastGenerationPrompt = '';

// Loading state management functions
function showLoadingState(message, progress = 0) {
  const statusDiv = document.getElementById('aiStatus');
  const statusText = document.getElementById('statusText');
  const progressBar = document.getElementById('progressBar');
  const errorDiv = document.getElementById('aiError');
  
  statusDiv.style.display = 'block';
  errorDiv.style.display = 'none';
  statusText.textContent = message;
  progressBar.style.width = `${progress}%`;
}

function hideLoadingState() {
  const statusDiv = document.getElementById('aiStatus');
  statusDiv.style.display = 'none';
}

function showError(message, canRetry = true) {
  const errorDiv = document.getElementById('aiError');
  const errorText = document.getElementById('errorText');
  const retryBtn = document.getElementById('retryBtn');
  const statusDiv = document.getElementById('aiStatus');
  
  statusDiv.style.display = 'none';
  errorDiv.style.display = 'block';
  errorText.textContent = message;
  retryBtn.style.display = canRetry ? 'inline-block' : 'none';
}

function hideError() {
  const errorDiv = document.getElementById('aiError');
  errorDiv.style.display = 'none';
}

export function retryGeneration() {
  if (lastGenerationPrompt) {
    document.getElementById('aiPrompt').value = lastGenerationPrompt;
    generateWithAI();
  }
}

export async function generateWithAI(blocks, updateBlockList, render) {
  const prompt = document.getElementById('aiPrompt').value.trim();
  if (!prompt) {
    showError('Please enter a description for what you want to create.', false);
    return;
  }
  
  // Store prompt for retry functionality
  lastGenerationPrompt = prompt;
  
  const generateBtn = document.getElementById('generateBtn');
  generateBtn.disabled = true;
  hideError();
  
  try {
    showLoadingState('Preparing generation...', 10);
    
    // Clear existing blocks
    blocks.length = 0;
    updateBlockList();
    
    showLoadingState('Generating text content with AI...', 25);
    
    // Step 1: Generate text content and image prompt with DeepSeek
    let textResponse;
    try {
      textResponse = await generateTextWithDeepSeek(prompt);
      console.log('DeepSeek response:', textResponse);
    } catch (error) {
      console.error('DeepSeek error:', error);
      throw new Error('Failed to generate text content. The AI text service may be unavailable.');
    }
    
    showLoadingState('Processing generated content...', 40);
    
    // Parse the response to extract header, body, and image prompt
    const content = parseAIResponse(textResponse);
    
    console.log('Parsed AI content:', content);
    
    // Remove any existing debug box
    const existingDebug = document.getElementById('debug-content');
    if (existingDebug) existingDebug.remove();
    
    if (!content.header && !content.body && !content.subheader) {
      throw new Error('Generated content appears to be empty or invalid. Please try a different prompt.');
    }
    
    showLoadingState('Creating layout elements...', 55);
    
    // Step 2: Add text blocks to layout dynamically
    let blockId = Date.now();
    
    if (content.header) {
      console.log('Adding header block:', content.header);
      blocks.push({
        id: `ai-header-${blockId++}`,
        type: 'header',
        content: content.header
      });
    }
    
    if (content.subheader) {
      blocks.push({
        id: blockId++,
        type: 'subheader',
        content: content.subheader
      });
    }
    
    if (content.body) {
      blocks.push({
        id: blockId++,
        type: 'body', 
        content: content.body
      });
    }
    
    if (content.caption) {
      blocks.push({
        id: blockId++,
        type: 'body',  // Use body type for captions
        content: content.caption
      });
    }
    
    if (content.logo) {
      blocks.push({
        id: blockId++,
        type: 'logo',
        content: content.logo
      });
    }
    
    showLoadingState('Generating professional advertisement image...', 70);
    
    // Step 3: Generate image with Recraft - create visual-only prompt
    const adImagePrompt = `Abstract geometric composition, minimalist design elements, clean shapes and forms related to: ${prompt}. No text, no words, no letters. Pure visual illustration with geometric patterns, gradients, and modern design elements.`;
    
    let imageUrl;
    try {
      imageUrl = await generateImageWithRecraft(adImagePrompt);
    } catch (error) {
      console.error('Image generation error:', error);
      // Don't fail the entire generation if image fails
      console.warn('Continuing without image due to generation error');
    }
    
    showLoadingState('Finalizing layout...', 85);
    
    if (imageUrl) {
      // Add image block
      blocks.push({
        id: Date.now() + 3,
        type: 'image',
        src: imageUrl,
        preserveAspect: false
      });
      
      showLoadingState('Extracting colors from image...', 90);
      
      // Extract colors from the generated image BEFORE rendering
      try {
        await extractColorsFromGeneratedImage(imageUrl);
      } catch (error) {
        console.error('Color extraction failed:', error);
        // Continue without colors if extraction fails
      }
    }
    
    // Update UI and render
    updateBlockList();
    render();
    
    showLoadingState('Complete!', 100);
    setTimeout(() => {
      hideLoadingState();
    }, 1500);
    
  } catch (error) {
    console.error('AI generation error:', error);
    
    // Provide user-friendly error messages based on error type
    let errorMessage = 'An unexpected error occurred. Please try again.';
    
    if (error.message.includes('Failed to generate text content')) {
      errorMessage = 'The AI text service is currently unavailable. Please try again in a moment.';
    } else if (error.message.includes('empty or invalid')) {
      errorMessage = 'The AI couldn\'t generate content for that prompt. Try a more specific description.';
    } else if (error.message.includes('fetch')) {
      errorMessage = 'Network connection error. Please check your internet and try again.';
    } else if (error.message.includes('API error')) {
      errorMessage = 'AI service error. The service may be temporarily unavailable.';
    }
    
    showError(errorMessage, true);
  } finally {
    generateBtn.disabled = false;
    // Don't clear the prompt so user can retry or modify it
  }
}

async function generateTextWithDeepSeek(prompt) {
  try {
    const response = await fetch('/api/generate-text', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ prompt })
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`DeepSeek API error (${response.status}): ${errorData.error || 'Unknown error'}`);
    }
    
    const data = await response.json();
    
    if (!data.content || data.content.trim().length === 0) {
      throw new Error('DeepSeek returned empty content');
    }
    
    return data.content;
  } catch (error) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Network error: Could not connect to text generation service');
    }
    throw error;
  }
}

async function generateImageWithRecraft(imagePrompt) {
  try {
    // Get selected style ID from UI
    const styleSelect = document.getElementById('styleSelect');
    const customStyleInput = document.getElementById('customStyleId');
    
    let styleId = styleSelect.value;
    if (styleId === 'custom' && customStyleInput.value.trim()) {
      styleId = customStyleInput.value.trim();
    }
    
    const response = await fetch('/api/generate-image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        prompt: imagePrompt,
        styleId: styleId 
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Recraft API error (${response.status}): ${errorData.error || 'Image generation failed'}`);
    }
    
    const data = await response.json();
    
    if (!data.imageUrl) {
      throw new Error('Recraft returned no image URL');
    }
    
    return data.imageUrl;
  } catch (error) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Network error: Could not connect to image generation service');
    }
    console.error('Image generation error:', error);
    throw error;
  }
}

function parseAIResponse(response) {
  const content = {
    header: '',
    subheader: '',
    body: '',
    caption: '',
    logo: '',
    imagePrompt: ''
  };
  
  const lines = response.split('\n');
  
  lines.forEach(line => {
    const trimmedLine = line.trim();
    if (!trimmedLine) return;
    
    if (trimmedLine.startsWith('HEADER:')) {
      content.header = trimmedLine.replace('HEADER:', '').trim();
    } else if (trimmedLine.startsWith('SUBHEADER:')) {
      content.subheader = trimmedLine.replace('SUBHEADER:', '').trim();
    } else if (trimmedLine.startsWith('BODY:')) {
      content.body = trimmedLine.replace('BODY:', '').trim();
    } else if (trimmedLine.startsWith('CAPTION:')) {
      content.caption = trimmedLine.replace('CAPTION:', '').trim();
    } else if (trimmedLine.startsWith('LOGO:')) {
      content.logo = trimmedLine.replace('LOGO:', '').trim();
    } else if (trimmedLine.startsWith('IMAGE:')) {
      content.imagePrompt = trimmedLine.replace('IMAGE:', '').trim();
    }
  });
  
  return content;
}