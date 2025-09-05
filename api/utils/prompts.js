import fs from 'fs';
import path from 'path';

export function getDeepSeekPrompt(userPrompt) {
  try {
    const promptPath = path.join(process.cwd(), 'prompts', 'deepseek-system.txt');
    const template = fs.readFileSync(promptPath, 'utf8');
    return template.replace('{USER_PROMPT}', userPrompt);
  } catch (error) {
    console.error('Error reading DeepSeek prompt template:', error);
    // Fallback to hardcoded prompt
    return `Based on this prompt: "${userPrompt}"

Generate content for a design layout with:
1. A catchy header (max 4 words)
2. Body text (1-2 sentences)
3. An image prompt for Recraft AI (describe the visual style, mood, and subject)

Format your response exactly like this:
HEADER: [header text]
BODY: [body text]  
IMAGE: [detailed image prompt for AI generation]`;
  }
}

export function getRecraftConfig() {
  try {
    const configPath = path.join(process.cwd(), 'prompts', 'recraft-config.json');
    const config = fs.readFileSync(configPath, 'utf8');
    return JSON.parse(config);
  } catch (error) {
    console.error('Error reading Recraft config:', error);
    // Fallback to default config
    return {
      style: 'realistic',
      size: '1024x1024',
      response_format: 'url'
    };
  }
}