import { ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import { useIsMobile } from '@/store/hooks/use-mobile'
import { MobileBottomNav } from '@/components/dashboard/MobileBottomNav'
import { cn } from '@/lib/utils'

interface AppLayoutProps {
  children: ReactNode
  className?: string
}

// Páginas que não devem ter as barras de navegação
const publicPages = ['/', '/pricing', '/demo', '/login', '/signup']

export function AppLayout({ children, className }: AppLayoutProps) {
  const location = useLocation()
  const isMobile = useIsMobile()
  const currentPath = location.pathname

  // Verificar se é uma página pública
  const isPublicPage = publicPages.includes(currentPath)
  
  // Verificar se é uma página de bio link ou de redirecionamento
  const isSpecialPage = currentPath.startsWith('/bio/') || currentPath.startsWith('/r/')
  
  // Não aplicar layout para páginas públicas ou especiais
  if (isPublicPage || isSpecialPage) {
    return <>{children}</>
  }

  return (
    <div className={cn(
      "min-h-screen bg-gradient-hero overflow-x-hidden",
      isMobile && "pb-20", // Espaço para barra inferior fixa no mobile
      className
    )}>
      {/* Conteúdo Principal */}
      <main className="min-h-screen">
        {children}
      </main>

      {/* Barra Inferior (apenas mobile) */}
      {isMobile && <MobileBottomNav />}
    </div>
  )
}