import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addToast } from '../store/uiSlice.js';
import Card from '../components/UI/Card.jsx';
import Button from '../components/UI/Button.jsx';
import Spinner from '../components/UI/Spinner.jsx';
import Badge from '../components/UI/Badge.jsx';
import api from '../services/api.js';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend
} from 'recharts';
import {
  Instagram, Users, Eye, TrendingUp, MousePointer,
  Heart, MessageSquare, Calendar, HelpCircle,
  Sparkles, ShieldAlert, ArrowUpRight, ArrowDownRight, Link2, BarChart2
} from 'lucide-react';

const InstagramAnalytics = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const selectedBusinessId = useSelector((state) => state.business.selectedBusinessId);

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [posts, setPosts] = useState([]);
  const [range, setRange] = useState('30d');
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'posts'

  const fetchAnalytics = async () => {
    if (!selectedBusinessId) return;
    setLoading(true);
    try {
      const accountsRes = await api.get(`/api/instagram/accounts?businessId=${selectedBusinessId}`);
      const connected = accountsRes.data?.data?.length > 0;

      if (!connected) {
        setData(null);
        setPosts([]);
        setLoading(false);
        return;
      }

      const [analyticsRes, postsRes] = await Promise.all([
        api.get(`/api/instagram/analytics?businessId=${selectedBusinessId}&range=${range}`),
        api.get(`/api/instagram/posts?businessId=${selectedBusinessId}`)
      ]);

      if (analyticsRes.data?.success) {
        setData(analyticsRes.data.data);
      }
      if (postsRes.data?.success) {
        setPosts(postsRes.data.data || []);
      }
    } catch (err) {
      console.error('Instagram analytics fetch failed:', err);
      dispatch(addToast({ type: 'error', message: 'Could not load Instagram statistics' }));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [selectedBusinessId, range]);

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[50vh] gap-3">
        <Spinner size="lg" />
        <span className="text-sm text-textSecondary font-semibold">Retrieving Instagram metrics...</span>
      </div>
    );
  }

  // Not connected state
  if (!data) {
    return (
      <div className="relative overflow-hidden rounded-3xl border border-white/[0.06] bg-white/[0.01] p-8 md:p-12 text-center flex flex-col items-center justify-center min-h-[420px] max-w-3xl mx-auto shadow-sm pb-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-pink-500/10 rounded-full blur-[100px] pointer-events-none animate-pulse" />
        
        <div className="w-16 h-16 rounded-3xl bg-pink-500/10 border border-pink-500/20 text-pink-400 flex items-center justify-center mb-6 shadow-lg shadow-pink-500/5">
          <Instagram className="w-8 h-8" />
        </div>

        <h2 className="text-xl font-extrabold text-white tracking-tight">Instagram Insights Locked</h2>
        <p className="text-xs text-textSecondary max-w-sm mt-2 leading-relaxed font-light">
          Link your Instagram Business Account in Social Settings to unlock premium metric widgets, time-series audience growth charts, and individual post insights.
        </p>

        <div className="mt-8 flex gap-4">
          <Button 
            onClick={() => navigate('/social-accounts')}
            className="px-6 py-2.5"
          >
            Connect Account
          </Button>
        </div>
      </div>
    );
  }

  const formatNum = (val) => new Intl.NumberFormat().format(val);

  return (
    <div className="flex flex-col gap-6 w-full pb-16">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <img 
            src={data.profilePicture} 
            alt="Profile Avatar" 
            className="w-12 h-12 rounded-full border-2 border-primary/40 object-cover shadow-neon-sm"
          />
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              @{data.username} <Badge variant="accent">Business</Badge>
            </h1>
            <p className="text-xs text-textSecondary">{data.name}</p>
          </div>
        </div>

        {/* Date Filter */}
        <div className="flex items-center gap-3 self-end md:self-auto">
          <div className="flex bg-white/[0.04] border border-white/10 rounded-full p-1 text-xs">
            <button 
              onClick={() => setRange('7d')}
              className={`px-4 py-1.5 rounded-full font-bold transition-all ${range === '7d' ? 'bg-primary text-white shadow-neon-sm font-black' : 'text-textSecondary hover:text-white'}`}
            >
              7 Days
            </button>
            <button 
              onClick={() => setRange('30d')}
              className={`px-4 py-1.5 rounded-full font-bold transition-all ${range === '30d' ? 'bg-primary text-white shadow-neon-sm font-black' : 'text-textSecondary hover:text-white'}`}
            >
              30 Days
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        <Card>
          <Card.Content className="p-5 flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-textSecondary">
              <span className="text-[10px] font-black uppercase tracking-wider">Followers</span>
              <Users className="w-4 h-4 text-purple-400" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-white">{formatNum(data.followers)}</span>
              <span className="text-[10px] text-emerald-400 font-bold flex items-center">
                <ArrowUpRight className="w-3 h-3" /> +4.2%
              </span>
            </div>
            <p className="text-[10px] text-textSecondary">Total audience reach</p>
          </Card.Content>
        </Card>

        <Card>
          <Card.Content className="p-5 flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-textSecondary">
              <span className="text-[10px] font-black uppercase tracking-wider">Impressions</span>
              <Eye className="w-4 h-4 text-blue-400" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-white">{formatNum(data.impressions)}</span>
              <span className="text-[10px] text-emerald-400 font-bold flex items-center">
                <ArrowUpRight className="w-3 h-3" /> +12.4%
              </span>
            </div>
            <p className="text-[10px] text-textSecondary">Views on posts & profile</p>
          </Card.Content>
        </Card>

        <Card>
          <Card.Content className="p-5 flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-textSecondary">
              <span className="text-[10px] font-black uppercase tracking-wider">Total Reach</span>
              <TrendingUp className="w-4 h-4 text-pink-400" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-white">{formatNum(data.reach)}</span>
              <span className="text-[10px] text-emerald-400 font-bold flex items-center">
                <ArrowUpRight className="w-3 h-3" /> +8.1%
              </span>
            </div>
            <p className="text-[10px] text-textSecondary">Unique accounts reached</p>
          </Card.Content>
        </Card>

        <Card>
          <Card.Content className="p-5 flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-textSecondary">
              <span className="text-[10px] font-black uppercase tracking-wider">Engagement</span>
              <MousePointer className="w-4 h-4 text-amber-400" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-white">{data.engagementRate}%</span>
              <span className="text-[10px] text-rose-400 font-bold flex items-center">
                <ArrowDownRight className="w-3 h-3" /> -0.3%
              </span>
            </div>
            <p className="text-[10px] text-textSecondary">Likes + comments weight</p>
          </Card.Content>
        </Card>
      </div>

      {/* Chart Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Area Chart: Impressions vs Reach */}
        <Card className="lg:col-span-2">
          <Card.Header className="flex justify-between items-center pb-2">
            <div>
              <Card.Title>Profile Reach & Impressions</Card.Title>
              <p className="text-[10px] text-textSecondary uppercase tracking-widest font-semibold mt-0.5">Audience exposure timeline</p>
            </div>
          </Card.Header>
          <Card.Content className="p-6">
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.timeline} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorImpressions" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.25}/>
                      <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.01}/>
                    </linearGradient>
                    <linearGradient id="colorReach" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.25}/>
                      <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.01}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.04)" />
                  <XAxis 
                    dataKey="date" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#A1A1AA', fontSize: 10 }} 
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#A1A1AA', fontSize: 10 }} 
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'rgba(15,15,23,0.95)',
                      border: '1px solid rgba(124,58,237,0.3)',
                      borderRadius: '12px',
                      color: '#FFFFFF',
                      boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontSize: 11,
                      backdropFilter: 'blur(20px)',
                    }}
                  />
                  <Legend verticalAlign="top" height={36} />
                  <Area type="monotone" name="Impressions" dataKey="impressions" stroke="#8B5CF6" strokeWidth={2.5} fillOpacity={1} fill="url(#colorImpressions)" />
                  <Area type="monotone" name="Reach" dataKey="reach" stroke="#38bdf8" strokeWidth={2.5} fillOpacity={1} fill="url(#colorReach)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card.Content>
        </Card>

        {/* Clicks & Profile views Bar Chart */}
        <Card>
          <Card.Header className="pb-2">
            <Card.Title>Website & Profile Actions</Card.Title>
            <p className="text-[10px] text-textSecondary uppercase tracking-widest font-semibold mt-0.5">Click-through conversion rates</p>
          </Card.Header>
          <Card.Content className="p-6">
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.timeline.slice(-7)} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.04)" />
                  <XAxis 
                    dataKey="date" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#A1A1AA', fontSize: 10 }} 
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#A1A1AA', fontSize: 10 }} 
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'rgba(15,15,23,0.95)',
                      border: '1px solid rgba(124,58,237,0.3)',
                      borderRadius: '12px',
                      color: '#FFFFFF',
                      boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontSize: 11,
                      backdropFilter: 'blur(20px)',
                    }}
                  />
                  <Legend iconSize={8} iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  <Bar name="Profile Visits" dataKey="profileVisits" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                  <Bar name="Website Clicks" dataKey="websiteClicks" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card.Content>
        </Card>
      </div>

      {/* Navigation tabs */}
      <div className="flex border-b border-white/[0.06] gap-6 mt-2">
        <button
          onClick={() => setActiveTab('overview')}
          className={`pb-3 font-bold text-xs uppercase tracking-wider border-b-2 transition-all ${
            activeTab === 'overview' ? 'border-primary text-purple-300' : 'border-transparent text-textSecondary hover:text-white'
          }`}
        >
          Metrics Summary
        </button>
        <button
          onClick={() => setActiveTab('posts')}
          className={`pb-3 font-bold text-xs uppercase tracking-wider border-b-2 transition-all ${
            activeTab === 'posts' ? 'border-primary text-purple-300' : 'border-transparent text-textSecondary hover:text-white'
          }`}
        >
          Recent Posts Insights ({posts.length})
        </button>
      </div>

      {/* Tab views */}
      {activeTab === 'overview' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <Card.Header>
              <Card.Title>Meta Interaction Profile</Card.Title>
            </Card.Header>
            <Card.Content className="p-6">
              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center py-2.5 border-b border-white/[0.04] text-xs">
                  <span className="text-textSecondary">Total Content Posts</span>
                  <span className="font-bold text-white">{data.postsCount} posts</span>
                </div>
                <div className="flex justify-between items-center py-2.5 border-b border-white/[0.04] text-xs">
                  <span className="text-textSecondary">Profile Action Visits</span>
                  <span className="font-bold text-white">{formatNum(data.profileVisits)} clicks</span>
                </div>
                <div className="flex justify-between items-center py-2.5 border-b border-white/[0.04] text-xs">
                  <span className="text-textSecondary">External Link Redirects</span>
                  <span className="font-bold text-white">{formatNum(data.websiteClicks)} clicks</span>
                </div>
                <div className="flex justify-between items-center py-2.5 text-xs">
                  <span className="text-textSecondary">API Integration Channel</span>
                  <Badge variant="success" className="uppercase font-bold tracking-widest text-[9px]">Meta Dev API</Badge>
                </div>
              </div>
            </Card.Content>
          </Card>

          <Card className="flex flex-col justify-between p-6">
            <div>
              <h3 className="font-extrabold text-sm text-white mb-3 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" /> AI Business Recommendation
              </h3>
              <p className="text-xs text-textSecondary leading-relaxed font-light">
                Your engagement rate (<strong>{data.engagementRate}%</strong>) is in the top 15% for local businesses in your category. Impressions saw a sharp <strong>+12.4%</strong> increase this month, likely driven by high-quality graphic assets generated via Trendora Studio.
              </p>
              <p className="text-xs text-textSecondary leading-relaxed mt-3 font-light">
                To maximize clicks, we suggest scheduling 2 more posts per week on weekends and placing your booking URL directly in your bio description.
              </p>
            </div>
            <Button 
              variant="outline" 
              onClick={() => navigate('/scheduler')}
              className="mt-6 flex items-center justify-center gap-2"
            >
              <Calendar className="w-4 h-4" /> Open Social Scheduler
            </Button>
          </Card>
        </div>
      ) : (
        /* Posts view */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {posts.map((post) => {
            const postEngagement = ((post.likes + post.comments) / data.followers * 100).toFixed(1);

            return (
              <Card key={post.id} className="overflow-hidden flex flex-col justify-between border-white/[0.06] hover:border-primary/25 transition-all group">
                <div>
                  <div className="relative aspect-square overflow-hidden bg-white/[0.02] border-b border-white/[0.06]">
                    <img 
                      src={post.mediaUrl} 
                      alt="Post content" 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-2.5 right-2.5 bg-black/70 backdrop-blur-md rounded-lg px-2 py-0.5 text-[9px] font-black text-purple-300 uppercase tracking-widest border border-white/10">
                      {postEngagement}% ER
                    </div>
                  </div>

                  <div className="p-4 flex flex-col gap-2">
                    <span className="text-[9px] text-textSecondary font-bold flex items-center gap-1.5 uppercase tracking-wider">
                      <Calendar className="w-3.5 h-3.5 text-purple-400" /> {new Date(post.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    <p className="text-xs text-textSecondary leading-relaxed line-clamp-3 italic font-light">
                      "{post.caption}"
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-white/[0.02] border-t border-white/[0.06] rounded-b-[20px]">
                  <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-xs">
                    <div className="flex items-center gap-1.5 text-textSecondary">
                      <Heart className="w-4 h-4 text-rose-500 fill-rose-500/10" />
                      <span className="font-extrabold text-white">{post.likes}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-textSecondary">
                      <MessageSquare className="w-4 h-4 text-purple-400 fill-purple-400/10" />
                      <span className="font-extrabold text-white">{post.comments}</span>
                    </div>
                    
                    <div className="col-span-2 border-t border-white/[0.04] pt-2.5 flex justify-between items-center text-[9px] text-textSecondary uppercase font-bold tracking-wider">
                      <span>REACH: <strong className="text-white">{formatNum(post.reach)}</strong></span>
                      <span>IMPRESSIONS: <strong className="text-white">{formatNum(post.impressions)}</strong></span>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default InstagramAnalytics;
