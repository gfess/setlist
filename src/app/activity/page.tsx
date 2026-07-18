import Link from "next/link";
import {
  activityFeed,
  getArtist,
  getConcert,
  getConcertLog,
  getList,
  getUser,
} from "@/lib/mockData";
import { timeAgo } from "@/lib/format";
import type { Activity } from "@/types";

function describeActivity(activity: Activity): { text: React.ReactNode } | null {
  const actor = getUser(activity.actorId);
  if (!actor) return null;
  const actorLink = (
    <Link href={`/profile/${actor.username}`} className="font-medium hover:underline">
      {actor.displayName}
    </Link>
  );

  switch (activity.type.kind) {
    case "logged": {
      const log = getConcertLog(activity.type.concertLogId);
      const concert = log ? getConcert(log.concertId) : undefined;
      const artist = concert ? getArtist(concert.artistId) : undefined;
      if (!log || !concert || !artist) return null;
      return {
        text: (
          <>
            {actorLink} logged{" "}
            <Link href={`/concert/${concert.id}`} className="font-medium hover:underline">
              {artist.name}
            </Link>
          </>
        ),
      };
    }
    case "reviewed": {
      const log = getConcertLog(activity.type.concertLogId);
      const concert = log ? getConcert(log.concertId) : undefined;
      const artist = concert ? getArtist(concert.artistId) : undefined;
      if (!log || !concert || !artist) return null;
      return {
        text: (
          <>
            {actorLink} reviewed{" "}
            <Link href={`/concert/${concert.id}`} className="font-medium hover:underline">
              {artist.name}
            </Link>
          </>
        ),
      };
    }
    case "liked": {
      const log = getConcertLog(activity.type.concertLogId);
      const concert = log ? getConcert(log.concertId) : undefined;
      const artist = concert ? getArtist(concert.artistId) : undefined;
      const loggedBy = log ? getUser(log.userId) : undefined;
      if (!log || !concert || !artist || !loggedBy) return null;
      return {
        text: (
          <>
            {actorLink} liked{" "}
            <Link href={`/profile/${loggedBy.username}`} className="hover:underline">
              {loggedBy.displayName}
            </Link>
            &apos;s log of{" "}
            <Link href={`/concert/${concert.id}`} className="font-medium hover:underline">
              {artist.name}
            </Link>
          </>
        ),
      };
    }
    case "addedToList": {
      const list = getList(activity.type.listId);
      if (!list) return null;
      return {
        text: (
          <>
            {actorLink} added to the list{" "}
            <Link href={`/profile/${actor.username}`} className="font-medium hover:underline">
              {list.title}
            </Link>
          </>
        ),
      };
    }
    case "followedUser": {
      const followed = getUser(activity.type.userId);
      if (!followed) return null;
      return {
        text: (
          <>
            {actorLink} started following{" "}
            <Link href={`/profile/${followed.username}`} className="font-medium hover:underline">
              {followed.displayName}
            </Link>
          </>
        ),
      };
    }
  }
}

export default function ActivityPage() {
  const items = [...activityFeed]
    .sort((a, b) => (a.timestamp < b.timestamp ? 1 : -1))
    .map((activity) => ({ activity, described: describeActivity(activity) }))
    .filter((item) => item.described !== null);

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-4 text-xl font-bold">Activity</h1>
      <div className="flex flex-col gap-2">
        {items.map(({ activity, described }) => (
          <div
            key={activity.id}
            className="flex items-center justify-between rounded-lg border border-border bg-surface px-4 py-3 text-sm"
          >
            <span>{described!.text}</span>
            <span className="flex-shrink-0 pl-3 text-xs text-muted">{timeAgo(activity.timestamp)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
