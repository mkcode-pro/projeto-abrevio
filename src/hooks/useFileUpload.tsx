import { useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";

interface UseFileUploadOptions {
  maxSize?: number; // in bytes
  allowedTypes?: string[];
  onSuccess?: (file: File, url: string) => void;
  onError?: (error: string) => void;
}

export function useFileUpload({
  maxSize = 5 * 1024 * 1024, // 5MB default
  allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"],
  onSuccess,
  onError
}: UseFileUploadOptions = {}) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const { toast } = useToast();

  const validateFile = useCallback((file: File): string | null => {
    if (file.size > maxSize) {
      return `Arquivo muito grande. Máximo ${(maxSize / (1024 * 1024)).toFixed(1)}MB`;
    }

    if (!allowedTypes.includes(file.type)) {
      return "Tipo de arquivo não suportado. Use JPG, PNG, GIF ou WebP";
    }

    return null;
  }, [maxSize, allowedTypes]);

  const uploadFile = useCallback(async (file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      toast({
        title: "Erro no arquivo",
        description: validationError,
        variant: "destructive"
      });
      onError?.(validationError);
      return null;
    }

    setUploading(true);

    try {
      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Simulate upload (replace with real upload logic)
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate a mock URL (in real app, this would come from your storage service)
      const mockUrl = URL.createObjectURL(file);
      
      toast({
        title: "Upload realizado",
        description: "Arquivo enviado com sucesso!",
      });

      onSuccess?.(file, mockUrl);
      return mockUrl;
    } catch (error) {
      const errorMessage = "Erro ao fazer upload do arquivo";
      toast({
        title: "Erro no upload",
        description: errorMessage,
        variant: "destructive"
      });
      onError?.(errorMessage);
      return null;
    } finally {
      setUploading(false);
    }
  }, [validateFile, toast, onSuccess, onError]);

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      uploadFile(file);
    }
  }, [uploadFile]);

  const clearPreview = useCallback(() => {
    setPreview(null);
  }, []);

  return {
    uploading,
    preview,
    uploadFile,
    handleFileSelect,
    clearPreview,
    validateFile
  };
}