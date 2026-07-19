"use client";

import { useMemo, useState } from "react";
import { concerts, getArtist, getVenue } from "@/lib/mockData";
import { formatDate } from "@/lib/format";

// A compact concert search box used to add shows to a list. Excludes concerts
// already present. Calls onAdd with the chosen concertId.
export default function AddConcertToList({
  excludeIds,
  onAdd,
}: {
  excludeIds: string[];
  onAdd: (concertId: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const available = concerts.filter((c) => !excludeIds.includes(c.id));
    if (!q) return available.slice(0, 6);
    return available.filter((c) => {
      const a = getArtist(c.artistId);
      const v = getVenue(c.venueId);
      return a?.name.toLowerCase().includes(q) || v?.name.toLowerCase().includes(q);
    });
  }, [query, excludeIds]);

  return (
    <div>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setOpen(true)}
        placeholder="Add a concert to this list..."
        className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-sm outline-none placeholder:text-muted focus:border-accent"
      />
      {open && (
        <div className="mt-2 flex flex-col gap-1.5">
          {results.length === 0 && <p className="px-1 text-xs text-muted">No matching concerts.</p>}
          {results.map((c) => {
            const a = getArtist(c.artistId);
            const v = getVenue(c.venueId);
            return (
              <button
                key={c.id}
                onClick={() => {
                  onAdd(c.id);
                  setQuery("");
                }}
                className="flex items-center gap-3 rounded-lg border border-border bg-surface p-2.5 text-left hover:bg-surface-hover"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={a?.imageURL} alt={a?.name} className="h-9 w-9 rounded object-cover" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{a?.name}</p>
                  <p className="truncate text-xs text-muted">
                    {v?.name} · {formatDate(c.date)}
                  </p>
                </div>
                <span className="ml-auto text-accent">+</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
