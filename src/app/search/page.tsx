"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { search, trendingArtists, trendingConcerts } from "@/lib/mockData";
import ConcertRow from "@/components/ConcertRow";

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="mb-2 mt-6 text-sm font-semibold uppercase tracking-wide text-muted">{children}</h2>;
}

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const results = useMemo(() => search(query), [query]);
  const isSearching = query.trim().length > 0;

  return (
    <div className="mx-auto max-w-2xl">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search artists, concerts, venues, members..."
        className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-sm outline-none placeholder:text-muted focus:border-accent"
        autoFocus
      />

      {!isSearching && (
        <>
          <SectionTitle>Trending Artists</SectionTitle>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {trendingArtists().map((artist) => (
              <Link
                key={artist.id}
                href={`/artist/${artist.id}`}
                className="flex w-24 flex-shrink-0 flex-col items-center gap-2 text-center"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={artist.imageURL} alt={artist.name} className="h-20 w-20 rounded-full object-cover" />
                <span className="text-xs font-medium">{artist.name}</span>
              </Link>
            ))}
          </div>

          <SectionTitle>Popular Recent Concerts</SectionTitle>
          <div className="flex flex-col gap-3">
            {trendingConcerts().map((concert) => (
              <ConcertRow key={concert.id} concert={concert} />
            ))}
          </div>
        </>
      )}

      {isSearching && (
        <>
          {results.artists.length > 0 && (
            <>
              <SectionTitle>Artists</SectionTitle>
              <div className="flex flex-col gap-2">
                {results.artists.map((artist) => (
                  <Link
                    key={artist.id}
                    href={`/artist/${artist.id}`}
                    className="flex items-center gap-3 rounded-lg border border-border bg-surface p-3 hover:bg-surface-hover"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={artist.imageURL} alt={artist.name} className="h-10 w-10 rounded-full object-cover" />
                    <span className="font-medium">{artist.name}</span>
                  </Link>
                ))}
              </div>
            </>
          )}

          {results.concerts.length > 0 && (
            <>
              <SectionTitle>Concerts</SectionTitle>
              <div className="flex flex-col gap-3">
                {results.concerts.map((concert) => (
                  <ConcertRow key={concert.id} concert={concert} />
                ))}
              </div>
            </>
          )}

          {results.venues.length > 0 && (
            <>
              <SectionTitle>Venues</SectionTitle>
              <div className="flex flex-col gap-2">
                {results.venues.map((venue) => (
                  <Link
                    key={venue.id}
                    href={`/venue/${venue.id}`}
                    className="block rounded-lg border border-border bg-surface p-3 font-medium hover:bg-surface-hover"
                  >
                    {venue.name}
                    <span className="ml-2 text-sm font-normal text-muted">
                      {venue.city}
                      {venue.stateOrRegion ? `, ${venue.stateOrRegion}` : ""}
                    </span>
                  </Link>
                ))}
              </div>
            </>
          )}

          {results.members.length > 0 && (
            <>
              <SectionTitle>Members</SectionTitle>
              <div className="flex flex-col gap-2">
                {results.members.map((member) => (
                  <Link
                    key={member.id}
                    href={`/profile/${member.username}`}
                    className="flex items-center gap-3 rounded-lg border border-border bg-surface p-3 hover:bg-surface-hover"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={member.avatarURL}
                      alt={member.displayName}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-medium">{member.displayName}</p>
                      <p className="text-sm text-muted">@{member.username}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}

          {results.artists.length === 0 &&
            results.concerts.length === 0 &&
            results.venues.length === 0 &&
            results.members.length === 0 && (
              <p className="mt-6 text-sm text-muted">No results for &ldquo;{query}&rdquo;.</p>
            )}
        </>
      )}
    </div>
  );
}
