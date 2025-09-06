import { getRecraftConfig } from './utils/prompts.js';

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  const { prompt, styleId } = req.body;
  
  if (!prompt) {
    return res.status(400).json({ error: 'Image prompt is required' });
  }
  
  // Use default style if none provided or invalid
  const defaultStyleId = 'b7f1e039-5fb5-47fa-b46e-d886bc87e36c';
  const finalStyleId = styleId || defaultStyleId;
  
  try {
    if (!process.env.RECRAFT_API_KEY) {
      throw new Error('RECRAFT_API_KEY environment variable is not set');
    }
    
    const config = getRecraftConfig();
    
    const response = await fetch('https://external.api.recraft.ai/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.RECRAFT_API_KEY}`
      },
      body: JSON.stringify({
        prompt: prompt,
        style_id: finalStyleId,
        size: config.size,
        response_format: config.response_format
      })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Recraft API error details:', errorText);
      
      // Handle specific error cases with user-friendly messages
      if (errorText.includes('not_enough_credits')) {
        throw new Error('Image generation temporarily unavailable (insufficient credits). Please try again later.');
      }
      
      throw new Error(`Recraft API error: ${response.status} - ${errorText}`);
    }
    
    const data = await response.json();
    res.status(200).json({ imageUrl: data.data[0].url });
    
  } catch (error) {
    console.error('Image generation error:', error);
    res.status(500).json({ error: `Failed to generate image: ${error.message}` });
  }
}