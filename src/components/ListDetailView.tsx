"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { notFound } from "next/navigation";
import type { ConcertList } from "@/types";
import {
  CURRENT_USER_ID,
  getArtist,
  getConcert,
  getList,
  getUser,
  getVenue,
} from "@/lib/mockData";
import { useInteractions } from "@/lib/store";
import { formatDate } from "@/lib/format";
import AddConcertToList from "@/components/AddConcertToList";

export default function ListDetailView({ listId }: { listId: string }) {
  const store = useInteractions();
  const router = useRouter();
  const [editingMeta, setEditingMeta] = useState(false);
  const [titleDraft, setTitleDraft] = useState("");
  const [descDraft, setDescDraft] = useState("");
  const [deleting, setDeleting] = useState(false);

  // The current user's lists come from the store (editable); everyone else's
  // are read-only mock data.
  const list: ConcertList | undefined = store.getUserList(listId) ?? getList(listId);

  // Wait for the store to hydrate before deciding a list is missing — user
  // lists live in localStorage and aren't present during SSR / first render.
  if (deleting) return null; // redirecting after delete
  if (!store.hydrated && !list) {
    return <p className="mx-auto max-w-2xl text-sm text-muted">Loading…</p>;
  }
  if (!list) notFound();

  const owner = getUser(list.ownerId);
  const isOwner = list.ownerId === CURRENT_USER_ID;

  function startEdit() {
    setTitleDraft(list!.title);
    setDescDraft(list!.description);
    setEditingMeta(true);
  }
  function saveEdit() {
    store.updateListMeta(list!.id, { title: titleDraft, description: descDraft });
    setEditingMeta(false);
  }
  function handleDelete() {
    if (confirm("Delete this list? This can't be undone.")) {
      // Navigate away first and suppress the not-found path, so removing the
      // list from the store doesn't flash a 404 before the redirect lands.
      setDeleting(true);
      router.push(owner ? `/profile/${owner.username}` : "/");
      store.deleteList(list!.id);
    }
  }

  const entryIds = list.entries.map((e) => e.concertId);

  return (
    <div className="mx-auto max-w-2xl">
      {editingMeta ? (
        <div className="rounded-lg border border-border bg-surface p-4">
          <input
            value={titleDraft}
            onChange={(e) => setTitleDraft(e.target.value)}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-lg font-semibold outline-none focus:border-accent"
            placeholder="List title"
          />
          <textarea
            value={descDraft}
            onChange={(e) => setDescDraft(e.target.value)}
            rows={3}
            className="mt-2 w-full resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
            placeholder="Description"
          />
          <div className="mt-3 flex gap-2">
            <button
              onClick={saveEdit}
              className="rounded-full bg-accent px-4 py-1.5 text-sm font-semibold text-[#06210f] hover:opacity-90"
            >
              Save
            </button>
            <button
              onClick={() => setEditingMeta(false)}
              className="rounded-full border border-border px-4 py-1.5 text-sm text-muted hover:text-foreground"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div>
          <div className="flex items-start justify-between gap-3">
            <h1 className="text-2xl font-bold">{list.title}</h1>
            {isOwner && (
              <div className="flex flex-shrink-0 gap-2 pt-1">
                <button onClick={startEdit} className="text-sm text-muted hover:text-foreground">
                  Edit
                </button>
                <button onClick={handleDelete} className="text-sm text-muted hover:text-red-400">
                  Delete
                </button>
              </div>
            )}
          </div>
          {list.description && <p className="mt-1 text-sm text-foreground/90">{list.description}</p>}
          <div className="mt-2 flex items-center gap-2 text-xs text-muted">
            {owner && (
              <>
                <Link href={`/profile/${owner.username}`} className="hover:underline">
                  {owner.displayName}
                </Link>
                <span>·</span>
              </>
            )}
            <span>{list.entries.length} concerts</span>
            {list.isRanked && <span>· Ranked</span>}
            {!list.isPublic && <span>· Private</span>}
          </div>
        </div>
      )}

      {isOwner && (
        <div className="mt-4 flex items-center gap-4 text-xs text-muted">
          <label className="flex cursor-pointer items-center gap-1.5">
            <input
              type="checkbox"
              checked={list.isRanked}
              onChange={(e) => store.updateListMeta(list.id, { isRanked: e.target.checked })}
              className="accent-accent"
            />
            Ranked
          </label>
          <label className="flex cursor-pointer items-center gap-1.5">
            <input
              type="checkbox"
              checked={list.isPublic}
              onChange={(e) => store.updateListMeta(list.id, { isPublic: e.target.checked })}
              className="accent-accent"
            />
            Public
          </label>
        </div>
      )}

      <div className="mt-6 flex flex-col gap-2">
        {list.entries.length === 0 && (
          <p className="text-sm text-muted">No concerts in this list yet.</p>
        )}
        {list.entries.map((entry, i) => {
          const concert = getConcert(entry.concertId);
          const artist = concert ? getArtist(concert.artistId) : undefined;
          const venue = concert ? getVenue(concert.venueId) : undefined;
          if (!concert || !artist) return null;
          return (
            <div key={entry.concertId} className="rounded-lg border border-border bg-surface p-3">
              <div className="flex items-center gap-3">
                {list.isRanked && (
                  <span className="w-6 flex-shrink-0 text-center text-lg font-bold text-muted">
                    {entry.rank ?? i + 1}
                  </span>
                )}
                <Link href={`/concert/${concert.id}`} className="flex min-w-0 flex-1 items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={artist.imageURL} alt={artist.name} className="h-11 w-11 rounded object-cover" />
                  <div className="min-w-0">
                    <p className="truncate font-medium">{artist.name}</p>
                    <p className="truncate text-xs text-muted">
                      {venue?.name} · {formatDate(concert.date)}
                    </p>
                  </div>
                </Link>
                {isOwner && (
                  <div className="flex flex-shrink-0 items-center gap-1">
                    {list.isRanked && (
                      <>
                        <button
                          onClick={() => store.moveEntry(list.id, entry.concertId, -1)}
                          disabled={i === 0}
                          className="px-1.5 text-muted hover:text-foreground disabled:opacity-30"
                          aria-label="Move up"
                        >
                          ↑
                        </button>
                        <button
                          onClick={() => store.moveEntry(list.id, entry.concertId, 1)}
                          disabled={i === list.entries.length - 1}
                          className="px-1.5 text-muted hover:text-foreground disabled:opacity-30"
                          aria-label="Move down"
                        >
                          ↓
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => store.removeConcertFromList(list.id, entry.concertId)}
                      className="px-1.5 text-muted hover:text-red-400"
                      aria-label="Remove from list"
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>
              {isOwner ? (
                <input
                  defaultValue={entry.notes ?? ""}
                  onBlur={(e) => store.setEntryNotes(list.id, entry.concertId, e.target.value)}
                  placeholder="Add a note..."
                  className="mt-2 w-full rounded border border-border bg-background px-2 py-1 text-xs outline-none focus:border-accent"
                />
              ) : (
                entry.notes && <p className="mt-2 text-xs italic text-muted">{entry.notes}</p>
              )}
            </div>
          );
        })}
      </div>

      {isOwner && (
        <div className="mt-4">
          <AddConcertToList
            excludeIds={entryIds}
            onAdd={(concertId) => store.addConcertToList(list.id, concertId)}
          />
        </div>
      )}
    </div>
  );
}
