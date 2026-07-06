import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { toggleSidebar, addToast } from '../store/uiSlice.js';
import { setTheme } from '../store/themeSlice.js';
import { logout } from '../store/authSlice.js';
import {
  Menu, Sun, Moon, Monitor, LogOut, User, Settings as SettingsIcon,
  Bell, Search, ChevronDown, LayoutDashboard, Target, BarChart3,
  Sparkles, Mail
} from 'lucide-react';
import Avatar from '../components/UI/Avatar.jsx';
import Dropdown from '../components/UI/Dropdown.jsx';
import { ToastContainer } from '../components/UI/Toast.jsx';

export const DashboardLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector((state) => state.auth.user) || { name: 'Admin User', email: 'admin@trendora.com', role: 'ADMIN' };
  const sidebarCollapsed = useSelector((state) => state.ui.sidebarCollapsed);
  const currentTheme = useSelector((state) => state.theme.theme);

  const menuGroups = [
    {
      title: 'Marketing',
      items: [
        { label: 'Dashboard', path: '/', icon: LayoutDashboard },
        { label: 'Campaigns', path: '/campaigns', icon: Target, disabled: true },
        { label: 'Analytics', path: '/analytics', icon: BarChart3, disabled: true },
      ],
    },
    {
      title: 'Modules',
      items: [
        { label: 'AI Copywriter', path: '/ai-writer', icon: Sparkles, disabled: true },
        { label: 'Email Campaigns', path: '/emails', icon: Mail, disabled: true },
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
    <div className="min-h-screen flex bg-background text-textPrimary">
      <motion.aside
        animate={{ width: sidebarCollapsed ? 72 : 260 }}
        transition={{ type: 'spring', damping: 20, stiffness: 200 }}
        className="hidden md:flex flex-col border-r border-border bg-surface select-none shrink-0"
      >
        <div className="h-16 flex items-center px-5 border-b border-border gap-3 overflow-hidden">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center border border-primary/20 shrink-0">
            <span className="text-white font-extrabold text-sm">T</span>
          </div>
          {!sidebarCollapsed && (
            <span className="font-bold tracking-tight text-base whitespace-nowrap">Trendora</span>
          )}
        </div>

        <div className="flex-1 py-6 px-3 flex flex-col gap-6 overflow-y-auto">
          {menuGroups.map((group, gIdx) => (
            <div key={gIdx} className="flex flex-col gap-1.5">
              {!sidebarCollapsed && (
                <span className="text-[10px] font-bold text-textSecondary uppercase tracking-wider px-2">
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
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group ${
                      isActive
                        ? 'bg-primary/10 text-primary'
                        : 'text-textSecondary hover:bg-background hover:text-textPrimary'
                    } ${item.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-primary' : 'text-textSecondary group-hover:text-textPrimary'}`} />
                    {!sidebarCollapsed && (
                      <span className="whitespace-nowrap flex-1">{item.label}</span>
                    )}
                    {!sidebarCollapsed && item.disabled && (
                      <span className="text-[9px] bg-background border border-border px-1.5 py-0.5 rounded text-textSecondary select-none uppercase">
                        Soon
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </div>
      </motion.aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-border bg-surface/80 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => dispatch(toggleSidebar())}
              className="p-1.5 hover:bg-background rounded-lg border border-border text-textSecondary md:block hidden"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="relative md:block hidden w-64">
              <Search className="w-4 h-4 text-textSecondary absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search resources..."
                className="w-full pl-9 pr-4 py-1.5 text-xs bg-background border border-border rounded-lg placeholder-textSecondary/50 text-textPrimary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Dropdown
              align="right"
              trigger={
                <button type="button" className="p-2 hover:bg-background rounded-lg border border-border text-textSecondary flex items-center justify-center">
                  {currentTheme === 'light' && <Sun className="w-4.5 h-4.5" />}
                  {currentTheme === 'dark' && <Moon className="w-4.5 h-4.5" />}
                  {currentTheme === 'system' && <Monitor className="w-4.5 h-4.5" />}
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

            <button
              type="button"
              onClick={() => dispatch(addToast({ type: 'info', message: 'No new notifications.' }))}
              className="p-2 hover:bg-background rounded-lg border border-border text-textSecondary relative"
            >
              <Bell className="w-4.5 h-4.5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-danger animate-pulse" />
            </button>

            <Dropdown
              align="right"
              trigger={
                <div className="flex items-center gap-2 pl-2 border-l border-border select-none cursor-pointer">
                  <Avatar name={user.name} size="sm" />
                  <div className="text-left md:block hidden">
                    <p className="text-xs font-semibold text-textPrimary leading-none">{user.name}</p>
                    <p className="text-[10px] text-textSecondary leading-none mt-1">{user.role}</p>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-textSecondary" />
                </div>
              }
            >
              <Dropdown.Item onClick={() => navigate('/profile')}>
                <User className="w-4 h-4 text-textSecondary" /> Profile Details
              </Dropdown.Item>
              <Dropdown.Item onClick={() => navigate('/settings')}>
                <SettingsIcon className="w-4 h-4 text-textSecondary" /> Settings
              </Dropdown.Item>
              <div className="border-t border-border my-1" />
              <Dropdown.Item onClick={handleLogout} className="text-danger hover:bg-danger/5">
                <LogOut className="w-4 h-4 text-danger" /> Logout
              </Dropdown.Item>
            </Dropdown>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-y-auto bg-background/50">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="h-full flex flex-col gap-6"
          >
            <Outlet />
          </motion.div>
        </main>

        <footer className="h-14 border-t border-border bg-surface flex items-center justify-between px-6 text-xs text-textSecondary">
          <span>&copy; {new Date().getFullYear()} Trendora Marketing. All rights reserved.</span>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-textPrimary transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-textPrimary transition-colors">Terms of Service</a>
          </div>
        </footer>
      </div>

      <ToastContainer />
    </div>
  );
};

export default DashboardLayout;
