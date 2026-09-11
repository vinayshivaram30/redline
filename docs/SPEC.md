# Spec: Redline

## Objective

Build a web app where a user uploads a contract, lease, freelance agreement, or ToS and gets back: a plain-English summary, clauses ranked by severity each showing the exact source sentence, a drafted counter-offer per flagged clause, a Q&A box that answers only from the document, an editable list of the user's own red lines that drives the analysis, and a saved library of past documents.

User: someone about to sign something (freelancer, renter, small business owner) who can't afford or doesn't want to pay $150-500/hr for a lawyer to tell them the same thing.

Success looks like: a real user, given a document they've actually signed or are about to sign, finds at least one flagged clause or counter-offer they didn't already know to look for — and every flag they check against the source document holds up. See PRD.md Objective for the full trust hypothesis this version exists to prove.

## Tech Stack

Settled in CLAUDE.md (not re-litigated here):
- Next.js App Router, TypeScript, npm
- Supabase (auth + Postgres database), schema changes as committed SQL migrations under `supabase/migrations/`
- Vercel deployment
- LLM calls via OpenRouter, default model `anthropic/claude-sonnet-4.5`
- Client-side document parsing (PDF/DOCX text extraction) — only extracted text is stored, original file never leaves the browser
- Tailwind for styling
- Approved deps: next, react, typescript, tailwind, `@supabase/supabase-js`, one browser-side PDF/DOCX parser (pick one: `pdfjs-dist` for PDF + `mammoth` for DOCX, or equivalent — confirm before adding)

Decided (2026-09-11, confirmed by Vinay):
- Test framework: Vitest (unit) + Playwright (e2e)
- Auth method: Supabase Auth, email/password
- Document size limit: 50 pages / ~25k words
- Parser libraries: `pdfjs-dist` for PDF, `mammoth` for DOCX (both client-side)

## Commands

```
Dev:    npm run dev
Build:  npm run build
Lint:   npm run lint
Test:   npm test
E2E:    npm run test:e2e
```
(To be created in package.json during setup — not yet scaffolded.)

## Project Structure

```
app/                    → Next.js App Router routes
  (auth)/                 → login/signup routes
  documents/               → upload, document detail/analysis view
  api/                     → route handlers (analysis, Q&A, counter-offer generation)
components/             → shared React components
lib/
  parsing/                 → client-side PDF/DOCX text extraction
  analysis/                → prompt construction, clause extraction/ranking, citation matching
  redlines/                 → the user's editable red-line list, and how it's fed into analysis
  supabase/                → client + typed queries
supabase/
  migrations/              → committed SQL schema changes
tests/                  → unit tests (mirrors lib/ structure)
e2e/                    → Playwright end-to-end flows
docs/                   → SPEC.md (this file), pm docs
```

## Code Style

TypeScript, strict mode. Example of the shape analysis output should take — every flag traceable to source text, no exceptions:

```typescript
type FlaggedClause = {
  id: string;
  sourceSentence: string;   // verbatim substring of the parsed document text
  sourceOffset: { start: number; end: number }; // character offset into stored text, for highlighting
  severity: "high" | "medium" | "low";
  plainEnglish: string;     // what this clause means for the user
  counterOffer: string;     // drafted replacement language
  matchedRedLine?: string;  // which user red-line this violates, if any
};
```

Naming: camelCase for variables/functions, PascalCase for components/types, files match their default export's name. No default exports for non-component modules — named exports only, so imports are traceable via search.

## Testing Strategy

- Unit tests (Vitest) for `lib/analysis` and `lib/parsing` — the citation-matching logic (does `sourceSentence` actually appear verbatim in the stored text at `sourceOffset`) is the single highest-value test in the codebase, because a broken citation is a shipped bug per CLAUDE.md's standing rule.
- Integration/e2e (Playwright) for the core flow: upload → summary + flags render → counter-offer visible per flag → Q&A answers a question correctly and refuses an out-of-document question.
- No coverage percentage target for this version; coverage requirement is behavioral: the citation-integrity check and the Q&A grounding check must both have tests before either ships, not "someday."

## Boundaries

- **Always:** cite the exact source sentence for every flagged clause (no flag without a citation, ever — a missing citation is a bug, not a degraded result, per CLAUDE.md); keep the original uploaded file client-side only; run lint + unit tests before any commit; follow incremental-implementation and ponytail-review before each commit per PIPELINE.md's build gates.
- **Ask first:** adding any dependency beyond the approved list; any Supabase schema change (write the migration, but confirm the shape first); choosing which document type(s) ship first if it's not obviously freelance contracts + leases; any change to the OpenRouter model or provider.
- **Never:** apply DDL directly to the hosted Supabase project (migrations only); commit a secret or `.env.local`; add OCR, payments, or cross-user document sharing — explicitly excluded in CLAUDE.md and PRD.md for this version; let the Q&A box answer from anything other than the uploaded document's extracted text.

## Success Criteria

- All six features in PRD.md 7.2 implemented and working end-to-end for at least one document type.
- Every rendered flagged clause's `sourceSentence` is a verbatim, offset-verified substring of the document's stored text (automated test, not manual spot-check).
- A user can edit their red-line list and see the analysis change accordingly.
- The Q&A box answers a question the document actually addresses, and visibly declines (not hallucinates) a question it doesn't.
- A user can revisit a saved document from their library and see the same analysis they got originally.

## Open Questions

None outstanding. Resolved 2026-09-11:
- First document types: freelance contracts + leases, locked.
- Test framework, auth method, doc size limit, parser libraries: see Tech Stack section, all confirmed.
