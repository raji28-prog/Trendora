import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Star, Sparkles, Shield, Zap, X, CreditCard, DollarSign } from 'lucide-react';
import api from '../services/api';
import Card from '../components/UI/Card.jsx';
import Button from '../components/UI/Button.jsx';
import Badge from '../components/UI/Badge.jsx';
import Input from '../components/UI/Input.jsx';
import Spinner from '../components/UI/Spinner.jsx';

export default function Billing() {
  const [currentSub, setCurrentSub] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activating, setActivating] = useState(null);
  const [success, setSuccess] = useState('');
  const [billingPeriod, setBillingPeriod] = useState('monthly');
  const [checkoutPlan, setCheckoutPlan] = useState(null);

  const [cardNumber, setCardNumber] = useState('4242 4242 4242 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('123');

  const PLANS = [
    {
      id: 'FREE',
      name: 'Free',
      tagline: 'Ideal for trial and validation',
      monthlyPrice: 0,
      yearlyPrice: 0,
      icon: Shield,
      color: '#A1A1AA',
      features: ['1 Business Profile', 'Download with Watermark', '10 AI Credits/mo', 'PNG Export only', '2 Team Members'],
      missing: ['High Resolution Export', 'PDF Export', 'Google Business Sync', 'SEO Audit Dashboard', 'Dedicated Account Manager']
    },
    {
      id: 'PRO',
      name: 'Pro',
      tagline: 'Perfect for small local brands',
      monthlyPrice: 29,
      yearlyPrice: 240,
      icon: Zap,
      color: '#A855F7',
      popular: true,
      features: ['5 Business Profiles', 'No Watermark', 'High Resolution Export', 'PNG, JPG & PDF Export', '250 AI Credits/mo', '10 Team Members', 'Social Media Scheduler', 'Google Business Sync'],
      missing: ['Dedicated Account Manager', 'Custom API Access']
    },
    {
      id: 'BUSINESS',
      name: 'Business',
      tagline: 'Ultimate power for multi-locations',
      monthlyPrice: 79,
      yearlyPrice: 720,
      icon: Star,
      color: '#F59E0B',
      features: ['Unlimited Businesses', 'No Watermark', 'High Resolution Export', 'PNG, JPG & PDF Export', 'Unlimited AI Credits', 'Unlimited Team Members', 'Social Media Scheduler', 'Google Business Sync', 'SEO Audit Dashboard', 'Dedicated Account Manager', 'Custom API Access'],
      missing: []
    }
  ];

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/billing');
      setCurrentSub(res.data.data);
    } catch { /* ignore */ }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleSelectPlan = (plan) => {
    if (currentSub?.plan === plan.id) return;
    setCheckoutPlan(plan);
  };

  const handleCheckoutSubmit = async (e) => {
    e.preventDefault();
    if (!checkoutPlan) return;

    setActivating(checkoutPlan.id);
    try {
      await api.post('/api/billing', { plan: checkoutPlan.id });
      setSuccess(`${checkoutPlan.name} plan activated successfully!`);
      setTimeout(() => setSuccess(''), 4000);
      setCheckoutPlan(null);
      load();
    } catch (err) {
      console.error(err);
    } finally {
      setActivating(null);
    }
  };

  const getPrice = (plan) => {
    if (billingPeriod === 'monthly') {
      return `$${plan.monthlyPrice}`;
    }
    return `$${Math.round(plan.yearlyPrice / 12)}`;
  };

  const comparisonFeatures = [
    { name: 'Business Profiles', free: '1 Business', pro: '5 Businesses', business: 'Unlimited' },
    { name: 'Watermark-free export', free: 'No (Watermarked)', pro: 'Yes', business: 'Yes' },
    { name: 'Poster Generation', free: 'Yes (Standard)', pro: 'Yes (High-Res)', business: 'Yes (Ultra-Res)' },
    { name: 'AI Copywriting Hub', free: '10 Credits/mo', pro: '250 Credits/mo', business: 'Unlimited' },
    { name: 'Google Business Sync', free: 'No', pro: 'Yes', business: 'Yes' },
    { name: 'SEO Tools', free: 'No', pro: 'No', business: 'Yes' },
    { name: 'Dedicated Account Manager', free: 'No', pro: 'No', business: 'Yes' }
  ];

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[50vh] gap-3">
        <Spinner size="lg" />
        <span className="text-sm text-textSecondary font-semibold">Loading billing configuration...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full pb-16">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest">
            <DollarSign className="w-4 h-4 text-purple-400" /> Account Level
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">Plans & Billing</h1>
          <p className="text-xs text-textSecondary">Select the appropriate license level for your operations.</p>
        </div>

        <div className="flex items-center p-1 rounded-xl bg-white/[0.04] border border-white/10 self-start md:self-auto">
          <button
            onClick={() => setBillingPeriod('monthly')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              billingPeriod === 'monthly'
                ? 'bg-primary text-white shadow-neon-sm font-black'
                : 'text-textSecondary hover:text-white'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingPeriod('yearly')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              billingPeriod === 'yearly'
                ? 'bg-primary text-white shadow-neon-sm font-black'
                : 'text-textSecondary hover:text-white'
            }`}
          >
            Yearly <span className="bg-purple-500/20 text-purple-300 text-[9px] px-1.5 py-0.5 rounded border border-purple-500/30">Save 20%</span>
          </button>
        </div>
      </div>

      {success && (
        <div className="px-4 py-3 rounded-lg border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 text-xs font-semibold">
          {success}
        </div>
      )}

      {currentSub && (
        <div className="relative overflow-hidden rounded-[20px] border border-purple-500/20 bg-gradient-to-r from-purple-500/10 to-transparent p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-lg shadow-purple-500/5">
          <div className="flex flex-col gap-1 z-10">
            <span className="text-[10px] text-purple-400 uppercase tracking-widest font-black">Currently Active Subscription</span>
            <h3 className="text-xl font-extrabold text-white flex items-center gap-2">
              {currentSub.plan} Tier <Badge variant="accent" className="uppercase font-bold tracking-widest">Active</Badge>
            </h3>
            <p className="text-[11px] text-textSecondary">
              Your billing cycle expires on <strong className="text-white">{new Date(currentSub.expiresAt).toLocaleDateString()}</strong>.
            </p>
          </div>
          <div className="flex flex-col text-left md:text-right gap-1 z-10 shrink-0 font-medium text-[10px] text-textSecondary">
            <span>STATUS: <strong className="text-success uppercase">{currentSub.status}</strong></span>
            <span>BILLING GATEWAY: <strong className="text-white">Stripe Sandbox</strong></span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {PLANS.map((plan) => {
          const isCurrent = currentSub?.plan === plan.id || (!currentSub && plan.id === 'FREE');
          const Icon = plan.icon;

          return (
            <Card
              key={plan.id}
              className={`relative flex flex-col justify-between p-6 md:p-8 transition-all duration-300 ${
                plan.popular ? 'border-primary/50 shadow-neon-md' : 'border-white/[0.06]'
              }`}
            >
              {plan.popular && (
                <span className="absolute top-0 left-1/2 -translate-y-1/2 -translate-x-1/2 bg-primary border border-primary/25 text-white text-[9px] font-black tracking-widest uppercase px-3.5 py-1 rounded-full shadow-lg">
                  RECOMMENDED
                </span>
              )}

              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/[0.06]">
                    <Icon className="w-5.5 h-5.5" style={{ color: plan.color }} />
                  </div>
                  <div>
                    <h3 className="font-extrabold tracking-wide text-lg text-white">{plan.name}</h3>
                    <p className="text-xs text-textSecondary mt-0.5">{plan.tagline}</p>
                  </div>
                </div>

                <div className="mb-6 flex items-baseline gap-1">
                  <span className="text-4xl font-black text-white">{getPrice(plan)}</span>
                  <span className="text-xs text-textSecondary font-medium"> / month</span>
                </div>

                <button
                  onClick={() => handleSelectPlan(plan)}
                  disabled={isCurrent}
                  className={`w-full py-3 rounded-xl text-xs font-bold tracking-wide transition-all border ${
                    isCurrent
                      ? 'bg-white/[0.06] border-white/[0.08] text-textSecondary cursor-default'
                      : plan.popular
                      ? 'bg-primary border-primary/25 hover:opacity-90 text-white shadow-lg shadow-primary/20'
                      : 'bg-white/[0.04] border border-white/10 hover:bg-white/[0.08] text-white font-bold'
                  }`}
                >
                  {isCurrent ? 'Current Tier' : `Select ${plan.name}`}
                </button>

                <div className="border-t border-white/[0.06] my-6" />
                <ul className="flex flex-col gap-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-xs text-white">
                      <Check className="w-4.5 h-4.5 text-purple-400 shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                  {plan.missing.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-xs text-textSecondary/40">
                      <span className="w-4.5 text-center shrink-0 font-bold">—</span>
                      <span className="line-through">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Card>
          );
        })}
      </div>
 
      <Card>
        <Card.Header>
          <Card.Title>Detailed Plan Comparison</Card.Title>
        </Card.Header>
        <Card.Content className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/[0.06] text-textSecondary uppercase tracking-widest font-black">
                  <th className="py-4">FEATURES</th>
                  <th className="py-4">FREE</th>
                  <th className="py-4">PRO</th>
                  <th className="py-4">BUSINESS</th>
                </tr>
              </thead>
              <tbody>
                {comparisonFeatures.map((feat, idx) => (
                  <tr key={idx} className="border-b border-white/[0.04] hover:bg-white/[0.01] transition-all">
                    <td className="py-4 font-bold text-white">{feat.name}</td>
                    <td className="py-4 text-textSecondary">{feat.free}</td>
                    <td className="py-4 text-purple-300 font-semibold">{feat.pro}</td>
                    <td className="py-4 text-amber-400 font-bold">{feat.business}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card.Content>
      </Card>
 
      <Card>
        <Card.Header>
          <Card.Title className="text-center w-full block">Frequently Asked Questions</Card.Title>
        </Card.Header>
        <Card.Content className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { q: 'Can I change plans anytime?', a: 'Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.' },
              { q: 'Is there a free trial?', a: 'Yes! Our Free plan is available forever with no credit card required to get started.' },
              { q: 'What payment methods do you accept?', a: 'We accept major credit cards (Visa, MasterCard, Amex) simulated via the checkout preview panel.' },
              { q: 'Can I cancel anytime?', a: 'Absolutely. Cancel your subscription anytime with no cancellation fees or penalties.' }
            ].map((item, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] flex flex-col gap-2">
                <div className="text-xs font-bold text-white">{item.q}</div>
                <div className="text-xs text-textSecondary leading-relaxed font-light">{item.a}</div>
              </div>
            ))}
          </div>
        </Card.Content>
      </Card>

      <AnimatePresence>
        {checkoutPlan && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setCheckoutPlan(null)} />
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="relative w-full max-w-md rounded-3xl border border-white/10 bg-[#0F0F17] p-6 text-white shadow-2xl z-10"
            >
              <button
                onClick={() => setCheckoutPlan(null)}
                className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-white/[0.04] text-textSecondary hover:text-white transition-colors"
              >
                <X className="w-4.5 h-4.5" />
              </button>

              <h3 className="text-lg font-extrabold flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-primary animate-pulse font-extrabold" /> Confirm Checkout
              </h3>

              <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 mb-6 flex flex-col gap-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-textSecondary">PLAN SELECTED:</span>
                  <span className="font-black text-white">{checkoutPlan.name.toUpperCase()}</span>
                </div>
                <div className="flex justify-between items-center border-t border-white/[0.06] pt-2">
                  <span className="text-xs font-semibold text-textSecondary">TOTAL DUE NOW:</span>
                  <span className="text-base font-extrabold text-primary">{getPrice(checkoutPlan)}</span>
                </div>
              </div>

              <form onSubmit={handleCheckoutSubmit} className="flex flex-col gap-4">
                <Input
                  label="Card Number"
                  required
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                />

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Expiry Date"
                    required
                    placeholder="MM/YY"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                  />
                  <Input
                    label="CVC"
                    type="password"
                    required
                    maxLength="3"
                    value={cardCvc}
                    onChange={(e) => setCardCvc(e.target.value)}
                  />
                </div>

                <div className="text-[10px] text-textSecondary leading-normal my-2 text-center font-semibold">
                  🛡️ This is a secure checkout simulator. Clicking "Confirm Payment" will securely update your backend subscription using the Stripe Sandbox profile.
                </div>

                <button
                  type="submit"
                  disabled={activating === checkoutPlan.id}
                  className="w-full py-3 bg-gradient-to-r from-primary to-secondary hover:opacity-90 rounded-xl text-xs font-black uppercase tracking-wider text-white transition-all shadow-lg shadow-primary/25 flex justify-center items-center"
                >
                  {activating === checkoutPlan.id ? 'Processing transaction...' : 'Confirm Payment & Subscribe'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
