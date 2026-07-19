import { notFound } from "next/navigation";
import {
  CURRENT_USER_ID,
  concertsForArtist,
  getArtist,
  isUpcoming,
  timesSeenByUser,
} from "@/lib/mockData";
import ConcertRow from "@/components/ConcertRow";
import WantToSeeButton from "@/components/WantToSeeButton";

export default async function ArtistPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const artist = getArtist(id);
  if (!artist) notFound();

  const allConcerts = concertsForArtist(artist.id);
  const upcoming = allConcerts.filter(isUpcoming);
  const past = allConcerts.filter((c) => !isUpcoming(c));
  const timesSeen = timesSeenByUser(CURRENT_USER_ID, artist.id);

  return (
    <div className="mx-auto max-w-3xl">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={artist.imageURL}
          alt={artist.name}
          className="h-32 w-32 flex-shrink-0 rounded-full object-cover"
        />
        <div>
          <h1 className="text-2xl font-bold">{artist.name}</h1>
          <div className="mt-1 flex gap-2">
            {artist.genres.map((g) => (
              <span key={g} className="rounded-full bg-surface px-2 py-0.5 text-xs text-muted">
                {g}
              </span>
            ))}
          </div>
          <p className="mt-3 max-w-md text-sm text-foreground/90">{artist.bio}</p>
          <div className="mt-4 flex items-center gap-3">
            <WantToSeeButton artistId={artist.id} />
            <span className="text-sm text-muted">
              You&apos;ve seen {artist.name} {timesSeen} time{timesSeen === 1 ? "" : "s"}
            </span>
          </div>
        </div>
      </div>

      {upcoming.length > 0 && (
        <section className="mt-8">
          <h2 className="mb-3 text-lg font-semibold">Upcoming Concerts</h2>
          <div className="flex flex-col gap-3">
            {upcoming.map((concert) => (
              <ConcertRow key={concert.id} concert={concert} />
            ))}
          </div>
        </section>
      )}

      <section className="mt-8">
        <h2 className="mb-3 text-lg font-semibold">Concert History</h2>
        {past.length === 0 && <p className="text-sm text-muted">No past concerts logged yet.</p>}
        <div className="flex flex-col gap-3">
          {past.map((concert) => (
            <ConcertRow key={concert.id} concert={concert} />
          ))}
        </div>
      </section>
    </div>
  );
}
