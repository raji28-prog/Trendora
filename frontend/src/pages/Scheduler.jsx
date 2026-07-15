import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useSelectedBusiness } from '../store/useSelectedBusiness.js';
import Card from '../components/UI/Card.jsx';
import Button from '../components/UI/Button.jsx';
import Badge from '../components/UI/Badge.jsx';
import Input from '../components/UI/Input.jsx';
import Select from '../components/UI/Select.jsx';
import Textarea from '../components/UI/Textarea.jsx';
import Modal from '../components/UI/Modal.jsx';
import EmptyState from '../components/UI/EmptyState.jsx';
import { 
  Building, AlertCircle, Calendar, Sparkles, Trash2, 
  Clock, CheckCircle, XCircle, Share2, Plus 
} from 'lucide-react';

const PLATFORMS = [
  { id: 'INSTAGRAM', label: 'Instagram', color: '#E1306C', emoji: '📸' },
  { id: 'FACEBOOK', label: 'Facebook', color: '#1877F2', emoji: '📘' },
  { id: 'TWITTER', label: 'X / Twitter', color: '#1DA1F2', emoji: '🐦' },
  { id: 'LINKEDIN', label: 'LinkedIn', color: '#0A66C2', emoji: '💼' }
];

export default function Scheduler() {
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedBusinessId, selectedBusiness, businesses } = useSelectedBusiness();

  const [posts, setPosts] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ content: '', platform: 'INSTAGRAM', scheduledFor: '', campaignId: '' });
  const [error, setError] = useState('');

  const load = async () => {
    if (!selectedBusinessId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const [pRes, aiRes] = await Promise.all([
        api.get('/api/scheduler'), 
        api.get('/api/ai/history')
      ]);
      
      const allPosts = pRes.data.data || [];
      const filteredPosts = allPosts.filter(p => p.businessId === selectedBusinessId);
      setPosts(filteredPosts);
      
      const allCampaigns = aiRes.data.data || [];
      const filteredCampaigns = allCampaigns.filter(c => !c.businessId || c.businessId === selectedBusinessId);
      setCampaigns(filteredCampaigns);
    } catch { 
      setError('Failed to load posts and campaigns'); 
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, [selectedBusinessId]);

  // Listen for navigation state from Poster Designer
  useEffect(() => {
    if (location.state?.campaignId && campaigns.length > 0) {
      const c = campaigns.find(item => item.id === location.state.campaignId);
      if (c) {
        setForm(prev => ({
          ...prev,
          campaignId: c.id,
          content: location.state.captionText || c.outputs?.instagramCaption || ''
        }));
      }
      setShowModal(true);
    }
  }, [location.state, campaigns]);

  const prefillFromCampaign = (campaign, targetPlatform) => {
    const pl = targetPlatform || form.platform;
    let caption = '';

    if (pl === 'INSTAGRAM') caption = campaign.outputs?.instagramCaption;
    else if (pl === 'FACEBOOK') caption = campaign.outputs?.facebookCaption;
    else if (pl === 'LINKEDIN') caption = campaign.outputs?.linkedinCaption;
    else if (pl === 'TWITTER') caption = campaign.outputs?.promotionalSms;
    else caption = campaign.outputs?.whatsappCaption || campaign.outputs?.tagline;

    if (campaign.outputs?.hashtags && Array.isArray(campaign.outputs.hashtags)) {
      caption += '\n\n' + campaign.outputs.hashtags.slice(0, 5).join(' ');
    }
    if (campaign.outputs?.callToAction) {
      caption += '\n\n' + campaign.outputs.callToAction;
    }

    setForm(prev => ({
      ...prev,
      content: caption || '',
      campaignId: campaign.id
    }));
  };

  const handleCampaignChange = (e) => {
    const id = e.target.value;
    setForm(prev => ({ ...prev, campaignId: id }));
    if (!id) {
      setForm(prev => ({ ...prev, content: '' }));
      return;
    }
    const c = campaigns.find(item => item.id === id);
    if (c) prefillFromCampaign(c, form.platform);
  };

  const handlePlatformSelect = (platformId) => {
    setForm(prev => {
      const updated = { ...prev, platform: platformId };
      if (prev.campaignId) {
        const c = campaigns.find(item => item.id === prev.campaignId);
        if (c) {
          let caption = '';
          if (platformId === 'INSTAGRAM') caption = c.outputs?.instagramCaption;
          else if (platformId === 'FACEBOOK') caption = c.outputs?.facebookCaption;
          else if (platformId === 'LINKEDIN') caption = c.outputs?.linkedinCaption;
          else if (platformId === 'TWITTER') caption = c.outputs?.promotionalSms;
          else caption = c.outputs?.whatsappCaption || c.outputs?.tagline;

          if (c.outputs?.hashtags && Array.isArray(c.outputs.hashtags)) {
            caption += '\n\n' + c.outputs.hashtags.slice(0, 5).join(' ');
          }
          if (c.outputs?.callToAction) {
            caption += '\n\n' + c.outputs.callToAction;
          }
          updated.content = caption || '';
        }
      }
      return updated;
    });
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!selectedBusinessId) {
      setError('Please select a business profile first');
      return;
    }
    try {
      await api.post('/api/scheduler', {
        content: form.content,
        platform: form.platform,
        scheduledFor: form.scheduledFor,
        businessId: selectedBusinessId,
        campaignId: form.campaignId || undefined
      });
      setShowModal(false);
      setForm({ content: '', platform: 'INSTAGRAM', scheduledFor: '', campaignId: '' });
      load();
    } catch { 
      setError('Failed to schedule post'); 
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this post from queue?')) return;
    try { 
      await api.delete(`/api/scheduler/${id}`); 
      load(); 
    } catch { 
      setError('Failed to remove post'); 
    }
  };

  if (!selectedBusinessId) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4">
        <div className="mb-8">
          <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest">
            <Calendar className="w-4 h-4 text-purple-400" /> Content Queue
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight mt-1">Social Media Scheduler</h1>
          <p className="text-xs text-textSecondary">Schedule and manage your social media content calendar</p>
        </div>

        <Card className="p-12 text-center flex flex-col items-center justify-center min-h-[340px]">
          <div className="w-16 h-16 rounded-3xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center mb-6 shadow-lg shadow-purple-500/5">
            <Calendar className="w-8 h-8" />
          </div>
          {businesses.length === 0 ? (
            <>
              <h3 className="text-lg font-bold text-white">No Businesses Found</h3>
              <p className="text-xs text-textSecondary max-w-sm mt-2 leading-relaxed font-light">
                Create your first business to schedule social media posts.
              </p>
              <Button
                onClick={() => navigate('/businesses')}
                className="mt-6"
              >
                + Add Business
              </Button>
            </>
          ) : (
            <>
              <h3 className="text-lg font-bold text-white">No Business Selected</h3>
              <p className="text-xs text-textSecondary max-w-sm mt-2 leading-relaxed font-light">
                Use the business selector in the header to choose which business to view scheduler for.
              </p>
            </>
          )}
        </Card>
      </div>
    );
  }

  const upcoming = posts.filter(p => p.status === 'SCHEDULED');
  const published = posts.filter(p => p.status === 'PUBLISHED');
  const failed = posts.filter(p => p.status === 'FAILED');

  return (
    <div className="flex flex-col gap-6 w-full pb-16">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest">
            <Calendar className="w-4 h-4 text-purple-400" /> Content Queue
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight mt-1">Social Media Scheduler</h1>
          <p className="text-xs text-textSecondary">
            Managing schedule for <strong className="text-white font-semibold">{selectedBusiness?.name}</strong>
          </p>
        </div>
        <Button icon={Plus} onClick={() => setShowModal(true)}>
          Schedule Post
        </Button>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4" /> {error}
        </div>
      )}

      {/* Platform Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {PLATFORMS.map(pl => {
          const count = posts.filter(p => p.platform === pl.id).length;
          return (
            <Card key={pl.id} className="p-5 flex flex-col items-center justify-center text-center border-white/[0.06] hover:border-primary/20 transition-all duration-300">
              <div className="text-2xl mb-2">{pl.emoji}</div>
              <div className="text-2xl font-black text-white" style={{ color: pl.color }}>{count}</div>
              <div className="text-[10px] text-textSecondary font-bold uppercase tracking-wider mt-1">{pl.label}</div>
            </Card>
          );
        })}
      </div>

      {/* Queue Sections */}
      {loading ? (
        <Card className="flex items-center justify-center p-12 min-h-[300px]">
          <span className="text-sm text-textSecondary font-semibold">Loading scheduler queues...</span>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Upcoming Posts List */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-textSecondary flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" /> Scheduled Queue ({upcoming.length})
            </h3>
            
            {upcoming.length === 0 ? (
              <EmptyState 
                title="No posts scheduled" 
                description="Your content queue is empty. Use the post generator or editor to schedule content."
                actionLabel="Create Scheduled Post"
                onAction={() => setShowModal(true)}
              />
            ) : (
              <div className="flex flex-col gap-4">
                {upcoming.map(post => {
                  const pl = PLATFORMS.find(p => p.id === post.platform) || PLATFORMS[0];
                  return (
                    <Card key={post.id} className="p-5 flex gap-4 border-white/[0.06] hover:border-primary/10 transition-all duration-300">
                      <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center text-2xl shrink-0">
                        {pl.emoji}
                      </div>
                      <div className="flex-1 flex flex-col gap-2">
                        <div className="flex justify-between items-start gap-4">
                          <div>
                            <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: pl.color }}>
                              {pl.label}
                            </span>
                            <p className="text-xs text-white leading-relaxed mt-1 font-light">{post.content}</p>
                          </div>
                          <button 
                            onClick={() => handleDelete(post.id)}
                            className="p-1 text-textSecondary hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 rounded-lg transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="flex items-center gap-4 text-[10px] text-textSecondary font-medium border-t border-white/[0.04] pt-2 mt-1">
                          <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-purple-400" /> {new Date(post.scheduledFor).toLocaleString()}</span>
                          <Badge variant="primary">{post.status}</Badge>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>

          {/* Stats Breakdowns Side Panel */}
          <div className="flex flex-col gap-6">
            <Card className="border-white/[0.06] p-5">
              <h3 className="text-xs font-black uppercase tracking-wider text-textSecondary mb-4">Delivery Overview</h3>
              <div className="flex flex-col gap-3">
                {[
                  { label: 'Scheduled', count: upcoming.length, color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20', icon: Clock },
                  { label: 'Published', count: published.length, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', icon: CheckCircle },
                  { label: 'Failed Attempts', count: failed.length, color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20', icon: XCircle }
                ].map(stat => (
                  <div key={stat.label} className={`flex justify-between items-center p-3 rounded-xl border ${stat.bg} ${stat.border}`}>
                    <div className="flex items-center gap-2">
                      <stat.icon className={`w-4 h-4 ${stat.color}`} />
                      <span className="text-xs font-bold text-white">{stat.label}</span>
                    </div>
                    <span className={`text-base font-black ${stat.color}`}>{stat.count}</span>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="relative overflow-hidden p-6 border-white/[0.06] bg-gradient-to-br from-purple-500/5 via-transparent to-transparent">
              <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center mb-4">
                <Sparkles className="w-5 h-5" />
              </div>
              <h4 className="text-xs font-black uppercase tracking-wider text-white mb-2">Best Posting Times</h4>
              <p className="text-xs text-textSecondary leading-relaxed font-light">
                Our AI model indicates optimal click-through rates at:
              </p>
              <div className="mt-3 space-y-1.5 text-xs text-textSecondary font-medium">
                <div className="flex justify-between"><span>📸 Instagram</span> <span className="text-white">11 AM, 2 PM</span></div>
                <div className="flex justify-between"><span>📘 Facebook</span> <span className="text-white">9 AM, 1 PM</span></div>
                <div className="flex justify-between"><span>💼 LinkedIn</span> <span className="text-white">10 AM, 4 PM</span></div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* Schedule Post Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Schedule New Post">
        <form onSubmit={handleCreate} className="flex flex-col gap-4">
          
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-textSecondary">Platform</label>
            <div className="grid grid-cols-4 gap-2">
              {PLATFORMS.map(pl => {
                const isSelected = form.platform === pl.id;
                return (
                  <button 
                    type="button" 
                    key={pl.id} 
                    onClick={() => handlePlatformSelect(pl.id)} 
                    className={`p-2.5 rounded-xl border flex flex-col items-center gap-1.5 transition-all ${
                      isSelected 
                        ? 'border-purple-500/50 bg-purple-500/10 text-white' 
                        : 'border-white/10 bg-white/[0.02] text-textSecondary hover:border-white/20'
                    }`}
                  >
                    <span className="text-xl">{pl.emoji}</span>
                    <span className="text-[9px] font-black uppercase tracking-wider">{pl.label.split(' ')[0]}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <Select 
            label="Autofill from AI Campaign"
            value={form.campaignId}
            onChange={handleCampaignChange}
            options={[
              { value: '', label: '-- Select Campaign --' },
              ...campaigns.map(c => ({
                value: c.id,
                label: `${c.campaignName || 'Campaign'} (${c.businessCategory || 'General'})`
              }))
            ]}
          />

          <Textarea 
            label="Post Content"
            value={form.content}
            onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
            required
            rows={4}
            placeholder="Write your post content..."
          />

          <Input 
            label="Schedule For"
            type="datetime-local"
            value={form.scheduledFor}
            onChange={e => setForm(f => ({ ...f, scheduledFor: e.target.value }))}
            required
          />

          <div className="flex justify-end gap-3 mt-4 border-t border-white/[0.06] pt-4">
            <Button type="button" variant="outline" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button type="submit">Schedule Post</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
