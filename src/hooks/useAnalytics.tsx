import { useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

type Period = '7d' | '30d' | '90d';

interface AnalyticsMetrics {
  totalViews: number;
  totalClicks: number;
  ctr: number;
  viewsChange: number;
  clicksChange: number;
  ctrChange: number;
  dailyStats: Array<{ date: string; views: number; clicks: number }>;
  topLinks: Array<{ title: string; clicks: number; views: number; ctr: number; iconId: string }>;
}

const fetchAnalyticsData = async (userId: string, period: Period) => {
  const getDays = (p: Period) => ({ '7d': 7, '30d': 30, '90d': 90 }[p]);
  const days = getDays(period);
  const prevDays = days * 2;

  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - days);
  const prevStartDate = new Date();
  prevStartDate.setDate(endDate.getDate() - prevDays);

  // Buscar bio links do usuário
  const { data: bioLinks, error: bioLinksError } = await supabase
    .from("bio_links")
    .select(`id, username, bio_link_items (id, title, icon)`)
    .eq("user_id", userId);
  if (bioLinksError) throw bioLinksError;

  const bioLinkIds = bioLinks?.map(bl => bl.id) || [];
  const bioLinkItemIds = bioLinks?.flatMap(bl => bl.bio_link_items.map(item => item.id)) || [];

  // Buscar cliques detalhados
  const { data: clicks, error: clicksError } = await supabase
    .from("url_clicks")
    .select("clicked_at, bio_link_item_id")
    .in("bio_link_item_id", bioLinkItemIds)
    .gte("clicked_at", prevStartDate.toISOString());
  if (clicksError) throw clicksError;

  // Simular visualizações por enquanto
  const views = clicks?.map(c => ({ ...c, viewed_at: c.clicked_at })) || [];

  return { clicks, views, bioLinks };
};

export function useAnalytics(period: Period) {
  const { user } = useAuth();
  const [isExporting, setIsExporting] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['analytics', user?.id, period],
    queryFn: () => fetchAnalyticsData(user!.id, period),
    enabled: !!user,
  });

  const metrics = useCallback((): AnalyticsMetrics => {
    if (!data) {
      return { totalViews: 0, totalClicks: 0, ctr: 0, viewsChange: 0, clicksChange: 0, ctrChange: 0, dailyStats: [], topLinks: [] };
    }

    const { clicks, views, bioLinks } = data;
    const days = { '7d': 7, '30d': 30, '90d': 90 }[period];
    
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - days);
    const prevStartDate = new Date();
    prevStartDate.setDate(endDate.getDate() - (days * 2));
    const prevEndDate = new Date();
    prevEndDate.setDate(endDate.getDate() - days);

    const currentClicks = clicks.filter(c => new Date(c.clicked_at!) >= startDate);
    const prevClicks = clicks.filter(c => new Date(c.clicked_at!) >= prevStartDate && new Date(c.clicked_at!) < prevEndDate);
    const currentViews = views.filter(v => new Date(v.viewed_at!) >= startDate);
    const prevViews = views.filter(v => new Date(v.viewed_at!) >= prevStartDate && new Date(v.viewed_at!) < prevEndDate);

    const totalClicks = currentClicks.length;
    const totalViews = currentViews.length;
    const ctr = totalViews > 0 ? (totalClicks / totalViews) * 100 : 0;

    const calcChange = (current: number, previous: number) => {
      if (previous === 0) return current > 0 ? 100 : 0;
      return ((current - previous) / previous) * 100;
    };

    const clicksChange = calcChange(totalClicks, prevClicks.length);
    const viewsChange = calcChange(totalViews, prevViews.length);
    const prevCtr = prevViews.length > 0 ? (prevClicks.length / prevViews.length) * 100 : 0;
    const ctrChange = calcChange(ctr, prevCtr);

    const dailyStats = Array.from({ length: days }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
      const dayStart = new Date(d.setHours(0, 0, 0, 0)).toISOString();
      const dayEnd = new Date(d.setHours(23, 59, 59, 999)).toISOString();

      return {
        date: dateStr,
        views: views.filter(v => v.viewed_at! >= dayStart && v.viewed_at! <= dayEnd).length,
        clicks: clicks.filter(c => c.clicked_at! >= dayStart && c.clicked_at! <= dayEnd).length,
      };
    }).reverse();

    const allLinkItems = bioLinks.flatMap(bl => bl.bio_link_items);
    const topLinks = allLinkItems.map(item => {
      const itemClicks = currentClicks.filter(c => c.bio_link_item_id === item.id).length;
      // Simulating views per link for now
      const itemViews = Math.floor(itemClicks / (ctr / 100)) || itemClicks;
      return {
        title: item.title,
        clicks: itemClicks,
        views: itemViews,
        ctr: itemViews > 0 ? (itemClicks / itemViews) * 100 : 0,
        iconId: item.icon || 'website',
      };
    }).sort((a, b) => b.clicks - a.clicks).slice(0, 5);

    return { totalViews, totalClicks, ctr, viewsChange, clicksChange, ctrChange, dailyStats, topLinks };
  }, [data, period])();

  const exportData = useCallback(async (format: 'csv' | 'json') => {
    setIsExporting(true);
    try {
      const headers = "data,visualizacoes,cliques\n";
      const csv = metrics.dailyStats.map(d => `${d.date},${d.views},${d.clicks}`).join("\n");
      const blob = new Blob([headers + csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", `analytics-${period}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("Dados exportados com sucesso!");
    } catch (error) {
      toast.error("Erro ao exportar dados.");
    } finally {
      setIsExporting(false);
    }
  }, [metrics.dailyStats, period]);

  return { metrics, isLoading, exportData, isExporting };
}