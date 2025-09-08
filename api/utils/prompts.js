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

4. Write each field with appropriate length for visual hierarchy:  
   - HEADER: 2-6 compelling words, catchy and MANDATORY - this will be displayed LARGEST  
   - SUBHEADER: 6-12 words supporting statement - this will be displayed LARGE  
   - BODY: 2-4 full sentences with detailed information - this will be displayed MEDIUM  
   - CAPTION: 1-2 full sentences for supporting details, call-to-action, or specifics (phone, website, date, time) - this will be displayed SMALL  
   - LOGO: if the user specifies a company/brand name, put it here - this will be displayed LARGE  
   - IMAGE: always generate a clean descriptive image prompt that reflects the request

Important: Create substantial content differences between text types to utilize the full typography hierarchy. BODY should contain significantly more text than HEADER/SUBHEADER to create visual contrast.  

5. Do not add explanations. Output only the structured content.  

User request:  
"${userPrompt}"`;
  
  return template;
}

export function getRecraftConfig() {
  // Inline config for Vercel serverless compatibility
  return {
    size: '1024x1024',
    response_format: 'url'
  };
}