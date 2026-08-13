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
    apiKey: process.env.GEMINI_API_KEY || ''
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
    }
  }

  return options;
}

// Call Gemini API
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
    console.error('Error: GEMINI_API_KEY is not defined. Please set it as an env variable or pass it via --apiKey');
    process.exit(1);
  }

  let finalTopic = options.topic;
  if (!finalTopic) {
    console.log(`No topic provided. Auto-generating a topic focusing on ${options.level} (${options.location || 'Anywhere'})...`);
    
    const topicPrompt = `You are a creative content strategist. Generate one high-interest, trending topic for a software developer/tech blog. 
    Focus level: ${options.level}.
    Location Focus: ${options.location || 'Global'}.
    Return ONLY the topic title/concept as plain text. Do not include quotes, intro, or explanation.`;

    try {
      finalTopic = (await callGemini(options.apiKey, topicPrompt)).trim();
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

  const blogPrompt = `You are a professional multilingual tech blogger. 
  Write a high-quality, comprehensive, and engaging blog post about: "${finalTopic}".
  
  Format the output exactly matching the JSON schema.
  Make sure:
  1. The "content" in all languages is complete (at least 4-5 paragraphs, structured with Markdown headings and bullet points).
  2. The translation to Hindi (hi) and Marathi (mr) is natural, grammatically correct, and preserves professional technical concepts rather than literal vocabulary word-for-word translations.
  3. Include an "imagePrompt" that is a highly descriptive prompt suitable for a text-to-image generator (representing the topic, e.g. "futuristic city in Maharashtra with cyber-physical agricultural systems, dark cyberpunk lighting, wide shot").`;

  console.log(`Requesting Gemini to write the articles...`);
  try {
    const rawResult = await callGemini(options.apiKey, blogPrompt, responseSchema);
    const result = JSON.parse(rawResult);

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
