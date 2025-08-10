import { lazy } from 'react'

// Lazy loading das páginas para melhor performance
export const Dashboard = lazy(() => import('@/pages/Dashboard'))
export const BioLinkEditor = lazy(() => import('@/pages/BioLinkEditor'))
export const Analytics = lazy(() => import('@/pages/Analytics'))
export const Settings = lazy(() => import('@/pages/Settings'))
export const Pricing = lazy(() => import('@/pages/Pricing'))
export const BioLink = lazy(() => import('@/pages/BioLink'))
export const NotFound = lazy(() => import('@/pages/NotFound'))