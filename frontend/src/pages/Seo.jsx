import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelectedBusiness } from '../store/useSelectedBusiness.js';
import Card from '../components/UI/Card.jsx';
import Badge from '../components/UI/Badge.jsx';
import Button from '../components/UI/Button.jsx';
import Table from '../components/UI/Table.jsx';
import { 
  TrendingUp, TrendingDown, Minus, Search, 
  CheckCircle2, AlertCircle, ArrowUpRight, SearchCheck 
} from 'lucide-react';

const KEYWORDS = [
  { keyword: 'local bakery coimbatore', position: 3, volume: 1200, trend: 'up', score: 82 },
  { keyword: 'best cake shop near me', position: 7, volume: 4500, trend: 'up', score: 74 },
  { keyword: 'artisan bread delivery', position: 12, volume: 900, trend: 'down', score: 58 },
  { keyword: 'wedding cake custom order', position: 5, volume: 2100, trend: 'stable', score: 79 },
  { keyword: 'freshly baked pastries', position: 18, volume: 650, trend: 'up', score: 45 },
];

const SEO_CHECKS = [
  { label: 'Google My Business verified', done: true },
  { label: 'Website has SSL certificate', done: true },
  { label: 'Mobile-friendly website', done: true },
  { label: 'Meta descriptions added', done: false },
  { label: 'Schema markup implemented', done: false },
  { label: 'Consistent NAP citations', done: true },
  { label: 'Local keywords in page titles', done: false },
  { label: 'Image alt texts added', done: true },
];

function ScoreMeter({ score }) {
  const isHigh = score >= 80;
  const isMid = score >= 60 && score < 80;
  const color = isHigh ? '#10B981' : isMid ? '#F59E0B' : '#EF4444';
  const label = isHigh ? 'Excellent' : isMid ? 'Good' : 'Needs Work';
  const circumference = 2 * Math.PI * 54;
  const dashOffset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center p-2">
      <div className="relative w-36 h-36 flex items-center justify-center">
        {/* Glow effect */}
        <div className="absolute inset-0 bg-purple-500/5 rounded-full blur-xl pointer-events-none" />
        <svg width="140" height="140" viewBox="0 0 120 120" className="transform -rotate-90">
          <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(255, 255, 255, 0.03)" strokeWidth="8" />
          <circle 
            cx="60" 
            cy="60" 
            r="54" 
            fill="none" 
            stroke={color} 
            strokeWidth="8" 
            strokeDasharray={circumference} 
            strokeDashoffset={dashOffset} 
            strokeLinecap="round" 
            className="transition-all duration-1000 ease-out"
            style={{ filter: `drop-shadow(0 0 6px ${color}33)` }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-3xl font-black text-white tracking-tight">{score}</span>
          <span className="text-[10px] text-textSecondary font-medium">/ 100</span>
        </div>
      </div>
      <span className="text-xs font-black uppercase tracking-wider mt-4" style={{ color }}>
        {label}
      </span>
    </div>
  );
}

