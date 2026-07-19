"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CURRENT_USER_ID, concerts, getArtist, getConcert, getSong, getVenue } from "@/lib/mockData";
import { useInteractions } from "@/lib/store";
import { formatDate } from "@/lib/format";

type Step = "search" | "rate" | "review" | "highlight" | "visibility" | "done";

const HALF_STARS = [0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5];

export default function LogFlow() {
  const searchParams = useSearchParams();
  const initialConcertId = searchParams.get("concertId");

  const [concertId, setConcertId] = useState<string | null>(initialConcertId);
  const [step, setStep] = useState<Step>(initialConcertId ? "rate" : "search");
  const [query, setQueryText] = useState("");
  const [rating, setRating] = useState<number | null>(null);
  const [review, setReview] = useState("");
  const [highlighted, setHighlighted] = useState<Set<string>>(new Set());
  const [isPrivate, setIsPrivate] = useState(false);
  const { addLog } = useInteractions();

  const concert = concertId ? getConcert(concertId) : undefined;
  const artist = concert ? getArtist(concert.artistId) : undefined;
  const venue = concert ? getVenue(concert.venueId) : undefined;

  const filteredConcerts = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return concerts.slice(0, 8);
    return concerts.filter((c) => {
      const a = getArtist(c.artistId);
      const v = getVenue(c.venueId);
      return a?.name.toLowerCase().includes(q) || v?.name.toLowerCase().includes(q);
    });
  }, [query]);

  const allSongs = concert?.setlist.flatMap((s) => s.songs) ?? [];

  const steps: Step[] = ["search", "rate", "review", "highlight", "visibility"];
  const stepIndex = steps.indexOf(step);

  function goNext() {
    const idx = steps.indexOf(step);
    if (idx < steps.length - 1) setStep(steps[idx + 1]);
    else setStep("done");
  }
  function goBack() {
    const idx = steps.indexOf(step);
    if (idx > 0) setStep(steps[idx - 1]);
  }

  function saveLog() {
    if (!concert) return;
    const now = new Date().toISOString();
    addLog({
      id: `ul-${concert.id}-${now}`,
      userId: CURRENT_USER_ID,
      concertId: concert.id,
      attendedDate: concert.date,
      rating: rating ?? undefined,
      review: review.trim() || undefined,
      isPrivate,
      likedSongIds: Array.from(highlighted),
      createdAt: now,
      updatedAt: now,
    });
    setStep("done");
  }

  if (step === "done") {
    return (
      <div className="mx-auto max-w-lg text-center">
        <p className="text-4xl">🎟️</p>
        <h1 className="mt-4 text-xl font-bold">Show logged</h1>
        <p className="mt-2 text-sm text-muted">
          {artist?.name} at {venue?.name} is on your profile now.
        </p>
        <Link
          href={`/concert/${concertId}`}
          className="mt-6 inline-block rounded-full bg-accent px-5 py-2 text-sm font-semibold text-[#06210f] hover:opacity-90"
        >
          View concert
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg">
      <div className="mb-6 flex items-center justify-between">
        <Link href="/" className="text-sm text-muted hover:text-foreground">
          ✕ Dismiss
        </Link>
        <div className="flex gap-1.5">
          {steps.map((s, i) => (
            <span
              key={s}
              className={`h-1.5 w-6 rounded-full ${i <= stepIndex ? "bg-accent" : "bg-border"}`}
            />
          ))}
        </div>
      </div>

      {step === "search" && (
        <div>
          <h1 className="mb-3 text-lg font-semibold">Log a Concert</h1>
          <input
            autoFocus
            value={query}
            onChange={(e) => setQueryText(e.target.value)}
            placeholder="Search artist, venue, or tour..."
            className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-sm outline-none placeholder:text-muted focus:border-accent"
          />
          <div className="mt-4 flex flex-col gap-2">
            {filteredConcerts.map((c) => {
              const a = getArtist(c.artistId);
              const v = getVenue(c.venueId);
              return (
                <button
                  key={c.id}
                  onClick={() => {
                    setConcertId(c.id);
                    setStep("rate");
                  }}
                  className="flex items-center gap-3 rounded-lg border border-border bg-surface p-3 text-left hover:bg-surface-hover"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={a?.imageURL} alt={a?.name} className="h-10 w-10 rounded object-cover" />
                  <div>
                    <p className="text-sm font-medium">{a?.name}</p>
                    <p className="text-xs text-muted">
                      {v?.name} · {formatDate(c.date)}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {step === "rate" && concert && (
        <div>
          <h1 className="mb-1 text-lg font-semibold">Rate it</h1>
          <p className="mb-4 text-sm text-muted">
            {artist?.name} · {venue?.name} · {formatDate(concert.date)}
          </p>
          <div className="flex flex-wrap gap-2">
            {HALF_STARS.map((value) => (
              <button
                key={value}
                onClick={() => setRating(value)}
                className={`rounded-full border px-3 py-2 text-sm ${
                  rating === value
                    ? "border-accent-orange bg-accent-orange/15 text-accent-orange"
                    : "border-border bg-surface hover:bg-surface-hover"
                }`}
              >
                {value}★
              </button>
            ))}
          </div>
          <div className="mt-6 flex justify-between">
            {!initialConcertId ? (
              <button onClick={goBack} className="text-sm text-muted hover:text-foreground">
                ← Back
              </button>
            ) : (
              <span />
            )}
            <button
              onClick={goNext}
              className="rounded-full bg-accent px-5 py-2 text-sm font-semibold text-[#06210f] hover:opacity-90"
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {step === "review" && (
        <div>
          <h1 className="mb-1 text-lg font-semibold">Write a review</h1>
          <p className="mb-4 text-sm text-muted">Optional — share what stood out.</p>
          <textarea
            value={review}
            onChange={(e) => setReview(e.target.value)}
            rows={6}
            placeholder="How was the show?"
            className="w-full resize-none rounded-lg border border-border bg-surface p-4 text-sm outline-none placeholder:text-muted focus:border-accent"
          />
          <div className="mt-6 flex justify-between">
            <button onClick={goBack} className="text-sm text-muted hover:text-foreground">
              ← Back
            </button>
            <button
              onClick={goNext}
              className="rounded-full bg-accent px-5 py-2 text-sm font-semibold text-[#06210f] hover:opacity-90"
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {step === "highlight" && (
        <div>
          <h1 className="mb-1 text-lg font-semibold">Highlight songs</h1>
          <p className="mb-4 text-sm text-muted">Optional — tap the songs that stood out.</p>
          <div className="flex flex-col gap-1.5">
            {allSongs.map((entry) => {
              const song = getSong(entry.songId);
              const isOn = highlighted.has(entry.songId);
              return (
                <button
                  key={entry.id}
                  onClick={() =>
                    setHighlighted((prev) => {
                      const next = new Set(prev);
                      if (next.has(entry.songId)) next.delete(entry.songId);
                      else next.add(entry.songId);
                      return next;
                    })
                  }
                  className={`flex items-center justify-between rounded-lg border px-4 py-2.5 text-left text-sm ${
                    isOn ? "border-accent bg-accent/10" : "border-border bg-surface hover:bg-surface-hover"
                  }`}
                >
                  {song?.title}
                  {isOn && <span className="text-accent">✓</span>}
                </button>
              );
            })}
          </div>
          <div className="mt-6 flex justify-between">
            <button onClick={goBack} className="text-sm text-muted hover:text-foreground">
              ← Back
            </button>
            <button
              onClick={goNext}
              className="rounded-full bg-accent px-5 py-2 text-sm font-semibold text-[#06210f] hover:opacity-90"
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {step === "visibility" && (
        <div>
          <h1 className="mb-1 text-lg font-semibold">Visibility</h1>
          <p className="mb-4 text-sm text-muted">Who can see this log?</p>
          <div className="flex flex-col gap-2">
            <button
              onClick={() => setIsPrivate(false)}
              className={`rounded-lg border px-4 py-3 text-left text-sm ${
                !isPrivate ? "border-accent bg-accent/10" : "border-border bg-surface"
              }`}
            >
              <span className="font-medium">Public</span>
              <p className="text-xs text-muted">Visible to everyone, appears in feeds.</p>
            </button>
            <button
              onClick={() => setIsPrivate(true)}
              className={`rounded-lg border px-4 py-3 text-left text-sm ${
                isPrivate ? "border-accent bg-accent/10" : "border-border bg-surface"
              }`}
            >
              <span className="font-medium">Private</span>
              <p className="text-xs text-muted">Only visible to you.</p>
            </button>
          </div>
          <div className="mt-6 flex justify-between">
            <button onClick={goBack} className="text-sm text-muted hover:text-foreground">
              ← Back
            </button>
            <button
              onClick={saveLog}
              className="rounded-full bg-accent px-5 py-2 text-sm font-semibold text-[#06210f] hover:opacity-90"
            >
              Save log
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
