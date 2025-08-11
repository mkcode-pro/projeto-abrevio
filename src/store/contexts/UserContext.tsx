import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useLocalStorage } from '@/store/hooks/useLocalStorage';
import { useAuth } from './AuthContext';
import { toast } from 'sonner';
import { logger } from '@/lib/logger';

interface UserStats {
  totalViews: number;
  totalClicks: number;
  totalLinks: number;
  totalBioLinks: number;
  conversionRate: number;
  monthlyGrowth: number;
  topPerformingLink: string | null;
  lastActive: string;
}

interface UserPreferences {
  theme: 'light' | 'dark' | 'neon';
  language: 'pt-BR' | 'en-US' | 'es-ES';
  timezone: string;
  notifications: {
    email: boolean;
    browser: boolean;
    marketing: boolean;
    analytics: boolean;
  };
  privacy: {
    publicProfile: boolean;
    showAnalytics: boolean;
    allowIndexing: boolean;
  };
  dashboard: {
    compactMode: boolean;
    defaultView: 'overview' | 'biolink' | 'urls' | 'analytics';
    showWelcome: boolean;
    autoSave: boolean;
  };
}

interface UserActivity {
  id: string;
  type: 'login' | 'profile_update' | 'link_created' | 'link_clicked' | 'biolink_updated' | 'plan_upgrade';
  description: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

interface UserContextType {
  stats: UserStats;
  preferences: UserPreferences;
  activities: UserActivity[];
  loading: boolean;
  updatePreferences: (updates: Partial<UserPreferences>) => Promise<void>;
  updateNestedPreference: (section: keyof UserPreferences, key: string, value: unknown) => Promise<void>;
  addActivity: (activity: Omit<UserActivity, 'id' | 'timestamp'>) => void;
  clearActivities: () => void;
  exportUserData: () => Promise<void>;
  refreshStats: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

// Mock data inicial
const mockStats: UserStats = {
  totalViews: 2847,
  totalClicks: 1234,
  totalLinks: 12,
  totalBioLinks: 1,
  conversionRate: 43.4,
  monthlyGrowth: 23.5,
  topPerformingLink: 'Instagram',
  lastActive: new Date().toISOString()
};

const mockPreferences: UserPreferences = {
  theme: 'dark',
  language: 'pt-BR',
  timezone: 'America/Sao_Paulo',
  notifications: {
    email: true,
    browser: true,
    marketing: false,
    analytics: true
  },
  privacy: {
    publicProfile: true,
    showAnalytics: false,
    allowIndexing: true
  },
  dashboard: {
    compactMode: false,
    defaultView: 'overview',
    showWelcome: true,
    autoSave: true
  }
};

const mockActivities: UserActivity[] = [
  {
    id: 'activity-1',
    type: 'link_clicked',
    description: 'Link do Instagram foi clicado 5 vezes',
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 min atrás
    metadata: { linkId: 'instagram', clicks: 5 }
  },
  {
    id: 'activity-2',
    type: 'biolink_updated',
    description: 'BioLink foi atualizado com nova bio',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2h atrás
  },
  {
    id: 'activity-3',
    type: 'link_created',
    description: 'Novo link criado: YouTube Channel',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 dia atrás
    metadata: { linkId: 'youtube', title: 'YouTube Channel' }
  }
];

export function UserProvider({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  
  const [userStats, setUserStats] = useLocalStorage<UserStats>('abrev-user-stats', mockStats);
  const [userPreferences, setUserPreferences] = useLocalStorage<UserPreferences>('abrev-user-preferences', mockPreferences);
  const [userActivities, setUserActivities] = useLocalStorage<UserActivity[]>('abrev-user-activities', mockActivities);

  // Atualiza estatísticas quando o usuário faz login
  useEffect(() => {
    if (isAuthenticated && user) {
      refreshStats();
    }
  }, [isAuthenticated, user]);

  const updatePreferences = useCallback(async (updates: Partial<UserPreferences>) => {
    if (!isAuthenticated) return;
    
    setLoading(true);
    try {
      // Simula atualização no servidor
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const updatedPreferences = { ...userPreferences, ...updates };
      setUserPreferences(updatedPreferences);

      // Adiciona atividade
      addActivity({
        type: 'profile_update',
        description: 'Preferências do usuário foram atualizadas'
      });

      toast.success("Preferências atualizadas", {
        description: "Suas configurações foram salvas com sucesso",
      });
    } catch (error) {
      toast.error("Erro ao atualizar preferências", {
        description: "Tente novamente mais tarde",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, userPreferences, setUserPreferences]);

  const updateNestedPreference = useCallback(async (
    section: keyof UserPreferences, 
    key: string, 
    value: unknown
  ) => {
    if (!isAuthenticated) return;
    
    const currentSection = userPreferences[section] as Record<string, unknown>;
    const updatedSection = { ...currentSection, [key]: value };
    
    await updatePreferences({
      [section]: updatedSection
    } as Partial<UserPreferences>);
  }, [isAuthenticated, userPreferences, updatePreferences]);

  const addActivity = useCallback((activity: Omit<UserActivity, 'id' | 'timestamp'>) => {
    if (!isAuthenticated) return;
    
    const newActivity: UserActivity = {
      ...activity,
      id: 'activity-' + Date.now(),
      timestamp: new Date().toISOString()
    };

    setUserActivities(prev => [newActivity, ...prev.slice(0, 49)]); // Mantém apenas os últimos 50
  }, [isAuthenticated, setUserActivities]);

  const clearActivities = useCallback(() => {
    setUserActivities([]);
    toast.info("Atividades limpas", {
      description: "Histórico de atividades foi removido",
    });
  }, [setUserActivities]);

  const exportUserData = useCallback(async () => {
    if (!isAuthenticated || !user) return;
    
    setLoading(true);
    try {
      // Simula preparação dos dados
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const exportData = {
        user,
        stats: userStats,
        preferences: userPreferences,
        activities: userActivities,
        exportDate: new Date().toISOString()
      };

      // Simula download do arquivo
      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `abrev-dados-${user.username}-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success("Dados exportados", {
        description: "Seus dados foram baixados com sucesso",
      });
    } catch (error) {
      toast.error("Erro na exportação", {
        description: "Não foi possível exportar seus dados",
      });
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, user, userStats, userPreferences, userActivities]);

  const refreshStats = useCallback(async () => {
    if (!isAuthenticated) return;
    
    setLoading(true);
    try {
      // Simula busca de estatísticas atualizadas
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Simula dados atualizados com pequenas variações
      const updatedStats: UserStats = {
        ...userStats,
        totalViews: userStats.totalViews + Math.floor(Math.random() * 10),
        totalClicks: userStats.totalClicks + Math.floor(Math.random() * 5),
        lastActive: new Date().toISOString()
      };
      
      setUserStats(updatedStats);
    } catch (error) {
      logger.warn('Erro ao atualizar estatísticas', error);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, userStats, setUserStats]);

  const value: UserContextType = {
    stats: userStats,
    preferences: userPreferences,
    activities: userActivities,
    loading,
    updatePreferences,
    updateNestedPreference,
    addActivity,
    clearActivities,
    exportUserData,
    refreshStats
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser deve ser usado dentro de um UserProvider');
  }
  return context;
}