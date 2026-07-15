import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Card from '../components/UI/Card.jsx';
import Button from '../components/UI/Button.jsx';
import Input from '../components/UI/Input.jsx';
import Badge from '../components/UI/Badge.jsx';
import Modal from '../components/UI/Modal.jsx';
import EmptyState from '../components/UI/EmptyState.jsx';
import { addToast } from '../store/uiSlice.js';
import { useDispatch } from 'react-redux';
import { Plus, Search, Megaphone, DollarSign, Calendar, ShieldAlert } from 'lucide-react';
import api from '../services/api.js';

export const Ads = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const [ads, setAds] = useState([]);
  const [businesses, setBusinesses] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [budget, setBudget] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [status, setStatus] = useState('PENDING');
  const [businessId, setBusinessId] = useState('');
  const [campaignId, setCampaignId] = useState('');

  const fetchAds = async () => {
    setLoading(true);
    try {
      const response = await api.get('/api/ads');
      setAds(response.data.data || []);
    } catch (err) {
      if (!err.response) {
        const local = localStorage.getItem('demo_ads');
        if (local) setAds(JSON.parse(local));
      } else {
        dispatch(addToast({ type: 'error', message: 'Failed to fetch ads' }));
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchBusinessesAndCampaigns = async () => {
    try {
      const [bizRes, aiRes] = await Promise.all([
        api.get('/api/businesses'),
        api.get('/api/ai/history')
      ]);

      const bizData = bizRes.data.data || [];
      setBusinesses(bizData);
      if (bizData.length > 0) {
        setBusinessId(bizData[0].id);
      }

      setCampaigns(aiRes.data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAds();
    fetchBusinessesAndCampaigns();
  }, []);

  // Listen for navigation state from Poster Designer
  useEffect(() => {
    if (location.state?.campaignId && campaigns.length > 0) {
      const c = campaigns.find(item => item.id === location.state.campaignId);
      if (c) {
        setCampaignId(c.id);
        prefillFromCampaign(c);
      }
      setIsCreateOpen(true);
    }
  }, [location.state, campaigns]);

  const prefillFromCampaign = (campaign) => {
    setTitle(campaign.campaignName);
    setDescription(campaign.outputs?.instagramCaption || campaign.outputs?.tagline || '');
    
    // Parse suggested budget (e.g. "$150 - $300" -> 150)
    let parsedBudget = 100;
    const aiBudgetStr = campaign.outputs?.suggestedBudget;
    if (aiBudgetStr) {
      const numbers = aiBudgetStr.match(/\d+/g);
      if (numbers && numbers.length > 0) {
        parsedBudget = parseInt(numbers[0]);
      }
    }
    setBudget(parsedBudget.toString());

    // Default dates
    const today = new Date().toISOString().split('T')[0];
    const nextWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    setStartDate(today);
    setEndDate(nextWeek);
  };

  const handleCampaignChange = (e) => {
    const id = e.target.value;
    setCampaignId(id);
    if (!id) {
      setTitle('');
      setDescription('');
      setBudget('');
      return;
    }
    const c = campaigns.find(item => item.id === id);
    if (c) prefillFromCampaign(c);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!title || !budget || !startDate || !endDate) {
      dispatch(addToast({ type: 'warning', message: 'Please fill in all fields' }));
      return;
    }

    if (!businessId) {
      dispatch(addToast({ type: 'warning', message: 'Please select a business profile first' }));
      return;
    }

    const payload = { 
      title, 
      description,
      budget: parseFloat(budget), 
      startDate, 
      endDate, 
      status, 
      businessId,
      campaignId: campaignId || null
    };

    try {
      await api.post('/api/ads', payload);
      dispatch(addToast({ type: 'success', message: 'Ad campaign launched successfully!' }));
      setIsCreateOpen(false);
      resetForm();
      fetchAds();
    } catch (err) {
      if (!err.response) {
        const newAd = { id: `ad-${Date.now()}`, ...payload };
        const updated = [newAd, ...ads];
        setAds(updated);
        localStorage.setItem('demo_ads', JSON.stringify(updated));
        dispatch(addToast({ type: 'success', message: 'Demo Mode: Ad created locally!' }));
        setIsCreateOpen(false);
        resetForm();
      } else {
        const msg = err.response?.data?.error?.message || 'Failed to create ad';
        dispatch(addToast({ type: 'error', message: msg }));
      }
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setBudget('');
    setStartDate('');
    setEndDate('');
    setStatus('PENDING');
    setCampaignId('');
  };

  const filteredAds = ads.filter(a => a.title.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="flex flex-col gap-6 w-full text-textPrimary">
      <div className="flex items-center justify-between border-b border-border pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Ads Management</h1>
          <p className="text-xs text-textSecondary">Launch and manage localized advertising initiatives with pre-filled AI copy.</p>
        </div>
        <Button variant="primary" icon={Plus} onClick={() => setIsCreateOpen(true)}>Create Ad</Button>
      </div>

      <Card className="bg-surface border border-border">
        <Card.Content className="flex items-center gap-4 py-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-textSecondary" />
            <input
              type="text"
              placeholder="Search advertisements..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-border rounded-lg bg-background text-textPrimary focus:outline-none focus:border-primary"
            />
          </div>
        </Card.Content>
      </Card>

      {filteredAds.length === 0 ? (
        <EmptyState title="No Ads found" description="Get started by creating your first promotional advertisement." actionLabel="Create Ad" onAction={() => setIsCreateOpen(true)} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAds.map((ad) => (
            <Card key={ad.id} className="hover:shadow-premium border-border/80 hover:border-primary/20 transition-all duration-300">
              <Card.Header className="flex justify-between items-start">
                <div className="p-2.5 bg-primary/5 rounded-xl border border-primary/10">
                  <Megaphone className="w-5 h-5 text-primary" />
                </div>
                <Badge variant={ad.status === 'ACTIVE' || ad.status === 'RUNNING' ? 'success' : ad.status === 'PENDING' ? 'warning' : 'neutral'}>
                  {ad.status}
                </Badge>
              </Card.Header>
              <Card.Content className="flex flex-col gap-4 py-4">
                <h3 className="text-sm font-bold text-textPrimary leading-tight">{ad.title}</h3>
                {ad.description && <p className="text-xs text-textSecondary line-clamp-3 bg-sectionBackground/30 p-2 rounded border border-border/40">{ad.description}</p>}
                
                <div className="flex flex-col gap-2 text-xs text-textSecondary">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-3.5 h-3.5" />
                    <span>Budget: <strong className="text-textPrimary">${ad.budget}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Duration: {new Date(ad.startDate).toLocaleDateString()} to {new Date(ad.endDate).toLocaleDateString()}</span>
                  </div>
                </div>
              </Card.Content>
            </Card>
          ))}
        </div>
      )}

      <Modal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} title="Create Promotion Ad">
        <form onSubmit={handleCreate} className="flex flex-col gap-4">
          
          {businesses.length === 0 ? (
            <div className="p-3.5 bg-amber-50 border border-amber-200 text-amber-800 text-xs rounded-xl flex items-center gap-2.5">
              <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Please add a business profile first before launching advertisements.</span>
            </div>
          ) : (
            <>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-textSecondary">Target Business Profile *</label>
                <select
                  value={businessId}
                  onChange={(e) => setBusinessId(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-surface text-textPrimary focus:outline-none focus:border-primary"
                  required
                >
                  {businesses.map((b) => (
                    <option key={b.id} value={b.id}>{b.name} ({b.category})</option>
                  ))}
                </select>
              </div>

              {/* Campaign integration selector */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-textSecondary">Select AI Campaign (Autofill values)</label>
                <select
                  value={campaignId}
                  onChange={handleCampaignChange}
                  className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-surface text-textPrimary focus:outline-none focus:border-primary"
                >
                  <option value="">-- Choose Campaign --</option>
                  {campaigns.map((c) => (
                    <option key={c.id} value={c.id}>{c.campaignName} ({c.businessCategory})</option>
                  ))}
                </select>
              </div>
            </>
          )}

          <Input label="Ad Title *" placeholder="e.g. 20% Off Weekend Special" value={title} onChange={(e) => setTitle(e.target.value)} required />
          
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-textSecondary">Ad Description Copy</label>
            <textarea
              placeholder="Ad copy parameters..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-sectionBackground border border-border focus:border-primary rounded-lg p-2.5 text-xs outline-none h-20 resize-none text-textPrimary"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input label="Budget ($) *" type="number" placeholder="100.00" value={budget} onChange={(e) => setBudget(e.target.value)} required />
            
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-textSecondary">Ad Campaign Status *</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-surface text-textPrimary focus:outline-none"
              >
                <option value="DRAFT">DRAFT</option>
                <option value="PENDING">PENDING</option>
                <option value="RUNNING">RUNNING</option>
                <option value="COMPLETED">COMPLETED</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input label="Start Date *" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
            <Input label="End Date *" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} required />
          </div>

          <div className="flex justify-end gap-3 mt-4 border-t border-border pt-4">
            <Button type="button" variant="secondary" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary" disabled={businesses.length === 0}>Launch Ad</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Ads;
