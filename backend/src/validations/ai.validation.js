// Normalization Helper
function normalizeText(text) {
  if (!text) return '';
  return text
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' '); // remove duplicate spaces and trim
}

const CATEGORY_MAPPINGS = {
  'Bakery': ['bakery', 'cake shop', 'cake store', 'baking', 'pastry shop', 'bakery & confectionery', 'sweet shop', 'sweets', 'confectionery', 'cookies', 'croissants', 'pastry', 'pastries', 'cupcakes'],
  'Restaurant': ['restaurant', 'hotel', 'food', 'dining', 'food court', 'meals', 'eatery', 'pizzeria', 'diner', 'kitchen'],
  'Cafe': ['cafe', 'cafeteria', 'coffee shop', 'bistro', 'coffee', 'tea shop', 'brew'],
  'Hotel': ['hotel', 'motel', 'resort', 'inn', 'lodging', 'stay', 'homestay'],
  'Boutique': ['boutique', 'clothing store', 'clothing', 'apparel', 'fashion', 'designer', 'tailor', 'garments', 'wear', 'boutique & tailoring', 'fabric'],
  'Salon': ['salon', 'beauty parlour', 'beauty salon', 'hair salon', 'barber', 'barbershop', 'haircut', 'makeover', 'grooming', 'hair dressers'],
  'Spa': ['spa', 'wellness center', 'massage', 'spa & salon', 'aromatherapy'],
  'Gym': ['gym', 'fitness', 'fitness center', 'workout', 'health club', 'crossfit', 'yoga studio', 'pilates'],
  'Dental Clinic': ['dental clinic', 'dentist', 'dental care', 'orthodontist', 'smile dental'],
  'Clinic': ['clinic', 'medical clinic', 'physiotherapy', 'physio', 'chiropractor', 'diagnostic center', 'wellness clinic'],
  'Hospital': ['hospital', 'medical clinic', 'medical center', 'healthcare', 'er'],
  'Pharmacy': ['pharmacy', 'chemist', 'drugstore', 'medical shop', 'medicines'],
  'Automobile Service': ['automobile', 'auto service', 'car service', 'bike service', 'vehicle repair', 'garage', 'mechanic', 'auto repair', 'motorcycle service', 'puncture shop'],
  'Car Wash': ['car wash', 'bike wash', 'car detailing', 'auto detailing', 'car spa'],
  'Bike Service': ['bike service', 'motorcycle repair', 'scooter service', 'two wheeler service'],
  'Real Estate': ['real estate', 'realtor', 'property', 'properties', 'builder', 'brokerage', 'flat sales', 'apartments'],
  'Construction': ['construction', 'builder', 'contractor', 'renovation', 'engineering', 'civil works'],
  'Interior Design': ['interior design', 'interior decorator', 'home decor', 'architect', 'space design', 'decorating'],
  'Electronics Store': ['electronics', 'appliance', 'gadgets', 'computer shop', 'tv store', 'home appliances'],
  'Furniture Store': ['furniture', 'sofa shop', 'decor', 'woodwork', 'carpentry'],
  'Hardware Store': ['hardware', 'tools', 'paint shop', 'plumbing', 'electricals'],
  'Mobile Shop': ['mobile shop', 'phone store', 'smartphone repair', 'mobile accessories'],
  'Grocery': ['grocery', 'grocery store', 'vegetable market', 'supermarket', 'provisions', 'organic store'],
  'Supermarket': ['supermarket', 'hypermarket', 'mart', 'departmental store', 'grocery & provisions'],
  'Jewelry': ['jewelry', 'jewellers', 'gold shop', 'ornaments', 'silver', 'diamonds'],
  'Pet Shop': ['pet shop', 'pets', 'vet', 'veterinary', 'pet grooming', 'pet food'],
  'Flower Shop': ['flower shop', 'florist', 'flowers', 'bouquet', 'floral design'],
  'Photography': ['photography', 'photographer', 'photo studio', 'videography', 'camera service'],
  'Event Management': ['event management', 'wedding planner', 'decorator', 'catering', 'party organizer'],
  'Travel Agency': ['travel agency', 'travels', 'tours', 'tourism', 'cab service', 'taxi', 'car rental'],
  'Printing Shop': ['printing', 'print shop', 'xerox', 'copy center', 'banners', 'offset printing'],
  'Tailor': ['tailor', 'tailoring', 'stitching', 'alteration', 'dry clean', 'laundry'],
  'Laundry': ['laundry', 'dry cleaning', 'drycleaners', 'ironing', 'wash & fold'],
  'Cleaning Service': ['cleaning service', 'house cleaning', 'office cleaning', 'deep cleaning', 'maid service', 'janitorial'],
  'Digital Marketing Agency': ['digital marketing', 'marketing agency', 'seo agency', 'social media marketing', 'advertising agency', 'branding agency'],
  'Other Local Business': ['other local business', 'local business', 'general store', 'business', 'agency', 'firm', 'consultancy', 'consulting', 'lawyer', 'legal', 'accountant', 'auditor', 'tax consultant', 'optician', 'locksmith', 'pest control', 'roofing', 'painter', 'landscaping']
};

