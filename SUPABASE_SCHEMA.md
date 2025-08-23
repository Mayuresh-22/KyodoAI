# Supabase Database Schema

Create the following tables in your Supabase database to support the Kyodo AI application:

## 1. emails table

```sql
create table public.emails (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users not null,
  email_id text unique not null,
  from_email text not null,
  from_name text,
  subject text,
  body text,
  snippet text,
  received_at timestamp with time zone,
  thread_id text,
  labels text[],
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- RLS Policy: Users can only access their own emails
alter table public.emails enable row level security;

create policy "Users can view their own emails"
  on public.emails for select
  using (auth.uid() = user_id);

create policy "Users can insert their own emails"
  on public.emails for insert
  with check (auth.uid() = user_id);
```

## 2. deals table

```sql
create table public.deals (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users not null,
  title text not null,
  company text not null,
  summary text,
  budget numeric,
  status text check (status in ('Pending', 'Active', 'Completed')) default 'Pending',
  is_ai_active boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone
);

-- RLS Policy: Users can only access their own deals
alter table public.deals enable row level security;

create policy "Users can view their own deals"
  on public.deals for select
  using (auth.uid() = user_id);

create policy "Users can insert their own deals"
  on public.deals for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own deals"
  on public.deals for update
  using (auth.uid() = user_id);
```

## 3. messages table

```sql
create table public.messages (
  id uuid primary key default uuid_generate_v4(),
  deal_id uuid references public.deals not null,
  user_id uuid references auth.users not null,
  type text check (type in ('user', 'ai', 'timeline')) not null,
  content text not null,
  suggested_actions jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- RLS Policy: Users can only access messages for their own deals
alter table public.messages enable row level security;

create policy "Users can view their own messages"
  on public.messages for select
  using (
    auth.uid() in (
      select user_id from public.deals where id = messages.deal_id
    )
  );

create policy "Users can insert messages for their own deals"
  on public.messages for insert
  with check (
    auth.uid() in (
      select user_id from public.deals where id = messages.deal_id
    )
  );
```

## 4. Foreign Key Index (for performance)

```sql
-- Add indexes for foreign keys to improve performance
create index emails_user_id_idx on public.emails (user_id);
create index deals_user_id_idx on public.deals (user_id);
create index messages_deal_id_idx on public.messages (deal_id);
create index messages_user_id_idx on public.messages (user_id);
```

## 5. Trigger to update `updated_at` timestamp in deals table

```sql
-- Function to update the updated_at timestamp
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Add trigger to deals table
create trigger update_deals_updated_at
before update on public.deals
for each row
execute function update_updated_at_column();
```

## 6. Optional: profiles table (if you need custom user data)

```sql
create table public.profiles (
  id uuid references auth.users primary key,
  full_name text,
  email text unique,
  content_niche text,
  min_budget text,
  max_budget text,
  auto_generate_invoice boolean default false,
  guidelines text,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone
);

-- RLS Policy: Users can only access their own profile
alter table public.profiles enable row level security;

create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Trigger to create a profile entry when a new user signs up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, email)
  values (new.id, new.raw_user_meta_data->>'full_name', new.email);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
```

This schema provides a complete structure for the Kyodo AI application with proper Row Level Security (RLS) policies to ensure data isolation between users.
