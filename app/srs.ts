export interface SRSItem {
  id: string; // e.g., "vocab_1" or "sentence_12"
  repetition: number;
  interval: number; // in days
  easeFactor: number;
  nextReviewDate: number; // timestamp in ms
}

const STORAGE_KEY_PREFIX = "manabu_srs_";

/**
 * SuperMemo-2 Algorithm Implementation
 * @param quality 0-5 (0=complete blackout, 5=perfect response)
 * @param item Previous SRS state (or null if new)
 * @returns New SRS state
 */
export function calculateSM2(quality: number, item?: SRSItem | null): Omit<SRSItem, "id"> {
  let repetition = item?.repetition || 0;
  let interval = item?.interval || 0;
  let easeFactor = item?.easeFactor || 2.5;

  if (quality >= 3) {
    if (repetition === 0) {
      interval = 1;
    } else if (repetition === 1) {
      interval = 6;
    } else {
      interval = Math.round(interval * easeFactor);
    }
    repetition += 1;
  } else {
    repetition = 0;
    interval = 1;
  }

  easeFactor = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  if (easeFactor < 1.3) {
    easeFactor = 1.3;
  }

  // Calculate next review date (current time + interval in days)
  const nextReviewDate = Date.now() + interval * 24 * 60 * 60 * 1000;

  return {
    repetition,
    interval,
    easeFactor,
    nextReviewDate,
  };
}

export function getSRSItem(id: string): SRSItem | null {
  if (typeof window === "undefined") return null;
  const data = window.localStorage.getItem(STORAGE_KEY_PREFIX + id);
  if (!data) return null;
  try {
    return JSON.parse(data) as SRSItem;
  } catch {
    return null;
  }
}

export function updateSRSItem(id: string, quality: number): SRSItem {
  const current = getSRSItem(id);
  const nextState = calculateSM2(quality, current);
  const newItem: SRSItem = { id, ...nextState };
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY_PREFIX + id, JSON.stringify(newItem));
  }
  return newItem;
}

export function isDueForReview(id: string): boolean {
  const item = getSRSItem(id);
  if (!item) return true; // New items are technically due (or maybe we treat them differently, but for now we only track items once they've been answered once. Actually, let's say if it's null, it's not "due for review", it's just "new". We only want to review items that exist in SRS and whose nextReviewDate is <= now.)
  return Date.now() >= item.nextReviewDate;
}

export function getAllSRSItems(): SRSItem[] {
  if (typeof window === "undefined") return [];
  const items: SRSItem[] = [];
  for (let i = 0; i < window.localStorage.length; i++) {
    const key = window.localStorage.key(i);
    if (key?.startsWith(STORAGE_KEY_PREFIX)) {
      try {
        const item = JSON.parse(window.localStorage.getItem(key) || "");
        items.push(item);
      } catch (e) {
        // ignore invalid entries
      }
    }
  }
  return items;
}
