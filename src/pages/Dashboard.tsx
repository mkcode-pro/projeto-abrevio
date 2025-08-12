import { StatsCards } from "@/components/dashboard/StatsCards"
import { BiolinksGrid } from "@/components/dashboard/BiolinksGrid"
import { UrlShortenerCard } from "@/components/dashboard/UrlShortenerCard"
import { ResponsiveGrid } from "@/components/layout/ResponsiveGrid"
import { useIsMobile } from "@/store/hooks/use-mobile"
import { useAuth } from "@/store/contexts/AuthContext"
import { Skeleton } from "@/components/ui/skeleton"
import { MobileHeader } from "@/components/mobile/MobileHeader"
import { ResponsiveContainer } from "@/components/layout/ResponsiveContainer"

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

  const content = (
    <div className="space-y-8">
      <StatsCards />
      <ResponsiveGrid cols={{ desktop: 2, tablet: 1, mobile: 1 }} gap="lg">
        <BiolinksGrid />
        <UrlShortenerCard />
      </ResponsiveGrid>
    </div>
  );

  if (isMobile) {
    return (
      <>
        <MobileHeader title="Dashboard" />
        <div className="pt-14">
          <ResponsiveContainer padding="md" className="py-6">
            {content}
          </ResponsiveContainer>
        </div>
      </>
    );
  }

  return content;
}

const DashboardSkeleton = ({ isMobile }: { isMobile: boolean }) => {
  const skeletonContent = (
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
  );

  if (isMobile) {
    return (
      <>
        <Skeleton className="h-14 w-full fixed top-0 left-0 z-50" />
        <div className="pt-14">
          <ResponsiveContainer padding="md" className="py-6">
            {skeletonContent}
          </ResponsiveContainer>
        </div>
      </>
    );
  }

  return skeletonContent;
};