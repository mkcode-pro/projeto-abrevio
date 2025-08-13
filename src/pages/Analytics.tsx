import { useState } from "react"
import { 
  TrendingUp, 
  Eye, 
  MousePointer, 
  Calendar, 
  Download, 
  ArrowUpRight, 
  Filter,
  Loader2
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer as RechartsResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { useAnalytics } from "@/store/hooks/useAnalytics"
import { Skeleton } from "@/components/ui/skeleton"
import { getIconById } from "@/components/biolink-editor/IconLibrary"
import { useIsMobile } from "@/store/hooks/use-mobile"
import { MobileHeader } from "@/components/mobile/MobileHeader"
import { PageContainer } from "@/components/layout/PageContainer"

function MetricCard({ title, value, change, icon: Icon, suffix = "" }: {
  title: string
  value: number | string
  change: number
  icon: any
  suffix?: string
}) {
  const isPositive = change >= 0
  
  return (
    <Card className="glass-card border-white/20 hover:border-neon-blue/50 transition-all">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-white/60 mb-1">{title}</p>
            <p className="text-3xl font-bold text-white">
              {typeof value === 'number' ? value.toLocaleString() : value}
              {suffix}
            </p>
            <div className="flex items-center gap-1 mt-2">
              <ArrowUpRight className={`w-4 h-4 ${isPositive ? 'text-emerald-400' : 'text-red-400'}`} />
              <span className={`text-sm font-medium ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
                {Math.abs(change)}%
              </span>
              <span className="text-xs text-white/50">vs período anterior</span>
            </div>
          </div>
          <div className="p-3 rounded-xl bg-gradient-neon">
            <Icon className="w-6 h-6 text-black" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function CustomTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card border border-white/20 p-3 rounded-lg">
        <p className="text-white font-medium">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: {entry.value.toLocaleString()}
          </p>
        ))}
      </div>
    )
  }
  return null
}

const PIE_COLORS = ['#00B8FF', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444'];

export default function Analytics() {
  const [period, setPeriod] = useState<'7d' | '30d' | '90d'>('7d')
  const { metrics, isLoading, exportData, isExporting } = useAnalytics(period)
  const isMobile = useIsMobile()

  const periodLabels = {
    '7d': 'Últimos 7 dias',
    '30d': 'Últimos 30 dias',
    '90d': 'Últimos 90 dias'
  }

  const content = (
    <PageContainer size="xl">
      <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {!isMobile && (
          <div>
            <h1 className="text-3xl font-bold text-white">Analytics</h1>
            <p className="text-white/60 mt-1">Acompanhe a performance dos seus links</p>
          </div>
        )}
        
        <div className="flex flex-col sm:flex-row gap-3">
          <Select value={period} onValueChange={(value: '7d' | '30d' | '90d') => setPeriod(value)}>
            <SelectTrigger className="w-full sm:w-48 bg-white/5 border-white/20 text-white">
              <Calendar className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="glass-card border-white/20">
              <SelectItem value="7d">{periodLabels['7d']}</SelectItem>
              <SelectItem value="30d">{periodLabels['30d']}</SelectItem>
              <SelectItem value="90d">{periodLabels['90d']}</SelectItem>
            </SelectContent>
          </Select>
          
          <Button 
            onClick={() => exportData('csv')}
            variant="outline" 
            className="border-white/20 text-white hover:bg-white/10"
            disabled={isExporting}
          >
            {isExporting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Download className="w-4 h-4 mr-2" />}
            {isExporting ? 'Exportando...' : 'Exportar CSV'}
          </Button>
        </div>
      </div>

      {isLoading ? <AnalyticsContentSkeleton /> : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <MetricCard title="Visualizações" value={metrics.totalViews} change={metrics.viewsChange} icon={Eye} />
            <MetricCard title="Cliques" value={metrics.totalClicks} change={metrics.clicksChange} icon={MousePointer} />
            <MetricCard title="Taxa de Cliques" value={metrics.ctr.toFixed(2)} change={metrics.ctrChange} icon={TrendingUp} suffix="%" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="glass-card border-white/20">
              <CardHeader><CardTitle className="text-white">Visualizações e Cliques</CardTitle></CardHeader>
              <CardContent>
                <RechartsResponsiveContainer width="100%" height={300}>
                  <LineChart data={metrics.dailyStats}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="date" stroke="#fff" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#fff" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Line type="monotone" dataKey="views" name="Visualizações" stroke="#8B5CF6" strokeWidth={2} />
                    <Line type="monotone" dataKey="clicks" name="Cliques" stroke="#00B8FF" strokeWidth={3} />
                  </LineChart>
                </RechartsResponsiveContainer>
              </CardContent>
            </Card>
            <Card className="glass-card border-white/20">
              <CardHeader><CardTitle className="text-white">Distribuição de Cliques</CardTitle></CardHeader>
              <CardContent>
                <RechartsResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie data={metrics.topLinks} dataKey="clicks" nameKey="title" cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5}>
                      {metrics.topLinks.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </RechartsResponsiveContainer>
              </CardContent>
            </Card>
          </div>
          <Card className="glass-card border-white/20">
            <CardHeader><CardTitle className="text-white">Performance por Link</CardTitle></CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader><TableRow className="border-white/10"><TableHead className="text-white/80">Link</TableHead><TableHead className="text-white/80 text-right">Cliques</TableHead><TableHead className="text-white/80 text-right">Visualizações</TableHead><TableHead className="text-white/80 text-right">Taxa de Cliques</TableHead></TableRow></TableHeader>
                  <TableBody>
                    {metrics.topLinks.map((link) => {
                      const IconComponent = getIconById(link.iconId)?.icon || Filter;
                      return (
                        <TableRow key={link.title} className="border-white/10 hover:bg-white/5">
                          <TableCell><div className="flex items-center gap-3"><div className="p-2 rounded-lg bg-white/10"><IconComponent className="w-4 h-4 text-neon-blue" /></div><span className="text-white font-medium">{link.title}</span></div></TableCell>
                          <TableCell className="text-white font-mono text-right">{link.clicks.toLocaleString()}</TableCell>
                          <TableCell className="text-white/80 font-mono text-right">{link.views.toLocaleString()}</TableCell>
                          <TableCell className="text-white/80 font-mono text-right">{link.ctr.toFixed(2)}%</TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </>
      )}
      </div>
    </PageContainer>
  );

  if (isMobile) {
    return (
      <>
        <MobileHeader title="Analytics" showBackButton />
        <div className="pt-14">
          {content}
        </div>
      </>
    );
  }

  return content;
}

const AnalyticsContentSkeleton = () => (
  <>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Skeleton className="h-36 rounded-2xl" />
      <Skeleton className="h-36 rounded-2xl" />
      <Skeleton className="h-36 rounded-2xl" />
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Skeleton className="h-80 rounded-2xl" />
      <Skeleton className="h-80 rounded-2xl" />
    </div>
    <Skeleton className="h-96 rounded-2xl" />
  </>
);