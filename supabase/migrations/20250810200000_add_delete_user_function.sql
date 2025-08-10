-- supabase/migrations/20250810200000_add_delete_user_function.sql

-- Habilita a extensão pgcrypto se ainda não estiver habilitada
create extension if not exists "pgcrypto" with schema "extensions";

-- Função para deletar um usuário e todos os seus dados
create or replace function public.delete_user_account()
returns void
language plpgsql
security definer
as $$
declare
  user_id_to_delete uuid := auth.uid();
  bio_link_ids uuid[];
begin
  -- Coleta os IDs dos bio_links do usuário
  select array_agg(id) into bio_link_ids from public.bio_links where user_id = user_id_to_delete;

  -- Deleta os cliques associados aos itens de bio_link
  if array_length(bio_link_ids, 1) > 0 then
    delete from public.url_clicks where bio_link_item_id in (select id from public.bio_link_items where bio_link_id = any(bio_link_ids));
  end if;

  -- Deleta os itens de bio_link
  if array_length(bio_link_ids, 1) > 0 then
    delete from public.bio_link_items where bio_link_id = any(bio_link_ids);
  end if;

  -- Deleta os social_links
  if array_length(bio_link_ids, 1) > 0 then
    delete from public.social_links where bio_link_id = any(bio_link_ids);
  end if;

  -- Deleta os bio_links
  delete from public.bio_links where user_id = user_id_to_delete;

  -- Deleta os cliques associados às URLs encurtadas
  delete from public.url_clicks where shortened_url_id in (select id from public.shortened_urls where user_id = user_id_to_delete);

  -- Deleta as URLs encurtadas
  delete from public.shortened_urls where user_id = user_id_to_delete;

  -- Deleta os papéis do usuário
  delete from public.user_roles where user_id = user_id_to_delete;

  -- Deleta o perfil do usuário
  delete from public.profiles where id = user_id_to_delete;

  -- Deleta o usuário do sistema de autenticação
  -- Isso precisa ser feito com a chave de serviço, então chamamos uma edge function ou fazemos no backend
  -- Por enquanto, vamos remover do auth.users
  delete from auth.users where id = user_id_to_delete;

end;
$$;

-- Garante que a função só pode ser chamada pelo próprio usuário
grant execute on function public.delete_user_account() to authenticated;