"use client";

import { useState } from "react";
import Link from "next/link";

export default function ConcertCTA({
  concertId,
  upcoming,
  initiallyLogged,
  initiallyInLineup,
}: {
  concertId: string;
  upcoming: boolean;
  initiallyLogged: boolean;
  initiallyInLineup: boolean;
}) {
  const [inLineup, setInLineup] = useState(initiallyInLineup);

  if (!upcoming) {
    if (initiallyLogged) {
      return (
        <Link
          href={`/log?concertId=${concertId}`}
          className="rounded-full border border-accent px-5 py-2 text-sm font-semibold text-accent transition-colors hover:bg-accent/10"
        >
          ✓ Logged
        </Link>
      );
    }
    return (
      <Link
        href={`/log?concertId=${concertId}`}
        className="rounded-full bg-accent px-5 py-2 text-sm font-semibold text-[#06210f] transition-opacity hover:opacity-90"
      >
        Log this show
      </Link>
    );
  }

  if (inLineup) {
    return (
      <button
        onClick={() => setInLineup(false)}
        className="rounded-full border border-accent-blue px-5 py-2 text-sm font-semibold text-accent-blue transition-colors hover:bg-accent-blue/10"
      >
        In your Lineup
      </button>
    );
  }

  return (
    <button
      onClick={() => setInLineup(true)}
      className="rounded-full bg-accent-blue px-5 py-2 text-sm font-semibold text-[#06210f] transition-opacity hover:opacity-90"
    >
      Add to Lineup
    </button>
  );
}
