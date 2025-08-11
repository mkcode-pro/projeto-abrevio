import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/store/contexts/AuthContext";

const fetchUserBioLinks = async (userId: string) => {
  const { data, error } = await supabase
    .from("bio_links")
    .select("id, username, display_name, bio, (select count(*) from bio_link_items where bio_link_id = bio_links.id) as link_count")
    .eq("user_id", userId);

  if (error) {
    throw new Error(error.message);
  }
  return data;
};

export function useUserBioLinks() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["userBioLinks", user?.id],
    queryFn: () => fetchUserBioLinks(user!.id),
    enabled: !!user,
  });
}