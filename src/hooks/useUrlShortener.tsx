import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { logger } from "@/lib/logger";

export interface ShortenedUrl {
  id: string;
  original_url: string;
  short_code: string;
  title?: string | null;
  click_count: number;
  created_at: string;
  is_active: boolean;
  qr_code_url?: string | null;
}

// Buscar URLs encurtadas do usuário
const fetchUrls = async (userId: string) => {
  const { data, error } = await supabase
    .from("shortened_urls")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data || [];
};

// Criar nova URL encurtada
const createShortenedUrl = async ({
  original_url,
  short_code,
  title,
  user_id,
}: {
  original_url: string;
  short_code?: string;
  title?: string;
  user_id: string;
}) => {
  // Gerar código aleatório se não fornecido
  let code = short_code;
  if (!code) {
    code = Math.random().toString(36).substring(2, 8);
  }
  
  // Verificar se o código já existe
  const { data: existing } = await supabase
    .from("shortened_urls")
    .select("short_code")
    .eq("short_code", code)
    .single();
    
  if (existing) {
    throw new Error("Este código personalizado já está em uso.");
  }
  
  const { data, error } = await supabase
    .from("shortened_urls")
    .insert({
      original_url,
      short_code: code,
      title,
      user_id,
    })
    .select()
    .single();

  if (error) {
    if (error.code === '23505') { // Unique constraint violation
      throw new Error("Este código personalizado já está em uso.");
    }
    throw new Error(error.message);
  }
  return data;
};

// Deletar URL encurtada
const deleteShortenedUrl = async (id: string) => {
  const { error } = await supabase.from("shortened_urls").delete().eq("id", id);
  if (error) throw new Error(error.message);
};

// Incrementar contador de cliques
const incrementClickCount = async (shortCode: string) => {
  // Primeiro, buscar a URL
  const { data: url, error: fetchError } = await supabase
    .from("shortened_urls")
    .select("*")
    .eq("short_code", shortCode)
    .eq("is_active", true)
    .single();

  if (fetchError || !url) {
    throw new Error("Link não encontrado ou inativo");
  }

  // Incrementar contador
  const { error: updateError } = await supabase
    .from("shortened_urls")
    .update({ click_count: (url.click_count || 0) + 1 })
    .eq("id", url.id);

  if (updateError) {
    logger.error('Erro ao incrementar contador', updateError);
  }

  // Registrar clique para analytics
  const { error: clickError } = await supabase
    .from("url_clicks")
    .insert({
      shortened_url_id: url.id,
      ip_address: null, // Por privacidade, não vamos coletar IP
      user_agent: navigator.userAgent,
      referrer: document.referrer || null,
      clicked_at: new Date().toISOString(),
    });

  if (clickError) {
    logger.error('Erro ao registrar clique', clickError);
  }

  return url.original_url;
};

export function useUrlShortener() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: urls, isLoading: isLoadingUrls } = useQuery({
    queryKey: ["shortenedUrls", user?.id],
    queryFn: () => fetchUrls(user!.id),
    enabled: !!user,
  });

  const { mutate: shortenUrl, isPending: isCreating } = useMutation({
    mutationFn: createShortenedUrl,
    onSuccess: () => {
      toast.success("URL encurtada com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["shortenedUrls", user?.id] });
      queryClient.invalidateQueries({ queryKey: ["dashboardStats", user?.id] });
    },
    onError: (error) => {
      toast.error("Erro ao encurtar URL", { description: error.message });
    },
  });

  const { mutate: deleteUrl, isPending: isDeleting } = useMutation({
    mutationFn: deleteShortenedUrl,
    onSuccess: () => {
      toast.success("URL removida com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["shortenedUrls", user?.id] });
      queryClient.invalidateQueries({ queryKey: ["dashboardStats", user?.id] });
    },
    onError: (error) => {
      toast.error("Erro ao remover URL", { description: error.message });
    },
  });

  const handleShortenUrl = (vars: { 
    original_url: string; 
    short_code?: string; 
    title?: string; 
  }) => {
    if (!user) {
      toast.error("Você precisa estar logado para encurtar URLs");
      return;
    }
    shortenUrl({ ...vars, user_id: user.id });
  };

  return {
    urls: urls || [],
    isLoadingUrls,
    shortenUrl: handleShortenUrl,
    isCreating,
    deleteUrl,
    isDeleting,
    incrementClickCount, // Exportar para uso em redirecionamentos
  };
}