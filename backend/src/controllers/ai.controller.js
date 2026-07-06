// AI Content Generator — stub implementation
// Swap the template responses for a real LLM API call (e.g. Gemini, OpenAI) when ready.

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

    // Simulate a short processing delay for realism
    await new Promise(resolve => setTimeout(resolve, 600));

    res.json({ success: true, data: { type, suggestions } });
  } catch (err) {
    next(err);
  }
};
