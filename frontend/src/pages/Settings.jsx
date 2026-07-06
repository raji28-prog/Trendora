import React from 'react';
import Card from '../components/UI/Card.jsx';
import Select from '../components/UI/Select.jsx';
import { useSelector, useDispatch } from 'react-redux';
import { setTheme } from '../store/themeSlice.js';
import { addToast } from '../store/uiSlice.js';
import { Sun, Moon, Monitor, Globe, Bell } from 'lucide-react';

export const Settings = () => {
  const dispatch = useDispatch();
  const currentTheme = useSelector((state) => state.theme.theme);

  const handleThemeChange = (newTheme) => {
    dispatch(setTheme(newTheme));
    dispatch(addToast({ type: 'success', message: `Theme switched to ${newTheme}` }));
  };

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-textPrimary">Settings</h1>
        <p className="text-xs text-textSecondary">Customize platform preferences and options.</p>
      </div>

      <Card>
        <Card.Header>
          <Card.Title>Appearance Settings</Card.Title>
        </Card.Header>
        <Card.Content className="flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            <span className="text-xs font-semibold text-textSecondary select-none">Choose Visual Mode</span>
            <div className="grid grid-cols-3 gap-4">
              {[
                { value: 'light', label: 'Light', icon: Sun },
                { value: 'dark', label: 'Dark', icon: Moon },
                { value: 'system', label: 'System', icon: Monitor },
              ].map((t) => {
                const Icon = t.icon;
                const isSelected = currentTheme === t.value;
                return (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => handleThemeChange(t.value)}
                    className={`flex flex-col items-center justify-center gap-3 p-4 rounded-xl border transition-all ${
                      isSelected
                        ? 'border-primary bg-primary/5 text-primary font-semibold ring-1 ring-primary/20'
                        : 'border-border bg-surface text-textSecondary hover:border-textSecondary/50 hover:text-textPrimary'
                    }`}
                  >
                    <Icon className="w-6 h-6" />
                    <span className="text-xs">{t.label}</span>
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
        <Card.Content className="flex flex-col gap-4 text-xs text-textSecondary py-8 text-center border-dashed border border-border bg-background/20 rounded-b-xl">
          <Bell className="w-8 h-8 text-textSecondary mx-auto opacity-40 mb-2" />
          <span>Notification rules management will be integrated in a later release.</span>
        </Card.Content>
      </Card>

      <Card>
        <Card.Header>
          <Card.Title>Localization Settings</Card.Title>
        </Card.Header>
        <Card.Content className="flex flex-col gap-4 text-xs text-textSecondary py-8 text-center border-dashed border border-border bg-background/20 rounded-b-xl">
          <Globe className="w-8 h-8 text-textSecondary mx-auto opacity-40 mb-2" />
          <span>Advanced translation systems and multi-currency configurations placeholder.</span>
        </Card.Content>
      </Card>
    </div>
  );
};

export default Settings;
