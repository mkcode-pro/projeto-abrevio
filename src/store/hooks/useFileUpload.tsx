import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/store/contexts/AuthContext";
import { toast } from "sonner";
import { optimizeImage, validateImageFile, createImagePreview } from "@/lib/imageOptimizer";
import { logger } from "@/lib/logger";

interface UseFileUploadOptions {
  bucket: string;
  maxSize?: number; // in bytes
  allowedTypes?: string[];
  optimize?: boolean; // se deve otimizar a imagem
}

export function useFileUpload({
  bucket,
  maxSize = 5 * 1024 * 1024, // 5MB default
  allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"],
  optimize = true, // otimização ativada por padrão
}: UseFileUploadOptions) {
  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [preview, setPreview] = useState<string | null>(null);

  const uploadFile = useCallback(async (file: File): Promise<string | null> => {
    if (!user) {
      toast.error("Você precisa estar logado para fazer upload.");
      return null;
    }

    // Validar arquivo
    const validation = validateImageFile(file);
    if (!validation.valid) {
      toast.error(validation.error || "Arquivo inválido");
      return null;
    }

    setUploading(true);
    setProgress(0);

    try {
      // Criar preview
      const previewUrl = await createImagePreview(file);
      setPreview(previewUrl);
      setProgress(20);

      // Deletar fotos antigas ANTES de fazer upload da nova
      toast.info("Removendo foto anterior...");
      
      // Função inline para deletar fotos antigas
      try {
        const { data: files, error: listError } = await supabase.storage
          .from(bucket)
          .list(user.id, {
            limit: 100,
          });

        if (!listError && files && files.length > 0) {
          const filesToDelete = files.map(file => `${user.id}/${file.name}`);
          
          const { error: deleteError } = await supabase.storage
            .from(bucket)
            .remove(filesToDelete);

          if (!deleteError) {
            logger.info('Fotos antigas removidas', { count: files.length });
          }
        }
      } catch (error) {
        logger.warn('Erro ao limpar fotos antigas', error);
      }
      
      setProgress(30);

      // Otimizar imagem se necessário
      let fileToUpload = file;
      if (optimize && file.type.startsWith('image/')) {
        toast.info("Otimizando imagem...");
        
        fileToUpload = await optimizeImage(file, {
          maxWidth: 800,
          maxHeight: 800,
          quality: 0.85,
          format: 'jpeg'
        });
        
        // Mostrar economia de tamanho
        const savedBytes = file.size - fileToUpload.size;
        if (savedBytes > 0) {
          const savedMB = (savedBytes / 1024 / 1024).toFixed(2);
          toast.success(`Imagem otimizada! Economizados ${savedMB}MB`);
        }
        
        setProgress(50);
      }

      // Gerar nome único para o arquivo
      const fileExt = optimize ? 'jpg' : file.name.split('.').pop();
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(7);
      const fileName = `${user.id}/${timestamp}_${randomString}.${fileExt}`;

      setProgress(70);

      // Upload para o Supabase
      logger.debug('Iniciando upload', { bucket });
      logger.debug('Upload do arquivo', { fileName });
      
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(fileName, fileToUpload, {
          cacheControl: '3600',
          upsert: false, // não sobrescrever arquivos existentes
        });

      setProgress(90);

      if (error) {
        logger.error('Erro detalhado do Supabase', error);
        
        // Verificar se é erro de bucket não existente
        if (error.message?.includes('not found') || error.message?.includes('Bucket not found')) {
          throw new Error('O espaço de armazenamento não está configurado. Por favor, contate o suporte.');
        }
        
        // Verificar se é erro de permissão
        if (error.message?.includes('policy') || error.message?.includes('permission')) {
          throw new Error('Sem permissão para fazer upload. Verifique se você está logado.');
        }
        
        throw error;
      }

      logger.info('Upload bem sucedido', { path: data?.path });

      // Obter URL pública
      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(fileName);

      logger.debug('URL pública gerada', { publicUrl });
      
      setProgress(100);
      
      toast.success("Upload concluído com sucesso!");
      return publicUrl;
      
    } catch (error) {
      logger.error('Erro no upload', error);
      toast.error("Erro no upload", { 
        description: error instanceof Error ? error.message : "Não foi possível fazer upload do arquivo." 
      });
      return null;
    } finally {
      setUploading(false);
      setProgress(0);
      // Manter o preview por alguns segundos antes de limpar
      setTimeout(() => setPreview(null), 3000);
    }
  }, [user, bucket, optimize]);

  return {
    uploading,
    progress,
    uploadFile,
    preview,
  };
}