import React, { useEffect, useState } from 'react';
import Card from '../components/UI/Card.jsx';
import Badge from '../components/UI/Badge.jsx';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToast } from '../store/uiSlice.js';
import { 
  Building, Megaphone, Palette, Target, BarChart3, Users, Star, Settings, 
  ArrowRight, Sparkles, TrendingUp, ShieldAlert 
} from 'lucide-react';
import api from '../services/api.js';

export const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [stats, setStats] = useState({
    businesses: 0,
    ads: 0,
    campaigns: 0,
    leads: 0,
    posters: 0,
    reviews: 0
  });

  // Fetch counts from backend (or fallback to local counts)
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/api/dashboard/stats');
        setStats(response.data.data);
      } catch (err) {
        // Fallback to local storage sizes
        const getCount = (key, def) => {
          const item = localStorage.getItem(key);
          return item ? JSON.parse(item).length : def;
        };
        setStats({
          businesses: getCount('demo_businesses', 2),
          ads: getCount('demo_ads', 2),
          campaigns: getCount('demo_campaigns', 2),
          leads: getCount('demo_leads', 2),
          posters: getCount('demo_posters', 1),
          reviews: getCount('demo_reviews', 2)
        });
      }
    };
    fetchStats();
  }, []);

  const cards = [
    {
      title: 'Business Management',
      description: 'Add, edit, and coordinate local business profiles and physical details.',
      icon: Building,
      path: '/businesses',
      badge: `${stats.businesses} active`,
      color: 'from-blue-500/10 to-indigo-500/10 text-blue-600 border-blue-100',
    },
    {
      title: 'Ads Management',
      description: 'Launch targeted marketing campaigns and create high-performing local advertisements.',
      icon: Megaphone,
      path: '/ads',
      badge: `${stats.ads} live`,
      color: 'from-purple-500/10 to-indigo-500/10 text-purple-600 border-purple-100',
    },
    {
      title: 'Poster Design',
      description: 'Upload, organize, and compile flyers, billboards, and marketing graphics.',
      icon: Palette,
      path: '/posters',
      badge: `${stats.posters} files`,
      color: 'from-pink-500/10 to-rose-500/10 text-pink-600 border-pink-100',
    },
    {
      title: 'Campaign Tracking',
      description: 'Coordinate multi-channel campaigns across email, SMS, and search engines.',
      icon: Target,
      path: '/campaigns',
      badge: `${stats.campaigns} campaigns`,
      color: 'from-amber-500/10 to-orange-500/10 text-amber-600 border-amber-100',
    },
    {
      title: 'Analytics & Insights',
      description: 'Monitor click funnels, CTR progression, and user conversion charts.',
      icon: BarChart3,
      path: '/analytics',
      badge: 'Real-time',
      color: 'from-emerald-500/10 to-teal-500/10 text-emerald-600 border-emerald-100',
    },
    {
      title: 'Customer Leads',
      description: 'Acquire, review, and follow up with hot prospects captured from campaigns.',
      icon: Users,
      path: '/leads',
      badge: `${stats.leads} new`,
      color: 'from-cyan-500/10 to-blue-500/10 text-cyan-600 border-cyan-100',
    },
    {
      title: 'Reviews & Ratings',
      description: 'Assess customer feedback, star progression, and ratings listings.',
      icon: Star,
      path: '/reviews',
      badge: `${stats.reviews} reviews`,
      color: 'from-yellow-500/10 to-amber-500/10 text-yellow-600 border-yellow-100',
    },
    {
      title: 'System Settings',
      description: 'Toggle light and dark configurations, and modify system preferences.',
      icon: Settings,
      path: '/settings',
      badge: 'Configure',
      color: 'from-slate-500/10 to-zinc-500/10 text-slate-600 border-slate-100',
    },
  ];

  return (
    <div className="flex flex-col gap-6 w-full pb-8">
      {/* Welcome Banner */}
      <div className="relative rounded-2xl border border-primary/10 bg-gradient-to-r from-primary/5 to-accent/5 p-6 md:p-8 overflow-hidden">
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-96 h-96 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="relative z-10 max-w-xl flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="bg-primary/10 text-primary font-bold text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full border border-primary/20">
              Phase 3 Live
            </span>
            <span className="flex items-center gap-1 text-[10px] text-textSecondary">
              <Sparkles className="w-3.5 h-3.5 text-primary" /> Multi-Module Management
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-textPrimary mt-1">
            Data Marketing Command Center
          </h1>
          <p className="text-xs text-textSecondary leading-relaxed mt-1">
            Seamlessly build local business profiles, track live advertisements, generate poster assets, monitor campaigns, and capture direct customer leads.
          </p>
        </div>
      </div>

      {/* Landing Grids */}
      <div>
        <h2 className="text-xs font-bold text-textSecondary uppercase tracking-wider px-1 mb-4">
          Marketing Operations Modules
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((c, idx) => {
            const Icon = c.icon;
            return (
              <Card
                key={idx}
                onClick={() => navigate(c.path)}
                className="group cursor-pointer flex flex-col justify-between hover:shadow-premium hover:-translate-y-1 border-border/80 hover:border-primary/20 transition-all duration-300 relative overflow-hidden"
              >
                {/* Visual Glassmorphism overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-primary/0 group-hover:from-primary/[0.01] group-hover:to-primary/[0.02] transition-all pointer-events-none" />

                <Card.Content className="py-5 flex flex-col gap-4">
                  <div className="flex justify-between items-start">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${c.color} border shrink-0`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] bg-slate-100 text-slate-800 font-bold px-2 py-0.5 rounded-full border border-slate-200 uppercase tracking-wider">
                      {c.badge}
                    </span>
                  </div>

                  <div className="flex flex-col gap-1.5 mt-2">
                    <h3 className="text-sm font-bold text-textPrimary leading-tight group-hover:text-primary transition-colors">
                      {c.title}
                    </h3>
                    <p className="text-xs text-textSecondary leading-relaxed line-clamp-3">
                      {c.description}
                    </p>
                  </div>
                </Card.Content>

                {/* Footer anchor */}
                <div className="px-5 py-3 border-t border-border/80 flex items-center justify-between text-xs font-semibold text-textSecondary group-hover:text-primary transition-colors bg-sectionBackground/30">
                  <span>Open Module</span>
                  <ArrowRight className="w-4 h-4 translate-x-0 group-hover:translate-x-1 transition-transform" />
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
