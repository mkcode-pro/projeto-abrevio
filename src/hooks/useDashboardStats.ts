import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface DashboardStats {
  totalViews: number;
  totalClicks: number;
  topLink: string;
}

const fetchDashboardStats = async (userId: string): Promise<DashboardStats> => {
  // Buscar bio links para visualizações e cliques em itens de bio link
  const { data: bioLinks, error: bioLinksError } = await supabase
    .from("bio_links")
    .select(`
      view_count,
      bio_link_items ( title, click_count )
    `)
    .eq("user_id", userId);

  if (bioLinksError) {
    console.error("Erro ao buscar bio links para estatísticas:", bioLinksError);
    throw bioLinksError;
  }

  // Buscar URLs encurtadas para cliques
  const { data: shortenedUrls, error: urlsError } = await supabase
    .from("shortened_urls")
    .select("title, click_count")
    .eq("user_id", userId);

  if (urlsError) {
    console.error("Erro ao buscar URLs encurtadas para estatísticas:", urlsError);
    throw urlsError;
  }

  // Calcular totais
  const totalViews = bioLinks?.reduce((sum, bl) => sum + (bl.view_count || 0), 0) || 0;
  
  const bioLinkClicks = bioLinks?.reduce((sum, bl) => 
    sum + (bl.bio_link_items?.reduce((itemSum, item) => itemSum + (item.click_count || 0), 0) || 0), 0) || 0;
  
  const urlClicks = shortenedUrls?.reduce((sum, url) => sum + (url.click_count || 0), 0) || 0;
  const totalClicks = bioLinkClicks + urlClicks;

  // Encontrar o link mais popular
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
    ? allLinks.reduce((max, link) => (link.clicks > max.clicks ? link : max), allLinks[0]).title
    : "Nenhum";

  return {
    totalViews,
    totalClicks,
    topLink,
  };
};

export function useDashboardStats() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["dashboardStats", user?.id],
    queryFn: () => fetchDashboardStats(user!.id),
    enabled: !!user,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
}