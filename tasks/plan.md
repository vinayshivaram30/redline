# Implementation Plan: Redline v1

## Overview

Build the six features in PRD.md 7.2 for freelance contracts and leases: upload → plain-English summary + ranked flagged clauses (each cited to a source sentence) → drafted counter-offer per flag → document-grounded Q&A → editable red-line list that drives the analysis → saved library. The single highest-risk piece is citation integrity (every flag must point at real, verifiable source text) — it's sequenced early so it fails fast if the approach doesn't hold up, per docs/SPEC.md's standing rule that a missing/wrong citation is a bug, not a degraded result.

## Architecture Decisions

- Analysis runs server-side (API route), not client-side, even though parsing is client-side — the LLM call needs the OpenRouter key, which can't live in the browser. Client parses to text, uploads text (not file) to the API.
- Citation is enforced structurally, not just prompted: the API validates every `sourceSentence` the model returns is a verbatim substring of the stored document text before persisting it. If it isn't, that flag is dropped and logged, never shown to the user. This makes "no flag without a citation" a code invariant, not a prompt hope.
- One document type end-to-end (freelance contracts) before adding the second (leases) — proves the whole pipeline works before doubling the clause taxonomy.
- Red-lines feed the analysis as extra prompt context (structured list of "I will not accept X"), not a separate rules engine — keeps v1 simple, revisit only if plain-English red lines prove too unreliable to match against clauses.

## Task List

### Phase 1: Foundation

- [ ] Task 1: Scaffold Next.js app + Supabase project wiring
  - Acceptance: `npm run dev` serves a blank app; Supabase client connects using env vars from `.env.local`; `.env.example` documents required vars.
  - Verify: `npm run build` succeeds; manual check app loads at localhost.
  - Dependencies: None
  - Files: `package.json`, `app/layout.tsx`, `app/page.tsx`, `lib/supabase/client.ts`, `.env.example`
  - Scope: M

- [ ] Task 2: Auth (Supabase email/password) — signup, login, logout, protected routes
  - Acceptance: user can sign up, log in, log out; unauthenticated users redirected from `/documents`.
  - Verify: Playwright e2e covers signup→login→logout; `npm run build` clean.
  - Dependencies: Task 1
  - Files: `app/(auth)/login/page.tsx`, `app/(auth)/signup/page.tsx`, `lib/supabase/auth.ts`, `e2e/auth.spec.ts`
  - Scope: M

