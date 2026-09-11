"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { extractPdfText } from "@/lib/parsing/pdf";
import { extractDocxText } from "@/lib/parsing/docx";
import { exceedsWordLimit, MAX_WORDS } from "@/lib/parsing/limits";

// Task 4 (tasks/plan.md) scopes upload to freelance contracts; Task 15 adds
// a doc_type selector when leases come in as the second document type.
const DOC_TYPE = "freelance_contract";

async function extractText(file: File): Promise<string> {
  const data = await file.arrayBuffer();
  if (file.name.toLowerCase().endsWith(".pdf")) return extractPdfText(data);
  if (file.name.toLowerCase().endsWith(".docx")) return extractDocxText(data);
  throw new Error("Only PDF and DOCX files are supported");
}

export default function UploadPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const form = e.currentTarget;
    const fileInput = form.elements.namedItem("file") as HTMLInputElement;
    const file = fileInput.files?.[0];
    if (!file) {
      setError("Choose a file first");
      return;
    }

    setSubmitting(true);
    try {
      // The original file is only ever read in-browser; only the extracted
      // text below is sent anywhere (CLAUDE.md).
      const text = await extractText(file);

      if (exceedsWordLimit(text)) {
        setError(`Document is too long (limit: ${MAX_WORDS.toLocaleString()} words)`);
        return;
      }

      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error("Not signed in");

      const { error: insertError } = await supabase.from("documents").insert({
        title: file.name,
        doc_type: DOC_TYPE,
        source_text: text,
      });
      if (insertError) throw insertError;

      router.push("/documents");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="p-8">
      <h1 className="text-2xl font-semibold">Upload a freelance contract</h1>
      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4 max-w-sm">
        <input type="file" name="file" accept=".pdf,.docx" required />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="rounded bg-black px-3 py-2 text-white disabled:opacity-50"
        >
          {submitting ? "Uploading..." : "Upload"}
        </button>
      </form>
    </main>
  );
}
