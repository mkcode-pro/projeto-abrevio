import { useState, useCallback, useMemo } from "react";
import { useToast } from "@/hooks/use-toast";

export interface AnalyticsData {
  id: string;
  date: Date;
  type: 'view' | 'click' | 'share';
  source: string; // URL do link ou 'biolink' para visualizações da página
  referrer?: string;
  userAgent?: string;
  country?: string;
  city?: string;
}

export interface AnalyticsMetrics {
  totalViews: number;
  totalClicks: number;
  totalShares: number;
  uniqueVisitors: number;
  conversionRate: number;
  topLinks: Array<{
    url: string;
    title: string;
    clicks: number;
    views: number;
    ctr: number; // Click-through rate
  }>;
  dailyStats: Array<{
    date: string;
    views: number;
    clicks: number;
    shares: number;
  }>;
  locationStats: Array<{
    country: string;
    city?: string;
    count: number;
  }>;
  deviceStats: {
    mobile: number;
    desktop: number;
    tablet: number;
  };
}

// Mock data para demonstração
const mockAnalyticsData: AnalyticsData[] = [
  // Últimos 30 dias de dados simulados
  ...Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    return [
      {
        id: `view-${i}-1`,
        date,
        type: 'view' as const,
        source: 'biolink',
        referrer: 'instagram.com',
        country: 'Brasil',
        city: 'São Paulo'
      },
      {
        id: `click-${i}-1`,
        date,
        type: 'click' as const,
        source: 'https://instagram.com/joaosilva',
        referrer: 'biolink',
        country: 'Brasil',
        city: 'Rio de Janeiro'
      },
      {
        id: `click-${i}-2`,
        date,
        type: 'click' as const,
        source: 'https://wa.me/5511999999999',
        referrer: 'biolink',
        country: 'Brasil',
        city: 'São Paulo'
      }
    ];
  }).flat()
];

export function useAnalytics(period: 'day' | 'week' | 'month' | 'year' = 'month') {
  const [loading, setLoading] = useState(false);
  const [rawData] = useState<AnalyticsData[]>(mockAnalyticsData);
  const { toast } = useToast();

  // Filtrar dados pelo período
  const filteredData = useMemo(() => {
    const now = new Date();
    const startDate = new Date();

    switch (period) {
      case 'day':
        startDate.setDate(now.getDate() - 1);
        break;
      case 'week':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'year':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
    }

    return rawData.filter(item => item.date >= startDate);
  }, [rawData, period]);

  // Calcular métricas
  const metrics = useMemo((): AnalyticsMetrics => {
    const views = filteredData.filter(d => d.type === 'view').length;
    const clicks = filteredData.filter(d => d.type === 'click').length;
    const shares = filteredData.filter(d => d.type === 'share').length;

    // Agrupar por dia para estatísticas diárias
    const dailyStatsMap = new Map<string, { views: number; clicks: number; shares: number }>();
    
    filteredData.forEach(item => {
      const dateKey = item.date.toISOString().split('T')[0];
      if (!dailyStatsMap.has(dateKey)) {
        dailyStatsMap.set(dateKey, { views: 0, clicks: 0, shares: 0 });
      }
      const stats = dailyStatsMap.get(dateKey)!;
      stats[item.type === 'view' ? 'views' : item.type === 'click' ? 'clicks' : 'shares']++;
    });

    const dailyStats = Array.from(dailyStatsMap.entries())
      .map(([date, stats]) => ({ date, ...stats }))
      .sort((a, b) => a.date.localeCompare(b.date));

    // Top links
    const linkStatsMap = new Map<string, { clicks: number; views: number; title: string }>();
    
    filteredData.forEach(item => {
      if (item.source !== 'biolink') {
        if (!linkStatsMap.has(item.source)) {
          linkStatsMap.set(item.source, { 
            clicks: 0, 
            views: 0, 
            title: item.source.includes('instagram') ? 'Instagram' :
                   item.source.includes('wa.me') ? 'WhatsApp' :
                   item.source.includes('youtube') ? 'YouTube' : 'Link'
          });
        }
        const stats = linkStatsMap.get(item.source)!;
        if (item.type === 'click') stats.clicks++;
        if (item.type === 'view') stats.views++;
      }
    });

    const topLinks = Array.from(linkStatsMap.entries())
      .map(([url, stats]) => ({
        url,
        title: stats.title,
        clicks: stats.clicks,
        views: stats.views,
        ctr: stats.views > 0 ? (stats.clicks / stats.views) * 100 : 0
      }))
      .sort((a, b) => b.clicks - a.clicks)
      .slice(0, 10);

    // Estatísticas de localização
    const locationStatsMap = new Map<string, number>();
    filteredData.forEach(item => {
      if (item.country) {
        const key = item.city ? `${item.country}, ${item.city}` : item.country;
        locationStatsMap.set(key, (locationStatsMap.get(key) || 0) + 1);
      }
    });

    const locationStats = Array.from(locationStatsMap.entries())
      .map(([location, count]) => {
        const [country, city] = location.split(', ');
        return { country, city, count };
      })
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return {
      totalViews: views,
      totalClicks: clicks,
      totalShares: shares,
      uniqueVisitors: Math.floor(views * 0.7), // Estimativa
      conversionRate: views > 0 ? (clicks / views) * 100 : 0,
      topLinks,
      dailyStats,
      locationStats,
      deviceStats: {
        mobile: Math.floor(filteredData.length * 0.6),
        desktop: Math.floor(filteredData.length * 0.3),
        tablet: Math.floor(filteredData.length * 0.1)
      }
    };
  }, [filteredData]);

  const trackEvent = useCallback(async (
    type: AnalyticsData['type'],
    source: string,
    metadata?: Partial<AnalyticsData>
  ) => {
    try {
      // Em uma aplicação real, isso enviaria dados para o backend
      const newEvent: AnalyticsData = {
        id: Date.now().toString(),
        date: new Date(),
        type,
        source,
        ...metadata
      };

      // Simular envio para analytics
      await new Promise(resolve => setTimeout(resolve, 100));
      
    } catch (error) {
      // Handle analytics error silently in production
    }
  }, []);

  const exportData = useCallback(async (format: 'csv' | 'json' = 'csv') => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (format === 'csv') {
        const csvContent = [
          'Data,Tipo,Fonte,Referrer,País,Cidade',
          ...filteredData.map(item => 
            `${item.date.toISOString()},${item.type},${item.source},${item.referrer || ''},${item.country || ''},${item.city || ''}`
          )
        ].join('\n');
        
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `analytics-${period}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
      } else {
        const jsonContent = JSON.stringify({ metrics, rawData: filteredData }, null, 2);
        const blob = new Blob([jsonContent], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `analytics-${period}.json`;
        a.click();
        window.URL.revokeObjectURL(url);
      }

      toast({
        title: "Dados exportados",
        description: `Analytics exportado em formato ${format.toUpperCase()}`,
      });
      
    } catch (error) {
      toast({
        title: "Erro na exportação",
        description: "Não foi possível exportar os dados.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [filteredData, metrics, period, toast]);

  return {
    metrics,
    loading,
    trackEvent,
    exportData
  };
}