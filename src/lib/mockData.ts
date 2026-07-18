import type {
  Activity,
  ArtistIntent,
  Artist,
  Concert,
  ConcertList,
  ConcertLog,
  LineupEntry,
  Song,
  User,
  Venue,
} from "@/types";

// The signed-in user for this prototype.
export const CURRENT_USER_ID = "u1";

export const users: User[] = [
  {
    id: "u1",
    username: "griff",
    displayName: "Griffin Fess",
    bio: "Chasing setlists up and down the coast.",
    avatarURL: "https://i.pravatar.cc/150?img=12",
    joinedDate: "2022-03-14",
    favoriteArtistIds: ["a1", "a3", "a5"],
    isPrivate: false,
  },
  {
    id: "u2",
    username: "mayac",
    displayName: "Maya Chen",
    bio: "Front row or nothing.",
    avatarURL: "https://i.pravatar.cc/150?img=32",
    joinedDate: "2021-11-02",
    favoriteArtistIds: ["a2", "a4"],
    isPrivate: false,
  },
  {
    id: "u3",
    username: "jlee",
    displayName: "Jordan Lee",
    bio: "Festival season is a lifestyle.",
    avatarURL: "https://i.pravatar.cc/150?img=51",
    joinedDate: "2023-01-20",
    favoriteArtistIds: ["a5", "a1"],
    isPrivate: false,
  },
  {
    id: "u4",
    username: "sampatel",
    displayName: "Sam Patel",
    bio: "",
    avatarURL: "https://i.pravatar.cc/150?img=15",
    joinedDate: "2020-06-09",
    favoriteArtistIds: ["a3"],
    isPrivate: false,
  },
];

export const artists: Artist[] = [
  {
    id: "a1",
    name: "Radiohead",
    slug: "radiohead",
    imageURL: "https://picsum.photos/seed/radiohead/400/400",
    bio: "English rock band formed in Abingdon, Oxfordshire, in 1985.",
    genres: ["Alternative Rock", "Art Rock"],
  },
  {
    id: "a2",
    name: "Fred again..",
    slug: "fred-again",
    imageURL: "https://picsum.photos/seed/fredagain/400/400",
    bio: "British DJ, record producer and songwriter.",
    genres: ["Electronic", "UK Dance"],
  },
  {
    id: "a3",
    name: "The National",
    slug: "the-national",
    imageURL: "https://picsum.photos/seed/thenational/400/400",
    bio: "American rock band formed in Cincinnati, Ohio.",
    genres: ["Indie Rock", "Baroque Pop"],
  },
  {
    id: "a4",
    name: "boygenius",
    slug: "boygenius",
    imageURL: "https://picsum.photos/seed/boygenius/400/400",
    bio: "American indie rock supergroup.",
    genres: ["Indie Rock", "Folk Rock"],
  },
  {
    id: "a5",
    name: "Tyler, The Creator",
    slug: "tyler-the-creator",
    imageURL: "https://picsum.photos/seed/tyler/400/400",
    bio: "American rapper, singer, and record producer.",
    genres: ["Hip Hop", "Alternative Hip Hop"],
  },
];

export const venues: Venue[] = [
  {
    id: "v1",
    name: "Madison Square Garden",
    slug: "madison-square-garden",
    city: "New York",
    stateOrRegion: "NY",
    country: "USA",
    capacity: 20789,
  },
  {
    id: "v2",
    name: "The Fillmore",
    slug: "the-fillmore-sf",
    city: "San Francisco",
    stateOrRegion: "CA",
    country: "USA",
    capacity: 1315,
  },
  {
    id: "v3",
    name: "Red Rocks Amphitheatre",
    slug: "red-rocks",
    city: "Morrison",
    stateOrRegion: "CO",
    country: "USA",
    capacity: 9525,
  },
  {
    id: "v4",
    name: "Alexandra Palace",
    slug: "alexandra-palace",
    city: "London",
    stateOrRegion: "",
    country: "UK",
    capacity: 10500,
  },
];

