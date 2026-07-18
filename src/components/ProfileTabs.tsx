"use client";

import { useState } from "react";
import Link from "next/link";
import type { ArtistIntent, ConcertList, ConcertLog, LineupEntry } from "@/types";
import { getArtist, getConcert, getVenue } from "@/lib/mockData";
import { formatDate, formatDateShort } from "@/lib/format";
import StarRating from "./StarRating";

type Tab = "concerts" | "reviews" | "lists" | "lineup";

export default function ProfileTabs({
  logs,
  lists,
  lineup,
  artistIntents,
  showLineup,
}: {
  logs: ConcertLog[];
  lists: ConcertList[];
  lineup: LineupEntry[];
  artistIntents: ArtistIntent[];
  showLineup: boolean;
}) {
  const tabs: { id: Tab; label: string }[] = [
    { id: "concerts", label: "Concerts" },
    { id: "reviews", label: "Reviews" },
    { id: "lists", label: "Lists" },
    ...(showLineup ? ([{ id: "lineup", label: "Lineup" }] as { id: Tab; label: string }[]) : []),
  ];
  const [active, setActive] = useState<Tab>("concerts");
  const reviewed = logs.filter((l) => l.review);

  return (
    <div>
      <div className="flex gap-6 border-b border-border text-sm font-medium text-muted">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActive(tab.id)}
            className={`-mb-px border-b-2 pb-2 pt-1 transition-colors ${
              active === tab.id ? "border-accent text-foreground" : "border-transparent hover:text-foreground"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="mt-4">
        {active === "concerts" && (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {logs.length === 0 && <p className="text-sm text-muted">No concerts logged yet.</p>}
            {logs.map((log) => {
              const concert = getConcert(log.concertId);
              const artist = concert ? getArtist(concert.artistId) : undefined;
              if (!concert || !artist) return null;
              return (
                <Link
                  key={log.id}
                  href={`/concert/${concert.id}`}
                  className="rounded-lg border border-border bg-surface p-3 hover:bg-surface-hover"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={artist.imageURL} alt={artist.name} className="mb-2 h-20 w-full rounded object-cover" />
                  <p className="truncate text-sm font-medium">{artist.name}</p>
                  <p className="text-xs text-muted">{formatDateShort(concert.date)}</p>
                  {log.rating !== undefined && <StarRating rating={log.rating} />}
                </Link>
              );
            })}
          </div>
        )}

        {active === "reviews" && (
          <div className="flex flex-col gap-3">
            {reviewed.length === 0 && <p className="text-sm text-muted">No reviews yet.</p>}
            {reviewed.map((log) => {
              const concert = getConcert(log.concertId);
              const artist = concert ? getArtist(concert.artistId) : undefined;
              if (!concert || !artist) return null;
              return (
                <Link
                  key={log.id}
                  href={`/concert/${concert.id}`}
                  className="block rounded-lg border border-border bg-surface p-4 hover:bg-surface-hover"
                >
                  <div className="flex items-center justify-between">
                    <p className="font-medium">{artist.name}</p>
                    <StarRating rating={log.rating} />
                  </div>
                  <p className="text-xs text-muted">{formatDate(concert.date)}</p>
                  <p className="mt-2 text-sm leading-relaxed text-foreground/90">{log.review}</p>
                </Link>
              );
            })}
          </div>
        )}

        {active === "lists" && (
          <div className="flex flex-col gap-3">
            {lists.length === 0 && <p className="text-sm text-muted">No lists yet.</p>}
            {lists.map((list) => (
              <div key={list.id} className="rounded-lg border border-border bg-surface p-4">
                <p className="font-medium">{list.title}</p>
                <p className="text-sm text-muted">{list.description}</p>
                <p className="mt-1 text-xs text-muted">{list.entries.length} concerts</p>
              </div>
            ))}
          </div>
        )}

        {active === "lineup" && showLineup && (
          <div className="flex flex-col gap-6">
            <div>
              <h3 className="mb-2 text-sm font-semibold text-muted">Upcoming Shows</h3>
              <div className="flex flex-col gap-2">
                {lineup.length === 0 && <p className="text-sm text-muted">Nothing in your Lineup yet.</p>}
                {lineup.map((entry) => {
                  const concert = getConcert(entry.concertId);
                  const artist = concert ? getArtist(concert.artistId) : undefined;
                  const venue = concert ? getVenue(concert.venueId) : undefined;
                  if (!concert || !artist) return null;
                  return (
                    <Link
                      key={entry.id}
                      href={`/concert/${concert.id}`}
                      className="flex items-center justify-between rounded-lg border border-border bg-surface p-3 hover:bg-surface-hover"
                    >
                      <div>
                        <p className="font-medium">{artist.name}</p>
                        <p className="text-xs text-muted">
                          {venue?.name} · {formatDate(concert.date)}
                        </p>
                      </div>
                      {entry.notes && <span className="text-xs italic text-muted">{entry.notes}</span>}
                    </Link>
                  );
                })}
              </div>
            </div>

            <div>
              <h3 className="mb-2 text-sm font-semibold text-muted">Artists I Want to See</h3>
              <div className="flex gap-3 overflow-x-auto">
                {artistIntents.length === 0 && <p className="text-sm text-muted">None yet.</p>}
                {artistIntents.map((intent) => {
                  const artist = getArtist(intent.artistId);
                  if (!artist) return null;
                  return (
                    <Link
                      key={intent.id}
                      href={`/artist/${artist.id}`}
                      className="flex w-20 flex-shrink-0 flex-col items-center gap-1 text-center"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={artist.imageURL} alt={artist.name} className="h-16 w-16 rounded-full object-cover" />
                      <span className="text-xs">{artist.name}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
