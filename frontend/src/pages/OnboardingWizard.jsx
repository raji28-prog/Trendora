import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building, 
  MapPin, 
  Phone, 
  Globe, 
  Briefcase, 
  Upload, 
  Check, 
  ArrowRight, 
  ArrowLeft,
  Sparkles,
  PartyPopper
} from 'lucide-react';
import { updateUser } from '../store/authSlice.js';
import { addToast } from '../store/uiSlice.js';
import api from '../services/api.js';

const CATEGORIES = [
  { value: 'Retail', label: 'Retail & Shopping' },
  { value: 'Restaurant', label: 'Food, Dining & Restaurant' },
  { value: 'Services', label: 'Professional Services' },
  { value: 'Health', label: 'Healthcare & Wellness' },
  { value: 'Technology', label: 'Technology & IT' },
  { value: 'Education', label: 'Education & Training' },
  { value: 'Other', label: 'Other Business Type' },
];

const BRAND_COLORS = [
  { name: 'Indigo Dream', value: '#6D5EF8', bg: 'bg-[#6D5EF8]' },
  { name: 'Violet Spark', value: '#8B5CF6', bg: 'bg-[#8B5CF6]' },
  { name: 'Emerald Growth', value: '#10B981', bg: 'bg-[#10B981]' },
  { name: 'Amber Glow', value: '#F59E0B', bg: 'bg-[#F59E0B]' },
  { name: 'Rose Petal', value: '#F43F5E', bg: 'bg-[#F43F5E]' },
];

