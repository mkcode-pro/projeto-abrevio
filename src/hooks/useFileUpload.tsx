import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface UseFileUploadOptions {
  bucket: string;
  maxSize?: number; // in bytes
  allowedTypes?: string[];
}

export function useFileUpload({
  bucket,
  maxSize = 5 * 1024 * 1024, // 5MB default
  allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"],
}: UseFileUploadOptions) {
  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const uploadFile = useCallback(async (file: File): Promise<string | null> => {
    if (!user) {
      toast.error("Você precisa estar logado para fazer upload.");
      return null;
    }

    // Validate file
    if (file.size > maxSize) {
      toast.error("Arquivo muito grande", { description: `O tamanho máximo é ${maxSize / 1024 / 1024}MB.` });
      return null;
    }
    if (!allowedTypes.includes(file.type)) {
      toast.error("Tipo de arquivo inválido", { description: "Por favor, selecione uma imagem." });
      return null;
    }

    setUploading(true);
    setProgress(0);

    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}/${Date.now()}.${fileExt}`;

      const { error } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (error) throw error;

      const { data } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      toast.success("Upload concluído!");
      return data.publicUrl;
    } catch (error: any) {
      toast.error("Erro no upload", { description: error.message });
      return null;
    } finally {
      setUploading(false);
      setProgress(100);
    }
  }, [user, bucket, maxSize, allowedTypes]);

  return {
    uploading,
    progress,
    uploadFile,
  };
}