import React, { useState, useEffect } from 'react';
import api from '../services/api';

export default function BusinessProfile() {
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({ name: '', category: '', address: '', phone: '', website: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/businesses');
      const biz = res.data.data?.[0] || null;
      if (biz) {
        setProfile(biz);
        setForm({ name: biz.name, category: biz.category, address: biz.address, phone: biz.phone, website: biz.website || '' });
      }
    } catch { setError('Failed to load profile'); }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!profile) return;
    setSaving(true);
    try {
      await api.put(`/api/businesses/${profile.id}`, form);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      load();
    } catch { setError('Failed to save profile'); }
    setSaving(false);
  };

  if (loading) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', color: '#94A3B8', fontFamily: "'Inter', sans-serif" }}>Loading profile...</div>;

  return (
    <div style={{ padding: '32px', background: '#F8FAFC', minHeight: '100vh', fontFamily: "'Inter', sans-serif" }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#0F172A', margin: 0 }}>Business Profile</h1>
          <p style={{ color: '#64748B', marginTop: '4px', fontSize: '14px' }}>Manage your business identity, contact information, and branding</p>
        </div>

        {error && <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', color: '#DC2626', padding: '12px 16px', borderRadius: '8px', marginBottom: '16px', fontSize: '14px' }}>{error}</div>}
        {success && <div style={{ background: '#F0FFF4', border: '1px solid #BBF7D0', color: '#16A34A', padding: '12px 16px', borderRadius: '8px', marginBottom: '16px', fontSize: '14px' }}>✓ Profile saved successfully!</div>}

        {!profile ? (
          <div style={{ background: '#fff', borderRadius: '16px', padding: '48px', textAlign: 'center', border: '1px solid #E2E8F0' }}>
            <div style={{ fontSize: '64px', marginBottom: '16px' }}>🏢</div>
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0F172A' }}>No Business Profile Found</h3>
            <p style={{ color: '#64748B', marginTop: '8px' }}>Add a business from the Businesses page first.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Profile Header Card */}
            <div style={{ background: 'linear-gradient(135deg, #6D5EF8, #8B5CF6)', borderRadius: '16px', padding: '32px', color: '#fff', display: 'flex', alignItems: 'center', gap: '24px' }}>
              <div style={{ width: '80px', height: '80px', borderRadius: '16px', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '36px', flexShrink: 0 }}>
                {profile.name?.charAt(0) || '🏢'}
              </div>
              <div>
                <h2 style={{ fontSize: '24px', fontWeight: 800, margin: 0 }}>{profile.name}</h2>
                <p style={{ margin: '4px 0 0', opacity: 0.8, fontSize: '14px' }}>{profile.category}</p>
                <div style={{ display: 'flex', gap: '16px', marginTop: '12px', fontSize: '13px', opacity: 0.9 }}>
                  <span>📍 {profile.address}</span>
                  <span>📞 {profile.phone}</span>
                </div>
              </div>
            </div>

            {/* Edit Form */}
            <div style={{ background: '#fff', borderRadius: '16px', padding: '32px', border: '1px solid #E2E8F0', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
              <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#0F172A', marginBottom: '24px' }}>Edit Information</h3>
              <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  {[
                    ['name', 'Business Name', '🏢'],
                    ['category', 'Category', '🏷️'],
                    ['phone', 'Phone Number', '📞'],
                    ['website', 'Website URL', '🌐']
                  ].map(([field, label, icon]) => (
                    <div key={field}>
                      <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '6px' }}>{icon} {label}</label>
                      <input value={form[field]} onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))} required={field !== 'website'} style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '14px', outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s' }} onFocus={e => e.target.style.borderColor = '#6D5EF8'} onBlur={e => e.target.style.borderColor = '#E2E8F0'} />
                    </div>
                  ))}
                </div>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '6px' }}>📍 Address</label>
                  <input value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} required style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} onFocus={e => e.target.style.borderColor = '#6D5EF8'} onBlur={e => e.target.style.borderColor = '#E2E8F0'} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '8px' }}>
                  <button type="submit" disabled={saving} style={{ padding: '12px 32px', borderRadius: '10px', border: 'none', background: saving ? '#A5B4FC' : '#6D5EF8', color: '#fff', fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer', fontSize: '14px' }}>
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>

            {/* Stats Row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
              {[
                { label: 'Status', value: profile.status || 'ACTIVE', color: '#22C55E', bg: '#F0FFF4' },
                { label: 'Member Since', value: new Date(profile.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }), color: '#6D5EF8', bg: '#F0F4FF' },
                { label: 'Profile ID', value: profile.id?.slice(0, 8) + '...', color: '#64748B', bg: '#F8FAFC' }
              ].map(stat => (
                <div key={stat.label} style={{ background: stat.bg, borderRadius: '12px', padding: '20px', border: '1px solid #E2E8F0', textAlign: 'center' }}>
                  <div style={{ fontSize: '18px', fontWeight: 800, color: stat.color }}>{stat.value}</div>
                  <div style={{ fontSize: '12px', color: '#64748B', marginTop: '4px', fontWeight: 500 }}>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
