import React from 'react';
import Card from '../components/UI/Card.jsx';
import { AreaChart, Area, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as ChartTooltip, ResponsiveContainer, Legend } from 'recharts';
import { Users, MousePointerClick, CheckCircle, TrendingUp } from 'lucide-react';

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
    <div className="flex flex-col gap-6 w-full">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-textPrimary">Analytics Insights</h1>
        <p className="text-xs text-textSecondary">Monitor view-through-rates, click metrics, and conversion funnels.</p>
      </div>

      {/* Overview stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <Card.Content className="flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] text-textSecondary font-bold uppercase tracking-wider">Total Views</span>
              <span className="text-2xl font-bold text-textPrimary">19,530</span>
            </div>
            <div className="p-2.5 bg-blue-50 rounded-xl text-blue-600">
              <Users className="w-5 h-5" />
            </div>
          </Card.Content>
        </Card>
        <Card>
          <Card.Content className="flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] text-textSecondary font-bold uppercase tracking-wider">Total Clicks</span>
              <span className="text-2xl font-bold text-textPrimary">31,406</span>
            </div>
            <div className="p-2.5 bg-purple-50 rounded-xl text-purple-600">
              <MousePointerClick className="w-5 h-5" />
            </div>
          </Card.Content>
        </Card>
        <Card>
          <Card.Content className="flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] text-textSecondary font-bold uppercase tracking-wider">Customer Leads</span>
              <span className="text-2xl font-bold text-textPrimary">4,500</span>
            </div>
            <div className="p-2.5 bg-amber-50 rounded-xl text-amber-600">
              <TrendingUp className="w-5 h-5" />
            </div>
          </Card.Content>
        </Card>
        <Card>
          <Card.Content className="flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] text-textSecondary font-bold uppercase tracking-wider">Conversions</span>
              <span className="text-2xl font-bold text-textPrimary">3,039</span>
            </div>
            <div className="p-2.5 bg-emerald-50 rounded-xl text-emerald-600">
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
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="month" stroke="var(--text-secondary)" />
                  <YAxis stroke="var(--text-secondary)" />
                  <ChartTooltip />
                  <Legend />
                  <Area type="monotone" dataKey="views" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.1} strokeWidth={2} />
                  <Area type="monotone" dataKey="clicks" stroke="#6D5EF8" fill="#6D5EF8" fillOpacity={0.1} strokeWidth={2} />
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
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="month" stroke="var(--text-secondary)" />
                  <YAxis stroke="var(--text-secondary)" />
                  <ChartTooltip />
                  <Legend />
                  <Bar dataKey="leads" fill="#F59E0B" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="conversions" fill="#10B981" radius={[4, 4, 0, 0]} />
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
