import * as pdfjs from "pdfjs-dist/legacy/build/pdf.mjs";

// The browser build requires an explicit worker file or it throws; Node
// (Vitest) doesn't need this - pdfjs falls back to an inline fake worker
// there, and setting workerSrc to a browser URL would break that fallback.
if (typeof window !== "undefined") {
  pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/legacy/build/pdf.worker.mjs",
    import.meta.url,
  ).toString();
}

/**
 * Extracts plain text from a PDF. Runs both in the browser and in Node for
 * tests.
 */
export async function extractPdfText(data: ArrayBuffer): Promise<string> {
  const doc = await pdfjs.getDocument({ data: new Uint8Array(data) }).promise;
  const pages: string[] = [];

  for (let pageNumber = 1; pageNumber <= doc.numPages; pageNumber++) {
    const page = await doc.getPage(pageNumber);
    const content = await page.getTextContent();
    const pageText = content.items
      .map((item) => ("str" in item ? item.str : ""))
      .join(" ")
      .replace(/[ \t]+/g, " ")
      .trim();
    pages.push(pageText);
  }

  return pages.join("\n\n");
}
