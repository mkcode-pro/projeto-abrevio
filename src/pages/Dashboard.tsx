import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/dashboard/AppSidebar"
import { QuickActions } from "@/components/dashboard/QuickActions"
import { StatsCards } from "@/components/dashboard/StatsCards"
import { BiolinksGrid } from "@/components/dashboard/BiolinksGrid"
import { UrlShortenerCard } from "@/components/dashboard/UrlShortenerCard"
import { ResponsiveContainer } from "@/components/layout/ResponsiveContainer"
import { ResponsiveGrid } from "@/components/layout/ResponsiveGrid"
import { useIsMobile } from "@/hooks/use-mobile"
import { useAuth } from "@/contexts/AuthContext"
import { Skeleton } from "@/components/ui/skeleton"
import { DashboardHeader } from "@/components/dashboard/DashboardHeader"

export default function Dashboard() {
  const isMobile = useIsMobile()
  const { user, loading } = useAuth()

  if (loading) {
    return <DashboardSkeleton isMobile={isMobile} />
  }

  if (!user) {
    // Idealmente, o usuário seria redirecionado para o login por uma rota protegida
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-white">Por favor, faça login para acessar o dashboard.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {!isMobile ? (
        // Desktop: Layout com sidebar
        <SidebarProvider>
          <div className="flex min-h-screen w-full">
            <AppSidebar />
            <main className="flex-1">
              <DashboardHeader />
              <ResponsiveContainer size="xl" padding="lg" className="py-8">
                <div className="space-y-8">
                  <QuickActions />
                  <StatsCards />
                  
                  <ResponsiveGrid cols={{ desktop: 2, tablet: 1, mobile: 1 }} gap="lg">
                    <BiolinksGrid />
                    <UrlShortenerCard />
                  </ResponsiveGrid>
                </div>
              </ResponsiveContainer>
            </main>
          </div>
        </SidebarProvider>
      ) : (
        // Mobile: Layout otimizado
        <div className="min-h-screen">
          <DashboardHeader />
          <ResponsiveContainer padding="md" className="py-6">
            <div className="space-y-6">
              {/* Cards principais em grid otimizado */}
              <StatsCards />
              
              {/* Bio Links */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-white">Suas Bio Pages</h2>
                <BiolinksGrid />
              </div>
              
              {/* URL Shortener */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-white">Encurtador de Links</h2>
                <UrlShortenerCard />
              </div>
            </div>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}

// Componente de Skeleton para o estado de carregamento
const DashboardSkeleton = ({ isMobile }: { isMobile: boolean }) => (
  <div className="min-h-screen">
    {!isMobile ? (
      <div className="flex min-h-screen w-full">
        <Skeleton className="w-14 hidden md:block" /> {/* Sidebar Skeleton */}
        <main className="flex-1">
          <Skeleton className="h-16 w-full" /> {/* Header Skeleton */}
          <ResponsiveContainer size="xl" padding="lg" className="py-8">
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Skeleton className="h-24" />
                <Skeleton className="h-24" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Skeleton className="h-32" />
                <Skeleton className="h-32" />
                <Skeleton className="h-32" />
              </div>
              <ResponsiveGrid cols={{ desktop: 2, tablet: 1, mobile: 1 }} gap="lg">
                <Skeleton className="h-96" />
                <Skeleton className="h-96" />
              </ResponsiveGrid>
            </div>
          </ResponsiveContainer>
        </main>
      </div>
    ) : (
      <>
        <Skeleton className="h-14 w-full" /> {/* Header Skeleton */}
        <ResponsiveContainer padding="md" className="py-6">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Skeleton className="h-32" />
              <Skeleton className="h-32" />
              <Skeleton className="h-32" />
            </div>
            <Skeleton className="h-64" />
            <Skeleton className="h-96" />
          </div>
        </ResponsiveContainer>
      </>
    )}
  </div>
);