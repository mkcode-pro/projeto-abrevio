import { memo } from 'react'
import { Eye, MousePointer, TrendingUp } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const stats = [
  { 
    title: "Visualizações Totais", 
    value: "2.540", 
    icon: Eye, 
    change: "+12% vs mês anterior",
    color: "text-neon-blue"
  },
  { 
    title: "Cliques Totais", 
    value: "1.821", 
    icon: MousePointer, 
    change: "+8% vs mês anterior",
    color: "text-emerald-400"
  },
  { 
    title: "Top Link", 
    value: "WhatsApp", 
    icon: TrendingUp, 
    change: "1.234 cliques",
    color: "text-violet-400"
  },
]

export const StatsCards = memo(function StatsCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {stats.map((stat, index) => (
        <Card key={index} className="glass-card border-white/10 hover:border-neon-blue/50 transition-all">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{stat.title}</p>
                <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
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