import { getDeepSeekPrompt } from './utils/prompts.js';

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
  
  const { prompt } = req.body;
  
  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }
  
  try {
    const systemPrompt = getDeepSeekPrompt(prompt);
    
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [{
          role: 'user',
          content: systemPrompt
        }],
        temperature: 0.7,
        max_tokens: 300
      })
    });
    
    if (!response.ok) {
      throw new Error(`DeepSeek API error: ${response.status}`);
    }
    
    const data = await response.json();
    res.status(200).json({ content: data.choices[0].message.content });
    
  } catch (error) {
    console.error('Text generation error:', error);
    res.status(500).json({ error: 'Failed to generate text' });
  }
}