export interface Settings {
  settingsId?: string | number;
  theme: 'light' | 'dark' | 'auto';
  themeSettingName: string;
  realTimeDataEnabled: boolean | string;
  isDarkMode?: boolean | string; // Optional, can be derived from theme
  autoRefreshInterval: number; // in seconds
  notificationsEnabled: boolean | string;
  enableLogging: boolean | string;
  createdAt?: Date;
  updatedAt?: Date;
  userId?: number;
}

export interface ThemeOption {
  label: string;
  value: 'light' | 'dark' | 'auto';
}
