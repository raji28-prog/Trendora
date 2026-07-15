export const STUDIO_CATEGORIES = [
  { name: 'Bakery', icon: '🍰', color: '#fbcfe8' },
  { name: 'Restaurant', icon: '🍽️', color: '#fed7aa' },
  { name: 'Cafe', icon: '☕', color: '#d6d3d1' },
  { name: 'Salon', icon: '✂️', color: '#fca5a5' },
  { name: 'Spa', icon: '💆‍♀️', color: '#bbf7d0' },
  { name: 'Gym', icon: '🏋️‍♂️', color: '#93c5fd' },
  { name: 'Hospital', icon: '🏥', color: '#f87171' },
  { name: 'Clinic', icon: '🩺', color: '#6ee7b7' },
  { name: 'Medical Shop', icon: '💊', color: '#c4b5fd' },
  { name: 'Real Estate', icon: '🏠', color: '#86efac' },
  { name: 'Jewellery', icon: '💎', color: '#fde047' },
  { name: 'Fashion', icon: '👗', color: '#f9a8d4' },
  { name: 'Boutique', icon: '🛍️', color: '#a78bfa' },
  { name: 'Electronics', icon: '📱', color: '#cbd5e1' },
  { name: 'Mobile Shop', icon: '📲', color: '#bae6fd' },
  { name: 'Supermarket', icon: '🛒', color: '#fca5a5' },
  { name: 'Furniture', icon: '🪑', color: '#d1d5db' },
  { name: 'Travel', icon: '✈️', color: '#93c5fd' },
  { name: 'Education', icon: '🎓', color: '#fde047' },
  { name: 'Automobile', icon: '🚗', color: '#9ca3af' },
  { name: 'Hotel', icon: '🏨', color: '#fcd34d' },
  { name: 'Event', icon: '🎉', color: '#fbcfe8' },
  { name: 'Photography', icon: '📸', color: '#d8b4fe' },
  { name: 'Pet Shop', icon: '🐾', color: '#fdba74' },
  { name: 'Home Services', icon: '🔧', color: '#94a3b8' },
  { name: 'Financial Services', icon: '💰', color: '#86efac' },
  { name: 'Insurance', icon: '🛡️', color: '#6ee7b7' },
  { name: 'Construction', icon: '🏗️', color: '#fdba74' },
  { name: 'Wedding', icon: '💍', color: '#fbcfe8' },
  { name: 'Festival', icon: '🎊', color: '#fca5a5' },
  { name: 'Corporate', icon: '🏢', color: '#cbd5e1' },
].map((c, i) => ({ ...c, sortOrder: i }));

// Basic dimensions: standard IG post
const IG_POST = { width: 1080, height: 1080 };

// Helper to generate generic layers
const generateLayers = (titleText, bgColor) => [
  {
    id: 'bg-1',
    type: 'background',
    fill: bgColor,
    x: 0, y: 0,
    width: IG_POST.width, height: IG_POST.height,
    zIndex: 0
  },
  {
    id: 'text-1',
    type: 'text',
    text: titleText,
    fill: '#ffffff',
    fontSize: 72,
    fontWeight: 'bold',
    fontFamily: 'Inter',
    x: 100, y: 200,
    width: 880, height: 100,
    textAlign: 'center',
    zIndex: 1
  },
  {
    id: 'text-2',
    type: 'text',
    text: '{businessName}',
    fill: '#ffffff',
    fontSize: 48,
    fontWeight: 'normal',
    fontFamily: 'Inter',
    x: 100, y: 350,
    width: 880, height: 80,
    textAlign: 'center',
    zIndex: 2
  },
  {
    id: 'shape-1',
    type: 'shape',
    shapeType: 'rectangle',
    fill: '#ffffff',
    x: 340, y: 500,
    width: 400, height: 10,
    zIndex: 3
  },
  {
    id: 'text-3',
    type: 'text',
    text: '{phone} | {website}',
    fill: '#ffffff',
    fontSize: 32,
    fontWeight: 'normal',
    fontFamily: 'Inter',
    x: 100, y: 800,
    width: 880, height: 60,
    textAlign: 'center',
    zIndex: 4
  }
];

export const STUDIO_TEMPLATES = [
  // Generate 2 templates for each category
  ...STUDIO_CATEGORIES.flatMap(cat => [
    {
      title: `${cat.name} Promo`,
      description: `Promotional template for ${cat.name}`,
      category: cat.name,
      tags: [cat.name.toLowerCase(), 'promo', 'discount'],
      dimensions: IG_POST,
      thumbnailBg: cat.color,
      isPremium: false,
      isNew: true,
      layers: generateLayers(`${cat.name} Special Offer`, '#6D5EF8')
    },
    {
      title: `${cat.name} Grand Opening`,
      description: `Grand opening announcement for ${cat.name}`,
      category: cat.name,
      tags: [cat.name.toLowerCase(), 'opening', 'announcement'],
      dimensions: IG_POST,
      thumbnailBg: cat.color,
      isPremium: true,
      isFeatured: true,
      layers: generateLayers('Grand Opening!', '#8B5CF6')
    }
  ])
];
