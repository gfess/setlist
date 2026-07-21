-- Setlist — initial schema
--
-- Scope: this migration covers USER-OWNED data + auth only. Canonical data
-- (artists, venues, concerts, songs, setlists) still lives in the app's mock
-- layer for now, so those are referenced here by their string ids (e.g. "c1",
-- "a3") as plain text — NOT foreign keys. When real concert data lands later,
-- those columns become references to canonical tables.
--
-- Every table has Row Level Security enabled with explicit policies below.

-- ---------------------------------------------------------------------------
-- Profiles (one row per auth user)
-- ---------------------------------------------------------------------------
create table public.profiles (
  id            uuid primary key references auth.users (id) on delete cascade,
  username      text unique not null,
  display_name  text not null,
  bio           text not null default '',
  avatar_url    text,
  is_private    boolean not null default false,
  joined_date   timestamptz not null default now()
);

-- Pinned favorite artists (canonical artist ids as text).
create table public.favorite_artists (
  profile_id  uuid not null references public.profiles (id) on delete cascade,
  artist_id   text not null,
  position    int  not null default 0,
  primary key (profile_id, artist_id)
);

-- ---------------------------------------------------------------------------
-- Social graph — asymmetric follow
-- ---------------------------------------------------------------------------
create table public.follows (
  follower_id   uuid not null references public.profiles (id) on delete cascade,
  following_id  uuid not null references public.profiles (id) on delete cascade,
  created_at    timestamptz not null default now(),
  primary key (follower_id, following_id),
  check (follower_id <> following_id)
);

-- ---------------------------------------------------------------------------
-- Concert logs (the diary entry) + highlighted songs
-- ---------------------------------------------------------------------------
create table public.concert_logs (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid not null references public.profiles (id) on delete cascade,
  concert_id     text not null,
  attended_date  date not null,
  rating         numeric(2,1) check (rating >= 0.5 and rating <= 5.0),
  review         text,
  is_private     boolean not null default false,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);
create index concert_logs_user_idx on public.concert_logs (user_id);
create index concert_logs_concert_idx on public.concert_logs (concert_id);

create table public.log_liked_songs (
  log_id   uuid not null references public.concert_logs (id) on delete cascade,
  song_id  text not null,
  primary key (log_id, song_id)
);

-- Likes on a concert log.
create table public.concert_log_likes (
  user_id     uuid not null references public.profiles (id) on delete cascade,
  log_id      uuid not null references public.concert_logs (id) on delete cascade,
  created_at  timestamptz not null default now(),
  primary key (user_id, log_id)
);

-- ---------------------------------------------------------------------------
-- Lineup (plan to go) + artist intent (want to see)
-- ---------------------------------------------------------------------------
create table public.lineup_entries (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.profiles (id) on delete cascade,
  concert_id  text not null,
  added_date  timestamptz not null default now(),
  notes       text,
  unique (user_id, concert_id)
);

create table public.artist_intents (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.profiles (id) on delete cascade,
  artist_id   text not null,
  added_date  timestamptz not null default now(),
  unique (user_id, artist_id)
);

-- ---------------------------------------------------------------------------
-- Lists
-- ---------------------------------------------------------------------------
create table public.lists (
  id           uuid primary key default gen_random_uuid(),
  owner_id     uuid not null references public.profiles (id) on delete cascade,
  title        text not null,
  description  text not null default '',
  is_ranked    boolean not null default false,
  is_public    boolean not null default true,
  tags         text[] not null default '{}',
  created_at   timestamptz not null default now()
);

create table public.list_entries (
  list_id     uuid not null references public.lists (id) on delete cascade,
  concert_id  text not null,
  rank        int,
  notes       text,
  primary key (list_id, concert_id)
);

-- ---------------------------------------------------------------------------
-- Auto-create a profile when a new auth user signs up. Username / display
-- name come from the signup metadata (raw_user_meta_data).
-- ---------------------------------------------------------------------------
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, username, display_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'username', 'user_' || left(new.id::text, 8)),
    coalesce(new.raw_user_meta_data ->> 'display_name', new.raw_user_meta_data ->> 'username', 'New User')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Keep concert_logs.updated_at fresh.
create function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger concert_logs_touch
  before update on public.concert_logs
  for each row execute function public.touch_updated_at();

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
alter table public.profiles          enable row level security;
alter table public.favorite_artists  enable row level security;
alter table public.follows           enable row level security;
alter table public.concert_logs      enable row level security;
alter table public.log_liked_songs   enable row level security;
alter table public.concert_log_likes enable row level security;
alter table public.lineup_entries    enable row level security;
alter table public.artist_intents    enable row level security;
alter table public.lists             enable row level security;
alter table public.list_entries      enable row level security;

-- Profiles: world-readable; you may only write your own.
create policy "profiles readable" on public.profiles
  for select using (true);
create policy "profiles self-insert" on public.profiles
  for insert with check (auth.uid() = id);
create policy "profiles self-update" on public.profiles
  for update using (auth.uid() = id);

-- Favorite artists: readable by all; writable by the profile owner.
create policy "favorites readable" on public.favorite_artists
  for select using (true);
create policy "favorites owner-write" on public.favorite_artists
  for all using (auth.uid() = profile_id) with check (auth.uid() = profile_id);

-- Follows: readable by all; you manage only your own outgoing follows.
create policy "follows readable" on public.follows
  for select using (true);
create policy "follows self-manage" on public.follows
  for all using (auth.uid() = follower_id) with check (auth.uid() = follower_id);

-- Concert logs: visible if public or yours; writable only by you.
create policy "logs readable" on public.concert_logs
  for select using (not is_private or auth.uid() = user_id);
create policy "logs owner-write" on public.concert_logs
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Highlighted songs follow the visibility of their parent log.
create policy "liked songs readable" on public.log_liked_songs
  for select using (
    exists (
      select 1 from public.concert_logs l
      where l.id = log_id and (not l.is_private or auth.uid() = l.user_id)
    )
  );
create policy "liked songs owner-write" on public.log_liked_songs
  for all using (
    exists (select 1 from public.concert_logs l where l.id = log_id and auth.uid() = l.user_id)
  ) with check (
    exists (select 1 from public.concert_logs l where l.id = log_id and auth.uid() = l.user_id)
  );

-- Likes: readable by all; you manage only your own.
create policy "likes readable" on public.concert_log_likes
  for select using (true);
create policy "likes self-manage" on public.concert_log_likes
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Lineup + artist intent: private to the owner.
create policy "lineup owner-only" on public.lineup_entries
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "intents owner-only" on public.artist_intents
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Lists: visible if public or yours; writable only by the owner.
create policy "lists readable" on public.lists
  for select using (is_public or auth.uid() = owner_id);
create policy "lists owner-write" on public.lists
  for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);

-- List entries follow the visibility of their parent list.
create policy "list entries readable" on public.list_entries
  for select using (
    exists (
      select 1 from public.lists l
      where l.id = list_id and (l.is_public or auth.uid() = l.owner_id)
    )
  );
create policy "list entries owner-write" on public.list_entries
  for all using (
    exists (select 1 from public.lists l where l.id = list_id and auth.uid() = l.owner_id)
  ) with check (
    exists (select 1 from public.lists l where l.id = list_id and auth.uid() = l.owner_id)
  );
