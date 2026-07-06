import React, { useState, useEffect } from 'react';
import api from '../services/api';

const PLANS = [
  {
    id: 'FREE',
    name: 'Free',
    price: 0,
    period: 'Forever',
    color: '#64748B',
    bg: '#F8FAFC',
    border: '#E2E8F0',
    buttonStyle: { background: '#fff', border: '1px solid #E2E8F0', color: '#374151' },
    features: ['1 Business Profile', '10 Scheduled Posts/mo', 'Basic Analytics', 'Email Support', '2 Team Members'],
    missing: ['AI Content Generator', 'Google Business Sync', 'SEO Dashboard', 'Advanced Reports']
  },
  {
    id: 'PRO',
    name: 'Pro',
    price: 29,
    period: '/month',
    color: '#6D5EF8',
    bg: '#F0F4FF',
    border: '#6D5EF8',
    popular: true,
    buttonStyle: { background: '#6D5EF8', border: 'none', color: '#fff' },
    features: ['5 Business Profiles', '200 Scheduled Posts/mo', 'Advanced Analytics', 'Priority Support', '10 Team Members', 'AI Content Generator', 'Google Business Sync', 'SEO Dashboard'],
    missing: ['White-label Reports', 'Dedicated Account Manager']
  },
  {
    id: 'ENTERPRISE',
    name: 'Enterprise',
    price: 99,
    period: '/month',
    color: '#F59E0B',
    bg: '#FFFBF0',
    border: '#F59E0B',
    buttonStyle: { background: '#F59E0B', border: 'none', color: '#fff' },
    features: ['Unlimited Businesses', 'Unlimited Posts', 'Full Analytics Suite', '24/7 Dedicated Support', 'Unlimited Team Members', 'AI Content Generator', 'Google Business Sync', 'SEO Dashboard', 'White-label Reports', 'Dedicated Account Manager'],
    missing: []
  }
];

export default function Billing() {
  const [currentSub, setCurrentSub] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activating, setActivating] = useState(null);
  const [success, setSuccess] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/billing');
      setCurrentSub(res.data.data);
    } catch { /* ignore */ }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleActivate = async (planId) => {
    setActivating(planId);
    try {
      await api.post('/api/billing', { plan: planId });
      setSuccess(`${planId} plan activated!`);
      setTimeout(() => setSuccess(''), 3000);
      load();
    } catch { /* ignore */ }
    setActivating(null);
  };

  return (
    <div style={{ padding: '32px', background: '#F8FAFC', minHeight: '100vh', fontFamily: "'Inter', sans-serif" }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h1 style={{ fontSize: '36px', fontWeight: 800, color: '#0F172A', margin: 0 }}>Simple, Transparent Pricing</h1>
          <p style={{ color: '#64748B', marginTop: '12px', fontSize: '16px' }}>Choose the plan that grows with your business</p>
        </div>

        {success && <div style={{ background: '#F0FFF4', border: '1px solid #BBF7D0', color: '#16A34A', padding: '12px 16px', borderRadius: '8px', marginBottom: '24px', fontSize: '14px', textAlign: 'center', fontWeight: 600 }}>✅ {success}</div>}

        {/* Current Plan Banner */}
        {currentSub && (
          <div style={{ background: 'linear-gradient(135deg, #6D5EF8, #8B5CF6)', borderRadius: '16px', padding: '20px 28px', marginBottom: '32px', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '13px', opacity: 0.8 }}>Currently Active Plan</div>
              <div style={{ fontSize: '22px', fontWeight: 800 }}>{currentSub.plan} Plan</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '13px', opacity: 0.8 }}>Status: <strong>{currentSub.status}</strong></div>
              <div style={{ fontSize: '12px', opacity: 0.7, marginTop: '4px' }}>Expires: {new Date(currentSub.expiresAt).toLocaleDateString()}</div>
            </div>
          </div>
        )}

        {/* Pricing Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '48px' }}>
          {PLANS.map(plan => {
            const isCurrent = currentSub?.plan === plan.id && currentSub?.status === 'ACTIVE';
            return (
              <div key={plan.id} style={{ background: plan.bg, borderRadius: '20px', padding: '32px', border: `2px solid ${plan.border}`, boxShadow: plan.popular ? '0 8px 32px rgba(109,94,248,0.2)' : '0 2px 8px rgba(0,0,0,0.06)', position: 'relative', transition: 'transform 0.2s' }} onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; }} onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}>
                {plan.popular && (
                  <div style={{ position: 'absolute', top: '-14px', left: '50%', transform: 'translateX(-50%)', background: '#6D5EF8', color: '#fff', padding: '5px 16px', borderRadius: '20px', fontSize: '12px', fontWeight: 700, whiteSpace: 'nowrap' }}>⭐ Most Popular</div>
                )}
                {isCurrent && (
                  <div style={{ position: 'absolute', top: '-14px', right: '20px', background: '#22C55E', color: '#fff', padding: '5px 16px', borderRadius: '20px', fontSize: '12px', fontWeight: 700 }}>✓ Active</div>
                )}
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: plan.color, margin: '0 0 8px' }}>{plan.name}</h3>
                <div style={{ marginBottom: '24px' }}>
                  <span style={{ fontSize: '44px', fontWeight: 900, color: '#0F172A' }}>${plan.price}</span>
                  <span style={{ fontSize: '14px', color: '#64748B' }}>{plan.period}</span>
                </div>
                <button onClick={() => !isCurrent && handleActivate(plan.id)} disabled={isCurrent || activating === plan.id} style={{ width: '100%', padding: '13px', borderRadius: '10px', fontWeight: 700, cursor: isCurrent ? 'default' : 'pointer', fontSize: '14px', marginBottom: '24px', transition: 'all 0.2s', ...plan.buttonStyle, opacity: isCurrent ? 0.7 : 1 }}>
                  {activating === plan.id ? 'Activating...' : isCurrent ? 'Current Plan' : `Get ${plan.name}`}
                </button>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {plan.features.map(f => (
                    <li key={f} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: '#374151' }}>
                      <span style={{ color: plan.color, fontSize: '14px', flexShrink: 0 }}>✓</span> {f}
                    </li>
                  ))}
                  {plan.missing.map(f => (
                    <li key={f} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: '#94A3B8' }}>
                      <span style={{ flexShrink: 0 }}>—</span> {f}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* FAQ */}
        <div style={{ background: '#fff', borderRadius: '16px', padding: '32px', border: '1px solid #E2E8F0' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0F172A', marginBottom: '20px', textAlign: 'center' }}>Frequently Asked Questions</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            {[
              { q: 'Can I change plans anytime?', a: 'Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.' },
              { q: 'Is there a free trial?', a: 'Yes! Our Free plan is available forever with no credit card required to get started.' },
              { q: 'What payment methods do you accept?', a: 'We accept all major credit cards, PayPal, and bank transfers for Enterprise plans.' },
              { q: 'Can I cancel anytime?', a: 'Absolutely. Cancel your subscription anytime with no cancellation fees or penalties.' }
            ].map(item => (
              <div key={item.q} style={{ padding: '16px', background: '#F8FAFC', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A', marginBottom: '6px' }}>{item.q}</div>
                <div style={{ fontSize: '13px', color: '#64748B', lineHeight: '1.5' }}>{item.a}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
