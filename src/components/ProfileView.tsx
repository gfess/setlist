"use client";

import Link from "next/link";
import type { ConcertLog, User } from "@/types";
import {
  getArtist,
  getArtistIntentsForUser,
  getConcert,
  getConcertLogsForUser,
  getLineupForUser,
  getListsForUser,
} from "@/lib/mockData";
import { useInteractions } from "@/lib/store";
import ProfileTabs from "@/components/ProfileTabs";
import FollowButton from "@/components/FollowButton";

export default function ProfileView({ user, isOwn }: { user: User; isOwn: boolean }) {
  const { userLogs, lineup } = useInteractions();

  const mockLogs = getConcertLogsForUser(user.id);
  // For your own profile, merge in logs created this session.
  const storeLogs = isOwn ? userLogs : [];
  const logs: ConcertLog[] = [
    ...storeLogs,
    ...mockLogs.filter((m) => !storeLogs.some((s) => s.id === m.id)),
  ].sort((a, b) => (a.attendedDate < b.attendedDate ? 1 : -1));

  const lists = getListsForUser(user.id);

  // Lineup reflects the live store (own profile), minus anything now logged.
  const loggedConcertIds = new Set(logs.map((l) => l.concertId));
  const lineupForUser = isOwn
    ? lineup
        .filter((id) => !loggedConcertIds.has(id))
        .map((id) => getConcert(id))
        .filter((c) => c !== undefined)
        .sort((a, b) => (a!.date < b!.date ? -1 : 1))
        .map((c) => ({
          id: `le-${c!.id}`,
          userId: user.id,
          concertId: c!.id,
          addedDate: "",
        }))
    : getLineupForUser(user.id);
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
              <FollowButton userId={user.id} />
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
          lineup={lineupForUser}
          artistIntents={artistIntents}
          showLineup={isOwn}
        />
      </div>
    </div>
  );
}
