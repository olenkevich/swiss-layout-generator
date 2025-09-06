export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  const envVars = {
    deepseekKeyExists: !!process.env.DEEPSEEK_API_KEY,
    deepseekKeyLength: process.env.DEEPSEEK_API_KEY ? process.env.DEEPSEEK_API_KEY.length : 0,
    deepseekKeyStart: process.env.DEEPSEEK_API_KEY ? process.env.DEEPSEEK_API_KEY.substring(0, 10) : 'undefined',
    deepseekKeyEnd: process.env.DEEPSEEK_API_KEY ? process.env.DEEPSEEK_API_KEY.substring(-10) : 'undefined',
    recraftKeyExists: !!process.env.RECRAFT_API_KEY,
    recraftKeyLength: process.env.RECRAFT_API_KEY ? process.env.RECRAFT_API_KEY.length : 0,
    allEnvKeys: Object.keys(process.env).filter(k => k.includes('API') || k.includes('DEEPSEEK') || k.includes('RECRAFT')),
    nodeVersion: process.version,
    platform: process.platform
  };
  
  res.status(200).json(envVars);
}