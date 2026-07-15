import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useSelectedBusiness } from '../store/useSelectedBusiness.js';
import Card from '../components/UI/Card.jsx';
import Button from '../components/UI/Button.jsx';
import Badge from '../components/UI/Badge.jsx';
import Spinner from '../components/UI/Spinner.jsx';
import EmptyState from '../components/UI/EmptyState.jsx';
import { Globe, MapPin, Phone, RefreshCw, Compass } from 'lucide-react';

export default function Gbp() {
  const navigate = useNavigate();
  const { selectedBusinessId, selectedBusiness, businesses } = useSelectedBusiness();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [syncMsg, setSyncMsg] = useState('');

  const load = async (id) => {
    if (!id) {
      setData(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await api.get(`/api/gbp?businessId=${id}`);
      setData(res.data.data);
    } catch { /* ignore */ }
    setLoading(false);
  };

  useEffect(() => {
    load(selectedBusinessId);
  }, [selectedBusinessId]);

  const handleSync = async () => {
    if (!selectedBusinessId) return;
    setSyncing(true);
    try {
      const res = await api.put('/api/gbp');
      setSyncMsg('✓ Synced successfully at ' + new Date(res.data.data.syncedAt).toLocaleTimeString());
      setTimeout(() => setSyncMsg(''), 4000);
      load(selectedBusinessId);
    } catch { setSyncMsg('Sync failed'); }
    setSyncing(false);
  };

  if (!selectedBusinessId) {
    return (
      <div className="flex-1 flex flex-col gap-6 w-full max-w-4xl mx-auto py-8 pb-16">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest">
            <Compass className="w-4 h-4 text-purple-400" /> Google Integration
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">Google Business Profile</h1>
          <p className="text-xs text-textSecondary">Monitor your Google listing performance and sync updates.</p>
        </div>

        <Card className="text-center p-12 flex flex-col items-center justify-center gap-4">
          <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-full text-purple-400">
            <Globe className="w-10 h-10" />
          </div>
          {businesses.length === 0 ? (
            <>
              <h3 className="text-xl font-bold text-white tracking-tight">No Businesses Found</h3>
              <p className="text-sm text-textSecondary max-w-sm leading-relaxed">Create your first business to connect with Google Business Profile.</p>
              <Button variant="primary" className="mt-2" onClick={() => navigate('/businesses')}>
                + Add Business
              </Button>
            </>
          ) : (
            <>
              <h3 className="text-xl font-bold text-white tracking-tight">No Business Selected</h3>
              <p className="text-sm text-textSecondary max-w-sm leading-relaxed">
                Use the business selector in the header to choose which business to view.
              </p>
            </>
          )}
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[50vh] gap-3">
        <Spinner size="lg" />
        <span className="text-sm text-textSecondary font-semibold font-sans">Connecting Google services...</span>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col gap-6 w-full max-w-4xl mx-auto py-8 pb-16">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest">
            <Compass className="w-4 h-4 text-purple-400" /> Google Integration
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">Google Business Profile</h1>
          <p className="text-xs text-textSecondary">
            Monitoring listing for <strong className="text-white">{selectedBusiness?.name}</strong>
          </p>
        </div>
        <Button onClick={handleSync} isLoading={syncing} icon={RefreshCw}>
          {syncing ? 'Syncing...' : 'Sync Profile'}
        </Button>
      </div>

      {syncMsg && (
        <div className="px-4 py-3 rounded-lg border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 text-xs font-semibold">
          {syncMsg}
        </div>
      )}

      {!data ? (
        <EmptyState
          icon={Globe}
          title="No Business Profile Connected"
          description="Add a business first, then sync your Google profile."
        />
      ) : (
        <>
          {/* Verification Banner */}
          <div
            className="rounded-[24px] p-6 md:p-8 text-white flex flex-col md:flex-row justify-between items-center gap-6 relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #4285F4 0%, #34A853 100%)',
              boxShadow: '0 8px 32px rgba(66, 133, 244, 0.25)',
            }}
          >
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-white/20" />
            <div className="text-center md:text-left">
              <h2 className="text-2xl font-black tracking-tight">{data.businessName}</h2>
              <div className="flex flex-wrap gap-x-4 gap-y-2 mt-2 text-xs opacity-90 font-medium justify-center md:justify-start">
                <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {data.address}</span>
                <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5" /> {data.phone}</span>
              </div>
            </div>
            <div className="text-center">
              <Badge variant="success" className="uppercase font-bold tracking-widest mb-1">{data.verificationStatus}</Badge>
              <div className="text-[10px] opacity-75 mt-1 font-semibold">Last synced: {new Date(data.lastSyncedAt).toLocaleString()}</div>
            </div>
          </div>

          {/* Rating Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
            {[
              { label: 'Star Rating', value: `⭐ ${data.rating}`, sub: `${data.totalReviews} reviews`, color: 'text-amber-400', bg: 'rgba(245,158,11,0.06)', border: 'rgba(245,158,11,0.2)' },
              { label: 'Monthly Views', value: data.views?.thisMonth?.toLocaleString(), sub: `↑ vs ${data.views?.lastMonth?.toLocaleString()} last mo`, color: 'text-purple-400', bg: 'rgba(124,58,237,0.06)', border: 'rgba(124,58,237,0.2)' },
              { label: 'Website Clicks', value: data.actions?.websiteClicks, sub: 'this month', color: 'text-emerald-400', bg: 'rgba(16,185,129,0.06)', border: 'rgba(16,185,129,0.2)' },
              { label: 'Direction Requests', value: data.actions?.directionRequests, sub: 'this month', color: 'text-blue-400', bg: 'rgba(59,130,246,0.06)', border: 'rgba(59,130,246,0.2)' }
            ].map((stat, idx) => (
              <Card key={idx}>
                <Card.Content className="p-5 flex flex-col gap-2">
                  <span className="text-[10px] text-textSecondary uppercase tracking-widest font-semibold">{stat.label}</span>
                  <span className={`text-2xl font-black ${stat.color} leading-none tracking-tight`}>{stat.value}</span>
                  <span className="text-[11px] text-textSecondary font-medium leading-none">{stat.sub}</span>
                </Card.Content>
              </Card>
            ))}
          </div>

          {/* Search Analytics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <Card.Header>
                <Card.Title>How Customers Find You</Card.Title>
              </Card.Header>
              <Card.Content className="p-6 flex flex-col gap-4">
                {[
                  { label: 'Direct Searches', value: data.searches?.direct, total: data.searches?.direct + data.searches?.discovery, color: '#7C3AED' },
                  { label: 'Discovery Searches', value: data.searches?.discovery, total: data.searches?.direct + data.searches?.discovery, color: '#10B981' }
                ].map((item, idx) => (
                  <div key={idx} className="flex flex-col gap-1.5">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-textSecondary">{item.label}</span>
                      <span style={{ color: item.color }}>{item.value}</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-white/[0.04] overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          background: item.color,
                          width: `${Math.round(item.value / item.total * 100)}%`,
                          transition: 'width 0.8s ease'
                        }}
                      />
                    </div>
                  </div>
                ))}
              </Card.Content>
            </Card>

            <Card>
              <Card.Header>
                <Card.Title>Customer Actions</Card.Title>
              </Card.Header>
              <Card.Content className="p-4 flex flex-col gap-2">
                {[
                  { label: 'Website Clicks', value: data.actions?.websiteClicks, icon: Globe, color: 'text-purple-400' },
                  { label: 'Phone Calls', value: data.actions?.callClicks, icon: Phone, color: 'text-emerald-400' },
                  { label: 'Direction Requests', value: data.actions?.directionRequests, icon: MapPin, color: 'text-amber-400' }
                ].map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div key={idx} className="flex items-center justify-between p-3 rounded-xl hover:bg-white/[0.02] border border-transparent hover:border-white/[0.06] transition-all">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-[10px] bg-white/[0.04]">
                          <Icon className={`w-4 h-4 ${item.color}`} />
                        </div>
                        <span className="text-sm font-semibold text-white">{item.label}</span>
                      </div>
                      <span className={`text-lg font-black ${item.color}`}>{item.value}</span>
                    </div>
                  );
                })}
              </Card.Content>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
