import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { AuthChangeEvent, Session, User as SupabaseUser } from '@supabase/supabase-js';
import { logger } from '@/lib/logger';

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

interface AuthResult {
  success: boolean;
  error?: string;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string, silent?: boolean) => Promise<AuthResult>;
  register: (email: string, password: string, username: string, name: string, silent?: boolean) => Promise<AuthResult>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<Pick<User, 'name' | 'username' | 'avatar'>>) => Promise<void>;
  changePassword: (newPassword: string) => Promise<void>;
  deleteAccount: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const createUserProfile = async (supabaseUser: SupabaseUser, additionalData?: { username?: string; name?: string }) => {
  const { data: existingProfile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', supabaseUser.id)
    .single();

  if (existingProfile) {
    return existingProfile;
  }

  const profileData = {
    id: supabaseUser.id,
    email: supabaseUser.email!,
    username: additionalData?.username || supabaseUser.email!.split('@')[0],
    name: additionalData?.name || supabaseUser.user_metadata?.name || 'Usuário',
    plan: 'free' as const,
  };

  const { data: newProfile, error } = await supabase
    .from('profiles')
    .insert(profileData)
    .select()
    .single();

  if (error) {
    logger.error('Erro ao criar perfil', error);
    throw error;
  }

  return newProfile;
};

const fetchUserProfile = async (supabaseUser: SupabaseUser): Promise<User | null> => {
  try {
    const profile = await createUserProfile(supabaseUser);

    return {
      id: supabaseUser.id,
      email: supabaseUser.email || '',
      username: profile.username || '',
      name: profile.name || '',
      avatar: profile.avatar_url || undefined,
      plan: profile.plan || 'free',
      createdAt: supabaseUser.created_at,
      lastLoginAt: supabaseUser.last_sign_in_at ?? null,
    };
  } catch (error) {
    logger.error('Erro ao buscar perfil', error);
    return null;
  }
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const userProfile = await fetchUserProfile(session.user);
          setUser(userProfile);
        }
      } catch (error) {
        logger.error("Erro ao buscar sessão inicial", error);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event: AuthChangeEvent, session: Session | null) => {
        if (session?.user) {
          const userProfile = await fetchUserProfile(session.user);
          setUser(userProfile);
        } else {
          setUser(null);
        }
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = useCallback(async (email: string, password: string, silent = false): Promise<AuthResult> => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        if (!silent) {
          if (error.message.includes('Invalid login credentials')) {
            toast.error("Credenciais inválidas", { 
              description: "Email ou senha incorretos. Verifique e tente novamente." 
            });
          } else {
            toast.error("Erro no login", { description: error.message });
          }
        }
        return { success: false, error: error.message };
      }

      if (!silent) toast.success("Login realizado com sucesso!");
      return { success: true };
    } catch (error: any) {
      logger.error('Erro inesperado no login', error);
      if (!silent) toast.error("Erro inesperado", { description: error.message });
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (email: string, password: string, username: string, name: string, silent = false): Promise<AuthResult> => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { name, username } },
      });

      if (error) {
        if (!silent) {
          if (error.message.includes('already registered')) {
            toast.error("Email já cadastrado", { description: "Este email já possui uma conta. Tente fazer login." });
          } else {
            toast.error("Erro ao criar conta", { description: error.message });
          }
        }
        return { success: false, error: error.message };
      }

      if (data.user) {
        await createUserProfile(data.user, { username, name });
        return { success: true };
      }
      return { success: false, error: 'Usuário não foi criado.' };
    } catch (error: any) {
      logger.error('Erro no registro', error);
      if (!silent) toast.error("Erro inesperado no cadastro", { description: error.message });
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        toast.error("Erro ao sair", { description: error.message });
        throw error;
      }
      setUser(null);
      toast.info("Você foi desconectado.");
    } catch (error) {
      logger.error('Erro no logout', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProfile = useCallback(async (updates: Partial<Pick<User, 'name' | 'username' | 'avatar'>>) => {
    if (!user) return;
    setLoading(true);
    try {
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
        toast.error("Erro ao atualizar perfil", { description: error.message });
        throw error;
      }

      setUser(prev => prev ? { ...prev, ...updates } : null);
      toast.success("Perfil atualizado com sucesso!");
    } catch (error) {
      logger.error('Erro ao atualizar perfil', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [user]);

  const changePassword = useCallback(async (newPassword: string) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) {
        toast.error("Erro ao alterar senha", { description: error.message });
        throw error;
      }
      toast.success("Senha alterada com sucesso!");
    } catch (error) {
      logger.error('Erro ao alterar senha', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteAccount = useCallback(async () => {
    setLoading(true);
    try {
      const { error } = await supabase.rpc('delete_user_account');
      if (error) {
        toast.error("Erro ao deletar conta", { description: error.message });
        throw error;
      }
      setUser(null);
      toast.success("Sua conta foi deletada com sucesso.");
    } catch (error) {
      logger.error('Erro ao deletar conta', error);
      throw error;
    } finally {
      setLoading(false);
    }
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
    deleteAccount,
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