"use client";

import { useInteractions } from "@/lib/store";

export default function FollowButton({ userId }: { userId: string }) {
  const { isFollowing, toggleFollow } = useInteractions();
  const following = isFollowing(userId);

  return (
    <button
      onClick={() => toggleFollow(userId)}
      className={
        following
          ? "rounded-full border border-border px-4 py-1 text-sm font-semibold text-muted transition-colors hover:border-foreground hover:text-foreground"
          : "rounded-full bg-accent px-4 py-1 text-sm font-semibold text-[#06210f] transition-opacity hover:opacity-90"
      }
    >
      {following ? "Following" : "Follow"}
    </button>
  );
}
