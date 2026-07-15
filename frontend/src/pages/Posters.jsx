import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Card from '../components/UI/Card.jsx';
import Button from '../components/UI/Button.jsx';
import Modal from '../components/UI/Modal.jsx';
import Input from '../components/UI/Input.jsx';
import EmptyState from '../components/UI/EmptyState.jsx';
import Badge from '../components/UI/Badge.jsx';
import { addToast } from '../store/uiSlice.js';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Plus, 
  Image as ImageIcon, 
  Camera, 
  X, 
  Download, 
  Sparkles, 
  Sliders, 
  Palette, 
  Check, 
  Megaphone, 
  Calendar,
  Search,
  Heart,
  Grid,
  Bot,
  ChevronDown,
  ChevronUp,
  Copy,
  RefreshCw,
  Eye,
  EyeOff,
  Building,
  CreditCard,
  Lock
} from 'lucide-react';
import api from '../services/api.js';
import PremiumPricingModal from '../components/UI/PremiumPricingModal.jsx';

import { useSelectedBusiness } from '../store/useSelectedBusiness.js';

// Pre-defined Editable templates
// Pre-defined Editable templates
const TEMPLATES_LIBRARY = [
  { id: 'cafe-cozy', title: 'Morning Brew Coffee Kickstart', category: 'Cafe', theme: 'Espresso Glow', bg: 'linear-gradient(135deg, #2D1A12, #6F4E37)', textColor: '#FFFFFF', accentColor: '#FFF8F0', icon: '☕', isTrending: true },
  { id: 'bakery-warm', title: 'Artisan Bakery Fresh BOGO', category: 'Bakery', theme: 'Warm Brown', bg: 'linear-gradient(135deg, #78350F, #D97706)', textColor: '#FFFFFF', accentColor: '#FEF3C7', icon: '🍞', isNew: true },
  { id: 'restaurant-bold', title: 'Gourmet Dining Special Combo', category: 'Restaurant', theme: 'Hot Red', bg: 'linear-gradient(135deg, #991B1B, #EF4444)', textColor: '#FFFFFF', accentColor: '#FEE2E2', icon: '🍳', isPremium: true },
  { id: 'boutique-luxury', title: 'Golden Diamond Ornament Launch', category: 'Boutique', theme: 'Luxurious Gold', bg: 'linear-gradient(135deg, #0F172A, #D97706)', textColor: '#FFFFFF', accentColor: '#FEF3C7', icon: '💎', isPremium: true },
  { id: 'salon-relax', title: 'Luxury Haircut & Makeover Deal', category: 'Salon', theme: 'Premium Orchid', bg: 'linear-gradient(135deg, #6D28D9, #A78BFA)', textColor: '#FFFFFF', accentColor: '#F5F3FF', icon: '💇', isNew: true },
  { id: 'gym-active', title: 'High Octane Crossfit Challenge', category: 'Gym', theme: 'Slate Yellow', bg: 'linear-gradient(135deg, #1E293B, #EAB308)', textColor: '#FFFFFF', accentColor: '#FEF9C3', icon: '🏋️', isPremium: true },
  { id: 'realestate-modern', title: 'Luxury Villa Open House Show', category: 'Real Estate', theme: 'Obsidian Gold', bg: 'linear-gradient(135deg, #090D1A, #1E293B, #C29E30)', textColor: '#FFFFFF', accentColor: '#FFFBEB', icon: '🏠', isTrending: true },
  { id: 'medical-clean', title: 'Premium Health Check Diagnostic', category: 'Medical', theme: 'Clean Teal', bg: 'linear-gradient(135deg, #0F766E, #2DD4BF)', textColor: '#FFFFFF', accentColor: '#CCFBF1', icon: '🩺', isNew: true },
  { id: 'education-scholar', title: 'Expert IIT-JEE Coaching Batches', category: 'Education', theme: 'Academic Blue', bg: 'linear-gradient(135deg, #1E3A8A, #2563EB)', textColor: '#FFFFFF', accentColor: '#DBEAFE', icon: '📚', isPremium: true },
  { id: 'retail-mega', title: 'Mega Retail Clearance Sale', category: 'Retail', theme: 'Electric Orange', bg: 'linear-gradient(135deg, #C2410C, #EA580C)', textColor: '#FFFFFF', accentColor: '#FFEDD5', icon: '🛍️', isTrending: true },
  { id: 'automobile-service', title: 'Express Car Wash & Auto Service', category: 'Automobile', theme: 'Carbon Grey', bg: 'linear-gradient(135deg, #1E293B, #475569)', textColor: '#FFFFFF', accentColor: '#CBD5E1', icon: '🚗', isNew: true },
  { id: 'technology-ai', title: 'NextGen AI Cloud Tech Summit', category: 'Technology', theme: 'Neon Indigo', bg: 'linear-gradient(135deg, #312E81, #6D28D9, #0EA5E9)', textColor: '#FFFFFF', accentColor: '#E0F2FE', icon: '💻', isPremium: true },
  { id: 'events-startup', title: 'Enterprise Tech Meetup Launch', category: 'Events', theme: 'Cyber Purple', bg: 'linear-gradient(135deg, #4C1D95, #7C3AED)', textColor: '#FFFFFF', accentColor: '#EDE9FE', icon: '📅', isTrending: true },
  { id: 'festival-diwali', title: 'Diwali Grand Lights Festival', category: 'Festival', theme: 'Festival Amber', bg: 'linear-gradient(135deg, #78350F, #F59E0B, #FDE68A)', textColor: '#FFFFFF', accentColor: '#FEF3C7', icon: '🪔', isPremium: true },
  { id: 'festival-eid', title: 'Eid Mubarak Special Offers', category: 'Festival', theme: 'Emerald Green', bg: 'linear-gradient(135deg, #064E3B, #10B981)', textColor: '#FFFFFF', accentColor: '#D1FAE5', icon: '🌙', isNew: true },
  { id: 'festival-christmas', title: 'Christmas Holiday Bundle Deals', category: 'Festival', theme: 'Christmas Crimson', bg: 'linear-gradient(135deg, #7F1D1D, #DC2626)', textColor: '#FFFFFF', accentColor: '#FEE2E2', icon: '🎄', isTrending: true },
  { id: 'offer-flat50', title: 'Flat 50% Off Mega Seasonal Promo', category: 'Offer', theme: 'Vibrant Magenta', bg: 'linear-gradient(135deg, #881337, #E11D48)', textColor: '#FFFFFF', accentColor: '#FFE4E6', icon: '🏷️', isPremium: true },
  { id: 'seasonal-spring', title: 'Spring Collection Exclusive Launch', category: 'Seasonal', theme: 'Garden Green', bg: 'linear-gradient(135deg, #065F46, #34D399)', textColor: '#FFFFFF', accentColor: '#D1FAE5', icon: '🌸', isNew: true },
  { id: 'fashion-chic', title: 'Elegant Couture Summer Launch', category: 'Fashion', theme: 'Blush Pink', bg: 'linear-gradient(135deg, #BE185D, #F472B6)', textColor: '#FFFFFF', accentColor: '#FCE7F3', icon: '👗', isTrending: true },
  { id: 'travel-blue', title: 'Holiday Travels Booking Packages', category: 'Events', theme: 'Ocean Blue', bg: 'linear-gradient(135deg, #1E3A8A, #3B82F6)', textColor: '#FFFFFF', accentColor: '#DBEAFE', icon: '✈️', isNew: true },
];

const TEMPLATE_CATEGORIES = [
  'All', 'Cafe', 'Bakery', 'Restaurant', 'Boutique', 'Salon', 'Gym', 'Real Estate', 'Medical', 'Education', 'Retail', 'Automobile', 'Fashion', 'Technology', 'Events', 'Festival', 'Offer', 'Seasonal'
];

