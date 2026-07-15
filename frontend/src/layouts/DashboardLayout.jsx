import React, { useEffect, useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { toggleSidebar, addToast } from '../store/uiSlice.js';
import { setTheme } from '../store/themeSlice.js';
import { logout } from '../store/authSlice.js';
import {
  setBusinesses,
  setBusinessesLoading,
  setSelectedBusiness,
} from '../store/businessSlice.js';
import {
  Menu, Sun, Moon, Monitor, LogOut, User, Settings as SettingsIcon,
  Bell, Search, ChevronDown, LayoutDashboard, Target, BarChart3,
  Building, Megaphone, Palette, Star, Calendar,
  MapPin, TrendingUp, Bot, CreditCard, UserCog, Globe2, Instagram, Share2,
  Sparkles, Zap
} from 'lucide-react';
import Avatar from '../components/UI/Avatar.jsx';
import Dropdown from '../components/UI/Dropdown.jsx';
import { ToastContainer } from '../components/UI/Toast.jsx';
import BusinessSelector from '../components/UI/BusinessSelector.jsx';
import api from '../services/api.js';

export const DashboardLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector((state) => state.auth.user) || { name: 'Admin User', email: 'admin@trendora.com', role: 'ADMIN' };
  const sidebarCollapsed = useSelector((state) => state.ui.sidebarCollapsed);
  const currentTheme = useSelector((state) => state.theme.theme);
  const businesses = useSelector((state) => state.business.businesses);
  const selectedBusinessId = useSelector((state) => state.business.selectedBusinessId);
  const [activePlan, setActivePlan] = useState('FREE');

  // Fetch current plan status for badge
  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const res = await api.get('/api/billing');
        if (res.data?.success && res.data.data) {
          setActivePlan(res.data.data.plan || 'FREE');
        }
      } catch (err) {
        setActivePlan('FREE');
      }
    };
    fetchPlan();
  }, [location.pathname]);

  // App-level business init
  useEffect(() => {
    const initBusinesses = async () => {
      dispatch(setBusinessesLoading());
      try {
        const res = await api.get('/api/businesses');
        const list = res.data.data || [];
        dispatch(setBusinesses(list));

        if (list.length === 1) {
          dispatch(setSelectedBusiness(list[0].id));
        } else if (list.length === 0) {
          if (location.pathname !== '/businesses') {
            navigate('/businesses');
          }
        }
      } catch (err) {
        // Backend offline: try demo data from localStorage
        const local = localStorage.getItem('demo_businesses');
        if (local) {
          const list = JSON.parse(local);
          dispatch(setBusinesses(list));
          if (list.length === 1) {
            dispatch(setSelectedBusiness(list[0].id));
          } else if (list.length === 0) {
            if (location.pathname !== '/businesses') {
              navigate('/businesses');
            }
          }
        } else {
          if (location.pathname !== '/businesses') {
            navigate('/businesses');
          }
        }
      }
    };

    initBusinesses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const menuGroups = [
    {
      title: 'Overview',
      items: [
        { label: 'Dashboard', path: '/', icon: LayoutDashboard },
        { label: 'Analytics', path: '/analytics', icon: BarChart3 },
        { label: 'Instagram Insights', path: '/instagram-analytics', icon: Instagram },
      ],
    },
    {
      title: 'Business Hub',
      items: [
        { label: 'Businesses', path: '/businesses', icon: Building },
        { label: 'Business Profile', path: '/business-profile', icon: UserCog },
      ],
    },
    {
      title: 'Marketing Suite',
      items: [
        { label: 'Poster Generator', path: '/posters', icon: Palette },
        { label: 'AI Content Generator', path: '/ai-generator', icon: Bot },
        { label: 'Campaign Manager', path: '/ads-campaigns', icon: Megaphone },
        { label: 'Social Scheduler', path: '/scheduler', icon: Calendar },
      ],
    },
    {
      title: 'Account & Billing',
      items: [
        { label: 'Plans & Billing', path: '/billing', icon: CreditCard },
        { label: 'Team Access', path: '/team', icon: Star },
        { label: 'Google Business', path: '/gbp', icon: Globe2 },
        { label: 'Social Accounts', path: '/social-accounts', icon: Share2 },
        { label: 'SEO Audit', path: '/seo', icon: TrendingUp },
      ],
    },
  ];

  const handleLogout = () => {
    dispatch(logout());
    dispatch(addToast({ type: 'success', message: 'Logged out successfully' }));
    navigate('/login');
  };

  const handleThemeChange = (themeName) => {
    dispatch(setTheme(themeName));
  };

  return (
    <div className="min-h-screen flex text-textPrimary relative overflow-x-hidden" style={{ background: 'transparent' }}>

      {/* ── Sidebar ─────────────────────────────────────────── */}
      <motion.aside
        animate={{ width: sidebarCollapsed ? 72 : 272 }}
        transition={{ duration: 0.22, ease: 'easeInOut' }}
        className="hidden md:flex flex-col select-none shrink-0 relative z-20"
        style={{
          background: 'rgba(11, 11, 18, 0.85)',
          backdropFilter: 'blur(24px)',
          borderRight: '1px solid rgba(255,255,255,0.06)',
          boxShadow: '4px 0 24px rgba(0,0,0,0.3)',
        }}
      >
        {/* Logo */}
        <div
          className="h-16 flex items-center px-5 gap-3 overflow-hidden shrink-0"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
        >
          {/* Neon logo icon */}
          <div
            className="w-9 h-9 rounded-[10px] shrink-0 flex items-center justify-center relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #7C3AED 0%, #A855F7 100%)',
              boxShadow: '0 0 16px rgba(124,58,237,0.5)',
            }}
          >
            <span className="text-white font-black text-base leading-none z-10">T</span>
          </div>

          {!sidebarCollapsed && (
            <motion.div
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.18 }}
              className="flex flex-col overflow-hidden"
            >
              <span className="font-black tracking-widest text-[15px] text-white leading-tight">
                TRENDORA
              </span>
              <span
                className="text-[9px] font-bold tracking-[0.2em] uppercase leading-none"
                style={{ color: '#8B5CF6' }}
              >
                ENTERPRISE
              </span>
            </motion.div>
          )}
        </div>

        {/* Menu Items */}
        <div className="flex-1 py-5 px-3 flex flex-col gap-5 overflow-y-auto">
          {menuGroups.map((group, gIdx) => (
            <div key={gIdx} className="flex flex-col gap-0.5">
              {!sidebarCollapsed && (
                <span
                  className="text-[9px] font-bold uppercase tracking-[0.15em] px-3 mb-2 block"
                  style={{ color: 'rgba(161,161,170,0.5)' }}
                >
                  {group.title}
                </span>
              )}
              {group.items.map((item, iIdx) => {
                const isActive = location.pathname === item.path;
                const Icon = item.icon;

                return (
                  <Link
                    key={iIdx}
                    to={item.disabled ? '#' : item.path}
                    onClick={(e) => {
                      if (item.disabled) {
                        e.preventDefault();
                        dispatch(addToast({ type: 'info', message: `${item.label} module is planned for a future release.` }));
                      }
                    }}
                    className={`relative flex items-center gap-3 px-3 py-2.5 rounded-[10px] text-sm font-medium transition-all duration-150 group overflow-hidden
                      ${isActive
                        ? 'text-white'
                        : 'text-textSecondary hover:text-white'
                      }
                      ${item.disabled ? 'opacity-40 cursor-not-allowed' : ''}`}
                    style={isActive ? {
                      background: 'rgba(124, 58, 237, 0.12)',
                      border: '1px solid rgba(124, 58, 237, 0.2)',
                      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04)',
                    } : {
                      border: '1px solid transparent',
                    }}
                  >
                    {/* Hover bg */}
                    {!isActive && (
                      <span className="absolute inset-0 rounded-[10px] bg-white/0 group-hover:bg-white/[0.04] transition-colors duration-150" />
                    )}

                    {/* Active left bar accent */}
                    {isActive && (
                      <motion.div
                        layoutId="activeBar"
                        className="absolute left-0 top-2.5 bottom-2.5 w-0.5 rounded-r-full"
                        style={{
                          background: 'linear-gradient(180deg, #7C3AED 0%, #A855F7 100%)',
                          boxShadow: '0 0 8px rgba(124,58,237,0.7)',
                        }}
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                      />
                    )}
                    <Icon
                      className={`w-4 h-4 shrink-0 transition-colors duration-150 ${isActive ? '' : 'group-hover:text-white'}`}
                      style={isActive ? { color: '#8B5CF6' } : {}}
                    />
                    {!sidebarCollapsed && (
                      <span className="whitespace-nowrap flex-1 text-[13px]">{item.label}</span>
                    )}
                    {!sidebarCollapsed && isActive && (
                      <span
                        className="w-1.5 h-1.5 rounded-full shrink-0"
                        style={{ background: '#7C3AED', boxShadow: '0 0 6px rgba(124,58,237,0.8)' }}
                      />
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </div>

        {/* Workspace Plan Box */}
        {!sidebarCollapsed && (
          <div className="p-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <div
              className="rounded-[14px] p-3.5 flex flex-col gap-2.5"
              style={{
                background: 'rgba(124, 58, 237, 0.06)',
                border: '1px solid rgba(124, 58, 237, 0.2)',
                boxShadow: '0 0 20px rgba(124,58,237,0.06)',
              }}
            >
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-bold text-textSecondary/70 uppercase tracking-widest">
                  Workspace Plan
                </span>
                <span
                  className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                    activePlan === 'BUSINESS'
                      ? 'bg-amber-500/15 border border-amber-500/30 text-amber-400'
                      : activePlan === 'PRO'
                      ? 'bg-primary/20 border border-primary/40 text-purple-300'
                      : 'bg-white/[0.06] text-textSecondary border border-white/[0.08]'
                  }`}
                >
                  {activePlan}
                </span>
              </div>
              <p className="text-[11px] text-textSecondary leading-relaxed">
                {activePlan === 'FREE'
                  ? 'Basic features with Trendora watermark.'
                  : 'Full enterprise credentials unlocked.'}
              </p>
              {activePlan === 'FREE' && (
                <button
                  onClick={() => navigate('/billing')}
                  className="w-full mt-1 py-2 rounded-[10px] text-[11px] font-bold text-white tracking-wide transition-all"
                  style={{
                    background: 'linear-gradient(135deg, #7C3AED 0%, #A855F7 100%)',
                    boxShadow: '0 4px 16px -4px rgba(124,58,237,0.5)',
                  }}
                >
                  Upgrade to Pro ✦
                </button>
              )}
            </div>
          </div>
        )}
      </motion.aside>

      {/* ── Main Content Area ───────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header
          className="h-16 sticky top-0 z-30 flex items-center justify-between px-6"
          style={{
            background: 'rgba(6, 6, 10, 0.85)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          <div className="flex items-center gap-3">
            {/* Sidebar toggle */}
            <button
              type="button"
              onClick={() => dispatch(toggleSidebar())}
              className="p-2 rounded-[10px] text-textSecondary hidden md:flex transition-all duration-150 hover:text-white"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              <Menu className="w-4 h-4" />
            </button>

            {/* Search */}
            <div className="relative hidden md:block w-60">
              <Search className="w-3.5 h-3.5 text-textSecondary/50 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search modules..."
                className="w-full pl-9 pr-4 py-2 text-xs rounded-[10px]
                  placeholder-textSecondary/40 text-textPrimary
                  focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40
                  transition-all duration-150"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                }}
                onFocus={(e) => {
                  e.target.style.background = 'rgba(255,255,255,0.06)';
                  e.target.style.borderColor = 'rgba(124,58,237,0.4)';
                }}
                onBlur={(e) => {
                  e.target.style.background = 'rgba(255,255,255,0.04)';
                  e.target.style.borderColor = 'rgba(255,255,255,0.08)';
                }}
              />
            </div>

            {/* Business Selector */}
            <BusinessSelector />
          </div>

          <div className="flex items-center gap-2">
            {/* Theme toggle */}
            <Dropdown
              align="right"
              trigger={
                <button
                  type="button"
                  className="p-2 rounded-[10px] text-textSecondary flex items-center justify-center transition-all duration-150 hover:text-white"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                  aria-label="Theme selection"
                >
                  {currentTheme === 'light'  && <Sun className="w-4 h-4" />}
                  {currentTheme === 'dark'   && <Moon className="w-4 h-4" />}
                  {currentTheme === 'system' && <Monitor className="w-4 h-4" />}
                </button>
              }
            >
              <Dropdown.Item onClick={() => handleThemeChange('light')}>
                <Sun className="w-4 h-4 text-textSecondary" /> Light Mode
              </Dropdown.Item>
              <Dropdown.Item onClick={() => handleThemeChange('dark')}>
                <Moon className="w-4 h-4 text-textSecondary" /> Dark Mode
              </Dropdown.Item>
              <Dropdown.Item onClick={() => handleThemeChange('system')}>
                <Monitor className="w-4 h-4 text-textSecondary" /> System Default
              </Dropdown.Item>
            </Dropdown>

            {/* Notification Bell */}
            <button
              type="button"
              onClick={() => dispatch(addToast({ type: 'info', message: 'No new notifications.' }))}
              className="p-2 rounded-[10px] text-textSecondary relative transition-all duration-150 hover:text-white"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span
                className="absolute top-2.5 right-2.5 w-1.5 h-1.5 rounded-full"
                style={{ background: '#EF4444', boxShadow: '0 0 6px rgba(239,68,68,0.7)' }}
              />
            </button>

            {/* User menu */}
            <Dropdown
              align="right"
              trigger={
                <div className="flex items-center gap-2.5 pl-3 select-none cursor-pointer group"
                  style={{ borderLeft: '1px solid rgba(255,255,255,0.08)' }}
                >
                  <Avatar name={user.name} size="sm" />
                  <div className="text-left hidden md:block">
                    <p className="text-xs font-semibold text-white leading-none group-hover:text-purple-300 transition-colors duration-150">
                      {user.name}
                    </p>
                    <p className="text-[9px] text-textSecondary leading-none mt-1 uppercase font-bold tracking-widest">
                      {user.role}
                    </p>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-textSecondary group-hover:text-white transition-colors duration-150" />
                </div>
              }
            >
              <Dropdown.Item onClick={() => navigate('/profile')}>
                <User className="w-4 h-4 text-textSecondary" /> Profile Details
              </Dropdown.Item>
              <Dropdown.Item onClick={() => navigate('/billing')}>
                <CreditCard className="w-4 h-4 text-textSecondary" /> Plans & Billing
              </Dropdown.Item>
              <Dropdown.Item onClick={() => navigate('/settings')}>
                <SettingsIcon className="w-4 h-4 text-textSecondary" /> Settings
              </Dropdown.Item>
              <div className="my-1 mx-2" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }} />
              <Dropdown.Item onClick={handleLogout} className="text-red-400 hover:text-red-300">
                <LogOut className="w-4 h-4" /> Logout
              </Dropdown.Item>
            </Dropdown>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 overflow-y-auto bg-transparent relative z-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.28, ease: 'easeOut' }}
              className="h-full flex flex-col gap-6"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Footer */}
        <footer
          className="h-11 flex items-center justify-between px-6 text-[11px] text-textSecondary select-none"
          style={{
            borderTop: '1px solid rgba(255,255,255,0.05)',
            background: 'rgba(6,6,10,0.6)',
          }}
        >
          <span>© {new Date().getFullYear()} Trendora AI SaaS. All rights reserved.</span>
          <div className="flex items-center gap-5">
            <a href="#" className="hover:text-white transition-colors duration-150">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors duration-150">Terms of Service</a>
          </div>
        </footer>
      </div>

      <ToastContainer />
    </div>
  );
};

export default DashboardLayout;
