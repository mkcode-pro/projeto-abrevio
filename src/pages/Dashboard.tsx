import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/dashboard/AppSidebar"
import { QuickActions } from "@/components/dashboard/QuickActions"
import { StatsCards } from "@/components/dashboard/StatsCards"
import { BiolinksGrid } from "@/components/dashboard/BiolinksGrid"
import { UrlShortenerCard } from "@/components/dashboard/UrlShortenerCard"
import { ResponsiveContainer } from "@/components/layout/ResponsiveContainer"
import { ResponsiveGrid } from "@/components/layout/ResponsiveGrid"
import { useIsMobile } from "@/hooks/use-mobile"

// Mock data
const userData = {
  name: "João Silva",
  username: "@joaosilva",
  bio: "Criador de conteúdo digital",
  avatar: "JS"
}

export default function Dashboard() {
  const isMobile = useIsMobile()

  return (
    <div className="min-h-screen">
      {!isMobile ? (
        // Desktop: Layout com sidebar
        <SidebarProvider>
          <div className="flex min-h-screen w-full">
            <AppSidebar />
            <main className="flex-1">
              <ResponsiveContainer size="xl" padding="lg" className="py-8">
                <div className="space-y-8">
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h1 className="text-3xl font-bold text-white mb-2">
                        Bem-vindo, {userData.name}!
                      </h1>
                      <p className="text-white/60">
                        Gerencie seus links e acompanhe o desempenho
                      </p>
                    </div>
                  </div>

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
          <ResponsiveContainer padding="md" className="py-6">
            <div className="space-y-6">
              {/* Header Mobile */}
              <div className="text-center">
                <h1 className="text-2xl font-bold text-white mb-1">
                  Olá, {userData.name.split(' ')[0]}! 👋
                </h1>
                <p className="text-white/60 text-sm">
                  Seus links e estatísticas
                </p>
              </div>

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