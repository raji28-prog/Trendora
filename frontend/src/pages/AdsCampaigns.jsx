import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import Card from '../components/UI/Card.jsx';
import Button from '../components/UI/Button.jsx';
import Input from '../components/UI/Input.jsx';
import Badge from '../components/UI/Badge.jsx';
import Modal from '../components/UI/Modal.jsx';
import EmptyState from '../components/UI/EmptyState.jsx';
import { addToast } from '../store/uiSlice.js';
import { useDispatch } from 'react-redux';
import { useSelectedBusiness } from '../store/useSelectedBusiness.js';
import {
  Plus, Search, Target, Megaphone, DollarSign, Calendar,
  BarChart3, Download, FileText, TrendingUp, Eye, Layers,
  AlertCircle, RefreshCw, Globe, Instagram, Facebook,
  Twitter, Linkedin, CheckCircle2, Clock, XCircle
} from 'lucide-react';
import api from '../services/api.js';

const TABS = [
  { id: 'campaigns', label: 'Campaigns', icon: Target },
  { id: 'ads', label: 'Ads', icon: Megaphone },
  { id: 'performance', label: 'Performance & Reports', icon: BarChart3 },
];

const PLATFORMS = [
  { id: 'INSTAGRAM', label: 'Instagram', Icon: Instagram, color: '#E1306C' },
  { id: 'FACEBOOK', label: 'Facebook', Icon: Facebook, color: '#1877F2' },
  { id: 'TWITTER', label: 'Twitter / X', Icon: Twitter, color: '#1DA1F2' },
  { id: 'LINKEDIN', label: 'LinkedIn', Icon: Linkedin, color: '#0A66C2' },
  { id: 'GOOGLE', label: 'Google Ads', Icon: Globe, color: '#4285F4' },
];

const STATUS_STYLES = {
  RUNNING: { variant: 'success', icon: CheckCircle2 },
  ACTIVE:  { variant: 'success', icon: CheckCircle2 },
  DRAFT:   { variant: 'neutral', icon: Clock },
  PENDING: { variant: 'warning', icon: Clock },
  COMPLETED:{ variant: 'primary', icon: CheckCircle2 },
  PAUSED:  { variant: 'neutral', icon: XCircle },
};

function NoBizBanner() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20">
      <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center">
        <AlertCircle className="w-7 h-7 text-amber-500" />
      </div>
      <div className="text-center">
        <h3 className="text-base font-bold text-textPrimary">No Business Selected</h3>
        <p className="text-sm text-textSecondary mt-1">
          Use the business selector in the header to choose a business profile first.
        </p>
      </div>
    </div>
  );
}

// ─── Campaigns Tab ──────────────────────────────────────────────────────────