- [ ] Task 3: Document + document_text schema (migration)
  - Acceptance: `documents` table (id, user_id, title, doc_type, created_at) and storage for extracted text exist as a committed migration; RLS restricts rows to the owning user.
  - Verify: migration applies cleanly to a local/dev Supabase instance; RLS manually verified (user A cannot query user B's row).
  - Dependencies: Task 2
  - Files: `supabase/migrations/0001_documents.sql`
  - Scope: S

- [ ] Task 4: Client-side upload + parse (PDF/DOCX → text) for freelance contracts
  - Acceptance: user uploads a PDF or DOCX ≤50 pages/~25k words; text is extracted in-browser via `pdfjs-dist`/`mammoth`; original file is never sent to the server; extracted text is POSTed and saved via Task 3's schema.
  - Verify: unit test for the parser wrapper (given a fixture file, returns expected text); manual check with a real contract PDF.
  - Dependencies: Task 3
  - Files: `lib/parsing/pdf.ts`, `lib/parsing/docx.ts`, `app/documents/upload/page.tsx`, `tests/parsing/pdf.test.ts`
  - Scope: M

### Checkpoint: Foundation
- [ ] Tests pass, build clean
- [ ] A logged-in user can upload a freelance contract and see it land in the database as extracted text
- [ ] Review with Vinay before proceeding to the trust-critical phase

### Phase 2: Core analysis (the trust feature)

- [ ] Task 5: Citation-integrity check (write this before the analysis endpoint uses it)
  - Acceptance: a function that, given a document's full text and a claimed `sourceSentence` + `sourceOffset`, returns true only if the substring at that offset exactly matches the sentence.
  - Verify: unit tests covering exact match, near-match (should fail), off-by-one offset (should fail), whitespace/quote-normalization edge cases.
  - Dependencies: None (pure function, can be built parallel to Phase 1)
  - Files: `lib/analysis/verifyCitation.ts`, `tests/analysis/verifyCitation.test.ts`
  - Scope: S

- [ ] Task 6: Analysis API route — summary + ranked flagged clauses for freelance contracts
  - Acceptance: given stored document text, calls OpenRouter (`anthropic/claude-sonnet-4.5`), returns a plain-English summary and a ranked list of flagged clauses; every flag is run through Task 5's check before being persisted or returned; failed-citation flags are dropped and logged server-side.
  - Verify: integration test with a fixture freelance contract text — asserts every returned flag passes `verifyCitation`; manual check the summary reads sensibly.
  - Dependencies: Task 4, Task 5
  - Files: `app/api/analysis/route.ts`, `lib/analysis/prompts.ts`, `lib/analysis/extractFlags.ts`
  - Scope: M

- [ ] Task 7: Document detail UI — summary + ranked flags with source-sentence highlight
  - Acceptance: user sees plain-English summary; flags rendered ranked by severity; clicking a flag highlights its exact source sentence in the full document text.
  - Verify: Playwright e2e — upload a fixture contract, assert summary and at least one flag render, assert clicking a flag highlights text.
  - Dependencies: Task 6
  - Files: `app/documents/[id]/page.tsx`, `components/FlaggedClause.tsx`, `components/DocumentViewer.tsx`, `e2e/analysis.spec.ts`
  - Scope: M

### Checkpoint: Core analysis
- [ ] `verifyCitation` unit tests pass, no flag ever ships without a valid citation (code-level, not just visual spot-check)
- [ ] End-to-end: upload → summary + flags visible → source sentence highlight works, for a real freelance contract
- [ ] Review with Vinay before proceeding — this is the checkpoint that validates or kills the trust hypothesis

### Phase 3: Counter-offer drafting

- [ ] Task 8: Extend analysis to draft a counter-offer per flagged clause
  - Acceptance: each flagged clause returned by Task 6's endpoint includes a `counterOffer` string — drafted replacement language a user could realistically propose.
  - Verify: integration test asserts every flag has a non-empty `counterOffer`; manual review of counter-offer quality on 2-3 real contracts.
  - Dependencies: Task 6
  - Files: `lib/analysis/prompts.ts`, `lib/analysis/extractFlags.ts`
  - Scope: S

- [ ] Task 9: Render counter-offer in the UI
  - Acceptance: each flagged clause in the detail view shows its drafted counter-offer alongside the source sentence and plain-English explanation.
  - Verify: Playwright e2e asserts counter-offer text renders per flag.
  - Dependencies: Task 8, Task 7
  - Files: `components/FlaggedClause.tsx`
  - Scope: XS

### Phase 4: Red lines

- [ ] Task 10: Red-line list schema + CRUD
  - Acceptance: `red_lines` table (user_id, text, created_at) as a migration; user can add/edit/delete red lines from a settings-style page.
  - Verify: unit tests for the CRUD functions; manual check add/edit/delete works.
  - Dependencies: Task 2
  - Files: `supabase/migrations/0002_red_lines.sql`, `app/settings/red-lines/page.tsx`, `lib/redlines/crud.ts`
  - Scope: M

- [ ] Task 11: Feed red lines into analysis; flag a `matchedRedLine` when a clause violates one
  - Acceptance: analysis prompt includes the user's current red lines; a flagged clause that matches one shows which red line it violates; re-running analysis after editing red lines changes the output.
  - Verify: integration test — a fixture contract + a red line the fixture violates produces a flag with `matchedRedLine` set.
  - Dependencies: Task 10, Task 6
  - Files: `lib/analysis/prompts.ts`, `app/api/analysis/route.ts`
  - Scope: S

### Checkpoint: Counter-offer + red lines
- [ ] Full flow works: upload → flags with counter-offers → edit a red line → re-run shows a matched flag
- [ ] Review with Vinay

### Phase 5: Grounded Q&A

- [ ] Task 12: Q&A API route, strictly grounded
  - Acceptance: given a document id and a question, returns an answer using only that document's stored text; explicitly declines (does not guess) when the document doesn't address the question.
  - Verify: integration test with an adversarial question set (in-document question → answered; out-of-document question → declined, not hallucinated) — this test set is the acceptance bar from docs/SPEC.md, must exist before shipping.
  - Dependencies: Task 6
  - Files: `app/api/qa/route.ts`, `lib/analysis/prompts.ts`, `tests/analysis/qa-grounding.test.ts`
  - Scope: M

- [ ] Task 13: Q&A box UI
  - Acceptance: user can type a question on a document detail page and see the grounded answer (or the decline message) inline.
  - Verify: Playwright e2e — ask an in-document question, assert an answer renders; ask an out-of-document question, assert the decline message renders.
  - Dependencies: Task 12, Task 7
  - Files: `components/QABox.tsx`
  - Scope: S

### Checkpoint: Q&A
- [ ] Adversarial question test set passes (grounded answers only, never hallucinated)
- [ ] Review with Vinay

### Phase 6: Library + second document type

- [ ] Task 14: Document library — list + revisit
  - Acceptance: user sees a list of their past documents; opening one shows the same analysis originally generated (not re-run) unless red lines changed since.
  - Verify: Playwright e2e — upload two documents, return to library, open the first, assert original analysis still shows.
  - Dependencies: Task 7
  - Files: `app/documents/page.tsx`, `components/DocumentList.tsx`
  - Scope: S

- [ ] Task 15: Extend analysis + upload flow to leases (second document type)
  - Acceptance: everything from Phase 2-5 works for a lease document, not just freelance contracts; prompts account for lease-specific clause types from research/summary.md's ranked list (auto-renewal, unilateral termination, fee escalators, etc.).
  - Verify: integration test with a fixture lease — same citation-integrity and grounding checks as Phase 2/5, applied to the lease fixture.
  - Dependencies: Task 6, Task 12
  - Files: `lib/analysis/prompts.ts`, `lib/analysis/docTypes.ts`, `tests/analysis/lease-fixture.test.ts`
  - Scope: M

### Checkpoint: Complete
- [ ] All six PRD features work end-to-end for both freelance contracts and leases
- [ ] Citation-integrity and Q&A-grounding automated tests both green
- [ ] Ready for review against PRD.md Key Results

## Risks and Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Model returns a flag whose "source sentence" is paraphrased, not verbatim | High — breaks the core trust promise | Task 5's structural check drops any unverifiable flag before it's ever shown; tested first, enforced in code not just prompt |
| Q&A hallucinates an answer not in the document | High — same trust risk, plus the DoNotPay regulatory precedent (research/agent3-what-exists.md) | Adversarial test set (Task 12) required before ship; decline-by-default framing in the prompt |
| Counter-offer language is generic/unusable, not something a user could actually send | Medium — undercuts the validated differentiation (research/agent5-edge-validation.md) | Manual quality review on real contracts in Task 8, not just an automated "non-empty string" check |
| Red-line matching against flagged clauses is unreliable in free text | Medium | Scoped small in Task 11; if matching quality is poor, it's a v1.1 problem, not a blocker for the other five features |
| PDF/DOCX parsing mangles text (breaks citation offsets) | High — same trust risk, upstream of Task 5 | Task 4 has a dedicated parser unit test; citation offsets are computed from the exact extracted text, not re-derived later |

## Open Questions

None blocking Phase 1 start. Revisit after the Phase 2 checkpoint: does the citation-integrity approach hold up on real, messy contracts, or does it need a fallback (e.g., fuzzy match with a visible "approximate" flag) before continuing to Phase 3+.
