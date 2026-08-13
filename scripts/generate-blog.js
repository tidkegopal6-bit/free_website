// scripts/generate-blog.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper to parse arguments
function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    topic: '',
    level: 'global',
    location: '',
    provider: 'deepseek',
    model: '',
    apiKey: process.env.OPENROUTER_API_KEY || process.env.GEMINI_API_KEY || ''
  };

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--topic' && args[i + 1]) {
      options.topic = args[i + 1];
      i++;
    } else if (args[i] === '--level' && args[i + 1]) {
      options.level = args[i + 1];
      i++;
    } else if (args[i] === '--location' && args[i + 1]) {
      options.location = args[i + 1];
      i++;
    } else if (args[i] === '--apiKey' && args[i + 1]) {
      options.apiKey = args[i + 1];
      i++;
    } else if (args[i] === '--provider' && args[i + 1]) {
      options.provider = args[i + 1];
      i++;
    } else if (args[i] === '--model' && args[i + 1]) {
      options.model = args[i + 1];
      i++;
    }
  }

  return options;
}

// Default free model on OpenRouter (no credits required)
const DEFAULT_MODEL = 'openai/gpt-oss-20b:free';

// Fallback free models tried in order when the default is rate-limited
const FALLBACK_MODELS = [
  'google/gemma-4-31b-it:free',
  'nvidia/nemotron-3-super-120b-a12b:free',
  'poolside/laguna-s-2.1:free',
  'cohere/north-mini-code:free'
];

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Call OpenRouter and parse the JSON response, retrying on invalid/truncated JSON
async function requestJson(apiKey, promptText, model) {
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const raw = await callOpenRouter(apiKey, promptText, model);
      return JSON.parse(raw);
    } catch (err) {
      const isParseError = err instanceof SyntaxError || /JSON|Unexpected|Expected/i.test(err.message);
      if (!isParseError || attempt === 2) throw err;
      console.warn(`Response was invalid/truncated JSON (attempt ${attempt + 1}/3). Retrying in ${(attempt + 1) * 15}s...`);
      await sleep((attempt + 1) * 15000);
    }
  }
  throw new Error('Could not obtain valid JSON from the API');
}

// Call Gemini API (OpenAI-compatible response mode)
async function callGemini(apiKey, promptText, jsonSchema = null) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
  
  const requestBody = {
    contents: [
      {
        parts: [
          {
            text: promptText
          }
        ]
      }
    ]
  };

  if (jsonSchema) {
    requestBody.generationConfig = {
      responseMimeType: 'application/json',
      responseSchema: jsonSchema
    };
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(requestBody)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini API returned error ${response.status}: ${errorText}`);
  }

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    throw new Error('Gemini API returned an empty response');
  }

  return text;
}

// Call OpenRouter — OpenAI-compatible API. Defaults to a free model (no credits needed);
// pass --model to use a paid one (e.g. deepseek/deepseek-v4-flash) if you have credits.
// Retries with exponential backoff and falls back to other free models on 429 (rate limit).
async function callOpenRouter(apiKey, promptText, model = DEFAULT_MODEL) {
  const url = 'https://openrouter.ai/api/v1/chat/completions';
  const modelChain = model.includes(':free') && model === DEFAULT_MODEL
    ? [DEFAULT_MODEL, ...FALLBACK_MODELS]
    : [model];
  let lastError = null;

  for (const currentModel of modelChain) {
    for (let attempt = 0; attempt < 3; attempt++) {
      const requestBody = {
        model: currentModel,
        max_tokens: 6000,
        messages: [
          { role: 'system', content: 'You are a professional multilingual tech blogger. Always respond with valid JSON only, matching the exact structure requested. No markdown fences, no commentary.' },
          { role: 'user', content: promptText }
        ],
        response_format: { type: 'json_object' }
      };

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
          'HTTP-Referer': 'https://github.com/tidkegopal6-bit/free_website',
          'X-Title': 'The RISIING Auto Blog Generator'
        },
        body: JSON.stringify(requestBody)
      });

      if (response.ok) {
        const data = await response.json();
        const text = data.choices?.[0]?.message?.content;
        if (text) {
          return text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();
        }
        lastError = new Error('OpenRouter API returned an empty response');
      } else {
        const errorText = await response.text();
        lastError = new Error(`OpenRouter API returned error ${response.status}: ${errorText}`);
        if (response.status === 429) {
          console.warn(`Rate limited on "${currentModel}" (attempt ${attempt + 1}/3). Retrying in ${(attempt + 1) * 10}s...`);
          await sleep((attempt + 1) * 10000);
          continue;
        }
        throw lastError;
      }
    }
    if (currentModel !== modelChain[modelChain.length - 1]) {
      console.warn(`Switching to fallback model...`);
      await sleep(5000);
    }
  }

  throw lastError || new Error('All models failed');
}

// Download image and save locally
async function downloadHeroImage(imagePrompt, slug) {
  const assetsDir = path.join(__dirname, '../public/assets/blog');
  if (!fs.existsSync(assetsDir)) {
    fs.mkdirSync(assetsDir, { recursive: true });
  }

  const imagePath = path.join(assetsDir, `${slug}.jpg`);
  const pollinationsUrl = `https://image.pollinations.ai/p/${encodeURIComponent(imagePrompt)}?width=800&height=450&nologo=true`;

  console.log(`Generating & downloading AI hero image from: ${pollinationsUrl}`);
  try {
    const res = await fetch(pollinationsUrl);
    if (!res.ok) throw new Error(`Status code ${res.status}`);
    const buffer = await res.arrayBuffer();
    fs.writeFileSync(imagePath, Buffer.from(buffer));
    console.log(`Hero image successfully saved to: public/assets/blog/${slug}.jpg`);
    return `/assets/blog/${slug}.jpg`;
  } catch (err) {
    console.warn(`Warning: Failed to download custom AI image: ${err.message}. Falling back to placeholder.`);
    // Fall back to a stable Unsplash image matching keywords
    return 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop';
  }
}

