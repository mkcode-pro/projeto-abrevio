import { useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { env } from '@/config/environment';
import { logger } from '@/lib/logger';

export function DevAutoLogin() {
  // Só funciona em desenvolvimento E se estiver habilitado
  if (env.isProd || !env.dev.autoLogin) {
    return null;
  }

  const { login, register, isAuthenticated, loading } = useAuth();
  const setupAttempted = useRef(false);

  useEffect(() => {
    const autoSetup = async () => {
      logger.dev('Iniciando auto-setup do usuário de teste');
      
      // Tenta fazer login silenciosamente
      const loginResult = await login(env.dev.email, env.dev.password, true);

      // Se o login falhar por credenciais inválidas (usuário não existe ou senha errada)
      if (!loginResult.success && loginResult.error?.includes('Invalid login credentials')) {
        logger.dev('Login falhou. Tentando registrar o usuário de teste');
        
        // Tenta registrar o usuário silenciosamente
        const registerResult = await register(env.dev.email, env.dev.password, env.dev.username, env.dev.name, true);
        
        if (registerResult.success) {
          logger.dev('Usuário de teste criado com sucesso. O login ocorrerá automaticamente');
          // O onAuthStateChange vai cuidar do login agora
        } else if (registerResult.error?.includes('already registered')) {
          logger.error('Usuário de teste existe, mas a senha está incorreta');
          toast.error("Falha no Auto-Login (DEV)", {
            description: `A senha do usuário de teste está incorreta. Por favor, delete o usuário '${env.dev.email}' do seu Supabase e recarregue a página.`
          });
        }
      }
    };

    if (!loading && !isAuthenticated && !setupAttempted.current) {
      setupAttempted.current = true;
      autoSetup();
    }
  }, [isAuthenticated, loading, login, register]);

  return null;
}