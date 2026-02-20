export interface Settings {
  id?: string;
  theme: 'light' | 'dark' | 'auto';
  realTimeDataEnabled: boolean;
  autoRefreshInterval: number; // in seconds
  notificationsEnabled: boolean;
  enableLogging: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ThemeOption {
  label: string;
  value: 'light' | 'dark' | 'auto';
}
