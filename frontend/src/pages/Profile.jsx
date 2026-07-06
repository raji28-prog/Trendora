import React, { useState } from 'react';
import Card from '../components/UI/Card.jsx';
import Avatar from '../components/UI/Avatar.jsx';
import Input from '../components/UI/Input.jsx';
import Button from '../components/UI/Button.jsx';
import { useForm } from 'react-hook-form';
import { useSelector, useDispatch } from 'react-redux';
import { addToast } from '../store/uiSlice.js';
import { updateProfileStart, updateProfileSuccess, updateProfileFailure } from '../store/authSlice.js';
import { User, Mail, Phone, Camera } from 'lucide-react';
import api from '../services/api.js';

export const Profile = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user) || { name: 'Admin User', email: 'admin@trendora.com', role: 'ADMIN', phone: '', profileImage: '' };
  
  const [updating, setUpdating] = useState(false);
  const [avatar, setAvatar] = useState(user.profileImage || '');

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      name: user.name,
      email: user.email,
      phone: user.phone || '',
    },
  });

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
    <div className="flex flex-col gap-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-textPrimary">Profile</h1>
        <p className="text-xs text-textSecondary">Manage your account information and preferences.</p>
      </div>

      <Card>
        <Card.Header>
          <Card.Title>Personal Details</Card.Title>
        </Card.Header>
        <Card.Content>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
            <div className="flex items-center gap-4 py-3 border-b border-border mb-4">
              <div className="relative group cursor-pointer">
                <Avatar name={user.name} src={avatar} size="lg" />
                <label
                  htmlFor="avatar-upload"
                  className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-150 cursor-pointer"
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
                <span className="text-sm font-semibold text-textPrimary">{user.name}</span>
                <span className="text-xs text-textSecondary uppercase tracking-wider">{user.role}</span>
              </div>
              <div className="ml-auto">
                <label
                  htmlFor="avatar-upload"
                  className="px-3 py-1.5 text-xs font-semibold border border-border rounded-lg bg-surface text-textPrimary hover:bg-sectionBackground cursor-pointer transition-colors duration-150 inline-block"
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

            <div className="flex justify-end gap-3 mt-4">
              <Button type="submit" isLoading={updating}>
                Save Changes
              </Button>
            </div>
          </form>
        </Card.Content>
      </Card>
    </div>
  );
};

export default Profile;

