# Setlist — Design Document

> **Living document.** Update this file every time a decision is made or changed.
> Paste the full contents into any Claude session to restore full project context instantly.

---

## 1. App Concept

**Setlist** is a social platform for live music fans — modeled on Letterboxd's patterns, terminology, and interaction flows, applied to the concert experience.

Users log concerts they've attended, rate and review them, track setlists, follow friends, and build curated lists. The core loop mirrors Letterboxd: discover → attend → log → share → connect.

**Design & UX reference:** Letterboxd. Mirror its patterns and terminology unless explicitly decided otherwise.

---

## 2. Development Principles

- Build incrementally, one feature or component at a time
- Propose approach and get approval before writing code
- Explain tradeoffs clearly on architectural decisions
- Always SwiftUI unless specified otherwise
- MVVM architecture
- Clean, well-commented Swift code
- Prefer native SwiftUI components over third-party libraries
- Flag any decisions that are hard to reverse (data model changes, auth choices, etc.)

---

## 3. Project Phase

**Current phase:** Early planning / foundation

- Backend is undecided — do not assume one
- Keep the data layer abstracted so it can be swapped later
- Clearly separate canonical data (external) from user data (owned by Setlist)

---

## 4. Data Model

### 4.1 Entity Separation

| Type | Protocol | Examples | Writable? |
|------|----------|----------|-----------|
| Canonical | `ExternalEntity` | Artist, Venue, Concert, Song | No — sourced from Spotify / Setlist.fm / MusicBrainz |
| User content | `UserContent` | ConcertLog, List, LineupEntry, ArtistIntent, Activity | Yes — owned by Setlist |

---

### 4.2 Core Entities

