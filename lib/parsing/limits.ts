// docs/SPEC.md: 50 pages / ~25k words is the confirmed starting cap.
export const MAX_WORDS = 25_000;

export function wordCount(text: string): number {
  const trimmed = text.trim();
  return trimmed === "" ? 0 : trimmed.split(/\s+/).length;
}

export function exceedsWordLimit(text: string): boolean {
  return wordCount(text) > MAX_WORDS;
}