export const songs: Song[] = [
  { id: "s1", title: "Everything In Its Right Place", artistId: "a1", albumName: "Kid A", releaseYear: 2000 },
  { id: "s2", title: "Idioteque", artistId: "a1", albumName: "Kid A", releaseYear: 2000 },
  { id: "s3", title: "Weird Fishes/Arpeggi", artistId: "a1", albumName: "In Rainbows", releaseYear: 2007 },
  { id: "s4", title: "Karma Police", artistId: "a1", albumName: "OK Computer", releaseYear: 1997 },
  { id: "s5", title: "Paranoid Android", artistId: "a1", albumName: "OK Computer", releaseYear: 1997 },
  { id: "s6", title: "Delicate", artistId: "a2", albumName: "Actual Life 3", releaseYear: 2022 },
  { id: "s7", title: "Marea (We've Lost Dancing)", artistId: "a2", albumName: "Actual Life 2", releaseYear: 2021 },
  { id: "s8", title: "Turn On The Lights again..", artistId: "a2", albumName: "Actual Life 3", releaseYear: 2022 },
  { id: "s9", title: "Bloodbuzz Ohio", artistId: "a3", albumName: "High Violet", releaseYear: 2010 },
  { id: "s10", title: "Fake Empire", artistId: "a3", albumName: "Boxer", releaseYear: 2007 },
  { id: "s11", title: "About Today", artistId: "a3", albumName: "Cherry Tree", releaseYear: 2004 },
  { id: "s12", title: "Not Strong Enough", artistId: "a4", albumName: "the record", releaseYear: 2023 },
  { id: "s13", title: "Cool About It", artistId: "a4", albumName: "the record", releaseYear: 2023 },
  { id: "s14", title: "$$$", artistId: "a5", albumName: "CALL ME IF YOU GET LOST", releaseYear: 2021 },
  { id: "s15", title: "See You Again", artistId: "a5", albumName: "Flower Boy", releaseYear: 2017 },
  { id: "s16", title: "EARFQUAKE", artistId: "a5", albumName: "IGOR", releaseYear: 2019 },
];

export const concerts: Concert[] = [
  {
    id: "c1",
    artistId: "a1",
    venueId: "v1",
    date: "2025-05-14",
    tourName: "A Moon Shaped Pool Tour",
    isVerified: true,
    sourceURL: "https://www.setlist.fm",
    setlist: [
      {
        id: "c1-main",
        order: 0,
        songs: [
          { id: "c1-1", songId: "s5", position: 1, isCover: false },
          { id: "c1-2", songId: "s1", position: 2, isCover: false },
          { id: "c1-3", songId: "s3", position: 3, isCover: false },
          { id: "c1-4", songId: "s2", position: 4, isCover: false, notes: "extended outro" },
        ],
      },
      {
        id: "c1-encore",
        name: "Encore",
        order: 1,
        songs: [{ id: "c1-5", songId: "s4", position: 1, isCover: false }],
      },
    ],
  },
  {
    id: "c2",
    artistId: "a2",
    venueId: "v2",
    date: "2025-08-02",
    tourName: "Actual Life World Tour",
    isVerified: true,
    setlist: [
      {
        id: "c2-main",
        order: 0,
        songs: [
          { id: "c2-1", songId: "s7", position: 1, isCover: false },
          { id: "c2-2", songId: "s6", position: 2, isCover: false },
          { id: "c2-3", songId: "s8", position: 3, isCover: false, notes: "debut" },
        ],
      },
    ],
  },
  {
    id: "c3",
    artistId: "a3",
    venueId: "v3",
    date: "2025-09-20",
    tourName: "First Two Pages of Frankenstein Tour",
    isVerified: true,
    setlist: [
      {
        id: "c3-main",
        order: 0,
        songs: [
          { id: "c3-1", songId: "s10", position: 1, isCover: false },
          { id: "c3-2", songId: "s11", position: 2, isCover: false },
          { id: "c3-3", songId: "s9", position: 3, isCover: false },
        ],
      },
    ],
  },
  {
    id: "c4",
    artistId: "a4",
    venueId: "v4",
    date: "2026-09-05",
    tourName: "the record Tour",
    isVerified: false,
    setlist: [
      {
        id: "c4-main",
        order: 0,
        songs: [
          { id: "c4-1", songId: "s13", position: 1, isCover: false },
          { id: "c4-2", songId: "s12", position: 2, isCover: false },
        ],
      },
    ],
  },
  {
    id: "c5",
    artistId: "a5",
    venueId: "v3",
    date: "2026-08-14",
    tourName: "Chromakopia World Tour",
    isVerified: false,
    setlist: [
      {
        id: "c5-main",
        order: 0,
        songs: [
          { id: "c5-1", songId: "s16", position: 1, isCover: false },
          { id: "c5-2", songId: "s14", position: 2, isCover: false },
          { id: "c5-3", songId: "s15", position: 3, isCover: false },
        ],
      },
    ],
  },
];

