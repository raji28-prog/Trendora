import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateMarketingContent } from './src/services/ai.service.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env file manually
dotenv.config({ path: path.resolve(__dirname, './.env') });

async function run() {
  console.log('--- Testing Groq AI Content Generation Service ---');
  console.log('GROQ_API_KEY configured:', process.env.GROQ_API_KEY ? 'Yes (starts with ' + process.env.GROQ_API_KEY.substring(0, 5) + '...)' : 'No');
  
  if (!process.env.GROQ_API_KEY || process.env.GROQ_API_KEY === 'your_groq_api_key') {
    console.error('ERROR: GROQ_API_KEY in backend/.env is either missing or still the default placeholder.');
    console.error('Please update backend/.env with a valid Groq API key to run this test.');
    process.exit(1);
  }

  // Force env.js schema to load key from process.env if loaded via export
  const { default: env } = await import('./src/config/env.js');
  
  const testInput = {
    businessName: 'Deluxe Doughnuts',
    businessCategory: 'Bakery',
    targetAudience: 'Dessert lovers and local morning commuters',
    marketingGoal: 'Promote 50% discount on first box of coffee & glaze doughnut combo',
    tone: 'witty and energetic',
    platform: 'Instagram'
  };

  console.log('\nSending request to Groq with payload:');
  console.log(JSON.stringify(testInput, null, 2));

  try {
    const startTime = Date.now();
    const result = await generateMarketingContent(testInput);
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);

    console.log(`\nSuccess! Received structured JSON in ${duration}s:\n`);
    console.log(JSON.stringify(result, null, 2));
    
    console.log('\nVerification PASSED.');
  } catch (error) {
    console.error('\nVerification FAILED.');
    console.error('Error Details:', error.message);
    process.exit(1);
  }
}

run();
