import React, { useState, useEffect } from 'react';
import api from '../services/api';

export default function Gbp() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [syncMsg, setSyncMsg] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/gbp');
      setData(res.data.data);
    } catch { /* ignore */ }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleSync = async () => {
    setSyncing(true);
    try {
      const res = await api.put('/api/gbp');
      setSyncMsg('✓ Synced successfully at ' + new Date(res.data.data.syncedAt).toLocaleTimeString());
      setTimeout(() => setSyncMsg(''), 4000);
    } catch { setSyncMsg('Sync failed'); }
    setSyncing(false);
  };

  if (loading) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', color: '#94A3B8', fontFamily: "'Inter', sans-serif" }}>Loading...</div>;

  return (
    <div style={{ padding: '32px', background: '#F8FAFC', minHeight: '100vh', fontFamily: "'Inter', sans-serif" }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#0F172A', margin: 0, display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ width: '36px', height: '36px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: '#4285F4', borderRadius: '8px', fontSize: '20px' }}>G</span>
            Google Business Profile
          </h1>
          <p style={{ color: '#64748B', marginTop: '4px', fontSize: '14px' }}>Monitor your Google listing performance and sync updates</p>
        </div>
        <button onClick={handleSync} disabled={syncing} style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', background: syncing ? '#A5B4FC' : '#4285F4', color: '#fff', fontWeight: 600, cursor: syncing ? 'not-allowed' : 'pointer', fontSize: '14px' }}>
          {syncing ? '⟳ Syncing...' : '🔄 Sync Profile'}
        </button>
      </div>

      {syncMsg && <div style={{ background: '#F0FFF4', border: '1px solid #BBF7D0', color: '#16A34A', padding: '12px 16px', borderRadius: '8px', marginBottom: '16px', fontSize: '14px' }}>{syncMsg}</div>}

      {!data ? (
        <div style={{ textAlign: 'center', padding: '80px', background: '#fff', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
          <div style={{ fontSize: '64px', marginBottom: '16px' }}>🗺️</div>
          <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0F172A' }}>No Business Profile Connected</h3>
          <p style={{ color: '#64748B' }}>Add a business first, then sync your Google profile.</p>
        </div>
      ) : (
        <>
          {/* Verification Banner */}
          <div style={{ background: 'linear-gradient(135deg, #4285F4, #34A853)', borderRadius: '16px', padding: '24px 32px', marginBottom: '24px', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h2 style={{ fontSize: '22px', fontWeight: 800, margin: 0 }}>{data.businessName}</h2>
              <p style={{ margin: '4px 0 0', opacity: 0.85, fontSize: '14px' }}>📍 {data.address} · 📞 {data.phone}</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ background: 'rgba(255,255,255,0.2)', padding: '8px 16px', borderRadius: '20px', fontSize: '13px', fontWeight: 700 }}>
                ✅ {data.verificationStatus}
              </div>
              <div style={{ fontSize: '12px', opacity: 0.75, marginTop: '4px' }}>Last synced: {new Date(data.lastSyncedAt).toLocaleString()}</div>
            </div>
          </div>

          {/* Rating Card */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
            {[
              { label: 'Star Rating', value: `⭐ ${data.rating}`, sub: `${data.totalReviews} reviews`, color: '#F59E0B', bg: '#FFFBF0' },
              { label: 'Monthly Views', value: data.views?.thisMonth?.toLocaleString(), sub: `↑ vs ${data.views?.lastMonth?.toLocaleString()} last mo`, color: '#6D5EF8', bg: '#F0F4FF' },
              { label: 'Website Clicks', value: data.actions?.websiteClicks, sub: 'this month', color: '#22C55E', bg: '#F0FFF4' },
              { label: 'Direction Requests', value: data.actions?.directionRequests, sub: 'this month', color: '#3B82F6', bg: '#EFF6FF' }
            ].map(stat => (
              <div key={stat.label} style={{ background: stat.bg, borderRadius: '12px', padding: '20px', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                <div style={{ fontSize: '28px', fontWeight: 800, color: stat.color }}>{stat.value}</div>
                <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '4px' }}>{stat.sub}</div>
                <div style={{ fontSize: '12px', color: '#374151', fontWeight: 600, marginTop: '8px' }}>{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Search Analytics */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            <div style={{ background: '#fff', borderRadius: '16px', padding: '24px', border: '1px solid #E2E8F0' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0F172A', marginBottom: '20px' }}>How Customers Find You</h3>
              {[
                { label: 'Direct Searches', value: data.searches?.direct, total: data.searches?.direct + data.searches?.discovery, color: '#6D5EF8' },
                { label: 'Discovery Searches', value: data.searches?.discovery, total: data.searches?.direct + data.searches?.discovery, color: '#22C55E' }
              ].map(item => (
                <div key={item.label} style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontSize: '13px', color: '#374151', fontWeight: 500 }}>{item.label}</span>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: item.color }}>{item.value}</span>
                  </div>
                  <div style={{ background: '#F1F5F9', borderRadius: '4px', height: '8px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', background: item.color, width: `${Math.round(item.value / item.total * 100)}%`, borderRadius: '4px', transition: 'width 0.8s ease' }} />
                  </div>
                </div>
              ))}
            </div>
            <div style={{ background: '#fff', borderRadius: '16px', padding: '24px', border: '1px solid #E2E8F0' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0F172A', marginBottom: '20px' }}>Customer Actions</h3>
              {[
                { label: 'Website Clicks', value: data.actions?.websiteClicks, icon: '🌐', color: '#6D5EF8' },
                { label: 'Phone Calls', value: data.actions?.callClicks, icon: '📞', color: '#22C55E' },
                { label: 'Direction Requests', value: data.actions?.directionRequests, icon: '📍', color: '#F59E0B' }
              ].map(item => (
                <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 0', borderBottom: '1px solid #F1F5F9' }}>
                  <span style={{ fontSize: '22px' }}>{item.icon}</span>
                  <span style={{ flex: 1, fontSize: '14px', color: '#374151' }}>{item.label}</span>
                  <span style={{ fontSize: '20px', fontWeight: 800, color: item.color }}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
