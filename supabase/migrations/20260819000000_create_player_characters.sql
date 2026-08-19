create table if not exists public.characters (
  user_id uuid not null references auth.users(id) on delete cascade,
  id text not null,
  data jsonb not null,
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  primary key (user_id, id)
);

create index if not exists characters_user_updated_idx on public.characters(user_id, updated_at desc);

alter table public.characters enable row level security;

create policy "Players can view their own characters" on public.characters for select to authenticated using ((select auth.uid()) = user_id);
create policy "Players can create their own characters" on public.characters for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "Players can update their own characters" on public.characters for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "Players can delete their own characters" on public.characters for delete to authenticated using ((select auth.uid()) = user_id);

grant select, insert, update, delete on public.characters to authenticated;
revoke all on public.characters from anon;
