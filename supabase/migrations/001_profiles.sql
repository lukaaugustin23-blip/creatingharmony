-- Run this in your Supabase SQL editor

create table if not exists public.profiles (
  id                   uuid primary key references auth.users(id) on delete cascade,
  agency_name          text,
  team_size            text,
  manages              text[],
  stripe_intent        text default 'skip',
  theme                text default 'obsidian',
  onboarding_completed boolean not null default false,
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "users_select_own_profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "users_insert_own_profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "users_update_own_profile"
  on public.profiles for update
  using (auth.uid() = id);
