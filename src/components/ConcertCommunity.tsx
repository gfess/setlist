"use client";

import Link from "next/link";
import type { ConcertLog } from "@/types";
import { CURRENT_USER_ID, getConcertLogsForConcert, getUser } from "@/lib/mockData";
import { useInteractions } from "@/lib/store";
import StarRating from "@/components/StarRating";
import LikeButton from "@/components/LikeButton";

function mergedLogs(concertId: string, userLogs: ConcertLog[]): ConcertLog[] {
  const mine = userLogs.filter((l) => l.concertId === concertId);
  const rest = getConcertLogsForConcert(concertId).filter(
    (l) => !mine.some((m) => m.id === l.id) && l.userId !== CURRENT_USER_ID,
  );
  return [...mine, ...rest];
}

export function ConcertStats({ concertId }: { concertId: string }) {
  const { userLogs } = useInteractions();
  const logs = mergedLogs(concertId, userLogs);
  const rated = logs.filter((l) => l.rating !== undefined);
  if (rated.length === 0) return null;
  const avg = rated.reduce((sum, l) => sum + (l.rating ?? 0), 0) / rated.length;

  return (
    <div className="flex items-center gap-2 text-sm text-muted">
      <StarRating rating={avg} size="md" />
      <span>
        {avg.toFixed(1)} · {logs.length} log{logs.length === 1 ? "" : "s"}
      </span>
    </div>
  );
}

export function ConcertReviews({ concertId }: { concertId: string }) {
  const { userLogs } = useInteractions();
  const logs = mergedLogs(concertId, userLogs);
  const reviews = logs.filter((l) => l.review);

  return (
    <section className="mt-8">
      <h2 className="mb-3 text-lg font-semibold">Reviews</h2>
      {reviews.length === 0 && <p className="text-sm text-muted">No reviews yet.</p>}
      <div className="flex flex-col gap-3">
        {reviews.map((log) => {
          const author = getUser(log.userId);
          return (
            <div key={log.id} className="rounded-lg border border-border bg-surface p-4">
              <div className="mb-1 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {author && (
                    <Link
                      href={`/profile/${author.username}`}
                      className="text-sm font-medium hover:underline"
                    >
                      {author.displayName}
                    </Link>
                  )}
                  <StarRating rating={log.rating} />
                </div>
              </div>
              <p className="text-sm leading-relaxed">{log.review}</p>
              <div className="mt-3 border-t border-border pt-2">
                <LikeButton concertLogId={log.id} />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