function CampaignsTab({ businessId }) {
  const dispatch = useDispatch();
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Form
  const [name, setName] = useState('');
  const [type, setType] = useState('SOCIAL');
  const [platforms, setPlatforms] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [budget, setBudget] = useState('');
  const [status, setStatus] = useState('DRAFT');

  const fetch = async () => {
    if (!businessId) return;
    setLoading(true);
    try {
      const res = await api.get('/api/campaigns');
      setCampaigns(res.data.data || []);
    } catch (err) {
      if (!err.response) {
        const local = localStorage.getItem(`demo_campaigns_${businessId}`);
        setCampaigns(local ? JSON.parse(local) : []);
      } else {
        dispatch(addToast({ type: 'error', message: 'Failed to fetch campaigns' }));
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetch(); }, [businessId]);

  const togglePlatform = (pid) => {
    setPlatforms(prev => prev.includes(pid) ? prev.filter(p => p !== pid) : [...prev, pid]);
  };

  const resetForm = () => {
    setName(''); setType('SOCIAL'); setPlatforms([]);
    setStartDate(''); setEndDate(''); setBudget(''); setStatus('DRAFT');
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name || !startDate || !endDate) {
      dispatch(addToast({ type: 'warning', message: 'Fill in all required fields' }));
      return;
    }
    const payload = { name, type, startDate, endDate, budget: budget ? parseFloat(budget) : undefined, status, businessId, platforms };
    try {
      await api.post('/api/campaigns', payload);
      dispatch(addToast({ type: 'success', message: 'Campaign created!' }));
      setIsOpen(false);
      resetForm();
      fetch();
    } catch (err) {
      if (!err.response) {
        const newC = { id: `camp-${Date.now()}`, ...payload };
        const updated = [newC, ...campaigns];
        setCampaigns(updated);
        localStorage.setItem(`demo_campaigns_${businessId}`, JSON.stringify(updated));
        dispatch(addToast({ type: 'success', message: 'Campaign created (demo)!' }));
        setIsOpen(false);
        resetForm();
      } else {
        dispatch(addToast({ type: 'error', message: err.response?.data?.error?.message || 'Failed to create campaign' }));
      }
    }
  };

  const filtered = campaigns.filter(c => c.name?.toLowerCase().includes(searchTerm.toLowerCase()));

  if (!businessId) return <NoBizBanner />;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <p className="text-xs text-textSecondary">Create and manage multi-channel marketing campaigns.</p>
        <Button variant="primary" icon={Plus} onClick={() => setIsOpen(true)}>New Campaign</Button>
      </div>

      <Card>
        <Card.Content className="flex items-center gap-4 py-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-textSecondary" />
            <input
              type="text"
              placeholder="Search campaigns..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-border rounded-lg bg-background text-textPrimary focus:outline-none focus:border-primary"
            />
          </div>
        </Card.Content>
      </Card>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1,2,3].map(n => <Card key={n} className="animate-pulse h-32" />)}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState title="No Campaigns yet" description="Build cohesive marketing initiatives across platforms." actionLabel="New Campaign" onAction={() => setIsOpen(true)} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(camp => {
            const s = STATUS_STYLES[camp.status] || STATUS_STYLES.DRAFT;
            const SIcon = s.icon;
            return (
              <Card key={camp.id} className="hover:shadow-premium border-border/80 hover:border-primary/20 transition-all duration-300">
                <Card.Header className="flex justify-between items-start">
                  <div className="p-2.5 bg-primary/5 rounded-xl border border-primary/10">
                    <Target className="w-5 h-5 text-primary" />
                  </div>
                  <Badge variant={s.variant}>
                    <SIcon className="w-3 h-3 mr-1 inline" />{camp.status}
                  </Badge>
                </Card.Header>
                <Card.Content className="flex flex-col gap-3 py-4">
                  <h3 className="text-sm font-bold text-textPrimary leading-tight">{camp.name}</h3>
                  <div className="flex items-center justify-between text-xs text-textSecondary border-t border-border pt-3">
                    <span className="bg-primary/5 text-primary font-semibold px-2 py-0.5 rounded text-[10px]">{camp.type}</span>
                    <span>{camp.startDate} → {camp.endDate}</span>
                  </div>
                  {camp.budget && (
                    <div className="flex items-center gap-1.5 text-xs text-textSecondary">
                      <DollarSign className="w-3.5 h-3.5" />
                      <span>Budget: <strong className="text-textPrimary">${camp.budget}</strong></span>
                    </div>
                  )}
                </Card.Content>
              </Card>
            );
          })}
        </div>
      )}

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Create Campaign">
        <form onSubmit={handleCreate} className="flex flex-col gap-4">
          <Input label="Campaign Name *" placeholder="e.g. Summer Festival Drive" value={name} onChange={e => setName(e.target.value)} required />

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-textSecondary">Campaign Type *</label>
            <select value={type} onChange={e => setType(e.target.value)} className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-surface text-textPrimary focus:outline-none focus:border-primary">
              <option value="SOCIAL">Social Media</option>
              <option value="EMAIL">Email Newsletter</option>
              <option value="SMS">SMS Marketing</option>
              <option value="GOOGLE">Google Ads</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-textSecondary">Platform Selection</label>
            <div className="flex flex-wrap gap-2">
              {PLATFORMS.map(p => {
                const active = platforms.includes(p.id);
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => togglePlatform(p.id)}
                    style={active ? { borderColor: p.color, color: p.color, background: p.color + '10' } : {}}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-semibold transition-all ${active ? '' : 'border-border text-textSecondary hover:border-primary/30'}`}
                  >
                    <p.Icon className="w-3.5 h-3.5" />{p.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input label="Start Date *" type="date" value={startDate} onChange={e => setStartDate(e.target.value)} required />
            <Input label="End Date *" type="date" value={endDate} onChange={e => setEndDate(e.target.value)} required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input label="Budget ($)" type="number" placeholder="e.g. 500" value={budget} onChange={e => setBudget(e.target.value)} />
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-textSecondary">Status</label>
              <select value={status} onChange={e => setStatus(e.target.value)} className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-surface text-textPrimary focus:outline-none focus:border-primary">
                <option value="DRAFT">DRAFT</option>
                <option value="PENDING">PENDING</option>
                <option value="RUNNING">RUNNING</option>
                <option value="COMPLETED">COMPLETED</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-2 border-t border-border pt-4">
            <Button type="button" variant="secondary" onClick={() => setIsOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary">Launch Campaign</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

// ─── Ads Tab ─────────────────────────────────────────────────────────────────

function AdsTab({ businessId }) {
  const dispatch = useDispatch();
  const location = useLocation();
  const [ads, setAds] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Form
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [budget, setBudget] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [status, setStatus] = useState('PENDING');
  const [campaignId, setCampaignId] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);

  const fetchAll = async () => {
    if (!businessId) return;
    setLoading(true);
    try {
      const [adsRes, aiRes] = await Promise.all([
        api.get('/api/ads'),
        api.get('/api/ai/history'),
      ]);
      setAds(adsRes.data.data || []);
      setCampaigns(aiRes.data.data || []);
    } catch (err) {
      if (!err.response) {
        const local = localStorage.getItem(`demo_ads_${businessId}`);
        setAds(local ? JSON.parse(local) : []);
      } else {
        dispatch(addToast({ type: 'error', message: 'Failed to fetch ads' }));
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, [businessId]);

  // Prefill from navigation state (coming from Poster Designer)
  useEffect(() => {
    if (location.state?.campaignId && campaigns.length > 0) {
      const c = campaigns.find(item => item.id === location.state.campaignId);
      if (c) prefillFromCampaign(c);
      setIsOpen(true);
    }
  }, [location.state, campaigns]);

  const prefillFromCampaign = (campaign) => {
    setTitle(campaign.campaignName || '');
    setDescription(campaign.outputs?.instagramCaption || campaign.outputs?.tagline || '');
    const nums = campaign.outputs?.suggestedBudget?.match(/\d+/g);
    setBudget(nums ? nums[0] : '100');
    const today = new Date().toISOString().split('T')[0];
    const next = new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0];
    setStartDate(today); setEndDate(next);
  };

  const togglePlatform = (pid) => {
    setSelectedPlatforms(prev => prev.includes(pid) ? prev.filter(p => p !== pid) : [...prev, pid]);
  };

  const resetForm = () => {
    setTitle(''); setDescription(''); setBudget('');
    setStartDate(''); setEndDate(''); setStatus('PENDING');
    setCampaignId(''); setSelectedPlatforms([]);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!title || !budget || !startDate || !endDate) {
      dispatch(addToast({ type: 'warning', message: 'Please fill in all required fields' }));
      return;
    }
    const payload = {
      title, description, budget: parseFloat(budget),
      startDate, endDate, status, businessId,
      campaignId: campaignId || null,
      platforms: selectedPlatforms,
    };
    try {
      await api.post('/api/ads', payload);
      dispatch(addToast({ type: 'success', message: 'Ad launched successfully!' }));
      setIsOpen(false); resetForm(); fetchAll();
    } catch (err) {
      if (!err.response) {
        const newAd = { id: `ad-${Date.now()}`, ...payload };
        const updated = [newAd, ...ads];
        setAds(updated);
        localStorage.setItem(`demo_ads_${businessId}`, JSON.stringify(updated));
        dispatch(addToast({ type: 'success', message: 'Ad created (demo)!' }));
        setIsOpen(false); resetForm();
      } else {
        dispatch(addToast({ type: 'error', message: err.response?.data?.error?.message || 'Failed to create ad' }));
      }
    }
  };

  const filtered = ads.filter(a => a.title?.toLowerCase().includes(searchTerm.toLowerCase()));

  if (!businessId) return <NoBizBanner />;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <p className="text-xs text-textSecondary">Launch and manage localized advertising initiatives with AI-generated copy.</p>
        <Button variant="primary" icon={Plus} onClick={() => setIsOpen(true)}>Create Ad</Button>
      </div>

      <Card>
        <Card.Content className="flex items-center gap-4 py-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-textSecondary" />
            <input
              type="text"
              placeholder="Search advertisements..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-border rounded-lg bg-background text-textPrimary focus:outline-none focus:border-primary"
            />
          </div>
        </Card.Content>
      </Card>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1,2,3].map(n => <Card key={n} className="animate-pulse h-40" />)}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState title="No Ads yet" description="Create your first promotional advertisement." actionLabel="Create Ad" onAction={() => setIsOpen(true)} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(ad => {
            const s = STATUS_STYLES[ad.status] || STATUS_STYLES.PENDING;
            const SIcon = s.icon;
            return (
              <Card key={ad.id} className="hover:shadow-premium border-border/80 hover:border-primary/20 transition-all duration-300">
                <Card.Header className="flex justify-between items-start">
                  <div className="p-2.5 bg-primary/5 rounded-xl border border-primary/10">
                    <Megaphone className="w-5 h-5 text-primary" />
                  </div>
                  <Badge variant={s.variant}>
                    <SIcon className="w-3 h-3 mr-1 inline" />{ad.status}
                  </Badge>
                </Card.Header>
                <Card.Content className="flex flex-col gap-4 py-4">
                  <h3 className="text-sm font-bold text-textPrimary leading-tight">{ad.title}</h3>
                  {ad.description && (
                    <p className="text-xs text-textSecondary line-clamp-2 bg-sectionBackground/30 p-2 rounded border border-border/40">{ad.description}</p>
                  )}
                  <div className="flex flex-col gap-1.5 text-xs text-textSecondary">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-3.5 h-3.5" />
                      <span>Budget: <strong className="text-textPrimary">${ad.budget}</strong></span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{new Date(ad.startDate).toLocaleDateString()} → {new Date(ad.endDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                </Card.Content>
              </Card>
            );
          })}
        </div>
      )}

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Create Promotion Ad">
        <form onSubmit={handleCreate} className="flex flex-col gap-4">
          {campaigns.length > 0 && (
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-textSecondary">Link AI Campaign (autofill values)</label>
              <select value={campaignId} onChange={e => {
                setCampaignId(e.target.value);
                const c = campaigns.find(x => x.id === e.target.value);
                if (c) prefillFromCampaign(c);
              }} className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-surface text-textPrimary focus:outline-none focus:border-primary">
                <option value="">-- Choose AI Campaign --</option>
                {campaigns.map(c => <option key={c.id} value={c.id}>{c.campaignName}</option>)}
              </select>
            </div>
          )}

          <Input label="Ad Title *" placeholder="e.g. 20% Off Weekend Special" value={title} onChange={e => setTitle(e.target.value)} required />

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-textSecondary">Ad Description / Copy</label>
            <textarea
              placeholder="Enter ad copy..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full bg-sectionBackground border border-border focus:border-primary rounded-lg p-2.5 text-xs outline-none h-20 resize-none text-textPrimary"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-textSecondary">Platform Selection</label>
            <div className="flex flex-wrap gap-2">
              {PLATFORMS.map(p => {
                const active = selectedPlatforms.includes(p.id);
                return (
                  <button key={p.id} type="button" onClick={() => togglePlatform(p.id)}
                    style={active ? { borderColor: p.color, color: p.color, background: p.color + '12' } : {}}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-semibold transition-all ${active ? '' : 'border-border text-textSecondary hover:border-primary/30'}`}
                  >
                    <p.Icon className="w-3.5 h-3.5" />{p.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input label="Budget ($) *" type="number" placeholder="100.00" value={budget} onChange={e => setBudget(e.target.value)} required />
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-textSecondary">Status *</label>
              <select value={status} onChange={e => setStatus(e.target.value)} className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-surface text-textPrimary focus:outline-none">
                <option value="DRAFT">DRAFT</option>
                <option value="PENDING">PENDING</option>
                <option value="RUNNING">RUNNING</option>
                <option value="COMPLETED">COMPLETED</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input label="Start Date *" type="date" value={startDate} onChange={e => setStartDate(e.target.value)} required />
            <Input label="End Date *" type="date" value={endDate} onChange={e => setEndDate(e.target.value)} required />
          </div>

          <div className="flex justify-end gap-3 mt-2 border-t border-border pt-4">
            <Button type="button" variant="secondary" onClick={() => setIsOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary">Launch Ad</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

// ─── Performance Tab ──────────────────────────────────────────────────────────

function PerformanceTab({ businessId, selectedBusiness }) {
  const [ads, setAds] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(false);
  const reportRef = useRef(null);

  const fetchData = async () => {
    if (!businessId) return;
    setLoading(true);
    try {
      const [adsRes, campRes] = await Promise.all([
        api.get('/api/ads'),
        api.get('/api/campaigns'),
      ]);
      setAds(adsRes.data.data || []);
      setCampaigns(campRes.data.data || []);
    } catch {
      const localAds = localStorage.getItem(`demo_ads_${businessId}`);
      const localCamps = localStorage.getItem(`demo_campaigns_${businessId}`);
      if (localAds) setAds(JSON.parse(localAds));
      if (localCamps) setCampaigns(JSON.parse(localCamps));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [businessId]);

  const handleExportPDF = () => {
    window.print();
  };

  const handleExportReport = () => {
    const lines = [
      `PERFORMANCE REPORT — ${selectedBusiness?.name || 'Business'}`,
      `Generated: ${new Date().toLocaleString()}`,
      `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
      '',
      `CAMPAIGNS (${campaigns.length} total)`,
      ...campaigns.map(c => `  • ${c.name} | ${c.type} | ${c.status} | ${c.startDate} → ${c.endDate}${c.budget ? ` | Budget: $${c.budget}` : ''}`),
      '',
      `ADS (${ads.length} total)`,
      ...ads.map(a => `  • ${a.title} | Budget: $${a.budget} | ${a.status} | ${new Date(a.startDate).toLocaleDateString()} → ${new Date(a.endDate).toLocaleDateString()}`),
      '',
      `SUMMARY`,
      `  Total Campaigns: ${campaigns.length}`,
      `  Running Campaigns: ${campaigns.filter(c => c.status === 'RUNNING').length}`,
      `  Total Ads: ${ads.length}`,
      `  Total Ad Spend: $${ads.reduce((s, a) => s + (a.budget || 0), 0).toFixed(2)}`,
      `  Active Ads: ${ads.filter(a => a.status === 'RUNNING' || a.status === 'ACTIVE').length}`,
    ];

    const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `trendora-report-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!businessId) return <NoBizBanner />;

  const totalBudget = ads.reduce((s, a) => s + (a.budget || 0), 0);
  const runningCamps = campaigns.filter(c => c.status === 'RUNNING').length;
  const activeAds = ads.filter(a => a.status === 'RUNNING' || a.status === 'ACTIVE').length;
  const completedAds = ads.filter(a => a.status === 'COMPLETED').length;

  const stats = [
    { label: 'Total Campaigns', value: campaigns.length, icon: Target, color: 'text-primary', bg: 'bg-primary/5', border: 'border-primary/10' },
    { label: 'Running Now', value: runningCamps, icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
    { label: 'Total Ads', value: ads.length, icon: Megaphone, color: 'text-violet-600', bg: 'bg-violet-50', border: 'border-violet-100' },
    { label: 'Active Ads', value: activeAds, icon: Eye, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' },
    { label: 'Completed', value: completedAds, icon: CheckCircle2, color: 'text-slate-600', bg: 'bg-slate-50', border: 'border-slate-100' },
    { label: 'Total Ad Spend', value: `$${totalBudget.toFixed(0)}`, icon: DollarSign, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100' },
  ];

  return (
    <div ref={reportRef} className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-textSecondary">
            Summary for <strong className="text-textPrimary">{selectedBusiness?.name}</strong>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" icon={RefreshCw} onClick={fetchData}>Refresh</Button>
          <Button variant="secondary" icon={FileText} onClick={handleExportReport}>Export Report (.txt)</Button>
          <Button variant="primary" icon={Download} onClick={handleExportPDF}>Export PDF</Button>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[1,2,3,4,5,6].map(n => <Card key={n} className="animate-pulse h-24" />)}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {stats.map(s => {
              const Icon = s.icon;
              return (
                <Card key={s.label} className={`border ${s.border} ${s.bg}`}>
                  <Card.Content className="flex items-center gap-4 py-5">
                    <div className={`p-2.5 rounded-xl ${s.bg} border ${s.border}`}>
                      <Icon className={`w-5 h-5 ${s.color}`} />
                    </div>
                    <div>
                      <div className={`text-2xl font-extrabold ${s.color}`}>{s.value}</div>
                      <div className="text-xs text-textSecondary font-medium">{s.label}</div>
                    </div>
                  </Card.Content>
                </Card>
              );
            })}
          </div>

          {campaigns.length > 0 && (
            <Card>
              <Card.Header>
                <h3 className="text-sm font-bold text-textPrimary flex items-center gap-2">
                  <Layers className="w-4 h-4 text-primary" /> Campaign Breakdown
                </h3>
              </Card.Header>
              <Card.Content>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-textSecondary">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-2 font-semibold text-textPrimary">Campaign</th>
                        <th className="text-left py-2 font-semibold text-textPrimary">Type</th>
                        <th className="text-left py-2 font-semibold text-textPrimary">Duration</th>
                        <th className="text-left py-2 font-semibold text-textPrimary">Budget</th>
                        <th className="text-left py-2 font-semibold text-textPrimary">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {campaigns.map(c => {
                        const s = STATUS_STYLES[c.status] || STATUS_STYLES.DRAFT;
                        return (
                          <tr key={c.id} className="border-b border-border/50 hover:bg-sectionBackground/50 transition-colors">
                            <td className="py-2.5 font-medium text-textPrimary">{c.name}</td>
                            <td className="py-2.5"><span className="bg-primary/5 text-primary px-2 py-0.5 rounded text-[10px] font-bold">{c.type}</span></td>
                            <td className="py-2.5">{c.startDate} → {c.endDate}</td>
                            <td className="py-2.5">{c.budget ? `$${c.budget}` : '—'}</td>
                            <td className="py-2.5"><Badge variant={s.variant}>{c.status}</Badge></td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </Card.Content>
            </Card>
          )}

          {ads.length > 0 && (
            <Card>
              <Card.Header>
                <h3 className="text-sm font-bold text-textPrimary flex items-center gap-2">
                  <Megaphone className="w-4 h-4 text-primary" /> Ad Performance
                </h3>
              </Card.Header>
              <Card.Content>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-textSecondary">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-2 font-semibold text-textPrimary">Ad Title</th>
                        <th className="text-left py-2 font-semibold text-textPrimary">Budget</th>
                        <th className="text-left py-2 font-semibold text-textPrimary">Duration</th>
                        <th className="text-left py-2 font-semibold text-textPrimary">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ads.map(ad => {
                        const s = STATUS_STYLES[ad.status] || STATUS_STYLES.PENDING;
                        return (
                          <tr key={ad.id} className="border-b border-border/50 hover:bg-sectionBackground/50 transition-colors">
                            <td className="py-2.5 font-medium text-textPrimary">{ad.title}</td>
                            <td className="py-2.5 text-emerald-600 font-bold">${ad.budget}</td>
                            <td className="py-2.5">{new Date(ad.startDate).toLocaleDateString()} → {new Date(ad.endDate).toLocaleDateString()}</td>
                            <td className="py-2.5"><Badge variant={s.variant}>{ad.status}</Badge></td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </Card.Content>
            </Card>
          )}

          {campaigns.length === 0 && ads.length === 0 && (
            <EmptyState title="No performance data yet" description="Create campaigns and ads to see your performance summary here." />
          )}
        </>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AdsCampaigns() {
  const [activeTab, setActiveTab] = useState('campaigns');
  const { selectedBusinessId, selectedBusiness } = useSelectedBusiness();

  return (
    <div className="flex flex-col gap-6 w-full text-textPrimary">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 border-b border-border pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Ads & Campaign Manager
          </h1>
          <p className="text-xs text-textSecondary mt-1">
            {selectedBusiness
              ? <>Managing for <strong className="text-textPrimary">{selectedBusiness.name}</strong></>
              : 'Select a business from the header to get started'}
          </p>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 bg-sectionBackground border border-border rounded-xl p-1">
          {TABS.map(tab => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                  active
                    ? 'bg-surface text-primary shadow-sm border border-border'
                    : 'text-textSecondary hover:text-textPrimary'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'campaigns' && <CampaignsTab businessId={selectedBusinessId} />}
      {activeTab === 'ads' && <AdsTab businessId={selectedBusinessId} />}
      {activeTab === 'performance' && <PerformanceTab businessId={selectedBusinessId} selectedBusiness={selectedBusiness} />}
    </div>
  );
}
