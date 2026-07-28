export type CategoryType =
  | 'all'
  | 'mayor'
  | 'news'
  | 'radio'
  | 'crime'
  | 'hospitals'
  | 'traffic'
  | 'events';

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  fullContent: string;
  sourceName: string;
  sourceHandle: string;
  sourceAvatar: string;
  category: CategoryType;
  timestamp: string; // ISO string or format
  timeAgo: string;
  url: string;
  verified: boolean;
  image?: string;
  engagement: {
    likes: number;
    shares: number;
    comments: number;
  };
  tags: string[];
  isBreaking?: boolean;
  location?: string;
  bulletPoints?: string[];
}

export interface CategoryFilter {
  id: CategoryType;
  label: string;
  iconName: string;
  color: string;
  badgeBg: string;
  description: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  body: string;
  category: CategoryType;
  timestamp: string;
  read: boolean;
  linkUrl?: string;
}

export interface PushNotificationSettings {
  enabled: boolean;
  soundEnabled: boolean;
  topics: {
    breaking: boolean;
    mayor: boolean;
    crime: boolean;
    traffic: boolean;
    hospitals: boolean;
    weather: boolean;
    events: boolean;
  };
}

export interface WeatherData {
  tempCelsius: number;
  condition: string;
  humidityPercent: number;
  cdoRiverStatus: 'Normal Level' | 'Alert Level 1' | 'Alert Level 2' | 'Critical';
  heatIndex: string;
  lastUpdated: string;
}

export interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  agency: string;
  category: 'rescue' | 'police' | 'hospital' | 'traffic' | 'health';
  address: string;
}
