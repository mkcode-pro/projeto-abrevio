import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { LinkData } from "@/components/biolink-editor/SortableLinkItem";
import { UserData } from "@/components/biolink-editor/BioLinkPreview";
import { useEffect } from "react";

// Fetch user's bio link data
const fetchBioLink = async (userId: string) => {
  const { data, error } = await supabase
    .from("bio_links")
    .select(`
      *,
      bio_link_items (
        id, title, subtitle, url, icon, position
      )
    `)
    .eq("user_id", userId)
    .single();

  if (error && error.code !== 'PGRST116') { // PGRST116 = no rows found
    throw new Error(error.message);
  }
  return data;
};

// Create a new bio link profile
const createBioLink = async ({ userId, username, name }: { userId: string, username: string, name: string }) => {
  const { data, error } = await supabase
    .from('bio_links')
    .insert({
      user_id: userId,
      username: username,
      display_name: name,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
};

// Update bio link profile data
const updateBioLinkProfile = async ({ updates }: { updates: Partial<UserData> & { id: string } }) => {
  const { id, ...profileData } = updates;
  const { error } = await supabase
    .from("bio_links")
    .update({
      display_name: profileData.name,
      username: profileData.username,
      bio: profileData.bio,
      avatar_url: profileData.avatar,
    })
    .eq("id", id);
  if (error) throw new Error(error.message);
};

// Update all links
const updateLinks = async ({ bioLinkId, links }: { bioLinkId: string, links: LinkData[] }) => {
  // Delete existing items
  await supabase.from("bio_link_items").delete().eq("bio_link_id", bioLinkId);

  // Insert new items if any
  if (links.length > 0) {
    const newItems = links.map((link, index) => ({
      bio_link_id: bioLinkId,
      title: link.title,
      subtitle: link.subtitle,
      url: link.url,
      icon: link.iconId,
      position: index,
    }));
    const { error: insertError } = await supabase.from("bio_link_items").insert(newItems);
    if (insertError) throw insertError;
  }
};

export function useBioLink() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: bioLink, isLoading: isQueryLoading, isError, isSuccess } = useQuery({
    queryKey: ["bioLink", user?.id],
    queryFn: () => fetchBioLink(user!.id),
    enabled: !!user,
  });

  const createMutation = useMutation({
    mutationFn: createBioLink,
    onSuccess: () => {
      toast.info("Perfil de Bio Link criado para você!");
      queryClient.invalidateQueries({ queryKey: ["bioLink", user?.id] });
    },
    onError: (error) => {
      toast.error("Erro ao criar seu perfil de Bio Link", { description: error.message });
    },
  });

  useEffect(() => {
    if (isSuccess && !bioLink && user && !createMutation.isPending) {
      createMutation.mutate({
        userId: user.id,
        username: user.username,
        name: user.name,
      });
    }
  }, [isSuccess, bioLink, user, createMutation]);

  const profileMutation = useMutation({
    mutationFn: updateBioLinkProfile,
    onSuccess: () => {
      toast.success("Perfil salvo com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["bioLink", user?.id] });
    },
    onError: (error) => {
      toast.error("Erro ao salvar perfil", { description: error.message });
    },
  });

  const linksMutation = useMutation({
    mutationFn: updateLinks,
    onSuccess: () => {
      toast.success("Links salvos com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["bioLink", user?.id] });
    },
    onError: (error) => {
      toast.error("Erro ao salvar links", { description: error.message });
    },
  });

  const handleProfileUpdate = (updates: Partial<UserData>) => {
    if (!user || !bioLink) return;
    profileMutation.mutate({ updates: { ...updates, id: bioLink.id } });
  };

  const handleLinksUpdate = (links: LinkData[]) => {
    if (!user || !bioLink) return;
    linksMutation.mutate({ bioLinkId: bioLink.id, links });
  };

  const bioLinkData = bioLink ? {
    userData: {
      name: bioLink.display_name || user?.name || '',
      username: bioLink.username || user?.username || '',
      bio: bioLink.bio || '',
      avatar: bioLink.avatar_url || user?.avatar || '',
    },
    links: (bioLink.bio_link_items || []).sort((a: any, b: any) => a.position - b.position).map((item: any) => ({
      ...item,
      iconId: item.icon || 'website'
    })),
  } : null;

  const isLoading = isQueryLoading || createMutation.isPending;

  return {
    bioLinkData,
    isLoading,
    isError,
    updateProfile: handleProfileUpdate,
    updateLinks: handleLinksUpdate,
    isSaving: profileMutation.isPending || linksMutation.isPending,
  };
}