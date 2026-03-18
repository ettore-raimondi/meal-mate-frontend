const euroFormatter = new Intl.NumberFormat("en-IE", {
  style: "currency",
  currency: "EUR",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const hasNumericShape = (value: string) => /^-?\d+(\.\d+)?$/.test(value);

export function formatEuroPrice(
  value: string | number | null | undefined,
): string {
  if (value === null || value === undefined) {
    return euroFormatter.format(0);
  }

  if (typeof value === "number") {
    return euroFormatter.format(value);
  }

  const trimmed = value.trim();
  if (trimmed === "") {
    return euroFormatter.format(0);
  }

  if (hasNumericShape(trimmed)) {
    return euroFormatter.format(Number(trimmed));
  }

  return trimmed.startsWith("€") ? trimmed : `€${trimmed}`;
}
