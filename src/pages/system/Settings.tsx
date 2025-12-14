import { useState, useEffect } from 'react';
import * as Tabs from '@radix-ui/react-tabs';
import {
  CogIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';
import PageHeader from '@/components/PageHeader';
import { Button, Input, Toggle, Loading } from '@/components';
import { useSettings } from '@/queries/useSettings';
import { SystemSetting, SettingGroup } from '@/interfaces/settings';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const GROUPS: { key: SettingGroup; label: string }[] = [
  { key: 'general', label: 'General' },
  { key: 'approvals', label: 'Approvals' },
  { key: 'access_control', label: 'Access Control' },
  { key: 'uploads', label: 'Uploads' },
  { key: 'social', label: 'Social' },
];

const Settings = () => {
  const { getSettings, updateSettings, updateSettingsPending } = useSettings();

  const { data: settingsResponse, isLoading, error } = getSettings();
  const [localSettings, setLocalSettings] = useState<Record<string, any>>({});
  const [hasChanges, setHasChanges] = useState(false);
  const [activeTab, setActiveTab] = useState('general');

  useEffect(() => {
    if (settingsResponse?.data) {
      const initialSettings: Record<string, any> = {};
      const allSettings: SystemSetting[] = Object.values(
        settingsResponse.data,
      ).flat();
      allSettings.forEach((setting) => {
        initialSettings[setting.key] = setting.value;
      });
      setLocalSettings(initialSettings);
    }
  }, [settingsResponse]);

  const handleChange = (key: string, value: any) => {
    setLocalSettings((prev) => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    if (!hasChanges) return;

    try {
      const payload = Object.entries(localSettings).map(([key, value]) => ({
        key,
        value,
      }));

      await updateSettings({ settings: payload });
      setHasChanges(false);
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  };

  if (isLoading) return <Loading />;

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-8">
        <div className="bg-red-50 p-4 rounded-full mb-4">
          <ExclamationCircleIcon className="h-12 w-12 text-red-500" />
        </div>
        <h3 className="text-lg font-semibold text-(--color-text)">
          Failed to load settings
        </h3>
        <p className="text-(--color-body) mt-2">
          Please try reloading the page.
        </p>
      </div>
    );
  }

  const renderField = (setting: SystemSetting) => {
    switch (setting.type) {
      case 'boolean':
        return (
          <motion.div
            layout
            key={setting.id}
            className="flex items-center justify-between p-5 bg-(--color-surface) rounded-xl border border-(--color-border) hover:border-(--color-active-border) transition-colors shadow-sm"
          >
            <div className="space-y-1">
              <label className="text-sm font-medium text-(--color-text) block">
                {setting.description}
              </label>
              <p className="text-xs text-(--color-body) font-mono bg-elevation-2 px-2 py-0.5 rounded inline-block">
                {setting.key}
              </p>
            </div>
            <Toggle
              checked={!!localSettings[setting.key]}
              onChange={(checked) => handleChange(setting.key, checked)}
            />
          </motion.div>
        );

      case 'number':
        return (
          <motion.div
            layout
            key={setting.id}
            className="bg-(--color-surface) p-5 rounded-xl border border-(--color-border) hover:border-(--color-active-border) transition-colors shadow-sm space-y-3"
          >
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-(--color-text)">
                {setting.description}
              </label>
              <span className="text-xs text-(--color-body) font-mono bg-elevation-2 px-2 py-0.5 rounded">
                {setting.key}
              </span>
            </div>
            <Input
              type="number"
              value={localSettings[setting.key] || ''}
              onChange={(e) =>
                handleChange(setting.key, Number(e.target.value))
              }
              className="mt-0"
            />
          </motion.div>
        );

      case 'text':
      case 'email':
      case 'url':
      default:
        return (
          <motion.div
            layout
            key={setting.id}
            className="bg-(--color-surface) p-5 rounded-xl border border-(--color-border) hover:border-(--color-active-border) transition-colors shadow-sm space-y-3"
          >
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-(--color-text)">
                {setting.description}
              </label>
              <span className="text-xs text-(--color-body) font-mono bg-elevation-2 px-2 py-0.5 rounded">
                {setting.key}
              </span>
            </div>
            <Input
              type={setting.type === 'url' ? 'text' : setting.type}
              value={localSettings[setting.key] || ''}
              onChange={(e) => handleChange(setting.key, e.target.value)}
              placeholder={setting.type === 'url' ? 'https://example.com' : ''}
              className="mt-0"
            />
          </motion.div>
        );
    }
  };

  return (
    <div className="pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <PageHeader
          title="System Settings"
          description="Manage system configurations and preferences."
          icon={<CogIcon className="h-12 w-12" />}
        />
        <div className="flex items-center gap-3">
          {hasChanges && (
            <span className="text-sm text-amber-600 bg-amber-50 px-3 py-1.5 rounded-full font-medium border border-amber-200 animate-pulse">
              Unsaved changes
            </span>
          )}
          <Button
            onClick={handleSave}
            disabled={!hasChanges}
            isLoading={updateSettingsPending}
            icon={<CheckCircleIcon className="h-5 w-5" />}
            className="bg-(--color-primary) hover:opacity-90 shadow-lg shadow-(--color-primary)/20"
          >
            Save Changes
          </Button>
        </div>
      </div>

      <Tabs.Root
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-8"
      >
        <div className="sticky top-[80px] z-10 bg-(--color-background)/80 backdrop-blur-xl border-b border-(--color-border) -mx-4 px-4 sm:px-0 sm:mx-0 sm:bg-transparent sm:backdrop-blur-none sm:border-0 pb-1">
          <Tabs.List className="flex gap-2 w-full overflow-x-auto no-scrollbar py-2">
            {GROUPS.map((group) => (
              <Tabs.Trigger
                key={group.key}
                value={group.key}
                className={cn(
                  'group relative px-5 py-2.5 rounded-full text-sm font-medium transition-all outline-none',
                  'text-(--color-body) hover:text-(--color-text) hover:bg-(--color-surface)',
                  'data-[state=active]:text-(--color-on-primary) data-[state=active]:bg-(--color-primary) data-[state=active]:shadow-lg',
                )}
              >
                {group.label}
              </Tabs.Trigger>
            ))}
          </Tabs.List>
        </div>

        {GROUPS.map((group) => {
          const groupSettings = settingsResponse?.data?.[group.key] || [];

          return (
            <Tabs.Content
              key={group.key}
              value={group.key}
              className="space-y-6 focus:outline-none"
            >
              <div className="max-w-4xl">
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-(--color-text)">
                    {group.label}
                  </h2>
                  <p className="text-(--color-body) text-sm mt-1">
                    Configure {group.label.toLowerCase()} settings for the
                    platform.
                  </p>
                </div>

                {groupSettings.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {groupSettings.map(renderField)}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-(--color-surface) rounded-2xl border border-dashed border-(--color-border)">
                    <p className="text-(--color-body)">
                      No settings available for this group.
                    </p>
                  </div>
                )}
              </div>
            </Tabs.Content>
          );
        })}
      </Tabs.Root>
    </div>
  );
};

export default Settings;
