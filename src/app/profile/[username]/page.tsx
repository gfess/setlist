import { notFound } from "next/navigation";
import Link from "next/link";
import {
  CURRENT_USER_ID,
  getArtist,
  getArtistIntentsForUser,
  getConcert,
  getConcertLogsForUser,
  getLineupForUser,
  getListsForUser,
  getUserByUsername,
} from "@/lib/mockData";
import ProfileTabs from "@/components/ProfileTabs";

export default async function ProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const user = getUserByUsername(username);
  if (!user) notFound();

  const isOwn = user.id === CURRENT_USER_ID;
  const logs = getConcertLogsForUser(user.id);
  const lists = getListsForUser(user.id);
  const lineup = getLineupForUser(user.id);
  const artistIntents = getArtistIntentsForUser(user.id);

  const thisYear = new Date().getFullYear();
  const concertsThisYear = logs.filter(
    (l) => new Date(l.attendedDate).getFullYear() === thisYear,
  ).length;
  const uniqueArtists = new Set(
    logs.map((l) => getConcert(l.concertId)?.artistId).filter(Boolean),
  ).size;

  return (
    <div className="mx-auto max-w-3xl">
      <div className="flex items-start gap-6">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={user.avatarURL}
          alt={user.displayName}
          className="h-24 w-24 flex-shrink-0 rounded-full border border-border object-cover"
        />
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold">{user.displayName}</h1>
            {isOwn ? (
              <Link href="/settings" className="text-muted hover:text-foreground" aria-label="Settings">
                ⚙︎
              </Link>
            ) : (
              <button className="rounded-full bg-accent px-4 py-1 text-sm font-semibold text-[#06210f] hover:opacity-90">
                Follow
              </button>
            )}
          </div>
          <p className="text-sm text-muted">@{user.username}</p>
          {user.bio && <p className="mt-2 max-w-md text-sm text-foreground/90">{user.bio}</p>}

          {user.favoriteArtistIds.length > 0 && (
            <div className="mt-3 flex gap-3">
              {user.favoriteArtistIds.map((id) => {
                const artist = getArtist(id);
                if (!artist) return null;
                return (
                  <Link key={id} href={`/artist/${id}`} className="flex flex-col items-center gap-1">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={artist.imageURL} alt={artist.name} className="h-12 w-12 rounded-full object-cover" />
                    <span className="max-w-[3.5rem] truncate text-[10px] text-muted">{artist.name}</span>
                  </Link>
                );
              })}
            </div>
          )}

          <div className="mt-4 flex gap-6 text-sm">
            <div>
              <span className="font-semibold">{logs.length}</span>{" "}
              <span className="text-muted">Concerts</span>
            </div>
            <div>
              <span className="font-semibold">{concertsThisYear}</span>{" "}
              <span className="text-muted">This Year</span>
            </div>
            <div>
              <span className="font-semibold">{uniqueArtists}</span>{" "}
              <span className="text-muted">Artists</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <ProfileTabs
          logs={logs}
          lists={lists}
          lineup={lineup}
          artistIntents={artistIntents}
          showLineup={isOwn}
        />
      </div>
    </div>
  );
}
