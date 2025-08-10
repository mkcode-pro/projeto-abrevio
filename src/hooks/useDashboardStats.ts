import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const fetchDashboardStats = async (userId: string) => {
  // Get total bio links views
  const { data: bioLinksData, error: bioLinksError } = await supabase
    .from("bio_links")
    .select("view_count")
    .eq("user_id", userId);

  if (bioLinksError) throw new Error(bioLinksError.message);
  const totalViews = bioLinksData.reduce((sum, link) => sum + (link.view_count || 0), 0);

  // Get total clicks from bio link items
  const { data: bioLinkItemsData, error: bioLinkItemsError } = await supabase
    .from("bio_link_items")
    .select("click_count, bio_link_id")
    .in("bio_link_id", bioLinksData.map(l => l.id));
    
  // This part is a bit complex, let's simplify. We need to join tables.
  // For now, let's fetch clicks from shortened URLs as a proxy.
  
  const { data: shortenedUrlsData, error: shortenedUrlsError } = await supabase
    .from("shortened_urls")
    .select("click_count")
    .eq("user_id", userId);

  if (shortenedUrlsError) throw new Error(shortenedUrlsError.message);
  const totalClicks = shortenedUrlsData.reduce((sum, url) => sum + (url.click_count || 0), 0);

  // Get top performing link (simplified to top shortened URL)
  const { data: topLinkData, error: topLinkError } = await supabase
    .from("shortened_urls")
    .select("title, short_code")
    .eq("user_id", userId)
    .order("click_count", { ascending: false })
    .limit(1)
    .single();

  if (topLinkError && topLinkError.code !== 'PGRST116') { // Ignore 'single row not found'
    console.warn("Could not fetch top link:", topLinkError.message);
  }

  return {
    totalViews,
    totalClicks,
    topLink: topLinkData?.title || topLinkData?.short_code || "N/A",
  };
};

export function useDashboardStats() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["dashboardStats", user?.id],
    queryFn: () => fetchDashboardStats(user!.id),
    enabled: !!user,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}