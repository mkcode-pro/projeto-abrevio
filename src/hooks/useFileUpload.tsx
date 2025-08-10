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
      toast.error("Arquivo muito grande", { 
        description: `O tamanho máximo é ${Math.round(maxSize / 1024 / 1024)}MB.` 
      });
      return null;
    }
    
    if (!allowedTypes.includes(file.type)) {
      toast.error("Tipo de arquivo inválido", { 
        description: "Por favor, selecione uma imagem válida." 
      });
      return null;
    }

    setUploading(true);
    setProgress(0);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;

      // Simular progresso
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90));
      }, 100);

      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true, // Permite sobrescrever
        });

      clearInterval(progressInterval);
      setProgress(100);

      if (error) {
        throw error;
      }

      // Obter URL pública
      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(fileName);

      toast.success("Upload concluído com sucesso!");
      return publicUrl;
    } catch (error: any) {
      toast.error("Erro no upload", { 
        description: error.message || "Não foi possível fazer upload do arquivo." 
      });
      return null;
    } finally {
      setUploading(false);
      setProgress(0);
    }
  }, [user, bucket, maxSize, allowedTypes]);

  return {
    uploading,
    progress,
    uploadFile,
  };
}