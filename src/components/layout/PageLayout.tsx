import { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { useIsMobile } from '@/store/hooks/use-mobile'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { AppSidebar } from '@/components/dashboard/AppSidebar'
import { DashboardHeader } from '@/components/dashboard/DashboardHeader'
import { MobileHeader } from '@/components/mobile/MobileHeader'
import { MobileBottomNav } from '@/components/dashboard/MobileBottomNav'
import { SidebarProvider } from '@/components/ui/sidebar'

interface PageLayoutProps {
  children: ReactNode
  variant?: 'public' | 'auth' | 'dashboard'
  title?: string
  showBackButton?: boolean
  headerActions?: ReactNode
}

export function PageLayout({ 
  children, 
  variant = 'public',
  title,
  showBackButton,
  headerActions
}: PageLayoutProps) {
  const isMobile = useIsMobile()

  if (variant === 'auth') {
    return (
      <div className="min-h-screen w-full bg-gradient-hero flex items-center justify-center p-4">
        {children}
      </div>
    )
  }

  if (variant === 'dashboard') {
    return (
      <SidebarProvider>
        <div className="min-h-screen bg-background">
          {isMobile ? (
            <>
              <MobileHeader title={title || 'Dashboard'} showBackButton={showBackButton} actions={headerActions} />
              <main className="pt-14 pb-20">
                {children}
              </main>
              <MobileBottomNav />
            </>
          ) : (
            <div className="flex min-h-screen w-full">
              <AppSidebar />
              <div className="flex-1 flex flex-col">
                <DashboardHeader />
                <main className="flex-1 p-4 sm:p-6 lg:p-8">
                  {children}
                </main>
              </div>
            </div>
          )}
        </div>
      </SidebarProvider>
    )
  }

  // public variant
  return (
    <div className="min-h-screen flex flex-col bg-gradient-hero">
      <Header />
      <main className="flex-grow pt-16">
        {children}
      </main>
      <Footer />
    </div>
  )
}