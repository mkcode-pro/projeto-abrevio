/// <reference types="vite/client" />

interface ImportMetaEnv {
  VITE_SUPABASE_URL: string
  VITE_SUPABASE_ANON_KEY: string
  VITE_DEV_AUTO_LOGIN: string
  VITE_DEV_EMAIL: string
  VITE_DEV_PASSWORD: string
  VITE_DEV_USERNAME: string
  VITE_DEV_NAME: string
  VITE_APP_NAME: string
  VITE_APP_URL: string
  VITE_ENVIRONMENT: string
  VITE_DEBUG: string
  VITE_LOG_LEVEL: string
  [key: string]: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}