const INJECTION_PATTERNS = [
  /ignore\s+(?:previous|above|all)?\s*(?:instructions|rules|directives|prompts)/i,
  /you\s+are\s+now\s+a/i,
  /act\s+as\s+a/i,
  /system\s+prompt/i,
  /override\s+(?:system|previous)?/i,
  /forget\s+(?:what|everything|the\s+instructions|the\s+rules|previous)/i,
  /instead\s+of\s+generating/i,
  /bypass\s+restrictions/i
];

const DISALLOWED_KEYWORDS = [
  'teacher', 'student', 'politics', 'movie', 'programming', 'coding', 'gaming',
  'religion', 'personal advice', 'medical diagnosis', 'crypto', 'investment',
  'homework', 'story writing', 'song', 'poem', 'adult content', 'illegal business',
  'hacking', 'exam', 'homework helper'
];

const REJECT_MESSAGE = "This content cannot be generated because it is outside the scope of the Trendora Local Business Digital Marketing System.";

/**
 * Validates inputs for the AI Content Generator.
 * Rejects empty or out-of-scope business inputs.
 * Rejects prompt injections.
 * 
 * @param {Object} data - Input payload
 * @param {string} data.businessName
 * @param {string} data.businessCategory
 * @param {string} data.targetAudience
 * @param {string} data.marketingGoal
 * @returns {Object} { isValid: boolean, error: string, mappedCategory: string }
 */
export function validateAiInputs({ businessName, businessCategory, targetAudience, marketingGoal }) {
  const normalizedCategory = normalizeText(businessCategory);
  const normalizedGoal = normalizeText(marketingGoal);
  const normalizedName = normalizeText(businessName);
  const normalizedAudience = normalizeText(targetAudience);

  // 1. Check for empty or blank values
  if (!normalizedName || !normalizedCategory || !normalizedGoal || !normalizedAudience) {
    return { isValid: false, error: REJECT_MESSAGE };
  }

  // 2. Prompt injection and disallowed keywords check on all inputs
  const fields = [normalizedName, normalizedCategory, normalizedAudience, normalizedGoal];
  for (const field of fields) {
    // Check prompt injections
    for (const pattern of INJECTION_PATTERNS) {
      if (pattern.test(field)) {
        return { isValid: false, error: REJECT_MESSAGE };
      }
    }
    // Check disallowed keywords
    for (const dWord of DISALLOWED_KEYWORDS) {
      if (field.includes(dWord)) {
        return { isValid: false, error: REJECT_MESSAGE };
      }
    }
  }

  // 3. Category alias mapping check
  let matchedOfficialCategory = null;
  for (const [officialCategory, aliases] of Object.entries(CATEGORY_MAPPINGS)) {
    for (const alias of aliases) {
      const normAlias = normalizeText(alias);
      if (normAlias.length <= 3) {
        // Enforce word boundaries for very short keywords (e.g. er, vet, inn)
        const regex = new RegExp(`\\b${normAlias}\\b`, 'i');
        if (regex.test(normalizedCategory)) {
          matchedOfficialCategory = officialCategory;
          break;
        }
      } else {
        if (normalizedCategory.includes(normAlias)) {
          matchedOfficialCategory = officialCategory;
          break;
        }
      }
    }
    if (matchedOfficialCategory) break;
  }

  if (!matchedOfficialCategory) {
    return { isValid: false, error: REJECT_MESSAGE };
  }

  return { isValid: true, mappedCategory: matchedOfficialCategory };
}
