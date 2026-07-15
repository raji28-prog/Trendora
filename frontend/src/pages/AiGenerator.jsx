import React, { useState, useEffect } from 'react';
import api from '../services/api';
import {
  Sparkles,
  Copy,
  Check,
  Building,
  Target,
  Users,
  Compass,
  MessageSquare,
  Instagram,
  Facebook,
  Linkedin,
  Twitter,
  FileText,
  Volume2,
  Share2,
  Search,
  Zap,
  Download,
  Trash2,
  Plus,
  X,
  ChevronDown,
  ChevronUp,
  Printer,
  RefreshCw,
  FileCode,
  History,
  BarChart3,
  Info,
  Globe,
  Calendar,
  Percent,
  AlignLeft,
  Smile,
  Sliders,
  Award,
  Star,
  Archive,
  Eye,
  Edit2,
  CheckSquare,
  ArrowRight
} from 'lucide-react';

const ALLOWED_CATEGORIES = [
  'Bakery', 'Restaurant', 'Cafe', 'Hotel', 'Resort', 'Boutique', 'Salon', 'Spa', 'Gym', 
  'Fitness Center', 'Hospital', 'Clinic', 'Dental Clinic', 'Pharmacy', 'Medical Shop', 'Veterinary',
  'Automobile Service', 'Car Wash', 'Bike Service', 'Real Estate', 'Construction', 'Interior Design', 
  'Electronics Store', 'Furniture Store', 'Hardware Store', 'Mobile Shop', 'Computer Shop', 'Grocery', 
  'Supermarket', 'Jewelry', 'Jewellery', 'Pet Shop', 'Flower Shop', 'Photography', 'Event Management', 
  'Travel Agency', 'Printing Shop', 'Tailor', 'Laundry', 'Cleaning Service', 
  'Digital Marketing Agency', 'Other Local Business', 'Tea Shop', 'Juice Shop', 'Fast Food', 
  'Home Services', 'Education Center', 'Fitness', 'Sports Shop', 'Stationery', 'Cake Shop'
];

const TARGET_AUDIENCES = [
  'Students', 'Families', 'Women', 'Men', 'Kids', 'Professionals', 'Senior Citizens', 'Tourists', 'Everyone', 'Custom Audience'
];

const OBJECTIVES = [
  { id: 'Increase Sales', label: '📈 Increase Sales' },
  { id: 'Brand Awareness', label: '📣 Brand Awareness' },
  { id: 'Festival Promotion', label: '✨ Festival Promotion' },
  { id: 'Grand Opening', label: '🎉 Grand Opening' },
  { id: 'Lead Generation', label: '⚡ Lead Generation' },
  { id: 'Seasonal Offer', label: '🍁 Seasonal Offer' },
  { id: 'Weekend Sale', label: '🎯 Weekend Sale' },
  { id: 'Flash Sale', label: '⚡ Flash Sale' },
  { id: 'Customer Retention', label: '❤️ Customer Retention' },
  { id: 'Website Traffic', label: '🌐 Website Traffic' },
  { id: 'Appointment Booking', label: '📅 Appointment Booking' },
  { id: 'Membership Promotion', label: '🎟️ Membership Promotion' },
  { id: 'Product Launch', label: '🚀 Product Launch' },
  { id: 'Service Promotion', label: '💼 Service Promotion' },
  { id: 'Clearance Sale', label: '🔥 Clearance Sale' },
  { id: 'Custom Goal', label: '⚙️ Custom Goal' }
];

import { useSelectedBusiness } from '../store/useSelectedBusiness.js';

const TONES = [
  { id: 'Friendly', label: '😊 Friendly' },
  { id: 'Professional', label: '👔 Professional' },
  { id: 'Luxury', label: '✨ Luxury' },
  { id: 'Premium', label: '💎 Premium' },
  { id: 'Funny', label: '🤪 Funny' },
  { id: 'Festive', label: '🎉 Festive' },
  { id: 'Sales', label: '🎯 Sales' },
  { id: 'Minimal', label: '📄 Minimal' },
  { id: 'Trustworthy', label: '🤝 Trustworthy' },
  { id: 'Emotional', label: '❤️ Emotional' }
];

const PLATFORMS_LIST = [
  { id: 'Instagram', label: 'Instagram', icon: Instagram },
  { id: 'Facebook', label: 'Facebook', icon: Facebook },
  { id: 'WhatsApp', label: 'WhatsApp', icon: MessageSquare },
  { id: 'Google Business Profile', label: 'Google Business', icon: Globe },
  { id: 'LinkedIn', label: 'LinkedIn', icon: Linkedin },
  { id: 'Twitter(X)', label: 'Twitter(X)', icon: Twitter }
];

const LOADING_MESSAGES = [
  'Analyzing niche demographics & business profile...',
  'Extracting search-volume benchmarks for local SEO...',
  'Compiling platform-specific creative copy packs...',
  'Synthesizing campaign taglines & custom CTA variants...',
  'Calculating engagement potential scorecard metrics...',
  'Crystallizing future growth & email marketing briefs...'
];

