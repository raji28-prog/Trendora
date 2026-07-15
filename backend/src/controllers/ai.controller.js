import prisma from '../database/prisma.js';
import { generateMarketingContent, callGroqChatCompletion, generateImageFromProvider } from '../services/ai.service.js';
import { validateAiInputs } from '../validations/ai.validation.js';
import { uploadToCloudinary } from '../config/cloudinary.js';
import fs from 'fs';
import path from 'path';

// Helper to save base64 image strings locally
const saveBase64Image = (base64Str, id) => {
  if (!base64Str || !base64Str.startsWith('data:image')) return base64Str;
  const dir = path.join(process.cwd(), 'uploads');
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  const matches = base64Str.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
  if (!matches || matches.length !== 3) return null;
  const ext = matches[1].split('/')[1] || 'png';
  const base64Data = matches[2];
  const buffer = Buffer.from(base64Data, 'base64');
  const filename = `ai-poster-${id}-${Date.now()}.${ext}`;
  const filePath = path.join(dir, filename);
  fs.writeFileSync(filePath, buffer);
  return `/uploads/${filename}`;
};

// Helper to download remote HTTP/HTTPS images and save them locally
const downloadAndSaveImage = async (url, id) => {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to download image: ${res.statusText}`);
    const arrayBuffer = await res.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    const dir = path.join(process.cwd(), 'uploads');
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    const filename = `ai-poster-${id}-${Date.now()}.png`;
    const filePath = path.join(dir, filename);
    fs.writeFileSync(filePath, buffer);
    return `/uploads/${filename}`;
  } catch (err) {
    console.error('Failed to download and save remote image locally:', err.message);
    return url; // Fallback to raw remote URL if download fails
  }
};

// AI Content Generator — stub templates
const templates = {
  ad: (topic, businessName) => [
    `🚀 Boost your business with ${businessName}! ${topic} — Don't miss out on this exclusive offer. Limited time only!`,
    `✨ ${businessName} brings you the best of ${topic}. Experience quality like never before. Visit us today!`,
    `💥 Incredible deals on ${topic} at ${businessName}. Your satisfaction is our priority. Shop now & save big!`
  ],
  post: (topic, businessName) => [
    `Hey everyone! We're thrilled to share exciting news about ${topic} at ${businessName}. Stay tuned for more updates! 🎉`,
    `📸 Behind the scenes at ${businessName} — Today we're talking about ${topic}. What do you think? Let us know below! 👇`,
    `Did you know? ${topic} can completely transform your experience. At ${businessName}, we make it happen every day. #LocalBusiness`
  ],
  email: (topic, businessName) => [
    `Subject: An Exciting Update from ${businessName}\n\nDear Valued Customer,\n\nWe're excited to share news about ${topic}. As a loyal customer, you get exclusive early access.\n\nBest regards,\n${businessName} Team`,
    `Subject: ${topic} — New from ${businessName}\n\nHi there,\n\nWe wanted to reach out personally to tell you about ${topic} and how it can benefit you.\n\nWarm regards,\n${businessName}`
  ]
};

export const generate = async (req, res, next) => {
  try {
    const { type = 'ad', topic = 'our services', businessName = 'Our Business' } = req.body;

    const generator = templates[type];
    if (!generator) {
      return res.status(400).json({ success: false, message: `Unknown content type: ${type}. Valid types: ad, post, email` });
    }

    const suggestions = generator(topic, businessName);
    await new Promise(resolve => setTimeout(resolve, 600));

    res.json({ success: true, data: { type, suggestions } });
  } catch (err) {
    next(err);
  }
};

/**
 * Controller to generate marketing content using the Groq API.
 * Performs strict validations, prompts the LLM service, and automatically records results in MongoDB.
 */
