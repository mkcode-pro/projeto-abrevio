import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

// --- ATENÇÃO ---
// Este componente SÓ funciona em ambiente de DESENVOLVIMENTO.
// Ele é automaticamente removido na versão final do site (produção).

// Credenciais do usuário de teste para login automático
const DEV_USER_EMAIL = 'teste@abrev.io';
const DEV_USER_PASS = 'Teste@123';

export function DevAutoLogin() {
  // Se estivermos em produção, este componente não faz nada.
  if (import.meta.env.PROD) {
    return null;
  }

  const { login, isAuthenticated, loading } = useAuth();

  useEffect(() => {
    // Função para tentar o login automático
    const autoLogin = async () => {
      console.log('DEV: Tentando auto-login...');
      await login(DEV_USER_EMAIL, DEV_USER_PASS);
    };

    // Só tenta fazer login se não estiver carregando e se o usuário ainda não estiver logado.
    if (!loading && !isAuthenticated) {
      autoLogin();
    }
  }, [isAuthenticated, loading, login]);

  // Este componente não renderiza nada na tela.
  return null;
}