import { DEFAULT_IMAGE, normalizeImageUrl } from "@/lib/imageUrl";

const normalizeKey = (value) => normalizeImageUrl(value).split(/[?#]/, 1)[0].toLowerCase();

function toImageUrl(value) {
  if (typeof value === "string") return value;
  return value?.url || "";
}

function candidatesForTrip(trip) {
  return [
    trip?.cover_image,
    ...(Array.isArray(trip?.gallery_images) ? trip.gallery_images : []),
    ...(Array.isArray(trip?.images) ? trip.images : []),
  ]
    .map(toImageUrl)
    .map((value) => normalizeImageUrl(value, ""))
    .filter((value) => value && value !== DEFAULT_IMAGE)
    .filter((value, index, values) => values.findIndex((item) => normalizeKey(item) === normalizeKey(value)) === index);
}

/**
 * Picks a stable card image for every trip in the current collection.
 * The cover is preferred, while a trip gallery image is used when the cover
 * is already used by another card. This keeps each card visually distinct
 * without assigning imagery from a different trip.
 */
export function getTripCardImages(trips = []) {
  const used = new Set();

  return trips.map((trip) => {
    const candidates = candidatesForTrip(trip);
    const uniqueCandidate = candidates.find((candidate) => !used.has(normalizeKey(candidate)));
    const selected = uniqueCandidate || candidates[0] || DEFAULT_IMAGE;

    if (selected !== DEFAULT_IMAGE) used.add(normalizeKey(selected));
    return selected;
  });
}

