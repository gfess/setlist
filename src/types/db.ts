// Row shapes for the Supabase (Postgres) tables. Canonical entities (Artist,
// Venue, Concert, Song) still come from the mock layer and keep their types in
// ./index.ts — these are the user-owned rows that now live in the database.

export interface Profile {
  id: string;
  username: string;
  display_name: string;
  bio: string;
  avatar_url: string | null;
  is_private: boolean;
  joined_date: string;
}

export interface ConcertLogRow {
  id: string;
  user_id: string;
  concert_id: string;
  attended_date: string;
  rating: number | null;
  review: string | null;
  is_private: boolean;
  created_at: string;
  updated_at: string;
}

export interface ListRow {
  id: string;
  owner_id: string;
  title: string;
  description: string;
  is_ranked: boolean;
  is_public: boolean;
  tags: string[];
  created_at: string;
}

export interface ListEntryRow {
  list_id: string;
  concert_id: string;
  rank: number | null;
  notes: string | null;
}

export interface LineupEntryRow {
  id: string;
  user_id: string;
  concert_id: string;
  added_date: string;
  notes: string | null;
}

export interface ArtistIntentRow {
  id: string;
  user_id: string;
  artist_id: string;
  added_date: string;
}
