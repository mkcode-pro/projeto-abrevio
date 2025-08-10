import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { ExternalLink, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface BioLink {
  id: string;
  display_name: string | null;
  username: string;
  link_count: number;
}

const fetchUserBioLinks = async (userId: string): Promise<BioLink[]> => {
  // First get the bio_links
  const { data: bioLinks, error: bioLinksError } = await supabase
    .from("bio_links")
    .select("id, display_name, username")
    .eq("user_id", userId);

  if (bioLinksError) throw new Error(bioLinksError.message);
  if (!bioLinks) return [];

  // Then get the link counts for each bio_link
  const bioLinksWithCounts = await Promise.all(
    bioLinks.map(async (bioLink) => {
      const { count } = await supabase
        .from("bio_link_items")
        .select("*", { count: "exact", head: true })
        .eq("bio_link_id", bioLink.id);

      return {
        ...bioLink,
        link_count: count || 0,
      };
    })
  );

  return bioLinksWithCounts;
};

export function BiolinksGrid() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: bioLinks = [], isLoading } = useQuery({
    queryKey: ["userBioLinks", user?.id],
    queryFn: () => fetchUserBioLinks(user!.id),
    enabled: !!user,
  });

  const handleOpenLink = (username: string) => {
    window.open(`/bio/${username}`, '_blank');
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="glass border border-white/10 rounded-xl p-4 animate-pulse">
            <div className="h-4 bg-white/10 rounded mb-2"></div>
            <div className="h-3 bg-white/10 rounded mb-1"></div>
            <div className="h-3 bg-white/10 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {bioLinks.map((link) => (
        <div 
          key={link.id}
          className="glass border border-white/10 rounded-xl p-4 hover:border-neon-blue/50 transition-all hover-scale"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-white truncate">{link.display_name || link.username}</h4>
              <p className="text-sm text-muted-foreground truncate">/bio/{link.username}</p>
              <div className="flex items-center gap-1 mt-1">
                <span className="text-xs text-neon-blue">{link.link_count} links</span>
              </div>
            </div>
            <div className="flex gap-2 ml-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-white/60 hover:text-white hover:bg-white/10"
                onClick={() => navigate("/bio-link-editor")}
              >
                <Plus className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-white/60 hover:text-white hover:bg-white/10"
                onClick={() => handleOpenLink(link.username)}
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      ))}
      
      {bioLinks.length === 0 && (
        <div className="col-span-full text-center py-8">
          <p className="text-white/60 mb-4">Você ainda não criou nenhum Bio Link</p>
          <Button onClick={() => navigate("/bio-link-editor")} className="bg-gradient-neon">
            <Plus className="h-4 w-4 mr-2" />
            Criar primeiro Bio Link
          </Button>
        </div>
      )}
    </div>
  );
}