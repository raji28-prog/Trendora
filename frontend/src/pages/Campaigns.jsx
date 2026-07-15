import React, { useState, useEffect } from 'react';
import Card from '../components/UI/Card.jsx';
import Button from '../components/UI/Button.jsx';
import Input from '../components/UI/Input.jsx';
import Badge from '../components/UI/Badge.jsx';
import Modal from '../components/UI/Modal.jsx';
import EmptyState from '../components/UI/EmptyState.jsx';
import Select from '../components/UI/Select.jsx';
import { addToast } from '../store/uiSlice.js';
import { useDispatch } from 'react-redux';
import { Plus, Search, Target, Megaphone } from 'lucide-react';
import api from '../services/api.js';

export const Campaigns = () => {
  const dispatch = useDispatch();
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Form states
  const [name, setName] = useState('');
  const [type, setType] = useState('EMAIL');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [status, setStatus] = useState('DRAFT');

  const fetchCampaigns = async () => {
    setLoading(true);
    try {
      const response = await api.get('/api/campaigns');
      setCampaigns(response.data.data || []);
    } catch (err) {
      if (!err.response) {
        const local = localStorage.getItem('demo_campaigns');
        if (local) {
          setCampaigns(JSON.parse(local));
        } else {
          const defaultCamps = [
            { id: 'camp-1', name: 'Summer Local Loyalty Drive', type: 'EMAIL', startDate: '2026-07-01', endDate: '2026-07-20', status: 'RUNNING' },
            { id: 'camp-2', name: 'SMS Discount Blast', type: 'SMS', startDate: '2026-07-15', endDate: '2026-07-16', status: 'DRAFT' }
          ];
          localStorage.setItem('demo_campaigns', JSON.stringify(defaultCamps));
          setCampaigns(defaultCamps);
        }
      } else {
        dispatch(addToast({ type: 'error', message: 'Failed to fetch campaigns' }));
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name || !startDate || !endDate) {
      dispatch(addToast({ type: 'warning', message: 'Please fill in all fields' }));
      return;
    }

    const payload = { name, type, startDate, endDate, status };

    try {
      await api.post('/api/campaigns', payload);
      dispatch(addToast({ type: 'success', message: 'Campaign created successfully!' }));
      setIsCreateOpen(false);
      fetchCampaigns();
    } catch (err) {
      if (!err.response) {
        const newCamp = { id: `camp-${Date.now()}`, name, type, startDate, endDate, status };
        const updated = [newCamp, ...campaigns];
        setCampaigns(updated);
        localStorage.setItem('demo_campaigns', JSON.stringify(updated));
        dispatch(addToast({ type: 'success', message: 'Demo Mode: Campaign created successfully!' }));
        setIsCreateOpen(false);
      } else {
        dispatch(addToast({ type: 'error', message: 'Failed to create campaign' }));
      }
    }
  };

  const filteredCamps = campaigns.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="flex flex-col gap-6 w-full pb-10">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest">
            <Megaphone className="w-4 h-4 text-purple-400" /> Channel Manager
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">Campaign Tracking</h1>
          <p className="text-xs text-textSecondary">Manage and coordinate multi-channel marketing campaigns.</p>
        </div>
        <Button variant="primary" icon={Plus} onClick={() => setIsCreateOpen(true)}>Create Campaign</Button>
      </div>

      <Card>
        <Card.Content className="flex items-center gap-4 py-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-textSecondary" />
            <input
              type="text"
              placeholder="Search campaigns..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm rounded-lg bg-white/[0.04] border border-white/10 text-white placeholder-textSecondary/40 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
            />
          </div>
        </Card.Content>
      </Card>

      {filteredCamps.length === 0 ? (
        <EmptyState title="No Campaigns found" description="Build cohesive marketing initiatives using email, SMS, or social outlets." actionLabel="Create Campaign" onAction={() => setIsCreateOpen(true)} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCamps.map((camp) => (
            <Card key={camp.id} className="hover:border-primary/30 border-white/[0.06] transition-all duration-300">
              <Card.Header className="flex justify-between items-start">
                <div className="p-2.5 bg-purple-500/10 border border-purple-500/20 rounded-xl text-purple-400 shadow-[0_0_12px_rgba(168,85,247,0.15)]">
                  <Target className="w-5 h-5" />
                </div>
                <Badge variant={camp.status === 'RUNNING' ? 'success' : camp.status === 'COMPLETED' ? 'primary' : 'neutral'}>
                  {camp.status}
                </Badge>
              </Card.Header>
              <Card.Content className="flex flex-col gap-4 p-5">
                <h3 className="text-sm font-bold text-white leading-tight">{camp.name}</h3>
                
                <div className="flex items-center justify-between text-xs text-textSecondary border-t border-white/[0.06] pt-3 font-medium">
                  <span className="bg-purple-500/20 border border-purple-500/30 text-purple-300 px-2.5 py-0.5 rounded text-[9px] font-black uppercase tracking-widest">{camp.type}</span>
                  <span>{camp.startDate} &rarr; {camp.endDate}</span>
                </div>
              </Card.Content>
            </Card>
          ))}
        </div>
      )}

      <Modal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} title="Create Campaign">
        <form onSubmit={handleCreate} className="flex flex-col gap-4">
          <Input label="Campaign Name" placeholder="e.g. VIP Christmas Special" value={name} onChange={(e) => setName(e.target.value)} required />
          
          <Select
            label="Campaign Channel"
            value={type}
            onChange={(e) => setType(e.target.value)}
            options={[
              { value: 'EMAIL', label: 'Email Newsletters' },
              { value: 'SMS', label: 'SMS Marketing' },
              { value: 'SOCIAL', label: 'Social Media Ads' }
            ]}
          />

          <Input label="Start Date" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
          <Input label="End Date" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} required />

          <div className="flex justify-end gap-3 mt-4 border-t border-white/[0.06] pt-4">
            <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
            <Button type="submit">Launch Campaign</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Campaigns;
