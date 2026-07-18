import Link from "next/link";
import type { ConcertLog } from "@/types";
import { getArtist, getConcert, getUser, getVenue } from "@/lib/mockData";
import { formatDate, timeAgo } from "@/lib/format";
import StarRating from "./StarRating";

export default function ConcertLogCard({ log }: { log: ConcertLog }) {
  const concert = getConcert(log.concertId);
  const user = getUser(log.userId);
  if (!concert || !user) return null;
  const artist = getArtist(concert.artistId);
  const venue = getVenue(concert.venueId);

  return (
    <article className="rounded-lg border border-border bg-surface p-4">
      <div className="flex items-center gap-2 text-sm text-muted">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={user.avatarURL} alt={user.displayName} className="h-6 w-6 rounded-full object-cover" />
        <Link href={`/profile/${user.username}`} className="font-medium text-foreground hover:underline">
          {user.displayName}
        </Link>
        <span>logged</span>
        <span className="ml-auto text-xs">{timeAgo(log.createdAt)}</span>
      </div>

      <Link href={`/concert/${concert.id}`} className="mt-3 block">
        <h3 className="text-lg font-semibold hover:underline">{artist?.name}</h3>
        <p className="text-sm text-muted">
          {venue?.name} · {venue?.city} · {formatDate(concert.date)}
        </p>
      </Link>

      {log.rating !== undefined && (
        <div className="mt-2">
          <StarRating rating={log.rating} />
        </div>
      )}

      {log.review && <p className="mt-2 text-sm leading-relaxed text-foreground/90">{log.review}</p>}
    </article>
  );
}
