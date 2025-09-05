# AI Prompts Configuration

This folder contains the configurable prompts and settings for the AI generation features.

## Files

### `deepseek-system.txt`
The system prompt sent to DeepSeek API for text generation.

- **Purpose**: Instructs the AI how to generate header, body text, and image prompts
- **Variables**: `{USER_PROMPT}` gets replaced with the user's input
- **Edit this to**: Change text generation behavior, add more content types, modify formatting

### `recraft-config.json`
Configuration for Recraft image generation API.

- **style**: Image generation style (`realistic`, `digital_illustration`, `vector_illustration`, `icon`)
- **size**: Image dimensions (`1024x1024`, `1024x1792`, `1792x1024`)
- **response_format**: Always `url`

## How to Edit

1. **Edit the files** in this folder directly
2. **Deploy changes**: Run `npx vercel --prod` 
3. **Changes take effect** immediately after deployment

## Examples

### Make headers longer:
In `deepseek-system.txt`, change:
```
1. A catchy header (max 4 words)
```
to:
```
1. A compelling header (5-8 words)
```

### Change image style:
In `recraft-config.json`, change:
```json
"style": "realistic"
```
to:
```json
"style": "digital_illustration"  
```

### Add more content types:
In `deepseek-system.txt`, add:
```
4. A subheader (2-3 words)
5. A call-to-action button text
```

And update the format section:
```
HEADER: [header text]
SUBHEADER: [subheader text]
BODY: [body text]
CTA: [button text]
IMAGE: [detailed image prompt for AI generation]
```