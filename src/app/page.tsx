import { activityFeed, getConcertLog } from "@/lib/mockData";
import ConcertLogCard from "@/components/ConcertLogCard";

export default function HomePage() {
  const logCards = activityFeed
    .filter((a) => a.type.kind === "logged" || a.type.kind === "reviewed")
    .sort((a, b) => (a.timestamp < b.timestamp ? 1 : -1))
    .map((a) => (a.type.kind === "logged" || a.type.kind === "reviewed" ? a.type.concertLogId : null))
    .filter((id): id is string => id !== null)
    .map((id) => getConcertLog(id))
    .filter((log) => log !== undefined);

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-4 text-xl font-bold">Home</h1>
      <div className="flex flex-col gap-4">
        {logCards.map((log) => (
          <ConcertLogCard key={log.id} log={log} />
        ))}
      </div>
    </div>
  );
}
