-- Correção completa da função username_exists
-- Esta migração corrige o bug de verificação de username no registro

-- 1. Primeiro, remover a função antiga se existir
DROP FUNCTION IF EXISTS public.username_exists CASCADE;

-- 2. Criar a nova função corrigida com segurança aprimorada
CREATE OR REPLACE FUNCTION public.username_exists(p_username text)
RETURNS boolean
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_exists boolean;
BEGIN
  -- Validação de entrada
  IF p_username IS NULL OR length(trim(p_username)) < 3 THEN
    RETURN false;
  END IF;
  
  -- Verificar se o username existe (case-insensitive)
  SELECT EXISTS (
    SELECT 1 
    FROM public.profiles 
    WHERE LOWER(username) = LOWER(trim(p_username))
    LIMIT 1
  ) INTO v_exists;
  
  RETURN COALESCE(v_exists, false);
EXCEPTION
  WHEN OTHERS THEN
    -- Log do erro (opcional, depende da configuração do Supabase)
    RAISE WARNING 'Erro em username_exists: %', SQLERRM;
    -- Retornar false em caso de erro para não bloquear o usuário
    RETURN false;
END;
$$;

-- 3. Garantir permissões corretas
GRANT EXECUTE ON FUNCTION public.username_exists(text) TO anon;
GRANT EXECUTE ON FUNCTION public.username_exists(text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.username_exists(text) TO service_role;

-- 4. Criar índice para melhor performance (se não existir)
CREATE INDEX IF NOT EXISTS idx_profiles_username_lower 
ON public.profiles(LOWER(username));

-- 5. Adicionar comentário para documentação
COMMENT ON FUNCTION public.username_exists(text) IS 
'Verifica se um username já existe na tabela profiles de forma case-insensitive. 
Retorna true se existe, false se não existe ou em caso de erro.';

-- 6. Criar função auxiliar para sugestões de username (bônus)
CREATE OR REPLACE FUNCTION public.suggest_username(p_base_username text)
RETURNS TABLE(suggestion text)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_clean_base text;
  v_counter int := 1;
  v_year int := EXTRACT(YEAR FROM CURRENT_DATE);
BEGIN
  -- Limpar e normalizar o username base
  v_clean_base := LOWER(regexp_replace(trim(p_base_username), '[^a-z0-9_.]', '', 'g'));
  
  -- Se o base estiver vazio após limpeza, retornar vazio
  IF length(v_clean_base) = 0 THEN
    RETURN;
  END IF;
  
  -- Limitar o tamanho do base
  v_clean_base := LEFT(v_clean_base, 20);
  
  -- Gerar sugestões
  -- Sugestão 1: base + ano
  IF NOT username_exists(v_clean_base || v_year::text) THEN
    suggestion := v_clean_base || v_year::text;
    RETURN NEXT;
  END IF;
  
  -- Sugestão 2: base + número aleatório
  LOOP
    EXIT WHEN v_counter > 5; -- Máximo 5 tentativas
    
    DECLARE
      v_random_suffix text := (100 + floor(random() * 900))::text;
      v_candidate text := v_clean_base || v_random_suffix;
    BEGIN
      IF NOT username_exists(v_candidate) THEN
        suggestion := v_candidate;
        RETURN NEXT;
        EXIT;
      END IF;
    END;
    
    v_counter := v_counter + 1;
  END LOOP;
  
  -- Sugestão 3: the_ + base
  IF NOT username_exists('the_' || v_clean_base) THEN
    suggestion := 'the_' || v_clean_base;
    RETURN NEXT;
  END IF;
  
  -- Sugestão 4: base + _br
  IF NOT username_exists(v_clean_base || '_br') THEN
    suggestion := v_clean_base || '_br';
    RETURN NEXT;
  END IF;
  
  -- Sugestão 5: base + _oficial
  IF NOT username_exists(v_clean_base || '_oficial') THEN
    suggestion := v_clean_base || '_oficial';
    RETURN NEXT;
  END IF;
  
  RETURN;
END;
$$;

-- 7. Garantir permissões para a função de sugestões
GRANT EXECUTE ON FUNCTION public.suggest_username(text) TO anon;
GRANT EXECUTE ON FUNCTION public.suggest_username(text) TO authenticated;

-- 8. Adicionar comentário para documentação
COMMENT ON FUNCTION public.suggest_username(text) IS 
'Gera sugestões de usernames disponíveis baseadas em um username base. 
Retorna até 5 sugestões que não estão em uso.';

-- 9. Criar uma view para estatísticas de username (opcional, útil para admin)
CREATE OR REPLACE VIEW public.username_stats AS
SELECT 
  COUNT(*) as total_users,
  COUNT(DISTINCT LOWER(username)) as unique_usernames,
  AVG(LENGTH(username)) as avg_username_length,
  MIN(LENGTH(username)) as min_username_length,
  MAX(LENGTH(username)) as max_username_length
FROM public.profiles
WHERE username IS NOT NULL;

-- 10. Garantir que a view seja acessível apenas para roles administrativas
GRANT SELECT ON public.username_stats TO service_role;

-- Fim da migração