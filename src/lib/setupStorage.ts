/**
 * Script para configurar o Supabase Storage
 * Este arquivo ajuda a criar e configurar o bucket de avatares
 */

import { supabase } from "@/integrations/supabase/client";

export async function setupAvatarsBucket() {
  try {
    // Verificar se o bucket existe
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      console.error("Erro ao listar buckets:", listError);
      return false;
    }

    const avatarsBucket = buckets?.find(bucket => bucket.name === 'avatars');
    
    if (!avatarsBucket) {
      console.log("Bucket 'avatars' não encontrado. Criando...");
      
      // Criar o bucket
      const { data, error: createError } = await supabase.storage.createBucket('avatars', {
        public: true, // Tornar público para permitir visualização das imagens
        fileSizeLimit: 5242880, // 5MB
        allowedMimeTypes: ['image/*'] // Aceitar qualquer tipo de imagem
      });

      if (createError) {
        console.error("Erro ao criar bucket:", createError);
        
        // Se o erro for que já existe, não é problema
        if (createError.message?.includes('already exists')) {
          console.log("Bucket já existe!");
          return true;
        }
        return false;
      }

      console.log("Bucket 'avatars' criado com sucesso!");
      return true;
    }

    console.log("Bucket 'avatars' já existe!");
    return true;
  } catch (error) {
    console.error("Erro ao configurar storage:", error);
    return false;
  }
}

// Função para testar se o upload está funcionando
export async function testUpload() {
  try {
    // Criar um arquivo de teste
    const testFile = new File(['teste'], 'test.txt', { type: 'text/plain' });
    
    const { data, error } = await supabase.storage
      .from('avatars')
      .upload(`test/test-${Date.now()}.txt`, testFile);

    if (error) {
      console.error("Erro no teste de upload:", error);
      return false;
    }

    console.log("Teste de upload bem sucedido!");
    return true;
  } catch (error) {
    console.error("Erro no teste:", error);
    return false;
  }
}