import Link from "next/link";
import type { Concert } from "@/types";
import { getArtist, getVenue, averageRating, isUpcoming } from "@/lib/mockData";
import { formatDate } from "@/lib/format";
import StarRating from "./StarRating";

export default function ConcertRow({ concert }: { concert: Concert }) {
  const artist = getArtist(concert.artistId);
  const venue = getVenue(concert.venueId);
  const rating = averageRating(concert.id);
  const upcoming = isUpcoming(concert);

  return (
    <Link
      href={`/concert/${concert.id}`}
      className="flex items-center gap-4 rounded-lg border border-border bg-surface p-4 transition-colors hover:bg-surface-hover"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={artist?.imageURL}
        alt={artist?.name}
        className="h-14 w-14 flex-shrink-0 rounded-md object-cover"
      />
      <div className="min-w-0 flex-1">
        <p className="truncate font-semibold">{artist?.name}</p>
        <p className="truncate text-sm text-muted">
          {venue?.name} · {venue?.city} · {formatDate(concert.date)}
        </p>
      </div>
      <div className="flex-shrink-0 text-right">
        {upcoming ? (
          <span className="rounded-full bg-accent-blue/15 px-2 py-1 text-xs font-medium text-accent-blue">
            Upcoming
          </span>
        ) : (
          rating !== undefined && <StarRating rating={rating} />
        )}
      </div>
    </Link>
  );
}