// Main execution block
async function main() {
  const options = parseArgs();

  if (!options.apiKey) {
    console.error('Error: OPENROUTER_API_KEY (or GEMINI_API_KEY) is not defined. Please set it as an env variable or pass it via --apiKey');
    process.exit(1);
  }

  const useDeepSeek = options.provider === 'deepseek';
  if (useDeepSeek && options.apiKey === process.env.GEMINI_API_KEY) {
    console.warn('Provider is deepseek but only GEMINI_API_KEY is set — OpenRouter calls will likely fail. Set OPENROUTER_API_KEY.');
  }
  const model = options.model || DEFAULT_MODEL;
  console.log(`Using ${useDeepSeek ? `OpenRouter model "${model}"` : 'Gemini 1.5 Flash'} for content generation.`);

  let finalTopic = options.topic;
  if (!finalTopic) {
    console.log(`No topic provided. Auto-generating a topic focusing on ${options.level} (${options.location || 'Anywhere'})...`);
    
    const topicPrompt = `You are a creative content strategist. Generate one high-interest, trending topic for a software developer/tech blog. 
    Focus level: ${options.level}.
    Location Focus: ${options.location || 'Global'}.
    Return ONLY the topic title/concept as plain text. Do not include quotes, intro, or explanation.`;

    try {
      if (useDeepSeek) {
        const jsonResult = await requestJson(options.apiKey, `${topicPrompt} Respond as a JSON object exactly like this: {"topic": "..."}`, model);
        finalTopic = jsonResult.topic?.trim();
      } else {
        finalTopic = (await callGemini(options.apiKey, topicPrompt)).trim();
      }
      if (!finalTopic) throw new Error('Empty topic in response');
      console.log(`Generated topic concept: "${finalTopic}"`);
    } catch (err) {
      console.error(`Failed to auto-generate topic: ${err.message}`);
      process.exit(1);
    }
  }

  // Schema for structured multilingual response
  const responseSchema = {
    type: 'OBJECT',
    properties: {
      slug: { type: 'STRING', description: 'URL-friendly hyphenated lowercase identifier for the post' },
      tags: { type: 'ARRAY', items: { type: 'STRING' }, description: '3-4 lowercase keyword tags' },
      imagePrompt: { type: 'STRING', description: 'Descriptive prompt for generating a beautiful technology or conceptual banner image' },
      en: {
        type: 'OBJECT',
        properties: {
          title: { type: 'STRING', description: 'Catchy SEO-optimized English title (under 60 chars)' },
          description: { type: 'STRING', description: 'English SEO meta description (under 160 chars)' },
          content: { type: 'STRING', description: 'Full English article body in markdown. Use h2/h3 headings, paragraphs, and list points. Engage the reader.' }
        },
        required: ['title', 'description', 'content']
      },
      hi: {
        type: 'OBJECT',
        properties: {
          title: { type: 'STRING', description: 'Catchy SEO-optimized Hindi title (under 60 chars)' },
          description: { type: 'STRING', description: 'Hindi SEO meta description (under 160 chars)' },
          content: { type: 'STRING', description: 'Full Hindi article body in markdown. Use h2/h3 headings, paragraphs, and list points.' }
        },
        required: ['title', 'description', 'content']
      },
      mr: {
        type: 'OBJECT',
        properties: {
          title: { type: 'STRING', description: 'Catchy SEO-optimized Marathi title (under 60 chars)' },
          description: { type: 'STRING', description: 'Marathi SEO meta description (under 160 chars)' },
          content: { type: 'STRING', description: 'Full Marathi article body in markdown. Use h2/h3 headings, paragraphs, and list points.' }
        },
        required: ['title', 'description', 'content']
      }
    },
    required: ['slug', 'tags', 'imagePrompt', 'en', 'hi', 'mr']
  };

  const jsonStructureDescription = `The JSON object must have exactly these keys:
{
  "slug": "url-friendly-hyphenated-lowercase-identifier",
  "tags": ["3-4 lowercase keyword tags"],
  "imagePrompt": "highly descriptive prompt for a text-to-image generator representing the topic, e.g. 'futuristic city in Maharashtra with cyber-physical agricultural systems, dark cyberpunk lighting, wide shot'",
  "en": { "title": "SEO English title under 60 chars", "description": "SEO English meta description under 160 chars", "content": "Full English article body in markdown (at least 4-5 paragraphs, h2/h3 headings, bullet points)" },
  "hi": { "title": "Hindi title under 60 chars", "description": "Hindi meta description under 160 chars", "content": "Full Hindi article body in markdown (at least 4-5 paragraphs)" },
  "mr": { "title": "Marathi title under 60 chars", "description": "Marathi meta description under 160 chars", "content": "Full Marathi article body in markdown (at least 4-5 paragraphs)" }
}`;

  const blogPrompt = `You are a professional multilingual tech blogger. 
  Write a high-quality, comprehensive, and engaging blog post about: "${finalTopic}".
  
  Format the output exactly matching the JSON schema.
  Make sure:
  1. The "content" in all languages is complete (at least 4-5 paragraphs, structured with Markdown headings and bullet points).
  2. The translation to Hindi (hi) and Marathi (mr) is natural, grammatically correct, and preserves professional technical concepts rather than literal vocabulary word-for-word translations.
  3. Include an "imagePrompt" that is a highly descriptive prompt suitable for a text-to-image generator (representing the topic, e.g. "futuristic city in Maharashtra with cyber-physical agricultural systems, dark cyberpunk lighting, wide shot").`;

  const deepSeekBlogPrompt = `${blogPrompt}

${jsonStructureDescription}

Do not include markdown code fences, do not add any commentary outside the JSON object. Return ONLY the JSON object.`;

  console.log(`Requesting ${useDeepSeek ? model : 'Gemini'} to write the articles...`);
  try {
    const result = useDeepSeek
      ? await requestJson(options.apiKey, deepSeekBlogPrompt, model)
      : JSON.parse(await callGemini(options.apiKey, blogPrompt, responseSchema));

    console.log(`Articles written successfully! Slug: "${result.slug}"`);
    console.log(`Tags: ${result.tags.join(', ')}`);

    // Download image
    const localHeroUrl = await downloadHeroImage(result.imagePrompt, result.slug);

    // Save files
    const blogDir = path.join(__dirname, '../src/content/blog');
    if (!fs.existsSync(blogDir)) {
      fs.mkdirSync(blogDir, { recursive: true });
    }

    const todayStr = new Date().toISOString().split('T')[0];

    const languages = ['en', 'hi', 'mr'];
    for (const lang of languages) {
      const data = result[lang];
      const filePath = path.join(blogDir, `${result.slug}-${lang}.md`);
      
      const fileContent = `---
title: "${data.title.replace(/"/g, '\\"')}"
description: "${data.description.replace(/"/g, '\\"')}"
pubDate: "${todayStr}"
heroImage: "${localHeroUrl}"
tags: ${JSON.stringify(result.tags)}
draft: false
---

${data.content.trim()}
`;

      fs.writeFileSync(filePath, fileContent);
      console.log(`Saved: src/content/blog/${result.slug}-${lang}.md`);
    }

    console.log(`\n🎉 Success! Auto-blog generation completed successfully.`);

  } catch (err) {
    console.error(`Error during blog generation: ${err.message}`);
    process.exit(1);
  }
}

main();