export const OnboardingWizard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Form States
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Services');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [website, setWebsite] = useState('');
  
  // Image Upload State
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState('');
  const [brandColor, setBrandColor] = useState('#6D5EF8');

  // Errors
  const [errors, setErrors] = useState({});

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        dispatch(addToast({ type: 'error', message: 'Logo size must be less than 2MB' }));
        return;
      }
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateStep = () => {
    const currentErrors = {};
    if (step === 1) {
      if (!name.trim()) currentErrors.name = 'Business name is required';
      if (!category) currentErrors.category = 'Business category is required';
    } else if (step === 2) {
      if (!address.trim()) currentErrors.address = 'Street address is required';
      if (!phone.trim()) {
        currentErrors.phone = 'Contact number is required';
      } else if (!/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/.test(phone)) {
        currentErrors.phone = 'Please enter a valid phone number';
      }
    }
    setErrors(currentErrors);
    return Object.keys(currentErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      setStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setStep((prev) => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep()) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('category', category);
      formData.append('address', address);
      formData.append('phone', phone);
      if (website) formData.append('website', website);
      formData.append('status', 'ACTIVE');
      if (logoFile) {
        formData.append('images', logoFile);
      }

      const response = await api.post('/api/businesses', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      if (response.data.success) {
        dispatch(updateUser({ hasBusiness: true, business: response.data.data }));
        dispatch(addToast({ type: 'success', message: 'Welcome aboard! Your business profile is ready.' }));
        navigate('/');
      }
    } catch (err) {
      const errMsg = err.response?.data?.error?.message || 'Failed to complete onboarding. Please try again.';
      dispatch(addToast({ type: 'error', message: errMsg }));
    } finally {
      setLoading(false);
    }
  };

  const stepVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, x: -50, transition: { duration: 0.2 } },
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-sectionBackground to-background p-4 sm:p-6 lg:p-8 font-sans transition-colors duration-150">
      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-2xl relative z-10">
        {/* Header Title */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex p-3 rounded-2xl bg-primary/10 text-primary mb-3"
          >
            <Sparkles className="w-6 h-6 animate-pulse" />
          </motion.div>
          <h1 className="text-3xl font-extrabold text-textPrimary tracking-tight">
            Configure Your Business Space
          </h1>
          <p className="text-textSecondary text-sm mt-1">
            Let's setup your workspace details. It only takes a minute.
          </p>
        </div>

        {/* Step Indicator */}
        <div className="mb-8 flex items-center justify-between max-w-md mx-auto px-4 relative">
          <div className="absolute left-6 right-6 top-1/2 h-[2px] bg-border -translate-y-1/2 z-0" />
          <div 
            className="absolute left-6 top-1/2 h-[2px] bg-primary -translate-y-1/2 z-0 transition-all duration-300"
            style={{ width: `${(step - 1) * 50}%` }}
          />

          {[1, 2, 3].map((num) => {
            const isCompleted = step > num;
            const isActive = step === num;

            return (
              <div key={num} className="relative z-10 flex flex-col items-center">
                <motion.div
                  animate={{
                    scale: isActive ? 1.15 : 1,
                    backgroundColor: isCompleted || isActive ? 'var(--primary)' : 'var(--surface)',
                    borderColor: isCompleted || isActive ? 'var(--primary)' : 'var(--border)',
                    color: isCompleted || isActive ? '#FFFFFF' : 'var(--text-secondary)',
                  }}
                  className={`w-10 h-10 rounded-full border-2 flex items-center justify-center font-bold text-sm shadow-sm transition-colors duration-200`}
                >
                  {isCompleted ? <Check className="w-5 h-5 stroke-[3px]" /> : num}
                </motion.div>
                <span className={`text-[10px] font-semibold mt-2 ${isActive ? 'text-primary' : 'text-textSecondary'}`}>
                  {num === 1 ? 'Identity' : num === 2 ? 'Contact' : 'Branding'}
                </span>
              </div>
            );
          })}
        </div>

        {/* Card Body */}
        <div className="bg-surface border border-border shadow-xl rounded-2xl p-6 sm:p-10 relative overflow-hidden">
          <form onSubmit={handleSubmit}>
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  variants={stepVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="flex flex-col gap-6"
                >
                  <div>
                    <h2 className="text-xl font-bold text-textPrimary">Step 1: Business Identity</h2>
                    <p className="text-xs text-textSecondary mt-1">Tell us the core branding details of your business.</p>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-textPrimary flex items-center gap-1.5">
                      <Building className="w-3.5 h-3.5 text-primary" /> Business Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Acme Coffee Co."
                      className={`w-full px-4 py-2.5 text-sm rounded-lg border border-border bg-surface text-textPrimary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 ${
                        errors.name ? 'border-danger focus:ring-danger/20' : ''
                      }`}
                    />
                    {errors.name && (
                      <span className="text-xs text-danger font-medium mt-0.5">{errors.name}</span>
                    )}
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-textPrimary flex items-center gap-1.5">
                      <Briefcase className="w-3.5 h-3.5 text-primary" /> Category
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-3 py-2.5 text-sm rounded-lg border border-border bg-surface text-textPrimary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-150"
                    >
                      {CATEGORIES.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-textPrimary">
                      Business Tagline / Description
                    </label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Tell customers what makes your business unique..."
                      rows={3}
                      className="w-full px-4 py-2.5 text-sm rounded-lg border border-border bg-surface text-textPrimary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 resize-none"
                    />
                  </div>

                  <div className="flex justify-end mt-4">
                    <button
                      type="button"
                      onClick={handleNext}
                      className="inline-flex items-center justify-center font-bold px-6 py-2.5 text-sm bg-primary text-white rounded-lg hover:bg-primaryHover transition-all duration-200 shadow-sm active:scale-95 gap-1.5"
                    >
                      Next Step <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  variants={stepVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="flex flex-col gap-6"
                >
                  <div>
                    <h2 className="text-xl font-bold text-textPrimary">Step 2: Contact & Location</h2>
                    <p className="text-xs text-textSecondary mt-1">Provide information for customers to reach you.</p>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-textPrimary flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-primary" /> Street Address
                    </label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="e.g. 101 Broadway Ave, New York, NY"
                      className={`w-full px-4 py-2.5 text-sm rounded-lg border border-border bg-surface text-textPrimary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 ${
                        errors.address ? 'border-danger' : ''
                      }`}
                    />
                    {errors.address && (
                      <span className="text-xs text-danger font-medium mt-0.5">{errors.address}</span>
                    )}
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-textPrimary flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-primary" /> Contact Phone
                    </label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. +1 555 123 4567"
                      className={`w-full px-4 py-2.5 text-sm rounded-lg border border-border bg-surface text-textPrimary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 ${
                        errors.phone ? 'border-danger' : ''
                      }`}
                    />
                    {errors.phone && (
                      <span className="text-xs text-danger font-medium mt-0.5">{errors.phone}</span>
                    )}
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-textPrimary flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5 text-primary" /> Website URL (Optional)
                    </label>
                    <input
                      type="text"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      placeholder="e.g. www.acmecoffee.com"
                      className="w-full px-4 py-2.5 text-sm rounded-lg border border-border bg-surface text-textPrimary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
                    />
                  </div>

                  <div className="flex justify-between mt-4">
                    <button
                      type="button"
                      onClick={handleBack}
                      className="inline-flex items-center justify-center font-bold px-5 py-2.5 text-sm border border-border hover:bg-sectionBackground rounded-lg text-textPrimary transition-all duration-200 gap-1.5"
                    >
                      <ArrowLeft className="w-4 h-4" /> Back
                    </button>
                    <button
                      type="button"
                      onClick={handleNext}
                      className="inline-flex items-center justify-center font-bold px-6 py-2.5 text-sm bg-primary text-white rounded-lg hover:bg-primaryHover transition-all duration-200 shadow-sm active:scale-95 gap-1.5"
                    >
                      Next Step <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step3"
                  variants={stepVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="flex flex-col gap-6"
                >
                  <div>
                    <h2 className="text-xl font-bold text-textPrimary">Step 3: Brand & Launch</h2>
                    <p className="text-xs text-textSecondary mt-1">Upload your logo and choose your brand profile.</p>
                  </div>

                  {/* Logo Upload Zone */}
                  <div className="flex flex-col sm:flex-row gap-6 items-center">
                    <div 
                      className="w-24 h-24 rounded-2xl flex-shrink-0 flex items-center justify-center border-2 border-dashed border-border overflow-hidden bg-sectionBackground text-textSecondary relative shadow-inner"
                      style={{ borderColor: brandColor }}
                    >
                      {logoPreview ? (
                        <img src={logoPreview} alt="Logo preview" className="w-full h-full object-cover" />
                      ) : (
                        <Building className="w-10 h-10 opacity-40" />
                      )}
                    </div>

                    <div className="flex-1 w-full">
                      <label className="text-xs font-bold text-textPrimary block mb-2">Upload Store Logo</label>
                      <div className="relative">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          id="file-input"
                          className="hidden"
                        />
                        <label
                          htmlFor="file-input"
                          className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-border border-dashed rounded-lg bg-surface text-sm font-semibold text-textSecondary cursor-pointer hover:border-primary hover:text-primary transition-all duration-200"
                        >
                          <Upload className="w-4 h-4" /> Choose Image file...
                        </label>
                      </div>
                      <p className="text-[10px] text-textSecondary mt-1.5">Max size 2MB. Supports PNG, JPG, or WEBP.</p>
                    </div>
                  </div>

                  {/* Curated Brand Colors */}
                  <div>
                    <label className="text-xs font-bold text-textPrimary block mb-3">Primary Theme Color</label>
                    <div className="flex gap-4">
                      {BRAND_COLORS.map((c) => (
                        <button
                          key={c.name}
                          type="button"
                          onClick={() => setBrandColor(c.value)}
                          className={`w-8 h-8 rounded-full ${c.bg} flex items-center justify-center relative transition-transform hover:scale-110 active:scale-95`}
                          title={c.name}
                        >
                          {brandColor === c.value && (
                            <Check className="w-4 h-4 text-white stroke-[3px]" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Brand Preview Card */}
                  <div className="mt-4 p-4 border border-border rounded-xl bg-sectionBackground/60">
                    <span className="text-[10px] uppercase tracking-wider font-extrabold text-textSecondary mb-2 block">
                      Live Business Space Preview
                    </span>
                    <div className="flex items-center gap-4 bg-surface p-4 border border-border rounded-lg shadow-sm">
                      <div 
                        className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-extrabold text-xl overflow-hidden shadow-sm"
                        style={{ backgroundColor: brandColor }}
                      >
                        {logoPreview ? (
                          <img src={logoPreview} alt="Business logo" className="w-full h-full object-cover" />
                        ) : (
                          name?.charAt(0)?.toUpperCase() || '🏢'
                        )}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-textPrimary">{name || 'Your Business Name'}</h4>
                        <span className="text-[11px] font-semibold px-2 py-0.5 bg-border rounded-full text-textSecondary mt-1 inline-block">
                          {category}
                        </span>
                        <div className="text-[10px] text-textSecondary mt-1">
                          📍 {address || 'Business address will be listed here'}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between mt-4">
                    <button
                      type="button"
                      onClick={handleBack}
                      className="inline-flex items-center justify-center font-bold px-5 py-2.5 text-sm border border-border hover:bg-sectionBackground rounded-lg text-textPrimary transition-all duration-200 gap-1.5"
                    >
                      <ArrowLeft className="w-4 h-4" /> Back
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="inline-flex items-center justify-center font-extrabold px-8 py-2.5 text-sm bg-primary hover:bg-primaryHover text-white rounded-lg transition-all duration-200 shadow-md active:scale-95 disabled:opacity-50 gap-2"
                    >
                      {loading ? (
                        'Configuring Space...'
                      ) : (
                        <>
                          <PartyPopper className="w-4 h-4" /> Launch Space
                        </>
                      )}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OnboardingWizard;
