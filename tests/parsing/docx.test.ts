import { describe, it, expect } from "vitest";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { extractDocxText } from "@/lib/parsing/docx";

describe("extractDocxText", () => {
  it("extracts the text of a real DOCX", async () => {
    const filePath = path.join(__dirname, "fixtures/sample.docx");
    const buffer = await readFile(filePath);
    const text = await extractDocxText(buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength));
    expect(text).toContain("Freelance Agreement");
    expect(text).toContain("pre-existing intellectual property");
  });
});
