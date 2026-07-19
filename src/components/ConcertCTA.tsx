"use client";

import Link from "next/link";
import { useInteractions } from "@/lib/store";
import { getConcertLogsForConcert } from "@/lib/mockData";
import { CURRENT_USER_ID } from "@/lib/mockData";

export default function ConcertCTA({
  concertId,
  upcoming,
}: {
  concertId: string;
  upcoming: boolean;
}) {
  const { inLineup, toggleLineup, userLogs } = useInteractions();

  const loggedInMock = getConcertLogsForConcert(concertId).some((l) => l.userId === CURRENT_USER_ID);
  const loggedInStore = userLogs.some((l) => l.concertId === concertId);
  const logged = loggedInMock || loggedInStore;

  if (logged) {
    return (
      <Link
        href={`/log?concertId=${concertId}`}
        className="rounded-full border border-accent px-5 py-2 text-sm font-semibold text-accent transition-colors hover:bg-accent/10"
      >
        ✓ Logged
      </Link>
    );
  }

  if (!upcoming) {
    return (
      <Link
        href={`/log?concertId=${concertId}`}
        className="rounded-full bg-accent px-5 py-2 text-sm font-semibold text-[#06210f] transition-opacity hover:opacity-90"
      >
        Log this show
      </Link>
    );
  }

  if (inLineup(concertId)) {
    return (
      <button
        onClick={() => toggleLineup(concertId)}
        className="rounded-full border border-accent-blue px-5 py-2 text-sm font-semibold text-accent-blue transition-colors hover:bg-accent-blue/10"
      >
        In your Lineup
      </button>
    );
  }

  return (
    <button
      onClick={() => toggleLineup(concertId)}
      className="rounded-full bg-accent-blue px-5 py-2 text-sm font-semibold text-[#06210f] transition-opacity hover:opacity-90"
    >
      Add to Lineup
    </button>
  );
}
