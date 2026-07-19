import Link from "next/link";
import { notFound } from "next/navigation";
import { getArtist, getConcert, getSong, getVenue, isUpcoming } from "@/lib/mockData";
import { formatDate } from "@/lib/format";
import ConcertCTA from "@/components/ConcertCTA";
import { ConcertStats, ConcertReviews } from "@/components/ConcertCommunity";

export default async function ConcertDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const concert = getConcert(id);
  if (!concert) notFound();

  const artist = getArtist(concert.artistId);
  const venue = getVenue(concert.venueId);
  const upcoming = isUpcoming(concert);

  return (
    <div className="mx-auto max-w-3xl">
      <div className="flex flex-col gap-6 sm:flex-row">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={artist?.imageURL}
          alt={artist?.name}
          className="h-40 w-40 flex-shrink-0 rounded-lg object-cover"
        />
        <div className="flex-1">
          <Link href={`/artist/${artist?.id}`} className="text-2xl font-bold hover:underline">
            {artist?.name}
          </Link>
          {concert.tourName && <p className="text-muted">{concert.tourName}</p>}
          <p className="mt-1 text-sm text-foreground/90">
            <Link href={`/venue/${venue?.id}`} className="hover:underline">
              {venue?.name}
            </Link>
            {" · "}
            {venue?.city}
            {venue?.stateOrRegion ? `, ${venue.stateOrRegion}` : ""} · {formatDate(concert.date)}
          </p>

          <div className="mt-4 flex items-center gap-4">
            <ConcertStats concertId={concert.id} />
          </div>

          <div className="mt-4">
            <ConcertCTA concertId={concert.id} upcoming={upcoming} />
          </div>
        </div>
      </div>

      <section className="mt-8">
        <h2 className="mb-3 text-lg font-semibold">Setlist</h2>
        {!concert.isVerified && (
          <p className="mb-3 text-xs text-accent-orange">Unverified — may change before the show.</p>
        )}
        <div className="flex flex-col gap-5 rounded-lg border border-border bg-surface p-4">
          {concert.setlist.map((section) => (
            <div key={section.id}>
              {section.name && (
                <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">
                  {section.name}
                </h3>
              )}
              <ol className="flex flex-col gap-1.5">
                {section.songs.map((entry) => {
                  const song = getSong(entry.songId);
                  return (
                    <li key={entry.id} className="flex items-baseline gap-3 text-sm">
                      <span className="w-5 flex-shrink-0 text-muted">{entry.position}.</span>
                      <span className="font-medium">{song?.title}</span>
                      {entry.notes && <span className="text-xs italic text-muted">({entry.notes})</span>}
                    </li>
                  );
                })}
              </ol>
            </div>
          ))}
        </div>
        {concert.sourceURL && (
          <p className="mt-2 text-xs text-muted">
            Source:{" "}
            <a href={concert.sourceURL} className="hover:underline" target="_blank" rel="noreferrer">
              setlist.fm
            </a>
          </p>
        )}
      </section>

      <ConcertReviews concertId={concert.id} />
    </div>
  );
}
