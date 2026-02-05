-- Create profiles table
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text,
  currency text default 'USD',
  created_at timestamp with time zone default now()
);

alter table public.profiles enable row level security;

create policy "profiles_select_own" on public.profiles for select using (auth.uid() = id);
create policy "profiles_insert_own" on public.profiles for insert with check (auth.uid() = id);
create policy "profiles_update_own" on public.profiles for update using (auth.uid() = id);
create policy "profiles_delete_own" on public.profiles for delete using (auth.uid() = id);

-- Create accounts table
create table if not exists public.accounts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  type text not null check (type in ('salary', 'freelance', 'debit', 'cash', 'savings', 'custom')),
  balance decimal(12, 2) default 0,
  color text default '#3B82F6',
  icon text default 'wallet',
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

alter table public.accounts enable row level security;

create policy "accounts_select_own" on public.accounts for select using (auth.uid() = user_id);
create policy "accounts_insert_own" on public.accounts for insert with check (auth.uid() = user_id);
create policy "accounts_update_own" on public.accounts for update using (auth.uid() = user_id);
create policy "accounts_delete_own" on public.accounts for delete using (auth.uid() = user_id);

-- Create categories table
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  name text not null,
  type text not null check (type in ('income', 'expense')),
  color text default '#3B82F6',
  icon text default 'tag',
  is_default boolean default false,
  created_at timestamp with time zone default now()
);

alter table public.categories enable row level security;

create policy "categories_select_own" on public.categories for select using (auth.uid() = user_id or is_default = true);
create policy "categories_insert_own" on public.categories for insert with check (auth.uid() = user_id);
create policy "categories_update_own" on public.categories for update using (auth.uid() = user_id);
create policy "categories_delete_own" on public.categories for delete using (auth.uid() = user_id);

-- Create transactions table
create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  account_id uuid not null references public.accounts(id) on delete cascade,
  to_account_id uuid references public.accounts(id) on delete set null,
  category_id uuid references public.categories(id) on delete set null,
  type text not null check (type in ('income', 'expense', 'transfer')),
  amount decimal(12, 2) not null,
  description text,
  date timestamp with time zone default now(),
  created_at timestamp with time zone default now()
);

alter table public.transactions enable row level security;

create policy "transactions_select_own" on public.transactions for select using (auth.uid() = user_id);
create policy "transactions_insert_own" on public.transactions for insert with check (auth.uid() = user_id);
create policy "transactions_update_own" on public.transactions for update using (auth.uid() = user_id);
create policy "transactions_delete_own" on public.transactions for delete using (auth.uid() = user_id);

-- Create checklists table
create table if not exists public.checklists (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  price decimal(12, 2),
  category_id uuid references public.categories(id) on delete set null,
  frequency text not null check (frequency in ('one-time', 'daily', 'weekly', 'monthly')),
  is_completed boolean default false,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

alter table public.checklists enable row level security;

create policy "checklists_select_own" on public.checklists for select using (auth.uid() = user_id);
create policy "checklists_insert_own" on public.checklists for insert with check (auth.uid() = user_id);
create policy "checklists_update_own" on public.checklists for update using (auth.uid() = user_id);
create policy "checklists_delete_own" on public.checklists for delete using (auth.uid() = user_id);

-- Create trigger for auto-creating profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'name', null)
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

-- Insert default categories
insert into public.categories (id, user_id, name, type, color, icon, is_default) values
  (gen_random_uuid(), null, 'Salary', 'income', '#22C55E', 'briefcase', true),
  (gen_random_uuid(), null, 'Freelance', 'income', '#3B82F6', 'laptop', true),
  (gen_random_uuid(), null, 'Investment', 'income', '#8B5CF6', 'trending-up', true),
  (gen_random_uuid(), null, 'Gift', 'income', '#EC4899', 'gift', true),
  (gen_random_uuid(), null, 'Food', 'expense', '#F97316', 'utensils', true),
  (gen_random_uuid(), null, 'Rent', 'expense', '#EF4444', 'home', true),
  (gen_random_uuid(), null, 'Transport', 'expense', '#14B8A6', 'car', true),
  (gen_random_uuid(), null, 'Subscriptions', 'expense', '#6366F1', 'credit-card', true),
  (gen_random_uuid(), null, 'Shopping', 'expense', '#F472B6', 'shopping-bag', true),
  (gen_random_uuid(), null, 'Utilities', 'expense', '#FACC15', 'zap', true),
  (gen_random_uuid(), null, 'Entertainment', 'expense', '#A855F7', 'film', true),
  (gen_random_uuid(), null, 'Health', 'expense', '#10B981', 'heart', true)
on conflict do nothing;
