const humanDateTimeFormatter = new Intl.DateTimeFormat("en-IE", {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
});

export function formatHumanDateTime(
  value: Date | string | number | null | undefined,
): string {
  if (value === null || value === undefined) {
    return "Unknown date";
  }

  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "Unknown date";
  }

  return humanDateTimeFormatter.format(date);
}
