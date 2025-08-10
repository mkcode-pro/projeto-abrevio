import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { AuthChangeEvent, Session, User as SupabaseUser } from '@supabase/supabase-js';

interface User {
  id: string;
  email: string;
  username: string;
  name: string;
  avatar?: string;
  plan: 'free' | 'pro' | 'premium';
  createdAt: string;
  lastLoginAt: string | null;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, username: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<Pick<User, 'name' | 'username' | 'avatar'>>) => Promise<void>;
  changePassword: (newPassword: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserProfile = async (supabaseUser: SupabaseUser): Promise<User | null> => {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', supabaseUser.id)
      .single();

    if (error) {
      console.error("Erro ao buscar perfil do usuário:", error);
      return null;
    }

    return {
      id: supabaseUser.id,
      email: supabaseUser.email || '',
      username: profile.username || '',
      name: profile.name || '',
      avatar: profile.avatar_url || undefined,
      plan: profile.plan || 'free',
      createdAt: supabaseUser.created_at,
      lastLoginAt: supabaseUser.last_sign_in_at,
    };
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event: AuthChangeEvent, session: Session | null) => {
        setLoading(true);
        if (session?.user) {
          const userProfile = await fetchUserProfile(session.user);
          setUser(userProfile);
        } else {
          setUser(null);
        }
        setLoading(false);
      }
    );

    // Verifica a sessão inicial
    const checkInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const userProfile = await fetchUserProfile(session.user);
        setUser(userProfile);
      }
      setLoading(false);
    };

    checkInitialSession();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      toast.error("Erro no login", { description: "Verifique suas credenciais e tente novamente." });
      throw error;
    }
    toast.success("Login realizado com sucesso!");
    setLoading(false);
  }, []);

  const register = useCallback(async (email: string, password: string, username: string, name: string) => {
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          username,
        },
      },
    });
    if (error) {
      toast.error("Erro ao criar conta", { description: "Este email ou usuário já pode estar em uso." });
      throw error;
    }
    toast.success("Conta criada com sucesso!", { description: "Verifique seu email para confirmar a conta." });
    setLoading(false);
  }, []);

  const logout = useCallback(async () => {
    setLoading(true);
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Erro ao sair", { description: "Tente novamente mais tarde." });
      throw error;
    }
    setUser(null);
    toast.info("Você foi desconectado.");
    setLoading(false);
  }, []);

  const updateProfile = useCallback(async (updates: Partial<Pick<User, 'name' | 'username' | 'avatar'>>) => {
    if (!user) return;
    setLoading(true);
    
    const profileUpdates = {
      name: updates.name,
      username: updates.username,
      avatar_url: updates.avatar,
    };

    const { error } = await supabase
      .from('profiles')
      .update(profileUpdates)
      .eq('id', user.id);

    if (error) {
      toast.error("Erro ao atualizar perfil", { description: "Não foi possível salvar as alterações." });
      throw error;
    }

    // Re-fetch user profile to update state
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      const updatedUser = await fetchUserProfile(session.user);
      setUser(updatedUser);
    }

    toast.success("Perfil atualizado com sucesso!");
    setLoading(false);
  }, [user]);

  const changePassword = useCallback(async (newPassword: string) => {
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) {
      toast.error("Erro ao alterar senha", { description: "Tente novamente mais tarde." });
      throw error;
    }
    toast.success("Senha alterada com sucesso!");
    setLoading(false);
  }, []);

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    loading,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
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