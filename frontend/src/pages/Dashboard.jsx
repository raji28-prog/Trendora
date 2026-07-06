import React from 'react';
import Card from '../components/UI/Card.jsx';
import Badge from '../components/UI/Badge.jsx';
import Button from '../components/UI/Button.jsx';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as ChartTooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Users, Target, ArrowUpRight, Plus } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { addToast } from '../store/uiSlice.js';

const chartData = [
  { name: 'Jan', clicks: 400, conversions: 240 },
  { name: 'Feb', clicks: 300, conversions: 139 },
  { name: 'Mar', clicks: 200, conversions: 980 },
  { name: 'Apr', clicks: 278, conversions: 390 },
  { name: 'May', clicks: 189, conversions: 480 },
  { name: 'Jun', clicks: 239, conversions: 380 },
  { name: 'Jul', clicks: 349, conversions: 430 },
];

export const Dashboard = () => {
  const dispatch = useDispatch();

  const metrics = [
    { label: 'Total Reach', value: '14,284', change: '+12.5%', type: 'success', icon: Users },
    { label: 'Active Campaigns', value: '8', change: '+2 new', type: 'primary', icon: Target },
    { label: 'Avg. CTR', value: '3.42%', change: '+0.8%', type: 'success', icon: TrendingUp },
  ];

  const recentCampaigns = [
    { name: 'Summer Local Promo', status: 'Active', spent: '$240.00', leads: 42, ctr: '4.2%' },
    { name: 'Google Map Booster', status: 'Paused', spent: '$150.00', leads: 18, ctr: '2.8%' },
    { name: 'Facebook Lead Gen', status: 'Draft', spent: '$0.00', leads: 0, ctr: '0.0%' },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-textPrimary">Overview</h1>
          <p className="text-xs text-textSecondary">Welcome to your marketing control center.</p>
        </div>
        <Button
          variant="primary"
          icon={Plus}
          onClick={() => dispatch(addToast({ type: 'info', message: 'Creating campaigns is coming in the next phase!' }))}
        >
          Create Campaign
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {metrics.map((m, idx) => {
          const Icon = m.icon;
          return (
            <Card key={idx}>
              <Card.Content className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-textSecondary font-semibold uppercase tracking-wider">{m.label}</span>
                  <span className="text-2xl font-bold text-textPrimary">{m.value}</span>
                  <div className="flex items-center gap-1.5 mt-1">
                    <Badge variant={m.type === 'success' ? 'success' : 'primary'}>{m.change}</Badge>
                    <span className="text-[10px] text-textSecondary">vs last month</span>
                  </div>
                </div>
                <div className="p-3 bg-background border border-border rounded-lg text-textSecondary">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
              </Card.Content>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <Card.Header>
            <div>
              <Card.Title>Performance Insights</Card.Title>
              <Card.Description>Clicks vs Conversions trend over time</Card.Description>
            </div>
          </Card.Header>
          <Card.Content>
            <div className="h-72 w-full text-xs">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#4F46E5" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorConversions" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#06B6D4" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="name" stroke="var(--text-secondary)" />
                  <YAxis stroke="var(--text-secondary)" />
                  <ChartTooltip contentStyle={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
                  <Area type="monotone" dataKey="clicks" stroke="#4F46E5" fillOpacity={1} fill="url(#colorClicks)" strokeWidth={2} />
                  <Area type="monotone" dataKey="conversions" stroke="#06B6D4" fillOpacity={1} fill="url(#colorConversions)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card.Content>
        </Card>

        <Card>
          <Card.Header>
            <div>
              <Card.Title>Recent Campaigns</Card.Title>
              <Card.Description>Latest marketing initiatives</Card.Description>
            </div>
            <ArrowUpRight className="w-4 h-4 text-textSecondary" />
          </Card.Header>
          <Card.Content className="flex flex-col gap-4">
            {recentCampaigns.map((c, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-background/50 border border-border rounded-lg">
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs font-semibold text-textPrimary">{c.name}</span>
                  <span className="text-[10px] text-textSecondary">Spent: {c.spent} &bull; CTR: {c.ctr}</span>
                </div>
                <Badge variant={c.status === 'Active' ? 'success' : c.status === 'Paused' ? 'warning' : 'neutral'}>
                  {c.status}
                </Badge>
              </div>
            ))}
          </Card.Content>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