#### `User`
- `id`, `username`, `displayName`, `bio`, `avatarURL`
- `joinedDate: Date`
- `favoriteArtists: [Artist]` — pinned to profile (like Letterboxd's favorite films)
- `lineup: [LineupEntry]`
- `artistIntents: [ArtistIntent]`
- `isPrivate: Bool`

#### `Artist`
- `id`, `name`, `slug`
- `imageURL`, `bio`
- `genres: [String]`
- `externalIDs` — Spotify, MusicBrainz, Setlist.fm IDs
- ⚠️ Alias/merge support (e.g. Ye vs Kanye West) deferred — not decided yet

#### `Venue`
- `id`, `name`, `slug`
- `city`, `stateOrRegion`, `country`
- `coordinates: CLLocationCoordinate2D?`
- `capacity: Int?`

#### `Concert`
- `id`
- `artist: Artist`
- `venue: Venue`
- `date: Date`
- `tourName: String?`
- `setlist: [SetlistSection]`
- `sourceURL: String?` — link to Setlist.fm source
- `isVerified: Bool`

#### `SetlistSection`
- `id`
- `name: String?` — e.g. "Encore", nil for main set
- `order: Int`
- `songs: [SetlistEntry]`

#### `SetlistEntry`
- `id`
- `song: Song`
- `position: Int`
- `notes: String?` — "debut", "with [guest]", "snippet", "acoustic"
- `isCover: Bool`
- `originalArtist: Artist?`

#### `Song`
- `id`, `title`
- `artist: Artist` — originating artist
- `albumName: String?`
- `releaseYear: Int?`

#### `ConcertLog` *(the diary entry equivalent)*
- `id`
- `user: User`
- `concert: Concert`
- `attendedDate: Date`
- `rating: Float?` — 0.5–5.0 in half-star increments
- `review: String?`
- `isPrivate: Bool`
- `likedSongs: [Song]`
- `createdAt`, `updatedAt: Date`

#### `LineupEntry` *(the Watchlist equivalent — called "Lineup" in Setlist)*
- `id`
- `user: User`
- `concert: Concert`
- `addedDate: Date`
- `notes: String?` — e.g. "have tickets", "hoping to go"
- **Auto-removed** when a matching `ConcertLog` is created for the same user + concert

#### `ArtistIntent` *(lightweight "want to see" flag)*
- `id`
- `user: User`
- `artist: Artist`
- `addedDate: Date`

#### `List`
- `id`, `title`, `description`
- `owner: User`
- `entries: [ListEntry]`
- `isRanked: Bool`
- `isPublic: Bool`
- `tags: [String]`

#### `ListEntry`
- `concert: Concert`
- `rank: Int?`
- `notes: String?`

#### `Activity`
- `id`
- `type: ActivityType`
- `actor: User`
- `timestamp: Date`
- `ActivityType`: `.logged(ConcertLog)`, `.reviewed(ConcertLog)`, `.liked(ConcertLog)`, `.addedToList(List)`, `.followedUser(User)`

---

### 4.3 Entity Relationship Summary

```
User ──── logs ──────────────► ConcertLog ◄──── Concert
 │                                                  │
 ├── lineup ──────────────────► LineupEntry         │
 │                                                  │
 └── artistIntents ──────────► ArtistIntent    ┌────┴────┐
                                              Artist    Venue
                                                │
                                          SetlistSection[]
                                                │
                                          SetlistEntry[]
                                                │
                                             Song
```

---

## 5. Resolved Decisions

| # | Decision | Resolution | Rationale |
|---|----------|------------|-----------|
| 1 | Data source for artists/songs/concerts | External APIs only (Spotify, Setlist.fm, MusicBrainz) — never user-submitted | Ensures canonical naming matches what users see in Spotify etc. |
| 2 | Social graph model | Asymmetric follow (follower/following) | Allows users to follow prolific concert-goers without mutual requirement |
| 3 | Rating scale | Half-star increments, 0.5–5.0 | Mirrors Letterboxd convention |
| 4 | Multiple logs per concert | Allowed | Covers residencies, festival repeat sets, etc. UI defaults to most recent |
| 5 | Data layer separation | Canonical data (read-only, external) vs User data (writable, owned by Setlist) modeled as distinct Swift protocols from day one | Makes backend swap clean; enforces boundary in code |
| 6 | Guest/browse mode | Guests can browse but cannot log or follow | Lowers friction for discovery; auth required for social actions |
| 7 | Tab bar | 5 tabs: Home · Search · + (Log) · Activity · Profile | Activity kept as first-class tab for social loop |
| 8 | Log entry point | Both: center + tab and Concert Detail page CTA | Maximum discoverability |
| 9 | Profile stats | Concerts · This Year · Artists (unique artists seen) | Streak removed for v1; "Artists" more meaningful than raw count alone |
| 10 | Lineup (Plan to Go) | Both Level 1 (specific concerts) and Level 2 (artist intent), Level 2 lightweight in v1 | Level 2 costs little to add now; expensive to retrofit later |
| 11 | Lineup tab content | Primary: upcoming shows sorted by date. Secondary: Artists I Want to See | Specific concerts are the priority; artist intent is supplementary |

---

## 6. Architecture Decisions

| # | Decision | Resolution |
|---|----------|------------|
| 1 | UI framework | SwiftUI |
| 2 | Architecture pattern | MVVM |
| 3 | Data layer | Protocol-based (`DataService` protocol + `MockDataService` for dev) — no concrete backend assumed |
| 4 | External entity contract | `ExternalEntity` protocol for Artist/Venue/Concert/Song; `UserContent` protocol for ConcertLog/List/LineupEntry/ArtistIntent/Activity |

---

## 7. Screen Map

### Tab Bar
`Home` · `Search` · `+` *(Log — modal)* · `Activity` · `Profile`

---

### 🏠 Home
Social feed of followed users' activity.
- Concert log cards (rating, review snippet, setlist highlights)
- → Concert Detail
- → User Profile

---

### 🔍 Search
- Search bar: artists, concerts, venues, members
- Default state: trending artists, popular recent concerts
- Results sections: Artists · Concerts · Venues · Members
- → Artist Page
- → Concert Detail
- → Venue Page
- → User Profile

---

### ➕ Log a Concert *(modal)*
Multi-step sheet:
1. Search for concert (artist → date/show)
2. Rate it (half-star selector)
3. Write a review *(optional)*
4. Highlight songs from the setlist *(optional)*
5. Set visibility (public / private)

Dismissible at any step. Also triggered from Concert Detail.

---

### 🔔 Activity
- Follows, likes, comments on your content
- "Also logged" — friends who logged the same concert as you
- → User Profile
- → Concert Detail

---

### 👤 Profile
**Your own profile:**
- Avatar, username, bio
- Favorite artists row (pinned, like Letterboxd's favorite films)
- Stats: `Concerts` · `This Year` · `Artists`
- Tabs: `Concerts` · `Reviews` · `Lists` · `Lineup`
- Gear icon → Settings

**Lineup tab:**
- Section 1: Upcoming Shows — `LineupEntry[]` sorted by concert date (soonest first)
- Section 2: Artists I Want to See — `ArtistIntent[]` as scrollable artist chips

---

### Supporting Screens

#### Concert Detail *(most important screen)*
- Artist, venue, date, tour name
- Full setlist with sections (main set, encores)
- Community stats: X people attended · avg rating
- Friends who logged it
- Reviews
- CTAs:
  - Past concert → **"Log this show"**
  - Upcoming → **"Add to Lineup"**
  - Already in Lineup → **"In your Lineup"** (tappable to remove)
  - Already logged → **"Logged"** (tappable to edit)
- → Venue Page
- → Artist Page

#### Artist Page
- Header: image, name, genre tags
- "Want to See" button → creates `ArtistIntent`
- Your history: X times seen
- Upcoming concerts with per-show "Add to Lineup"
- Community concert history
- → Concert Detail

#### Venue Page
- Name, location, capacity
- All concerts at this venue
- → Concert Detail

#### User Profile *(someone else's)*
- Same layout as own profile
- Follow button (respects private account)

#### Concert Log Detail
- One user's log: rating, review, highlighted songs
- Like / comment
- → Concert Detail
- → User Profile

#### List Detail
- Title, description, owner
- Ranked or unranked entries with notes
- → Concert Detail

#### Settings
- Account, privacy, notifications, linked services (Spotify)

#### Onboarding
- Guest landing → Sign up / Log in
- Post-auth: follow suggested users, pick favorite artists

---

### Navigation Flow

```
Tab Bar
├── Home → Concert Detail → Artist / Venue / User Profile
├── Search → Artist / Concert / Venue / User Profile
├── + Log (modal) → Concert Detail
├── Activity → User Profile / Concert Detail
└── Profile → Concert Log Detail / List Detail / Lineup / Settings
```

---

## 8. Open Questions

| # | Question | Status |
|---|----------|--------|
| 1 | Backend choice (Firebase, Supabase, custom, etc.) | ⏳ Deferred |
| 2 | Setlist.fm integration — live fetch vs sync to own DB | ⏳ Deferred |
| 3 | Artist alias / merge support (e.g. Ye vs Kanye West) | ⏳ Deferred |
| 4 | Auth provider (Sign in with Apple, email, etc.) | ⏳ Deferred |
| 5 | Artist follow notifications (new shows announced) | ⏳ Deferred to post-v1 |

---

## 9. Build Log

| Date | Step Completed |
|------|----------------|
| 2025 | Data model designed and all core decisions resolved |
| 2025 | Screen map completed, Lineup feature designed, Profile stats finalized |

---

## 10. External Resources

- [Setlist.fm API](https://api.setlist.fm/docs/1.0/index.html)
- [Spotify Web API](https://developer.spotify.com/documentation/web-api)
- [MusicBrainz API](https://musicbrainz.org/doc/MusicBrainz_API)
- [Letterboxd](https://letterboxd.com) — primary UX reference
