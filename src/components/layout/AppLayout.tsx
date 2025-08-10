import { ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import { useIsMobile } from '@/hooks/use-mobile'
import { MobileHeader } from '@/components/mobile/MobileHeader'
import { MobileBottomNav } from '@/components/dashboard/MobileBottomNav'
import { DesktopHeader } from '@/components/layout/DesktopHeader'
import { cn } from '@/lib/utils'

interface AppLayoutProps {
  children: ReactNode
  className?: string
}

// Páginas que não devem ter as barras de navegação
const publicPages = ['/', '/pricing', '/demo']

// Configurações específicas por rota
const routeConfigs: Record<string, {
  title: string
  subtitle?: string
  showBack?: boolean
  showSettings?: boolean
}> = {
  '/dashboard': {
    title: 'Dashboard',
    subtitle: 'Sua central de controle',
    showBack: false,
    showSettings: true
  },
  '/dashboard/editor': {
    title: 'Editor de Bio',
    subtitle: 'Edite sua página de links',
    showBack: true,
    showSettings: true
  },
  '/dashboard/analytics': {
    title: 'Analytics',
    subtitle: 'Acompanhe seu desempenho',
    showBack: true,
    showSettings: false
  },
  '/dashboard/settings': {
    title: 'Configurações',
    subtitle: 'Gerencie sua conta',
    showBack: true,
    showSettings: false
  }
}

export function AppLayout({ children, className }: AppLayoutProps) {
  const location = useLocation()
  const isMobile = useIsMobile()
  const currentPath = location.pathname

  // Verificar se é uma página pública
  const isPublicPage = publicPages.includes(currentPath)
  
  // Verificar se é uma página de bio link (/bio/:username)
  const isBioPage = currentPath.startsWith('/bio/')
  
  // Não aplicar layout para páginas públicas ou bio pages
  if (isPublicPage || isBioPage) {
    return <>{children}</>
  }

  // Configuração da página atual
  const routeConfig = routeConfigs[currentPath] || {
    title: 'Abrev.io',
    showBack: true,
    showSettings: false
  }

  return (
    <div className={cn(
      "min-h-screen bg-gradient-hero overflow-x-hidden",
      isMobile && "pt-16 pb-20", // Espaço para barras fixas mobile
      !isMobile && "pt-16", // Apenas barra superior no desktop
      className
    )}>
      {/* Barra Superior */}
      {isMobile ? (
        <MobileHeader
          title={routeConfig.title}
          subtitle={routeConfig.subtitle}
          showBack={routeConfig.showBack}
          showSettings={routeConfig.showSettings}
        />
      ) : (
        <DesktopHeader />
      )}

      {/* Conteúdo Principal */}
      <main className="min-h-[calc(100vh-4rem)] overflow-x-hidden">
        {children}
      </main>

      {/* Barra Inferior (apenas mobile) */}
      {isMobile && <MobileBottomNav />}
    </div>
  )
}