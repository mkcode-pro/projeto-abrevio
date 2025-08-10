create or replace function public.username_exists(p_username text)
returns boolean
language plpgsql
security definer
as $$
begin
  return exists(select 1 from public.profiles where username = p_username);
end;
$$;

grant execute on function public.username_exists(text) to anon;
grant execute on function public.username_exists(text) to authenticated;