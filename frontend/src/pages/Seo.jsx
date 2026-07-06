import React, { useState } from 'react';

const KEYWORDS = [
  { keyword: 'local bakery coimbatore', position: 3, volume: 1200, trend: 'up', score: 82 },
  { keyword: 'best cake shop near me', position: 7, volume: 4500, trend: 'up', score: 74 },
  { keyword: 'artisan bread delivery', position: 12, volume: 900, trend: 'down', score: 58 },
  { keyword: 'wedding cake custom order', position: 5, volume: 2100, trend: 'stable', score: 79 },
  { keyword: 'freshly baked pastries', position: 18, volume: 650, trend: 'up', score: 45 },
];

const SEO_CHECKS = [
  { label: 'Google My Business verified', done: true },
  { label: 'Website has SSL certificate', done: true },
  { label: 'Mobile-friendly website', done: true },
  { label: 'Meta descriptions added', done: false },
  { label: 'Schema markup implemented', done: false },
  { label: 'Consistent NAP citations', done: true },
  { label: 'Local keywords in page titles', done: false },
  { label: 'Image alt texts added', done: true },
];

function ScoreMeter({ score }) {
  const color = score >= 80 ? '#22C55E' : score >= 60 ? '#F59E0B' : '#EF4444';
  const label = score >= 80 ? 'Excellent' : score >= 60 ? 'Good' : 'Needs Work';
  const circumference = 2 * Math.PI * 54;
  const dashOffset = circumference - (score / 100) * circumference;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <svg width="140" height="140" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r="54" fill="none" stroke="#E2E8F0" strokeWidth="10" />
        <circle cx="60" cy="60" r="54" fill="none" stroke={color} strokeWidth="10" strokeDasharray={circumference} strokeDashoffset={dashOffset} strokeLinecap="round" transform="rotate(-90 60 60)" style={{ transition: 'stroke-dashoffset 1s ease' }} />
        <text x="60" y="58" textAnchor="middle" fill={color} fontSize="26" fontWeight="800" fontFamily="Inter">{score}</text>
        <text x="60" y="74" textAnchor="middle" fill="#94A3B8" fontSize="11" fontFamily="Inter">/ 100</text>
      </svg>
      <span style={{ fontSize: '14px', fontWeight: 700, color, marginTop: '4px' }}>{label}</span>
    </div>
  );
}

export default function Seo() {
  const [activeKw, setActiveKw] = useState(null);
  const seoScore = 68;
  const done = SEO_CHECKS.filter(c => c.done).length;

  return (
    <div style={{ padding: '32px', background: '#F8FAFC', minHeight: '100vh', fontFamily: "'Inter', sans-serif" }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#0F172A', margin: 0 }}>SEO Dashboard</h1>
        <p style={{ color: '#64748B', marginTop: '4px', fontSize: '14px' }}>Track your search rankings, keyword performance, and optimization score</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px', marginBottom: '24px' }}>
        {/* SEO Score */}
        <div style={{ background: '#fff', borderRadius: '16px', padding: '32px', border: '1px solid #E2E8F0', boxShadow: '0 1px 4px rgba(0,0,0,0.04)', textAlign: 'center' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#374151', marginBottom: '20px' }}>Overall SEO Score</h3>
          <ScoreMeter score={seoScore} />
          <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', gap: '20px', fontSize: '13px', color: '#64748B' }}>
            <span>✅ {done} passed</span>
            <span>❌ {SEO_CHECKS.length - done} pending</span>
          </div>
        </div>

        {/* Quick Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
          {[
            { label: 'Keywords Tracked', value: KEYWORDS.length, icon: '🔍', color: '#6D5EF8', bg: '#F0F4FF' },
            { label: 'Avg. Position', value: (KEYWORDS.reduce((a, b) => a + b.position, 0) / KEYWORDS.length).toFixed(1), icon: '📊', color: '#22C55E', bg: '#F0FFF4' },
            { label: 'Top Keyword Volume', value: '4,500', icon: '🔥', color: '#F59E0B', bg: '#FFFBF0' },
            { label: 'Improvements', value: SEO_CHECKS.length - done, icon: '🛠️', color: '#EF4444', bg: '#FEF2F2' }
          ].map(stat => (
            <div key={stat.label} style={{ background: stat.bg, borderRadius: '12px', padding: '24px', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
              <div style={{ fontSize: '28px', marginBottom: '8px' }}>{stat.icon}</div>
              <div style={{ fontSize: '28px', fontWeight: 800, color: stat.color }}>{stat.value}</div>
              <div style={{ fontSize: '13px', color: '#64748B', marginTop: '4px', fontWeight: 500 }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        {/* Keyword Rankings */}
        <div style={{ background: '#fff', borderRadius: '16px', padding: '24px', border: '1px solid #E2E8F0', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0F172A', marginBottom: '20px' }}>Keyword Rankings</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #F1F5F9' }}>
                {['Keyword', 'Position', 'Volume', 'Score', 'Trend'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '8px 12px', fontSize: '12px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {KEYWORDS.map((kw, i) => (
                <tr key={i} onClick={() => setActiveKw(kw === activeKw ? null : kw)} style={{ borderBottom: '1px solid #F8FAFC', cursor: 'pointer', background: activeKw === kw ? '#F0F4FF' : 'transparent', transition: 'background 0.15s' }}>
                  <td style={{ padding: '12px 12px', fontSize: '13px', fontWeight: 600, color: '#0F172A' }}>{kw.keyword}</td>
                  <td style={{ padding: '12px', fontSize: '13px' }}>
                    <span style={{ background: kw.position <= 5 ? '#F0FFF4' : kw.position <= 10 ? '#FEF3C7' : '#FEF2F2', color: kw.position <= 5 ? '#16A34A' : kw.position <= 10 ? '#D97706' : '#DC2626', padding: '3px 10px', borderRadius: '20px', fontWeight: 700, fontSize: '12px' }}>#{kw.position}</span>
                  </td>
                  <td style={{ padding: '12px', fontSize: '13px', color: '#64748B' }}>{kw.volume.toLocaleString()}</td>
                  <td style={{ padding: '12px', fontSize: '13px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '60px', height: '6px', background: '#F1F5F9', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ height: '100%', background: kw.score >= 80 ? '#22C55E' : kw.score >= 60 ? '#F59E0B' : '#EF4444', width: `${kw.score}%`, borderRadius: '3px' }} />
                      </div>
                      <span style={{ fontSize: '12px', fontWeight: 700, color: '#374151' }}>{kw.score}</span>
                    </div>
                  </td>
                  <td style={{ padding: '12px', fontSize: '16px' }}>{kw.trend === 'up' ? '📈' : kw.trend === 'down' ? '📉' : '➡️'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* SEO Checklist */}
        <div style={{ background: '#fff', borderRadius: '16px', padding: '24px', border: '1px solid #E2E8F0', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0F172A', marginBottom: '20px' }}>SEO Checklist</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {SEO_CHECKS.map((check, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px', borderRadius: '8px', background: check.done ? '#F0FFF4' : '#FFF8F0', border: `1px solid ${check.done ? '#BBF7D0' : '#FDE68A'}` }}>
                <span style={{ fontSize: '16px', flexShrink: 0 }}>{check.done ? '✅' : '⏳'}</span>
                <span style={{ fontSize: '13px', color: check.done ? '#166534' : '#92400E', fontWeight: check.done ? 500 : 600, lineHeight: '1.4' }}>{check.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
