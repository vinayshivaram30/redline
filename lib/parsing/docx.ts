import mammoth from "mammoth";

/**
 * Extracts plain text from a DOCX. mammoth's Node build takes a Buffer,
 * its browser build takes an ArrayBuffer directly - branch on which is
 * available so this one function works both client-side and under Vitest.
 */
export async function extractDocxText(data: ArrayBuffer): Promise<string> {
  const input = typeof Buffer !== "undefined" ? { buffer: Buffer.from(data) } : { arrayBuffer: data };
  const result = await mammoth.extractRawText(input);
  return result.value;
}
