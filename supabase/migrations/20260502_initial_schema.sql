-- investments table
create table public.investments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  symbol text not null,
  name text not null,
  shares numeric not null,
  purchase_price numeric not null,
  date_added date not null default current_date,
  created_at timestamptz default now()
);

alter table public.investments enable row level security;

create policy "Users see own investments"
  on public.investments for select
  using (auth.uid() = user_id);

create policy "Users insert own investments"
  on public.investments for insert
  with check (auth.uid() = user_id);

create policy "Users update own investments"
  on public.investments for update
  using (auth.uid() = user_id);

create policy "Users delete own investments"
  on public.investments for delete
  using (auth.uid() = user_id);

-- expenses table
create table public.expenses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  amount numeric not null,
  category text not null,
  date date not null,
  created_at timestamptz default now()
);

alter table public.expenses enable row level security;

create policy "Users see own expenses"
  on public.expenses for select
  using (auth.uid() = user_id);

create policy "Users insert own expenses"
  on public.expenses for insert
  with check (auth.uid() = user_id);

create policy "Users update own expenses"
  on public.expenses for update
  using (auth.uid() = user_id);

create policy "Users delete own expenses"
  on public.expenses for delete
  using (auth.uid() = user_id);

-- income table
create table public.income (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  amount numeric not null,
  category text check (category in ('Salary', 'Bonus', 'Investment', 'Other')) not null,
  date date not null,
  created_at timestamptz default now()
);

alter table public.income enable row level security;

create policy "Users see own income"
  on public.income for select
  using (auth.uid() = user_id);

create policy "Users insert own income"
  on public.income for insert
  with check (auth.uid() = user_id);

create policy "Users update own income"
  on public.income for update
  using (auth.uid() = user_id);

create policy "Users delete own income"
  on public.income for delete
  using (auth.uid() = user_id);
