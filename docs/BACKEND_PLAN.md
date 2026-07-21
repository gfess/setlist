# Backend + Auth Plan

Status: **groundwork / for review.** Schema drafted; app wiring pending network
access to Supabase + two decisions below.

## Approach

- **Backend:** Supabase (Postgres + Auth + RLS).
- **Scope of this phase:** authentication + persisting *user-owned* data. Canonical
  data (artists, venues, concerts, songs, setlists) stays in the mock layer for
  now and is referenced by string id. Real concert data is a later phase, so the
  schema references canonical ids as plain `text` — no premature coupling.
- **Migration seam:** the existing `useInteractions()` store is already the single
  boundary for mutable data. We swap its localStorage implementation for Supabase
  queries behind the *same hook API*, so components barely change.
- **`CURRENT_USER_ID`** (currently hardcoded to `u1`) becomes the authenticated
  session user.

## Schema

See `supabase/migrations/0001_init.sql`. Tables: `profiles`, `favorite_artists`,
`follows`, `concert_logs`, `log_liked_songs`, `concert_log_likes`,
`lineup_entries`, `artist_intents`, `lists`, `list_entries`. Row Level Security is
on for every table with explicit policies (public reads where appropriate,
owner-only writes; private logs/lists hidden from others). A trigger auto-creates
a `profiles` row on signup.

## Open decisions

1. **Auth method.** Options: magic-link email (simplest, no OAuth app setup),
   email + password, or OAuth (Google / Apple / GitHub). Recommendation:
   **magic-link email** to start — least setup, no password handling — with OAuth
   addable later.
2. **Demo data.** Moving to real auth means you're initially the only real user.
   To keep the feed/profiles feeling populated, seed the existing demo users
   (Maya, Jordan, Sam) and their logs/lists into the DB as real rows? Recommend
   **yes** for now; easy to remove before a real launch.

## Steps

1. Schema + RLS migration. *(drafted)*
2. (Optional) demo seed SQL — pending decision 2.
3. Supabase client + auth UI (login/signup) + session provider — pending network
   access + decision 1.
4. Migrate store reads/writes to Supabase behind the existing hook API.
5. Verify end-to-end, ship.
