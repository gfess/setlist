"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ConcertList, ConcertLog } from "@/types";
import { CURRENT_USER_ID, artistIntents, lineupEntries, lists } from "@/lib/mockData";

// The interaction store holds all *mutable* user data for the prototype.
// Canonical data (artists, venues, concerts, songs) stays in mockData and is
// read directly. Everything a user can change lives here, seeded from the mock
// arrays, and is persisted to localStorage so it survives navigation + reloads.
// When a real backend arrives, these mutators become API calls — the component
// surface stays the same.

const STORAGE_KEY = "setlist_interactions_v1";

interface StoreState {
  follows: string[]; // userIds the current user follows
  wantToSee: string[]; // artistIds
  lineup: string[]; // concertIds
  likes: string[]; // concertLogIds
  userLogs: ConcertLog[]; // logs created by the current user this session
  // The current user's lists live entirely in the store (seeded from mock) so
  // they can be created, edited, reordered, and deleted. Other users' lists
  // stay read-only in the mock layer.
  userLists: ConcertList[];
}

function seedState(): StoreState {
  return {
    follows: [],
    wantToSee: artistIntents.filter((a) => a.userId === CURRENT_USER_ID).map((a) => a.artistId),
    lineup: lineupEntries.filter((l) => l.userId === CURRENT_USER_ID).map((l) => l.concertId),
    likes: [],
    userLogs: [],
    userLists: lists
      .filter((l) => l.ownerId === CURRENT_USER_ID)
      .map((l) => JSON.parse(JSON.stringify(l)) as ConcertList),
  };
}

export interface NewListInput {
  title: string;
  description: string;
  isRanked: boolean;
  isPublic: boolean;
}

// Recompute entry ranks from array order for a ranked list; clear them otherwise.
function renumber(list: ConcertList): ConcertList {
  return {
    ...list,
    entries: list.entries.map((e, i) => ({ ...e, rank: list.isRanked ? i + 1 : undefined })),
  };
}

interface StoreValue extends StoreState {
  // False until the store has loaded persisted state from localStorage on the
  // client. Server renders and the first client render see `false`, so views
  // that would otherwise 404 on missing user data can wait instead.
  hydrated: boolean;
  toggleFollow: (userId: string) => void;
  isFollowing: (userId: string) => boolean;
  toggleWantToSee: (artistId: string) => void;
  wantsToSee: (artistId: string) => boolean;
  toggleLineup: (concertId: string) => void;
  inLineup: (concertId: string) => boolean;
  toggleLike: (concertLogId: string) => void;
  hasLiked: (concertLogId: string) => boolean;
  addLog: (log: ConcertLog) => void;
  getUserList: (listId: string) => ConcertList | undefined;
  createList: (input: NewListInput) => string;
  updateListMeta: (listId: string, patch: Partial<NewListInput>) => void;
  deleteList: (listId: string) => void;
  addConcertToList: (listId: string, concertId: string) => void;
  removeConcertFromList: (listId: string, concertId: string) => void;
  moveEntry: (listId: string, concertId: string, direction: -1 | 1) => void;
  setEntryNotes: (listId: string, concertId: string, notes: string) => void;
}

const InteractionContext = createContext<StoreValue | null>(null);

function toggle(list: string[], id: string): string[] {
  return list.includes(id) ? list.filter((x) => x !== id) : [...list, id];
}

