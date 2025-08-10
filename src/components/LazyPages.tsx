import { lazy } from 'react'

// Lazy loading das páginas para melhor performance
// As páginas do painel agora são importadas estaticamente em App.tsx para corrigir problemas do servidor de desenvolvimento.
export const Pricing = lazy(() => import('@/pages/Pricing'))
export const BioLink = lazy(() => import('@/pages/BioLink'))
export const NotFound = lazy(() => import('@/pages/NotFound'))