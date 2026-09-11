# Tasks

Full detail (acceptance criteria, verify steps, files, risks): tasks/plan.md. This file drives the dashboard.

## Phase 1 - Foundation   <!-- intent: scaffold, auth, schema, upload+parse for freelance contracts -->
- [x] T1: Scaffold Next.js app + Supabase project wiring
- [x] T2: Auth (Supabase email/password)
- [x] T3: Document + document_text schema (migration)
- [x] T4: Client-side upload + parse (PDF/DOCX -> text), freelance contracts

## Phase 2 - Core analysis   <!-- intent: the trust feature - summary + cited flagged clauses -->
- [ ] T5: Citation-integrity check
- [ ] T6: Analysis API route - summary + ranked flagged clauses
- [ ] T7: Document detail UI - summary + flags + source highlight

## Phase 3 - Counter-offer drafting   <!-- intent: drafted replacement language per flag -->
- [ ] T8: Extend analysis to draft counter-offer per flag
- [ ] T9: Render counter-offer in UI

## Phase 4 - Red lines   <!-- intent: user's own rules drive the analysis -->
- [ ] T10: Red-line list schema + CRUD
- [ ] T11: Feed red lines into analysis, matchedRedLine

## Phase 5 - Grounded Q&A   <!-- intent: answers only from the document, adversarial-tested -->
- [ ] T12: Q&A API route, strictly grounded (adversarial test set required)
- [ ] T13: Q&A box UI

## Phase 6 - Library + second document type   <!-- intent: saved library, extend to leases -->
- [ ] T14: Document library - list + revisit
- [ ] T15: Extend to leases (second document type)
