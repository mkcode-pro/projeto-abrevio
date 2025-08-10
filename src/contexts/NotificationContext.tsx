import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useAuth } from './AuthContext';
import { toast } from '@/hooks/use-toast';

interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'feature' | 'maintenance' | 'promotion';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  category: 'system' | 'analytics' | 'security' | 'marketing' | 'feature' | 'billing';
  actionUrl?: string;
  actionLabel?: string;
  expiresAt?: string;
  metadata?: Record<string, any>;
}

interface NotificationPreferences {
  enabledTypes: Notification['type'][];
  enabledCategories: Notification['category'][];
  browserNotifications: boolean;
  emailNotifications: boolean;
  soundEnabled: boolean;
  quietHours: {
    enabled: boolean;
    start: string; // HH:mm
    end: string; // HH:mm
  };
  frequency: 'instant' | 'hourly' | 'daily' | 'weekly';
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  preferences: NotificationPreferences;
  loading: boolean;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (notificationId: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (notificationId: string) => void;
  clearAllNotifications: () => void;
  updatePreferences: (updates: Partial<NotificationPreferences>) => Promise<void>;
  checkPermissions: () => Promise<boolean>;
  requestPermissions: () => Promise<boolean>;
  sendBrowserNotification: (title: string, message: string, options?: NotificationOptions) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

// Mock notifications iniciais
const mockNotifications: Notification[] = [
  {
    id: 'notif-1',
    type: 'success',
    title: 'BioLink atualizado',
    message: 'Seu BioLink foi atualizado com sucesso e está no ar!',
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 min atrás
    read: false,
    priority: 'normal',
    category: 'system',
    actionUrl: '/dashboard/editor',
    actionLabel: 'Ver BioLink'
  },
  {
    id: 'notif-2',
    type: 'info',
    title: 'Novas estatísticas disponíveis',
    message: 'Suas estatísticas de cliques foram atualizadas. Você teve 15 novos cliques hoje!',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2h atrás
    read: false,
    priority: 'normal',
    category: 'analytics',
    actionUrl: '/dashboard/analytics',
    actionLabel: 'Ver Estatísticas'
  },
  {
    id: 'notif-3',
    type: 'feature',
    title: 'Nova funcionalidade: QR Code',
    message: 'Agora você pode gerar QR Codes para seus links! Experimente a nova feature.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 dia atrás
    read: true,
    priority: 'normal',
    category: 'feature',
    actionUrl: '/dashboard',
    actionLabel: 'Explorar'
  },
  {
    id: 'notif-4',
    type: 'warning',
    title: 'Limite de links próximo',
    message: 'Você está próximo do limite de links do plano gratuito. Considere fazer upgrade.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 dias atrás
    read: true,
    priority: 'high',
    category: 'billing',
    actionUrl: '/pricing',
    actionLabel: 'Ver Planos'
  }
];

const defaultPreferences: NotificationPreferences = {
  enabledTypes: ['info', 'success', 'warning', 'error', 'feature'],
  enabledCategories: ['system', 'analytics', 'security', 'feature'],
  browserNotifications: true,
  emailNotifications: true,
  soundEnabled: false,
  quietHours: {
    enabled: false,
    start: '22:00',
    end: '08:00'
  },
  frequency: 'instant'
};

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  
  const [notifications, setNotifications] = useLocalStorage<Notification[]>(
    'abrev-notifications', 
    mockNotifications
  );
  
  const [preferences, setPreferences] = useLocalStorage<NotificationPreferences>(
    'abrev-notification-preferences', 
    defaultPreferences
  );

  // Filtra notificações expiradas
  useEffect(() => {
    const now = new Date();
    const validNotifications = notifications.filter(notif => 
      !notif.expiresAt || new Date(notif.expiresAt) > now
    );
    
    if (validNotifications.length !== notifications.length) {
      setNotifications(validNotifications);
    }
  }, [notifications, setNotifications]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const addNotification = useCallback((
    notification: Omit<Notification, 'id' | 'timestamp' | 'read'>
  ) => {
    if (!isAuthenticated) return;

    // Verifica se o tipo e categoria estão habilitados
    if (!preferences.enabledTypes.includes(notification.type) || 
        !preferences.enabledCategories.includes(notification.category)) {
      return;
    }

    // Verifica quiet hours
    if (preferences.quietHours.enabled) {
      const now = new Date();
      const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      const start = preferences.quietHours.start;
      const end = preferences.quietHours.end;
      
      if (start > end) { // Atravessa meia-noite
        if (currentTime >= start || currentTime <= end) {
          return; // Está em quiet hours
        }
      } else {
        if (currentTime >= start && currentTime <= end) {
          return; // Está em quiet hours
        }
      }
    }

    const newNotification: Notification = {
      ...notification,
      id: 'notif-' + Date.now(),
      timestamp: new Date().toISOString(),
      read: false
    };

    setNotifications(prev => [newNotification, ...prev.slice(0, 99)]); // Mantém apenas as últimas 100

    // Toast notification
    toast({
      title: notification.title,
      description: notification.message,
      variant: notification.type === 'error' ? 'destructive' : 'default'
    });

    // Browser notification se habilitado
    if (preferences.browserNotifications) {
      sendBrowserNotification(notification.title, notification.message);
    }
  }, [isAuthenticated, preferences, setNotifications]);

  const markAsRead = useCallback((notificationId: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId 
          ? { ...notif, read: true }
          : notif
      )
    );
  }, [setNotifications]);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
    
