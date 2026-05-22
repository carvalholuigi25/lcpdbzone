export interface Settings {
  id?: string | number;
  theme: 'light' | 'dark' | 'auto';
  themeSettingName: string;
  realTimeDataEnabled: string | boolean;
  isDarkMode?: string | boolean; // Optional, can be derived from theme
  autoRefreshInterval: number; // in seconds
  notificationsEnabled: string | boolean;
  enableLogging: string | boolean;
  createdAt?: Date;
  updatedAt?: Date;
  userId?: number;
}

export interface ThemeOption {
  label: string;
  value: 'light' | 'dark' | 'auto';
}