export const concertLogs: ConcertLog[] = [
  {
    id: "cl1",
    userId: "u2",
    concertId: "c1",
    attendedDate: "2025-05-14",
    rating: 5,
    review:
      "Genuinely might be the best show I've ever seen. The Idioteque outro went on for what felt like ten minutes and nobody wanted it to stop.",
    isPrivate: false,
    likedSongIds: ["s2", "s3"],
    createdAt: "2025-05-15T02:10:00Z",
    updatedAt: "2025-05-15T02:10:00Z",
  },
  {
    id: "cl2",
    userId: "u1",
    concertId: "c1",
    attendedDate: "2025-05-14",
    rating: 4.5,
    review: "MSG acoustics did this setlist justice. Wish they'd played Reckoner but no complaints.",
    isPrivate: false,
    likedSongIds: ["s5"],
    createdAt: "2025-05-15T09:40:00Z",
    updatedAt: "2025-05-15T09:40:00Z",
  },
  {
    id: "cl3",
    userId: "u3",
    concertId: "c3",
    attendedDate: "2025-09-20",
    rating: 4,
    review: "Red Rocks at sunset for The National is basically cheating.",
    isPrivate: false,
    likedSongIds: ["s9"],
    createdAt: "2025-09-21T01:00:00Z",
    updatedAt: "2025-09-21T01:00:00Z",
  },
  {
    id: "cl4",
    userId: "u4",
    concertId: "c2",
    attendedDate: "2025-08-02",
    rating: 3.5,
    isPrivate: false,
    likedSongIds: [],
    createdAt: "2025-08-03T04:20:00Z",
    updatedAt: "2025-08-03T04:20:00Z",
  },
];

export const lineupEntries: LineupEntry[] = [
  { id: "le1", userId: "u1", concertId: "c4", addedDate: "2025-11-01", notes: "have tickets" },
  { id: "le2", userId: "u1", concertId: "c5", addedDate: "2026-01-10", notes: "hoping to go" },
];

export const artistIntents: ArtistIntent[] = [
  { id: "ai1", userId: "u1", artistId: "a2", addedDate: "2025-10-01" },
];

export const lists: ConcertList[] = [
  {
    id: "l1",
    title: "Shows that changed how I hear music",
    description: "The ones that stuck with me long after the lights came up.",
    ownerId: "u1",
    entries: [
      { concertId: "c1", rank: 1, notes: "Still thinking about the Idioteque outro." },
      { concertId: "c3", rank: 2 },
    ],
    isRanked: true,
    isPublic: true,
    tags: ["favorites"],
  },
];

export const activityFeed: Activity[] = [
  { id: "act1", type: { kind: "logged", concertLogId: "cl1" }, actorId: "u2", timestamp: "2025-05-15T02:10:00Z" },
  { id: "act2", type: { kind: "reviewed", concertLogId: "cl2" }, actorId: "u1", timestamp: "2025-05-15T09:40:00Z" },
  { id: "act3", type: { kind: "reviewed", concertLogId: "cl3" }, actorId: "u3", timestamp: "2025-09-21T01:00:00Z" },
  { id: "act4", type: { kind: "logged", concertLogId: "cl4" }, actorId: "u4", timestamp: "2025-08-03T04:20:00Z" },
  { id: "act5", type: { kind: "followedUser", userId: "u1" }, actorId: "u3", timestamp: "2025-06-01T12:00:00Z" },
  { id: "act6", type: { kind: "addedToList", listId: "l1" }, actorId: "u1", timestamp: "2025-09-22T18:00:00Z" },
  { id: "act7", type: { kind: "liked", concertLogId: "cl2" }, actorId: "u2", timestamp: "2025-05-16T10:00:00Z" },
];

