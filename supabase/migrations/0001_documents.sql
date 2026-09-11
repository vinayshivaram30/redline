-- Task 3 (tasks/plan.md): documents table + extracted text storage.
-- Only the client-parsed text is stored, never the original file
-- (CLAUDE.md: "the original file never leaves the client").

create table public.documents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  title text not null,
  doc_type text not null check (doc_type in ('freelance_contract', 'lease')),
  source_text text not null,
  created_at timestamptz not null default now()
);

alter table public.documents enable row level security;

create policy "documents_select_own"
  on public.documents for select
  using (auth.uid() = user_id);

create policy "documents_insert_own"
  on public.documents for insert
  with check (auth.uid() = user_id);

create policy "documents_update_own"
  on public.documents for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "documents_delete_own"
  on public.documents for delete
  using (auth.uid() = user_id);
