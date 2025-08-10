import { useState } from "react"
import { 
  TrendingUp, 
  Eye, 
  MousePointer, 
  Calendar, 
  Download, 
  ArrowUpRight, 
  ArrowDownRight,
  Filter,
  Instagram,
  MessageCircle,
  Youtube,
  Globe
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts'

// Mock data for different periods
const mockData = {
  '7': {
    totalViews: 2540,
    totalClicks: 1234,
    clickRate: 48.6,
    growth: {
      views: 12.5,
      clicks: 8.3
    },
    chartData: [
      { date: '19/01', clicks: 156, views: 320 },
      { date: '20/01', clicks: 142, views: 298 },
      { date: '21/01', clicks: 189, views: 380 },
      { date: '22/01', clicks: 167, views: 342 },
      { date: '23/01', clicks: 203, views: 410 },
      { date: '24/01', clicks: 178, views: 365 },
      { date: '25/01', clicks: 199, views: 425 }
    ],
    linkData: [
      { id: 1, name: 'WhatsApp Business', icon: MessageCircle, color: 'from-green-400 to-green-600', clicks: 556, views: 1143, rate: 48.6, change: 15.2 },
      { id: 2, name: 'Instagram', icon: Instagram, color: 'from-purple-500 to-pink-500', clicks: 395, views: 812, rate: 48.6, change: 8.7 },
      { id: 3, name: 'YouTube', icon: Youtube, color: 'from-red-500 to-red-700', clicks: 185, views: 432, rate: 42.8, change: -2.1 },
      { id: 4, name: 'Site Pessoal', icon: Globe, color: 'from-blue-500 to-indigo-600', clicks: 98, views: 153, rate: 64.0, change: 5.3 }
    ]
  },
  '30': {
    totalViews: 8750,
    totalClicks: 4320,
    clickRate: 49.4,
    growth: {
      views: 18.7,
      clicks: 22.1
    },
    chartData: [
      { date: 'Sem 1', clicks: 890, views: 1820 },
      { date: 'Sem 2', clicks: 1050, views: 2150 },
      { date: 'Sem 3', clicks: 1180, views: 2380 },
      { date: 'Sem 4', clicks: 1200, views: 2400 }
    ],
    linkData: [
      { id: 1, name: 'WhatsApp Business', icon: MessageCircle, color: 'from-green-400 to-green-600', clicks: 1944, views: 3937, rate: 49.4, change: 22.1 },
      { id: 2, name: 'Instagram', icon: Instagram, color: 'from-purple-500 to-pink-500', clicks: 1382, views: 2800, rate: 49.4, change: 18.7 },
      { id: 3, name: 'YouTube', icon: Youtube, color: 'from-red-500 to-red-700', clicks: 648, views: 1575, rate: 41.1, change: 12.3 },
      { id: 4, name: 'Site Pessoal', icon: Globe, color: 'from-blue-500 to-indigo-600', clicks: 346, views: 438, rate: 79.0, change: 15.8 }
    ]
  },
  '90': {
    totalViews: 24800,
    totalClicks: 12650,
    clickRate: 51.0,
    growth: {
      views: 45.2,
      clicks: 52.8
    },
    chartData: [
      { date: 'Mês 1', clicks: 3200, views: 6800 },
      { date: 'Mês 2', clicks: 4150, views: 8200 },
      { date: 'Mês 3', clicks: 5300, views: 9800 }
    ],
    linkData: [
      { id: 1, name: 'WhatsApp Business', icon: MessageCircle, color: 'from-green-400 to-green-600', clicks: 5692, views: 11160, rate: 51.0, change: 52.8 },
      { id: 2, name: 'Instagram', icon: Instagram, color: 'from-purple-500 to-pink-500', clicks: 4048, views: 7936, rate: 51.0, change: 45.2 },
      { id: 3, name: 'YouTube', icon: Youtube, color: 'from-red-500 to-red-700', clicks: 1898, views: 3720, rate: 51.0, change: 38.9 },
      { id: 4, name: 'Site Pessoal', icon: Globe, color: 'from-blue-500 to-indigo-600', clicks: 1012, views: 984, rate: 102.8, change: 67.3 }
    ]
  }
}

const pieColors = ['#00B8FF', '#8B5CF6', '#EF4444', '#3B82F6']

function MetricCard({ title, value, change, icon: Icon, suffix = "" }: {
  title: string
  value: number | string
  change: number
  icon: any
  suffix?: string
}) {
  const isPositive = change > 0
  
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
              {isPositive ? (
                <ArrowUpRight className="w-4 h-4 text-emerald-400" />
              ) : (
                <ArrowDownRight className="w-4 h-4 text-red-400" />
              )}
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
            {entry.dataKey === 'clicks' ? 'Cliques' : 'Visualizações'}: {entry.value.toLocaleString()}
          </p>
        ))}
      </div>
    )
  }
  return null
}

