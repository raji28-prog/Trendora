import React, { useState, useEffect } from 'react';
import api from '../services/api';

const PLATFORMS = [
  { id: 'FACEBOOK', label: 'Facebook', color: '#1877F2', emoji: '📘' },
  { id: 'INSTAGRAM', label: 'Instagram', color: '#E1306C', emoji: '📸' },
  { id: 'TWITTER', label: 'X / Twitter', color: '#1DA1F2', emoji: '🐦' },
  { id: 'LINKEDIN', label: 'LinkedIn', color: '#0A66C2', emoji: '💼' }
];

function getStatusStyle(status) {
  if (status === 'PUBLISHED') return { bg: '#F0FFF4', color: '#16A34A', border: '#BBF7D0' };
  if (status === 'FAILED') return { bg: '#FEF2F2', color: '#DC2626', border: '#FECACA' };
  return { bg: '#EFF6FF', color: '#2563EB', border: '#BFDBFE' };
}

export default function Scheduler() {
  const [posts, setPosts] = useState([]);
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ content: '', platform: 'INSTAGRAM', scheduledFor: '', businessId: '' });
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const [pRes, bRes] = await Promise.all([api.get('/api/scheduler'), api.get('/api/businesses')]);
      setPosts(pRes.data.data || []);
      setBusinesses(bRes.data.data || []);
    } catch { setError('Failed to load posts'); }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/scheduler', form);
      setShowModal(false);
      setForm({ content: '', platform: 'INSTAGRAM', scheduledFor: '', businessId: '' });
      load();
    } catch { setError('Failed to schedule post'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this post from queue?')) return;
    try { await api.delete(`/api/scheduler/${id}`); load(); }
    catch { setError('Failed to remove post'); }
  };

  const upcoming = posts.filter(p => p.status === 'SCHEDULED');
  const published = posts.filter(p => p.status === 'PUBLISHED');
  const failed = posts.filter(p => p.status === 'FAILED');

  return (
    <div style={{ padding: '32px', background: '#F8FAFC', minHeight: '100vh', fontFamily: "'Inter', sans-serif" }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#0F172A', margin: 0 }}>Social Media Scheduler</h1>
          <p style={{ color: '#64748B', marginTop: '4px', fontSize: '14px' }}>Schedule and manage your social media content calendar</p>
        </div>
        <button onClick={() => setShowModal(true)} style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', background: '#6D5EF8', color: '#fff', fontWeight: 600, cursor: 'pointer', fontSize: '14px' }}>
          + Schedule Post
        </button>
      </div>

      {error && <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', color: '#DC2626', padding: '12px 16px', borderRadius: '8px', marginBottom: '16px', fontSize: '14px' }}>{error}</div>}

      {/* Platform Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '28px' }}>
        {PLATFORMS.map(pl => {
          const count = posts.filter(p => p.platform === pl.id).length;
          return (
            <div key={pl.id} style={{ background: '#fff', borderRadius: '12px', padding: '20px', border: '1px solid #E2E8F0', textAlign: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
              <div style={{ fontSize: '28px', marginBottom: '8px' }}>{pl.emoji}</div>
              <div style={{ fontSize: '22px', fontWeight: 800, color: pl.color }}>{count}</div>
              <div style={{ fontSize: '12px', color: '#64748B', marginTop: '2px', fontWeight: 500 }}>{pl.label}</div>
            </div>
          );
        })}
      </div>

      {/* Queue Sections */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: '#94A3B8' }}>Loading...</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
          {/* Upcoming Posts */}
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0F172A', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#6D5EF8', display: 'inline-block' }}></span>
              Scheduled ({upcoming.length})
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {upcoming.length === 0 ? (
                <div style={{ background: '#fff', borderRadius: '12px', padding: '40px', textAlign: 'center', border: '1px solid #E2E8F0', color: '#94A3B8' }}>
                  <div style={{ fontSize: '40px', marginBottom: '12px' }}>📅</div>
                  <p style={{ fontSize: '14px' }}>No posts scheduled. Add your first post!</p>
                </div>
              ) : upcoming.map(post => {
                const pl = PLATFORMS.find(p => p.id === post.platform) || PLATFORMS[1];
                const s = getStatusStyle(post.status);
                return (
                  <div key={post.id} style={{ background: '#fff', borderRadius: '12px', padding: '20px', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)', display: 'flex', gap: '16px' }}>
                    <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: pl.color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', flexShrink: 0 }}>
                      {pl.emoji}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                          <span style={{ fontSize: '12px', fontWeight: 700, color: pl.color }}>{pl.label}</span>
                          <p style={{ fontSize: '14px', color: '#374151', margin: '4px 0', lineHeight: '1.5' }}>{post.content}</p>
                          <p style={{ fontSize: '12px', color: '#94A3B8', margin: 0 }}>📅 {new Date(post.scheduledFor).toLocaleString()}</p>
                        </div>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          <span style={{ fontSize: '11px', fontWeight: 600, padding: '3px 10px', borderRadius: '20px', background: s.bg, color: s.color, border: `1px solid ${s.border}` }}>{post.status}</span>
                          <button onClick={() => handleDelete(post.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8', fontSize: '16px', padding: '4px' }}>✕</button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Side Stats */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[
              { label: 'Scheduled', count: upcoming.length, color: '#6D5EF8', bg: '#F0F4FF', icon: '📅' },
              { label: 'Published', count: published.length, color: '#22C55E', bg: '#F0FFF4', icon: '✅' },
              { label: 'Failed', count: failed.length, color: '#EF4444', bg: '#FEF2F2', icon: '❌' }
            ].map(stat => (
              <div key={stat.label} style={{ background: stat.bg, borderRadius: '12px', padding: '20px', border: '1px solid #E2E8F0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '13px', color: '#64748B', fontWeight: 500 }}>{stat.icon} {stat.label}</div>
                    <div style={{ fontSize: '28px', fontWeight: 800, color: stat.color, marginTop: '4px' }}>{stat.count}</div>
                  </div>
                </div>
              </div>
            ))}

            <div style={{ background: 'linear-gradient(135deg, #6D5EF8, #8B5CF6)', borderRadius: '12px', padding: '20px', color: '#fff' }}>
              <div style={{ fontSize: '18px', marginBottom: '8px' }}>💡</div>
              <h4 style={{ fontSize: '14px', fontWeight: 700, margin: '0 0 8px' }}>Best Posting Times</h4>
              <p style={{ fontSize: '12px', opacity: 0.85, margin: 0, lineHeight: '1.6' }}>
                📸 Instagram: 11am, 2pm<br />
                📘 Facebook: 9am, 1pm<br />
                🐦 Twitter: 8am, 5pm
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Schedule Post Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', borderRadius: '16px', padding: '32px', width: '480px', boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#0F172A', marginBottom: '24px' }}>Schedule New Post</h2>
            <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '6px' }}>Platform</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                  {PLATFORMS.map(pl => (
                    <button type="button" key={pl.id} onClick={() => setForm(f => ({ ...f, platform: pl.id }))} style={{ padding: '10px 6px', borderRadius: '8px', border: `2px solid ${form.platform === pl.id ? pl.color : '#E2E8F0'}`, background: form.platform === pl.id ? pl.color + '15' : '#fff', cursor: 'pointer', fontSize: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                      {pl.emoji}
                      <span style={{ fontSize: '10px', fontWeight: 600, color: form.platform === pl.id ? pl.color : '#64748B' }}>{pl.label}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '6px' }}>Post Content</label>
                <textarea value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} required rows={4} style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '14px', outline: 'none', boxSizing: 'border-box', resize: 'vertical' }} placeholder="Write your post content..." />
              </div>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '6px' }}>Schedule For</label>
                <input type="datetime-local" value={form.scheduledFor} onChange={e => setForm(f => ({ ...f, scheduledFor: e.target.value }))} required style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
              </div>
              {businesses.length > 0 && (
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '6px' }}>Business</label>
                  <select value={form.businessId} onChange={e => setForm(f => ({ ...f, businessId: e.target.value }))} style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '14px', outline: 'none' }}>
                    <option value="">Auto-select first business</option>
                    {businesses.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                  </select>
                </div>
              )}
              <div style={{ display: 'flex', gap: '12px', paddingTop: '8px' }}>
                <button type="button" onClick={() => setShowModal(false)} style={{ flex: 1, padding: '11px', borderRadius: '8px', border: '1px solid #E2E8F0', background: '#fff', color: '#374151', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
                <button type="submit" style={{ flex: 1, padding: '11px', borderRadius: '8px', border: 'none', background: '#6D5EF8', color: '#fff', fontWeight: 600, cursor: 'pointer' }}>Schedule Post</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
