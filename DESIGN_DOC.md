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

### 4.1 Core Entities

#### `User`
- `id`, `username`, `displayName`, `bio`, `avatarURL`
- `joinedDate: Date`
- `favoriteArtists: [Artist]` — pinned to profile (like Letterboxd's favorite films)
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

### 4.2 Entity Relationship Summary

```
User ──── logs ──────────────► ConcertLog ◄──── Concert
                                                    │
                                               ┌────┴────┐
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

---

## 6. Architecture Decisions

| # | Decision | Resolution |
|---|----------|------------|
| 1 | UI framework | SwiftUI |
| 2 | Architecture pattern | MVVM |
| 3 | Data layer | Protocol-based (`DataService` protocol + `MockDataService` for dev) — no concrete backend assumed |
| 4 | External entity contract | `ExternalEntity` protocol for Artist/Venue/Concert/Song; `UserContent` protocol for ConcertLog/List/Activity |

---

## 7. Open Questions

| # | Question | Status |
|---|----------|--------|
| 1 | Backend choice (Firebase, Supabase, custom, etc.) | ⏳ Deferred |
| 2 | Setlist.fm integration — live fetch vs sync to own DB | ⏳ Deferred |
| 3 | Artist alias / merge support (e.g. Ye vs Kanye West) | ⏳ Deferred |
| 4 | Auth provider (Sign in with Apple, email, etc.) | ⏳ Deferred |

---

## 8. Screen Map & Navigation

> 🔲 Not yet defined — next step.

---

## 9. Build Log

| Date | Step Completed |
|------|----------------|
| 2025 | Data model designed and all core decisions resolved |

---

## 10. External Resources

- [Setlist.fm API](https://api.setlist.fm/docs/1.0/index.html)
- [Spotify Web API](https://developer.spotify.com/documentation/web-api)
- [MusicBrainz API](https://musicbrainz.org/doc/MusicBrainz_API)
- [Letterboxd](https://letterboxd.com) — primary UX reference
