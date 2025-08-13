import { StatsCards } from "@/components/dashboard/StatsCards"
import { BiolinksGrid } from "@/components/dashboard/BiolinksGrid"
import { UrlShortenerCard } from "@/components/dashboard/UrlShortenerCard"
import { useIsMobile } from "@/store/hooks/use-mobile"
import { useAuth } from "@/store/contexts/AuthContext"
import { Skeleton } from "@/components/ui/skeleton"
import { MobileHeader } from "@/components/mobile/MobileHeader"
import { PageContainer } from "@/components/layout/PageContainer"
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
    <PageContainer size="xl">
      <div className="space-y-4 sm:space-y-6 lg:space-y-8">
        <StatsCards />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          <div className="lg:col-span-2 order-2 lg:order-1">
            <BiolinksGrid />
          </div>
          <div className="order-1 lg:order-2">
            <UrlShortenerCard />
          </div>
        </div>
      </div>
    </PageContainer>
  );

  if (isMobile) {
    return (
      <>
        <MobileHeader title="Dashboard" />
        <div className="pt-14 pb-20">
          {content}
        </div>
      </>
    );
  }

  return content;
}

const DashboardSkeleton = ({ isMobile }: { isMobile: boolean }) => {
  const skeletonContent = (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
        <Skeleton className="h-24 sm:h-28 md:h-32 rounded-xl" />
        <Skeleton className="h-24 sm:h-28 md:h-32 rounded-xl" />
        <Skeleton className="h-24 sm:h-28 md:h-32 rounded-xl hidden sm:block" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
        <div className="lg:col-span-2 order-2 lg:order-1">
          <Skeleton className="h-64 sm:h-80 md:h-96 rounded-xl" />
        </div>
        <div className="order-1 lg:order-2">
          <Skeleton className="h-48 sm:h-64 lg:h-96 rounded-xl" />
        </div>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <>
        <Skeleton className="h-14 w-full fixed top-0 left-0 z-50" />
        <div className="pt-14 pb-20">
          <ResponsiveContainer padding="sm" className="py-4 sm:py-6">
            {skeletonContent}
          </ResponsiveContainer>
        </div>
      </>
    );
  }

  return skeletonContent;
};