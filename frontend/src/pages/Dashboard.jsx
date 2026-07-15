import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { addToast } from '../store/uiSlice.js';
import {
  Building, Megaphone, Palette, Target, BarChart3, Users, Star, Settings,
  ArrowRight, Sparkles, TrendingUp, ShieldAlert, Award, FileText, Calendar, Clock,
  ArrowUpRight, ArrowDownRight, Zap, Bell, ShieldCheck, Bot
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import api from '../services/api.js';

const chartData = [
  { name: 'Mon', campaigns: 2, posts: 5, score: 75 },
  { name: 'Tue', campaigns: 3, posts: 8, score: 82 },
  { name: 'Wed', campaigns: 5, posts: 12, score: 85 },
  { name: 'Thu', campaigns: 4, posts: 10, score: 80 },
  { name: 'Fri', campaigns: 7, posts: 18, score: 90 },
  { name: 'Sat', campaigns: 9, posts: 24, score: 94 },
  { name: 'Sun', campaigns: 8, posts: 20, score: 92 }
];

/* Animated counter value */
const StatNumber = ({ value, delay = 0 }) => (
  <motion.span
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.4 }}
  >
    {value}
  </motion.span>
);

export const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [stats, setStats] = useState({
    businesses: 0,
    ads: 0,
    campaigns: 0,
    leads: 0,
    posters: 0,
    reviews: 0,
    scheduledPosts: 0,
    monthlyReports: 2,
    topPerformingCampaign: 'None',
    topScore: 0
  });

  const [recentActivities, setRecentActivities] = useState([
    { id: 1, type: 'campaign', text: 'AI Campaign "Summer Cupcake Promo" generated successfully.', time: '10 mins ago', icon: Sparkles, color: 'text-purple-400', bg: 'rgba(124,58,237,0.1)', border: 'rgba(124,58,237,0.2)' },
    { id: 2, type: 'poster',   text: 'New high-resolution marketing flyer saved to gallery.',     time: '1 hour ago',  icon: Palette,   color: 'text-blue-400',   bg: 'rgba(79,70,229,0.1)',  border: 'rgba(79,70,229,0.2)' },
    { id: 3, type: 'post',     text: 'Scheduled Instagram post published successfully.',           time: '4 hours ago', icon: Calendar,  color: 'text-emerald-400', bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.2)' },
    { id: 4, type: 'lead',     text: 'New hot lead captured from Google Ad campaign.',             time: '1 day ago',   icon: Users,     color: 'text-amber-400',   bg: 'rgba(245,158,11,0.1)',  border: 'rgba(245,158,11,0.2)' }
  ]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/api/dashboard/stats');
        if (response.data?.success) {
          setStats(response.data.data);
        }
      } catch (err) {
        const getCount = (key, def) => {
          const item = localStorage.getItem(key);
          return item ? JSON.parse(item).length : def;
        };
        setStats({
          businesses: getCount('demo_businesses', 2),
          ads: getCount('demo_ads', 2),
          campaigns: getCount('demo_campaigns', 3),
          leads: getCount('demo_leads', 2),
          posters: getCount('demo_posters', 1),
          reviews: getCount('demo_reviews', 2),
          scheduledPosts: 0,
          monthlyReports: 2,
          topPerformingCampaign: 'Summer Offer for Cafe',
          topScore: 88
        });
      }
    };
    fetchStats();
  }, []);

  const cards = [
    {
      title: 'Poster Generator',
      description: 'Create high-resolution brand flyers, badges, and marketing banners with custom details.',
      icon: Palette,
      path: '/posters',
      badge: `${stats.posters} files`,
      iconGradient: 'linear-gradient(135deg, #7C3AED 0%, #A855F7 100%)',
      glowColor: 'rgba(124,58,237,0.25)',
      accentColor: '#8B5CF6',
    },
    {
      title: 'AI Content Generator',
      description: 'Generate copy, captions, blog ideas, and review responses in seconds with smart AI inputs.',
      icon: Bot,
      path: '/ai-generator',
      badge: `${stats.campaigns} runs`,
      iconGradient: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
      glowColor: 'rgba(79,70,229,0.25)',
      accentColor: '#6366F1',
    },
    {
      title: 'Campaign Manager',
      description: 'Launch targeted marketing campaigns and monitor high-performing local advertisements.',
      icon: Megaphone,
      path: '/ads-campaigns',
      badge: `${stats.ads} live`,
      iconGradient: 'linear-gradient(135deg, #0891B2 0%, #4F46E5 100%)',
      glowColor: 'rgba(8,145,178,0.2)',
      accentColor: '#06B6D4',
    },
    {
      title: 'Social Scheduler',
      description: 'Coordinate publishing queues across Instagram, Facebook, and Google Business.',
      icon: Calendar,
      path: '/scheduler',
      badge: `${stats.scheduledPosts} queued`,
      iconGradient: 'linear-gradient(135deg, #059669 0%, #0891B2 100%)',
      glowColor: 'rgba(5,150,105,0.2)',
      accentColor: '#10B981',
    },
  ];

  const metricCards = [
    { label: 'AI Campaigns Created',    value: stats.campaigns,               info: 'Saved in MongoDB',          icon: Sparkles,  color: '#8B5CF6', glow: 'rgba(139,92,246,0.2)' },
    { label: 'Active Scheduled Posts',  value: stats.scheduledPosts,          info: 'Queue active',              icon: Calendar,  color: '#10B981', glow: 'rgba(16,185,129,0.2)' },
    { label: 'Reports Downloaded',      value: stats.monthlyReports,          info: 'PDF & Word formats',        icon: FileText,  color: '#F59E0B', glow: 'rgba(245,158,11,0.2)' },
    { label: 'Top Performing Grade',    value: `${stats.topScore || 85}/100`, info: stats.topPerformingCampaign, icon: Award,     color: '#EC4899', glow: 'rgba(236,72,153,0.2)' },
  ];

  return (
    <div className="flex flex-col gap-8 w-full pb-10">
      {/* ── Hero Banner ─────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="relative rounded-[24px] overflow-hidden p-7 md:p-10"
        style={{
          background: 'linear-gradient(135deg, #0D0918 0%, #120B20 40%, #0B0B12 100%)',
          border: '1px solid rgba(124,58,237,0.2)',
          boxShadow: '0 8px 40px -8px rgba(124,58,237,0.15), inset 0 1px 0 rgba(255,255,255,0.04)',
        }}
      >
        {/* Neon glowing orb top right */}
        <div
          className="absolute top-[-20%] right-[-5%] w-80 h-80 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.25) 0%, transparent 70%)', filter: 'blur(60px)' }}
        />
        <div
          className="absolute bottom-[-20%] left-[20%] w-60 h-60 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(168,85,247,0.12) 0%, transparent 70%)', filter: 'blur(50px)' }}
        />

        {/* Dot pattern */}
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(124,58,237,0.9) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />

        {/* Neon top border line */}
        <div
          className="absolute top-0 left-0 right-0 h-[1px]"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, rgba(124,58,237,0.7) 50%, transparent 100%)',
          }}
        />

        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-xl flex flex-col gap-4">
            {/* Eyebrow */}
            <div className="flex items-center gap-2">
              <span
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.12em]"
                style={{
                  background: 'rgba(124,58,237,0.12)',
                  border: '1px solid rgba(124,58,237,0.3)',
                  color: '#A855F7',
                }}
              >
                <Sparkles className="w-3 h-3" /> AI Enterprise Dashboard
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl md:text-5xl font-black text-white leading-[1.05] tracking-tight">
              Data Marketing{' '}
              <span
                style={{
                  background: 'linear-gradient(135deg, #8B5CF6 0%, #A855F7 50%, #C084FC 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Command Center
              </span>
            </h1>
            <p className="text-sm text-textSecondary leading-relaxed font-light max-w-md">
              Coordinate local business profiles, generate high-resolution marketing flyers, schedule publishing queues, and monitor performance analytics.
            </p>
          </div>

          <motion.button
            onClick={() => navigate('/posters')}
            whileHover={{ y: -2, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="self-start md:self-auto flex items-center gap-2 px-6 py-3 rounded-[12px] text-sm font-bold text-white transition-all duration-200"
            style={{
              background: 'linear-gradient(135deg, #7C3AED 0%, #A855F7 100%)',
              boxShadow: '0 4px 24px -4px rgba(124,58,237,0.5)',
            }}
          >
            Create New Poster <Sparkles className="w-4 h-4" />
          </motion.button>
        </div>
      </motion.div>

      {/* ── Metric Cards ─────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {metricCards.map((card, cIdx) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={cIdx}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: cIdx * 0.06 }}
              className="glass-card p-5 flex flex-col justify-between group hover:scale-[1.01] transition-transform duration-300"
            >
              <div className="flex justify-between items-start">
                <div className="flex flex-col gap-2">
                  <span className="text-[10px] font-bold text-textSecondary uppercase tracking-widest leading-none">
                    {card.label}
                  </span>
                  <span className="text-3xl font-black text-white tracking-tight">
                    <StatNumber value={card.value} delay={cIdx * 0.06} />
                  </span>
                </div>
                <div
                  className="p-2.5 rounded-[12px] shrink-0"
                  style={{
                    background: `${card.glow}`,
                    border: `1px solid ${card.color}30`,
                    boxShadow: `0 0 16px ${card.glow}`,
                  }}
                >
                  <Icon className="w-5 h-5" style={{ color: card.color }} />
                </div>
              </div>
              <div className="text-[10px] text-textSecondary mt-4 flex items-center gap-1.5 font-medium">
                <Clock className="w-3 h-3 opacity-40" />
                <span className="truncate max-w-[160px]">{card.info}</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* ── Chart + Activity Feed ──────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Area Chart */}
        <div className="lg:col-span-2 glass-card p-6 flex flex-col gap-5">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-xl font-bold text-white tracking-tight">
                Campaign & Content Performance
              </h3>
              <p className="text-[11px] text-textSecondary mt-0.5">Performance tracking across local location hubs</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full" style={{ background: '#7C3AED', boxShadow: '0 0 6px rgba(124,58,237,0.7)' }} />
                <span className="text-[10px] font-semibold text-textSecondary uppercase tracking-wider">Posts</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full" style={{ background: '#10B981', boxShadow: '0 0 6px rgba(16,185,129,0.7)' }} />
                <span className="text-[10px] font-semibold text-textSecondary uppercase tracking-wider">Score</span>
              </div>
            </div>
          </div>

          <div className="h-64 w-full text-xs select-none">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorPosts" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#7C3AED" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#7C3AED" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#10B981" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="name" stroke="#A1A1AA" tick={{ fontSize: 11, fill: '#A1A1AA' }} />
                <YAxis stroke="#A1A1AA" tick={{ fontSize: 11, fill: '#A1A1AA' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(15,15,23,0.95)',
                    border: '1px solid rgba(124,58,237,0.3)',
                    borderRadius: '12px',
                    color: '#FFFFFF',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: 12,
                    backdropFilter: 'blur(20px)',
                  }}
                  labelStyle={{ color: '#A1A1AA', fontWeight: 600, marginBottom: 4 }}
                />
                <Area type="monotone" dataKey="posts" stroke="#7C3AED" fillOpacity={1} fill="url(#colorPosts)" strokeWidth={2} />
                <Area type="monotone" dataKey="score" stroke="#10B981" fillOpacity={1} fill="url(#colorScore)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Activity Log */}
        <div className="glass-card p-6 flex flex-col gap-5">
          <div>
            <h3 className="text-xl font-bold text-white tracking-tight">
              Live Activity Log
            </h3>
            <p className="text-[11px] text-textSecondary mt-0.5">Real-time status updates</p>
          </div>

          <div className="flex flex-col gap-4 flex-1">
            {recentActivities.map((act, idx) => {
              const Icon = act.icon;
              return (
                <motion.div
                  key={act.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.08 }}
                  className="flex gap-3 items-start pb-4 last:pb-0"
                  style={{ borderBottom: idx < recentActivities.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}
                >
                  <div
                    className="p-2 rounded-[10px] shrink-0"
                    style={{
                      background: act.bg,
                      border: `1px solid ${act.border}`,
                    }}
                  >
                    <Icon className={`w-3.5 h-3.5 ${act.color}`} />
                  </div>
                  <div className="flex flex-col gap-1 min-w-0">
                    <p className="text-xs text-white font-medium leading-relaxed break-words">{act.text}</p>
                    <span className="text-[10px] text-textSecondary flex items-center gap-1 font-medium">
                      <Clock className="w-3 h-3 opacity-40" /> {act.time}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Module Cards Grid ──────────────────────────────── */}
      <div>
        <h2 className="text-[10px] font-bold text-textSecondary/50 uppercase tracking-[0.16em] px-1 mb-5">
          Workspace Modules
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {cards.map((c, idx) => {
            const Icon = c.icon;
            return (
              <motion.div
                key={idx}
                onClick={() => navigate(c.path)}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + idx * 0.07 }}
                whileHover={{ y: -4, scale: 1.01 }}
                className="group cursor-pointer glass-card flex flex-col justify-between relative overflow-hidden"
              >
                {/* Neon corner accent */}
                <div
                  className="absolute top-0 left-0 w-32 h-20 pointer-events-none rounded-tl-[20px]"
                  style={{
                    background: `radial-gradient(circle at 0% 0%, ${c.glowColor} 0%, transparent 70%)`,
                  }}
                />
                {/* Hover border glow */}
                <div
                  className="absolute inset-0 rounded-[20px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  style={{ border: `1px solid ${c.accentColor}40` }}
                />

                <div className="relative p-6 flex flex-col gap-4">
                  <div className="flex justify-between items-start">
                    <div
                      className="p-3 rounded-[12px] shrink-0"
                      style={{
                        background: c.iconGradient,
                        boxShadow: `0 4px 16px ${c.glowColor}`,
                      }}
                    >
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <span
                      className="text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider"
                      style={{
                        background: 'rgba(255,255,255,0.06)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        color: '#A1A1AA',
                      }}
                    >
                      {c.badge}
                    </span>
                  </div>

                  <div className="flex flex-col gap-1.5 mt-1">
                    <h3 className="text-base font-bold text-white group-hover:text-purple-300 transition-colors leading-tight tracking-tight">
                      {c.title}
                    </h3>
                    <p className="text-xs text-textSecondary leading-relaxed line-clamp-3">
                      {c.description}
                    </p>
                  </div>
                </div>

                <div
                  className="px-6 py-3.5 flex items-center justify-between text-xs font-semibold text-textSecondary group-hover:text-white transition-colors rounded-b-[20px]"
                  style={{ borderTop: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.02)' }}
                >
                  <span>Open Module</span>
                  <ArrowRight className="w-4 h-4 translate-x-0 group-hover:translate-x-1.5 transition-transform duration-200" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
