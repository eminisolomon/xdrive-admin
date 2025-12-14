import type { BaseResponse } from './base';

export type SettingGroup =
  | 'general'
  | 'approvals'
  | 'uploads'
  | 'social'
  | 'access_control';

export type SettingType = 'text' | 'email' | 'boolean' | 'number' | 'url';

export interface SystemSetting {
  id: string;
  key: string;
  value: string | number | boolean | null;
  group: SettingGroup;
  type: SettingType;
  description: string;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export type GetSettingsResponse = BaseResponse<
  Record<SettingGroup, SystemSetting[]>
>;

export interface UpdateSettingPayload {
  key: string;
  value: string | number | boolean | null;
}

export interface UpdateSettingsRequest {
  settings: UpdateSettingPayload[];
}