export default function Analytics() {
  const [selectedPeriod, setSelectedPeriod] = useState<'7' | '30' | '90'>('7')
  const [sortBy, setSortBy] = useState<'clicks' | 'views' | 'rate'>('clicks')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  const currentData = mockData[selectedPeriod]

  const handleExport = () => {
    // Simulate export functionality
    const exportData = {
      period: selectedPeriod,
      ...currentData
    }
    
    const dataStr = JSON.stringify(exportData, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `analytics-${selectedPeriod}dias-${new Date().toISOString().split('T')[0]}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  const sortedLinkData = [...currentData.linkData].sort((a, b) => {
    const aValue = a[sortBy]
    const bValue = b[sortBy]
    return sortOrder === 'desc' ? bValue - aValue : aValue - bValue
  })

  const pieData = currentData.linkData.map((link, index) => ({
    name: link.name,
    value: link.clicks,
    color: pieColors[index]
  }))

  const periodLabels = {
    '7': 'Últimos 7 dias',
    '30': 'Últimos 30 dias',
    '90': 'Últimos 90 dias'
  }

  return (
    <div className="min-h-screen bg-gradient-hero p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">Analytics</h1>
            <p className="text-white/60 mt-1">Acompanhe a performance dos seus links</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <Select value={selectedPeriod} onValueChange={(value: '7' | '30' | '90') => setSelectedPeriod(value)}>
              <SelectTrigger className="w-full sm:w-48 bg-white/5 border-white/20 text-white">
                <Calendar className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="glass-card border-white/20">
                <SelectItem value="7">{periodLabels['7']}</SelectItem>
                <SelectItem value="30">{periodLabels['30']}</SelectItem>
                <SelectItem value="90">{periodLabels['90']}</SelectItem>
              </SelectContent>
            </Select>
            
            <Button 
              onClick={handleExport}
              variant="outline" 
              className="border-white/20 text-white hover:bg-white/10"
            >
              <Download className="w-4 h-4 mr-2" />
              Exportar
            </Button>
          </div>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Total de Visualizações"
            value={currentData.totalViews}
            change={currentData.growth.views}
            icon={Eye}
          />
          <MetricCard
            title="Total de Cliques"
            value={currentData.totalClicks}
            change={currentData.growth.clicks}
            icon={MousePointer}
          />
          <MetricCard
            title="Taxa de Cliques"
            value={currentData.clickRate}
            change={2.1}
            icon={TrendingUp}
            suffix="%"
          />
          <MetricCard
            title="Link Mais Clicado"
            value={currentData.linkData[0].name}
            change={currentData.linkData[0].change}
            icon={currentData.linkData[0].icon}
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Line Chart */}
          <Card className="glass-card border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-neon-blue" />
                Cliques por Período
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={currentData.chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis 
                    dataKey="date" 
                    stroke="#fff" 
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis 
                    stroke="#fff" 
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Line 
                    type="monotone" 
                    dataKey="clicks" 
                    stroke="#00B8FF" 
                    strokeWidth={3}
                    dot={{ fill: '#00B8FF', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: '#00B8FF', strokeWidth: 2, fill: '#fff' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="views" 
                    stroke="#8B5CF6" 
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Pie Chart */}
          <Card className="glass-card border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Filter className="w-5 h-5 text-neon-blue" />
                Distribuição de Cliques
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => [value.toLocaleString(), 'Cliques']}
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '8px',
                      color: '#fff'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Performance Table */}
        <Card className="glass-card border-white/20">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <CardTitle className="text-white flex items-center gap-2">
                <MousePointer className="w-5 h-5 text-neon-blue" />
                Performance por Link
              </CardTitle>
              <Select value={sortBy} onValueChange={(value: 'clicks' | 'views' | 'rate') => setSortBy(value)}>
                <SelectTrigger className="w-full sm:w-48 bg-white/5 border-white/20 text-white">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="glass-card border-white/20">
                  <SelectItem value="clicks">Ordenar por Cliques</SelectItem>
                  <SelectItem value="views">Ordenar por Visualizações</SelectItem>
                  <SelectItem value="rate">Ordenar por Taxa</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-white/10">
                    <TableHead className="text-white/80">Link</TableHead>
                    <TableHead className="text-white/80">Cliques</TableHead>
                    <TableHead className="text-white/80">Visualizações</TableHead>
                    <TableHead className="text-white/80">Taxa de Cliques</TableHead>
                    <TableHead className="text-white/80">Crescimento</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedLinkData.map((link) => {
                    const IconComponent = link.icon
                    return (
                      <TableRow key={link.id} className="border-white/10 hover:bg-white/5">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg bg-gradient-to-r ${link.color}`}>
                              <IconComponent className="w-4 h-4 text-white" />
                            </div>
                            <span className="text-white font-medium">{link.name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-white font-mono">{link.clicks.toLocaleString()}</TableCell>
                        <TableCell className="text-white/80 font-mono">{link.views.toLocaleString()}</TableCell>
                        <TableCell className="text-white/80 font-mono">{link.rate.toFixed(1)}%</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            {link.change > 0 ? (
                              <ArrowUpRight className="w-4 h-4 text-emerald-400" />
                            ) : (
                              <ArrowDownRight className="w-4 h-4 text-red-400" />
                            )}
                            <span className={`font-medium ${link.change > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                              {Math.abs(link.change).toFixed(1)}%
                            </span>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Summary Footer */}
        <Card className="glass-card border-white/20">
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-white/60 text-sm">
                Relatório gerado para o período de <span className="text-neon-blue font-medium">{periodLabels[selectedPeriod].toLowerCase()}</span>
              </p>
              <p className="text-white/40 text-xs mt-1">
                Última atualização: {new Date().toLocaleString('pt-BR')}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}