/** Max length for the client-only Live Feed posts. */
export const FEED_MAX_LENGTH = 280;

/** Minimum ms between Live Feed posts from one browser session. */
export const FEED_COOLDOWN_MS = 3_000;

/** Max posts kept in the client-side Live Feed buffer. */
export const FEED_MAX_ITEMS = 20;

/**
 * Defense-in-depth sanitization for visitor-typed Live Feed text.
 * React already escapes JSX text (XSS-safe by default); this strips control
 * characters and angle-bracket markup before state updates.
 */
export function sanitizeFeedText(raw: string): string {
  return raw
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, FEED_MAX_LENGTH);
}
