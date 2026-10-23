const pad = (value: number, width = 2) => String(value).padStart(width, "0");

// Local-time components on purpose: toISOString() is UTC, so it shifts the day for anyone ahead of or behind UTC.
/** Formats a date as `YYYY-MM-DD` in the local timezone, the value format of `<input type="date">`. */
export const toDateInputValue = (date: Date): string =>
  `${pad(date.getFullYear(), 4)}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

/** Parses `YYYY-MM-DD` as local midnight. Returns null for empty or impossible dates. */
export const parseDateInputValue = (value: string): Date | null => {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;

  const [year, month, day] = match.slice(1).map(Number);
  const date = new Date(year, month - 1, day);

  // Date rolls impossible values over (2024-02-31 becomes March), so keep only what round-trips.
  const isSameDay =
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day;
  return isSameDay ? date : null;
};
