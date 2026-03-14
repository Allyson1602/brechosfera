import { useCallback, useEffect, useMemo, useState } from 'react';

const RATING_STORAGE_KEY = 'business_ratings';
const RATING_COOLDOWN_MS = 24 * 60 * 60 * 1000;

interface RatingRecord {
  businessId: string;
  ratedAt: number;
  rating: number;
}

function isValidRatingRecord(value: unknown): value is RatingRecord {
  if (!value || typeof value !== 'object') return false;

  const record = value as RatingRecord;
  return (
    typeof record.businessId === 'string' &&
    typeof record.ratedAt === 'number' &&
    Number.isFinite(record.ratedAt) &&
    typeof record.rating === 'number' &&
    record.rating >= 1 &&
    record.rating <= 5
  );
}

function normalizeRatings(ratings: RatingRecord[]): RatingRecord[] {
  const now = Date.now();
  return ratings.filter((record) => now - record.ratedAt < RATING_COOLDOWN_MS);
}

function getLatestRating(ratings: RatingRecord[]): RatingRecord | null {
  if (ratings.length === 0) return null;

  return ratings.reduce((latest, current) =>
    current.ratedAt > latest.ratedAt ? current : latest,
  );
}

function getRatingFromStorage(): RatingRecord | null {
  if (typeof window === 'undefined') return null;

  try {
    const stored = window.localStorage.getItem(RATING_STORAGE_KEY);
    const parsed = stored ? JSON.parse(stored) : null;
    const normalized = Array.isArray(parsed)
      ? normalizeRatings(parsed.filter(isValidRatingRecord))
      : isValidRatingRecord(parsed)
        ? normalizeRatings([parsed])
        : [];
    const latestRating = getLatestRating(normalized);

    if (latestRating) {
      window.localStorage.setItem(RATING_STORAGE_KEY, JSON.stringify(latestRating));
    } else {
      window.localStorage.removeItem(RATING_STORAGE_KEY);
    }

    return latestRating;
  } catch {
    return null;
  }
}

function saveRatingToStorage(rating: RatingRecord): RatingRecord | null {
  const latestRating = getLatestRating(normalizeRatings([rating]));

  if (typeof window !== 'undefined') {
    if (latestRating) {
      window.localStorage.setItem(RATING_STORAGE_KEY, JSON.stringify(latestRating));
    } else {
      window.localStorage.removeItem(RATING_STORAGE_KEY);
    }
  }

  return latestRating;
}

export function useRating(businessId: string) {
  const [lastRating, setLastRating] = useState<RatingRecord | null>(getRatingFromStorage);

  useEffect(() => {
    setLastRating(getRatingFromStorage());

    const syncRatings = () => setLastRating(getRatingFromStorage());
    window.addEventListener('storage', syncRatings);
    return () => window.removeEventListener('storage', syncRatings);
  }, []);

  const isCurrentBusinessRated = useMemo(
    () => lastRating?.businessId === businessId,
    [businessId, lastRating],
  );

  const canRate = !lastRating;
  const timeUntilCanRate = lastRating
    ? Math.max(0, RATING_COOLDOWN_MS - (Date.now() - lastRating.ratedAt))
    : 0;

  const registerRating = useCallback(
    (rating: number) => {
      const savedRating = saveRatingToStorage({
        businessId,
        ratedAt: Date.now(),
        rating,
      });
      setLastRating(savedRating);
    },
    [businessId],
  );

  return {
    canRate,
    lastRatedBusinessId: lastRating?.businessId ?? null,
    timeUntilCanRate,
    registerRating,
    userRating: isCurrentBusinessRated ? lastRating?.rating ?? null : null,
  };
}

export function formatTimeRemaining(ms: number): string {
  const totalMinutes = Math.max(0, Math.ceil(ms / (1000 * 60)));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}min`;
  }

  if (minutes > 0) {
    return `${minutes}min`;
  }

  return 'menos de 1 min';
}
