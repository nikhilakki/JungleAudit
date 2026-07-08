const STORAGE_KEY = "jungleaudit.disclaimer-snooze-until";
const SNOOZE_MS = 7 * 24 * 60 * 60 * 1000;

export function isDisclaimerSnoozed(): boolean {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return false;

    const until = Number(raw);
    if (!Number.isFinite(until)) {
      localStorage.removeItem(STORAGE_KEY);
      return false;
    }

    if (Date.now() >= until) {
      localStorage.removeItem(STORAGE_KEY);
      return false;
    }

    return true;
  } catch {
    return false;
  }
}

export function snoozeDisclaimerForWeek(): void {
  try {
    localStorage.setItem(STORAGE_KEY, String(Date.now() + SNOOZE_MS));
  } catch {
    // localStorage unavailable (private mode, blocked, etc.)
  }
}