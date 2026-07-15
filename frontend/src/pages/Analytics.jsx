import React from 'react';
import Card from '../components/UI/Card.jsx';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as ChartTooltip, ResponsiveContainer, Legend } from 'recharts';
import { Users, MousePointerClick, CheckCircle, TrendingUp, BarChart2 } from 'lucide-react';

const analyticsData = [
  { month: 'Jan', views: 4000, clicks: 2400, leads: 400, conversions: 240 },
  { month: 'Feb', views: 3000, clicks: 1398, leads: 300, conversions: 139 },
  { month: 'Mar', views: 2000, clicks: 9800, leads: 1200, conversions: 980 },
  { month: 'Apr', views: 2780, clicks: 3908, leads: 600, conversions: 390 },
  { month: 'May', views: 1890, clicks: 4800, leads: 800, conversions: 480 },
  { month: 'Jun', views: 2390, clicks: 3800, leads: 500, conversions: 380 },
  { month: 'Jul', views: 3490, clicks: 4300, leads: 700, conversions: 430 }
];

export const Analytics = () => {
  return (
    <div className="flex flex-col gap-6 w-full pb-10">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest">
          <BarChart2 className="w-4 h-4 text-purple-400" /> Executive Analytics
        </div>
        <h1 className="text-3xl font-black text-white tracking-tight">Analytics Insights</h1>
        <p className="text-xs text-textSecondary">Monitor view-through-rates, click metrics, and conversion funnels.</p>
      </div>

      {/* Overview stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <Card.Content className="flex items-center justify-between p-5">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] text-textSecondary font-bold uppercase tracking-wider">Total Views</span>
              <span className="text-2xl font-black text-white">19,530</span>
            </div>
            <div className="p-2.5 bg-purple-500/10 border border-purple-500/20 rounded-xl text-purple-400 shadow-[0_0_12px_rgba(168,85,247,0.15)]">
              <Users className="w-5 h-5" />
            </div>
          </Card.Content>
        </Card>

        <Card>
          <Card.Content className="flex items-center justify-between p-5">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] text-textSecondary font-bold uppercase tracking-wider">Total Clicks</span>
              <span className="text-2xl font-black text-white">31,406</span>
            </div>
            <div className="p-2.5 bg-blue-500/10 border border-blue-500/20 rounded-xl text-blue-400 shadow-[0_0_12px_rgba(59,130,246,0.15)]">
              <MousePointerClick className="w-5 h-5" />
            </div>
          </Card.Content>
        </Card>

        <Card>
          <Card.Content className="flex items-center justify-between p-5">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] text-textSecondary font-bold uppercase tracking-wider">Customer Leads</span>
              <span className="text-2xl font-black text-white">4,500</span>
            </div>
            <div className="p-2.5 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.15)]">
              <TrendingUp className="w-5 h-5" />
            </div>
          </Card.Content>
        </Card>

        <Card>
          <Card.Content className="flex items-center justify-between p-5">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] text-textSecondary font-bold uppercase tracking-wider">Conversions</span>
              <span className="text-2xl font-black text-white">3,039</span>
            </div>
            <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.15)]">
              <CheckCircle className="w-5 h-5" />
            </div>
          </Card.Content>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <Card.Header>
            <Card.Title>View to Click Comparison</Card.Title>
          </Card.Header>
          <Card.Content>
            <div className="h-80 w-full text-xs">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={analyticsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="viewsGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="clicksGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.04)" />
                  <XAxis dataKey="month" stroke="#A1A1AA" tick={{ fill: '#A1A1AA' }} />
                  <YAxis stroke="#A1A1AA" tick={{ fill: '#A1A1AA' }} />
                  <ChartTooltip
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
                  />
                  <Legend verticalAlign="top" height={36} />
                  <Area type="monotone" name="Views" dataKey="views" stroke="#3B82F6" fill="url(#viewsGrad)" fillOpacity={1} strokeWidth={2} />
                  <Area type="monotone" name="Clicks" dataKey="clicks" stroke="#8B5CF6" fill="url(#clicksGrad)" fillOpacity={1} strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card.Content>
        </Card>

        <Card>
          <Card.Header>
            <Card.Title>Conversion Funnel Progression</Card.Title>
          </Card.Header>
          <Card.Content>
            <div className="h-80 w-full text-xs">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analyticsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.04)" />
                  <XAxis dataKey="month" stroke="#A1A1AA" tick={{ fill: '#A1A1AA' }} />
                  <YAxis stroke="#A1A1AA" tick={{ fill: '#A1A1AA' }} />
                  <ChartTooltip
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
                  />
                  <Legend verticalAlign="top" height={36} />
                  <Bar dataKey="leads" name="Leads" fill="#F59E0B" radius={[4, 4, 0, 0]} maxBarSize={40} />
                  <Bar dataKey="conversions" name="Conversions" fill="#10B981" radius={[4, 4, 0, 0]} maxBarSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card.Content>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;
