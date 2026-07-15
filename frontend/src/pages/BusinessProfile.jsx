import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useSelectedBusiness } from '../store/useSelectedBusiness.js';
import Card from '../components/UI/Card.jsx';
import Button from '../components/UI/Button.jsx';
import Input from '../components/UI/Input.jsx';
import Alert from '../components/UI/Alert.jsx';
import Badge from '../components/UI/Badge.jsx';
import Spinner from '../components/UI/Spinner.jsx';
import { AlertCircle, Building, MapPin, Phone, Globe, Calendar, Hash, CheckCircle, Sparkles, UserCog } from 'lucide-react';

export default function BusinessProfile() {
  const navigate = useNavigate();
  const { selectedBusinessId, selectedBusiness: cachedBusiness, businesses } = useSelectedBusiness();

  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({ name: '', category: '', address: '', phone: '', website: '' });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const load = async (id) => {
    if (!id) return;
    setLoading(true);
    setError('');
    try {
      const res = await api.get(`/api/businesses/${id}`);
      const biz = res.data.data;
      if (biz) {
        setProfile(biz);
        setForm({ name: biz.name, category: biz.category, address: biz.address, phone: biz.phone, website: biz.website || '' });
      }
    } catch {
      if (cachedBusiness) {
        setProfile(cachedBusiness);
        setForm({ name: cachedBusiness.name, category: cachedBusiness.category, address: cachedBusiness.address, phone: cachedBusiness.phone, website: cachedBusiness.website || '' });
      } else {
        setError('Failed to load profile');
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    if (selectedBusinessId) {
      load(selectedBusinessId);
    } else {
      setProfile(null);
    }
  }, [selectedBusinessId]);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!profile) return;
    setSaving(true);
    setError('');
    try {
      await api.put(`/api/businesses/${profile.id}`, form);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      load(profile.id);
    } catch { setError('Failed to save changes'); }
    setSaving(false);
  };

  // No business selected
  if (!selectedBusinessId) {
    return (
      <div className="flex-1 flex flex-col gap-6 w-full max-w-4xl mx-auto py-8 pb-16">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest">
            <UserCog className="w-4 h-4 text-purple-400" /> Identity Hub
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">Business Profile</h1>
          <p className="text-xs text-textSecondary">Manage your business identity, contact information, and branding.</p>
        </div>

        <Card className="text-center p-12 flex flex-col items-center justify-center gap-4">
          <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-full text-purple-400">
            <Building className="w-10 h-10" />
          </div>
          {businesses.length === 0 ? (
            <>
              <h3 className="text-xl font-bold text-white tracking-tight">No Businesses Found</h3>
              <p className="text-sm text-textSecondary max-w-sm leading-relaxed">Create your first business to manage profiles and generate marketing content.</p>
              <Button variant="primary" className="mt-2" onClick={() => navigate('/businesses')}>
                + Add Business
              </Button>
            </>
          ) : (
            <>
              <h3 className="text-xl font-bold text-white tracking-tight">No Business Selected</h3>
              <p className="text-sm text-textSecondary max-w-sm leading-relaxed">
                Use the business selector in the top navigation bar to select the target local hub.
              </p>
            </>
          )}
        </Card>
      </div>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[50vh] gap-3">
        <Spinner size="lg" />
        <span className="text-sm text-textSecondary font-semibold">Retrieving hub details...</span>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col gap-6 w-full max-w-4xl mx-auto py-8 pb-16">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest">
          <UserCog className="w-4 h-4 text-purple-400" /> Identity Hub
        </div>
        <h1 className="text-3xl font-black text-white tracking-tight">Business Profile</h1>
        <p className="text-xs text-textSecondary">Manage your business identity, contact information, and branding.</p>
      </div>

      {error && <Alert variant="error" title="Operation Failed">{error}</Alert>}
      {success && <Alert variant="success" title="Profile Saved">Your adjustments have been successfully recorded.</Alert>}

      {!profile ? (
        <Card className="text-center p-12 flex flex-col items-center justify-center gap-3">
          <Building className="w-12 h-12 text-textSecondary/40" />
          <h3 className="text-xl font-bold text-white">Profile Not Found</h3>
          <p className="text-xs text-textSecondary">Could not load details for this business.</p>
        </Card>
      ) : (
        <div className="flex flex-col gap-6">
          {/* Profile Header Card */}
          <div
            className="rounded-[24px] p-6 md:p-8 text-white flex flex-col md:flex-row items-center gap-6 relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #7C3AED 0%, #4F46E5 100%)',
              boxShadow: '0 8px 32px rgba(124, 58, 237, 0.25)',
            }}
          >
            {/* Shimmer gradient line */}
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-white/20" />
            <div className="w-20 h-20 rounded-[20px] bg-white/10 border border-white/25 flex items-center justify-center text-3xl font-black shrink-0 shadow-lg">
              {profile.name?.charAt(0) || '🏢'}
            </div>
            <div className="text-center md:text-left flex-1">
              <div className="flex flex-col md:flex-row md:items-center gap-2">
                <h2 className="text-2xl font-black tracking-tight">{profile.name}</h2>
                <Badge variant="accent" className="self-center uppercase tracking-widest">{profile.status}</Badge>
              </div>
              <p className="text-sm opacity-80 mt-1">{profile.category}</p>
              <div className="flex flex-wrap gap-x-4 gap-y-2 mt-4 text-xs opacity-90 justify-center md:justify-start font-medium">
                <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 opacity-80" /> {profile.address}</span>
                <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5 opacity-80" /> {profile.phone}</span>
                {profile.website && <span className="flex items-center gap-1"><Globe className="w-3.5 h-3.5 opacity-80" /> {profile.website}</span>}
              </div>
            </div>
          </div>

          {/* Form edit */}
          <Card>
            <Card.Header>
              <Card.Title>Edit Information</Card.Title>
            </Card.Header>
            <Card.Content className="p-6">
              <form onSubmit={handleSave} className="flex flex-col gap-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <Input
                    label="Business Name"
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    required
                  />
                  <Input
                    label="Category"
                    value={form.category}
                    onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                    required
                  />
                  <Input
                    label="Phone Number"
                    value={form.phone}
                    onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                    required
                  />
                  <Input
                    label="Website URL"
                    value={form.website}
                    onChange={e => setForm(f => ({ ...f, website: e.target.value }))}
                  />
                </div>
                <Input
                  label="Address"
                  value={form.address}
                  onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
                  required
                />
                <div className="flex justify-end mt-2">
                  <Button type="submit" isLoading={saving}>
                    Save Profile Changes
                  </Button>
                </div>
              </form>
            </Card.Content>
          </Card>

          {/* Status overview list */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { label: 'Status Code', value: profile.status || 'ACTIVE', icon: CheckCircle, color: 'text-emerald-400', bg: 'rgba(16,185,129,0.06)', border: 'rgba(16,185,129,0.2)' },
              { label: 'Created At', value: new Date(profile.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }), icon: Calendar, color: 'text-purple-400', bg: 'rgba(124,58,237,0.06)', border: 'rgba(124,58,237,0.2)' },
              { label: 'Business ID', value: profile.id?.slice(0, 8) + '...', icon: Hash, color: 'text-textSecondary', bg: 'rgba(255,255,255,0.02)', border: 'rgba(255,255,255,0.08)' }
            ].map((stat, sIdx) => {
              const Icon = stat.icon;
              return (
                <div
                  key={sIdx}
                  className="rounded-[20px] p-5 flex flex-col items-center justify-center gap-1.5 border text-center"
                  style={{ background: stat.bg, borderColor: stat.border }}
                >
                  <Icon className={`w-5 h-5 ${stat.color} mb-1`} />
                  <span className="text-lg font-black text-white leading-none tracking-tight">{stat.value}</span>
                  <span className="text-[10px] text-textSecondary uppercase tracking-widest font-semibold">{stat.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
