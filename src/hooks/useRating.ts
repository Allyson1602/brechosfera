import { useState, useCallback } from 'react';

const RATING_STORAGE_KEY = 'business_ratings';
const RATING_COOLDOWN_MS = 24 * 60 * 60 * 1000; // 24 hours

interface RatingRecord {
  businessId: string;
  ratedAt: number;
  rating: number;
}

function getRatingsFromStorage(): RatingRecord[] {
  try {
    const stored = localStorage.getItem(RATING_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveRatingsToStorage(ratings: RatingRecord[]): void {
  localStorage.setItem(RATING_STORAGE_KEY, JSON.stringify(ratings));
}

export function useRating(businessId: string) {
  const [ratings, setRatings] = useState<RatingRecord[]>(getRatingsFromStorage);

  const getBusinessRating = useCallback((): RatingRecord | undefined => {
    return ratings.find(r => r.businessId === businessId);
  }, [ratings, businessId]);

  const canRate = useCallback((): boolean => {
    const existingRating = getBusinessRating();
    if (!existingRating) return true;
    
    const timeSinceRating = Date.now() - existingRating.ratedAt;
    return timeSinceRating >= RATING_COOLDOWN_MS;
  }, [getBusinessRating]);

  const getTimeUntilCanRate = useCallback((): number => {
    const existingRating = getBusinessRating();
    if (!existingRating) return 0;
    
    const timeSinceRating = Date.now() - existingRating.ratedAt;
    const remaining = RATING_COOLDOWN_MS - timeSinceRating;
    return Math.max(0, remaining);
  }, [getBusinessRating]);

  const submitRating = useCallback((rating: number): boolean => {
    if (!canRate()) return false;
    
    const newRatings = ratings.filter(r => r.businessId !== businessId);
    const newRecord: RatingRecord = {
      businessId,
      ratedAt: Date.now(),
      rating,
    };
    newRatings.push(newRecord);
    
    saveRatingsToStorage(newRatings);
    setRatings(newRatings);
    return true;
  }, [businessId, ratings, canRate]);

  const getUserRating = useCallback((): number | null => {
    const existingRating = getBusinessRating();
    return existingRating?.rating ?? null;
  }, [getBusinessRating]);

  return {
    canRate: canRate(),
    timeUntilCanRate: getTimeUntilCanRate(),
    submitRating,
    userRating: getUserRating(),
  };
}

export function formatTimeRemaining(ms: number): string {
  const hours = Math.floor(ms / (1000 * 60 * 60));
  const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
  
  if (hours > 0) {
    return `${hours}h ${minutes}min`;
  }
  return `${minutes}min`;
}