export default function AiGenerator() {
  const { selectedBusiness } = useSelectedBusiness();
  const [activeTab, setActiveTab] = useState('studio');

  // Generate Options state
  const [generateOptions, setGenerateOptions] = useState({
    caption: true,
    hashtags: true,
    posterPrompt: true,
    cta: false,
    seoMetaDescription: false,
    seoSuggestions: false,
    keywords: false,
    localSeo: false,
    gbpKeywords: false,
    trendingSearches: false,
  });

  // Collapsible offer details state
  const [showOfferDetails, setShowOfferDetails] = useState(false);

  // Input states
  const [campaignName, setCampaignName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [businessCategory, setBusinessCategory] = useState('');
  const [targetAudience, setTargetAudience] = useState('Everyone');
  const [customAudience, setCustomAudience] = useState('');
  const [marketingObjective, setMarketingObjective] = useState('Increase Sales');
  const [tone, setTone] = useState('Friendly');
  const [language, setLanguage] = useState('English');
  const [platforms, setPlatforms] = useState(['Instagram', 'Facebook']);
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [country, setCountry] = useState('');
  const [duration, setDuration] = useState('1 Week');
  const [customDuration, setCustomDuration] = useState('');

  // Notion-style SearchableSelect popup dropdown component
  const SearchableSelect = ({ label, value, options, onChange, placeholder, icon: Icon, isMulti = false }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [activeIndex, setActiveIndex] = useState(0);

    const filtered = options.filter(opt => {
      const text = typeof opt === 'string' ? opt : (opt.label || opt.id);
      return text.toLowerCase().includes(search.toLowerCase());
    });

    const handleKeyDown = (e) => {
      if (!isOpen) return;
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex(prev => (prev + 1) % Math.max(1, filtered.length));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex(prev => (prev - 1 + filtered.length) % Math.max(1, filtered.length));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filtered[activeIndex]) {
          handleSelect(filtered[activeIndex]);
        }
      } else if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    const handleSelect = (opt) => {
      const optVal = typeof opt === 'string' ? opt : opt.id;
      if (isMulti) {
        const current = Array.isArray(value) ? value : [];
        if (current.includes(optVal)) {
          onChange(current.filter(v => v !== optVal));
        } else {
          onChange([...current, optVal]);
        }
      } else {
        onChange(optVal);
        setIsOpen(false);
      }
      setSearch('');
    };

    useEffect(() => {
      if (!isOpen) return;
      const clickOutside = () => setIsOpen(false);
      window.addEventListener('click', clickOutside);
      return () => window.removeEventListener('click', clickOutside);
    }, [isOpen]);

    const displayValue = () => {
      if (isMulti) {
        return Array.isArray(value) && value.length > 0 ? value.join(', ') : 'Select...';
      }
      const matched = options.find(opt => (typeof opt === 'string' ? opt : opt.id) === value);
      return matched ? (typeof matched === 'string' ? matched : matched.label) : value || 'Select...';
    };

    return (
      <div className="relative w-full" onClick={e => e.stopPropagation()}>
        <label className="block text-[10px] font-extrabold tracking-wider text-textSecondary uppercase mb-1">{label}</label>
        <button
          type="button"
          onClick={() => { setIsOpen(!isOpen); setSearch(''); setActiveIndex(0); }}
          className="w-full bg-sectionBackground border border-border hover:border-primary/40 rounded-xl px-3 py-1.5 text-left text-xs text-textPrimary flex items-center justify-between outline-none transition-all"
        >
          <span className="flex items-center gap-1.5 truncate">
            {Icon && <Icon className="w-3.5 h-3.5 text-primary shrink-0" />}
            <span className="truncate">{displayValue()}</span>
          </span>
          <ChevronDown className={`w-3.5 h-3.5 text-textSecondary transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <div className="absolute left-0 right-0 mt-1 bg-surface border border-border rounded-xl shadow-premium z-50 overflow-hidden flex flex-col max-h-60">
            <div className="p-2 border-b border-border bg-sectionBackground/30">
              <input
                type="text"
                autoFocus
                placeholder={placeholder || "Search options..."}
                value={search}
                onChange={e => { setSearch(e.target.value); setActiveIndex(0); }}
                onKeyDown={handleKeyDown}
                className="w-full bg-surface border border-border focus:border-primary/40 rounded-lg px-2 py-1 text-xs text-textPrimary outline-none"
              />
            </div>
            <div className="overflow-y-auto py-1">
              {filtered.length > 0 ? (
                filtered.map((opt, idx) => {
                  const optVal = typeof opt === 'string' ? opt : opt.id;
                  const optLabel = typeof opt === 'string' ? opt : opt.label;
                  const isSelected = isMulti ? value.includes(optVal) : value === optVal;
                  const isHighlighted = idx === activeIndex;

                  return (
                    <button
                      key={optVal}
                      type="button"
                      onClick={() => handleSelect(opt)}
                      className={`w-full text-left px-3.5 py-1.5 text-xs flex items-center justify-between transition-colors ${
                        isHighlighted ? 'bg-primary/5 text-primary font-semibold' : 'text-textPrimary hover:bg-sectionBackground'
                      }`}
                    >
                      <span className="truncate">{optLabel}</span>
                      {isSelected && <Check className="w-3 h-3 text-primary shrink-0" />}
                    </button>
                  );
                })
              ) : (
                <div className="px-3.5 py-2 text-xs text-textSecondary">No options found</div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  useEffect(() => {
    if (selectedBusiness) {
      setBusinessName(selectedBusiness.name || '');
      setBusinessCategory(selectedBusiness.category || '');
      
      const address = selectedBusiness.address || '';
      const parts = address.split(',').map(p => p.trim());
      if (parts.length >= 3) {
        setCity(parts[parts.length - 3] || '');
        setState(parts[parts.length - 2] || '');
        setCountry(parts[parts.length - 1] || '');
      } else if (parts.length === 2) {
        setCity(parts[0] || '');
        setState(parts[1] || '');
        setCountry('');
      } else {
        setCity(address);
        setState('');
        setCountry('');
      }
    }
  }, [selectedBusiness]);
  const [discountPercent, setDiscountPercent] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [freeDelivery, setFreeDelivery] = useState(false);
  const [buyOneGetOne, setBuyOneGetOne] = useState(false);
  const [freeGift, setFreeGift] = useState(false);
  const [limitedTimeOffer, setLimitedTimeOffer] = useState(false);
  const [customOffer, setCustomOffer] = useState('');
  const [contentLength, setContentLength] = useState('Medium');
  const [emojiLevel, setEmojiLevel] = useState('Medium');
  const [creativity, setCreativity] = useState('Balanced');

  // SEO Keyword Chips
  const [seoKeywords, setSeoKeywords] = useState([]);
  const [keywordInput, setKeywordInput] = useState('');
  const [recentKeywords, setRecentKeywords] = useState([]);

  // Category Search Dropdown
  const [categorySearch, setCategorySearch] = useState('');
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

  // App States
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingKeywords, setLoadingKeywords] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState(LOADING_MESSAGES[0]);
  const [error, setError] = useState('');
  const [copiedSection, setCopiedSection] = useState(null);
  const [editingCard, setEditingCard] = useState(null);
  const [editValue, setEditValue] = useState('');

  // History & Analytics states
  const [historyList, setHistoryList] = useState([]);
  const [historySearch, setHistorySearch] = useState('');
  const [historyPlatform, setHistoryPlatform] = useState('All');
  const [historySort, setHistorySort] = useState('newest');
  const [historyTab, setHistoryTab] = useState('active'); // active or archived
  const [analyticsData, setAnalyticsData] = useState(null);

  // Fetch business profile for pre-fill
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/api/businesses/mine');
        if (res.data?.success && res.data.data) {
          const biz = res.data.data;
          setBusinessName(biz.name || '');
          setBusinessCategory(biz.category || '');
          setCategorySearch(biz.category || '');
          if (biz.address) {
            const parts = biz.address.split(',').map(p => p.trim());
            if (parts.length >= 3) {
              setCity(parts[0]);
              setState(parts[1]);
              setCountry(parts[2]);
            } else if (parts.length === 2) {
              setCity(parts[0]);
              setState(parts[1]);
            } else {
              setCity(biz.address);
            }
          }
        }
      } catch (err) {
        console.error('Failed to pre-fill business details:', err);
      }
    };
    fetchProfile();
  }, []);

  // Fetch History when tab changes
  useEffect(() => {
    if (activeTab === 'history') {
      fetchHistory();
    } else if (activeTab === 'analytics') {
      fetchAnalytics();
    }
  }, [activeTab]);

  // Loading spinner message rotator
  useEffect(() => {
    let interval;
    if (loading) {
      let index = 0;
      setLoadingMessage(LOADING_MESSAGES[0]);
      interval = setInterval(() => {
        index = (index + 1) % LOADING_MESSAGES.length;
        setLoadingMessage(LOADING_MESSAGES[index]);
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const fetchHistory = async () => {
    try {
      const res = await api.get('/api/ai/history');
      if (res.data?.success) {
        setHistoryList(res.data.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const res = await api.get('/api/ai/analytics');
      if (res.data?.success) {
        setAnalyticsData(res.data.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCategorySelect = (cat) => {
    setBusinessCategory(cat);
    setCategorySearch(cat);
    setShowCategoryDropdown(false);
  };

  const handleAddKeyword = (e) => {
    if (e.key === 'Enter' || e.type === 'click') {
      e.preventDefault();
      const kw = keywordInput.trim();
      if (kw && !seoKeywords.includes(kw)) {
        if (seoKeywords.length >= 15) {
          setError('Maximum of 15 keywords allowed.');
          return;
        }
        const updated = [...seoKeywords, kw];
        setSeoKeywords(updated);
        setKeywordInput('');
        setError('');

        if (!recentKeywords.includes(kw)) {
          setRecentKeywords([kw, ...recentKeywords].slice(0, 10));
        }
      }
    }
  };

  const handleRemoveKeyword = (kw) => {
    setSeoKeywords(seoKeywords.filter(k => k !== kw));
  };

  const handleSuggestKeywords = async () => {
    if (!businessCategory) {
      setError('Please select a business category first.');
      return;
    }
    setLoadingKeywords(true);
    try {
      const res = await api.post('/api/ai/suggest-keywords', {
        category: businessCategory,
        objective: marketingObjective
      });
      if (res.data?.success && Array.isArray(res.data.data)) {
        const newKws = res.data.data.filter(k => !seoKeywords.includes(k));
        setSeoKeywords([...seoKeywords, ...newKws].slice(0, 15));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingKeywords(false);
    }
  };

  const handleDuplicate = async (id) => {
    try {
      const res = await api.post(`/api/ai/history/${id}/duplicate`);
      if (res.data?.success) {
        fetchHistory();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this campaign?')) return;
    try {
      const res = await api.delete(`/api/ai/history/${id}`);
      if (res.data?.success) {
        fetchHistory();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const toggleFavorite = async (id, currentVal) => {
    try {
      const res = await api.patch(`/api/ai/history/${id}/actions`, { favourite: !currentVal });
      if (res.data?.success) {
        fetchHistory();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const toggleArchive = async (id, currentVal) => {
    try {
      const res = await api.patch(`/api/ai/history/${id}/actions`, { archived: !currentVal });
      if (res.data?.success) {
        fetchHistory();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleViewAgain = (item) => {
    setResult(item);
    setActiveTab('studio');
  };

  const recordCardAction = async (field) => {
    if (!result?.id) return;
    try {
      const payload = {};
      if (field === 'downloaded') payload.downloaded = true;
      if (field === 'regenerated') payload.regenerated = true;
      await api.patch(`/api/ai/history/${result.id}/actions`, payload);
    } catch (err) {
      console.error(err);
    }
  };

  const handlePlatformToggle = (platformId) => {
    if (platforms.includes(platformId)) {
      if (platforms.length === 1) return;
      setPlatforms(platforms.filter(p => p !== platformId));
    } else {
      setPlatforms([...platforms, platformId]);
    }
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    setError('');

    const finalAudience = targetAudience === 'Custom Audience' ? customAudience : targetAudience;
    const finalDuration = duration === 'Custom Date' ? customDuration : duration;

    if (!businessName.trim()) {
      setError('Business Name is required.');
      return;
    }
    if (!businessCategory) {
      setError('Please search and select a business category.');
      return;
    }
    if (targetAudience === 'Custom Audience' && !customAudience.trim()) {
      setError('Please input your custom target audience.');
      return;
    }
    if (duration === 'Custom Date' && !customDuration.trim()) {
      setError('Please input custom duration dates.');
      return;
    }

    setLoading(true);
    setResult(null);

    const payload = {
      campaignName: campaignName.trim() || `Campaign ${businessName}`,
      businessName,
      businessCategory,
      targetAudience: finalAudience,
      marketingObjective,
      tone,
      language,
      platforms,
      location: { city, state, country },
      duration: finalDuration,
      offerDetails: {
        discountPercent: parseInt(discountPercent) || 0,
        couponCode,
        freeDelivery,
        buyOneGetOne,
        freeGift,
        limitedTimeOffer,
        customOffer
      },
      contentLength,
      emojiLevel,
      creativity,
      seoKeywords
    };

    try {
      const response = await api.post('/api/ai/generate-content', payload);
      if (response.data?.success) {
        setResult(response.data.data);
      } else {
        setError(response.data?.message || 'Content generation failed.');
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'AI request aborted or failed.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text, section) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedSection(section);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const startEdit = (key, val) => {
    setEditingCard(key);
    setEditValue(val);
  };

  const saveEdit = () => {
    if (!result) return;
    const updatedResult = { ...result };
    updatedResult.outputs[editingCard] = editValue;
    setResult(updatedResult);
    setEditingCard(null);
    recordCardAction('regenerated');
  };

  // Build list of platform caption key mappings
  const PLATFORM_CAPTION_MAP = {
    'Instagram': { key: 'instagramCaption', label: 'Instagram Caption' },
    'Facebook': { key: 'facebookCaption', label: 'Facebook Post Copy' },
    'WhatsApp': { key: 'whatsappCaption', label: 'WhatsApp Broadcast' },
    'Google Business Profile': { key: 'googleBusinessDescription', label: 'Google Business Post' },
    'LinkedIn': { key: 'linkedinCaption', label: 'LinkedIn Post Copy' },
    'Twitter(X)': { key: 'twitterCaption', label: 'Twitter/X Post Copy' },
  };

  const getSelectedPlatformCaptions = (res) => {
    const selectedPlatforms = res?.platforms || [];
    return selectedPlatforms
      .map(p => PLATFORM_CAPTION_MAP[p])
      .filter(Boolean)
      .filter(item => res?.outputs?.[item.key]);
  };

  const handlePrintPdf = () => {
    if (!result) return;
    const selectedCaptions = getSelectedPlatformCaptions(result);
    const captionSections = selectedCaptions.map(item => `
      <div class="section-card">
        <h4>${item.label}</h4>
        <p>${result.outputs?.[item.key] || ''}</p>
      </div>
    `).join('');

    const hashtagsHtml = (result.outputs?.hashtags || [])
      .map(tag => `<span class="tag-chip">${tag}</span>`)
      .join('');

    const seoTableRows = [
      { check: 'Google Business Profile', status: result.outputs?.localVisibility >= 80 ? 'Optimized' : 'Action Required', desc: 'Sync local credentials, address details, and reviews.' },
      { check: 'Meta Descriptions', status: result.outputs?.seoScore >= 80 ? 'Complete' : 'Needs Review', desc: result.outputs?.seoDescription ? 'Custom meta tagline verified.' : 'Generate matching meta snippet.' },
      { check: 'Local Keywords Integration', status: 'Optimized', desc: `Target category: ${result.businessCategory || 'General Niche'}.` },
      { check: 'Call to Action Strategy', status: 'Optimal', desc: result.outputs?.ctaReview || 'Strong directional placement.' },
      { check: 'Hashtag Density', status: 'Optimal', desc: result.outputs?.hashtagReview || 'Balanced platform density.' }
    ].map(row => `
      <tr>
        <td style="font-weight: 700; color: #1e1b4b;">${row.check}</td>
        <td><span style="font-weight: 700; color: ${row.status === 'Optimized' || row.status === 'Complete' || row.status === 'Optimal' ? '#10B981' : '#F59E0B'}">${row.status}</span></td>
        <td>${row.desc}</td>
      </tr>
    `).join('');

    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Trendora AI Marketing Report - ${result.campaignName}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&family=Inter:wght@400;500;600;700;800&display=swap');
            @page {
              size: A4;
              margin: 0;
            }
            body {
              font-family: 'Inter', sans-serif;
              color: #0F172A;
              background: #FFFFFF;
              margin: 0;
              padding: 0;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            .page {
              width: 210mm;
              height: 297mm;
              page-break-after: always;
              position: relative;
              box-sizing: border-box;
              padding: 24mm 20mm;
              display: flex;
              flex-direction: column;
              background: #FAF9FF;
            }
            .cover-page {
              background: linear-gradient(135deg, #06060A 0%, #110B29 50%, #1F0D42 100%);
              color: #FFFFFF;
              justify-content: space-between;
              padding: 30mm 20mm;
            }
            .cover-header {
              display: flex;
              justify-content: space-between;
              align-items: center;
            }
            .logo-text {
              font-family: 'Space Grotesk', sans-serif;
              font-size: 28px;
              font-weight: 700;
              color: #8B5CF6;
              letter-spacing: -1px;
            }
            .logo-text span {
              color: #0EA5E9;
            }
            .report-title-container {
              margin-top: 40mm;
            }
            .report-subtitle {
              font-size: 11px;
              font-weight: 800;
              color: #8B5CF6;
              text-transform: uppercase;
              letter-spacing: 3px;
              margin-bottom: 8px;
            }
            .report-title {
              font-family: 'Space Grotesk', sans-serif;
              font-size: 40px;
              font-weight: 700;
              line-height: 1.1;
              color: #FFFFFF;
              letter-spacing: -1px;
            }
            .cover-footer {
              display: flex;
              justify-content: space-between;
              border-top: 1px solid rgba(255, 255, 255, 0.08);
              padding-top: 15mm;
            }
            .meta-block h4 {
              font-size: 9px;
              font-weight: 800;
              color: #8B5CF6;
              text-transform: uppercase;
              margin: 0 0 6px;
              letter-spacing: 1px;
            }
            .meta-block p {
              font-size: 14px;
              font-weight: 600;
              color: #FFFFFF;
              margin: 0;
            }
            
            /* Normal Page Styles */
            .page-header {
              display: flex;
              justify-content: space-between;
              align-items: center;
              border-bottom: 1px solid rgba(124, 92, 246, 0.15);
              padding-bottom: 8px;
              margin-bottom: 20px;
            }
            .page-header .title {
              font-size: 10px;
              font-weight: 800;
              text-transform: uppercase;
              color: #64748B;
              letter-spacing: 1px;
            }
            .page-header .brand {
              font-size: 11px;
              font-weight: 700;
              color: #8B5CF6;
            }
            .page-header .brand span {
              color: #0EA5E9;
            }
            
            .page-title {
              font-family: 'Space Grotesk', sans-serif;
              font-size: 22px;
              font-weight: 700;
              color: #1E1A34;
              margin: 0 0 20px;
              letter-spacing: -0.5px;
            }
            
            .card-grid {
              display: grid;
              grid-template-columns: repeat(2, 1fr);
              gap: 16px;
              margin-bottom: 24px;
            }
            .score-card {
              background: #FFFFFF;
              border: 1px solid rgba(124, 92, 246, 0.1);
              border-radius: 16px;
              padding: 16px;
              box-shadow: 0 4px 12px rgba(124, 92, 246, 0.02);
              display: flex;
              align-items: center;
              justify-content: space-between;
            }
            .score-card .info h5 {
              font-size: 10px;
              font-weight: 800;
              text-transform: uppercase;
              color: #64748B;
              margin: 0 0 4px;
              letter-spacing: 0.5px;
            }
            .score-card .info p {
              font-size: 11px;
              color: #94A3B8;
              margin: 0;
            }
            .score-card .val {
              font-family: 'Space Grotesk', sans-serif;
              font-size: 28px;
              font-weight: 700;
              color: #8B5CF6;
            }
            
            .section-card {
              background: #FFFFFF;
              border: 1px solid rgba(124, 92, 246, 0.08);
              border-radius: 16px;
              padding: 20px;
              margin-bottom: 20px;
              box-shadow: 0 4px 16px rgba(124, 92, 246, 0.02);
            }
            .section-card h4 {
              font-size: 11px;
              font-weight: 800;
              text-transform: uppercase;
              color: #8B5CF6;
              margin: 0 0 12px;
              letter-spacing: 0.8px;
            }
            .section-card p {
              font-size: 13px;
              color: #334155;
              line-height: 1.6;
              margin: 0;
            }
            
            .tagline-banner {
              background: linear-gradient(135deg, rgba(139, 92, 246, 0.05) 0%, rgba(14, 165, 233, 0.05) 100%);
              border-left: 4px solid #8B5CF6;
              border-radius: 8px;
              padding: 16px 20px;
              font-size: 15px;
              font-weight: 600;
              font-style: italic;
              color: #1E1B4B;
              margin-bottom: 24px;
            }
            
            .cta-highlight {
              background: #FFFBEB;
              border: 1px solid #FEF3C7;
              border-left: 4px solid #F59E0B;
              border-radius: 8px;
              padding: 16px;
              font-size: 13px;
              font-weight: 600;
              color: #92400E;
              margin-bottom: 20px;
            }
            
            .tags-container {
              display: flex;
              flex-wrap: wrap;
              gap: 8px;
              margin-bottom: 20px;
            }
            .tag-chip {
              background: rgba(139, 92, 246, 0.08);
              border: 1px solid rgba(139, 92, 246, 0.15);
              color: #8B5CF6;
              padding: 4px 10px;
              border-radius: 12px;
              font-size: 11px;
              font-weight: 600;
            }
            
            table.report-table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 12px;
            }
            table.report-table th {
              background: rgba(139, 92, 246, 0.03);
              border-bottom: 2px solid rgba(139, 92, 246, 0.1);
              color: #1E1A34;
              font-size: 10px;
              font-weight: 800;
              text-transform: uppercase;
              text-align: left;
              padding: 10px 12px;
              letter-spacing: 0.5px;
            }
            table.report-table td {
              border-bottom: 1px solid rgba(124, 92, 246, 0.06);
              color: #334155;
              font-size: 12px;
              padding: 10px 12px;
            }
            
            .page-footer {
              position: absolute;
              bottom: 24mm;
              left: 20mm;
              right: 20mm;
              display: flex;
              justify-content: space-between;
              align-items: center;
              border-top: 1px solid rgba(124, 92, 246, 0.08);
              padding-top: 10px;
              font-size: 10px;
              color: #94A3B8;
            }
          </style>
        </head>
        <body>
          <!-- PAGE 1: COVER PAGE -->
          <div class="page cover-page">
            <div class="cover-header">
              <div class="logo-text">Trend<span>ora</span></div>
              <div style="font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; color: rgba(255,255,255,0.4);">
                Enterprise Report
              </div>
            </div>
            
            <div class="report-title-container">
              <div class="report-subtitle">AI Marketing Campaign Optimization</div>
              <h1 class="report-title">${result.campaignName}</h1>
              <p style="font-size: 15px; color: rgba(255, 255, 255, 0.6); margin-top: 6mm; max-width: 150mm; line-height: 1.5; font-weight: 300;">
                A comprehensive digital campaign strategy generated dynamically by the Trendora Enterprise marketing engine.
              </p>
            </div>
            
            <div class="cover-footer">
              <div class="meta-block">
                <h4>Client Niche Profile</h4>
                <p>${result.businessName}</p>
                <p style="font-size: 11px; color: rgba(255,255,255,0.5); font-weight: normal; margin-top: 2px;">${result.businessCategory}</p>
              </div>
              <div class="meta-block" style="text-align: right;">
                <h4>Generated Timestamp</h4>
                <p>${new Date(result.createdDate).toLocaleDateString()}</p>
                <p style="font-size: 11px; color: rgba(255,255,255,0.5); font-weight: normal; margin-top: 2px;">${new Date(result.createdDate).toLocaleTimeString()}</p>
              </div>
            </div>
          </div>
          
          <!-- PAGE 2: EXEC SUMMARY -->
          <div class="page">
            <div class="page-header">
              <span class="title">I. Executive Summary</span>
              <span class="brand">Trend<span>ora</span></span>
            </div>
            
            <h2 class="page-title">Campaign Evaluation</h2>
            
            <div class="card-grid">
              <div class="score-card">
                <div class="info">
                  <h5>Marketing Rating</h5>
                  <p>Overall copy impact</p>
                </div>
                <div class="val">${result.outputs?.marketingScore || 85}</div>
              </div>
              <div class="score-card">
                <div class="info">
                  <h5>SEO Performance</h5>
                  <p>Keyword search index</p>
                </div>
                <div class="val">${result.outputs?.seoScore || 90}</div>
              </div>
              <div class="score-card">
                <div class="info">
                  <h5>Target Engagement</h5>
                  <p>User feedback metrics</p>
                </div>
                <div class="val">${result.outputs?.engagementScore || 88}</div>
              </div>
              <div class="score-card">
                <div class="info">
                  <h5>Local Visibility</h5>
                  <p>Map profile matching</p>
                </div>
                <div class="val">${result.outputs?.localVisibility || 92}</div>
              </div>
            </div>
            
            <div class="section-card" style="margin-top: 10px;">
              <h4 style="color: #0F172A; border-bottom: 1px solid rgba(124,92,246,0.1); padding-bottom: 8px;">Key Performance Indicators</h4>
              <table class="report-table">
                <thead>
                  <tr>
                    <th>Metric</th>
                    <th>Value / Suggestion</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>Estimated Campaign Reach</strong></td>
                    <td style="color: #8B5CF6; font-weight: 700;">${result.outputs?.estimatedReach || '—'} views</td>
                  </tr>
                  <tr>
                    <td><strong>Suggested Ad Budget</strong></td>
                    <td style="font-weight: 600;">${result.outputs?.suggestedBudget || '—'}</td>
                  </tr>
                  <tr>
                    <td><strong>Recommended Posting Day</strong></td>
                    <td style="font-weight: 600;">${result.outputs?.recommendedPostingDay || '—'}</td>
                  </tr>
                  <tr>
                    <td><strong>Recommended Posting Time</strong></td>
                    <td style="font-weight: 600;">${result.outputs?.recommendedPostingTime || '—'}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="page-footer">
              <span>Trendora Enterprise Suite</span>
              <span>Page 2 of 4</span>
            </div>
          </div>
          
          <!-- PAGE 3: COPY & CONTENT -->
          <div class="page">
            <div class="page-header">
              <span class="title">II. Copywriting & Distribution</span>
              <span class="brand">Trend<span>ora</span></span>
            </div>
            
            <h2 class="page-title">Marketing Copy</h2>
            
            <div class="tagline-banner">
              "${result.outputs?.tagline || ''}"
            </div>
            
            <div style="flex: 1; overflow: hidden; display: flex; flex-direction: column; gap: 10px;">
              ${captionSections}
            </div>

            <div class="cta-highlight">
              <div style="font-size: 10px; font-weight: 800; text-transform: uppercase; color: #B45309; margin-bottom: 4px; letter-spacing: 0.5px;">Call to Action (CTA)</div>
              ${result.outputs?.callToAction || ''}
            </div>
            
            <div class="section-card" style="padding: 15px 20px; margin-bottom: 0;">
              <h4>Social Tagging Index</h4>
              <div class="tags-container" style="margin-bottom: 0;">
                ${hashtagsHtml}
              </div>
            </div>
            
            <div class="page-footer">
              <span>Trendora Enterprise Suite</span>
              <span>Page 3 of 4</span>
            </div>
          </div>
          
          <!-- PAGE 4: SEO CHECKLIST -->
          <div class="page">
            <div class="page-header">
              <span class="title">III. Search Index Optimizations</span>
              <span class="brand">Trend<span>ora</span></span>
            </div>
            
            <h2 class="page-title">SEO Recommendations</h2>
            
            <div class="section-card">
              <h4>Meta Snippet Tag</h4>
              <p style="font-size: 13px; font-style: italic; color: #475569; background: #F8FAFC; padding: 12px; border-radius: 8px; border: 1px solid rgba(124, 92, 246, 0.06);">
                "${result.outputs?.seoDescription || ''}"
              </p>
            </div>
            
            <div class="section-card" style="flex: 1;">
              <h4>SEO Checklist & Action Log</h4>
              <table class="report-table">
                <thead>
                  <tr>
                    <th style="width: 30%;">Optimized Asset</th>
                    <th style="width: 25%;">Status</th>
                    <th style="width: 45%;">Diagnostic Action Details</th>
                  </tr>
                </thead>
                <tbody>
                  ${seoTableRows}
                </tbody>
              </table>
            </div>
            
            <div class="page-footer">
              <span>Trendora Enterprise Suite</span>
              <span>Page 4 of 4</span>
            </div>
          </div>
          
          <script>
            window.onload = function() {
              window.print();
            }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
    recordCardAction('downloaded');
  };

  const handleDownloadDocx = () => {
    if (!result) return;
    const selectedCaptions = getSelectedPlatformCaptions(result);
    const captionHtml = selectedCaptions.map(item =>
      `<h2>${item.label}</h2><p>${result.outputs?.[item.key] || ''}</p>`
    ).join('');
    const content = `
      <html><body>
      <h1>Trendora Campaign Report — ${result.campaignName}</h1>
      <p><strong>Business:</strong> ${result.businessName} &bull; <strong>Category:</strong> ${result.businessCategory}</p>
      <p><strong>Platforms:</strong> ${(result.platforms || []).join(', ')}</p>
      <p><strong>Objective:</strong> ${result.inputs?.marketingObjective || ''}</p>
      <hr/>
      <h2>Campaign Tagline</h2>
      <p><em>${result.outputs?.tagline || ''}</em></p>
      ${captionHtml}
      <h2>Call to Action (CTA)</h2>
      <p>${result.outputs?.callToAction || ''}</p>
      <h2>Hashtags</h2>
      <p>${(result.outputs?.hashtags || []).join(' ')}</p>
      <h2>SEO Description</h2>
      <p>${result.outputs?.seoDescription || ''}</p>
      <hr/>
      <p><small>Marketing Score: ${result.outputs?.marketingScore || '—'} &bull; SEO Score: ${result.outputs?.seoScore || '—'} &bull; Engagement: ${result.outputs?.engagementScore || '—'} &bull; Local Visibility: ${result.outputs?.localVisibility || '—'}</small></p>
      <p><small>Estimated Reach: ${result.outputs?.estimatedReach || '—'} &bull; Suggested Budget: ${result.outputs?.suggestedBudget || '—'}</small></p>
      <p><small>Generated by Trendora AI Marketing Suite</small></p>
      </body></html>
    `;
    const blob = new Blob(['\ufeff' + content], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${result.campaignName.replace(/\s+/g, '_')}_Report.doc`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    recordCardAction('downloaded');
  };

  const handleDownloadTxt = () => {
    if (!result) return;
    const selectedCaptions = getSelectedPlatformCaptions(result);
    let txt = `=== TRENDORA CAMPAIGN REPORT ===\n`;
    txt += `Campaign: ${result.campaignName}\n`;
    txt += `Business: ${result.businessName} (${result.businessCategory})\n`;
    txt += `Platforms: ${(result.platforms || []).join(', ')}\n`;
    txt += `Objective: ${result.inputs?.marketingObjective || ''}\n`;
    txt += `Date: ${new Date(result.createdDate).toLocaleDateString()}\n\n`;
    txt += `--- SCORES ---\n`;
    txt += `Marketing Score: ${result.outputs?.marketingScore || '—'}/100\n`;
    txt += `SEO Score: ${result.outputs?.seoScore || '—'}/100\n`;
    txt += `Engagement Score: ${result.outputs?.engagementScore || '—'}/100\n`;
    txt += `Local Visibility: ${result.outputs?.localVisibility || '—'}/100\n\n`;
    txt += `--- CAMPAIGN CONTENT ---\n\n`;
    txt += `TAGLINE:\n${result.outputs?.tagline || ''}\n\n`;
    selectedCaptions.forEach(item => {
      txt += `${item.label.toUpperCase()}:\n${result.outputs?.[item.key] || ''}\n\n`;
    });
    txt += `CALL TO ACTION (CTA):\n${result.outputs?.callToAction || ''}\n\n`;
    txt += `HASHTAGS:\n${(result.outputs?.hashtags || []).join(' ')}\n\n`;
    txt += `SEO DESCRIPTION:\n${result.outputs?.seoDescription || ''}\n\n`;
    txt += `--- INSIGHTS ---\n`;
    txt += `Estimated Reach: ${result.outputs?.estimatedReach || '—'}\n`;
    txt += `Suggested Budget: ${result.outputs?.suggestedBudget || '—'}\n`;
    txt += `Best Posting Day: ${result.outputs?.recommendedPostingDay || '—'}\n`;
    txt += `Best Posting Time: ${result.outputs?.recommendedPostingTime || '—'}\n`;
    txt += `\n=== Generated by Trendora AI Marketing Suite ===\n`;
    const blob = new Blob([txt], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${result.campaignName.replace(/\s+/g, '_')}_copy.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    recordCardAction('downloaded');
  };

  const handleDownloadJson = () => {
    if (!result) return;
    const str = JSON.stringify(result, null, 2);
    const blob = new Blob([str], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${result.campaignName.replace(/\s+/g, '_')}_data.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    recordCardAction('downloaded');
  };



  const handleClear = () => {
    setResult(null);
    setCampaignName('');
    setDiscountPercent('');
    setCouponCode('');
    setFreeDelivery(false);
    setBuyOneGetOne(false);
    setFreeGift(false);
    setLimitedTimeOffer(false);
    setCustomOffer('');
    setSeoKeywords([]);
  };

  const handleCopyAll = () => {
    if (!result) return;
    const selectedCaptions = getSelectedPlatformCaptions(result);
    let content = `=== TRENDORA CAMPAIGN: ${result.campaignName} ===\n`;
    content += `Business: ${result.businessName} (${result.businessCategory})\n\n`;
    content += `TAGLINE:\n${result.outputs?.tagline || ''}\n\n`;
    selectedCaptions.forEach(item => {
      content += `${item.label.toUpperCase()}:\n${result.outputs?.[item.key] || ''}\n\n`;
    });
    content += `CALL TO ACTION:\n${result.outputs?.callToAction || ''}\n\n`;
    content += `HASHTAGS:\n${(result.outputs?.hashtags || []).join(' ')}\n\n`;
    content += `SEO DESCRIPTION:\n${result.outputs?.seoDescription || ''}\n`;
    navigator.clipboard.writeText(content);
    setCopiedSection('all');
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const filteredCategories = ALLOWED_CATEGORIES.filter(cat =>
    cat.toLowerCase().includes(categorySearch.toLowerCase())
  );

  // Filter history list
  const getFilteredHistory = () => {
    return historyList
      .filter(item => {
        // Active vs Archived check
        if (historyTab === 'active' && item.archived) return false;
        if (historyTab === 'archived' && !item.archived) return false;

        // Search check
        if (historySearch) {
          const s = historySearch.toLowerCase();
          const matchName = item.campaignName?.toLowerCase().includes(s);
          const matchBiz = item.businessName?.toLowerCase().includes(s);
          const matchCat = item.businessCategory?.toLowerCase().includes(s);
          if (!matchName && !matchBiz && !matchCat) return false;
        }

        // Platform check
        if (historyPlatform !== 'All') {
          if (!item.platforms?.includes(historyPlatform)) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (historySort === 'newest') {
          return new Date(b.createdDate) - new Date(a.createdDate);
        }
        if (historySort === 'oldest') {
          return new Date(a.createdDate) - new Date(b.createdDate);
        }
        if (historySort === 'alphabetical') {
          return (a.campaignName || '').localeCompare(b.campaignName || '');
        }
        return 0;
      });
  };

  const activeFilteredHistory = getFilteredHistory();

  return (
    <div className="min-h-screen bg-background text-textPrimary py-8 px-4 sm:px-6 lg:px-8">
      {/* Background gradients */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-primary/10 via-transparent to-transparent pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto space-y-8">
        {/* Upper SaaS Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-border pb-6 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-8 h-8 text-primary animate-pulse" />
              <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Trendora Marketing Studio
              </h1>
            </div>
            <p className="text-textSecondary mt-2 max-w-xl text-sm">
              Premium SaaS environment. Build SEO-optimized copywriting campaign assets and run local reach diagnostics using Llama 3.
            </p>
          </div>

          {/* SaaS Navigation Tabs */}
          <div className="flex items-center gap-1 bg-surface border border-border p-1.5 rounded-xl shadow-glass">
            <button
              onClick={() => setActiveTab('studio')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                activeTab === 'studio'
                  ? 'bg-primary text-white shadow-premium'
                  : 'hover:bg-sectionBackground text-textSecondary hover:text-textPrimary'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              Marketing Studio
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                activeTab === 'history'
                  ? 'bg-primary text-white shadow-premium'
                  : 'hover:bg-sectionBackground text-textSecondary hover:text-textPrimary'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              Campaign History
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                activeTab === 'analytics'
                  ? 'bg-primary text-white shadow-premium'
                  : 'hover:bg-sectionBackground text-textSecondary hover:text-textPrimary'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              Studio Analytics
            </button>
          </div>
        </div>

        {/* Dynamic content rendering based on activeTab */}
        {activeTab === 'studio' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Input Form Column */}
            <form onSubmit={handleGenerate} className="lg:col-span-5 bg-surface border border-border rounded-2xl shadow-glass p-5 space-y-4 relative pb-20 max-h-[750px] overflow-y-auto flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 border-b border-border pb-2.5 mb-3">
                  <Sliders className="w-4 h-4 text-primary" />
                  <h3 className="text-xs font-extrabold text-textPrimary uppercase tracking-wider">Campaign Configurations</h3>
                </div>

                {error && (
                  <div className="bg-danger/10 border border-danger/25 text-danger text-xs px-3 py-2.5 rounded-xl flex items-start gap-2 mb-4">
                    <Info className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                    <p className="text-[11px] leading-snug">{error}</p>
                  </div>
                )}

                {/* Business details */}
                <div className="space-y-3">
                  <div>
                    <label className="block text-[10px] font-extrabold tracking-wider text-textSecondary uppercase mb-1">Campaign Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Summer Croissants Promotion"
                      value={campaignName}
                      onChange={(e) => setCampaignName(e.target.value)}
                      className="w-full bg-sectionBackground border border-border focus:border-primary/40 focus:ring-1 focus:ring-primary/20 rounded-xl px-3 py-1.5 text-xs text-textPrimary placeholder:text-textSecondary/40 outline-none transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-extrabold tracking-wider text-textSecondary uppercase mb-1">Business Name</label>
                      <div className="relative">
                        <Building className="absolute left-2.5 top-2 w-3.5 h-3.5 text-textSecondary" />
                        <input
                          type="text"
                          placeholder="e.g. RP Bakery"
                          value={businessName}
                          onChange={(e) => setBusinessName(e.target.value)}
                          className="w-full bg-sectionBackground border border-border focus:border-primary/40 focus:ring-1 focus:ring-primary/20 rounded-xl pl-8.5 pr-3 py-1.5 text-xs text-textPrimary placeholder:text-textSecondary/40 outline-none transition-all"
                        />
                      </div>
                    </div>

                    {/* Searchable dropdown */}
                    <SearchableSelect
                      label="Category"
                      value={businessCategory}
                      options={ALLOWED_CATEGORIES}
                      onChange={(val) => {
                        setBusinessCategory(val);
                        setCategorySearch(val);
                      }}
                      placeholder="Search categories..."
                      icon={Search}
                    />
                  </div>
                </div>

                {/* Target & Objectives */}
                <div className="grid grid-cols-2 gap-3 mt-3">
                  <SearchableSelect
                    label="Target Audience"
                    value={targetAudience}
                    options={TARGET_AUDIENCES}
                    onChange={setTargetAudience}
                    placeholder="Search audiences..."
                    icon={Users}
                  />

                  <SearchableSelect
                    label="Marketing Goal"
                    value={marketingObjective}
                    options={OBJECTIVES}
                    onChange={setMarketingObjective}
                    placeholder="Search goals..."
                    icon={Target}
                  />
                </div>

                {targetAudience === 'Custom Audience' && (
                  <input
                    type="text"
                    placeholder="e.g. coffee lovers aged 25-40"
                    value={customAudience}
                    onChange={(e) => setCustomAudience(e.target.value)}
                    className="w-full bg-sectionBackground border border-border focus:border-primary/40 rounded-xl px-3 py-1.5 text-xs text-textPrimary placeholder:text-textSecondary/40 mt-2 outline-none"
                  />
                )}

                {/* Settings Block */}
                <div className="grid grid-cols-3 gap-3 border-t border-border pt-3 mt-3">
                  <SearchableSelect
                    label="Tone"
                    value={tone}
                    options={TONES}
                    onChange={setTone}
                    placeholder="Search tones..."
                    icon={Volume2}
                  />

                  <SearchableSelect
                    label="Language"
                    value={language}
                    options={[
                      { id: 'English', label: '🇬🇧 English' },
                      { id: 'Tamil', label: '🇮🇳 Tamil' },
                      { id: 'Tanglish', label: '🗣️ Tanglish' }
                    ]}
                    onChange={setLanguage}
                    placeholder="Search languages..."
                    icon={Globe}
                  />

                  <SearchableSelect
                    label="Duration"
                    value={duration}
                    options={[
                      { id: 'Today', label: 'Today' },
                      { id: 'Weekend', label: 'Weekend' },
                      { id: '1 Week', label: '1 Week' },
                      { id: '15 Days', label: '15 Days' },
                      { id: '1 Month', label: '1 Month' },
                      { id: 'Custom Date', label: 'Custom Date' }
                    ]}
                    onChange={setDuration}
                    placeholder="Search durations..."
                    icon={Calendar}
                  />
                </div>

                {duration === 'Custom Date' && (
                  <input
                    type="text"
                    placeholder="e.g. July 10 - July 20"
                    value={customDuration}
                    onChange={(e) => setCustomDuration(e.target.value)}
                    className="w-full bg-sectionBackground border border-border focus:border-primary/40 rounded-xl px-3 py-1.5 text-xs text-textPrimary placeholder:text-textSecondary/40 mt-2 outline-none"
                  />
                )}

                {/* Platform multi-select popup */}
                <div className="border-t border-border pt-3 mt-3">
                  <SearchableSelect
                    label="Target Platforms"
                    value={platforms}
                    options={PLATFORMS_LIST}
                    onChange={setPlatforms}
                    placeholder="Search platforms..."
                    isMulti={true}
                    icon={Share2}
                  />
                </div>

                {/* Collapsible Offer Details Accordion */}
                <div className="border-t border-border pt-3 mt-3">
                  <button
                    type="button"
                    onClick={() => setShowOfferDetails(!showOfferDetails)}
                    className="w-full flex items-center justify-between py-1 text-xs font-bold text-textPrimary hover:text-primary transition-colors outline-none"
                  >
                    <span className="flex items-center gap-1.5">
                      <Percent className="w-3.5 h-3.5 text-primary" />
                      Offer details (Optional)
                    </span>
                    <ChevronDown className={`w-4 h-4 text-textSecondary transition-transform ${showOfferDetails ? 'rotate-180' : ''}`} />
                  </button>

                  {showOfferDetails && (
                    <div className="bg-sectionBackground p-3.5 rounded-xl border border-border mt-2 space-y-2.5 animate-fadeIn">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[9px] font-extrabold text-textSecondary uppercase mb-1">Discount %</label>
                          <input
                            type="number"
                            min="0"
                            max="100"
                            placeholder="e.g. 20"
                            value={discountPercent}
                            onChange={(e) => setDiscountPercent(e.target.value)}
                            className="w-full bg-surface border border-border focus:border-primary/40 rounded-lg px-2.5 py-1 text-xs outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[9px] font-extrabold text-textSecondary uppercase mb-1">Coupon Code</label>
                          <input
                            type="text"
                            placeholder="e.g. FRESH20"
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value)}
                            className="w-full bg-surface border border-border focus:border-primary/40 rounded-lg px-2.5 py-1 text-xs outline-none"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-[10px] text-textSecondary">
                        <label className="flex items-center gap-1.5 cursor-pointer hover:text-textPrimary">
                          <input
                            type="checkbox"
                            checked={freeDelivery}
                            onChange={(e) => setFreeDelivery(e.target.checked)}
                            className="rounded text-primary border-border focus:ring-0 w-3.5 h-3.5"
                          />
                          Free Delivery
                        </label>
                        <label className="flex items-center gap-1.5 cursor-pointer hover:text-textPrimary">
                          <input
                            type="checkbox"
                            checked={buyOneGetOne}
                            onChange={(e) => setBuyOneGetOne(e.target.checked)}
                            className="rounded text-primary border-border focus:ring-0 w-3.5 h-3.5"
                          />
                          Buy 1 Get 1
                        </label>
                        <label className="flex items-center gap-1.5 cursor-pointer hover:text-textPrimary">
                          <input
                            type="checkbox"
                            checked={freeGift}
                            onChange={(e) => setFreeGift(e.target.checked)}
                            className="rounded text-primary border-border focus:ring-0 w-3.5 h-3.5"
                          />
                          Free Gift
                        </label>
                        <label className="flex items-center gap-1.5 cursor-pointer hover:text-textPrimary">
                          <input
                            type="checkbox"
                            checked={limitedTimeOffer}
                            onChange={(e) => setLimitedTimeOffer(e.target.checked)}
                            className="rounded text-primary border-border focus:ring-0 w-3.5 h-3.5"
                          />
                          Limited Offer
                        </label>
                      </div>

                      <div>
                        <label className="block text-[9px] font-extrabold text-textSecondary uppercase mb-1">Custom Offer / Slogan Text</label>
                        <textarea
                          placeholder="e.g. Weekend Combo BOGO, Free Consultation, Birthday Special Cake, Senior Citizen Discount..."
                          value={customOffer}
                          onChange={(e) => setCustomOffer(e.target.value)}
                          className="w-full bg-surface border border-border focus:border-primary/40 rounded-lg px-2.5 py-1 text-xs outline-none h-14 resize-none"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Location details */}
                <div className="border-t border-border pt-3 mt-3">
                  <label className="block text-[10px] font-extrabold tracking-wider text-textSecondary uppercase mb-1">Business Location</label>
                  <div className="grid grid-cols-3 gap-2">
                    <input
                      type="text"
                      placeholder="City"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full bg-sectionBackground border border-border focus:border-primary/40 rounded-xl px-2.5 py-1 text-xs outline-none"
                    />
                    <input
                      type="text"
                      placeholder="State"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="w-full bg-sectionBackground border border-border focus:border-primary/40 rounded-xl px-2.5 py-1 text-xs outline-none"
                    />
                    <input
                      type="text"
                      placeholder="Country"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="w-full bg-sectionBackground border border-border focus:border-primary/40 rounded-xl px-2.5 py-1 text-xs outline-none"
                    />
                  </div>
                </div>

                {/* Optimization Parameters */}
                <div className="grid grid-cols-3 gap-2 border-t border-border pt-3 mt-3">
                  <div>
                    <label className="block text-[9px] font-extrabold tracking-wider text-textSecondary uppercase mb-1">Length</label>
                    <select
                      value={contentLength}
                      onChange={(e) => setContentLength(e.target.value)}
                      className="w-full bg-sectionBackground border border-border focus:border-primary/40 rounded-xl px-2 py-1 text-xs outline-none"
                    >
                      <option value="Short">Short</option>
                      <option value="Medium">Medium</option>
                      <option value="Long">Long</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[9px] font-extrabold tracking-wider text-textSecondary uppercase mb-1">Emojis</label>
                    <select
                      value={emojiLevel}
                      onChange={(e) => setEmojiLevel(e.target.value)}
                      className="w-full bg-sectionBackground border border-border focus:border-primary/40 rounded-xl px-2 py-1 text-xs outline-none"
                    >
                      <option value="None">None</option>
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[9px] font-extrabold tracking-wider text-textSecondary uppercase mb-1">Creativity</label>
                    <select
                      value={creativity}
                      onChange={(e) => setCreativity(e.target.value)}
                      className="w-full bg-sectionBackground border border-border focus:border-primary/40 rounded-xl px-2 py-1 text-xs outline-none"
                    >
                      <option value="Low">Low</option>
                      <option value="Balanced">Balanced</option>
                      <option value="High">High</option>
                    </select>
                  </div>
                </div>

                {/* SEO Keywords section */}
                <div className="border-t border-border pt-3 mt-3 space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="block text-[10px] font-extrabold tracking-wider text-textSecondary uppercase">SEO Keywords (Max 15)</label>
                    <button
                      type="button"
                      onClick={handleSuggestKeywords}
                      disabled={loadingKeywords}
                      className="text-[9px] text-primary hover:text-primaryHover font-bold flex items-center gap-1 transition-all disabled:opacity-50"
                    >
                      <Sparkles className="w-2.5 h-2.5 animate-pulse" />
                      {loadingKeywords ? 'Searching...' : 'AI Keyword Suggestions'}
                    </button>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter keyword and press Enter..."
                      value={keywordInput}
                      onChange={(e) => setKeywordInput(e.target.value)}
                      onKeyDown={handleAddKeyword}
                      className="w-full bg-sectionBackground border border-border focus:border-primary/40 rounded-xl px-3 py-1 text-xs outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleAddKeyword}
                      className="bg-sectionBackground border border-border hover:bg-border text-textPrimary rounded-xl px-2.5 flex items-center justify-center transition-all"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {seoKeywords.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1 max-h-16 overflow-y-auto">
                      {seoKeywords.map((kw) => (
                        <span key={kw} className="inline-flex items-center gap-1 bg-primary/10 border border-primary/20 text-primary rounded-full px-2.5 py-0.5 text-[9px] font-semibold transition-all">
                          {kw}
                          <button type="button" onClick={() => handleRemoveKeyword(kw)}>
                            <X className="w-2.5 h-2.5 hover:text-danger text-textSecondary" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Generate Options Selection Panel */}
                <div className="border-t border-border pt-3 mt-3 space-y-2">
                  <label className="block text-[10px] font-extrabold tracking-wider text-textSecondary uppercase">Generate Options</label>
                  <div className="grid grid-cols-2 gap-2 bg-sectionBackground/30 border border-border rounded-xl p-3">
                    {[
                      ['caption', 'Caption'],
                      ['hashtags', 'Hashtags'],
                      ['posterPrompt', 'Poster Prompt'],
                      ['cta', 'CTA (Call To Action)'],
                      ['seoMetaDescription', 'SEO Meta Description'],
                      ['seoSuggestions', 'SEO Suggestions'],
                      ['keywords', 'Keywords'],
                      ['localSeo', 'Local SEO'],
                      ['gbpKeywords', 'GBP Keywords'],
                      ['trendingSearches', 'Trending Searches'],
                    ].map(([key, label]) => (
                      <label key={key} className="flex items-center gap-2 text-xs text-textPrimary font-semibold cursor-pointer hover:text-primary transition-all">
                        <input
                          type="checkbox"
                          checked={generateOptions[key]}
                          onChange={(e) => setGenerateOptions({ ...generateOptions, [key]: e.target.checked })}
                          className="rounded text-primary border-border focus:ring-0 w-3.5 h-3.5"
                        />
                        {label}
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sticky bottom Action Buttons */}
              <div className="absolute bottom-0 left-0 right-0 bg-surface border-t border-border rounded-b-2xl p-3 flex items-center justify-between gap-3 shadow-premium z-20">
                <button
                  type="button"
                  onClick={handleClear}
                  className="bg-transparent hover:bg-sectionBackground text-textSecondary hover:text-textPrimary px-3 py-2 rounded-xl text-xs font-bold transition-all"
                >
                  Reset Studio
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-primary to-accent hover:opacity-95 text-white font-extrabold text-xs tracking-wider px-5 py-2 rounded-xl shadow-premium transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      COMPILING PACK...
                    </>
                  ) : (
                    <>
                      <Zap className="w-3.5 h-3.5 fill-white animate-pulse" />
                      GENERATE CAMPAIGN
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Results Output Column */}
            <div className="lg:col-span-7 space-y-6">
              {loading ? (
                <div className="bg-surface border border-border rounded-2xl shadow-glass p-12 flex flex-col items-center justify-center text-center space-y-6 min-h-[500px]">
                  <div className="relative w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center border border-primary/20">
                    <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping" />
                    <div className="absolute inset-2 bg-primary/40 rounded-full animate-pulse flex items-center justify-center">
                      <Sparkles className="w-8 h-8 text-primary animate-pulse" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-textPrimary">Trendora Creative Engine Active</h3>
                    <p className="text-xs text-textSecondary italic animate-pulse max-w-sm mx-auto">
                      "{loadingMessage}"
                    </p>
                  </div>
                  <div className="w-64 bg-border h-1 rounded-full overflow-hidden">
                    <div className="bg-primary h-full animate-progressBar rounded-full" />
                  </div>
                </div>
              ) : result ? (
                <div className="space-y-6">
                  {/* Actions Header Bar */}
                  <div className="bg-surface border border-border rounded-2xl shadow-premium p-4 flex flex-wrap justify-between items-center gap-4">
                    <div className="flex items-center gap-2">
                      <div className="bg-primary/10 p-2 rounded-xl">
                        <Award className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-textPrimary">{result.campaignName}</h3>
                        <p className="text-[10px] text-textSecondary">Ready for deployment | {new Date(result.createdDate).toLocaleDateString()}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleCopyAll}
                        className="bg-sectionBackground hover:bg-border border border-border text-textPrimary text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all"
                      >
                        {copiedSection === 'all' ? <Check className="w-3.5 h-3.5 text-success" /> : <Copy className="w-3.5 h-3.5" />}
                        {copiedSection === 'all' ? 'Copied' : 'Copy All'}
                      </button>

                      <div className="relative group">
                        <button className="bg-primary hover:bg-primaryHover text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-1.5 transition-all shadow-[0_0_20px_rgba(124,58,237,0.3)] duration-200">
                          <Download className="w-4 h-4" />
                          Download Report
                          <ChevronDown className="w-3.5 h-3.5 opacity-60" />
                        </button>
                        <div className="absolute right-0 mt-2 w-56 bg-surface/95 border border-white/[0.08] backdrop-blur-xl rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.5)] opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none group-hover:pointer-events-auto z-30 py-1.5 text-xs">
                          <button onClick={handlePrintPdf} className="w-full text-left px-4 py-2.5 hover:bg-white/[0.04] font-semibold text-textSecondary hover:text-white flex items-center gap-2 transition-all">
                            <span>📄</span> Download as Professional PDF
                          </button>
                          <button onClick={handleDownloadDocx} className="w-full text-left px-4 py-2.5 hover:bg-white/[0.04] font-semibold text-textSecondary hover:text-white flex items-center gap-2 transition-all">
                            <span>📝</span> Download as Word (.docx)
                          </button>
                          <button onClick={handleDownloadTxt} className="w-full text-left px-4 py-2.5 hover:bg-white/[0.04] font-semibold text-textSecondary hover:text-white flex items-center gap-2 transition-all">
                            <span>📃</span> Download as Plain Text (.txt)
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Quality scorecard metrics grid — 4 items only */}
                  <div className="bg-surface border border-border rounded-2xl shadow-glass p-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-bold tracking-wider text-textSecondary uppercase">Campaign Quality Scorecard</h3>
                      <span className="text-[10px] text-textSecondary">AI-evaluated metrics</span>
                    </div>
                    <div className="grid grid-cols-4 gap-3">
                      {[
                        { label: 'Marketing', score: result.outputs?.marketingScore || 85, color: 'text-primary', bg: 'bg-primary/10 border-primary/20' },
                        { label: 'SEO Score', score: result.outputs?.seoScore || 90, color: 'text-blue-600', bg: 'bg-blue-50 border-blue-200' },
                        { label: 'Engagement', score: result.outputs?.engagementScore || 88, color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-200' },
                        { label: 'Local Visibility', score: result.outputs?.localVisibility || 92, color: 'text-amber-600', bg: 'bg-amber-50 border-amber-200' }
                      ].map((item, idx) => (
                        <div key={idx} className={`border rounded-xl p-3 text-center ${item.bg}`}>
                          <p className="text-[9px] font-bold text-textSecondary uppercase tracking-wide mb-1">{item.label}</p>
                          <p className={`text-2xl font-extrabold ${item.color}`}>{item.score}</p>
                          <p className="text-[9px] text-textSecondary mt-0.5">/100</p>
                        </div>
                      ))}
                    </div>

                    {/* Essential Insights */}
                    <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-xs pt-2 border-t border-border">
                      <div className="flex items-center gap-2 py-1">
                        <span className="text-textSecondary w-28 shrink-0">📊 Est. Reach:</span>
                        <strong className="text-textPrimary truncate">{result.outputs?.estimatedReach || '—'}</strong>
                      </div>
                      <div className="flex items-center gap-2 py-1">
                        <span className="text-textSecondary w-28 shrink-0">💰 Budget:</span>
                        <strong className="text-textPrimary truncate">{result.outputs?.suggestedBudget || '—'}</strong>
                      </div>
                      <div className="flex items-center gap-2 py-1">
                        <span className="text-textSecondary w-28 shrink-0">📅 Best Day:</span>
                        <strong className="text-textPrimary truncate">{result.outputs?.recommendedPostingDay || '—'}</strong>
                      </div>
                      <div className="flex items-center gap-2 py-1">
                        <span className="text-textSecondary w-28 shrink-0">⏰ Best Time:</span>
                        <strong className="text-textPrimary truncate">{result.outputs?.recommendedPostingTime || '—'}</strong>
                      </div>
                      <div className="flex items-center gap-2 py-1">
                        <span className="text-textSecondary w-28 shrink-0">🎯 CTA Review:</span>
                        <span className="text-primary font-semibold truncate">{result.outputs?.ctaReview || '—'}</span>
                      </div>
                      <div className="flex items-center gap-2 py-1">
                        <span className="text-textSecondary w-28 shrink-0">#️⃣ Hashtags:</span>
                        <span className="text-primary font-semibold truncate">{result.outputs?.hashtagReview || '—'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Copy card rendering — only selected platforms */}
                  <div className="space-y-4">
                    {(() => {
                      const selectedPlatforms = result.platforms || [];
                      const platformCards = [
                        { key: 'instagramCaption', label: 'Instagram Caption', icon: Instagram, platformId: 'Instagram', textarea: true },
                        { key: 'facebookCaption', label: 'Facebook Post Copy', icon: Facebook, platformId: 'Facebook', textarea: true },
                        { key: 'whatsappCaption', label: 'WhatsApp Broadcast', icon: MessageSquare, platformId: 'WhatsApp', textarea: true },
                        { key: 'googleBusinessDescription', label: 'Google Business Post', icon: Globe, platformId: 'Google Business Profile', textarea: true },
                        { key: 'linkedinCaption', label: 'LinkedIn Post Copy', icon: Linkedin, platformId: 'LinkedIn', textarea: true },
                        { key: 'twitterCaption', label: 'Twitter / X Post', icon: Twitter, platformId: 'Twitter(X)', textarea: true },
                      ].filter(c => selectedPlatforms.includes(c.platformId) && result.outputs?.[c.key]);

                      const posterPromptVal = `A premium, editorial local business marketing flyer for "${result.businessName || businessName || 'Our Business'}". Niche Category: ${result.businessCategory || businessCategory}. Campaign Theme: "${result.campaignName || campaignName || 'Special Promotion'}". Visual Vibe: Elegant, high-end cafe-inspired warm olive green and cream gold accents, soft organic branding, minimalist layout, professional food photography, Cormorant Garamond serif typography.`;

                      const allCards = [
                        { key: 'tagline', label: 'Campaign Tagline / Slogan', icon: Sparkles },
                        ...(generateOptions.caption ? platformCards : []),
                        ...(generateOptions.posterPrompt ? [{ key: 'posterPrompt', label: 'AI Poster Prompt', icon: FileText, isCustomValue: true, customVal: posterPromptVal }] : []),
                        ...(generateOptions.cta ? [{ key: 'callToAction', label: 'Call to Action (CTA)', icon: Compass }] : []),
                        ...(generateOptions.seoMetaDescription ? [{ key: 'seoDescription', label: 'SEO Meta Description', icon: Search }] : []),
                      ];

                      return allCards.map((card) => {
                        const value = card.isCustomValue ? card.customVal : (result.outputs?.[card.key] || '');
                        const isEditing = editingCard === card.key;
                        return (
                          <div key={card.key} className="bg-surface border border-border rounded-2xl p-4.5 shadow-premium space-y-2.5">
                            <div className="flex justify-between items-center">
                              <span className="flex items-center gap-1.5 text-xs font-bold text-textPrimary uppercase">
                                <card.icon className="w-4 h-4 text-primary" />
                                {card.label}
                              </span>
                              <div className="flex items-center gap-2">
                                {isEditing ? (
                                  <button
                                    onClick={saveEdit}
                                    className="text-xs bg-success text-white px-2 py-1 rounded hover:bg-success/95"
                                  >
                                    Save
                                  </button>
                                ) : (
                                  <>
                                    <button
                                      onClick={() => startEdit(card.key, value)}
                                      className="hover:bg-sectionBackground p-1.5 rounded-lg text-textSecondary hover:text-primary transition-all"
                                      title="Edit"
                                    >
                                      <Edit2 className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      onClick={() => copyToClipboard(value, card.key)}
                                      className="hover:bg-sectionBackground p-1.5 rounded-lg text-textSecondary hover:text-primary transition-all"
                                      title="Copy"
                                    >
                                      {copiedSection === card.key ? <Check className="w-3.5 h-3.5 text-success" /> : <Copy className="w-3.5 h-3.5" />}
                                    </button>
                                  </>
                                )}
                              </div>
                            </div>

                            {isEditing ? (
                              card.textarea ? (
                                <textarea
                                  value={editValue}
                                  onChange={(e) => setEditValue(e.target.value)}
                                  className="w-full bg-sectionBackground border border-border text-xs rounded-lg p-2.5 h-32 focus:outline-none focus:border-primary"
                                />
                              ) : (
                                <input
                                  type="text"
                                  value={editValue}
                                  onChange={(e) => setEditValue(e.target.value)}
                                  className="w-full bg-sectionBackground border border-border text-xs rounded-lg p-2 focus:outline-none focus:border-primary"
                                />
                              )
                            ) : (
                              <p className="text-xs text-textPrimary whitespace-pre-line bg-sectionBackground/30 p-3 rounded-lg border border-border/30">
                                {value}
                              </p>
                            )}
                          </div>
                        );
                      });
                    })()}

                    {/* SEO Metadata Suggestions */}
                    {generateOptions.seoSuggestions && (
                      <div className="bg-surface border border-border rounded-2xl p-5 shadow-premium space-y-4">
                        <div className="flex justify-between items-center border-b border-border pb-2">
                          <span className="text-xs font-bold text-textPrimary uppercase">AI SEO Suggestion Board</span>
                          <button
                            onClick={() => copyToClipboard(`Title: ${result.outputs?.seoTitle}\nDescription: ${result.outputs?.seoDescription}`, 'seo')}
                            className="hover:bg-sectionBackground p-1.5 rounded-lg text-textSecondary hover:text-primary transition-all"
                          >
                            {copiedSection === 'seo' ? <Check className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4" />}
                          </button>
                        </div>
                        <div className="space-y-4 text-xs">
                          {generateOptions.keywords && (
                            <>
                              <div>
                                <p className="text-textSecondary font-bold mb-1 uppercase text-[10px]">Primary Focus Keyword</p>
                                <p className="text-textPrimary font-semibold border-l-2 border-primary pl-2">{result.outputs?.primaryKeyword || result.outputs?.seoKeywords?.[0] || 'Local Cafe'}</p>
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <p className="text-textSecondary font-bold mb-1 uppercase text-[10px]">Secondary Keywords</p>
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {(result.outputs?.secondaryKeywords || result.outputs?.seoKeywords?.slice(1, 4) || []).map(kw => (
                                      <span key={kw} className="bg-sectionBackground border px-2 py-0.5 rounded text-[9px] text-textSecondary">{kw}</span>
                                    ))}
                                  </div>
                                </div>
                                <div>
                                  <p className="text-textSecondary font-bold mb-1 uppercase text-[10px]">Long-Tail Phrases</p>
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {(result.outputs?.longTailKeywords || result.outputs?.seoKeywords?.slice(4, 7) || []).map(kw => (
                                      <span key={kw} className="bg-sectionBackground border px-2 py-0.5 rounded text-[9px] text-textSecondary">{kw}</span>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </>
                          )}
                          <div className="grid grid-cols-2 gap-4">
                            {generateOptions.localSeo && (
                              <div>
                                <p className="text-textSecondary font-bold mb-1 uppercase text-[10px]">Local SEO Mappings</p>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {(result.outputs?.localSeoKeywords || [city || 'Nearby', `${city || 'Local'} Cafe`]).map(kw => (
                                    <span key={kw} className="bg-sectionBackground border px-2 py-0.5 rounded text-[9px] text-textSecondary">{kw}</span>
                                  ))}
                                </div>
                              </div>
                            )}
                            {generateOptions.gbpKeywords && (
                              <div>
                                <p className="text-textSecondary font-bold mb-1 uppercase text-[10px]">GBP Keywords</p>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {(result.outputs?.gbpKeywords || [`best cafe in ${city || 'my area'}`, 'cafe reviews']).map(kw => (
                                    <span key={kw} className="bg-sectionBackground border px-2 py-0.5 rounded text-[9px] text-textSecondary">{kw}</span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                          {generateOptions.trendingSearches && (
                            <div>
                              <p className="text-textSecondary font-bold mb-1 uppercase text-[10px]">Trending Searches</p>
                              <div className="flex flex-wrap gap-1.5 mt-1">
                                {(result.outputs?.trendingKeywords || ['special promotion', 'cafe deals']).map(kw => (
                                  <span key={kw} className="bg-blue-50 text-blue-800 px-2 py-0.5 rounded text-[9px] font-bold">{kw}</span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Hashtags Card */}
                    {generateOptions.hashtags && (
                      <div className="bg-surface border border-border rounded-2xl p-5 shadow-premium space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-bold text-textPrimary uppercase">15 Viral Hashtags</span>
                          <button
                            onClick={() => copyToClipboard(result.outputs?.hashtags?.join(' '), 'hashtags')}
                            className="hover:bg-sectionBackground p-1.5 rounded-lg text-textSecondary hover:text-primary transition-all"
                          >
                            {copiedSection === 'hashtags' ? <Check className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4" />}
                          </button>
                        </div>
                        <p className="text-xs text-primary font-bold tracking-wide">
                          {result.outputs?.hashtags?.join(' ')}
                        </p>
                      </div>
                    )}

                    {/* AI Recommendations */}
                    <div className="bg-surface border border-border rounded-2xl p-6 shadow-premium space-y-6">
                      <h4 className="text-xs font-bold text-textSecondary uppercase tracking-wider">AI Marketing Recommendations</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                        <div className="space-y-4">
                          <div>
                            <p className="font-bold text-textPrimary mb-1.5">🎯 Recommended Improvement Items</p>
                            <ul className="list-disc pl-4 text-textSecondary space-y-1.5">
                              {result.outputs?.improvementSuggestions?.map((imp, idx) => (
                                <li key={idx}>{imp}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <div>
                            <p className="font-bold text-textPrimary mb-1.5">💡 Marketing Insights Summary</p>
                            <p className="bg-sectionBackground p-3 rounded-lg border border-border text-textSecondary leading-relaxed">
                              {result.outputs?.marketingInsights}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-surface/50 border border-border/80 border-dashed rounded-2xl p-12 flex flex-col items-center justify-center text-center space-y-4 min-h-[500px]">
                  <Compass className="w-12 h-12 text-textSecondary/50 animate-bounce" />
                  <div>
                    <h3 className="text-base font-bold text-textPrimary">Your Campaign Output Awaits</h3>
                    <p className="text-xs text-textSecondary mt-1 max-w-xs mx-auto">
                      Fill out your configurations in the studio options side and hit Generate Campaign to build content with Llama 3.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Campaign History tab rendering */}
        {activeTab === 'history' && (
          <div className="space-y-6">
            <div className="bg-surface border border-border rounded-2xl shadow-glass p-4 flex flex-wrap gap-4 items-center justify-between">
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative w-64">
                  <Search className="absolute left-3 top-2.5 w-4 h-4 text-textSecondary" />
                  <input
                    type="text"
                    placeholder="Search by name, category..."
                    value={historySearch}
                    onChange={(e) => setHistorySearch(e.target.value)}
                    className="w-full bg-sectionBackground border border-border rounded-xl pl-9 pr-4 py-1.5 text-xs text-textPrimary placeholder:text-textSecondary/60 outline-none"
                  />
                </div>

                <select
                  value={historyPlatform}
                  onChange={(e) => setHistoryPlatform(e.target.value)}
                  className="bg-sectionBackground border border-border rounded-xl px-3 py-1.5 text-xs text-textPrimary outline-none"
                >
                  <option value="All">All Platforms</option>
                  <option value="Instagram">Instagram</option>
                  <option value="Facebook">Facebook</option>
                  <option value="WhatsApp">WhatsApp</option>
                  <option value="Google Business Profile">Google Business</option>
                  <option value="LinkedIn">LinkedIn</option>
                </select>

                <div className="flex border border-border rounded-xl p-0.5 bg-sectionBackground">
                  <button
                    onClick={() => setHistoryTab('active')}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold ${historyTab === 'active' ? 'bg-primary text-white' : 'text-textSecondary'}`}
                  >
                    Active
                  </button>
                  <button
                    onClick={() => setHistoryTab('archived')}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold ${historyTab === 'archived' ? 'bg-primary text-white' : 'text-textSecondary'}`}
                  >
                    Archived
                  </button>
                </div>
              </div>

              <select
                value={historySort}
                onChange={(e) => setHistorySort(e.target.value)}
                className="bg-sectionBackground border border-border rounded-xl px-3 py-1.5 text-xs text-textPrimary outline-none"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="alphabetical">Name A-Z</option>
              </select>
            </div>

            {activeFilteredHistory.length > 0 ? (
              <div className="bg-surface border border-border rounded-2xl shadow-glass overflow-hidden">
                <table className="w-full border-collapse text-left text-xs">
                  <thead>
                    <tr className="bg-sectionBackground/75 border-b border-border/80 text-textSecondary uppercase font-bold tracking-wider">
                      <th className="py-3 px-4">Campaign Title</th>
                      <th className="py-3 px-4">Business Details</th>
                      <th className="py-3 px-4">Generated Date</th>
                      <th className="py-3 px-4">Platforms</th>
                      <th className="py-3 px-4 text-center">Favourite</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activeFilteredHistory.map((item) => (
                      <tr key={item.id} className="border-b border-border/50 hover:bg-sectionBackground/30 transition-all">
                        <td className="py-3.5 px-4 font-bold text-textPrimary">
                          <div className="flex items-center gap-2">
                            {item.campaignName}
                            {item.archived && <span className="bg-danger/10 text-danger text-[9px] px-1.5 py-0.5 rounded font-bold">Archived</span>}
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <p className="font-semibold text-textPrimary">{item.businessName}</p>
                          <p className="text-[10px] text-textSecondary">{item.businessCategory}</p>
                        </td>
                        <td className="py-3.5 px-4 text-textSecondary">
                          {new Date(item.createdDate).toLocaleDateString()}
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex gap-1.5 flex-wrap">
                            {item.platforms?.map(p => (
                              <span key={p} className="bg-border/50 text-textPrimary px-2 py-0.5 rounded text-[9px] font-bold">{p}</span>
                            ))}
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <button
                            onClick={() => toggleFavorite(item.id, item.favourite)}
                            className="p-1 rounded hover:bg-sectionBackground transition-all"
                          >
                            <Star className={`w-4 h-4 ${item.favourite ? 'text-amber-500 fill-amber-500' : 'text-textSecondary/50'}`} />
                          </button>
                        </td>
                        <td className="py-3.5 px-4 text-right space-x-2">
                          <button
                            onClick={() => handleViewAgain(item)}
                            className="bg-primary/10 text-primary hover:bg-primary/20 text-[10px] font-bold px-3 py-1.5 rounded-lg transition-all"
                          >
                            View
                          </button>
                          <button
                            onClick={() => handleDuplicate(item.id)}
                            className="bg-sectionBackground hover:bg-border text-textPrimary text-[10px] font-bold px-3 py-1.5 rounded-lg border border-border transition-all"
                          >
                            Duplicate
                          </button>
                          <button
                            onClick={() => toggleArchive(item.id, item.archived)}
                            className="text-textSecondary hover:bg-sectionBackground p-1.5 rounded-lg transition-all"
                            title={item.archived ? 'Activate Campaign' : 'Archive Campaign'}
                          >
                            <Archive className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="text-danger hover:bg-danger/10 p-1.5 rounded-lg transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="py-12 text-center text-textSecondary text-xs">
                No campaigns found. Go to "Marketing Studio" to generate your first campaign pack!
              </div>
            )}
          </div>
        )}

        {/* Analytics Tab Render */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="bg-surface border border-border rounded-2xl p-6 shadow-glass space-y-6">
              <div className="flex items-center gap-2 border-b border-border pb-3">
                <BarChart3 className="w-5 h-5 text-primary" />
                <h3 className="text-base font-bold text-textPrimary">Analytics Scorecard</h3>
              </div>

              {analyticsData ? (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="bg-sectionBackground border border-border rounded-xl p-5 shadow-premium">
                    <p className="text-[10px] font-bold text-textSecondary uppercase tracking-wider">Total Generations</p>
                    <p className="text-3xl font-extrabold text-textPrimary mt-2">{analyticsData.totalAI}</p>
                    <div className="text-[10px] text-success font-semibold flex items-center gap-1 mt-1">
                      High volume capacity
                    </div>
                  </div>

                  <div className="bg-sectionBackground border border-border rounded-xl p-5 shadow-premium">
                    <p className="text-[10px] font-bold text-textSecondary uppercase tracking-wider">Total Reports Exported</p>
                    <p className="text-3xl font-extrabold text-textPrimary mt-2">{analyticsData.totalReports}</p>
                    <div className="text-[10px] text-textSecondary font-semibold flex items-center gap-1 mt-1">
                      PDF, DOCX format
                    </div>
                  </div>

                  <div className="bg-sectionBackground border border-border rounded-xl p-5 shadow-premium">
                    <p className="text-[10px] font-bold text-textSecondary uppercase tracking-wider">Top Target Platform</p>
                    <p className="text-xl font-bold text-textPrimary mt-2">{analyticsData.mostUsedPlatform}</p>
                    <div className="text-[10px] text-textSecondary font-semibold mt-1 font-semibold">Highest frequency</div>
                  </div>

                  <div className="bg-sectionBackground border border-border rounded-xl p-5 shadow-premium">
                    <p className="text-[10px] font-bold text-textSecondary uppercase tracking-wider">Primary Business Niche</p>
                    <p className="text-lg font-bold text-textPrimary mt-2 truncate">{analyticsData.mostUsedCategory}</p>
                    <div className="text-[10px] text-textSecondary font-semibold mt-1 font-semibold">Active category</div>
                  </div>
                </div>
              ) : (
                <div className="py-8 text-center text-xs text-textSecondary">Loading analytics data...</div>
              )}
            </div>

            {analyticsData && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-surface border border-border rounded-2xl p-6 shadow-premium space-y-4">
                  <h4 className="text-xs font-bold text-textSecondary uppercase font-bold">Recent Studio Activity</h4>
                  <div className="space-y-3">
                    {analyticsData.recentActivity?.length > 0 ? (
                      analyticsData.recentActivity.map((act) => (
                        <div key={act.id} className="flex justify-between items-center border-b border-border/50 pb-2 text-xs">
                          <div>
                            <p className="font-bold text-textPrimary">{act.campaignName}</p>
                            <p className="text-[10px] text-textSecondary">{act.businessName}</p>
                          </div>
                          <p className="text-[10px] text-textSecondary font-semibold">
                            {new Date(act.createdDate).toLocaleDateString()}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-textSecondary py-4">No recent activity logs.</p>
                    )}
                  </div>
                </div>

                <div className="bg-surface border border-border rounded-2xl p-6 shadow-premium space-y-4">
                  <h4 className="text-xs font-bold text-textSecondary uppercase font-bold">Top Targeted SEO Keywords</h4>
                  <div className="space-y-4">
                    <p className="text-xs text-textSecondary">Frequently typed tags by your brand campaigns:</p>
                    <div className="flex flex-wrap gap-2">
                      {analyticsData.mostUsedKeywords !== 'None' ? (
                        analyticsData.mostUsedKeywords.split(', ').map(kw => (
                          <span key={kw} className="bg-primary/5 border border-primary/20 text-primary rounded-full px-3 py-1 text-xs font-bold tracking-wide">
                            {kw}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-textSecondary">No keywords configured yet.</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
