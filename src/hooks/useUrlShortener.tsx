import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export interface ShortenedUrl {
  id: string;
  original_url: string;
  short_code: string;
  title?: string | null;
  click_count: number;
  created_at: string;
  is_active: boolean;
}

// Fetch user's shortened URLs
const fetchUrls = async (userId: string) => {
  const { data, error } = await supabase
    .from("shortened_urls")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data;
};

// Create a new shortened URL
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
  const code = short_code || Math.random().toString(36).substring(2, 8);
  
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

// Delete a shortened URL
const deleteShortenedUrl = async (id: string) => {
  const { error } = await supabase.from("shortened_urls").delete().eq("id", id);
  if (error) throw new Error(error.message);
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

  return {
    urls: urls || [],
    isLoadingUrls,
    shortenUrl: (vars: { original_url: string; short_code?: string; title?: string; }) => {
      if (!user) return;
      shortenUrl({ ...vars, user_id: user.id });
    },
    isCreating,
    deleteUrl,
    isDeleting,
  };
}