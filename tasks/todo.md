# Todo — Redline v1

Mirrors tasks/plan.md. Full acceptance/verify/files detail lives there; this is the flat checklist.

## Phase 1: Foundation
- [ ] Task 1: Scaffold Next.js app + Supabase project wiring
- [ ] Task 2: Auth (Supabase email/password)
- [ ] Task 3: Document + document_text schema (migration)
- [ ] Task 4: Client-side upload + parse (PDF/DOCX → text), freelance contracts

### Checkpoint: Foundation — review with Vinay

## Phase 2: Core analysis (trust feature)
- [ ] Task 5: Citation-integrity check
- [ ] Task 6: Analysis API route — summary + ranked flagged clauses
- [ ] Task 7: Document detail UI — summary + flags + source highlight

### Checkpoint: Core analysis — validates or kills the trust hypothesis, review with Vinay

## Phase 3: Counter-offer drafting
- [ ] Task 8: Extend analysis to draft counter-offer per flag
- [ ] Task 9: Render counter-offer in UI

## Phase 4: Red lines
- [ ] Task 10: Red-line list schema + CRUD
- [ ] Task 11: Feed red lines into analysis, matchedRedLine

### Checkpoint: Counter-offer + red lines — review with Vinay

## Phase 5: Grounded Q&A
- [ ] Task 12: Q&A API route, strictly grounded (adversarial test set required)
- [ ] Task 13: Q&A box UI

### Checkpoint: Q&A — adversarial test set must pass, review with Vinay

## Phase 6: Library + second document type
- [ ] Task 14: Document library — list + revisit
- [ ] Task 15: Extend to leases (second document type)

### Checkpoint: Complete — all 6 PRD features, both doc types, both trust tests green