export const generateContent = async (req, res, next) => {
  try {
    const {
      campaignName,
      businessName,
      businessCategory,
      targetAudience,
      marketingObjective,
      tone,
      language,
      platforms,
      location,
      duration,
      offerDetails,
      contentLength,
      emojiLevel,
      creativity,
      seoKeywords
    } = req.body;

    // Enforce required fields
    if (!businessName || !businessCategory || !targetAudience || !marketingObjective || !tone || !language || !platforms || !platforms.length) {
      return res.status(400).json({
        success: false,
        message: "This content cannot be generated because it is outside the scope of the Trendora Local Business Digital Marketing System."
      });
    }

    // Run domain-specific validations
    const validation = validateAiInputs({
      businessName,
      businessCategory,
      targetAudience,
      marketingGoal: marketingObjective
    });

    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: validation.error
      });
    }

    // Call Groq completion engine
    const contentData = await generateMarketingContent({
      businessName,
      businessCategory,
      targetAudience,
      marketingObjective,
      tone,
      language,
      platforms,
      location,
      duration,
      offerDetails,
      contentLength,
      emojiLevel,
      creativity,
      seoKeywords
    });

    // Save record to MongoDB History
    let bizId = null;
    if (req.user) {
      const firstBiz = await prisma.business.findFirst({
        where: { ownerId: req.user.id }
      });
      if (firstBiz) bizId = firstBiz.id;
    }

    const record = await prisma.aiGeneration.create({
      data: {
        campaignName: campaignName ? campaignName.trim() : `Campaign ${businessName}`,
        businessName: businessName.trim(),
        businessCategory: businessCategory.trim(),
        platforms,
        inputs: {
          targetAudience,
          marketingObjective,
          tone,
          language,
          location,
          duration,
          offerDetails,
          contentLength,
          emojiLevel,
          creativity,
          seoKeywords
        },
        outputs: contentData,
        userId: req.user ? req.user.id : null,
        businessId: bizId
      }
    });

    return res.status(200).json({
      success: true,
      data: record
    });
  } catch (error) {
    console.error('generateContent controller error:', error.message);
    const isRefusal = error.message.includes('outside the scope') || error.message.includes('supports business marketing content');
    return res.status(400).json({
      success: false,
      message: isRefusal ? error.message : "This content cannot be generated because it is outside the scope of the Trendora Local Business Digital Marketing System."
    });
  }
};

/**
 * Fetch past campaign histories from MongoDB.
 */
export const getHistory = async (req, res, next) => {
  try {
    const history = await prisma.aiGeneration.findMany({
      where: req.user ? { userId: req.user.id } : {},
      orderBy: { createdDate: 'desc' }
    });
    res.json({ success: true, data: history });
  } catch (err) {
    next(err);
  }
};

/**
 * Duplicate a past AI generation log.
 */
export const duplicateHistory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const original = await prisma.aiGeneration.findUnique({ where: { id } });
    if (!original) {
      return res.status(404).json({ success: false, message: 'Campaign record not found.' });
    }

    const copy = await prisma.aiGeneration.create({
      data: {
        campaignName: `${original.campaignName} (Copy)`,
        businessName: original.businessName,
        businessCategory: original.businessCategory,
        platforms: original.platforms,
        inputs: original.inputs,
        outputs: original.outputs,
        userId: req.user ? req.user.id : original.userId,
        businessId: original.businessId,
        favourite: original.favourite,
        archived: original.archived
      }
    });

    res.json({ success: true, data: copy });
  } catch (err) {
    next(err);
  }
};

/**
 * Delete a past AI generation log.
 */
export const deleteHistory = async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.aiGeneration.delete({ where: { id } });
    res.json({ success: true, message: 'Campaign deleted successfully.' });
  } catch (err) {
    next(err);
  }
};

/**
 * Toggle downloaded / regenerated / favourite / archived action parameters.
 */
export const updateHistoryActions = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { downloaded, regenerated, favourite, archived, outputs, campaignName } = req.body;

    const updateData = {};
    if (downloaded !== undefined) updateData.downloaded = downloaded;
    if (regenerated !== undefined) updateData.regenerated = regenerated;
    if (favourite !== undefined) updateData.favourite = favourite;
    if (archived !== undefined) updateData.archived = archived;
    if (campaignName !== undefined) updateData.campaignName = campaignName;
    if (outputs !== undefined) updateData.outputs = outputs;

    const updated = await prisma.aiGeneration.update({
      where: { id },
      data: updateData
    });

    res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
};

