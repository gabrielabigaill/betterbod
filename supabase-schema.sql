-- ============================================================
--  BetterBody — Complete Supabase Database Schema
--  Paste this into: Supabase Dashboard → SQL Editor → Run
--  Run ONCE on a fresh project. Safe to re-run (uses IF NOT EXISTS).
-- ============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ─────────────────────────────────────────────
--  ENUMS
-- ─────────────────────────────────────────────

create type plan_type      as enum ('monthly', 'annual', 'stride_club');
create type sub_status     as enum ('active', 'cancelled', 'past_due', 'trialing', 'incomplete');
create type order_status   as enum ('pending', 'complete', 'refunded', 'failed');
create type difficulty     as enum ('beginner', 'intermediate', 'advanced', 'any');
create type location_type  as enum ('gym', 'home', 'travel', 'any');
create type product_type   as enum ('physical', 'digital');
create type discount_type  as enum ('percent', 'fixed');
create type email_type     as enum ('transactional', 'marketing');
create type user_role      as enum ('customer', 'admin');

-- ─────────────────────────────────────────────
--  PROFILES  (extends auth.users)
-- ─────────────────────────────────────────────

create table if not exists profiles (
  id              uuid primary key references auth.users(id) on delete cascade,
  full_name       text,
  email           text not null,
  avatar_url      text,
  role            user_role not null default 'customer',
  currency        char(3) not null default 'USD',
  currency_symbol text not null default '$',
  country_code    char(2),
  stripe_customer_id text unique,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- Auto-create profile on signup
create or replace function handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- Auto-update updated_at
create or replace function update_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at before update on profiles
  for each row execute function update_updated_at();

-- ─────────────────────────────────────────────
--  SUBSCRIPTIONS
-- ─────────────────────────────────────────────

create table if not exists subscriptions (
  id                      uuid primary key default uuid_generate_v4(),
  user_id                 uuid not null references profiles(id) on delete cascade,
  stripe_customer_id      text,
  stripe_subscription_id  text unique,
  stripe_price_id         text,
  plan_type               plan_type not null,
  status                  sub_status not null default 'incomplete',
  current_period_start    timestamptz,
  current_period_end      timestamptz,
  cancel_at_period_end    boolean not null default false,
  created_at              timestamptz not null default now(),
  updated_at              timestamptz not null default now()
);

create index if not exists subscriptions_user_id_idx on subscriptions(user_id);
create index if not exists subscriptions_stripe_sub_id_idx on subscriptions(stripe_subscription_id);

create trigger subscriptions_updated_at before update on subscriptions
  for each row execute function update_updated_at();

-- ─────────────────────────────────────────────
--  ORDERS
-- ─────────────────────────────────────────────

create table if not exists orders (
  id                  uuid primary key default uuid_generate_v4(),
  user_id             uuid references profiles(id) on delete set null,
  stripe_session_id   text unique,
  stripe_payment_intent text,
  amount_total        integer not null,   -- in cents
  currency            char(3) not null default 'usd',
  status              order_status not null default 'pending',
  items               jsonb not null default '[]',
  shipping_address    jsonb,
  tracking_number     text,
  notes               text,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

create index if not exists orders_user_id_idx on orders(user_id);
create index if not exists orders_stripe_session_idx on orders(stripe_session_id);
create index if not exists orders_status_idx on orders(status);

create trigger orders_updated_at before update on orders
  for each row execute function update_updated_at();

-- ─────────────────────────────────────────────
--  PROGRAMS
-- ─────────────────────────────────────────────

create table if not exists programs (
  id                uuid primary key default uuid_generate_v4(),
  name              text not null,
  slug              text not null unique,
  short_description text,
  full_description  text,
  cover_image_url   text,
  trailer_video_url text,
  duration_weeks    integer not null default 8,
  days_per_week     integer not null default 4,
  difficulty        difficulty not null default 'intermediate',
  location          location_type not null default 'gym',
  is_active         boolean not null default true,
  is_featured       boolean not null default false,
  sort_order        integer not null default 0,
  metadata          jsonb default '{}',
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create index if not exists programs_slug_idx on programs(slug);
create index if not exists programs_active_idx on programs(is_active);

create trigger programs_updated_at before update on programs
  for each row execute function update_updated_at();

-- ─────────────────────────────────────────────
--  CHALLENGES
-- ─────────────────────────────────────────────

create table if not exists challenges (
  id                uuid primary key default uuid_generate_v4(),
  name              text not null,
  slug              text not null unique,
  short_description text,
  full_description  text,
  cover_image_url   text,
  duration_weeks    integer not null default 4,
  difficulty        difficulty not null default 'any',
  location          location_type not null default 'any',
  start_date        date,
  end_date          date,
  is_active         boolean not null default true,
  is_featured       boolean not null default false,
  sort_order        integer not null default 0,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create trigger challenges_updated_at before update on challenges
  for each row execute function update_updated_at();

-- ─────────────────────────────────────────────
--  PRODUCTS  (merchandise, ebooks, etc.)
-- ─────────────────────────────────────────────

create table if not exists products (
  id                uuid primary key default uuid_generate_v4(),
  name              text not null,
  slug              text not null unique,
  short_description text,
  full_description  text,
  price_usd         numeric(10,2) not null,
  compare_at_price  numeric(10,2),
  type              product_type not null default 'physical',
  category          text,
  cover_image_url   text,
  images            jsonb default '[]',
  stripe_price_id   text,
  digital_file_url  text,  -- for ebooks/PDFs
  inventory_count   integer,
  is_active         boolean not null default true,
  is_featured       boolean not null default false,
  sort_order        integer not null default 0,
  metadata          jsonb default '{}',
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create index if not exists products_slug_idx on products(slug);
create index if not exists products_active_idx on products(is_active);

create trigger products_updated_at before update on products
  for each row execute function update_updated_at();

-- ─────────────────────────────────────────────
--  BUNDLES
-- ─────────────────────────────────────────────

create table if not exists bundles (
  id                uuid primary key default uuid_generate_v4(),
  name              text not null,
  slug              text not null unique,
  short_description text,
  full_description  text,
  price_usd         numeric(10,2) not null,
  compare_at_price  numeric(10,2),
  cover_image_url   text,
  stripe_price_id   text,
  badge_text        text,   -- e.g. "STARTER", "ELITE"
  is_active         boolean not null default true,
  sort_order        integer not null default 0,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create table if not exists bundle_items (
  id          uuid primary key default uuid_generate_v4(),
  bundle_id   uuid not null references bundles(id) on delete cascade,
  item_type   text not null check (item_type in ('product', 'program', 'challenge')),
  item_id     uuid not null,
  created_at  timestamptz not null default now()
);

create trigger bundles_updated_at before update on bundles
  for each row execute function update_updated_at();

-- ─────────────────────────────────────────────
--  NUTRITION RECIPES
-- ─────────────────────────────────────────────

create table if not exists recipes (
  id              uuid primary key default uuid_generate_v4(),
  title           text not null,
  slug            text not null unique,
  description     text,
  image_url       text,
  category        text,  -- 'breakfast', 'lunch', 'dinner', 'snack', 'dessert'
  calories        integer,
  protein_g       numeric(6,1),
  carbs_g         numeric(6,1),
  fat_g           numeric(6,1),
  prep_time_mins  integer,
  cook_time_mins  integer,
  servings        integer default 1,
  ingredients     jsonb not null default '[]',
  steps           jsonb not null default '[]',
  tags            text[],
  is_active       boolean not null default true,
  is_featured     boolean not null default false,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index if not exists recipes_slug_idx on recipes(slug);
create index if not exists recipes_active_idx on recipes(is_active);

create trigger recipes_updated_at before update on recipes
  for each row execute function update_updated_at();

-- ─────────────────────────────────────────────
--  STRIDE CLUB — SESSIONS
-- ─────────────────────────────────────────────

create table if not exists stride_sessions (
  id               uuid primary key default uuid_generate_v4(),
  user_id          uuid not null references profiles(id) on delete cascade,
  steps            integer not null default 0,
  duration_seconds integer not null default 0,
  started_at       timestamptz not null default now(),
  ended_at         timestamptz,
  week_number      integer not null,  -- ISO week number
  year             integer not null,
  is_flagged       boolean not null default false,  -- anti-cheat flag
  flag_reason      text,
  created_at       timestamptz not null default now()
);

create index if not exists stride_sessions_user_id_idx   on stride_sessions(user_id);
create index if not exists stride_sessions_week_year_idx on stride_sessions(week_number, year);
create index if not exists stride_sessions_flagged_idx   on stride_sessions(is_flagged);

-- Weekly leaderboard view
create or replace view stride_leaderboard_weekly as
select
  p.id            as user_id,
  p.full_name,
  p.avatar_url,
  extract(week  from now())::integer as week_number,
  extract(year  from now())::integer as year,
  coalesce(sum(ss.steps), 0)::integer as total_steps,
  count(ss.id)::integer               as session_count,
  rank() over (order by coalesce(sum(ss.steps), 0) desc) as rank
from profiles p
left join stride_sessions ss
  on ss.user_id = p.id
  and ss.week_number = extract(week from now())::integer
  and ss.year        = extract(year from now())::integer
  and ss.is_flagged  = false
  and ss.ended_at is not null
join subscriptions sub
  on sub.user_id = p.id
  and sub.plan_type = 'stride_club'
  and sub.status = 'active'
group by p.id, p.full_name, p.avatar_url
order by total_steps desc;

-- ─────────────────────────────────────────────
--  STRIDE CLUB — WORKBOOKS
-- ─────────────────────────────────────────────

create table if not exists stride_workbooks (
  id          uuid primary key default uuid_generate_v4(),
  title       text not null,
  month       integer not null check (month between 1 and 12),
  year        integer not null,
  file_url    text not null,
  is_active   boolean not null default true,
  created_at  timestamptz not null default now(),
  unique(month, year)
);

create table if not exists stride_workbook_downloads (
  id           uuid primary key default uuid_generate_v4(),
  workbook_id  uuid not null references stride_workbooks(id) on delete cascade,
  user_id      uuid not null references profiles(id) on delete cascade,
  downloaded_at timestamptz not null default now(),
  unique(workbook_id, user_id)
);

-- ─────────────────────────────────────────────
--  COUPONS
-- ─────────────────────────────────────────────

create table if not exists coupons (
  id              uuid primary key default uuid_generate_v4(),
  code            text not null unique,
  type            discount_type not null default 'percent',
  value           numeric(10,2) not null,
  usage_count     integer not null default 0,
  max_uses        integer,  -- null = unlimited
  expires_at      timestamptz,
  is_active       boolean not null default true,
  stripe_coupon_id text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create trigger coupons_updated_at before update on coupons
  for each row execute function update_updated_at();

-- ─────────────────────────────────────────────
--  REVIEWS
-- ─────────────────────────────────────────────

create table if not exists reviews (
  id            uuid primary key default uuid_generate_v4(),
  user_id       uuid not null references profiles(id) on delete cascade,
  product_type  text not null check (product_type in ('program', 'product', 'bundle', 'platform')),
  product_id    uuid,
  rating        integer not null check (rating between 1 and 5),
  title         text,
  body          text,
  is_approved   boolean not null default false,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists reviews_approved_idx on reviews(is_approved);

create trigger reviews_updated_at before update on reviews
  for each row execute function update_updated_at();

-- ─────────────────────────────────────────────
--  SUBSCRIBERS  (email list)
-- ─────────────────────────────────────────────

create table if not exists subscribers (
  id              uuid primary key default uuid_generate_v4(),
  email           text not null unique,
  first_name      text,
  source          text,  -- 'homepage', 'stride_club', 'checkout', etc.
  is_active       boolean not null default true,
  subscribed_at   timestamptz not null default now(),
  unsubscribed_at timestamptz
);

-- ─────────────────────────────────────────────
--  EMAIL TEMPLATES
-- ─────────────────────────────────────────────

create table if not exists email_templates (
  id          uuid primary key default uuid_generate_v4(),
  name        text not null unique,
  subject     text not null,
  html_body   text not null,
  type        email_type not null default 'transactional',
  updated_at  timestamptz not null default now()
);

-- ─────────────────────────────────────────────
--  SITE SETTINGS  (admin-editable)
-- ─────────────────────────────────────────────

create table if not exists site_settings (
  key         text primary key,
  value       text,
  type        text not null default 'text',  -- 'text', 'boolean', 'number', 'json'
  updated_at  timestamptz not null default now()
);

-- Default settings
insert into site_settings (key, value, type) values
  ('hero_headline',          'Move Better. Live Better.',                   'text'),
  ('hero_caption',           'Move. Nourish. Thrive. The complete fitness and wellness platform built by Judith, founder of BetterBody.', 'text'),
  ('hero_cta_text',          'Start Your Journey',                          'text'),
  ('announcement_text',      'New Stride Club challenge launching soon!',   'text'),
  ('announcement_active',    'false',                                       'boolean'),
  ('sale_banner_active',     'false',                                       'boolean'),
  ('sale_discount_percent',  '20',                                          'number'),
  ('sale_countdown_end',     '',                                            'text'),
  ('founder_bio',            'Judith is a certified personal trainer and the founder of BetterBody. She built this platform because she believed fitness should be accessible, joyful, and sustainable for everyone.', 'text'),
  ('instagram_url',          '',                                            'text'),
  ('tiktok_url',             '',                                            'text'),
  ('youtube_url',            '',                                            'text'),
  ('support_email',          'support@betterbody.com',                      'text'),
  ('exchange_rate_jmd',      '158',                                         'number'),
  ('exchange_rate_aud',      '1.52',                                        'number'),
  ('exchange_rate_gbp',      '0.79',                                        'number'),
  ('exchange_rate_eur',      '0.92',                                        'number'),
  ('exchange_rate_cad',      '1.37',                                        'number')
on conflict (key) do nothing;

-- ─────────────────────────────────────────────
--  ROW LEVEL SECURITY (RLS)
-- ─────────────────────────────────────────────

-- Enable RLS on all tables
alter table profiles                  enable row level security;
alter table subscriptions             enable row level security;
alter table orders                    enable row level security;
alter table programs                  enable row level security;
alter table challenges                enable row level security;
alter table products                  enable row level security;
alter table bundles                   enable row level security;
alter table bundle_items              enable row level security;
alter table recipes                   enable row level security;
alter table stride_sessions           enable row level security;
alter table stride_workbooks          enable row level security;
alter table stride_workbook_downloads enable row level security;
alter table coupons                   enable row level security;
alter table reviews                   enable row level security;
alter table subscribers               enable row level security;
alter table email_templates           enable row level security;
alter table site_settings             enable row level security;

-- ── PROFILES ──
create policy "Users can view own profile"
  on profiles for select using (auth.uid() = id);
create policy "Users can update own profile"
  on profiles for update using (auth.uid() = id);
create policy "Service role has full access to profiles"
  on profiles for all using (auth.role() = 'service_role');

-- ── SUBSCRIPTIONS ──
create policy "Users can view own subscriptions"
  on subscriptions for select using (auth.uid() = user_id);
create policy "Service role manages subscriptions"
  on subscriptions for all using (auth.role() = 'service_role');

-- ── ORDERS ──
create policy "Users can view own orders"
  on orders for select using (auth.uid() = user_id);
create policy "Service role manages orders"
  on orders for all using (auth.role() = 'service_role');

-- ── PROGRAMS (public read if active) ──
create policy "Anyone can view active programs"
  on programs for select using (is_active = true);
create policy "Service role manages programs"
  on programs for all using (auth.role() = 'service_role');

-- ── CHALLENGES (public read if active) ──
create policy "Anyone can view active challenges"
  on challenges for select using (is_active = true);
create policy "Service role manages challenges"
  on challenges for all using (auth.role() = 'service_role');

-- ── PRODUCTS (public read if active) ──
create policy "Anyone can view active products"
  on products for select using (is_active = true);
create policy "Service role manages products"
  on products for all using (auth.role() = 'service_role');

-- ── BUNDLES (public read if active) ──
create policy "Anyone can view active bundles"
  on bundles for select using (is_active = true);
create policy "Anyone can view bundle items"
  on bundle_items for select using (true);
create policy "Service role manages bundles"
  on bundles for all using (auth.role() = 'service_role');
create policy "Service role manages bundle items"
  on bundle_items for all using (auth.role() = 'service_role');

-- ── RECIPES (public read if active) ──
create policy "Anyone can view active recipes"
  on recipes for select using (is_active = true);
create policy "Service role manages recipes"
  on recipes for all using (auth.role() = 'service_role');

-- ── STRIDE SESSIONS ──
create policy "Users can manage own stride sessions"
  on stride_sessions for all using (auth.uid() = user_id);
create policy "Service role manages all stride sessions"
  on stride_sessions for all using (auth.role() = 'service_role');

-- ── STRIDE WORKBOOKS (active Stride subscribers can read) ──
create policy "Stride subscribers can view workbooks"
  on stride_workbooks for select using (
    is_active = true and exists (
      select 1 from subscriptions s
      where s.user_id = auth.uid()
        and s.plan_type in ('stride_club', 'annual')
        and s.status = 'active'
    )
  );
create policy "Service role manages workbooks"
  on stride_workbooks for all using (auth.role() = 'service_role');

-- ── STRIDE WORKBOOK DOWNLOADS ──
create policy "Users can manage own workbook downloads"
  on stride_workbook_downloads for all using (auth.uid() = user_id);
create policy "Service role manages workbook downloads"
  on stride_workbook_downloads for all using (auth.role() = 'service_role');

-- ── COUPONS (service role only) ──
create policy "Service role manages coupons"
  on coupons for all using (auth.role() = 'service_role');

-- ── REVIEWS ──
create policy "Anyone can view approved reviews"
  on reviews for select using (is_approved = true);
create policy "Users can insert own reviews"
  on reviews for insert with check (auth.uid() = user_id);
create policy "Users can update own reviews"
  on reviews for update using (auth.uid() = user_id);
create policy "Service role manages reviews"
  on reviews for all using (auth.role() = 'service_role');

-- ── SUBSCRIBERS (insert only publicly; read by service role) ──
create policy "Anyone can subscribe"
  on subscribers for insert with check (true);
create policy "Service role manages subscribers"
  on subscribers for all using (auth.role() = 'service_role');

-- ── EMAIL TEMPLATES (service role only) ──
create policy "Service role manages email templates"
  on email_templates for all using (auth.role() = 'service_role');

-- ── SITE SETTINGS ──
create policy "Anyone can read site settings"
  on site_settings for select using (true);
create policy "Service role manages site settings"
  on site_settings for all using (auth.role() = 'service_role');

-- ─────────────────────────────────────────────
--  SEED DATA  (sample programs + admin user note)
-- ─────────────────────────────────────────────

-- Sample programs
insert into programs (name, slug, short_description, full_description, duration_weeks, days_per_week, difficulty, location, is_active, is_featured, sort_order)
values
  ('Strong Body Reset',    'strong-body-reset',    'A 12-week full-body strength program to rebuild your foundation.',  'Full program description here...', 12, 4, 'intermediate', 'gym',  true, true,  1),
  ('Sculpt & Tone',        'sculpt-and-tone',       'Build lean muscle and sharpen definition in 8 weeks.',              'Full program description here...', 8,  4, 'intermediate', 'gym',  true, false, 2),
  ('Booty Builder',        'booty-builder',         'Targeted glute and lower body growth in 10 weeks.',                'Full program description here...', 10, 3, 'intermediate', 'gym',  true, false, 3),
  ('Home Glow Up',         'home-glow-up',          'No gym needed. Build confidence at home in 6 weeks.',              'Full program description here...', 6,  3, 'beginner',     'home', true, false, 4),
  ('Start Up',             'start-up',              'The perfect introduction to structured training.',                 'Full program description here...', 4,  3, 'beginner',     'any',  true, false, 5),
  ('On The Move',          'on-the-move',           'Travel-friendly workouts for busy schedules.',                     'Full program description here...', 4,  4, 'any',          'travel', true, false, 6)
on conflict (slug) do nothing;

-- Sample challenges
insert into challenges (name, slug, short_description, duration_weeks, difficulty, location, is_active, sort_order)
values
  ('6-Week Shred',         '6-week-shred',    'Six weeks of focused fat loss and muscle definition.', 6, 'intermediate', 'gym',  true, 1),
  ('Glow Up Challenge',    'glow-up',         '4-week total transformation — home-friendly.',         4, 'any',          'home', true, 2),
  ('10K Steps Challenge',  '10k-steps',       'Hit 10,000 steps every day for 30 days.',              4, 'any',          'any',  true, 3)
on conflict (slug) do nothing;

-- ─────────────────────────────────────────────
--  DONE
-- ─────────────────────────────────────────────
-- To make a user admin, run:
--   update profiles set role = 'admin' where email = 'your@email.com';
