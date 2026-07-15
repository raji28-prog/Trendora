import React from 'react';
import Card from '../components/UI/Card.jsx';
import Select from '../components/UI/Select.jsx';
import { useSelector, useDispatch } from 'react-redux';
import { setTheme } from '../store/themeSlice.js';
import { addToast } from '../store/uiSlice.js';
import { Sun, Moon, Monitor, Globe, Bell, Settings as SettingsIcon } from 'lucide-react';

export const Settings = () => {
  const dispatch = useDispatch();
  const currentTheme = useSelector((state) => state.theme.theme);

  const handleThemeChange = (newTheme) => {
    dispatch(setTheme(newTheme));
    dispatch(addToast({ type: 'success', message: `Theme switched to ${newTheme}` }));
  };

  return (
    <div className="flex flex-col gap-6 max-w-2xl pb-10">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest">
          <SettingsIcon className="w-4 h-4 text-purple-400" /> Platform Preferences
        </div>
        <h1 className="text-3xl font-black text-white tracking-tight">Settings</h1>
        <p className="text-xs text-textSecondary">Customize platform preferences and options.</p>
      </div>

      <Card>
        <Card.Header>
          <Card.Title>Appearance Settings</Card.Title>
        </Card.Header>
        <Card.Content className="flex flex-col gap-6 p-6">
          <div className="flex flex-col gap-3">
            <span className="text-[10px] font-bold text-textSecondary uppercase tracking-widest select-none">
              Choose Visual Mode
            </span>
            <div className="grid grid-cols-3 gap-4">
              {[
                { value: 'light',  label: 'Light',  icon: Sun,  glow: 'rgba(245,158,11,0.2)' },
                { value: 'dark',   label: 'Dark',   icon: Moon, glow: 'rgba(124,58,237,0.2)' },
                { value: 'system', label: 'System', icon: Monitor, glow: 'rgba(59,130,246,0.2)' },
              ].map((t) => {
                const Icon = t.icon;
                const isSelected = currentTheme === t.value;
                return (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => handleThemeChange(t.value)}
                    className={`flex flex-col items-center justify-center gap-3 p-5 rounded-[16px] border transition-all duration-200 ${
                      isSelected
                        ? 'border-primary bg-primary/15 text-white font-bold'
                        : 'border-white/10 bg-white/[0.03] text-textSecondary hover:border-primary/30 hover:text-white hover:bg-white/[0.06]'
                    }`}
                    style={isSelected ? { boxShadow: `0 0 16px ${t.glow}` } : {}}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-xs font-semibold">{t.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <Select
            label="Default Language"
            placeholder="Select language..."
            options={[
              { value: 'en', label: 'English (US)' },
              { value: 'es', label: 'Español' },
              { value: 'fr', label: 'Français' },
            ]}
            defaultValue="en"
            disabled
          />
        </Card.Content>
      </Card>

      <Card>
        <Card.Header>
          <Card.Title>Notifications Preferences</Card.Title>
        </Card.Header>
        <Card.Content className="flex flex-col items-center gap-3 text-center py-10 rounded-b-[20px] p-6">
          <div className="p-3.5 rounded-full bg-white/[0.04] border border-white/10 text-textSecondary">
            <Bell className="w-6 h-6 opacity-60" />
          </div>
          <p className="text-xs text-textSecondary max-w-xs leading-relaxed">
            Notification rules management will be integrated in a later release.
          </p>
        </Card.Content>
      </Card>

      <Card>
        <Card.Header>
          <Card.Title>Localization Settings</Card.Title>
        </Card.Header>
        <Card.Content className="flex flex-col items-center gap-3 text-center py-10 rounded-b-[20px] p-6">
          <div className="p-3.5 rounded-full bg-white/[0.04] border border-white/10 text-textSecondary">
            <Globe className="w-6 h-6 opacity-60" />
          </div>
          <p className="text-xs text-textSecondary max-w-xs leading-relaxed">
            International timezone synchronization settings are managed automatically.
          </p>
        </Card.Content>
      </Card>
    </div>
  );
};

export default Settings;