export default function Seo() {
  const navigate = useNavigate();
  const { selectedBusinessId, selectedBusiness, businesses } = useSelectedBusiness();
  const [activeKw, setActiveKw] = useState(null);
  
  if (!selectedBusinessId) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4">
        <div className="mb-8">
          <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest">
            <SearchCheck className="w-4 h-4 text-purple-400" /> Search Optimization
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight mt-1">SEO Dashboard</h1>
          <p className="text-xs text-textSecondary">Track your search rankings, keyword performance, and optimization score</p>
        </div>

        <Card className="p-12 text-center flex flex-col items-center justify-center min-h-[340px]">
          <div className="w-16 h-16 rounded-3xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center mb-6 shadow-lg shadow-purple-500/5">
            <Search className="w-8 h-8" />
          </div>
          {businesses.length === 0 ? (
            <>
              <h3 className="text-lg font-bold text-white">No Businesses Found</h3>
              <p className="text-xs text-textSecondary max-w-sm mt-2 leading-relaxed font-light">
                Create your first business to track search rankings & SEO performance.
              </p>
              <Button
                onClick={() => navigate('/businesses')}
                className="mt-6"
              >
                + Add Business
              </Button>
            </>
          ) : (
            <>
              <h3 className="text-lg font-bold text-white">No Business Selected</h3>
              <p className="text-xs text-textSecondary max-w-sm mt-2 leading-relaxed font-light">
                Use the business selector in the header to choose which business to view SEO metrics for.
              </p>
            </>
          )}
        </Card>
      </div>
    );
  }

  const businessName = selectedBusiness?.name || 'Local Business';
  const customKeywords = KEYWORDS.map(k => {
    if (k.keyword.includes('bakery')) {
      const categoryWord = selectedBusiness?.category?.toLowerCase() || 'business';
      return {
        ...k,
        keyword: k.keyword.replace('bakery', categoryWord).replace('cake shop', `${categoryWord} profile`)
      };
    }
    return k;
  });

  const seoScore = 68;
  const done = SEO_CHECKS.filter(c => c.done).length;

  return (
    <div className="flex flex-col gap-6 w-full pb-16">
      <div>
        <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest">
          <SearchCheck className="w-4 h-4 text-purple-400" /> Search Optimization
        </div>
        <h1 className="text-3xl font-black text-white tracking-tight mt-1">SEO Dashboard</h1>
        <p className="text-xs text-textSecondary">
          Tracking search rankings and keyword performance for <strong className="text-white font-semibold">{businessName}</strong>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* SEO Score */}
        <Card className="flex flex-col justify-center items-center p-6 text-center border-white/[0.06]">
          <h3 className="text-xs font-black uppercase tracking-wider text-textSecondary mb-4">Overall SEO Score</h3>
          <ScoreMeter score={seoScore} />
          <div className="mt-5 flex justify-center gap-4 text-[11px] text-textSecondary font-medium border-t border-white/[0.04] pt-4 w-full">
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-400" /> {done} passed</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-400" /> {SEO_CHECKS.length - done} pending</span>
          </div>
        </Card>

        {/* Quick Stats Grid */}
        <div className="md:col-span-2 grid grid-cols-2 gap-4">
          {[
            { label: 'Keywords Tracked', value: customKeywords.length, icon: Search, color: 'text-purple-400', bg: 'bg-purple-500/10' },
            { label: 'Avg. Position', value: (customKeywords.reduce((a, b) => a + b.position, 0) / customKeywords.length).toFixed(1), icon: TrendingUp, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
            { label: 'Top Keyword Volume', value: '4,500', icon: ArrowUpRight, color: 'text-blue-400', bg: 'bg-blue-500/10' },
            { label: 'Improvements Needed', value: SEO_CHECKS.length - done, icon: AlertCircle, color: 'text-amber-400', bg: 'bg-amber-500/10' }
          ].map(stat => (
            <Card key={stat.label} className="p-5 flex flex-col justify-between border-white/[0.06]">
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-black uppercase tracking-wider text-textSecondary">{stat.label}</span>
                <div className={`p-2 rounded-xl ${stat.bg} ${stat.color}`}>
                  <stat.icon className="w-4 h-4" />
                </div>
              </div>
              <div className="text-3xl font-black text-white mt-4">{stat.value}</div>
            </Card>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Keyword Rankings */}
        <Card className="lg:col-span-2 border-white/[0.06]">
          <Card.Header>
            <Card.Title>Keyword Rankings</Card.Title>
          </Card.Header>
          <Card.Content className="p-0">
            <Table>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>Keyword</Table.HeaderCell>
                  <Table.HeaderCell>Position</Table.HeaderCell>
                  <Table.HeaderCell>Volume</Table.HeaderCell>
                  <Table.HeaderCell>Score</Table.HeaderCell>
                  <Table.HeaderCell>Trend</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {customKeywords.map((kw, i) => (
                  <Table.Row 
                    key={i} 
                    onClick={() => setActiveKw(kw === activeKw ? null : kw)} 
                    className={`cursor-pointer transition-colors ${activeKw === kw ? 'bg-purple-500/5' : 'hover:bg-white/[0.01]'}`}
                  >
                    <Table.Cell className="font-semibold text-white">{kw.keyword}</Table.Cell>
                    <Table.Cell>
                      <Badge variant={kw.position <= 5 ? 'success' : kw.position <= 10 ? 'primary' : 'neutral'}>
                        #{kw.position}
                      </Badge>
                    </Table.Cell>
                    <Table.Cell className="text-textSecondary">{kw.volume.toLocaleString()}</Table.Cell>
                    <Table.Cell>
                      <div className="flex items-center gap-3">
                        <div className="w-16 h-1.5 bg-white/[0.04] border border-white/[0.08] rounded-full overflow-hidden">
                          <div 
                            className="h-full rounded-full" 
                            style={{ 
                              width: `${kw.score}%`,
                              backgroundColor: kw.score >= 80 ? '#10B981' : kw.score >= 60 ? '#F59E0B' : '#EF4444' 
                            }} 
                          />
                        </div>
                        <span className="text-[11px] font-bold text-white">{kw.score}</span>
                      </div>
                    </Table.Cell>
                    <Table.Cell>
                      {kw.trend === 'up' ? (
                        <span className="text-emerald-400 flex items-center gap-0.5 text-xs font-semibold"><TrendingUp className="w-3.5 h-3.5" /> Up</span>
                      ) : kw.trend === 'down' ? (
                        <span className="text-red-400 flex items-center gap-0.5 text-xs font-semibold"><TrendingDown className="w-3.5 h-3.5" /> Down</span>
                      ) : (
                        <span className="text-textSecondary flex items-center gap-0.5 text-xs font-semibold"><Minus className="w-3.5 h-3.5" /> Stable</span>
                      )}
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </Card.Content>
        </Card>

        {/* SEO Checklist */}
        <Card className="border-white/[0.06]">
          <Card.Header>
            <Card.Title>SEO Checklist</Card.Title>
          </Card.Header>
          <Card.Content className="p-5 flex flex-col gap-3.5">
            {SEO_CHECKS.map((check, i) => (
              <div 
                key={i} 
                className={`flex items-start gap-3 p-3.5 rounded-2xl border transition-all ${
                  check.done 
                    ? 'bg-emerald-500/[0.02] border-emerald-500/10 text-emerald-400' 
                    : 'bg-amber-500/[0.02] border-amber-500/10 text-amber-400'
                }`}
              >
                <div className="shrink-0 mt-0.5">
                  {check.done ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-amber-400 animate-pulse" />
                  )}
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs font-bold leading-normal text-white">{check.label}</span>
                  <span className="text-[10px] text-textSecondary uppercase font-black tracking-widest">
                    {check.done ? 'Optimized' : 'Needs Action'}
                  </span>
                </div>
              </div>
            ))}
          </Card.Content>
        </Card>
      </div>
    </div>
  );
}
