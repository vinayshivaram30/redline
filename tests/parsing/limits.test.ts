import { describe, it, expect } from "vitest";
import { wordCount, exceedsWordLimit, MAX_WORDS } from "@/lib/parsing/limits";

describe("wordCount", () => {
  it("counts words", () => {
    expect(wordCount("one two three")).toBe(3);
  });

  it("returns 0 for empty/whitespace text", () => {
    expect(wordCount("   ")).toBe(0);
  });
});

describe("exceedsWordLimit", () => {
  it("is false at and under the limit", () => {
    expect(exceedsWordLimit("word ".repeat(MAX_WORDS).trim())).toBe(false);
  });

  it("is true over the limit", () => {
    expect(exceedsWordLimit("word ".repeat(MAX_WORDS + 1).trim())).toBe(true);
  });
});
