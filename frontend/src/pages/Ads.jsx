import React, { useState, useEffect } from 'react';
import Card from '../components/UI/Card.jsx';
import Button from '../components/UI/Button.jsx';
import Input from '../components/UI/Input.jsx';
import Badge from '../components/UI/Badge.jsx';
import Modal from '../components/UI/Modal.jsx';
import EmptyState from '../components/UI/EmptyState.jsx';
import { addToast } from '../store/uiSlice.js';
import { useDispatch } from 'react-redux';
import { Plus, Search, Megaphone, DollarSign, Calendar, Sliders } from 'lucide-react';
import api from '../services/api.js';

export const Ads = () => {
  const dispatch = useDispatch();
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Form states
  const [title, setTitle] = useState('');
  const [budget, setBudget] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [status, setStatus] = useState('PENDING');

  const fetchAds = async () => {
    setLoading(true);
    try {
      const response = await api.get('/api/ads');
      setAds(response.data.data || []);
    } catch (err) {
      if (!err.response) {
        // Offline mock
        const local = localStorage.getItem('demo_ads');
        if (local) {
          setAds(JSON.parse(local));
        } else {
          const defaultAds = [
            { id: 'ad-1', title: 'Summer Coffee Special BOGO', budget: 150.00, startDate: '2026-07-01', endDate: '2026-07-31', status: 'ACTIVE' },
            { id: 'ad-2', title: 'Bonsai Tree Weekend Sale', budget: 80.00, startDate: '2026-07-10', endDate: '2026-07-12', status: 'PENDING' }
          ];
          localStorage.setItem('demo_ads', JSON.stringify(defaultAds));
          setAds(defaultAds);
        }
      } else {
        dispatch(addToast({ type: 'error', message: 'Failed to fetch ads' }));
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAds();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!title || !budget || !startDate || !endDate) {
      dispatch(addToast({ type: 'warning', message: 'Please fill in all fields' }));
      return;
    }

    const payload = { title, budget: parseFloat(budget), startDate, endDate, status };

    try {
      await api.post('/api/ads', payload);
      dispatch(addToast({ type: 'success', message: 'Ad created successfully!' }));
      setIsCreateOpen(false);
      fetchAds();
    } catch (err) {
      if (!err.response) {
        const newAd = { id: `ad-${Date.now()}`, title, budget: parseFloat(budget), startDate, endDate, status };
        const updated = [newAd, ...ads];
        setAds(updated);
        localStorage.setItem('demo_ads', JSON.stringify(updated));
        dispatch(addToast({ type: 'success', message: 'Demo Mode: Ad created successfully!' }));
        setIsCreateOpen(false);
      } else {
        dispatch(addToast({ type: 'error', message: 'Failed to create ad' }));
      }
    }
  };

  const filteredAds = ads.filter(a => a.title.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-textPrimary">Ads Management</h1>
          <p className="text-xs text-textSecondary">Launch and manage local advertising initiatives.</p>
        </div>
        <Button variant="primary" icon={Plus} onClick={() => setIsCreateOpen(true)}>Create Ad</Button>
      </div>

      <Card>
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
                <Badge variant={ad.status === 'ACTIVE' ? 'success' : ad.status === 'PENDING' ? 'warning' : 'neutral'}>
                  {ad.status}
                </Badge>
              </Card.Header>
              <Card.Content className="flex flex-col gap-4 py-4">
                <h3 className="text-sm font-bold text-textPrimary leading-tight">{ad.title}</h3>
                
                <div className="flex flex-col gap-2 text-xs text-textSecondary">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-3.5 h-3.5" />
                    <span>Budget: <strong className="text-textPrimary">${ad.budget}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Duration: {ad.startDate} to {ad.endDate}</span>
                  </div>
                </div>
              </Card.Content>
            </Card>
          ))}
        </div>
      )}

      <Modal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} title="Create Promotion Ad">
        <form onSubmit={handleCreate} className="flex flex-col gap-4">
          <Input label="Ad Title *" placeholder="e.g. 20% Off Weekend Special" value={title} onChange={(e) => setTitle(e.target.value)} required />
          <Input label="Budget ($) *" type="number" placeholder="100.00" value={budget} onChange={(e) => setBudget(e.target.value)} required />
          <Input label="Start Date *" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
          <Input label="End Date *" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} required />

          <div className="flex justify-end gap-3 mt-4 border-t border-border pt-4">
            <Button type="button" variant="secondary" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary">Launch Ad</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Ads;
