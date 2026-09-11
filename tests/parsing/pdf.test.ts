import { describe, it, expect } from "vitest";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { extractPdfText } from "@/lib/parsing/pdf";

describe("extractPdfText", () => {
  it("extracts the text of a real PDF", async () => {
    const filePath = path.join(__dirname, "fixtures/sample.pdf");
    const buffer = await readFile(filePath);
    const text = await extractPdfText(buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength));
    expect(text).toContain("Freelance Agreement");
    expect(text).toContain("pre-existing intellectual property");
  });
});
