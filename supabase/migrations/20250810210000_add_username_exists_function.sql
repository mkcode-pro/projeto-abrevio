-- Função para verificar se um nome de usuário já existe
-- Garante que a função pode acessar a tabela 'profiles' de forma segura
create or replace function public.username_exists(p_username text)
returns boolean
language plpgsql
stable
security definer
set search_path = '' -- Medida de segurança para evitar ataques
as $$
begin
  -- Usando "public.profiles" para ser explícito e evitar problemas de search_path
  return exists(select 1 from public.profiles where username = p_username);
end;
$$;