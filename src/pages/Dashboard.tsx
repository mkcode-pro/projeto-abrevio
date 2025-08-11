import { StatsCards } from "@/components/dashboard/StatsCards"
import { BiolinksGrid } from "@/components/dashboard/BiolinksGrid"
import { UrlShortenerCard } from "@/components/dashboard/UrlShortenerCard"
import { ResponsiveContainer } from "@/components/layout/ResponsiveContainer"
import { ResponsiveGrid } from "@/components/layout/ResponsiveGrid"
import { useIsMobile } from "@/store/hooks/use-mobile"
import { useAuth } from "@/store/contexts/AuthContext"
import { Skeleton } from "@/components/ui/skeleton"
import { MobileHeader } from "@/components/mobile/MobileHeader"

export default function Dashboard() {
  const isMobile = useIsMobile()
  const { user, loading } = useAuth()

  if (loading) {
    return <DashboardSkeleton isMobile={isMobile} />
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-white">Por favor, faça login para acessar o dashboard.</p>
      </div>
    )
  }

  return (
    <>
      {isMobile && <MobileHeader title="Dashboard" />}
      <div className={isMobile ? "pt-14" : ""}>
        <ResponsiveContainer size="xl" padding="lg" className="py-8">
          <div className="space-y-8">
            <StatsCards />
            <ResponsiveGrid cols={{ desktop: 2, tablet: 1, mobile: 1 }} gap="lg">
              <BiolinksGrid />
              <UrlShortenerCard />
            </ResponsiveGrid>
          </div>
        </ResponsiveContainer>
      </div>
    </>
  )
}

const DashboardSkeleton = ({ isMobile }: { isMobile: boolean }) => (
  <>
    {isMobile && <Skeleton className="h-14 w-full fixed top-0 left-0 z-50" />}
    <div className={isMobile ? "pt-14" : ""}>
      <ResponsiveContainer padding="lg" className="py-8">
        <div className="space-y-8">
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
    </div>
  </>
);