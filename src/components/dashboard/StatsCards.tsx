import { memo } from 'react'
import { Eye, MousePointer, TrendingUp } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { useDashboardStats } from "@/store/hooks/useDashboardStats"
import { Skeleton } from "@/components/ui/skeleton"

export const StatsCards = memo(function StatsCards() {
  const { data, isLoading } = useDashboardStats();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
        <Skeleton className="h-24 sm:h-28 lg:h-32 rounded-xl" />
        <Skeleton className="h-24 sm:h-28 lg:h-32 rounded-xl" />
        <Skeleton className="h-24 sm:h-28 lg:h-32 rounded-xl hidden sm:block md:block" />
      </div>
    );
  }

  const stats = [
    { 
      title: "Visualizações Totais", 
      value: data?.totalViews?.toLocaleString() || "0", 
      icon: Eye, 
      change: "Desde o início",
      color: "text-neon-blue"
    },
    { 
      title: "Cliques Totais", 
      value: data?.totalClicks?.toLocaleString() || "0", 
      icon: MousePointer, 
      change: "Em todos os links",
      color: "text-emerald-400"
    },
    { 
      title: "Top Link", 
      value: data?.topLink || "N/A", 
      icon: TrendingUp, 
      change: "Mais popular",
      color: "text-violet-400"
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
      {stats.map((stat, index) => (
        <Card key={index} className="glass-card border-white/10 hover:border-neon-blue/50 transition-all">
          <CardContent className="p-4 sm:p-5 lg:p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm text-muted-foreground">{stat.title}</p>
                <p className="text-xl sm:text-2xl font-bold text-white mt-1 truncate">{stat.value}</p>
                <p className={`text-[0.65rem] sm:text-xs mt-1 ${stat.color}`}>{stat.change}</p>
              </div>
              <div className={`p-2 sm:p-2.5 lg:p-3 rounded-lg sm:rounded-xl bg-white/10`}>
                <stat.icon className={`h-5 w-5 sm:h-6 sm:w-6 ${stat.color}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
})