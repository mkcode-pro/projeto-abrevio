import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/store/contexts/AuthContext";
import { ExternalLink, Plus, Edit, Link as LinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

interface BioLink {
  id: string;
  display_name: string | null;
  username: string;
  link_count: number;
}

const fetchUserBioLinks = async (userId: string): Promise<BioLink[]> => {
  const { data: bioLinks, error: bioLinksError } = await supabase
    .from("bio_links")
    .select("id, display_name, username")
    .eq("user_id", userId);

  if (bioLinksError) throw new Error(bioLinksError.message);
  if (!bioLinks) return [];

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

  return (
    <div>
      <h2 className="text-xl font-bold text-white mb-4">Meus Bio Links</h2>
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(2)].map((_, i) => <Skeleton key={i} className="h-36 rounded-2xl" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {bioLinks.map((link) => (
            <Card key={link.id} className="glass-card border-white/10 hover:border-primary/30 transition-all group">
              <CardContent className="p-4 flex flex-col justify-between h-full">
                <div>
                  <h3 className="font-semibold text-white truncate">{link.display_name || link.username}</h3>
                  <p className="text-sm text-muted-foreground truncate group-hover:text-primary transition-colors">/bio/{link.username}</p>
                </div>
                <div className="flex items-end justify-between mt-4">
                  <div className="flex items-center gap-2 text-sm text-foreground/70">
                    <LinkIcon className="w-4 h-4" />
                    <span>{link.link_count} links</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" className="h-8 px-2" onClick={() => navigate("/dashboard/editor")}>
                      <Edit className="w-4 h-4 mr-2" /> Editar
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleOpenLink(link.username)}>
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          <Card 
            className="glass-card border-dashed border-white/20 hover:border-primary/50 transition-all flex items-center justify-center min-h-[144px] cursor-pointer"
            onClick={() => navigate("/dashboard/editor")}
          >
            <div className="text-center text-muted-foreground hover:text-white transition-colors">
              <Plus className="h-8 w-8 mx-auto mb-2" />
              <p className="font-medium">Criar Novo Bio Link</p>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}