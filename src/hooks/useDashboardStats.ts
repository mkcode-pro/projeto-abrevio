import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const fetchDashboardStats = async (userId: string) => {
  // First, get the user's bio_link ID and view count
  const { data: bioLink, error: bioLinkError } = await supabase
    .from("bio_links")
    .select("id, view_count")
    .eq("user_id", userId)
    .single();

  if (bioLinkError && bioLinkError.code !== 'PGRST116') {
    throw new Error(bioLinkError.message);
  }
  
  if (!bioLink) {
    return { totalViews: 0, totalClicks: 0, topLink: "N/A" };
  }

  const totalViews = bioLink.view_count || 0;

  // Now get stats for items related to this bio_link
  const { data: items, error: itemsError } = await supabase
    .from("bio_link_items")
    .select("title, click_count")
    .eq("bio_link_id", bioLink.id);

  if (itemsError) throw new Error(itemsError.message);

  const totalClicks = items.reduce((sum, item) => sum + (item.click_count || 0), 0);

  const topLink = items.length > 0 
    ? items.reduce((max, item) => (item.click_count || 0) > (max.click_count || 0) ? item : max).title
    : "N/A";

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
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}