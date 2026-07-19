"use client";

import { useInteractions } from "@/lib/store";

export default function WantToSeeButton({ artistId }: { artistId: string }) {
  const { wantsToSee, toggleWantToSee } = useInteractions();
  const wants = wantsToSee(artistId);

  return (
    <button
      onClick={() => toggleWantToSee(artistId)}
      className={
        wants
          ? "rounded-full border border-accent px-4 py-1.5 text-sm font-semibold text-accent transition-colors hover:bg-accent/10"
          : "rounded-full bg-accent px-4 py-1.5 text-sm font-semibold text-[#06210f] transition-opacity hover:opacity-90"
      }
    >
      {wants ? "✓ Want to See" : "+ Want to See"}
    </button>
  );
}
