"use client";

import { baseLikeCount, useInteractions } from "@/lib/store";

export default function LikeButton({ concertLogId }: { concertLogId: string }) {
  const { hasLiked, toggleLike } = useInteractions();
  const liked = hasLiked(concertLogId);
  const count = baseLikeCount(concertLogId) + (liked ? 1 : 0);

  return (
    <button
      onClick={() => toggleLike(concertLogId)}
      className={`inline-flex items-center gap-1.5 text-sm transition-colors ${
        liked ? "text-accent-orange" : "text-muted hover:text-foreground"
      }`}
      aria-pressed={liked}
      aria-label={liked ? "Unlike" : "Like"}
    >
      <span>{liked ? "♥" : "♡"}</span>
      <span>{count}</span>
    </button>
  );
}
