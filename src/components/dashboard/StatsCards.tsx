import { memo } from 'react'
import { Eye, MousePointer, TrendingUp } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { useDashboardStats } from "@/hooks/useDashboardStats"
import { Skeleton } from "@/components/ui/skeleton"

export const StatsCards = memo(function StatsCards() {
  const { data, isLoading } = useDashboardStats();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Skeleton className="h-32 rounded-2xl" />
        <Skeleton className="h-32 rounded-2xl" />
        <Skeleton className="h-32 rounded-2xl" />
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
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {stats.map((stat, index) => (
        <Card key={index} className="glass-card border-white/10 hover:border-neon-blue/50 transition-all">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{stat.title}</p>
                <p className="text-2xl font-bold text-white mt-1 truncate">{stat.value}</p>
                <p className={`text-xs mt-1 ${stat.color}`}>{stat.change}</p>
              </div>
              <div className={`p-3 rounded-xl bg-white/10`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
})