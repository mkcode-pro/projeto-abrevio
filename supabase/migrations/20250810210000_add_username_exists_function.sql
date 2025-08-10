-- Função para verificar se um nome de usuário já existe
-- Garante que a função pode acessar a tabela 'profiles' de forma segura
create or replace function public.username_exists(p_username text)
returns boolean
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  return exists(select 1 from profiles where username = p_username);
end;
$$;