/**
 * Aggregates analytics dashboard metrics.
 */
export const getAnalytics = async (req, res, next) => {
  try {
    const list = await prisma.aiGeneration.findMany({
      where: req.user ? { userId: req.user.id } : {}
    });

    const totalAI = list.length;
    const totalReports = list.filter(item => item.downloaded).length;

    // Platform usage counts
    const platformCounts = {};
    list.forEach(item => {
      if (Array.isArray(item.platforms)) {
        item.platforms.forEach(p => {
          platformCounts[p] = (platformCounts[p] || 0) + 1;
        });
      }
    });
    let mostUsedPlatform = 'None';
    let maxPlatform = 0;
    Object.keys(platformCounts).forEach(p => {
      if (platformCounts[p] > maxPlatform) {
        maxPlatform = platformCounts[p];
        mostUsedPlatform = p;
      }
    });

    // Category usage counts
    const categoryCounts = {};
    list.forEach(item => {
      const cat = item.businessCategory;
      if (cat) {
        categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
      }
    });
    let mostUsedCategory = 'None';
    let maxCategory = 0;
    Object.keys(categoryCounts).forEach(c => {
      if (categoryCounts[c] > maxCategory) {
        maxCategory = categoryCounts[c];
        mostUsedCategory = c;
      }
    });

    // Keywords usage counts
    const keywordCounts = {};
    list.forEach(item => {
      const inputs = item.inputs;
      if (inputs && Array.isArray(inputs.seoKeywords)) {
        inputs.seoKeywords.forEach(k => {
          keywordCounts[k] = (keywordCounts[k] || 0) + 1;
        });
      }
    });
    let mostUsedKeywords = [];
    Object.keys(keywordCounts)
      .sort((a, b) => keywordCounts[b] - keywordCounts[a])
      .slice(0, 5)
      .forEach(k => mostUsedKeywords.push(k));

    // Recent activity array
    const recentActivity = list.slice(0, 5).map(item => ({
      id: item.id,
      campaignName: item.campaignName,
      businessName: item.businessName,
      createdDate: item.createdDate,
      platforms: item.platforms
    }));

    // Weekly usage array (Sun - Sat)
    const weeklyUsage = [0, 0, 0, 0, 0, 0, 0];
    list.forEach(item => {
      const d = new Date(item.createdDate);
      weeklyUsage[d.getDay()]++;
    });

    res.json({
      success: true,
      data: {
        totalAI,
        totalReports,
        mostUsedPlatform,
        mostUsedCategory,
        mostUsedKeywords: mostUsedKeywords.join(', ') || 'None',
        weeklyUsage,
        recentActivity
      }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Endpoint to suggest 5 SEO keywords using Groq llama.
 */
export const suggestKeywords = async (req, res, next) => {
  try {
    const { category, objective } = req.body;
    if (!category) {
      return res.status(400).json({ success: false, message: 'Category is required.' });
    }

    const systemPrompt = `You are a professional SEO keyword planner for local businesses.
Generate exactly 5 highly relevant SEO search keyword phrases for a local business category "${category}" focusing on the objective "${objective || 'General Growth'}".
You MUST output your response strictly as a single JSON object. No commentary, formatting, or text outside the JSON.

Expected JSON schema:
{
  "keywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"]
}`;

    const messages = [
      { role: 'user', content: systemPrompt }
    ];

    const raw = await callGroqChatCompletion({
      messages,
      model: 'llama-3.3-70b-versatile',
      temperature: 0.6,
      jsonMode: true
    });

    const parsed = JSON.parse(raw);
    res.json({ success: true, data: parsed.keywords || [] });
  } catch (err) {
    console.error('suggestKeywords error:', err.message);
    res.json({ success: true, data: [] });
  }
};

/**
 * Controller to regenerate a specific copy card option (e.g. caption, tagline).
 */
export const regenerateField = async (req, res, next) => {
  try {
    const { id, fieldKey, fieldLabel, currentValue } = req.body;
    if (!id || !fieldKey || !fieldLabel) {
      return res.status(400).json({ success: false, message: 'id, fieldKey, and fieldLabel are required.' });
    }

    const original = await prisma.aiGeneration.findUnique({ where: { id } });
    if (!original) {
      return res.status(404).json({ success: false, message: 'Campaign record not found.' });
    }

    const { businessName, businessCategory, inputs } = original;
    const { marketingObjective, tone, targetAudience, language } = inputs;

    const systemPrompt = `You are a professional local business copywriting helper for the Trendora Digital Marketing System.
Your task is to rewrite/regenerate only the "${fieldLabel}" content for:
- Business: ${businessName} (${businessCategory})
- Target Audience: ${targetAudience}
- Marketing Goal: ${marketingObjective}
- Tone: ${tone}
- Language: ${language || 'English'}
- Previous Content: "${currentValue || ''}"

Generate a fresh, highly engaging and creative alternative.
You MUST output your response strictly as a JSON object containing exactly one key "${fieldKey}" with the string value of the new generated content. No commentary, formatting, or text outside the JSON.`;

    const messages = [
      { role: 'user', content: systemPrompt }
    ];

    const raw = await callGroqChatCompletion({
      messages,
      model: 'llama-3.3-70b-versatile',
      temperature: 1.0,
      jsonMode: true
    });

    const parsed = JSON.parse(raw);
    const newValue = parsed[fieldKey] || '';

    // Update campaign record in MongoDB
    const updatedOutputs = { ...original.outputs, [fieldKey]: newValue };
    const updated = await prisma.aiGeneration.update({
      where: { id },
      data: { outputs: updatedOutputs }
    });

    res.json({ success: true, data: newValue, campaign: updated });
  } catch (err) {
    console.error('regenerateField error:', err.message);
    next(err);
  }
};

export const generatePosterContent = async (req, res, next) => {
  try {
    const { businessName, businessCategory, userPrompt, tone } = req.body;
    if (!businessName || !businessCategory) {
      return res.status(400).json({ success: false, message: 'Business Name and Category are required.' });
    }

    const systemPrompt = `You are a professional local business copywriting helper for the Trendora Digital Marketing System.
Your task is to generate high-conversion marketing poster content.
Generate exactly 5 fields:
1. Headline: A short, catchy, attention-grabbing headline (maximum 6 words).
2. Sub Heading: A secondary line supporting the headline (maximum 10 words).
3. Offer Text: A clear description of the offer or promo (e.g., "50% OFF", "Buy 1 Get 1 Free", "Special Weekend Combo").
4. Call To Action: An actionable statement (e.g., "Call now to book", "Visit us today", "Order online").
5. Footer Text: Contact or business details (e.g., "Limited time offer. T&C apply.").

Use the following business info:
- Business: ${businessName} (${businessCategory})
- Theme/Tone: ${tone || 'Professional'}
- User request/ideas: ${userPrompt || 'None'}

You MUST output your response strictly as a JSON object containing exactly these 5 keys: "headline", "subHeading", "offerText", "callToAction", "footerText".
Do not include any other text, explanation, or markdown formatting outside the JSON.`;

    const messages = [{ role: 'user', content: systemPrompt }];
    const raw = await callGroqChatCompletion({
      messages,
      model: 'llama-3.3-70b-versatile',
      temperature: 0.8,
      jsonMode: true
    });

    const parsed = JSON.parse(raw);
    res.json({ success: true, data: parsed });
  } catch (err) {
    console.error('generatePosterContent error:', err.message);
    next(err);
  }
};

export const optimizePosterPrompt = async (req, res, next) => {
  try {
    const {
      businessName,
      businessCategory,
      occasion,
      specialOffer,
      preferredColors,
      styleType,
      aesthetic,
      targetAudience,
      mustAppearText,
      userPrompt,
      includeLogo,
      includeProfilePic
    } = req.body;

    const systemPrompt = `You are an expert AI prompt engineer for image generation models (like Midjourney, DALL-E 3, or Stable Diffusion).
Your task is to take the user's business details, design preferences, and text content, and generate a single, highly detailed, visually stunning, optimized image generation prompt for a marketing poster.

The prompt should describe:
- The overall scene, composition, and background.
- Specific visual elements (e.g. delicious chocolate cake, elegant boutique interior).
- The style (e.g. "${styleType || 'modern'}", "${aesthetic || 'premium'}", professional commercial photography, studio lighting).
- The color palette (e.g. "${preferredColors || 'harmonious colors'}").
- Composition instructions (e.g. "center-focused composition", "clean layout with negative space at the top/bottom for adding text overlays").
- If includeLogo is true, describe where a clean, professional logo space should be situated.
- If includeProfilePic is true, describe where a profile photo element should fit.
- The prompt MUST NOT contain instructions like "write the text '...'". Instead, describe the visual style of the typography and layout space.

Keep the prompt descriptive, under 150 words, and optimized for realistic/premium image generation.
Do not output anything other than the raw text of the optimized prompt itself.`;

    const userContent = `Build an optimized prompt for:
- Business: ${businessName} (${businessCategory})
- Occasion: ${occasion || 'General Promotion'}
- Special Offer: ${specialOffer || 'None'}
- Colors: ${preferredColors || 'Professional blend'}
- Style: ${styleType || 'Modern'} and ${aesthetic || 'Premium'}
- Target Audience: ${targetAudience || 'General Public'}
- Text to incorporate visual space for: ${mustAppearText || 'None'}
- Initial user prompt/idea: ${userPrompt || 'None'}
- Include Logo Space: ${includeLogo ? 'Yes' : 'No'}
- Include Profile Photo Space: ${includeProfilePic ? 'Yes' : 'No'}`;

    const messages = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userContent }
    ];

    const optimizedPrompt = await callGroqChatCompletion({
      messages,
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7
    });

    res.json({ success: true, data: optimizedPrompt.trim() });
  } catch (err) {
    console.error('optimizePosterPrompt error:', err.message);
    next(err);
  }
};

export const generatePosterImage = async (req, res, next) => {
  try {
    const { prompt, businessId, title, format } = req.body;
    if (!prompt) {
      return res.status(400).json({ success: false, message: 'Prompt is required.' });
    }

    let targetBizId = businessId;
    if (!targetBizId) {
      const firstBiz = await prisma.business.findFirst({
        where: { ownerId: req.user.id }
      });
      if (firstBiz) {
        targetBizId = firstBiz.id;
      } else {
        return res.status(400).json({ success: false, message: 'Business profile required.' });
      }
    }

    // Call AI image provider
    const generatedUrl = await generateImageFromProvider(prompt);

    // Upload generated image to Cloudinary to make it permanent
    console.log('Uploading AI generated image to Cloudinary...');
    let finalUrl = null;
    try {
      if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_CLOUD_NAME !== 'your_cloud_name') {
        finalUrl = await uploadToCloudinary(generatedUrl);
      }
    } catch (cloudinaryErr) {
      console.warn('Cloudinary upload failed, falling back to local storage or raw URL:', cloudinaryErr.message);
    }

    if (!finalUrl) {
      if (generatedUrl && generatedUrl.startsWith('data:image')) {
        const tempId = Math.random().toString(36).substring(2, 10);
        finalUrl = saveBase64Image(generatedUrl, tempId);
      } else if (generatedUrl && generatedUrl.startsWith('http')) {
        const tempId = Math.random().toString(36).substring(2, 10);
        finalUrl = await downloadAndSaveImage(generatedUrl, tempId);
      } else {
        finalUrl = generatedUrl;
      }
    }

    // Save URL in Prisma Poster table
    const poster = await prisma.poster.create({
      data: {
        title: title || 'AI Generated Background',
        imageUrl: finalUrl || '',
        format: format || 'PNG',
        businessId: targetBizId
      }
    });

    res.status(201).json({
      success: true,
      data: {
        id: poster.id,
        imageUrl: poster.imageUrl,
        prompt,
        title: poster.title,
        createdAt: poster.createdAt
      }
    });
  } catch (err) {
    console.error('generatePosterImage error:', err);
    res.status(502).json({
      success: false,
      message: `Image generation failed: ${err.message}`,
      error: {
        statusCode: 502,
        message: err.message,
        details: process.env.NODE_ENV === 'development' ? err.stack : undefined
      }
    });
  }
};


