"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ConcertLog } from "@/types";
import { CURRENT_USER_ID, artistIntents, lineupEntries } from "@/lib/mockData";

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
}

function seedState(): StoreState {
  return {
    follows: [],
    wantToSee: artistIntents.filter((a) => a.userId === CURRENT_USER_ID).map((a) => a.artistId),
    lineup: lineupEntries.filter((l) => l.userId === CURRENT_USER_ID).map((l) => l.concertId),
    likes: [],
    userLogs: [],
  };
}

interface StoreValue extends StoreState {
  toggleFollow: (userId: string) => void;
  isFollowing: (userId: string) => boolean;
  toggleWantToSee: (artistId: string) => void;
  wantsToSee: (artistId: string) => boolean;
  toggleLineup: (concertId: string) => void;
  inLineup: (concertId: string) => boolean;
  toggleLike: (concertLogId: string) => void;
  hasLiked: (concertLogId: string) => boolean;
  addLog: (log: ConcertLog) => void;
}

const InteractionContext = createContext<StoreValue | null>(null);

function toggle(list: string[], id: string): string[] {
  return list.includes(id) ? list.filter((x) => x !== id) : [...list, id];
}

export function InteractionProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<StoreState>(seedState);

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
    };
  }, [state]);

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
