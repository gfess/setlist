import { notFound } from "next/navigation";
import { concertsForVenue, getVenue } from "@/lib/mockData";
import ConcertRow from "@/components/ConcertRow";

export default async function VenuePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const venue = getVenue(id);
  if (!venue) notFound();

  const allConcerts = concertsForVenue(venue.id);

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-2xl font-bold">{venue.name}</h1>
      <p className="mt-1 text-sm text-muted">
        {venue.city}
        {venue.stateOrRegion ? `, ${venue.stateOrRegion}` : ""} · {venue.country}
        {venue.capacity ? ` · Capacity ${venue.capacity.toLocaleString()}` : ""}
      </p>

      <section className="mt-8">
        <h2 className="mb-3 text-lg font-semibold">Concerts at this Venue</h2>
        {allConcerts.length === 0 && <p className="text-sm text-muted">No concerts logged here yet.</p>}
        <div className="flex flex-col gap-3">
          {allConcerts.map((concert) => (
            <ConcertRow key={concert.id} concert={concert} />
          ))}
        </div>
      </section>
    </div>
  );
}
