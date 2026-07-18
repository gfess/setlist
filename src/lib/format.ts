export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatDateShort(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export function timeAgo(iso: string): string {
  const seconds = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  const units: [number, string][] = [
    [60, "s"],
    [60, "m"],
    [24, "h"],
    [30, "d"],
    [12, "mo"],
    [Number.MAX_SAFE_INTEGER, "y"],
  ];
  let value = seconds;
  for (const [count, label] of units) {
    if (value < count) return `${Math.max(1, Math.floor(value))}${label} ago`;
    value = Math.floor(value / count);
  }
  return `${value}y ago`;
}
