"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useInteractions } from "@/lib/store";

export default function NewListPage() {
  const { createList } = useInteractions();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isRanked, setIsRanked] = useState(false);
  const [isPublic, setIsPublic] = useState(true);

  function handleCreate() {
    const id = createList({ title, description, isRanked, isPublic });
    // Land on the detail page, where concerts get added. The detail view waits
    // for store hydration, so it resolves the freshly created list correctly.
    router.push(`/list/${id}`);
  }

  return (
    <div className="mx-auto max-w-lg">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-lg font-semibold">New List</h1>
        <Link href="/" className="text-sm text-muted hover:text-foreground">
          ✕ Cancel
        </Link>
      </div>

      <label className="mb-1 block text-sm font-medium">Title</label>
      <input
        autoFocus
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="e.g. Best shows of 2025"
        className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-sm outline-none placeholder:text-muted focus:border-accent"
      />

      <label className="mb-1 mt-4 block text-sm font-medium">Description</label>
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={3}
        placeholder="Optional — what's this list about?"
        className="w-full resize-none rounded-lg border border-border bg-surface px-4 py-2.5 text-sm outline-none placeholder:text-muted focus:border-accent"
      />

      <div className="mt-4 flex flex-col gap-3">
        <label className="flex cursor-pointer items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={isRanked}
            onChange={(e) => setIsRanked(e.target.checked)}
            className="accent-accent"
          />
          <span>
            Ranked list <span className="text-muted">— number entries in order</span>
          </span>
        </label>
        <label className="flex cursor-pointer items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={isPublic}
            onChange={(e) => setIsPublic(e.target.checked)}
            className="accent-accent"
          />
          <span>
            Public <span className="text-muted">— visible on your profile</span>
          </span>
        </label>
      </div>

      <button
        onClick={handleCreate}
        disabled={!title.trim()}
        className="mt-6 w-full rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-[#06210f] transition-opacity hover:opacity-90 disabled:opacity-40"
      >
        Create list
      </button>
      <p className="mt-2 text-center text-xs text-muted">
        You&apos;ll add concerts on the next screen.
      </p>
    </div>
  );
}
