create or replace function public.username_exists(p_username text)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  -- Compara os nomes de usuário em minúsculas para ser case-insensitive
  return exists(select 1 from public.profiles where lower(username) = lower(p_username));
end;
$$;

grant execute on function public.username_exists(text) to anon;
grant execute on function public.username_exists(text) to authenticated;