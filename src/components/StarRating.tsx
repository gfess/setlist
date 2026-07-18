export default function StarRating({
  rating,
  size = "sm",
}: {
  rating?: number;
  size?: "sm" | "md" | "lg";
}) {
  if (rating === undefined) return null;

  const full = Math.floor(rating);
  const half = rating % 1 !== 0;
  const empty = 5 - full - (half ? 1 : 0);

  const sizeClass = size === "lg" ? "text-xl" : size === "md" ? "text-base" : "text-sm";

  return (
    <span className={`inline-flex text-accent-orange ${sizeClass}`} aria-label={`${rating} out of 5 stars`}>
      {"★".repeat(full)}
      {half && "½"}
      {"☆".repeat(Math.max(0, empty))}
    </span>
  );
}
