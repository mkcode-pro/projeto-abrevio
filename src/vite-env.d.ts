/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_ANON_KEY: string
  readonly VITE_DEV_AUTO_LOGIN: string
  readonly VITE_DEV_EMAIL: string
  readonly VITE_DEV_PASSWORD: string
  readonly VITE_DEV_USERNAME: string
  readonly VITE_DEV_NAME: string
  readonly VITE_APP_NAME: string
  readonly VITE_APP_URL: string
  readonly VITE_ENVIRONMENT: string
  readonly VITE_DEBUG: string
  readonly VITE_LOG_LEVEL: string
  readonly MODE: string
  readonly DEV: boolean
  readonly PROD: boolean
  readonly SSR: boolean
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}