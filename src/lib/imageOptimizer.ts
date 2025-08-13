/**
 * Utilitário para otimizar imagens antes do upload
 * Reduz o tamanho sem perder muita qualidade
 */

interface ImageOptimizerOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  format?: 'jpeg' | 'webp' | 'png';
}

/**
 * Otimiza uma imagem reduzindo seu tamanho e comprimindo
 */
export async function optimizeImage(
  file: File,
  options: ImageOptimizerOptions = {}
): Promise<File> {
  const {
    maxWidth = 800,
    maxHeight = 800,
    quality = 0.85,
    format = 'jpeg'
  } = options;

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();

      img.onload = () => {
        // Criar canvas para redimensionar
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          reject(new Error('Não foi possível criar o contexto do canvas'));
          return;
        }

        // Calcular novo tamanho mantendo proporção
        let { width, height } = img;
        
        if (width > maxWidth || height > maxHeight) {
          const aspectRatio = width / height;
          
          if (width > height) {
            width = maxWidth;
            height = width / aspectRatio;
          } else {
            height = maxHeight;
            width = height * aspectRatio;
          }
        }

        // Definir tamanho do canvas
        canvas.width = width;
        canvas.height = height;

        // Desenhar imagem redimensionada
        ctx.drawImage(img, 0, 0, width, height);

        // Converter para blob
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Erro ao processar imagem'));
              return;
            }

            // Criar novo arquivo com o blob otimizado
            const optimizedFile = new File(
              [blob],
              file.name.replace(/\.[^/.]+$/, `.${format}`),
              { type: `image/${format}` }
            );

            resolve(optimizedFile);
          },
          `image/${format}`,
          quality
        );
      };

      img.onerror = () => reject(new Error('Erro ao carregar imagem'));
      img.src = e.target?.result as string;
    };

    reader.onerror = () => reject(new Error('Erro ao ler arquivo'));
    reader.readAsDataURL(file);
  });
}

/**
 * Valida se o arquivo é uma imagem válida
 */
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  // Verificar tipo MIME - Aceita todos os formatos de imagem comuns
  const validTypes = [
    'image/jpeg',
    'image/jpg', 
    'image/png',
    'image/gif',
    'image/webp',
    'image/heic',     // Formato padrão do iOS
    'image/heif',     // Formato padrão do iOS
    'image/bmp',      // Bitmap
    'image/svg+xml',  // SVG
    'image/tiff',     // TIFF
    'image/avif',     // Formato moderno
    'image/apng',     // PNG animado
  ];
  
  // Verificar se é qualquer tipo de imagem
  if (!file.type.startsWith('image/')) {
    return { 
      valid: false, 
      error: 'Por favor, selecione um arquivo de imagem' 
    };
  }

  // Verificar tamanho (max 10MB para arquivo original)
  const maxSize = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSize) {
    return { 
      valid: false, 
      error: 'A imagem é muito grande. O tamanho máximo é 10MB' 
    };
  }

  return { valid: true };
}

/**
 * Gera um preview da imagem para mostrar antes do upload
 */
export function createImagePreview(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target?.result as string);
    reader.onerror = () => reject(new Error('Erro ao criar preview'));
    reader.readAsDataURL(file);
  });
}