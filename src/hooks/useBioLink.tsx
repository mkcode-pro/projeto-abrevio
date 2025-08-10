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
        id, title, subtitle, url, icon, position
      )
    `)
    .eq("user_id", userId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      // Não encontrado - retorna null para criar um novo
      return null;
    }
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
      bio: '',
      is_active: true,
    })
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }
  return data;
};

// Atualizar perfil do bio link
const updateBioLinkProfile = async ({ 
  bioLinkId, 
  updates 
}: { 
  bioLinkId: string; 
  updates: Partial<UserData>; 
}) => {
  const { error } = await supabase
    .from("bio_links")
    .update({
      display_name: updates.name,
      username: updates.username,
      bio: updates.bio,
      avatar_url: updates.avatar,
    })
    .eq("id", bioLinkId);

  if (error) {
    throw new Error(error.message);
  }
};

// Atualizar links do bio link
const updateBioLinkItems = async ({ 
  bioLinkId, 
  links 
}: { 
  bioLinkId: string; 
  links: LinkData[]; 
}) => {
  // Primeiro, deletar todos os links existentes
  const { error: deleteError } = await supabase
    .from("bio_link_items")
    .delete()
    .eq("bio_link_id", bioLinkId);

  if (deleteError) {
    throw new Error(deleteError.message);
  }

  // Depois, inserir os novos links se houver algum
  if (links.length > 0) {
    const newItems = links.map((link, index) => ({
      bio_link_id: bioLinkId,
      title: link.title,
      subtitle: link.subtitle || null,
      url: link.url,
      icon: link.iconId,
      position: index,
    }));

    const { error: insertError } = await supabase
      .from("bio_link_items")
      .insert(newItems);

    if (insertError) {
      throw new Error(insertError.message);
    }
  }
};

export function useBioLink() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Query para buscar bio link
  const { 
    data: bioLink, 
    isLoading: isQueryLoading, 
    isError,
    error 
  } = useQuery({
    queryKey: ["bioLink", user?.id],
    queryFn: () => fetchBioLink(user!.id),
    enabled: !!user,
    retry: (failureCount, error: any) => {
      // Não tentar novamente se for apenas "não encontrado"
      if (error?.message?.includes('PGRST116')) {
        return false;
      }
      return failureCount < 2;
    }
  });

  // Mutation para criar bio link
  const createMutation = useMutation({
    mutationFn: createBioLink,
    onSuccess: () => {
      toast.success("Bio Link criado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["bioLink", user?.id] });
      queryClient.invalidateQueries({ queryKey: ["userBioLinks", user?.id] });
    },
    onError: (error: any) => {
      toast.error("Erro ao criar Bio Link", { 
        description: error.message 
      });
    },
  });

  // Mutation para atualizar perfil
  const profileMutation = useMutation({
    mutationFn: updateBioLinkProfile,
    onSuccess: () => {
      toast.success("Perfil atualizado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["bioLink", user?.id] });
      queryClient.invalidateQueries({ queryKey: ["userBioLinks", user?.id] });
      queryClient.invalidateQueries({ queryKey: ["publicBioLink"] });
    },
    onError: (error: any) => {
      toast.error("Erro ao atualizar perfil", { 
        description: error.message 
      });
    },
  });

  // Mutation para atualizar links
  const linksMutation = useMutation({
    mutationFn: updateBioLinkItems,
    onSuccess: () => {
      toast.success("Links atualizados com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["bioLink", user?.id] });
      queryClient.invalidateQueries({ queryKey: ["publicBioLink"] });
    },
    onError: (error: any) => {
      toast.error("Erro ao atualizar links", { 
        description: error.message 
      });
    },
  });

  // Criar bio link automaticamente se não existir
  const handleCreateBioLink = () => {
    if (user && !createMutation.isPending) {
      createMutation.mutate({
        userId: user.id,
        username: user.username,
        name: user.name,
      });
    }
  };

  // Atualizar perfil
  const updateProfile = (updates: Partial<UserData>) => {
    if (!bioLink) {
      toast.error("Bio Link não encontrado. Criando um novo...");
      handleCreateBioLink();
      return;
    }
    profileMutation.mutate({ bioLinkId: bioLink.id, updates });
  };

  // Atualizar links
  const updateLinks = (links: LinkData[]) => {
    if (!bioLink) {
      toast.error("Bio Link não encontrado. Criando um novo...");
      handleCreateBioLink();
      return;
    }
    linksMutation.mutate({ bioLinkId: bioLink.id, links });
  };

  // Preparar dados para o componente
  const bioLinkData = user ? {
    userData: {
      name: bioLink?.display_name || user.name || '',
      username: bioLink?.username || user.username || '',
      bio: bioLink?.bio || '',
      avatar: bioLink?.avatar_url || user.avatar || '',
    },
    links: bioLink?.bio_link_items 
      ? bioLink.bio_link_items
          .sort((a: any, b: any) => a.position - b.position)
          .map((item: any) => ({
            id: item.id,
            title: item.title,
            subtitle: item.subtitle || '',
            url: item.url,
            iconId: item.icon || 'website'
          }))
      : [],
  } : null;

  const isLoading = isQueryLoading || createMutation.isPending;
  const isSaving = profileMutation.isPending || linksMutation.isPending;

  return {
    bioLinkData,
    isLoading,
    isError: isError && !createMutation.isPending,
    error,
    updateProfile,
    updateLinks,
    isSaving,
    createBioLink: handleCreateBioLink,
    needsCreation: !bioLink && !isQueryLoading && !createMutation.isPending,
  };
}