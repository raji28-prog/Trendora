import React, { useState } from 'react';
import api from '../services/api';

const CONTENT_TYPES = [
  { id: 'ad', label: 'Ad Copy', icon: '📢', description: 'Promotional advertisement text' },
  { id: 'post', label: 'Social Post', icon: '📱', description: 'Engaging social media content' },
  { id: 'email', label: 'Email Campaign', icon: '✉️', description: 'Marketing email templates' }
];

export default function AiGenerator() {
  const [type, setType] = useState('ad');
  const [topic, setTopic] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(null);

  const generate = async (e) => {
    e.preventDefault();
    if (!topic.trim()) return;
    setLoading(true);
    setResults([]);
    setError('');
    try {
      const res = await api.post('/api/ai/generate', { type, topic, businessName: businessName || 'Your Business' });
      setResults(res.data.data.suggestions || []);
    } catch {
      setError('Generation failed. Please try again.');
    }
    setLoading(false);
  };

  const copyText = (text, i) => {
    navigator.clipboard.writeText(text);
    setCopied(i);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div style={{ padding: '32px', background: '#F8FAFC', minHeight: '100vh', fontFamily: "'Inter', sans-serif" }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'linear-gradient(135deg, #6D5EF8, #8B5CF6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>🤖</div>
            <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#0F172A', margin: 0 }}>AI Content Generator</h1>
          </div>
          <p style={{ color: '#64748B', fontSize: '14px', margin: 0 }}>Generate professional marketing copy for your local business in seconds</p>
        </div>

        {/* Content Type Selector */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '28px' }}>
          {CONTENT_TYPES.map(ct => (
            <button key={ct.id} onClick={() => setType(ct.id)} style={{ padding: '20px', borderRadius: '12px', border: `2px solid ${type === ct.id ? '#6D5EF8' : '#E2E8F0'}`, background: type === ct.id ? '#F0F4FF' : '#fff', cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s' }}>
              <div style={{ fontSize: '28px', marginBottom: '8px' }}>{ct.icon}</div>
              <div style={{ fontSize: '15px', fontWeight: 700, color: type === ct.id ? '#6D5EF8' : '#0F172A' }}>{ct.label}</div>
              <div style={{ fontSize: '12px', color: '#64748B', marginTop: '4px' }}>{ct.description}</div>
            </button>
          ))}
        </div>

        {/* Input Form */}
        <div style={{ background: '#fff', borderRadius: '16px', padding: '28px', border: '1px solid #E2E8F0', boxShadow: '0 1px 4px rgba(0,0,0,0.04)', marginBottom: '24px' }}>
          <form onSubmit={generate} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '6px' }}>🏷️ Topic / Product / Offer</label>
                <input value={topic} onChange={e => setTopic(e.target.value)} required placeholder="e.g. Summer sale 30% off pastries" style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} onFocus={e => e.target.style.borderColor = '#6D5EF8'} onBlur={e => e.target.style.borderColor = '#E2E8F0'} />
              </div>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '6px' }}>🏢 Business Name</label>
                <input value={businessName} onChange={e => setBusinessName(e.target.value)} placeholder="e.g. RP Bakery" style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} onFocus={e => e.target.style.borderColor = '#6D5EF8'} onBlur={e => e.target.style.borderColor = '#E2E8F0'} />
              </div>
            </div>
            <button type="submit" disabled={loading} style={{ padding: '13px', borderRadius: '10px', border: 'none', background: loading ? '#A5B4FC' : 'linear-gradient(135deg, #6D5EF8, #8B5CF6)', color: '#fff', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', fontSize: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              {loading ? (
                <>
                  <span style={{ display: 'inline-block', width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                  Generating...
                </>
              ) : '✨ Generate Content'}
            </button>
          </form>
        </div>

        {error && <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', color: '#DC2626', padding: '12px 16px', borderRadius: '8px', marginBottom: '16px', fontSize: '14px' }}>{error}</div>}

        {/* Results */}
        {results.length > 0 && (
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0F172A', marginBottom: '16px' }}>✨ Generated Suggestions</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {results.map((text, i) => (
                <div key={i} style={{ background: '#fff', borderRadius: '12px', padding: '24px', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)', position: 'relative' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px' }}>
                    <div style={{ flex: 1 }}>
                      <span style={{ fontSize: '11px', fontWeight: 700, color: '#6D5EF8', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px', display: 'block' }}>Version {i + 1}</span>
                      <p style={{ fontSize: '14px', color: '#374151', lineHeight: '1.7', margin: 0, whiteSpace: 'pre-wrap' }}>{text}</p>
                    </div>
                    <button onClick={() => copyText(text, i)} style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #E2E8F0', background: copied === i ? '#F0FFF4' : '#fff', color: copied === i ? '#16A34A' : '#374151', fontWeight: 600, cursor: 'pointer', fontSize: '13px', flexShrink: 0, transition: 'all 0.2s' }}>
                      {copied === i ? '✓ Copied!' : '📋 Copy'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {results.length === 0 && !loading && !error && (
          <div style={{ textAlign: 'center', padding: '60px', color: '#94A3B8' }}>
            <div style={{ fontSize: '64px', marginBottom: '16px' }}>✨</div>
            <p style={{ fontSize: '16px', fontWeight: 500, color: '#64748B' }}>Your AI-generated content will appear here</p>
            <p style={{ fontSize: '14px' }}>Choose a content type, enter your topic, and click Generate</p>
          </div>
        )}
      </div>
    </div>
  );
}
