import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { toast } from '@/hooks/use-toast';

interface User {
  id: string;
  email: string;
  username: string;
  name: string;
  avatar?: string;
  plan: 'free' | 'pro' | 'premium';
  createdAt: string;
  lastLoginAt: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  isFirstLogin: boolean;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  register: (email: string, password: string, username: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  deleteAccount: () => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user para desenvolvimento
const mockUser: User = {
  id: 'user-123',
  email: 'joao@exemplo.com',
  username: 'joaosilva',
  name: 'João Silva',
  avatar: '/placeholder.svg',
  plan: 'pro',
  createdAt: '2024-01-15T10:00:00Z',
  lastLoginAt: new Date().toISOString()
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authData, setAuthData] = useLocalStorage<{
    user: User | null;
    token: string | null;
    isFirstLogin: boolean;
  }>('abrev-auth', {
    user: null,
    token: null,
    isFirstLogin: false
  });

  const [loading, setLoading] = useState(false);

  // Simula autenticação automática ao carregar
  useEffect(() => {
    if (authData.token && !authData.user) {
      // Em um app real, validaria o token aqui
      setAuthData(prev => ({
        ...prev,
        user: mockUser
      }));
    }
  }, [authData.token, authData.user, setAuthData]);

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    try {
      // Simula chamada de API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (email === 'demo@abrev.io' && password === 'demo123') {
        const token = 'mock-jwt-token-' + Date.now();
        const user = { ...mockUser, email, lastLoginAt: new Date().toISOString() };
        
        setAuthData({
          user,
          token,
          isFirstLogin: false
        });

        toast({
          title: "Login realizado com sucesso!",
          description: `Bem-vindo de volta, ${user.name}`,
        });
      } else {
        throw new Error('Credenciais inválidas');
      }
    } catch (error) {
      toast({
        title: "Erro no login",
        description: error instanceof Error ? error.message : "Verifique suas credenciais",
        variant: "destructive"
      });
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setAuthData]);

  const loginWithGoogle = useCallback(async () => {
    setLoading(true);
    try {
      // Simula login com Google
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const token = 'mock-google-token-' + Date.now();
      const user = { 
        ...mockUser, 
        email: 'joao.google@gmail.com',
        name: 'João Silva (Google)',
        lastLoginAt: new Date().toISOString() 
      };
      
      setAuthData({
        user,
        token,
        isFirstLogin: false
      });

      toast({
        title: "Login com Google realizado!",
        description: `Bem-vindo, ${user.name}`,
      });
    } catch (error) {
      toast({
        title: "Erro no login com Google",
        description: "Tente novamente mais tarde",
        variant: "destructive"
      });
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setAuthData]);

  const register = useCallback(async (
    email: string, 
    password: string, 
    username: string, 
    name: string
  ) => {
    setLoading(true);
    try {
      // Simula registro
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      const token = 'mock-register-token-' + Date.now();
      const user: User = {
        id: 'user-' + Date.now(),
        email,
        username,
        name,
        plan: 'free',
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString()
      };
      
      setAuthData({
        user,
        token,
        isFirstLogin: true
      });

      toast({
        title: "Conta criada com sucesso!",
        description: `Bem-vindo ao Abrev.io, ${name}!`,
      });
    } catch (error) {
      toast({
        title: "Erro ao criar conta",
        description: "Tente novamente mais tarde",
        variant: "destructive"
      });
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setAuthData]);

  const logout = useCallback(async () => {
    setLoading(true);
    try {
      // Simula logout
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setAuthData({
        user: null,
        token: null,
        isFirstLogin: false
      });

      toast({
        title: "Logout realizado",
        description: "Você foi desconectado com sucesso",
      });
    } catch (error) {
      toast({
        title: "Erro no logout",
        description: "Tente novamente",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [setAuthData]);

  const updateProfile = useCallback(async (updates: Partial<User>) => {
    if (!authData.user) return;
    
    setLoading(true);
    try {
      // Simula atualização do perfil
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const updatedUser = { ...authData.user, ...updates };
      setAuthData(prev => ({
        ...prev,
        user: updatedUser
      }));

      toast({
        title: "Perfil atualizado",
        description: "Suas informações foram salvas com sucesso",
      });
    } catch (error) {
      toast({
        title: "Erro ao atualizar perfil",
        description: "Tente novamente mais tarde",
        variant: "destructive"
      });
      throw error;
    } finally {
      setLoading(false);
    }
  }, [authData.user, setAuthData]);

  const deleteAccount = useCallback(async () => {
    setLoading(true);
    try {
      // Simula exclusão da conta
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setAuthData({
        user: null,
        token: null,
        isFirstLogin: false
      });

      toast({
        title: "Conta excluída",
        description: "Sua conta foi excluída permanentemente",
      });
    } catch (error) {
      toast({
        title: "Erro ao excluir conta",
        description: "Tente novamente mais tarde",
        variant: "destructive"
      });
      throw error;
    } finally {
      setLoading(false);
    }
  }, [setAuthData]);

  const changePassword = useCallback(async (
    currentPassword: string, 
    newPassword: string
  ) => {
    setLoading(true);
    try {
      // Simula mudança de senha
      await new Promise(resolve => setTimeout(resolve, 800));
      
      toast({
        title: "Senha alterada",
        description: "Sua senha foi alterada com sucesso",
      });
    } catch (error) {
      toast({
        title: "Erro ao alterar senha",
        description: "Verifique sua senha atual",
        variant: "destructive"
      });
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshUser = useCallback(async () => {
    if (!authData.user) return;
    
    setLoading(true);
    try {
      // Simula refresh dos dados do usuário
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const refreshedUser = { 
        ...authData.user, 
        lastLoginAt: new Date().toISOString() 
      };
      setAuthData(prev => ({
        ...prev,
        user: refreshedUser
      }));
    } catch (error) {
      console.warn('Erro ao atualizar dados do usuário:', error);
    } finally {
      setLoading(false);
    }
  }, [authData.user, setAuthData]);

  const value: AuthContextType = {
    user: authData.user,
    isAuthenticated: !!authData.user && !!authData.token,
    loading,
    isFirstLogin: authData.isFirstLogin,
    login,
    loginWithGoogle,
    register,
    logout,
    updateProfile,
    deleteAccount,
    changePassword,
    refreshUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}