import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, HelpCircle, Star, Sparkles, Shield, Zap } from 'lucide-react';
import api from '../../services/api';

export const PremiumPricingModal = ({ isOpen, onClose, onUpgradeSuccess }) => {
  const [billingPeriod, setBillingPeriod] = useState('monthly'); // monthly or yearly
  const [currentSub, setCurrentSub] = useState(null);
  const [loading, setLoading] = useState(false);
  const [upgradingTo, setUpgradingTo] = useState(null);
  const [checkoutPlan, setCheckoutPlan] = useState(null);

  // Simulated credit card states
  const [cardNumber, setCardNumber] = useState('4242 4242 4242 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('123');

  useEffect(() => {
    if (isOpen) {
      const fetchSubscription = async () => {
        try {
          const res = await api.get('/api/billing');
          if (res.data?.success) {
            setCurrentSub(res.data.data);
          }
        } catch (err) {
          console.error('Failed to load sub in modal:', err);
        }
      };
      fetchSubscription();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const PLANS = [
    {
      id: 'FREE',
      name: 'Free Starter',
      description: 'Perfect for exploring AI templates',
      monthlyPrice: 0,
      yearlyPrice: 0,
      icon: Shield,
      color: '#94A3B8',
      features: [
        '1 Business Profile',
        'Standard Image Quality',
        'Download with Watermark',
        '10 AI Credits / mo',
        'PNG Exports only',
        'Basic Support'
      ]
    },
    {
      id: 'PRO',
      name: 'Pro Professional',
      description: 'Best for local growing brands',
      monthlyPrice: 29,
      yearlyPrice: 240, // $20/mo
      icon: Zap,
      color: '#6D5EF8',
      popular: true,
      features: [
        '5 Business Profiles',
        'Ultra High-Resolution',
        'No Watermark',
        '250 AI Credits / mo',
        'PNG, JPG & PDF Exports',
        'Priority AI Rendering',
        '10 Team Members',
        'Social Media Scheduler'
      ]
    },
    {
      id: 'BUSINESS',
      name: 'Business Enterprise',
      description: 'Ultimate power for multi-locations',
      monthlyPrice: 79,
      yearlyPrice: 720, // $60/mo
      icon: Star,
      color: '#F59E0B',
      features: [
        'Unlimited Businesses',
        'Ultra High-Resolution',
        'No Watermark',
        'Unlimited AI Credits',
        'PNG, JPG, PDF & Custom Exports',
        'Dedicated API Access',
        'Unlimited Team Members',
        'SEO Audit integrations',
        '24/7 Premium Support'
      ]
    }
  ];

  const handleSelectPlan = (plan) => {
    if (plan.id === 'FREE' && currentSub?.plan === 'FREE') return;
    setCheckoutPlan(plan);
  };

  const handleCheckoutSubmit = async (e) => {
    e.preventDefault();
    if (!checkoutPlan) return;

    setLoading(true);
    try {
      const res = await api.post('/api/billing', { plan: checkoutPlan.id });
      if (res.data?.success) {
        setCurrentSub(res.data.data);
        if (onUpgradeSuccess) {
          onUpgradeSuccess(checkoutPlan.id);
        }
        setCheckoutPlan(null);
        onClose();
      }
    } catch (err) {
      console.error('Upgrade failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const getPrice = (plan) => {
    if (billingPeriod === 'monthly') {
      return `$${plan.monthlyPrice}`;
    }
    return `$${Math.round(plan.yearlyPrice / 12)}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
 
      {/* Modal Card */}
      <AnimatePresence mode="wait">
        {!checkoutPlan ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative w-full max-w-5xl rounded-3xl border border-slate-200 bg-white p-6 md:p-8 text-textPrimary shadow-2xl max-h-[90vh] overflow-y-auto"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-xl hover:bg-slate-100 border border-slate-200 text-textSecondary hover:text-textPrimary transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
 
            {/* Header */}
            <div className="text-center mb-8 flex flex-col items-center gap-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" /> Unlock Premium Access
              </div>
              <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">Upgrade Your Plan</h2>
              <p className="text-sm text-textSecondary max-w-md mt-1">
                Choose the best tier to download high-resolution marketing posters without watermarks.
              </p>
 
              {/* Billing Cycle Toggle */}
              <div className="flex items-center gap-3 mt-4 bg-slate-100 border border-slate-200 rounded-full p-1">
                <button
                  onClick={() => setBillingPeriod('monthly')}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-wide transition-all ${
                    billingPeriod === 'monthly' ? 'bg-primary text-white shadow-md' : 'text-textSecondary hover:text-textPrimary'
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setBillingPeriod('yearly')}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-wide transition-all ${
                    billingPeriod === 'yearly' ? 'bg-primary text-white shadow-md' : 'text-textSecondary hover:text-textPrimary'
                  }`}
                >
                  Yearly (Save 20%)
                </button>
              </div>
            </div>
 
            {/* Pricing Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {PLANS.map((plan) => {
                const isCurrent = currentSub?.plan === plan.id || (!currentSub && plan.id === 'FREE');
                const Icon = plan.icon;
 
                return (
                  <div
                    key={plan.id}
                    className={`relative flex flex-col justify-between rounded-2xl border bg-white p-6 transition-all shadow-sm hover:shadow-md ${
                      plan.popular ? 'border-primary shadow-lg shadow-primary/5' : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {plan.popular && (
                      <span className="absolute top-0 left-1/2 -translate-y-1/2 -translate-x-1/2 bg-primary border border-white/20 text-white text-[9px] font-black tracking-widest uppercase px-3 py-1 rounded-full">
                        MOST POPULAR
                      </span>
                    )}
 
                    {isCurrent && (
                      <span className="absolute top-4 right-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                        CURRENT PLAN
                      </span>
                    )}
 
                    <div>
                      <div className="flex items-center gap-2.5 mb-3">
                        <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                          <Icon className="w-5 h-5" style={{ color: plan.color }} />
                        </div>
                        <div>
                          <h3 className="font-extrabold tracking-wide text-base">{plan.name}</h3>
                          <p className="text-[11px] text-textSecondary">{plan.description}</p>
                        </div>
                      </div>
 
                      <div className="mb-6">
                        <span className="text-3xl font-black">{getPrice(plan)}</span>
                        <span className="text-xs text-textSecondary"> / month</span>
                        {billingPeriod === 'yearly' && plan.monthlyPrice > 0 && (
                          <div className="text-[10px] text-primary font-semibold mt-1">Billed annually</div>
                        )}
                      </div>
 
                      <ul className="flex flex-col gap-2.5 mb-8">
                        {plan.features.map((feature, fIdx) => (
                          <li key={fIdx} className="flex items-start gap-2.5 text-xs text-textPrimary leading-normal">
                            <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
 
                    <button
                      onClick={() => handleSelectPlan(plan)}
                      disabled={isCurrent}
                      className={`w-full py-2.5 rounded-xl text-xs font-bold tracking-wide transition-all border ${
                        isCurrent
                          ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-default'
                          : plan.popular
                          ? 'bg-primary border-primary hover:opacity-90 text-white shadow-lg shadow-primary/20'
                          : 'bg-slate-50 border border-slate-200 hover:bg-slate-100 text-textPrimary'
                      }`}
                    >
                      {isCurrent ? 'Current Plan' : `Upgrade to ${plan.name.split(' ')[0]}`}
                    </button>
                  </div>
                );
              })}
            </div>
 
            {/* Comparison Footer Tip */}
            <div className="text-center text-xs text-textSecondary flex items-center justify-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-textSecondary/60" />
              <span>Questions? Secure checkout placeholder provided. Upgrade is instant.</span>
            </div>
          </motion.div>
        ) : (
          /* Simulated Checkout Popup */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 text-textPrimary shadow-2xl"
          >
            <button
              onClick={() => setCheckoutPlan(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-slate-100 text-textSecondary hover:text-textPrimary transition-colors"
            >
              <X className="w-4.5 h-4.5" />
            </button>
 
            <h3 className="text-lg font-extrabold flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-primary animate-pulse font-extrabold" /> Confirm Checkout
            </h3>
 
            <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4 mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold text-textSecondary">PLAN SELECTED:</span>
                <span className="text-xs font-black text-textPrimary">{checkoutPlan.name.toUpperCase()}</span>
              </div>
              <div className="flex justify-between items-center border-t border-slate-200 pt-2">
                <span className="text-xs font-bold text-textSecondary">TOTAL DUE NOW:</span>
                <span className="text-base font-extrabold text-primary">{getPrice(checkoutPlan)}</span>
              </div>
            </div>
 
            <form onSubmit={handleCheckoutSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-textSecondary uppercase tracking-wider">Card Number</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary/20 rounded-xl px-3 py-2.5 text-xs text-textPrimary placeholder-slate-400 focus:outline-none transition-all"
                  />
                  <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[10px] text-textSecondary font-bold uppercase tracking-wider">
                    VISA
                  </div>
                </div>
              </div>
 
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-textSecondary uppercase tracking-wider">Expiry Date</label>
                  <input
                    type="text"
                    required
                    placeholder="MM/YY"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary/20 rounded-xl px-3 py-2.5 text-xs text-textPrimary placeholder-slate-400 focus:outline-none transition-all"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-textSecondary uppercase tracking-wider">CVC</label>
                  <input
                    type="password"
                    required
                    maxLength="3"
                    value={cardCvc}
                    onChange={(e) => setCardCvc(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary/20 rounded-xl px-3 py-2.5 text-xs text-textPrimary placeholder-slate-400 focus:outline-none transition-all"
                  />
                </div>
              </div>
 
              <div className="text-[10px] text-textSecondary leading-normal my-2 text-center">
                This is a secure checkout simulator. Clicking "Confirm Payment" will securely update your backend subscription using the simulated Stripe/Razorpay flow.
              </div>
 
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-primary to-secondary hover:opacity-90 rounded-xl text-xs font-black uppercase tracking-wider text-white transition-all shadow-lg shadow-primary/20"
              >
                {loading ? 'Processing transaction...' : 'Confirm Payment & Subscribe'}
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PremiumPricingModal;
