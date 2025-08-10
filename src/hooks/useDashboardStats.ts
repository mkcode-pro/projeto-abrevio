import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface DashboardStats {
  totalViews: number;
  totalClicks: number;
  totalUrls: number;
  totalBioLinks: number;
  topLink: string;
  recentActivity: Array<{
    type: 'view' | 'click';
    description: string;
    timestamp: string;
  }>;
}

const fetchDashboardStats = async (userId: string): Promise<DashboardStats> => {
  // Buscar bio links do usuário
  const { data: bioLinks, error: bioLinksError } = await supabase
    .from("bio_links")
    .select(`
      id, 
      view_count,
      bio_link_items (
        id, title, click_count
      )
    `)
    .eq("user_id", userId);

  if (bioLinksError) {
    console.error("Erro ao buscar bio links:", bioLinksError);
  }

  // Buscar URLs encurtadas
  const { data: shortenedUrls, error: urlsError } = await supabase
    .from("shortened_urls")
    .select("id, title, click_count, created_at")
    .eq("user_id", userId);

  if (urlsError) {
    console.error("Erro ao buscar URLs:", urlsError);
  }

  // Calcular estatísticas
  const totalViews = bioLinks?.reduce((sum, bl) => sum + (bl.view_count || 0), 0) || 0;
  
  const bioLinkClicks = bioLinks?.reduce((sum, bl) => {
    return sum + (bl.bio_link_items?.reduce((itemSum, item) => itemSum + (item.click_count || 0), 0) || 0);
  }, 0) || 0;
  
  const urlClicks = shortenedUrls?.reduce((sum, url) => sum + (url.click_count || 0), 0) || 0;
  const totalClicks = bioLinkClicks + urlClicks;

  // Encontrar link mais clicado
  const allLinks = [
    ...(bioLinks?.flatMap(bl => bl.bio_link_items || []).map(item => ({
      title: item.title,
      clicks: item.click_count || 0
    })) || []),
    ...(shortenedUrls?.map(url => ({
      title: url.title || 'URL Encurtada',
      clicks: url.click_count || 0
    })) || [])
  ];

  const topLink = allLinks.length > 0 
    ? allLinks.reduce((max, link) => link.clicks > max.clicks ? link : max).title
    : "N/A";

  // Atividade recente (simulada por enquanto)
  const recentActivity = [
    {
      type: 'click' as const,
      description: `Link "${topLink}" foi clicado`,
      timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString()
    },
    {
      type: 'view' as const,
      description: 'Sua página bio foi visualizada',
      timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString()
    }
  ];

  return {
    totalViews,
    totalClicks,
    totalUrls: shortenedUrls?.length || 0,
    totalBioLinks: bioLinks?.length || 0,
    topLink,
    recentActivity,
  };
};

export function useDashboardStats() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["dashboardStats", user?.id],
    queryFn: () => fetchDashboardStats(user!.id),
    enabled: !!user,
    staleTime: 1000 * 60 * 5, // 5 minutos
    refetchInterval: 1000 * 60 * 10, // Atualizar a cada 10 minutos
  });
}