// Inline prompts for Vercel serverless compatibility

export function getDeepSeekPrompt(userPrompt) {
  // Inline prompt template for Vercel serverless compatibility
  const template = `You are given a user request in plain natural language.  
Your task is to transform it into structured content for a layout.  
Always output in the following format:  

  HEADER: [main headline text]  
  SUBHEADER: [secondary headline - optional]  
  BODY: [main description text - optional]  
  CAPTION: [supporting text - optional]  
  LOGO: [brand/company name - optional]  
  IMAGE: [detailed image generation prompt]  

Rules:  
1. HEADER is MANDATORY - always provide a compelling main headline.

2. Detect if the request contains specific items such as phone numbers, emails, websites, dates, or times.  
   - Do NOT modify these values.  
   - Place them naturally into CAPTION (preferred) or another fitting field.  

3. Decide how many text blocks are appropriate:  
   - Minimal: HEADER + SUBHEADER  
   - Extended: HEADER + SUBHEADER + BODY + CAPTION (and optional LOGO, IMAGE)  
   - Flexible: Add or skip fields depending on the request.  

4. Write each field clearly and concisely:  
   - HEADER: 3–8 words, catchy and MANDATORY  
   - SUBHEADER: one clear supporting sentence  
   - BODY: 1–3 sentences or bullet points, optional  
   - CAPTION: short supporting note, call-to-action, or place to include unmodified specifics (like phone, website, date, time)  
   - LOGO: if the user specifies a company/brand name, put it here  
   - IMAGE: always generate a clean descriptive image prompt that reflects the request  

5. Do not add explanations. Output only the structured content.  

User request:  
"${userPrompt}"`;
  
  return template;
}

export function getRecraftConfig() {
  // Inline config for Vercel serverless compatibility
  return {
    style_id: 'b45d6a84-1ba7-42c5-bea8-7b7972f508f3',
    size: '1024x1024',
    response_format: 'url'
  };
}