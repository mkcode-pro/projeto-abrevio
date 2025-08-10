import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { LinkData } from "@/components/biolink-editor/SortableLinkItem";
import { UserData } from "@/components/biolink-editor/BioLinkPreview";

// Buscar bio link do usuário
const fetchBioLink = async (userId: string) => {
  const { data, error } = await supabase
    .from("bio_links")
    .select(`
      *,
      bio_link_items (
        id, title, url, icon, position
      )
    `)
    .eq("user_id", userId)
    .single();

  if (error && error.code !== 'PGRST116') { // Ignora erro de "não encontrado"
    throw new Error(error.message);
  }
  return data;
};

// Criar novo bio link
const createBioLink = async ({ userId, username, name }: { 
  userId: string; 
  username: string; 
  name: string; 
}) => {
  const { data, error } = await supabase
    .from('bio_links')
    .insert({
      user_id: userId,
      username: username,
      display_name: name,
    })
    .select('*, bio_link_items(*)')
    .single();

  if (error) throw new Error(error.message);
  return data;
};

// Atualizar perfil do bio link
const updateBioLinkProfile = async ({ bioLinkId, updates }: { bioLinkId: string; updates: Partial<UserData> }) => {
  const { error } = await supabase
    .from("bio_links")
    .update({
      display_name: updates.name,
      username: updates.username,
      bio: updates.bio,
      avatar_url: updates.avatar,
    })
    .eq("id", bioLinkId);
  if (error) throw new Error(error.message);
};

// Atualizar links do bio link
const updateBioLinkItems = async ({ bioLinkId, links }: { bioLinkId: string; links: LinkData[] }) => {
  await supabase.from("bio_link_items").delete().eq("bio_link_id", bioLinkId);
  if (links.length > 0) {
    const newItems = links.map((link, index) => ({
      bio_link_id: bioLinkId,
      title: link.title,
      url: link.url,
      icon: link.iconId,
      position: index,
    }));
    const { error } = await supabase.from("bio_link_items").insert(newItems);
    if (error) throw error;
  }
};

export function useBioLink() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: bioLink, isLoading, isError, error } = useQuery({
    queryKey: ["bioLink", user?.id],
    queryFn: () => fetchBioLink(user!.id),
    enabled: !!user,
  });

  const createMutation = useMutation({
    mutationFn: createBioLink,
    onSuccess: () => {
      toast.success("Seu Bio Link foi criado!");
      queryClient.invalidateQueries({ queryKey: ["bioLink", user?.id] });
    },
    onError: (err: any) => toast.error("Erro ao criar Bio Link", { description: err.message }),
  });

  const profileMutation = useMutation({
    mutationFn: updateBioLinkProfile,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["bioLink", user?.id] }),
    onError: (err: any) => toast.error("Erro ao salvar perfil", { description: err.message }),
  });

  const linksMutation = useMutation({
    mutationFn: updateBioLinkItems,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["bioLink", user?.id] }),
    onError: (err: any) => toast.error("Erro ao salvar links", { description: err.message }),
  });

  const handleSave = async (userData: UserData, links: LinkData[]) => {
    if (!user) return;
    let currentBioLink = bioLink;

    if (!currentBioLink) {
      try {
        currentBioLink = await createMutation.mutateAsync({ userId: user.id, username: user.username, name: user.name });
      } catch (e) { return; }
    }
    
    if (!currentBioLink) {
      toast.error("Não foi possível encontrar ou criar seu Bio Link.");
      return;
    }

    const savePromise = Promise.all([
      profileMutation.mutateAsync({ bioLinkId: currentBioLink.id, updates: userData }),
      linksMutation.mutateAsync({ bioLinkId: currentBioLink.id, links }),
    ]);

    toast.promise(savePromise, {
      loading: 'Salvando alterações...',
      success: 'Tudo salvo com sucesso!',
      error: 'Ocorreu um erro ao salvar.',
    });
  };

  const bioLinkData = user ? {
    userData: {
      name: bioLink?.display_name || user.name || '',
      username: bioLink?.username || user.username || '',
      bio: bioLink?.bio || '',
      avatar: bioLink?.avatar_url || user.avatar || '',
    },
    links: bioLink?.bio_link_items?.sort((a: any, b: any) => a.position - b.position)
      .map((item: any) => ({
        id: item.id,
        title: item.title,
        url: item.url,
        iconId: item.icon || 'website'
      })) || [],
  } : null;

  return {
    bioLinkData,
    isLoading,
    isError,
    error,
    saveChanges: handleSave,
    isSaving: profileMutation.isPending || linksMutation.isPending || createMutation.isPending,
  };
}