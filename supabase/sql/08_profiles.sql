create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  full_name text,
  role text not null check (role in ('admin', 'manager', 'viewer')) default 'viewer',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.handle_new_auth_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data ->> 'full_name')
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

do $$
begin
  if not exists (select 1 from pg_trigger where tgname = 'trg_auth_user_created') then
    create trigger trg_auth_user_created
      after insert on auth.users
      for each row execute function public.handle_new_auth_user();
  end if;

  if not exists (select 1 from pg_trigger where tgname = 'trg_profiles_set_updated_at') then
    create trigger trg_profiles_set_updated_at
      before update on public.profiles
      for each row execute function public.set_updated_at();
  end if;
end $$;