    toast({
      title: "Notificações marcadas como lidas",
      description: `${unreadCount} notificações foram marcadas como lidas`,
    });
  }, [setNotifications, unreadCount]);

  const deleteNotification = useCallback((notificationId: string) => {
    setNotifications(prev => 
      prev.filter(notif => notif.id !== notificationId)
    );
  }, [setNotifications]);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
    toast({
      title: "Notificações removidas",
      description: "Todas as notificações foram removidas",
    });
  }, [setNotifications]);

  const updatePreferences = useCallback(async (updates: Partial<NotificationPreferences>) => {
    setLoading(true);
    try {
      // Simula atualização no servidor
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const updatedPreferences = { ...preferences, ...updates };
      setPreferences(updatedPreferences);

      toast({
        title: "Preferências atualizadas",
        description: "Configurações de notificação foram salvas",
      });
    } catch (error) {
      toast({
        title: "Erro ao atualizar preferências",
        description: "Tente novamente mais tarde",
        variant: "destructive"
      });
      throw error;
    } finally {
      setLoading(false);
    }
  }, [preferences, setPreferences]);

  const checkPermissions = useCallback(async (): Promise<boolean> => {
    if (!('Notification' in window)) {
      return false;
    }
    return Notification.permission === 'granted';
  }, []);

  const requestPermissions = useCallback(async (): Promise<boolean> => {
    if (!('Notification' in window)) {
      toast({
        title: "Notificações não suportadas",
        description: "Seu navegador não suporta notificações",
        variant: "destructive"
      });
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    const permission = await Notification.requestPermission();
    
    if (permission === 'granted') {
      toast({
        title: "Notificações habilitadas",
        description: "Você receberá notificações do Abrev.io",
      });
      return true;
    } else {
      toast({
        title: "Notificações bloqueadas",
        description: "Você pode habilitar nas configurações do navegador",
        variant: "destructive"
      });
      return false;
    }
  }, []);

  const sendBrowserNotification = useCallback((
    title: string, 
    message: string, 
    options?: NotificationOptions
  ) => {
    if (!preferences.browserNotifications || Notification.permission !== 'granted') {
      return;
    }

    try {
      const notification = new Notification(title, {
        body: message,
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        tag: 'abrev-notification',
        requireInteraction: false,
        ...options
      });

      // Auto-close após 5 segundos
      setTimeout(() => {
        notification.close();
      }, 5000);

      notification.onclick = () => {
        window.focus();
        notification.close();
      };
    } catch (error) {
      console.warn('Erro ao enviar notificação do navegador:', error);
    }
  }, [preferences.browserNotifications]);

  const value: NotificationContextType = {
    notifications,
    unreadCount,
    preferences,
    loading,
    addNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
    updatePreferences,
    checkPermissions,
    requestPermissions,
    sendBrowserNotification
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications deve ser usado dentro de um NotificationProvider');
  }
  return context;
}