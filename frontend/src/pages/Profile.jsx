import React, { useState, useEffect } from 'react';
import Card from '../components/UI/Card.jsx';
import Avatar from '../components/UI/Avatar.jsx';
import Input from '../components/UI/Input.jsx';
import Button from '../components/UI/Button.jsx';
import { useForm } from 'react-hook-form';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addToast } from '../store/uiSlice.js';
import { updateProfileStart, updateProfileSuccess, updateProfileFailure } from '../store/authSlice.js';
import { User, Mail, Phone, Camera, Sparkles, CreditCard, UserCheck } from 'lucide-react';
import api from '../services/api.js';

export const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user) || { name: 'Admin User', email: 'admin@trendora.com', role: 'ADMIN', phone: '', profileImage: '' };
  
  const [updating, setUpdating] = useState(false);
  const [avatar, setAvatar] = useState(user.profileImage || '');
  const [activePlan, setActivePlan] = useState('FREE');
  const [subStatus, setSubStatus] = useState('ACTIVE');
  const [expiresDate, setExpiresDate] = useState('--/--/----');

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      name: user.name,
      email: user.email,
      phone: user.phone || '',
    },
  });

  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        const res = await api.get('/api/billing');
        if (res.data?.success && res.data.data) {
          setActivePlan(res.data.data.plan || 'FREE');
          setSubStatus(res.data.data.status || 'ACTIVE');
          setExpiresDate(new Date(res.data.data.expiresAt).toLocaleDateString());
        }
      } catch (err) {
        console.error('Failed to load plan in Profile:', err);
      }
    };
    fetchSubscription();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        dispatch(addToast({ type: 'error', message: 'Image size must be less than 2MB' }));
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result);
        dispatch(addToast({ type: 'success', message: 'New avatar selected. Click Save Changes to upload.' }));
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data) => {
    setUpdating(true);
    dispatch(updateProfileStart());
    try {
      const response = await api.put('/api/auth/profile', {
        name: data.name,
        phone: data.phone,
        profileImage: avatar,
      });
      const updatedUser = response.data.data.user;
      dispatch(updateProfileSuccess({ user: updatedUser }));
      dispatch(addToast({ type: 'success', message: 'Profile updated successfully' }));
    } catch (err) {
      const errMsg = err.response?.data?.error?.message || 'Profile update failed';
      dispatch(updateProfileFailure(errMsg));
      dispatch(addToast({ type: 'error', message: errMsg }));
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-2xl pb-10">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest">
          <UserCheck className="w-4 h-4 text-purple-400" /> Account Hub
        </div>
        <h1 className="text-3xl font-black text-white tracking-tight">Profile Settings</h1>
        <p className="text-xs text-textSecondary">Manage your account details and subscription preferences.</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card className="glass-card">
          <Card.Header>
            <Card.Title>Personal Details</Card.Title>
          </Card.Header>
          <Card.Content className="p-6">
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
              <div className="flex items-center gap-4 py-4 border-b border-white/[0.06] mb-2">
                <div className="relative group cursor-pointer">
                  <Avatar name={user.name} src={avatar} size="lg" />
                  <label
                    htmlFor="avatar-upload"
                    className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-150 cursor-pointer"
                  >
                    <Camera className="w-5 h-5 text-white" />
                  </label>
                  <input
                    type="file"
                    id="avatar-upload"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-bold text-white leading-tight">{user.name}</span>
                  <span className="text-[10px] text-purple-400 uppercase tracking-widest font-bold">{user.role}</span>
                </div>
                <div className="ml-auto">
                  <label
                    htmlFor="avatar-upload"
                    className="px-3.5 py-2 text-xs font-bold border border-white/10 rounded-xl bg-white/[0.04] text-white hover:bg-white/[0.08] cursor-pointer transition-colors duration-150 inline-block"
                  >
                    Change Avatar
                  </label>
                </div>
              </div>

              <Input
                label="Full Name"
                type="text"
                icon={User}
                error={errors.name}
                {...register('name', { required: 'Name is required' })}
              />

              <Input
                label="Email Address"
                type="email"
                icon={Mail}
                disabled
                error={errors.email}
                {...register('email')}
              />

              <Input
                label="Phone Number"
                type="text"
                icon={Phone}
                error={errors.phone}
                {...register('phone')}
              />

              <div className="flex justify-end gap-3 mt-2">
                <Button type="submit" isLoading={updating}>
                  Save Changes
                </Button>
              </div>
            </form>
          </Card.Content>
        </Card>

        {/* Subscription Status Card */}
        <Card className="glass-card">
          <Card.Header>
            <Card.Title className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary animate-pulse" /> Workspace Subscription
            </Card.Title>
          </Card.Header>
          <Card.Content className="p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] text-textSecondary uppercase tracking-widest font-bold">Currently Active Tier</span>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-black text-white">{activePlan} Plan</span>
                  <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded border ${
                    activePlan === 'BUSINESS' ? 'bg-amber-500/15 border-amber-500/30 text-amber-400' :
                    activePlan === 'PRO' ? 'bg-primary/20 border-primary/40 text-purple-300' :
                    'bg-white/[0.06] border-white/[0.08] text-textSecondary'
                  }`}>
                    {activePlan}
                  </span>
                </div>
                <p className="text-xs text-textSecondary mt-1">
                  Status: <strong className="text-success uppercase">{subStatus}</strong> • Expires: {expiresDate}
                </p>
              </div>
              <button
                onClick={() => navigate('/billing')}
                className="px-5 py-2.5 rounded-xl text-xs font-bold tracking-wide text-white transition-all flex items-center gap-2 shrink-0 self-start md:self-auto"
                style={{
                  background: 'linear-gradient(135deg, #7C3AED 0%, #A855F7 100%)',
                  boxShadow: '0 4px 16px -4px rgba(124,58,237,0.5)',
                }}
              >
                <CreditCard className="w-4 h-4" /> Manage Subscription
              </button>
            </div>
          </Card.Content>
        </Card>
      </div>
    </div>
  );
};

export default Profile;