export function InteractionProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<StoreState>(seedState);
  const [hydrated, setHydrated] = useState(false);

  // Load any persisted state after mount. Initializing from the deterministic
  // seed on both server and client avoids a hydration mismatch; the stored
  // values are reconciled once, on mount, from localStorage (an external
  // system) — the canonical use case for a mount effect.
  useEffect(() => {
    let stored: StoreState | null = null;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) stored = { ...seedState(), ...JSON.parse(raw) };
    } catch {
      // ignore corrupt / unavailable storage
    }
    if (stored) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- syncing from localStorage on mount
      setState(stored);
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // ignore quota / unavailable storage
    }
  }, [state]);

  const value = useMemo<StoreValue>(() => {
    return {
      ...state,
      hydrated,
      toggleFollow: (userId) => setState((s) => ({ ...s, follows: toggle(s.follows, userId) })),
      isFollowing: (userId) => state.follows.includes(userId),
      toggleWantToSee: (artistId) =>
        setState((s) => ({ ...s, wantToSee: toggle(s.wantToSee, artistId) })),
      wantsToSee: (artistId) => state.wantToSee.includes(artistId),
      toggleLineup: (concertId) => setState((s) => ({ ...s, lineup: toggle(s.lineup, concertId) })),
      inLineup: (concertId) => state.lineup.includes(concertId),
      toggleLike: (concertLogId) => setState((s) => ({ ...s, likes: toggle(s.likes, concertLogId) })),
      hasLiked: (concertLogId) => state.likes.includes(concertLogId),
      addLog: (log) =>
        setState((s) => ({
          ...s,
          userLogs: [log, ...s.userLogs.filter((l) => l.id !== log.id)],
          // Design doc: a Lineup entry is auto-removed once its concert is logged.
          lineup: s.lineup.filter((id) => id !== log.concertId),
        })),
      getUserList: (listId) => state.userLists.find((l) => l.id === listId),
      createList: (input) => {
        // Digits-only id: list ids appear in the URL path (/list/[id]), so they
        // must be URL-safe (no colons from an ISO timestamp).
        const id = `ul-list-${new Date().toISOString().replace(/[^0-9]/g, "")}`;
        const list: ConcertList = {
          id,
          title: input.title.trim() || "Untitled list",
          description: input.description.trim(),
          ownerId: CURRENT_USER_ID,
          entries: [],
          isRanked: input.isRanked,
          isPublic: input.isPublic,
          tags: [],
        };
        setState((s) => ({ ...s, userLists: [list, ...s.userLists] }));
        return id;
      },
      updateListMeta: (listId, patch) =>
        setState((s) => ({
          ...s,
          userLists: s.userLists.map((l) => {
            if (l.id !== listId) return l;
            const merged: ConcertList = {
              ...l,
              title: patch.title !== undefined ? patch.title.trim() || "Untitled list" : l.title,
              description: patch.description !== undefined ? patch.description.trim() : l.description,
              isRanked: patch.isRanked !== undefined ? patch.isRanked : l.isRanked,
              isPublic: patch.isPublic !== undefined ? patch.isPublic : l.isPublic,
            };
            // Toggling ranked on/off re-derives (or clears) ranks.
            return patch.isRanked !== undefined ? renumber(merged) : merged;
          }),
        })),
      deleteList: (listId) =>
        setState((s) => ({ ...s, userLists: s.userLists.filter((l) => l.id !== listId) })),
      addConcertToList: (listId, concertId) =>
        setState((s) => ({
          ...s,
          userLists: s.userLists.map((l) => {
            if (l.id !== listId || l.entries.some((e) => e.concertId === concertId)) return l;
            return renumber({ ...l, entries: [...l.entries, { concertId }] });
          }),
        })),
      removeConcertFromList: (listId, concertId) =>
        setState((s) => ({
          ...s,
          userLists: s.userLists.map((l) =>
            l.id !== listId
              ? l
              : renumber({ ...l, entries: l.entries.filter((e) => e.concertId !== concertId) }),
          ),
        })),
      moveEntry: (listId, concertId, direction) =>
        setState((s) => ({
          ...s,
          userLists: s.userLists.map((l) => {
            if (l.id !== listId) return l;
            const idx = l.entries.findIndex((e) => e.concertId === concertId);
            const target = idx + direction;
            if (idx < 0 || target < 0 || target >= l.entries.length) return l;
            const entries = [...l.entries];
            [entries[idx], entries[target]] = [entries[target], entries[idx]];
            return renumber({ ...l, entries });
          }),
        })),
      setEntryNotes: (listId, concertId, notes) =>
        setState((s) => ({
          ...s,
          userLists: s.userLists.map((l) =>
            l.id !== listId
              ? l
              : {
                  ...l,
                  entries: l.entries.map((e) =>
                    e.concertId === concertId ? { ...e, notes: notes.trim() || undefined } : e,
                  ),
                },
          ),
        })),
    };
  }, [state, hydrated]);

  return <InteractionContext.Provider value={value}>{children}</InteractionContext.Provider>;
}

export function useInteractions(): StoreValue {
  const ctx = useContext(InteractionContext);
  if (!ctx) throw new Error("useInteractions must be used within an InteractionProvider");
  return ctx;
}

// Deterministic pseudo "base" like count for a log, so hearts show a plausible
// number that the current user's like increments. Purely cosmetic until a
// backend supplies real counts.
export function baseLikeCount(logId: string): number {
  let hash = 0;
  for (let i = 0; i < logId.length; i++) {
    hash = (hash * 31 + logId.charCodeAt(i)) % 997;
  }
  return 2 + (hash % 22);
}
