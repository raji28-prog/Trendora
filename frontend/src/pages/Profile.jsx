import React from 'react';
import Card from '../components/UI/Card.jsx';
import Avatar from '../components/UI/Avatar.jsx';
import Input from '../components/UI/Input.jsx';
import Button from '../components/UI/Button.jsx';
import { useForm } from 'react-hook-form';
import { useSelector, useDispatch } from 'react-redux';
import { addToast } from '../store/uiSlice.js';
import { updateUser } from '../store/authSlice.js';
import { User, Mail } from 'lucide-react';

export const Profile = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user) || { name: 'Admin User', email: 'admin@trendora.com', role: 'ADMIN' };

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      name: user.name,
      email: user.email,
    },
  });

  const onSubmit = (data) => {
    dispatch(updateUser(data));
    dispatch(addToast({ type: 'success', message: 'Profile updated successfully' }));
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
            <div className="flex items-center gap-4 py-2 border-b border-border mb-2">
              <Avatar name={user.name} size="lg" />
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-textPrimary">{user.name}</span>
                <span className="text-xs text-textSecondary">{user.role}</span>
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
              error={errors.email}
              {...register('email', {
                required: 'Email is required',
                pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' },
              })}
            />

            <div className="flex justify-end gap-3 mt-4">
              <Button type="submit">
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
