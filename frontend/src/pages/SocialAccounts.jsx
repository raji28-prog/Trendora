import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { addToast } from '../store/uiSlice.js';
import Card from '../components/UI/Card.jsx';
import Button from '../components/UI/Button.jsx';
import Spinner from '../components/UI/Spinner.jsx';
import Badge from '../components/UI/Badge.jsx';
import api from '../services/api.js';
import { 
  Instagram, Facebook, RefreshCw, Plus, 
  Trash2, AlertCircle, Sparkles, ShieldCheck, HelpCircle, Share2
} from 'lucide-react';

const SocialAccounts = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const selectedBusinessId = useSelector((state) => state.business.selectedBusinessId);
  
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState(false);
  const [accounts, setAccounts] = useState([]);
  
  // Parse query parameters for callback redirects
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const success = params.get('success');
    const error = params.get('error');
    
    if (success) {
      dispatch(addToast({ type: 'success', message: 'Instagram Business account connected successfully!' }));
      // Clean query string
      navigate('/social-accounts', { replace: true });
    } else if (error) {
      dispatch(addToast({ type: 'error', message: `Connection failed: ${error}` }));
      navigate('/social-accounts', { replace: true });
    }
  }, [location, dispatch, navigate]);

  const fetchConnectedAccounts = async () => {
    if (!selectedBusinessId) return;
    setLoading(true);
    try {
      const res = await api.get(`/api/instagram/accounts?businessId=${selectedBusinessId}`);
      if (res.data?.success) {
        setAccounts(res.data.data || []);
      }
    } catch (err) {
      console.error('Failed to fetch connected accounts:', err);
      dispatch(addToast({ type: 'error', message: 'Could not load connected social accounts.' }));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConnectedAccounts();
  }, [selectedBusinessId]);

  const handleConnectReal = async () => {
    if (!selectedBusinessId) {
      dispatch(addToast({ type: 'warning', message: 'Please select a business profile first.' }));
      return;
    }
    setConnecting(true);
    try {
      const res = await api.get(`/api/instagram/auth-url?businessId=${selectedBusinessId}`);
      if (res.data?.success && res.data.url) {
        window.location.href = res.data.url;
      } else {
        throw new Error('Failed to retrieve authentication URL.');
      }
    } catch (err) {
      dispatch(addToast({ type: 'error', message: err.message || 'OAuth initialization failed' }));
      setConnecting(false);
    }
  };

  const handleConnectSimulated = () => {
    if (!selectedBusinessId) {
      dispatch(addToast({ type: 'warning', message: 'Please select a business profile first.' }));
      return;
    }
    // Directly hit the callback endpoint with mock params to simulate Meta redirect callback
    const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    window.location.href = `${apiBase}/api/instagram/callback?code=mock_code_sandbox&state=${selectedBusinessId}`;
  };

  const handleDisconnect = async (accountId) => {
    if (!window.confirm('Are you sure you want to disconnect this Instagram account? Your analytics will no longer load.')) {
      return;
    }
    
    try {
      const res = await api.post('/api/instagram/disconnect', {
        businessId: selectedBusinessId,
        accountId
      });
      
      if (res.data?.success) {
        dispatch(addToast({ type: 'success', message: 'Instagram Business account unlinked successfully' }));
        fetchConnectedAccounts();
      }
    } catch (err) {
      dispatch(addToast({ type: 'error', message: 'Failed to disconnect account.' }));
    }
  };

  const isInstagramConnected = accounts.some(a => a.platform === 'INSTAGRAM');
  const connectedIg = accounts.find(a => a.platform === 'INSTAGRAM');

  return (
    <div className="flex flex-col gap-6 max-w-4xl pb-16">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest">
          <Share2 className="w-4 h-4 text-purple-400" /> Channel Integrations
        </div>
        <h1 className="text-3xl font-black text-white tracking-tight">Social Accounts</h1>
        <p className="text-xs text-textSecondary">Link your Facebook Pages and Instagram Business accounts to synchronize marketing statistics.</p>
      </div>

      {loading ? (
        <Card className="flex items-center justify-center p-12 min-h-[300px]">
          <Spinner size="md" />
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Meta (Facebook/Instagram) Card */}
          <Card className="relative overflow-hidden p-6 min-h-[360px] flex flex-col justify-between border-white/[0.06] hover:border-primary/20 transition-all duration-300">
            {/* Ambient subtle lighting effect inside card */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />
            
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-gradient-to-tr from-purple-500 via-pink-500 to-amber-500 rounded-2xl text-white shadow-md shadow-pink-500/10 shrink-0">
                    <Instagram className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base text-white">Instagram Business</h3>
                    <p className="text-[10px] text-textSecondary uppercase tracking-widest font-black mt-0.5">Meta Graph API</p>
                  </div>
                </div>
                {isInstagramConnected ? (
                  <Badge variant="success">Active</Badge>
                ) : (
                  <Badge variant="neutral">Unlinked</Badge>
                )}
              </div>

              <p className="text-xs text-textSecondary leading-relaxed mb-6 font-light">
                Connect your business page to load impressions, follower stats, reach insights, and detailed post engagement metrics directly into your Trendora Dashboard.
              </p>

              {isInstagramConnected && connectedIg && (
                <div className="p-4 bg-white/[0.02] border border-white/[0.06] rounded-2xl flex items-center justify-between gap-4 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center font-black text-purple-300 text-sm">
                      {connectedIg.accountName.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-extrabold text-white">@{connectedIg.accountName}</span>
                      <span className="text-[10px] text-textSecondary flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Linked Page
                      </span>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleDisconnect(connectedIg.accountId)}
                    className="p-2 text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 rounded-xl transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-3">
              {!isInstagramConnected ? (
                <>
                  <Button 
                    onClick={handleConnectReal} 
                    isLoading={connecting}
                    className="w-full"
                  >
                    <Plus className="w-4 h-4 mr-1.5" /> Connect via Facebook
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={handleConnectSimulated}
                    className="w-full flex items-center justify-center gap-1.5"
                  >
                    <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" /> Simulate Sandbox Connection
                  </Button>
                </>
              ) : (
                <Button 
                  variant="outline"
                  onClick={() => navigate('/instagram-analytics')}
                  className="w-full flex items-center justify-center gap-1.5"
                >
                  <Instagram className="w-4.5 h-4.5 text-pink-500" /> View Analytics Insights
                </Button>
              )}
            </div>
          </Card>

          {/* Dummy platforms for SaaS visual completeness */}
          <Card className="relative overflow-hidden p-6 min-h-[360px] flex flex-col justify-between border-white/[0.06] opacity-50">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-white/[0.04] border border-white/10 rounded-2xl text-textSecondary/60 shrink-0">
                    <Facebook className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base text-white">Facebook Pages</h3>
                    <p className="text-[10px] text-textSecondary uppercase tracking-widest font-black mt-0.5">Marketing Api</p>
                  </div>
                </div>
                <Badge variant="neutral">COMING SOON</Badge>
              </div>

              <p className="text-xs text-textSecondary leading-relaxed mb-6 font-light">
                Publish organic content, manage localized page announcements, and track post-level comments directly inside the scheduler. Available in Phase 6.
              </p>
            </div>

            <Button 
              disabled 
              className="w-full cursor-not-allowed opacity-50"
            >
              Unavailable
            </Button>
          </Card>

        </div>
      )}

      {/* Security note widget */}
      <div className="p-4 bg-white/[0.02] border border-white/[0.06] rounded-2xl flex items-start gap-3">
        <HelpCircle className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
        <div className="text-xs text-textSecondary leading-relaxed font-light">
          <strong className="text-white">Stripe & Meta Security Protocol:</strong> Trendora token storage is fully encrypted. We refresh long-lived access tokens automatically in the background using Meta secure scopes. You can disconnect at any time to purge credentials.
        </div>
      </div>
    </div>
  );
};

export default SocialAccounts;
