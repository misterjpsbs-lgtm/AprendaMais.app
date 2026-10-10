create type public.app_role as enum ('admin');
create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role app_role not null,
  unique (user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;
create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean language sql stable security definer set search_path = public
as $$ select exists (select 1 from public.user_roles where user_id = _user_id and role = _role) $$;
create policy "own roles" on public.user_roles for select to authenticated using (user_id = auth.uid());

create or replace function public.handle_first_admin()
returns trigger language plpgsql security definer set search_path = public
as $$ begin
  if not exists (select 1 from public.user_roles where role = 'admin') then
    insert into public.user_roles(user_id, role) values (new.id, 'admin');
  end if;
  return new;
end $$;
create trigger on_auth_user_first_admin after insert on auth.users
for each row execute function public.handle_first_admin();

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);
grant select on public.categories to anon, authenticated;
grant insert, update, delete on public.categories to authenticated;
grant all on public.categories to service_role;
alter table public.categories enable row level security;
create policy "public read categories" on public.categories for select to anon, authenticated using (true);
create policy "admin write categories" on public.categories for all to authenticated
  using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

create table public.courses (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  short_description text,
  description text,
  image_url text,
  price numeric(10,2),
  affiliate_url text,
  category_id uuid references public.categories(id) on delete set null,
  featured boolean not null default false,
  published boolean not null default true,
  is_demo boolean not null default false,
  created_at timestamptz not null default now()
);
grant select on public.courses to anon, authenticated;
grant insert, update, delete on public.courses to authenticated;
grant all on public.courses to service_role;
alter table public.courses enable row level security;
create policy "public read published" on public.courses for select to anon, authenticated
  using (published or public.has_role(auth.uid(),'admin'));
create policy "admin write courses" on public.courses for all to authenticated
  using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

create table public.events (
  id bigint generated always as identity primary key,
  type text not null check (type in ('view','click')),
  path text,
  course_id uuid references public.courses(id) on delete cascade,
  created_at timestamptz not null default now()
);
grant insert on public.events to anon, authenticated;
grant select on public.events to authenticated;
grant all on public.events to service_role;
alter table public.events enable row level security;
create policy "anyone log events" on public.events for insert to anon, authenticated
  with check (type in ('view','click') and (path is null or length(path) < 300));
create policy "admin read events" on public.events for select to authenticated using (public.has_role(auth.uid(),'admin'));

insert into public.categories (name, slug, sort_order) values
('Marketing Digital','marketing-digital',1),
('Inteligência Artificial','inteligencia-artificial',2),
('Empreendedorismo','empreendedorismo',3),
('Finanças','financas',4),
('Desenvolvimento Pessoal','desenvolvimento-pessoal',5),
('Profissões','profissoes',6);

insert into public.courses (title, slug, short_description, description, category_id, featured, is_demo)
select '[DEMONSTRAÇÃO] Curso exemplo de ' || c.name, 'demo-' || c.slug,
  'Curso fictício de exemplo. Substitua pelo seu produto afiliado.',
  'Este é um curso demonstrativo, criado apenas para ilustrar o layout da loja. Ele não existe e não possui link de afiliado. Cadastre seus produtos reais no painel administrativo.',
  c.id, c.sort_order <= 4, true
from public.categories c;