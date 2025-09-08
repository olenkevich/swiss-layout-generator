# Swiss Lay Design Generator - Developer Instructions

## Overview
This is a modular design layout generator built with Swiss design principles, AI-powered content generation, and intelligent color extraction. The codebase has been refactored from a monolithic 2164-line HTML file into a clean, maintainable architecture.

## Architecture

### File Structure
```
/
├── index.html              # Minimal HTML structure
├── css/                    # Modular stylesheets
│   ├── base.css           # Typography system, variables, resets
│   ├── layout.css         # Swiss grid system, canvas layout
│   └── components.css     # UI components, sidebar, controls
├── js/                     # Modular JavaScript
│   ├── main.js            # App initialization & coordination
│   ├── layout-engine.js   # Swiss grid layout algorithm
│   ├── typography.js      # Text fitting & scaling system
│   ├── color-system.js    # Color extraction & palettes
│   ├── ai-integration.js  # DeepSeek & Recraft AI APIs
│   ├── ui-controls.js     # Sidebar interactions
│   └── utils.js           # Shared utilities & constants
└── api/                    # Vercel serverless functions
    ├── generate-text.js    # DeepSeek text generation
    ├── generate-image.js   # Recraft image generation
    └── utils/prompts.js    # AI prompt templates
```

## Core Systems

### 1. Layout Engine (`js/layout-engine.js`)
- **Purpose**: Creates randomized layouts using Swiss design ratios
- **Key Features**:
  - Golden ratio (φ = 1.618) and Fibonacci proportions
  - Smart content-aware direction selection
  - Recursive subdivision algorithm
  - Image/text intelligent placement

**Key Functions**:
- `getSmartDirection(blocks)` - Determines row/column based on content
- `subdivide(items, dir)` - Recursive layout tree generation
- `renderNode(node)` - DOM tree rendering

### 2. Typography System (`js/typography.js`)
- **Purpose**: Swiss precision text fitting with baseline grid
- **Key Features**:
  - 8px baseline grid alignment
  - Hierarchy preservation (headers stay readable)
  - Contextual letter-spacing adjustments
  - Container-aware scaling

**Key Functions**:
- `fitText(container, el, item)` - Smart text scaling algorithm
- `setFormat(fmt)` - Canvas size management

### 3. Color System (`js/color-system.js`)
- **Purpose**: Intelligent color extraction and palette generation
- **Key Features**:
  - Image-based color clustering
  - WCAG contrast ratio validation (4.5:1 minimum)
  - Multiple palette generation per image
  - HSL color space manipulation

**Key Functions**:
- `extractBeautifulPalette(imageSrc)` - Main color extraction
- `createBeautifulCombinations(palette)` - Contrast-safe palettes
- `shuffleColors()` - Cycle through generated palettes

### 4. AI Integration (`js/ai-integration.js`)
- **Purpose**: Content generation via DeepSeek (text) and Recraft (images)
- **Key Features**:
  - Structured prompt templates
  - Error handling and retry logic
  - Loading state management
  - Content parsing and validation

**Key Functions**:
- `generateWithAI()` - Main AI generation workflow
- `generateTextWithDeepSeek(prompt)` - Text content creation
- `generateImageWithRecraft(prompt)` - Image generation

### 5. UI Controls (`js/ui-controls.js`)
- **Purpose**: Sidebar interactions and block management
- **Key Functions**:
  - `addTextBlock()` - Manual text block creation
  - `addImageBlock()` - Image upload and processing
  - `updateBlockList()` - Block list UI updates

## Development Guidelines

### 1. **Keep It Simple**
- Each module has one clear responsibility
- Avoid complex dependencies between modules
- Use pure functions where possible

### 2. **Working on Separate Features**
- **UI/Design**: Focus on `css/` files and `js/ui-controls.js`
- **Layout Engine**: Work in `js/layout-engine.js`
- **Typography**: Modify `js/typography.js`
- **Colors**: Enhance `js/color-system.js`
- **AI Features**: Update `js/ai-integration.js`

### 3. **Adding New Features**
1. Identify which module it belongs to
2. Add the feature to the appropriate module
3. Export any new functions needed by other modules
4. Update `main.js` if global access is needed
5. Test the feature in isolation

### 4. **Common Patterns**

#### Adding a New Block Type
1. Update the block type options in `ui-controls.js`
2. Add rendering logic in `layout-engine.js`
3. Add typography rules in `typography.js` if needed
4. Add CSS styles to appropriate CSS files

#### Modifying Layout Logic
1. Work primarily in `layout-engine.js`
2. Test with different block combinations
3. Ensure ratios remain mathematically sound

#### Color System Changes
1. Modify `color-system.js`
2. Test with various image types
3. Validate contrast ratios for accessibility

### 5. **Testing**
- Test each module individually when possible
- Use browser dev tools to check for errors
- Test with different content combinations
- Verify mobile responsiveness

### 6. **Performance Considerations**
- Keep DOM updates minimal in render loops
- Use `requestAnimationFrame` for layout changes
- Batch style updates where possible
- Optimize image processing for large files

## Environment Setup

### Required Environment Variables (for AI features)
```bash
DEEPSEEK_API_KEY=your_deepseek_api_key
RECRAFT_API_KEY=your_recraft_api_key
```

### Development Server
```bash
npm run dev    # or npx serve .
```

### Deployment
```bash
npm run deploy # or vercel --prod
```

## Troubleshooting

### Common Issues

1. **Module Import Errors**
   - Ensure all imports use `.js` extensions
   - Check that functions are properly exported
   - Verify file paths are correct

2. **Layout Not Rendering**
   - Check browser console for JavaScript errors
   - Ensure all modules loaded successfully
   - Verify DOM elements exist before manipulation

3. **AI Generation Failures**
   - Verify API keys are set correctly
   - Check network connectivity
   - Review API response format changes

4. **Color Extraction Issues**
   - Ensure images load with proper CORS headers
   - Check image format compatibility
   - Verify canvas 2D context availability

### Debugging Tips
- Use browser dev tools Network tab to monitor API calls
- Check Console for JavaScript errors
- Use debugger statements in modules for step-through debugging
- Test individual functions in browser console

## Best Practices

### Code Style
- Use ES6 modules and modern JavaScript
- Prefer const/let over var
- Use meaningful variable and function names
- Keep functions small and focused

### CSS Organization
- Use CSS custom properties for theming
- Follow mobile-first responsive design
- Maintain consistent spacing using baseline grid
- Use semantic class names

### Performance
- Minimize DOM queries (cache elements when possible)
- Use efficient algorithms for layout calculations
- Optimize color extraction for large images
- Debounce user interactions where appropriate

This modular architecture ensures that team members can work on different features simultaneously without conflicts, making the codebase much more maintainable and extensible.