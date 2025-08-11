// Configurações centralizadas do ambiente
export const env = {
  // Supabase
  supabase: {
    url: import.meta.env.VITE_SUPABASE_URL || '',
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
  },

  // Desenvolvimento
  dev: {
    autoLogin: import.meta.env.VITE_DEV_AUTO_LOGIN === 'true',
    email: import.meta.env.VITE_DEV_EMAIL || '',
    password: import.meta.env.VITE_DEV_PASSWORD || '',
    username: import.meta.env.VITE_DEV_USERNAME || '',
    name: import.meta.env.VITE_DEV_NAME || '',
  },

  // App
  app: {
    name: import.meta.env.VITE_APP_NAME || 'Abrev.io',
    url: import.meta.env.VITE_APP_URL || 'http://localhost:5173',
    environment: import.meta.env.VITE_ENVIRONMENT || 'development',
  },

  // Debug
  debug: {
    enabled: import.meta.env.VITE_DEBUG === 'true',
    logLevel: import.meta.env.VITE_LOG_LEVEL || 'error',
  },

  // Flags
  isProd: import.meta.env.PROD,
  isDev: import.meta.env.DEV,
} as const;

// Validação básica
const validateEnv = () => {
  if (!env.supabase.url || !env.supabase.anonKey) {
    throw new Error('Variáveis de ambiente do Supabase não configuradas');
  }
};

// Só validar em produção
if (env.isProd) {
  validateEnv();
}