import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/store/contexts/AuthContext";
import { toast } from "sonner";
import { LinkData } from "@/components/biolink-editor/SortableLinkItem";
import { UserData } from "@/components/biolink-editor/BioLinkPreview";
import { useMemo } from "react";
import { BioLinkTheme, defaultTheme } from "@/components/biolink-editor/ThemeLibrary";

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
      theme: defaultTheme as any, // Salva o objeto de tema padrão
    })
    .select('*, bio_link_items(*)')
    .single();

  if (error) throw new Error(error.message);
  return data;
};

// Atualizar perfil e tema do bio link
const updateBioLink = async ({ bioLinkId, updates, theme }: { bioLinkId: string; updates: Partial<UserData>, theme: BioLinkTheme }) => {
  const { error } = await supabase
    .from("bio_links")
    .update({
      display_name: updates.name,
      username: updates.username,
      bio: updates.bio,
      avatar_url: updates.avatar,
      theme: theme as any,
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
    refetchOnWindowFocus: false,
  });

  const createMutation = useMutation({
    mutationFn: createBioLink,
    onSuccess: () => {
      toast.success("Seu Bio Link foi criado!");
      queryClient.invalidateQueries({ queryKey: ["bioLink", user?.id] });
    },
    onError: (err: any) => toast.error("Erro ao criar Bio Link", { description: err.message }),
  });

  const updateMutation = useMutation({
    mutationFn: updateBioLink,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["bioLink", user?.id] }),
    onError: (err: any) => toast.error("Erro ao salvar perfil", { description: err.message }),
  });

  const linksMutation = useMutation({
    mutationFn: updateBioLinkItems,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["bioLink", user?.id] }),
    onError: (err: any) => toast.error("Erro ao salvar links", { description: err.message }),
  });

  const handleSave = async (userData: UserData, links: LinkData[], theme: BioLinkTheme) => {
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
      updateMutation.mutateAsync({ bioLinkId: currentBioLink.id, updates: userData, theme }),
      linksMutation.mutateAsync({ bioLinkId: currentBioLink.id, links }),
    ]);

    toast.promise(savePromise, {
      loading: 'Salvando alterações...',
      success: 'Tudo salvo com sucesso!',
      error: 'Ocorreu um erro ao salvar.',
    });
  };

  const bioLinkData = useMemo(() => {
    if (!user) return null;
    
    const themeData = bioLink?.theme as any;
    
    return {
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
      theme: (themeData && typeof themeData === 'object') ? { ...defaultTheme, ...themeData, styles: { ...defaultTheme.styles, ...themeData.styles } } : defaultTheme,
    };
  }, [user, bioLink]);

  return {
    bioLinkData,
    isLoading,
    isError,
    error,
    saveChanges: handleSave,
    isSaving: updateMutation.isPending || linksMutation.isPending || createMutation.isPending,
  };
}