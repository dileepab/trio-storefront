'use client';

/**
 * Remembers which ad brought the shopper here, so a sale can be credited to it.
 *
 * Meta puts the click reference in the landing URL and never mentions it
 * again. A shopper browses several pages before checking out, so reading it
 * at checkout finds nothing — it has to be captured on arrival and kept.
 */

const STORAGE_KEY = 'hb.adClickId';

/** Meta credits a click for seven days; keeping it longer only misleads us. */
const MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

export function captureAdClickId() {
  if (typeof window === 'undefined') return;

  const params = new URLSearchParams(window.location.search);
  const clickId = params.get('ctwa_clid') || params.get('fbclid');
  if (!clickId) return;

  try {
    window.sessionStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ clickId, capturedAt: Date.now() })
    );
  } catch {
    // Private browsing refuses storage. The order still goes through; it just
    // will not be credited to the ad.
  }
}

export function readAdClickId() {
  if (typeof window === 'undefined') return null;

  try {
    const stored = window.sessionStorage.getItem(STORAGE_KEY);
    if (!stored) return null;

    const { clickId, capturedAt } = JSON.parse(stored);
    if (!clickId || Date.now() - capturedAt > MAX_AGE_MS) return null;
    return clickId;
  } catch {
    return null;
  }
}