export const Posters = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { selectedBusinessId, selectedBusiness, businesses } = useSelectedBusiness();

  // Redux user for profile pic option
  const currentUser = useSelector((state) => state.auth.user);
  const profileImage = currentUser?.profileImage || '';
  const businessLogo = selectedBusiness?.images?.[0] || '';

  // Main UI Mode tab: 'generator' (AI Poster Generator) or 'designer' (Template Designer)
  const [mainTab, setMainTab] = useState('generator');

  // Profile mode: 'business' uses saved profile; 'custom' allows freeform input
  const [profileMode, setProfileMode] = useState('business');

  // Integrated campaigns lists
  const [campaigns, setCampaigns] = useState([]);
  const [selectedCampaignId, setSelectedCampaignId] = useState('');

  // Poster states
  const [posters, setPosters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [exportingImg, setExportingImg] = useState(false);
  const [pricingModalOpen, setPricingModalOpen] = useState(false);
  const [activePlan, setActivePlan] = useState('FREE');
  
  // Customization Form states (Automatically populated from AI Campaign)
  const [posterTitle, setPosterTitle] = useState('My Promotional Poster');
  const [bizName, setBizName] = useState('My Local Niche');
  const [offerText, setOfferText] = useState('Special Discount Offer');
  const [taglineText, setTaglineText] = useState('Experience quality like never before');
  const [ctaText, setCtaText] = useState('Call to Book Now');
  const [phone, setPhone] = useState('+1 (555) 123-4567');
  const [address, setAddress] = useState('123 Main St, New York');
  const [website, setWebsite] = useState('www.mybusiness.com');

  // Selected Template Style
  const [activeTemplate, setActiveTemplate] = useState(TEMPLATES_LIBRARY[0]);
  const [templateSearch, setTemplateSearch] = useState('');
  const [templateCategory, setTemplateCategory] = useState('All');
  const [favoriteTemplates, setFavoriteTemplates] = useState([]);
  const [activeLibraryTab, setActiveLibraryTab] = useState('all'); // 'all' | 'recent' | 'recommended' | 'favorites'
  const [recentTemplates, setRecentTemplates] = useState([]);
  const [posterPurchaseModalOpen, setPosterPurchaseModalOpen] = useState(false);
  const [selectedResolution, setSelectedResolution] = useState('standard');
  const [paymentStep, setPaymentStep] = useState('select'); // 'select' | 'processing' | 'success'
  const [unlockedDownloads, setUnlockedDownloads] = useState({}); // { [posterKey]: true }
  const [pendingDownloadFormat, setPendingDownloadFormat] = useState('png');
  const [pendingDownloadType, setPendingDownloadType] = useState('designer'); // 'designer' | 'ai'

  // --- AI Poster Generator States ---
  // AI Design Assistant
  const [occasion, setOccasion] = useState('');
  const [colors, setColors] = useState('');
  const [styleType, setStyleType] = useState('Modern');
  const [aesthetic, setAesthetic] = useState('Premium');
  const [targetAudience, setTargetAudience] = useState('');
  const [mustAppearText, setMustAppearText] = useState('');
  const [userPrompt, setUserPrompt] = useState('');
  const [assistantOpen, setAssistantOpen] = useState(true);

  // Business Details & Enablers
  const [bizNameEdit, setBizNameEdit] = useState('');
  const [bizCategoryEdit, setBizCategoryEdit] = useState('');
  const [phoneEdit, setPhoneEdit] = useState('');
  const [addressEdit, setAddressEdit] = useState('');
  const [websiteEdit, setWebsiteEdit] = useState('');
  const [emailEdit, setEmailEdit] = useState('');
  const [logoOption, setLogoOption] = useState(true);
  const [profilePicOption, setProfilePicOption] = useState(false);

  const [showName, setShowName] = useState(true);
  const [showCategory, setShowCategory] = useState(true);
  const [showPhone, setShowPhone] = useState(true);
  const [showAddress, setShowAddress] = useState(true);
  const [showWebsite, setShowWebsite] = useState(true);
  const [showEmail, setShowEmail] = useState(true);

  // AI Content fields
  const [headline, setHeadline] = useState('');
  const [subHeading, setSubHeading] = useState('');
  const [promoOffer, setPromoOffer] = useState('');
  const [ctaTextAi, setCtaTextAi] = useState('');
  const [footerText, setFooterText] = useState('');
  const [generatingContent, setGeneratingContent] = useState(false);

  // Smart Prompt Builder
  const [optimizedPrompt, setOptimizedPrompt] = useState('');
  const [optimizingPrompt, setOptimizingPrompt] = useState(false);
  const [promptPreviewOpen, setPromptPreviewOpen] = useState(false);

  // Poster Generation Results
  const [generatedPoster, setGeneratedPoster] = useState(null);
  const [generatingPoster, setGeneratingPoster] = useState(false);
  const [selectedPosterSize, setSelectedPosterSize] = useState('Square (1024x1024)');
  const [canvasError, setCanvasError] = useState('');
  const [generationError, setGenerationError] = useState('');
  const [generationStage, setGenerationStage] = useState('Initializing generation engine...');
  const canvasRef = React.useRef(null);

  // Modal manual upload states
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadUrl, setUploadUrl] = useState('');
  const [uploadFormat, setUploadFormat] = useState('PNG');

  // Load basic business profile metadata & posters
  const loadMetadata = async () => {
    try {
      const [aiRes, posterRes, billingRes] = await Promise.all([
        api.get('/api/ai/history'),
        api.get('/api/posters'),
        api.get('/api/billing').catch(() => null)
      ]);

      setCampaigns(aiRes.data.data || []);
      
      // Filter posters by selected business
      const allPosters = posterRes.data.data || [];
      if (selectedBusinessId) {
        setPosters(allPosters.filter(p => p.businessId === selectedBusinessId));
      } else {
        setPosters(allPosters);
      }

      if (billingRes && billingRes.data?.success && billingRes.data.data) {
        setActivePlan(billingRes.data.data.plan || 'FREE');
      } else {
        setActivePlan('FREE');
      }
    } catch (err) {
      console.error('Failed to load metadata in posters page:', err);
    }
  };

  useEffect(() => {
    loadMetadata();
  }, [selectedBusinessId]);

  // Autofill details when global selected business changes
  useEffect(() => {
    if (selectedBusiness) {
      setBizName(selectedBusiness.name || '');
      setPhone(selectedBusiness.phone || '');
      setAddress(selectedBusiness.address || '');
      setWebsite(selectedBusiness.website || '');

      // AI Poster Generator Form
      setBizNameEdit(selectedBusiness.name || '');
      setBizCategoryEdit(selectedBusiness.category || '');
      setPhoneEdit(selectedBusiness.phone || '');
      setAddressEdit(selectedBusiness.address || '');
      setWebsiteEdit(selectedBusiness.website || '');
      setEmailEdit(currentUser?.email || '');
    }
  }, [selectedBusiness, currentUser]);

  // Watch for quick navigation triggers from other pages
  useEffect(() => {
    if (location.state?.campaignId && campaigns.length > 0) {
      const c = campaigns.find(item => item.id === location.state.campaignId);
      if (c) {
        setSelectedCampaignId(c.id);
        populateFromCampaign(c);
      }
    }
  }, [location.state, campaigns]);

  // Stage changes dynamically while generating poster image
  useEffect(() => {
    if (!generatingPoster) {
      setGenerationStage('Initializing generation engine...');
      return;
    }

    const stages = [
      { delay: 0, text: 'Initializing design canvas and prompt builder...' },
      { delay: 3000, text: 'Connecting to Hugging Face FLUX inference cluster...' },
      { delay: 8000, text: 'Model starting up. Rendering AI design assets...' },
      { delay: 18000, text: 'Optimizing high-resolution graphics and canvas overlays...' },
      { delay: 28000, text: 'Uploading raw image layers to Cloudinary storage...' },
      { delay: 38000, text: 'Finalizing composited canvas elements and overlays...' },
      { delay: 48000, text: 'Almost done! Wrapping up rendering output...' }
    ];

    const timers = stages.map(stage => {
      return setTimeout(() => {
        setGenerationStage(stage.text);
      }, stage.delay);
    });

    return () => {
      timers.forEach(t => clearTimeout(t));
    };
  }, [generatingPoster]);

  const populateFromCampaign = (campaign) => {
    setPosterTitle(`Poster - ${campaign.campaignName}`);
    setBizName(campaign.businessName);
    
    // Extract offer details
    let offerDesc = '';
    const details = campaign.inputs?.offerDetails;
    if (details) {
      if (details.discountPercent > 0) offerDesc += `${details.discountPercent}% OFF `;
      if (details.couponCode) offerDesc += `Code: ${details.couponCode} `;
      if (details.buyOneGetOne) offerDesc += `BOGO OFFER `;
      if (details.customOffer) offerDesc += `${details.customOffer}`;
    }
    setOfferText(offerDesc || 'Special BOGO Weekend Promotion');
    
    setTaglineText(campaign.outputs?.tagline || 'Experience premium services today');
    setCtaText(campaign.outputs?.callToAction || 'Call to Book Appointment');
    dispatch(addToast({ type: 'success', message: 'Poster fields pre-filled from AI Campaign!' }));
  };

  const handleCampaignChange = (e) => {
    const id = e.target.value;
    setSelectedCampaignId(id);
    if (!id) return;
    const c = campaigns.find(item => item.id === id);
    if (c) populateFromCampaign(c);
  };

  const handleBusinessChange = (e) => {
    const id = e.target.value;
    setSelectedBusinessId(id);
    const b = businesses.find(item => item.id === id);
    if (b) {
      setBizName(b.name || '');
      setPhone(b.phone || '');
      setAddress(b.address || '');
      setWebsite(b.website || '');
    }
  };

  const handleSavePoster = async () => {
    const payload = {
      title: posterTitle,
      imageUrl: activeTemplate.bg, // Mock storing gradient bg or formatted HTML canvas representation
      format: 'PNG',
      businessId: selectedBusinessId,
      campaignId: selectedCampaignId || null
    };

    try {
      await api.post('/api/posters', payload);
      dispatch(addToast({ type: 'success', message: 'Poster Design Saved to database successfully!' }));
      // reload
      const res = await api.get('/api/posters');
      setPosters(res.data.data || []);
    } catch (err) {
      dispatch(addToast({ type: 'error', message: 'Failed to save poster design' }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setUploadUrl(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleManualUpload = async (e) => {
    e.preventDefault();
    if (!uploadTitle || !uploadUrl) {
      dispatch(addToast({ type: 'warning', message: 'Title and Image asset required.' }));
      return;
    }

    try {
      await api.post('/api/posters', {
        title: uploadTitle,
        imageUrl: uploadUrl,
        format: uploadFormat,
        businessId: selectedBusinessId
      });
      dispatch(addToast({ type: 'success', message: 'External Poster Asset Uploaded!' }));
      setIsUploadOpen(false);
      setUploadTitle('');
      setUploadUrl('');
      loadMetadata();
    } catch (err) {
      dispatch(addToast({ type: 'error', message: 'Upload failed' }));
    }
  };

  const toggleFavTemplate = (id) => {
    if (favoriteTemplates.includes(id)) {
      setFavoriteTemplates(favoriteTemplates.filter(t => t !== id));
    } else {
      setFavoriteTemplates([...favoriteTemplates, id]);
    }
  };

  const handlePrintPoster = () => {
    if (activePlan === 'FREE') {
      dispatch(addToast({ type: 'warning', message: 'PDF export requires a Pro or Business subscription.' }));
      setPricingModalOpen(true);
      return;
    }
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>${posterTitle}</title>
          <style>
            body { margin: 0; padding: 0; display: flex; align-items: center; justify-content: center; min-height: 100vh; background: #f1f5f9; font-family: 'Inter', sans-serif; }
            .canvas { width: 600px; height: 600px; background: ${activeTemplate.bg}; border-radius: 20px; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1); padding: 40px; box-sizing: border-box; display: flex; flex-direction: column; justify-content: space-between; text-align: center; color: ${activeTemplate.textColor}; position: relative; overflow: hidden; }
            .badge { position: absolute; top: 30px; right: 30px; background: ${activeTemplate.accentColor}; color: #000; font-size: 11px; font-weight: 800; text-transform: uppercase; padding: 6px 12px; border-radius: 20px; }
            .logo { font-size: 40px; margin-bottom: 5px; }
            .biz { font-size: 28px; font-weight: 800; text-transform: uppercase; letter-spacing: 1.5px; }
            .offer-badge { background: rgba(255,255,255,0.15); border: 2px dashed ${activeTemplate.accentColor}; padding: 15px; border-radius: 12px; font-size: 22px; font-weight: 900; color: ${activeTemplate.accentColor}; text-transform: uppercase; margin: 20px 0; }
            .tagline { font-size: 16px; font-style: italic; opacity: 0.9; max-width: 400px; margin: 0 auto; }
            .cta { background: ${activeTemplate.textColor}; color: #000; font-weight: 800; font-size: 13px; text-transform: uppercase; padding: 12px 24px; border-radius: 30px; display: inline-block; margin: 15px auto; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); }
            .footer-info { border-top: 1px solid rgba(255,255,255,0.2); padding-top: 15px; font-size: 11px; opacity: 0.85; display: flex; justify-content: space-around; }
          </style>
        </head>
        <body>
          <div class="canvas">
            <span class="badge">${activeTemplate.category}</span>
            <div>
              <div class="logo">${activeTemplate.icon}</div>
              <div class="biz">${bizName}</div>
            </div>
            
            <div class="offer-badge">
              ${offerText}
            </div>

            <div>
              <p class="tagline">"${taglineText}"</p>
              <div class="cta">${ctaText}</div>
            </div>

            <div class="footer-info">
              <span>📞 ${phone}</span>
              <span>📍 ${address}</span>
              <span>🌐 ${website}</span>
            </div>
          </div>
          <script>
            window.onload = function() { window.print(); }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handleDownloadImage = (format = 'png', bypassPayment = false) => {
    const posterKey = `${activeTemplate.id}_${selectedResolution}`;
    if (!bypassPayment && !unlockedDownloads[posterKey]) {
      setPendingDownloadFormat(format);
      setPendingDownloadType('designer');
      setPaymentStep('select');
      setPosterPurchaseModalOpen(true);
      return;
    }

    setExportingImg(true);
    const canvas = document.createElement('canvas');
    let size = 1024;
    if (selectedResolution === 'hd') size = 1536;
    if (selectedResolution === 'premium' || selectedResolution === 'ultra') size = 2048;
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    const scale = size / 800;

    // Parse gradient colors from template bg string
    const gradColors = activeTemplate.bg.match(/#[0-9A-Fa-f]{3,6}/g) || ['#6d5ef8', '#0ea5e9'];
    const grad = ctx.createLinearGradient(0, 0, size, size);
    gradColors.forEach((c, i) => grad.addColorStop(i / Math.max(gradColors.length - 1, 1), c));
    ctx.fillStyle = grad;
    ctx.roundRect(0, 0, size, size, 30 * scale);
    ctx.fill();

    // Overlay semi-transparent top band
    ctx.fillStyle = 'rgba(0,0,0,0.15)';
    ctx.fillRect(0, 0, size, 100 * scale);

    // Category badge
    ctx.fillStyle = 'rgba(255,255,255,0.25)';
    ctx.roundRect(size - 160 * scale, 24 * scale, 136 * scale, 34 * scale, 17 * scale);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.font = `bold ${Math.round(12 * scale)}px Inter, sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText(activeTemplate.category.toUpperCase(), size - 92 * scale, 46 * scale);

    // Icon emoji
    ctx.font = `${Math.round(64 * scale)}px serif`;
    ctx.textAlign = 'center';
    ctx.fillText(activeTemplate.icon, size / 2, 180 * scale);

    // Business Name
    ctx.fillStyle = '#ffffff';
    ctx.font = `bold ${Math.round(36 * scale)}px Inter, Arial, sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText(bizName.toUpperCase(), size / 2, 240 * scale);

    // Offer dashed box
    ctx.strokeStyle = 'rgba(255,255,255,0.6)';
    ctx.lineWidth = 3 * scale;
    ctx.setLineDash([12 * scale, 8 * scale]);
    ctx.strokeRect(80 * scale, 270 * scale, size - 160 * scale, 100 * scale);
    ctx.setLineDash([]);
    ctx.fillStyle = 'rgba(255,255,255,0.15)';
    ctx.fillRect(80 * scale, 270 * scale, size - 160 * scale, 100 * scale);
    ctx.fillStyle = '#ffffff';
    ctx.font = `bold ${Math.round(26 * scale)}px Inter, Arial, sans-serif`;
    ctx.textAlign = 'center';
    const offerLines = offerText.split('\n');
    offerLines.forEach((line, i) => ctx.fillText(line, size / 2, (328 + i * 32) * scale));

    // Tagline
    ctx.fillStyle = 'rgba(255,255,255,0.85)';
    ctx.font = `italic ${Math.round(16 * scale)}px Georgia, serif`;
    ctx.textAlign = 'center';
    ctx.fillText(`"${taglineText.substring(0, 60)}${taglineText.length > 60 ? '...' : ''}"`, size / 2, 420 * scale);

    // CTA pill button
    ctx.fillStyle = '#ffffff';
    ctx.roundRect(size / 2 - 100 * scale, 445 * scale, 200 * scale, 46 * scale, 23 * scale);
    ctx.fill();
    ctx.fillStyle = '#1e293b';
    ctx.font = `bold ${Math.round(14 * scale)}px Inter, Arial, sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText(ctaText.toUpperCase().substring(0, 28), size / 2, 474 * scale);

    // Footer divider
    ctx.strokeStyle = 'rgba(255,255,255,0.25)';
    ctx.lineWidth = 1 * scale;
    ctx.setLineDash([]);
    ctx.beginPath();
    ctx.moveTo(60 * scale, 520 * scale);
    ctx.lineTo(size - 60 * scale, 520 * scale);
    ctx.stroke();

    // Footer info
    ctx.fillStyle = 'rgba(255,255,255,0.8)';
    ctx.font = `${Math.round(13 * scale)}px Inter, Arial, sans-serif`;
    ctx.textAlign = 'left';
    ctx.fillText(`📞 ${phone}`, 60 * scale, 558 * scale);
    ctx.textAlign = 'center';
    ctx.fillText(`📍 ${address}`, size / 2, 558 * scale);
    ctx.textAlign = 'right';
    ctx.fillText(`🌐 ${website}`, size - 60 * scale, 558 * scale);

    // Branding
    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.font = `${Math.round(11 * scale)}px Inter, Arial, sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText('Powered by Trendora', size / 2, 600 * scale);

    // Watermark - ONLY if resolution is free (Standard standard, and has NOT paid for watermark removal)
    if (selectedResolution === 'standard' && !unlockedDownloads[posterKey]) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(0, size - 45 * scale, size, 45 * scale);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.font = `bold ${Math.round(12 * scale)}px Inter, sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillText('Created with Trendora FREE Plan • Upgrade to remove watermark', size / 2, size - 18 * scale);
    }

    // Download
    const mimeType = format === 'jpg' ? 'image/jpeg' : 'image/png';
    const quality = format === 'jpg' ? 0.92 : 1.0;
    const dataUrl = canvas.toDataURL(mimeType, quality);
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `${posterTitle.replace(/\s+/g, '_')}_poster.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setExportingImg(false);
    dispatch(addToast({ type: 'success', message: `Poster downloaded as ${format.toUpperCase()}!` }));
  };

  const loadImage = (src) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = src;
      img.onload = () => resolve(img);
      img.onerror = (e) => reject(e);
    });
  };

  const drawPoster = async () => {
    if (!canvasRef.current || !generatedPoster?.imageUrl) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const size = 1024;
    canvas.width = size;
    canvas.height = size;

    try {
      setCanvasError('');
      
      // 1. Load background image
      const bgImg = await loadImage(generatedPoster.imageUrl);
      ctx.drawImage(bgImg, 0, 0, size, size);

      // 2. Draw text/overlay background gradients for readability
      // Top gradient
      const topGrad = ctx.createLinearGradient(0, 0, 0, 240);
      topGrad.addColorStop(0, 'rgba(0, 0, 0, 0.8)');
      topGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = topGrad;
      ctx.fillRect(0, 0, size, 240);

      // Bottom gradient
      const bottomGrad = ctx.createLinearGradient(0, size - 260, 0, size);
      bottomGrad.addColorStop(0, 'rgba(0, 0, 0, 0)');
      bottomGrad.addColorStop(1, 'rgba(0, 0, 0, 0.85)');
      ctx.fillStyle = bottomGrad;
      ctx.fillRect(0, size - 260, size, 260);

      // 3. Draw Business Logo
      if (logoOption && businessLogo) {
        try {
          const logoImg = await loadImage(businessLogo);
          // Circle mask for Logo
          ctx.save();
          ctx.beginPath();
          ctx.arc(100, 100, 48, 0, Math.PI * 2);
          ctx.fillStyle = '#ffffff';
          ctx.fill();
          
          ctx.beginPath();
          ctx.arc(100, 100, 44, 0, Math.PI * 2);
          ctx.clip();
          ctx.drawImage(logoImg, 56, 56, 88, 88);
          ctx.restore();
        } catch (e) {
          console.error('Failed loading logo for canvas:', e);
        }
      }

      // 4. Draw Profile Picture
      if (profilePicOption && profileImage) {
        try {
          const profileImg = await loadImage(profileImage);
          // Circle mask for Profile Pic
          ctx.save();
          ctx.beginPath();
          ctx.arc(size - 100, 100, 48, 0, Math.PI * 2);
          ctx.fillStyle = '#ffffff';
          ctx.fill();

          ctx.beginPath();
          ctx.arc(size - 100, 100, 44, 0, Math.PI * 2);
          ctx.clip();
          ctx.drawImage(profileImg, size - 144, 56, 88, 88);
          ctx.restore();
        } catch (e) {
          console.error('Failed loading profile pic for canvas:', e);
        }
      }

      // 5. Draw Business Name (centered top)
      if (showName && bizNameEdit) {
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.font = '800 32px system-ui, -apple-system, sans-serif';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
        ctx.shadowBlur = 6;
        ctx.fillText(bizNameEdit.toUpperCase(), size / 2, 70);
        ctx.shadowBlur = 0;
      }

      // Category badge
      if (showCategory && bizCategoryEdit) {
        ctx.font = 'bold 14px system-ui, -apple-system, sans-serif';
        const textWidth = ctx.measureText(bizCategoryEdit.toUpperCase()).width;
        ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
        ctx.beginPath();
        ctx.roundRect(size / 2 - (textWidth + 24) / 2, 90, textWidth + 24, 30, 15);
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.fillText(bizCategoryEdit.toUpperCase(), size / 2, 110);
      }

      // 6. Draw Headline
      if (headline) {
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.font = 'bold 54px system-ui, -apple-system, sans-serif';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
        ctx.shadowBlur = 12;
        ctx.fillText(headline, size / 2, 210);
        ctx.shadowBlur = 0;
      }

      // 7. Draw Sub Heading
      if (subHeading) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
        ctx.textAlign = 'center';
        ctx.font = 'italic 24px Georgia, serif';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
        ctx.shadowBlur = 8;
        ctx.fillText(`"${subHeading}"`, size / 2, 260);
        ctx.shadowBlur = 0;
      }

      // 8. Draw Offer Text (highlight box)
      if (promoOffer) {
        ctx.save();
        ctx.fillStyle = 'rgba(220, 38, 38, 0.9)';
        const boxWidth = Math.max(500, ctx.measureText(promoOffer).width + 80);
        const boxHeight = 100;
        const x = size / 2 - boxWidth / 2;
        const y = size / 2 - boxHeight / 2 - 20;
        
        ctx.beginPath();
        ctx.roundRect(x, y, boxWidth, boxHeight, 16);
        ctx.fill();
        
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 3;
        ctx.setLineDash([12, 6]);
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.font = '900 36px system-ui, -apple-system, sans-serif';
        ctx.fillText(promoOffer, size / 2, size / 2 + 10 - 20);
        ctx.restore();
      }

      // 9. Draw CTA (rounded button pill)
      if (ctaTextAi) {
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.roundRect(size / 2 - 170, size - 175, 340, 58, 29);
        ctx.fill();

        ctx.fillStyle = '#111827';
        ctx.textAlign = 'center';
        ctx.font = 'bold 20px system-ui, -apple-system, sans-serif';
        ctx.fillText(ctaTextAi.toUpperCase(), size / 2, size - 140);
      }

      // 10. Draw Contact details (footer block)
      const footerLines = [];
      if (showPhone && phoneEdit) footerLines.push(`📞 ${phoneEdit}`);
      if (showWebsite && websiteEdit) footerLines.push(`🌐 ${websiteEdit}`);
      if (showEmail && emailEdit) footerLines.push(`✉️ ${emailEdit}`);
      if (showAddress && addressEdit) footerLines.push(`📍 ${addressEdit}`);

      if (footerLines.length > 0) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
        ctx.fillRect(0, size - 90, size, 90);

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 16px system-ui, -apple-system, sans-serif';
        ctx.textAlign = 'center';
        
        const half = Math.ceil(footerLines.length / 2);
        const row1 = footerLines.slice(0, half).join('   |   ');
        const row2 = footerLines.slice(half).join('   |   ');

        ctx.fillText(row1, size / 2, size - 55);
        if (row2) {
          ctx.fillText(row2, size / 2, size - 25);
        }
      }

      // 11. Draw Footer Text / Terms
      if (footerText) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
        ctx.font = 'normal 11px system-ui, -apple-system, sans-serif';
        ctx.fillText(footerText, size / 2, size - 72);
      }

      // Draw Watermark for FREE plan
      if (activePlan === 'FREE') {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
        ctx.fillRect(0, size - 50, size, 50);
        
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 15px system-ui, -apple-system, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Created with Trendora Free Tier • Upgrade to remove watermark', size / 2, size - 18);
      }

    } catch (e) {
      console.error('Drawing error:', e);
      setCanvasError('Failed to composite some remote assets. Please check CORS configs.');
    }
  };

  useEffect(() => {
    if (mainTab === 'generator' && generatedPoster?.imageUrl) {
      const timer = setTimeout(() => {
        drawPoster();
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [
    generatedPoster, logoOption, profilePicOption, bizNameEdit, bizCategoryEdit,
    phoneEdit, addressEdit, websiteEdit, emailEdit, headline, subHeading,
    promoOffer, ctaTextAi, footerText, showName, showCategory, showPhone,
    showAddress, showWebsite, showEmail, mainTab, activePlan
  ]);

  const handleGeneratePosterContent = async () => {
    if (!bizNameEdit || !bizCategoryEdit) {
      dispatch(addToast({ type: 'warning', message: 'Business Name and Category are required to generate content.' }));
      return;
    }
    setGeneratingContent(true);
    try {
      const response = await api.post('/api/ai/generate-poster-content', {
        businessName: bizNameEdit,
        businessCategory: bizCategoryEdit,
        userPrompt,
        tone: aesthetic
      });
      const data = response.data.data;
      setHeadline(data.headline || '');
      setSubHeading(data.subHeading || '');
      setPromoOffer(data.offerText || '');
      setCtaTextAi(data.callToAction || '');
      setFooterText(data.footerText || '');
      dispatch(addToast({ type: 'success', message: 'AI Poster Content generated successfully!' }));
    } catch (err) {
      console.error('Generate content failed:', err);
      dispatch(addToast({ type: 'error', message: err.response?.data?.message || 'Failed to generate poster content.' }));
    } finally {
      setGeneratingContent(false);
    }
  };

  const handleOptimizePrompt = async () => {
    if (!bizNameEdit || !bizCategoryEdit) {
      dispatch(addToast({ type: 'warning', message: 'Business Name and Category are required.' }));
      return;
    }
    setOptimizingPrompt(true);
    try {
      const response = await api.post('/api/ai/optimize-poster-prompt', {
        businessName: bizNameEdit,
        businessCategory: bizCategoryEdit,
        occasion,
        specialOffer: promoOffer,
        preferredColors: colors,
        styleType,
        aesthetic,
        targetAudience,
        mustAppearText,
        userPrompt,
        includeLogo: logoOption,
        includeProfilePic: profilePicOption
      });
      setOptimizedPrompt(response.data.data);
      setPromptPreviewOpen(true);
      dispatch(addToast({ type: 'success', message: 'Optimized image prompt generated!' }));
    } catch (err) {
      console.error('Optimize prompt failed:', err);
      dispatch(addToast({ type: 'error', message: 'Failed to optimize image prompt.' }));
    } finally {
      setOptimizingPrompt(false);
    }
  };

  const handleGeneratePosterImage = async () => {
    setGenerationError('');
    let activePrompt = optimizedPrompt;
    if (!activePrompt) {
      setGeneratingPoster(true);
      try {
        const response = await api.post('/api/ai/optimize-poster-prompt', {
          businessName: bizNameEdit,
          businessCategory: bizCategoryEdit,
          occasion,
          specialOffer: promoOffer,
          preferredColors: colors,
          styleType,
          aesthetic,
          targetAudience,
          mustAppearText,
          userPrompt,
          includeLogo: logoOption,
          includeProfilePic: profilePicOption
        });
        activePrompt = response.data.data;
        setOptimizedPrompt(activePrompt);
      } catch (err) {
        console.error('Auto-optimization failed:', err);
        const errMsg = err.response?.data?.message || err.response?.data?.error?.message || err.message || 'Failed to optimize prompt.';
        setGenerationError(errMsg);
        dispatch(addToast({ type: 'error', message: errMsg }));
        setGeneratingPoster(false);
        return;
      }
    }

    setGeneratingPoster(true);
    try {
      const response = await api.post('/api/ai/generate-poster-image', {
        prompt: activePrompt,
        businessId: selectedBusinessId,
        title: headline || 'AI Generated Poster'
      });
      setGeneratedPoster(response.data.data);
      dispatch(addToast({ type: 'success', message: 'AI Poster background generated successfully!' }));
    } catch (err) {
      console.error('Generate poster image failed:', err);
      const errMsg = err.response?.data?.message || err.response?.data?.error?.message || err.message || 'Failed to generate poster.';
      setGenerationError(errMsg);
      dispatch(addToast({ type: 'error', message: errMsg }));
    } finally {
      setGeneratingPoster(false);
    }
  };

  const handlePrintAiPoster = () => {
    if (activePlan === 'FREE') {
      dispatch(addToast({ type: 'warning', message: 'PDF export requires a Pro or Business subscription.' }));
      setPricingModalOpen(true);
      return;
    }
    if (!canvasRef.current) return;
    try {
      const dataUrl = canvasRef.current.toDataURL('image/png');
      const printWindow = window.open('', '_blank');
      printWindow.document.write(`
        <html>
          <head>
            <title>${headline || 'AI Generated Poster'}</title>
            <style>
              body { margin: 0; padding: 0; display: flex; align-items: center; justify-content: center; min-height: 100vh; background: #000; }
              img { max-width: 100%; max-height: 100vh; object-fit: contain; }
              @media print {
                body { background: #fff; }
                img { max-width: 100%; height: auto; }
              }
            </style>
          </head>
          <body>
            <img src="${dataUrl}" />
            <script>
              window.onload = function() { window.print(); }
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
      dispatch(addToast({ type: 'success', message: 'Initiated PDF printing!' }));
    } catch (e) {
      console.error('Print error:', e);
      dispatch(addToast({ type: 'error', message: 'Tainted canvas. Unable to open print stream.' }));
    }
  };

  const handleDownloadAiPoster = (format = 'png', bypassPayment = false) => {
    const posterKey = `ai-poster_${selectedResolution}`;
    if (format !== 'pdf' && !bypassPayment && !unlockedDownloads[posterKey]) {
      setPendingDownloadFormat(format);
      setPendingDownloadType('ai');
      setPaymentStep('select');
      setPosterPurchaseModalOpen(true);
      return;
    }

    if (format === 'pdf') {
      handlePrintAiPoster();
      return;
    }
    if (!canvasRef.current) return;
    try {
      const canvas = canvasRef.current;
      const mimeType = format === 'jpg' ? 'image/jpeg' : 'image/png';
      const quality = format === 'jpg' ? 0.92 : 1.0;
      const dataUrl = canvas.toDataURL(mimeType, quality);
      
      const a = document.createElement('a');
      a.href = dataUrl;
      const fileTitle = (headline || 'AI_Poster').replace(/\s+/g, '_');
      a.download = `${fileTitle}_poster.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      dispatch(addToast({ type: 'success', message: `Poster downloaded as ${format.toUpperCase()}!` }));
    } catch (e) {
      console.error('Download error:', e);
      dispatch(addToast({ type: 'error', message: 'Security block or tainted canvas. Try direct save.' }));
    }
  };

  const handleProceedToPayment = () => {
    setPaymentStep('processing');
    setTimeout(() => {
      setPaymentStep('success');
      const posterKey = pendingDownloadType === 'designer' 
        ? `${activeTemplate.id}_${selectedResolution}` 
        : `ai-poster_${selectedResolution}`;
      
      setUnlockedDownloads(prev => ({
        ...prev,
        [posterKey]: true
      }));

      dispatch(addToast({ type: 'success', message: 'Transaction Authorized! Download Unlocked.' }));

      setTimeout(() => {
        setPosterPurchaseModalOpen(false);
        if (pendingDownloadType === 'designer') {
          handleDownloadImage(pendingDownloadFormat, true);
        } else {
          handleDownloadAiPoster(pendingDownloadFormat, true);
        }
      }, 1200);
    }, 2200);
  };



  const handleSaveAiPoster = async () => {
    if (!canvasRef.current || !generatedPoster) return;
    try {
      setLoading(true);
      const canvas = canvasRef.current;
      const base64Url = canvas.toDataURL('image/png');
      
      await api.post('/api/posters', {
        title: headline || 'AI Generated Poster',
        imageUrl: base64Url,
        format: 'PNG',
        businessId: selectedBusinessId
      });
      
      dispatch(addToast({ type: 'success', message: 'Composited Poster saved to dashboard gallery!' }));
      const res = await api.get('/api/posters');
      setPosters(res.data.data || []);
    } catch (err) {
      console.error('Save AI poster failed:', err);
      dispatch(addToast({ type: 'error', message: 'Failed to save poster design to DB.' }));
    } finally {
      setLoading(false);
    }
  };

  if (!selectedBusinessId) {
    return (
      <div className="flex flex-col gap-6 w-full text-textPrimary p-8">
        <div style={{ maxWidth: '800px', margin: '0 auto', width: '100%' }}>
          <div style={{ marginBottom: '32px' }}>
            <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Poster Generator</h1>
            <p style={{ color: '#64748B', marginTop: '4px', fontSize: '14px' }}>Create stunning marketing posters using your business profile or custom details.</p>
          </div>

          <div style={{ background: '#fff', borderRadius: '16px', padding: '48px', textAlign: 'center', border: '1px solid #E2E8F0' }}>
            <div style={{ fontSize: '64px', marginBottom: '16px' }}>🎨</div>
            {businesses.length === 0 ? (
              <>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0F172A' }}>No Businesses Found</h3>
                <p style={{ color: '#64748B', marginTop: '8px', fontSize: '14px' }}>Create your first business to start generating marketing posters.</p>
                <button
                  onClick={() => navigate('/businesses')}
                  style={{ marginTop: '20px', padding: '10px 24px', borderRadius: '10px', border: 'none', background: '#6D5EF8', color: '#fff', fontWeight: 700, cursor: 'pointer', fontSize: '14px' }}
                >
                  + Add Business
                </button>
              </>
            ) : (
              <>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0F172A' }}>No Business Selected</h3>
                <p style={{ color: '#64748B', marginTop: '8px', fontSize: '14px' }}>
                  Use the business selector in the header to choose which business to create posters for.
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Filter templates list based on active tab and category/search filters
  const filteredTemplates = (() => {
    let list = TEMPLATES_LIBRARY;
    if (activeLibraryTab === 'recent') {
      list = TEMPLATES_LIBRARY.filter(tpl => recentTemplates.includes(tpl.id));
    } else if (activeLibraryTab === 'recommended') {
      const bizCat = (selectedBusiness?.businessCategory || selectedBusiness?.category || '').toLowerCase();
      const matches = TEMPLATES_LIBRARY.filter(tpl => 
        tpl.category.toLowerCase().includes(bizCat) || 
        bizCat.includes(tpl.category.toLowerCase())
      );
      list = matches.length > 0 ? matches : TEMPLATES_LIBRARY.filter(tpl => tpl.isTrending || tpl.isPremium).slice(0, 4);
    } else if (activeLibraryTab === 'favorites') {
      list = TEMPLATES_LIBRARY.filter(tpl => favoriteTemplates.includes(tpl.id));
    }

    return list.filter(tpl => {
      if (templateCategory !== 'All' && tpl.category !== templateCategory) return false;
      if (templateSearch) {
        const s = templateSearch.toLowerCase();
        const matchTitle = tpl.title.toLowerCase().includes(s);
        const matchCategory = tpl.category.toLowerCase().includes(s);
        if (!matchTitle && !matchCategory) return false;
      }
      return true;
    });
  })();

  const handleSelectTemplate = (tpl) => {
    setActiveTemplate(tpl);
    setRecentTemplates(prev => {
      const filtered = prev.filter(id => id !== tpl.id);
      return [tpl.id, ...filtered].slice(0, 8);
    });
  };


  return (
    <div className="flex flex-col gap-6 w-full text-textPrimary">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-border pb-5 gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Poster Studio</h1>
          <p className="text-xs text-textSecondary mt-1">Generate stunning posters using AI or customize responsive pre-defined design templates.</p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-1 bg-surface border border-border p-1 rounded-xl shadow-sm">
            <button
              onClick={() => setMainTab('generator')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                mainTab === 'generator' ? 'bg-primary text-white shadow-premium' : 'text-textSecondary hover:text-textPrimary'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              AI Poster Generator
            </button>
            <button
              onClick={() => setMainTab('designer')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                mainTab === 'designer' ? 'bg-primary text-white shadow-premium' : 'text-textSecondary hover:text-textPrimary'
              }`}
            >
              <Palette className="w-3.5 h-3.5" />
              Template Designer
            </button>
          </div>
          <Button variant="secondary" onClick={() => setIsUploadOpen(true)}>Upload External</Button>
        </div>
      </div>

      {mainTab === 'generator' ? (
        /* ==================== AI POSTER GENERATOR VIEW ==================== */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Form Controls */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* 1. Design Description */}
            <Card className="bg-surface border border-border p-5 shadow-glass space-y-4">
              <div className="flex items-center gap-2 border-b border-border pb-2.5">
                <Sparkles className="w-5 h-5 text-primary" />
                <h3 className="text-sm font-bold text-textPrimary">Describe Poster Concept</h3>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-textSecondary uppercase">What design do you need?</label>
                <textarea
                  value={userPrompt}
                  onChange={(e) => setUserPrompt(e.target.value)}
                  placeholder="e.g. Create a premium bakery offer poster with chocolate cake and elegant typography..."
                  className="w-full bg-sectionBackground border border-border focus:border-primary rounded-xl p-3 text-xs outline-none h-20 resize-none placeholder-textSecondary/40 text-textPrimary"
                />
              </div>
            </Card>

            {/* 2. AI Design Assistant */}
            <Card className="bg-surface border border-border p-5 shadow-glass">
              <button 
                onClick={() => setAssistantOpen(!assistantOpen)}
                className="flex items-center justify-between w-full border-b border-border pb-2.5 text-left"
              >
                <div className="flex items-center gap-2">
                  <Bot className="w-5 h-5 text-primary" />
                  <h3 className="text-sm font-bold text-textPrimary">AI Design Assistant</h3>
                </div>
                {assistantOpen ? <ChevronUp className="w-4 h-4 text-textSecondary" /> : <ChevronDown className="w-4 h-4 text-textSecondary" />}
              </button>
              
              {assistantOpen && (
                <div className="space-y-4 pt-4 animate-fadeIn">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-textSecondary uppercase">Occasion / Theme</label>
                      <input
                        type="text"
                        placeholder="e.g. Summer Launch, Diwali"
                        value={occasion}
                        onChange={(e) => setOccasion(e.target.value)}
                        className="w-full bg-sectionBackground border border-border focus:border-primary rounded-lg px-3 py-2 text-xs outline-none text-textPrimary"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-textSecondary uppercase">Preferred Colors</label>
                      <input
                        type="text"
                        placeholder="e.g. warm gold, chocolate brown"
                        value={colors}
                        onChange={(e) => setColors(e.target.value)}
                        className="w-full bg-sectionBackground border border-border focus:border-primary rounded-lg px-3 py-2 text-xs outline-none text-textPrimary"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-textSecondary uppercase">Style Era</label>
                      <select
                        value={styleType}
                        onChange={(e) => setStyleType(e.target.value)}
                        className="w-full bg-sectionBackground border border-border rounded-lg px-3 py-2 text-xs text-textPrimary outline-none focus:border-primary"
                      >
                        <option value="Modern">Modern</option>
                        <option value="Traditional">Traditional</option>
                        <option value="Retro">Retro / Vintage</option>
                        <option value="Futuristic">Futuristic</option>
                      </select>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-textSecondary uppercase">Aesthetic</label>
                      <select
                        value={aesthetic}
                        onChange={(e) => setAesthetic(e.target.value)}
                        className="w-full bg-sectionBackground border border-border rounded-lg px-3 py-2 text-xs text-textPrimary outline-none focus:border-primary"
                      >
                        <option value="Premium">Premium</option>
                        <option value="Minimal">Minimal</option>
                        <option value="Bold / Energetic">Bold / Energetic</option>
                        <option value="Elegant">Elegant</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-textSecondary uppercase">Target Audience</label>
                      <input
                        type="text"
                        placeholder="e.g. foodies, local families"
                        value={targetAudience}
                        onChange={(e) => setTargetAudience(e.target.value)}
                        className="w-full bg-sectionBackground border border-border focus:border-primary rounded-lg px-3 py-2 text-xs outline-none text-textPrimary"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-textSecondary uppercase">Visual Elements to Include</label>
                      <input
                        type="text"
                        placeholder="e.g. coffee cups, cake slices"
                        value={mustAppearText}
                        onChange={(e) => setMustAppearText(e.target.value)}
                        className="w-full bg-sectionBackground border border-border focus:border-primary rounded-lg px-3 py-2 text-xs outline-none text-textPrimary"
                      />
                    </div>
                  </div>
                </div>
              )}
            </Card>

            {/* 3. Business Profile Integration */}
            <Card className="bg-surface border border-border p-5 shadow-glass space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-2.5">
                <div className="flex items-center gap-2">
                  <Building className="w-5 h-5 text-primary" />
                  <h3 className="text-sm font-bold text-textPrimary">Business Profile Overlays</h3>
                </div>
              </div>

              {/* Logo / Profile pic toggles */}
              <div className="grid grid-cols-2 gap-3 bg-sectionBackground p-3 rounded-xl border border-border">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={logoOption}
                    onChange={(e) => setLogoOption(e.target.checked)}
                    className="rounded text-primary focus:ring-primary h-4 w-4 border-border cursor-pointer"
                  />
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-textPrimary">Include Logo</span>
                    <span className="text-[9px] text-textSecondary">{businessLogo ? 'Cloudinary asset loaded' : 'No logo found'}</span>
                  </div>
                </label>
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={profilePicOption}
                    onChange={(e) => setProfilePicOption(e.target.checked)}
                    className="rounded text-primary focus:ring-primary h-4 w-4 border-border cursor-pointer"
                  />
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-textPrimary">Include User Avatar</span>
                    <span className="text-[9px] text-textSecondary">{profileImage ? 'User image loaded' : 'No avatar found'}</span>
                  </div>
                </label>
              </div>

              {/* Editable Fields list */}
              <div className="space-y-3 pt-2">
                {/* Name */}
                <div className="flex gap-3 items-center">
                  <input type="checkbox" checked={showName} onChange={(e) => setShowName(e.target.checked)} className="rounded text-primary h-4 w-4 border-border cursor-pointer" />
                  <div className="flex-1">
                    <Input label="Business Name" value={bizNameEdit} onChange={(e) => setBizNameEdit(e.target.value)} disabled={!showName} />
                  </div>
                </div>
                {/* Category */}
                <div className="flex gap-3 items-center">
                  <input type="checkbox" checked={showCategory} onChange={(e) => setShowCategory(e.target.checked)} className="rounded text-primary h-4 w-4 border-border cursor-pointer" />
                  <div className="flex-1">
                    <Input label="Category" value={bizCategoryEdit} onChange={(e) => setBizCategoryEdit(e.target.value)} disabled={!showCategory} />
                  </div>
                </div>
                {/* Phone */}
                <div className="flex gap-3 items-center">
                  <input type="checkbox" checked={showPhone} onChange={(e) => setShowPhone(e.target.checked)} className="rounded text-primary h-4 w-4 border-border cursor-pointer" />
                  <div className="flex-1">
                    <Input label="Phone Number" value={phoneEdit} onChange={(e) => setPhoneEdit(e.target.value)} disabled={!showPhone} />
                  </div>
                </div>
                {/* Address */}
                <div className="flex gap-3 items-center">
                  <input type="checkbox" checked={showAddress} onChange={(e) => setShowAddress(e.target.checked)} className="rounded text-primary h-4 w-4 border-border cursor-pointer" />
                  <div className="flex-1">
                    <Input label="Address" value={addressEdit} onChange={(e) => setAddressEdit(e.target.value)} disabled={!showAddress} />
                  </div>
                </div>
                {/* Website */}
                <div className="flex gap-3 items-center">
                  <input type="checkbox" checked={showWebsite} onChange={(e) => setShowWebsite(e.target.checked)} className="rounded text-primary h-4 w-4 border-border cursor-pointer" />
                  <div className="flex-1">
                    <Input label="Website Url" value={websiteEdit} onChange={(e) => setWebsiteEdit(e.target.value)} disabled={!showWebsite} />
                  </div>
                </div>
                {/* Email */}
                <div className="flex gap-3 items-center">
                  <input type="checkbox" checked={showEmail} onChange={(e) => setShowEmail(e.target.checked)} className="rounded text-primary h-4 w-4 border-border cursor-pointer" />
                  <div className="flex-1">
                    <Input label="Email" value={emailEdit} onChange={(e) => setEmailEdit(e.target.value)} disabled={!showEmail} />
                  </div>
                </div>
              </div>
            </Card>

            {/* 4. AI Content Generator Integration */}
            <Card className="bg-surface border border-border p-5 shadow-glass space-y-4">
              <div className="flex justify-between items-center border-b border-border pb-2.5">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  <h3 className="text-sm font-bold text-textPrimary">AI Poster Typography Content</h3>
                </div>
                <button
                  type="button"
                  onClick={handleGeneratePosterContent}
                  disabled={generatingContent}
                  className="bg-primary hover:bg-primaryHover text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all shadow-sm disabled:opacity-60"
                >
                  {generatingContent ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin font-bold" />
                  ) : (
                    <Sparkles className="w-3.5 h-3.5" />
                  )}
                  Generate Content
                </button>
              </div>

              <div className="space-y-3">
                <Input label="Poster Headline (Overlay)" placeholder="e.g. Fresh Artisanal Pastries" value={headline} onChange={(e) => setHeadline(e.target.value)} />
                <Input label="Poster Sub-Headline" placeholder="e.g. Baked Daily With Organic Ingredients" value={subHeading} onChange={(e) => setSubHeading(e.target.value)} />
                <Input label="Offer/Highlight Text" placeholder="e.g. BUY 1 GET 1 FREE" value={promoOffer} onChange={(e) => setPromoOffer(e.target.value)} />
                <Input label="CTA Button Label" placeholder="e.g. ORDER NOW" value={ctaTextAi} onChange={(e) => setCtaTextAi(e.target.value)} />
                
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-textSecondary">Terms / Footer Slogan</label>
                  <input
                    type="text"
                    placeholder="e.g. *Offer valid till Sunday. T&C Apply."
                    value={footerText}
                    onChange={(e) => setFooterText(e.target.value)}
                    className="w-full bg-sectionBackground border border-border focus:border-primary rounded-lg px-2.5 py-1.5 text-xs outline-none text-textPrimary"
                  />
                </div>
              </div>
            </Card>

            {/* 5. Smart Prompt Builder */}
            <Card className="bg-surface border border-border p-5 shadow-glass">
              <button 
                onClick={() => setPromptPreviewOpen(!promptPreviewOpen)}
                className="flex items-center justify-between w-full border-b border-border pb-2.5 text-left"
              >
                <div className="flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-primary" />
                  <h3 className="text-sm font-bold text-textPrimary">Smart Prompt Builder Preview</h3>
                </div>
                {promptPreviewOpen ? <ChevronUp className="w-4 h-4 text-textSecondary" /> : <ChevronDown className="w-4 h-4 text-textSecondary" />}
              </button>

              {promptPreviewOpen && (
                <div className="space-y-3 pt-4 animate-fadeIn">
                  <p className="text-[10px] text-textSecondary leading-normal">
                    This prompt is auto-compiled using your business profile, campaign goals, design aesthetics, and selected asset arrangements.
                  </p>
                  <textarea
                    value={optimizedPrompt}
                    onChange={(e) => setOptimizedPrompt(e.target.value)}
                    placeholder="Click 'Build/Optimize' to preview compiled image generator prompt..."
                    className="w-full bg-sectionBackground border border-border focus:border-primary rounded-lg p-2.5 text-xs outline-none h-24 text-textPrimary"
                  />
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={handleOptimizePrompt}
                      disabled={optimizingPrompt}
                      className="bg-primary/10 hover:bg-primary/20 text-primary text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all"
                    >
                      {optimizingPrompt ? (
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <RefreshCw className="w-3.5 h-3.5" />
                      )}
                      Compile & Optimize Prompt
                    </button>
                  </div>
                </div>
              )}
            </Card>

            {/* 6. Generate Trigger */}
            <button
              onClick={handleGeneratePosterImage}
              disabled={generatingPoster || loading}
              className="w-full py-4 bg-gradient-to-r from-primary to-accent hover:from-primaryHover hover:to-accent text-white font-extrabold rounded-2xl flex items-center justify-center gap-2 shadow-premium hover:shadow-premiumHover transition-all disabled:opacity-60 text-sm"
            >
              {generatingPoster ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Generating AI Poster...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 animate-bounce" />
                  Generate AI Poster
                </>
              )}
            </button>
          </div>

          {/* Right Column: Premium Interactive Canvas Display */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <Card className="bg-surface border border-border p-5 shadow-glass w-full flex flex-col items-center">
              <div className="flex justify-between items-center w-full mb-4 px-1 text-xs border-b border-border pb-2.5">
                <span className="font-bold text-textPrimary">Composited AI Poster Canvas</span>
                <span className="bg-emerald-500/10 text-emerald-600 font-bold px-2.5 py-0.5 rounded-lg uppercase tracking-wider text-[9px] border border-emerald-500/15">Active Session</span>
              </div>

              {generatingPoster ? (
                <div className="py-20 px-6 text-center max-w-sm space-y-4 animate-pulse">
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
                    <RefreshCw className="w-8 h-8 text-primary animate-spin" />
                  </div>
                  <h4 className="text-sm font-bold text-textPrimary">AI Engine Generating Poster...</h4>
                  <p className="text-xs text-textSecondary leading-relaxed font-semibold text-primary">
                    {generationStage}
                  </p>
                  <div className="w-full bg-border h-1.5 rounded-full overflow-hidden">
                    <div className="bg-primary h-full rounded-full animate-pulse" style={{ width: '70%' }}></div>
                  </div>
                </div>
              ) : generationError ? (
                <div className="py-16 px-6 text-center max-w-sm space-y-4">
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-red-500/10 flex items-center justify-center border border-red-500/20">
                    <X className="w-8 h-8 text-red-500" />
                  </div>
                  <h4 className="text-sm font-bold text-red-600">Generation Failed</h4>
                  <p className="text-xs text-textSecondary bg-red-50/50 dark:bg-red-950/20 border border-red-200/45 p-3 rounded-xl leading-relaxed text-left font-mono whitespace-pre-wrap select-all">
                    {generationError}
                  </p>
                  <button
                    onClick={handleGeneratePosterImage}
                    className="px-4 py-2 bg-primary hover:bg-primaryHover text-white text-xs font-bold rounded-xl shadow transition-all flex items-center gap-1.5 mx-auto"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Retry Generation
                  </button>
                </div>
              ) : generatedPoster ? (
                <div className="w-full flex flex-col items-center gap-4">
                  {/* Real-time Dynamic Canvas */}
                  <div className="relative w-full aspect-square max-w-[540px] rounded-2xl overflow-hidden shadow-premium bg-slate-50 border border-border flex items-center justify-center">
                    <canvas 
                      ref={canvasRef} 
                      className="w-full h-full object-contain"
                    />
                    {canvasError && (
                      <div className="absolute inset-0 bg-black/80 flex items-center justify-center text-center p-6 text-xs text-danger font-semibold">
                        {canvasError}
                      </div>
                    )}
                  </div>

                  {/* Smart Info Card */}
                  <div className="w-full max-w-[540px] bg-sectionBackground border border-border rounded-xl p-4 space-y-2 text-xs">
                    <div className="flex justify-between text-[10px] text-textSecondary font-bold uppercase tracking-wider">
                      <span>Created Time</span>
                      <span>{new Date(generatedPoster.createdAt).toLocaleString()}</span>
                    </div>
                    <div className="text-textPrimary leading-normal">
                      <span className="font-bold text-textSecondary block uppercase tracking-wider text-[10px] mb-1">Prompt Used:</span>
                      <p className="bg-surface border border-border p-2.5 rounded-lg text-textSecondary italic select-all">{generatedPoster.prompt}</p>
                    </div>
                  </div>

                  {/* Actions Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-2 w-full max-w-[540px] pt-2">
                    <button
                      onClick={() => handleDownloadAiPoster('png')}
                      className="flex items-center justify-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold py-2.5 px-1.5 rounded-xl transition-all shadow-sm"
                    >
                      <Download className="w-4 h-4" />
                      PNG
                    </button>
                    <button
                      onClick={() => handleDownloadAiPoster('jpg')}
                      className="flex items-center justify-center gap-1 bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold py-2.5 px-1.5 rounded-xl transition-all shadow-sm"
                    >
                      <Download className="w-4 h-4" />
                      JPG
                    </button>
                    <button
                      onClick={() => handleDownloadAiPoster('pdf')}
                      className="flex items-center justify-center gap-1 bg-rose-600 hover:bg-rose-700 text-white text-[10px] font-bold py-2.5 px-1.5 rounded-xl transition-all shadow-sm"
                    >
                      <Download className="w-4 h-4" />
                      PDF
                    </button>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(generatedPoster.prompt);
                        dispatch(addToast({ type: 'success', message: 'Prompt copied to clipboard!' }));
                      }}
                      className="flex items-center justify-center gap-1 bg-slate-600 hover:bg-slate-700 text-white text-[10px] font-bold py-2.5 px-1.5 rounded-xl transition-all shadow-sm"
                    >
                      <Copy className="w-4 h-4" />
                      Copy
                    </button>
                    <button
                      onClick={handleGeneratePosterImage}
                      disabled={generatingPoster}
                      className="flex items-center justify-center gap-1 bg-primary hover:bg-primaryHover text-white text-[10px] font-bold py-2.5 px-1.5 rounded-xl transition-all shadow-sm disabled:opacity-60"
                    >
                      <RefreshCw className="w-4 h-4" />
                      Re-Gen
                    </button>
                  </div>

                  <div className="w-full max-w-[540px] border-t border-border mt-3 pt-4">
                    <Button variant="primary" onClick={handleSaveAiPoster} disabled={loading} className="w-full">
                      {loading ? 'Saving Design...' : 'Save AI Poster to Gallery'}
                    </Button>
                  </div>
                </div>
              ) : (
                /* Empty state / Prompt action call */
                <div className="py-24 px-6 text-center max-w-sm space-y-4">
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-primary/5 flex items-center justify-center border border-primary/10">
                    <Sparkles className="w-8 h-8 text-primary animate-pulse" />
                  </div>
                  <h4 className="text-sm font-bold text-textPrimary">Your Generated Poster Will Appear Here</h4>
                  <p className="text-xs text-textSecondary leading-relaxed">
                    Provide a description, customize your business text details, generate matching content, and hit the generate button to create your custom design.
                  </p>
                </div>
              )}
            </Card>

            {/* INTEGRATIONS PIPELINE INTEGRATION */}
            {generatedPoster && (
              <Card className="bg-surface border border-border p-5 shadow-glass w-full max-w-lg mx-auto space-y-3.5">
                <p className="text-[10px] text-textSecondary text-center uppercase tracking-wider font-semibold">Integrations Pipeline Workflow</p>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => navigate('/ads', { 
                      state: { 
                        campaignId: selectedCampaignId,
                        posterTitle: headline || 'AI Poster',
                        offer: promoOffer,
                        cta: ctaTextAi
                      } 
                    })}
                    className="bg-primary/5 hover:bg-primary/10 border border-primary/20 text-primary text-xs font-bold py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-all"
                  >
                    🚀 Send to Ads Manager
                  </button>
                  <button
                    onClick={() => navigate('/scheduler', { 
                      state: { 
                        campaignId: selectedCampaignId,
                        posterTitle: headline || 'AI Poster',
                        captionText: `${headline} - ${subHeading} \n\nGet our ${promoOffer}! \n\n${ctaTextAi}`
                      } 
                    })}
                    className="bg-primary/5 hover:bg-primary/10 border border-primary/20 text-primary text-xs font-bold py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-all"
                  >
                    📅 Send to Scheduler
                  </button>
                </div>
              </Card>
            )}
          </div>
        </div>
      ) : (
        /* ==================== ORIGINAL TEMPLATE DESIGNER VIEW ==================== */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Side: Campaign configuration and selection */}
          <div className="lg:col-span-4 space-y-6">
            <Card className="bg-surface border border-border p-5 shadow-glass space-y-5">
              <div className="flex items-center gap-2 border-b border-border pb-2.5">
                <Sliders className="w-5 h-5 text-primary" />
                <h3 className="text-sm font-bold text-textPrimary">
                  {profileMode === 'business' ? 'Business Profile Source' : 'Custom Business Details'}
                </h3>
              </div>

              {profileMode === 'business' ? (
                <>
                  {/* Business selection */}
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-textSecondary uppercase">1. Active Business Profile</label>
                    <div className="w-full bg-sectionBackground border border-border rounded-lg px-3 py-2 text-xs font-semibold text-textPrimary">
                      {selectedBusiness?.name || 'No business selected'}
                    </div>
                  </div>

                  {/* Campaign Selection dropdown */}
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-textSecondary uppercase">2. Reuse Existing AI Campaign</label>
                    <select
                      value={selectedCampaignId}
                      onChange={handleCampaignChange}
                      className="w-full bg-sectionBackground border border-border rounded-lg px-3 py-1.5 text-xs text-textPrimary outline-none focus:border-primary"
                    >
                      <option value="">-- Choose Campaign (No Autofill) --</option>
                      {campaigns.map((c) => (
                        <option key={c.id} value={c.id}>{c.campaignName} ({c.businessCategory})</option>
                      ))}
                    </select>
                  </div>
                </>
              ) : (
                /* Custom Details mode — freeform input fields */
                <div className="space-y-3">
                  <Input label="Poster Title *" placeholder="e.g. Diwali Grand Sale 2025" value={posterTitle} onChange={(e) => setPosterTitle(e.target.value)} />
                  <div className="grid grid-cols-2 gap-3">
                    <Input label="Business Name *" placeholder="e.g. Raj Bakery" value={bizName} onChange={(e) => setBizName(e.target.value)} />
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-textSecondary">Category</label>
                      <input
                        type="text"
                        placeholder="e.g. Bakery, Salon..."
                        className="w-full bg-sectionBackground border border-border focus:border-primary rounded-lg px-2.5 py-1.5 text-xs outline-none"
                        onChange={(e) => {}}
                      />
                    </div>
                  </div>
                  <Input label="Offer Text" placeholder="e.g. 30% OFF This Weekend" value={offerText} onChange={(e) => setOfferText(e.target.value)} />
                  <Input label="CTA Button" placeholder="e.g. Call Now to Book" value={ctaText} onChange={(e) => setCtaText(e.target.value)} />
                  <div className="grid grid-cols-2 gap-3">
                    <Input label="Phone" placeholder="+91 98765 43210" value={phone} onChange={(e) => setPhone(e.target.value)} />
                    <Input label="Website" placeholder="www.business.com" value={website} onChange={(e) => setWebsite(e.target.value)} />
                  </div>
                  <Input label="Address" placeholder="123 Main Street, City" value={address} onChange={(e) => setAddress(e.target.value)} />
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-textSecondary">Slogan Tagline</label>
                    <textarea
                      value={taglineText}
                      onChange={(e) => setTaglineText(e.target.value)}
                      placeholder="Your brand slogan here..."
                      className="w-full bg-sectionBackground border border-border focus:border-primary rounded-lg p-2.5 text-xs outline-none h-14 resize-none"
                    />
                  </div>
                </div>
              )}
            </Card>

            {/* Overlays Editor - only show in business mode since custom mode has it in left panel */}
            {profileMode === 'business' && (
            <Card className="bg-surface border border-border p-5 shadow-glass space-y-4">
              <div className="flex items-center gap-2 border-b border-border pb-2.5">
                <Palette className="w-5 h-5 text-primary" />
                <h3 className="text-sm font-bold text-textPrimary">Customize Layout Details</h3>
              </div>

              <Input label="Poster Title *" value={posterTitle} onChange={(e) => setPosterTitle(e.target.value)} />
              <Input label="Business Name Brand" value={bizName} onChange={(e) => setBizName(e.target.value)} />
              <Input label="Offer Banner Text" value={offerText} onChange={(e) => setOfferText(e.target.value)} />
              
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-textSecondary">Slogan Tagline</label>
                <textarea
                  value={taglineText}
                  onChange={(e) => setTaglineText(e.target.value)}
                  className="w-full bg-sectionBackground border border-border focus:border-primary rounded-lg p-2.5 text-xs outline-none h-16 resize-none"
                />
              </div>

              <Input label="CTA Button" value={ctaText} onChange={(e) => setCtaText(e.target.value)} />

              <div className="grid grid-cols-2 gap-3 pt-2">
                <Input label="Contact Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
                <Input label="Website Address" value={website} onChange={(e) => setWebsite(e.target.value)} />
              </div>
            </Card>
            )}
          </div>

          {/* Center: Live interactive poster display */}
          <div className="lg:col-span-5 flex flex-col items-center gap-6">
            <Card className="bg-surface border border-border p-4 shadow-glass w-full max-w-[500px] flex flex-col items-center">
              <div className="flex justify-between items-center w-full mb-3 px-1 text-xs">
                <span className="font-bold text-textSecondary">Poster Preview Canvas</span>
                <span className="bg-primary/10 text-primary font-bold px-2 py-0.5 rounded uppercase tracking-wider text-[9px]">{activeTemplate.theme}</span>
              </div>

              {/* Visual Canvas Box */}
              <div 
                id="poster-canvas"
                style={{ background: activeTemplate.bg }}
                className="w-full aspect-square rounded-2xl p-8 flex flex-col justify-between text-center relative overflow-hidden text-white shadow-premium"
              >
                {/* Badge */}
                <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md border border-white/35 rounded-full px-3 py-1 text-[9px] font-bold uppercase tracking-wider">
                  {activeTemplate.category}
                </div>

                {/* Header */}
                <div>
                  <div className="text-4xl mb-1">{activeTemplate.icon}</div>
                  <h2 className="text-xl font-extrabold uppercase tracking-widest">{bizName}</h2>
                </div>

                {/* Middle BOGO offer */}
                <div className="bg-white/10 backdrop-blur-sm border-2 border-dashed border-white/40 p-4 rounded-xl my-4 flex items-center justify-center">
                  <span className="text-lg font-black tracking-wide uppercase">{offerText}</span>
                </div>

                {/* CTA & Taglines */}
                <div>
                  <p className="text-xs font-serif italic opacity-90 max-w-xs mx-auto">"{taglineText}"</p>
                  <div className="inline-block bg-white text-gray-900 font-bold uppercase text-[10px] tracking-wider px-5 py-2.5 rounded-full mt-4 shadow-premium">
                    {ctaText}
                  </div>
                </div>

                {/* Footer info */}
                <div className="border-t border-white/20 pt-3 mt-4 text-[9px] opacity-80 flex justify-between">
                  <span>📞 {phone}</span>
                  <span>📍 {address}</span>
                  <span>🌐 {website}</span>
                </div>
              </div>

              {/* Workspace Operations triggers */}
              <div className="grid grid-cols-3 gap-2 w-full mt-6">
                <Button variant="primary" icon={Download} onClick={handlePrintPoster}>PDF / Print</Button>
                <button
                  onClick={() => handleDownloadImage('png')}
                  disabled={exportingImg}
                  className="flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-2 rounded-xl transition-all disabled:opacity-60"
                >
                  <Download className="w-3.5 h-3.5" />
                  PNG
                </button>
                <button
                  onClick={() => handleDownloadImage('jpg')}
                  disabled={exportingImg}
                  className="flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3 py-2 rounded-xl transition-all disabled:opacity-60"
                >
                  <Download className="w-3.5 h-3.5" />
                  JPG
                </button>
              </div>
              <div className="w-full mt-2">
                <Button variant="secondary" onClick={handleSavePoster} className="w-full">Save Poster Design</Button>
              </div>

              {/* Campaign Pipeline Integration Actions */}
              <div className="border-t border-border mt-5 pt-4 w-full space-y-3">
                <p className="text-[10px] text-textSecondary text-center uppercase tracking-wider font-semibold">Integrations Pipeline Workflow</p>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => navigate('/ads', { 
                      state: { 
                        campaignId: selectedCampaignId,
                        posterTitle: posterTitle,
                        offer: offerText,
                        cta: ctaText
                      } 
                    })}
                    className="bg-primary/5 hover:bg-primary/10 border border-primary/20 text-primary text-xs font-bold py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-all"
                  >
                    🚀 Send to Ads Manager
                  </button>
                  <button
                    onClick={() => navigate('/scheduler', { 
                      state: { 
                        campaignId: selectedCampaignId,
                        posterTitle: posterTitle,
                        captionText: `${taglineText} \n\nGet our ${offerText}! \n\n${ctaText}`
                      } 
                    })}
                    className="bg-primary/5 hover:bg-primary/10 border border-primary/20 text-primary text-xs font-bold py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-all"
                  >
                    📅 Send to Scheduler
                  </button>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Side: Template library selection */}
          <div className="lg:col-span-3 space-y-6">
            <Card className="bg-surface border border-white/[0.06] p-5 shadow-glass space-y-4 relative overflow-hidden">
              <div className="flex justify-between items-center border-b border-white/[0.06] pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-white">Templates Library</span>
                  <span className="bg-purple-500/10 border border-purple-500/20 text-purple-400 px-2 py-0.5 rounded-full text-[9px] font-black">{filteredTemplates.length}</span>
                </div>
              </div>

              {/* Tabs for filters */}
              <div className="flex border-b border-white/[0.04] pb-2 text-[10px] font-black text-textSecondary uppercase tracking-wider gap-4 overflow-x-auto no-scrollbar">
                {[
                  { id: 'all', label: 'All Layouts' },
                  { id: 'recent', label: 'Recently Used' },
                  { id: 'recommended', label: 'AI Recommended' },
                  { id: 'favorites', label: 'Favorites' }
                ].map(tab => {
                  const isSelected = activeLibraryTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => {
                        setActiveLibraryTab(tab.id);
                        setTemplateCategory('All');
                      }}
                      className={`pb-1 transition-all shrink-0 ${
                        isSelected 
                          ? 'text-purple-400 border-b-2 border-purple-500 font-black' 
                          : 'hover:text-white'
                      }`}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3.5 top-2.5 w-3.5 h-3.5 text-textSecondary" />
                <input
                  type="text"
                  placeholder="Search templates by niche or tag..."
                  value={templateSearch}
                  onChange={(e) => setTemplateSearch(e.target.value)}
                  className="w-full bg-white/[0.04] border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder:text-textSecondary/40 outline-none focus:border-purple-500/40 focus:ring-1 focus:ring-purple-500/20 transition-all"
                />
              </div>

              {/* Categories filter */}
              <div className="flex gap-1 overflow-x-auto pb-1.5 max-w-full text-[9px] no-scrollbar">
                {TEMPLATE_CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setTemplateCategory(cat)}
                    className={`px-2.5 py-1 rounded-lg font-bold shrink-0 transition-all border ${
                      templateCategory === cat
                        ? 'bg-purple-500/10 border-purple-500/30 text-purple-400 font-extrabold shadow-[0_0_8px_rgba(124,58,237,0.1)]'
                        : 'bg-white/[0.02] border-white/5 text-textSecondary hover:border-white/15 hover:text-white'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Templates List Grid */}
              <div className="grid grid-cols-2 gap-3 max-h-[520px] overflow-y-auto pr-1 select-none">
                {filteredTemplates.length === 0 ? (
                  <div className="col-span-2 py-8 text-center text-xs text-textSecondary">
                    No templates found in this view.
                  </div>
                ) : (
                  filteredTemplates.map((tpl) => {
                    const isFavorite = favoriteTemplates.includes(tpl.id);
                    const active = activeTemplate.id === tpl.id;
                    return (
                      <div
                        key={tpl.id}
                        style={{ background: tpl.bg }}
                        className={`p-3.5 rounded-2xl text-white cursor-pointer relative transition-all duration-300 border-2 overflow-hidden group min-h-[120px] flex flex-col justify-between ${
                          active ? 'border-purple-500 shadow-[0_0_15px_rgba(124,58,237,0.2)]' : 'border-transparent'
                        }`}
                      >
                        {/* Custom Badges */}
                        <div className="absolute top-2 left-2 flex gap-1 z-10">
                          {tpl.isTrending && (
                            <span className="bg-amber-500 text-[8px] font-black uppercase tracking-wider text-black px-1.5 py-0.5 rounded">
                              Trending
                            </span>
                          )}
                          {tpl.isNew && (
                            <span className="bg-purple-500 text-[8px] font-black uppercase tracking-wider text-white px-1.5 py-0.5 rounded">
                              New
                            </span>
                          )}
                          {tpl.isPremium && (
                            <span className="bg-yellow-500 text-[8px] font-black uppercase tracking-wider text-black px-1.5 py-0.5 rounded">
                              Pro
                            </span>
                          )}
                        </div>

                        <div className="flex justify-end items-start w-full relative z-10">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFavTemplate(tpl.id);
                            }}
                            className="text-white/60 hover:text-white transition-all bg-black/40 hover:bg-black/60 p-1.5 rounded-full"
                          >
                            <Heart className={`w-3 h-3 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                          </button>
                        </div>

                        <div className="mt-4 relative z-10">
                          <span className="text-xl block mb-1">{tpl.icon}</span>
                          <h4 className="text-[10px] font-black leading-tight tracking-tight">{tpl.title}</h4>
                          <div className="flex justify-between items-center mt-2 text-[8px] opacity-80">
                            <span className="bg-white/10 px-1.5 py-0.5 rounded">{tpl.category}</span>
                          </div>
                        </div>

                        {/* Hover Overlay Preview */}
                        <div className="absolute inset-0 bg-black/85 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-center items-center gap-1.5 p-3 text-center z-20">
                          <button
                            type="button"
                            onClick={() => handleSelectTemplate(tpl)}
                            className="bg-purple-600 hover:bg-purple-700 text-white font-bold text-[9px] uppercase tracking-wider px-3 py-1.5 rounded-lg transition-all shadow-[0_0_10px_rgba(124,58,237,0.3)] w-full"
                          >
                            Use Template
                          </button>
                          <span className="text-[7px] text-textSecondary uppercase tracking-widest">{tpl.theme}</span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* Manual Upload Poster Modal */}
      <Modal isOpen={isUploadOpen} onClose={() => setIsUploadOpen(false)} title="Upload Poster Image Asset">
        <form onSubmit={handleManualUpload} className="flex flex-col gap-4">
          <Input label="Poster Title *" placeholder="e.g. Grand Sale Flyer" value={uploadTitle} onChange={(e) => setUploadTitle(e.target.value)} required />
          
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-textSecondary">Poster Image *</label>
            {uploadUrl ? (
              <div className="relative h-48 w-full border border-white/[0.06] rounded-xl bg-white/[0.02] overflow-hidden">
                <img src={uploadUrl} alt="preview" className="w-full h-full object-contain" />
                <button
                  type="button"
                  onClick={() => setUploadUrl('')}
                  className="absolute top-3 right-3 p-1.5 rounded-full bg-black/60 text-white hover:bg-black/85 transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-center border-2 border-dashed border-white/10 hover:border-purple-500/35 rounded-xl p-8 transition-all relative cursor-pointer bg-white/[0.01]">
                <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleImageChange} required />
                <div className="flex flex-col items-center gap-1.5 text-textSecondary">
                  <Camera className="w-6 h-6 text-purple-400" />
                  <span className="text-xs font-semibold">Drag and drop file or click to select</span>
                  <span className="text-[10px] text-textSecondary/40">Format: PNG, JPG, or SVG</span>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 mt-4 border-t border-white/[0.06] pt-4">
            <Button type="button" variant="outline" onClick={() => setIsUploadOpen(false)}>Cancel</Button>
            <Button type="submit">Upload Asset</Button>
          </div>
        </form>
      </Modal>

      {/* Poster Purchase Resolution Modal */}
      <Modal 
        isOpen={posterPurchaseModalOpen} 
        onClose={() => setPosterPurchaseModalOpen(false)} 
        title={paymentStep === 'select' ? "Unlock High-Resolution Export" : paymentStep === 'processing' ? "Processing Payment" : "Success"}
      >
        {paymentStep === 'select' && (
          <div className="flex flex-col gap-5">
            <p className="text-xs text-textSecondary leading-relaxed">
              Select the export quality and license for your poster design. Once purchased, you can download this design at the chosen resolution as many times as you like.
            </p>
            
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: 'standard', title: 'Standard', res: '1024 × 1024 px', price: 199, desc: 'Watermark included. Personal branding use.', badge: 'Basic' },
                { id: 'hd', title: 'High Definition', res: '1536 × 1536 px', price: 399, desc: 'Watermark removed. Social media usage license.', badge: 'Popular', isPopular: true },
                { id: 'premium', title: 'Ultra Premium', res: '2048 × 2048 px', price: 699, desc: 'Watermark removed. Print ready, commercial use.', badge: 'Pro' },
                { id: 'ultra', title: 'Commercial License', res: '2048 × 2048 px', price: 999, desc: 'Watermark removed. Full reseller/agency commercial license.', badge: 'Enterprise' }
              ].map(tier => {
                const isSelected = selectedResolution === tier.id;
                return (
                  <div
                    key={tier.id}
                    onClick={() => setSelectedResolution(tier.id)}
                    className={`p-4 rounded-2xl border cursor-pointer relative flex flex-col justify-between transition-all duration-200 ${
                      isSelected 
                        ? 'border-purple-500 bg-purple-500/10 shadow-[0_0_15px_rgba(124,58,237,0.15)] ring-1 ring-purple-500/30' 
                        : 'border-white/10 bg-white/[0.02] hover:border-white/20'
                    }`}
                  >
                    {tier.isPopular && (
                      <span className="absolute -top-2.5 right-3 bg-purple-600 text-[8px] font-black uppercase tracking-wider text-white px-2 py-0.5 rounded-full shadow-[0_0_10px_rgba(124,58,237,0.4)]">
                        Best Choice
                      </span>
                    )}
                    <div>
                      <div className="flex justify-between items-start">
                        <span className="text-[10px] text-textSecondary uppercase font-black tracking-wider">{tier.badge}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-purple-400" />}
                      </div>
                      <h4 className="text-xs font-black text-white mt-1">{tier.title}</h4>
                      <p className="text-[10px] text-textSecondary font-semibold mt-0.5">{tier.res}</p>
                      <p className="text-[9px] text-textSecondary mt-2 leading-relaxed font-light">{tier.desc}</p>
                    </div>
                    <div className="mt-4 text-base font-black text-white flex items-baseline gap-0.5 border-t border-white/[0.04] pt-2.5">
                      <span className="text-[10px] font-bold text-purple-400">₹</span>
                      {tier.price}
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-3.5">
              <h5 className="text-[10px] font-bold uppercase tracking-wider text-textSecondary mb-2">Features Comparison</h5>
              <div className="grid grid-cols-2 gap-2 text-[9px] text-textSecondary font-medium">
                <div className="flex items-center gap-1.5"><Check className="w-3 h-3 text-purple-400" /> Vector quality components</div>
                <div className="flex items-center gap-1.5"><Check className="w-3 h-3 text-purple-400" /> Removable branding logo</div>
                <div className="flex items-center gap-1.5"><Check className="w-3 h-3 text-purple-400" /> High-speed priority queue</div>
                <div className="flex items-center gap-1.5"><Check className="w-3 h-3 text-purple-400" /> Lifetime unlimited downloads</div>
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-2 border-t border-white/[0.06] pt-4">
              <Button type="button" variant="outline" onClick={() => setPosterPurchaseModalOpen(false)}>Cancel</Button>
              <button
                onClick={handleProceedToPayment}
                className="bg-primary hover:bg-primaryHover text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-[0_0_20px_rgba(124,58,237,0.3)] transition-all flex items-center gap-2"
              >
                <CreditCard className="w-4 h-4" />
                Proceed to Payment (₹{[199, 399, 699, 999][['standard', 'hd', 'premium', 'ultra'].indexOf(selectedResolution)]})
              </button>
            </div>
          </div>
        )}
        
        {paymentStep === 'processing' && (
          <div className="flex flex-col items-center justify-center py-12 gap-4 text-center">
            <div className="w-12 h-12 rounded-full border-2 border-purple-500/20 border-t-purple-500 animate-spin flex items-center justify-center mb-2" />
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Securing Gateway Connection...</h4>
            <p className="text-xs text-textSecondary max-w-xs leading-relaxed font-light">
              We are connecting to UPI / Card payments network to authorize the transaction. Do not close this window.
            </p>
            <div className="flex items-center gap-1.5 text-[10px] text-textSecondary mt-2">
              <Lock className="w-3 h-3 text-emerald-400" /> 256-bit Secure TLS Encryption Active
            </div>
          </div>
        )}
        
        {paymentStep === 'success' && (
          <div className="flex flex-col items-center justify-center py-12 gap-4 text-center">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mb-2 shadow-[0_0_15px_rgba(16,185,129,0.15)] animate-bounce">
              <Check className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Payment Authorized!</h4>
            <p className="text-xs text-textSecondary max-w-xs leading-relaxed font-light">
              Your high-resolution poster license has been successfully unlocked. Initiating high-speed export download...
            </p>
          </div>
        )}
      </Modal>

      {/* Premium Pricing Plan Modal */}
      <PremiumPricingModal 
        isOpen={pricingModalOpen} 
        onClose={() => setPricingModalOpen(false)} 
        onUpgradeSuccess={(plan) => {
          setActivePlan(plan);
          dispatch(addToast({ type: 'success', message: `Successfully upgraded to ${plan} plan!` }));
          if (generatedPoster?.imageUrl) {
            setTimeout(() => drawPoster(), 100);
          }
        }}
      />
    </div>
  );
};

export default Posters;
