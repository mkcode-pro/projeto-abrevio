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
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, username: string, name: string) => Promise<boolean>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<Pick<User, 'name' | 'username' | 'avatar'>>) => Promise<void>;
  changePassword: (newPassword: string) => Promise<void>;
  deleteAccount: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Função para criar perfil automaticamente
const createUserProfile = async (supabaseUser: SupabaseUser, additionalData?: { username?: string; name?: string }) => {
  const { data: existingProfile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', supabaseUser.id)
    .single();

  if (existingProfile) {
    return existingProfile;
  }

  // Criar perfil se não existir
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
    console.error('Erro ao criar perfil:', error);
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
      lastLoginAt: supabaseUser.last_sign_in_at,
    };
  } catch (error) {
    console.error('Erro ao buscar perfil:', error);
    return null;
  }
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar sessão inicial
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const userProfile = await fetchUserProfile(session.user);
        setUser(userProfile);
      }
      setLoading(false);
    };

    getInitialSession();

    // Escutar mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event: AuthChangeEvent, session: Session | null) => {
        console.log('Auth state changed:', event, session?.user?.email);
        
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

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          toast.error("Credenciais inválidas", { 
            description: "Email ou senha incorretos. Verifique e tente novamente." 
          });
        } else {
          toast.error("Erro no login", { description: error.message });
        }
        return false;
      }

      toast.success("Login realizado com sucesso!");
      return true;
    } catch (error: any) {
      console.error('Erro inesperado no login:', error);
      toast.error("Erro inesperado", { description: error.message });
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (email: string, password: string, username: string, name: string): Promise<boolean> => {
    setLoading(true);
    try {
      // Tentar verificar username via RPC primeiro
      let usernameExists = false;
      
      try {
        const { data, error: rpcError } = await supabase.rpc('username_exists', { p_username: username });
        
        if (rpcError) {
          console.warn('RPC username_exists falhou, tentando fallback:', rpcError);
          // Fallback: verificar diretamente na tabela profiles
          const { data: profileData, error: queryError } = await supabase
            .from('profiles')
            .select('username')
            .ilike('username', username)
            .maybeSingle();
          
          if (queryError && queryError.code !== 'PGRST116') {
            throw queryError;
          }
          
          usernameExists = !!profileData;
        } else {
          usernameExists = data as boolean;
        }
      } catch (checkError) {
        console.error('Erro ao verificar username:', checkError);
        // Em caso de erro, permitir continuar mas avisar o usuário
        toast.warning("Não foi possível verificar completamente o username", {
          description: "Continuando com o registro..."
        });
      }

      if (usernameExists) {
        toast.error("Username já existe", { description: "Escolha outro nome de usuário." });
        return false;
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { name, username } },
      });

      if (error) {
        if (error.message.includes('already registered')) {
          toast.error("Email já cadastrado", { description: "Este email já possui uma conta. Tente fazer login." });
        } else {
          toast.error("Erro ao criar conta", { description: error.message });
        }
        return false;
      }

      if (data.user) {
        await createUserProfile(data.user, { username, name });
        return true;
      }
      return false;
    } catch (error: any) {
      console.error('Erro no registro:', error);
      toast.error("Erro inesperado no cadastro", { description: error.message });
      return false;
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
      console.error('Erro no logout:', error);
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
      console.error('Erro ao atualizar perfil:', error);
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
      console.error('Erro ao alterar senha:', error);
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
      console.error('Erro ao deletar conta:', error);
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