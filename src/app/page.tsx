"use client";

import { activityFeed, getConcertLog } from "@/lib/mockData";
import { useInteractions } from "@/lib/store";
import ConcertLogCard from "@/components/ConcertLogCard";
import type { ConcertLog } from "@/types";

export default function HomePage() {
  const { userLogs } = useInteractions();

  const mockLogs = activityFeed
    .filter((a) => a.type.kind === "logged" || a.type.kind === "reviewed")
    .sort((a, b) => (a.timestamp < b.timestamp ? 1 : -1))
    .map((a) => (a.type.kind === "logged" || a.type.kind === "reviewed" ? a.type.concertLogId : null))
    .filter((id): id is string => id !== null)
    .map((id) => getConcertLog(id))
    .filter((log): log is ConcertLog => log !== undefined);

  // Your freshly created logs appear at the top of the feed.
  const feed = [...userLogs, ...mockLogs.filter((m) => !userLogs.some((u) => u.id === m.id))];

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-4 text-xl font-bold">Home</h1>
      <div className="flex flex-col gap-4">
        {feed.map((log) => (
          <ConcertLogCard key={log.id} log={log} />
        ))}
      </div>
    </div>
  );
}
