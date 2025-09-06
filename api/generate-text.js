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
    console.log('Starting text generation for prompt:', prompt);
    console.log('API Key present:', !!process.env.DEEPSEEK_API_KEY);
    console.log('API Key length:', process.env.DEEPSEEK_API_KEY ? process.env.DEEPSEEK_API_KEY.length : 0);
    console.log('API Key first 10 chars:', process.env.DEEPSEEK_API_KEY ? process.env.DEEPSEEK_API_KEY.substring(0, 10) : 'undefined');
    console.log('All env vars keys:', Object.keys(process.env).filter(k => k.includes('DEEPSEEK')));
    
    const systemPrompt = getDeepSeekPrompt(prompt);
    console.log('Generated system prompt length:', systemPrompt.length);
    
    const response = await fetch('https://api.deepseek.com/chat/completions', {
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
    
    console.log('DeepSeek API response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('DeepSeek API error response:', errorText);
      throw new Error(`DeepSeek API error: ${response.status} - ${errorText}`);
    }
    
    const data = await response.json();
    console.log('DeepSeek API success, response length:', data.choices[0].message.content.length);
    res.status(200).json({ content: data.choices[0].message.content });
    
  } catch (error) {
    console.error('Text generation error:', error.message);
    console.error('Error stack:', error.stack);
    res.status(500).json({ error: `Failed to generate text: ${error.message}` });
  }
}