// ---- Accessors ----

export function getUser(id: string): User | undefined {
  return users.find((u) => u.id === id);
}
export function getUserByUsername(username: string): User | undefined {
  return users.find((u) => u.username === username);
}
export function getArtist(id: string): Artist | undefined {
  return artists.find((a) => a.id === id);
}
export function getVenue(id: string): Venue | undefined {
  return venues.find((v) => v.id === id);
}
export function getSong(id: string): Song | undefined {
  return songs.find((s) => s.id === id);
}
export function getConcert(id: string): Concert | undefined {
  return concerts.find((c) => c.id === id);
}
export function getConcertLog(id: string): ConcertLog | undefined {
  return concertLogs.find((c) => c.id === id);
}
export function getList(id: string): ConcertList | undefined {
  return lists.find((l) => l.id === id);
}

export function getConcertLogsForConcert(concertId: string): ConcertLog[] {
  return concertLogs.filter((c) => c.concertId === concertId);
}
export function getConcertLogsForUser(userId: string): ConcertLog[] {
  return concertLogs
    .filter((c) => c.userId === userId)
    .sort((a, b) => (a.attendedDate < b.attendedDate ? 1 : -1));
}
export function getLineupForUser(userId: string): LineupEntry[] {
  return lineupEntries
    .filter((l) => l.userId === userId)
    .sort((a, b) => (getConcert(a.concertId)!.date < getConcert(b.concertId)!.date ? -1 : 1));
}
export function getArtistIntentsForUser(userId: string): ArtistIntent[] {
  return artistIntents.filter((a) => a.userId === userId);
}
export function getListsForUser(userId: string): ConcertList[] {
  return lists.filter((l) => l.ownerId === userId);
}

export function averageRating(concertId: string): number | undefined {
  const logs = getConcertLogsForConcert(concertId).filter((l) => l.rating !== undefined);
  if (logs.length === 0) return undefined;
  return logs.reduce((sum, l) => sum + (l.rating ?? 0), 0) / logs.length;
}

export function concertsForArtist(artistId: string): Concert[] {
  return concerts
    .filter((c) => c.artistId === artistId)
    .sort((a, b) => (a.date < b.date ? -1 : 1));
}
export function concertsForVenue(venueId: string): Concert[] {
  return concerts
    .filter((c) => c.venueId === venueId)
    .sort((a, b) => (a.date < b.date ? -1 : 1));
}

export function isUpcoming(concert: Concert): boolean {
  return new Date(concert.date).getTime() > Date.now();
}

export function timesSeenByUser(userId: string, artistId: string): number {
  return getConcertLogsForUser(userId).filter(
    (log) => getConcert(log.concertId)?.artistId === artistId,
  ).length;
}

export function trendingArtists(): Artist[] {
  return artists;
}
export function trendingConcerts(): Concert[] {
  return [...concerts].sort((a, b) => (a.date < b.date ? 1 : -1)).slice(0, 6);
}

export interface SearchResults {
  artists: Artist[];
  concerts: Concert[];
  venues: Venue[];
  members: User[];
}

export function search(query: string): SearchResults {
  const q = query.trim().toLowerCase();
  if (!q) return { artists: [], concerts: [], venues: [], members: [] };
  return {
    artists: artists.filter((a) => a.name.toLowerCase().includes(q)),
    concerts: concerts.filter((c) => {
      const artist = getArtist(c.artistId);
      const venue = getVenue(c.venueId);
      return (
        artist?.name.toLowerCase().includes(q) ||
        venue?.name.toLowerCase().includes(q) ||
        c.tourName?.toLowerCase().includes(q)
      );
    }),
    venues: venues.filter((v) => v.name.toLowerCase().includes(q) || v.city.toLowerCase().includes(q)),
    members: users.filter(
      (u) => u.username.toLowerCase().includes(q) || u.displayName.toLowerCase().includes(q),
    ),
  };
}
