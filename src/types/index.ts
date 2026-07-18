// Canonical entities — sourced from external services (Spotify / Setlist.fm / MusicBrainz).
// Never user-writable.
export interface ExternalEntity {
  id: string;
}

// User-owned content — writable, lives in Setlist's own data store.
export interface UserContent {
  id: string;
}

export interface User {
  id: string;
  username: string;
  displayName: string;
  bio: string;
  avatarURL: string;
  joinedDate: string;
  favoriteArtistIds: string[];
  isPrivate: boolean;
}

export interface Artist extends ExternalEntity {
  name: string;
  slug: string;
  imageURL: string;
  bio: string;
  genres: string[];
}

export interface Venue extends ExternalEntity {
  name: string;
  slug: string;
  city: string;
  stateOrRegion: string;
  country: string;
  capacity?: number;
}

export interface Song extends ExternalEntity {
  title: string;
  artistId: string;
  albumName?: string;
  releaseYear?: number;
}

export interface SetlistEntry {
  id: string;
  songId: string;
  position: number;
  notes?: string;
  isCover: boolean;
  originalArtistId?: string;
}

export interface SetlistSection {
  id: string;
  name?: string; // e.g. "Encore", undefined for main set
  order: number;
  songs: SetlistEntry[];
}

export interface Concert extends ExternalEntity {
  artistId: string;
  venueId: string;
  date: string;
  tourName?: string;
  setlist: SetlistSection[];
  sourceURL?: string;
  isVerified: boolean;
}

export interface ConcertLog extends UserContent {
  userId: string;
  concertId: string;
  attendedDate: string;
  rating?: number; // 0.5–5.0, half-star increments
  review?: string;
  isPrivate: boolean;
  likedSongIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface LineupEntry extends UserContent {
  userId: string;
  concertId: string;
  addedDate: string;
  notes?: string;
}

export interface ArtistIntent extends UserContent {
  userId: string;
  artistId: string;
  addedDate: string;
}

export interface ListEntry {
  concertId: string;
  rank?: number;
  notes?: string;
}

export interface ConcertList extends UserContent {
  title: string;
  description: string;
  ownerId: string;
  entries: ListEntry[];
  isRanked: boolean;
  isPublic: boolean;
  tags: string[];
}

export type ActivityType =
  | { kind: "logged"; concertLogId: string }
  | { kind: "reviewed"; concertLogId: string }
  | { kind: "liked"; concertLogId: string }
  | { kind: "addedToList"; listId: string }
  | { kind: "followedUser"; userId: string };

export interface Activity extends UserContent {
  type: ActivityType;
  actorId: string;
  timestamp: string;
}
