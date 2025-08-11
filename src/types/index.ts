// Tipos globais da aplicação

export interface User {
  id: string;
  email: string;
  username: string;
  name: string;
  avatar_url?: string;
  bio?: string;
  created_at?: string;
}

export interface UserStats {
  totalViews: number;
  totalClicks: number;
  totalLinks: number;
  conversionRate: number;
  topLink?: string;
  thisMonth: {
    views: number;
    clicks: number;
  };
}

export interface Activity {
  id: string;
  type: 'view' | 'click' | 'share' | 'edit' | 'create';
  description: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface BioLink {
  id: string;
  title: string;
  url: string;
  icon: string;
  is_active: boolean;
  order_index: number;
  click_count: number;
  created_at: string;
  user_id: string;
}

export interface ShortenedUrl {
  id: string;
  original_url: string;
  short_code: string;
  click_count: number;
  created_at: string;
  user_id: string;
  is_active: boolean;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface NotificationSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  browserNotifications: boolean;
  marketingEmails: boolean;
}

export interface ThemeSettings {
  mode: 'light' | 'dark' | 'neon';
  primaryColor: string;
  backgroundStyle: 'solid' | 'gradient' | 'image';
}

// Tipos para formulários
export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  email: string;
  password: string;
  username: string;
  name: string;
}

export interface BioLinkFormData {
  title: string;
  url: string;
  icon: string;
}

// Tipos para componentes
export interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  text?: string;
}

export interface ErrorProps {
  error: Error | string;
  retry?: () => void;
  fallback?: React.ReactNode;
}