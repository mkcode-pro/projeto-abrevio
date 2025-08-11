import { useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const DEV_USER_EMAIL = 'teste@abrev.io';
const DEV_USER_PASS = 'Teste@123';
const DEV_USERNAME = 'devtester';
const DEV_NAME = 'Dev Tester';

export function DevAutoLogin() {
  if (import.meta.env.PROD) {
    return null;
  }

  const { login, register, isAuthenticated, loading } = useAuth();
  const setupAttempted = useRef(false);

  useEffect(() => {
    const autoSetup = async () => {
      console.log('DEV: Iniciando auto-setup do usuário de teste...');
      
      // Tenta fazer login silenciosamente
      const loginResult = await login(DEV_USER_EMAIL, DEV_USER_PASS, true);

      // Se o login falhar por credenciais inválidas (usuário não existe ou senha errada)
      if (!loginResult.success && loginResult.error?.includes('Invalid login credentials')) {
        console.log('DEV: Login falhou. Tentando registrar o usuário de teste...');
        
        // Tenta registrar o usuário silenciosamente
        const registerResult = await register(DEV_USER_EMAIL, DEV_USER_PASS, DEV_USERNAME, DEV_NAME, true);
        
        if (registerResult.success) {
          console.log('DEV: Usuário de teste criado com sucesso. O login ocorrerá automaticamente.');
          // O onAuthStateChange vai cuidar do login agora
        } else if (registerResult.error?.includes('already registered')) {
          console.error('DEV: O usuário de teste existe, mas a senha está incorreta. Não é possível fazer o auto-login.');
          toast.error("Falha no Auto-Login (DEV)", {
            description: "A senha do usuário de teste está incorreta. Por favor, delete o usuário 'teste@abrev.io' do seu Supabase e recarregue a página."
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