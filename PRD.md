# PRD — Redline

## 1. Summary

Redline is a web app that reads a contract, lease, freelance agreement, or terms of service and tells the reader what they're actually signing: a plain-English summary, clauses that could hurt them ranked by severity with the exact source sentence shown, a drafted counter-offer for each flagged clause, and a question box that answers only from the uploaded document. This version exists to prove the analysis can be trusted — nothing else.

## 2. Contacts

| Name | Role | Comment |
|---|---|---|
| Vinay | Founder / PM | Owns product decisions, scope, and the "settled decisions" in CLAUDE.md |

## 3. Background

People sign contracts, leases, freelance agreements, and terms of service constantly without understanding what's in them — not from carelessness, but because the documents are long, dense, and the clause that hurts them is often disconnected in time from when it matters. A Disney+ free-trial signup in 2019 was used in 2023 to try to force a wrongful-death lawsuit into arbitration. Freelancers turn down paid work for years because they're scared of a non-compete clause they never had explained to them. A "small fee" clause in a funeral contract turned out to be 18% of a $1M insurance claim (research/summary.md).

The people who need help most can't afford it: lawyer contract review runs $150–500/hour or $300–1,000+ flat fee (avg ~$608); lease review averages $450. A new entrant already validated $99 as an affordable flat-fee price point for freelancer/small-business contract review (research/agent4-who-would-pay.md). Why now: general-purpose LLMs made document-grounded analysis (accurate clause extraction, citation-backed answers, drafted alternative language) viable at consumer pricing, which wasn't true a few years ago.

## 4. Objective

Prove that AI-generated contract analysis can be trusted enough that someone acts on it before signing something they'd otherwise sign blind.

Why it matters: if the analysis isn't trustworthy, nothing else about the product matters — this is the single risk that determines whether Redline is viable at all, ahead of growth, monetization, or breadth of document types.

Key Results (first version, qualitative given no users yet — see Release section for what "done" means at this stage):
- Every risk flag cites a real, verifiable source sentence — zero flags shipped without a citation (this is a hard product rule, not a target: see CLAUDE.md "Standing rules").
- A test user, given a real contract they've actually signed or are about to sign, can point to at least one flagged clause or drafted counter-offer they didn't already know to look for.
- The Q&A box never answers from outside the document — verified against a set of adversarial test questions before shipping.

## 5. Market Segment(s)

Defined by the situation people are in, not demographics:

- **Freelancers/independent contractors about to sign a client contract** — the segment with the clearest willingness-to-pay signal ($75–400 market rate for human review, $99 already validated by a competitor) and the clearest documented harm (IP assignment, non-competes, no leverage to negotiate). Constraint: many don't have a contract at all yet (28% use written contracts per Freelancers Union) — that's a different, unaddressed problem.
- **Renters about to sign a lease** — real spend ($450 avg for lawyer review) but a cheap substitute already exists (free 30-min landlord-tenant attorney consultations, plus free tools like Justee/SaferLease/LeaseCheck already flagging risky lease clauses). Constraint: Redline has to win on the counter-offer and Q&A layer here, not base flagging, which is already free elsewhere.
- **Small business owners signing vendor/SaaS/service contracts** — 51% skip legal review over cost; 47% have lost $500+ from problems review would likely have caught. Constraint: this segment's contracts are more varied (indemnity, liability caps, fee escalators) than the other two, harder to scope tightly for a first version.

First version targets whichever of these is easiest to validate the core trust hypothesis with — likely freelancers and renters, since both have sourced pain and sourced pricing, and their contracts are shorter and more standardized than small-business vendor agreements.

## 6. Value Proposition(s)

Jobs to be done: "tell me what I'm actually agreeing to, in language I understand, before I sign — and if something's wrong, tell me what to ask for instead."

What customers gain:
- A citation-backed answer instead of a wall of legal text — every flag points at the exact sentence, so they can verify it themselves rather than trust a black box.
- A starting point for negotiation (the counter-offer) instead of just a warning — most existing tools stop at "this clause is risky," leaving the person exactly where they started.
- A way to ask their own question and get an answer grounded only in their document, instead of a generic legal-info search that might not apply to their actual contract.

Pains avoided: paying $300–1,000+ for a lawyer for a contract that doesn't need one; signing something risky because reading dense legal text themselves is impractical; getting a "here's what's wrong" tool that leaves them not knowing what to do about it.

Where this beats what exists (research/agent5-edge-validation.md, edge validated 2026-09-11): free consumer lease/contract checkers (Justee, SaferLease, LeaseCheck) already do plain-English summary + risk flagging. None of the 9 products checked — consumer or enterprise — combine drafted counter-offer language with document-grounded Q&A in one product. Enterprise tools (Spellbook, LegalOn) draft counter-offers but are Word-native, playbook-driven, and sold per-seat to legal teams. Enterprise tools (Ironclad, Juro) have grounded Q&A but no per-clause counter-offer drafting, and both are enterprise CLM software, not consumer-facing. Redline's specific combination — consumer-facing, per-clause counter-offer, grounded Q&A — was not found anywhere.

## 7. Solution

### 7.1 UX/Prototypes

Not yet built. Core flow: upload document → see plain-English summary → see ranked flagged clauses (each with source sentence + drafted counter-offer) → ask questions in a Q&A box scoped to the document → optionally edit personal red lines, which re-runs the analysis → save to a personal library. No wireframes exist yet; first build pass should produce a working flow before investing in visual design.

### 7.2 Key Features (from CLAUDE.md, settled — not open for reinterpretation)

1. Plain-English summary of the uploaded document.
2. Clauses that could hurt the user, ranked by severity, each showing the exact source sentence it came from.
3. A drafted counter-offer for each flagged clause.
4. A question box that answers only from the document — no outside knowledge, no general legal advice.
5. An editable list of the user's own red lines, which drives the analysis (e.g., "I will not accept an uncapped indemnity clause").
6. A saved library of past documents.

Explicitly excluded from this version: payments/billing, OCR for scanned documents, sharing a document between users. Per CLAUDE.md: OCR is excluded on purpose because a citation is worthless if the underlying text was misread — this version exists to prove the analysis can be trusted, and OCR would undermine that, not support it.

### 7.3 Technology

Settled in CLAUDE.md, not re-litigated here:
- Next.js App Router, TypeScript, npm.
- Supabase for auth and database; schema changes as committed SQL migrations.
- Deployed on Vercel.
- Model calls through OpenRouter, default `anthropic/claude-sonnet-4.5`.
- Document parsing happens client-side; only extracted text is stored, the original file never leaves the browser.
- Approved dependencies: next, react, typescript, tailwind, `@supabase/supabase-js`, one browser-side PDF/DOCX parser. New dependencies need explicit approval.

### 7.4 Assumptions (flagged for validation, not yet proven)

- That freelancers and/or renters, specifically, are the right first wedge — not yet tested against real users, only against secondary market data.
- That "answers only from the document" is achievable and verifiable at the reliability bar this product needs — this is the core trust bet and the biggest technical/product risk.
- That a drafted counter-offer people can act on (not just a risk flag) is the differentiator people will actually pay for, versus the free flag-only tools — validated as *not already built elsewhere* (research/agent5-edge-validation.md), but not yet validated as *wanted* by a real user.
- That people will trust AI-drafted legal language enough to use it — DoNotPay's FTC settlement (research/agent3-what-exists.md) shows real regulatory and trust risk in this category if quality claims outrun evidence.

## 8. Release

First version: the six features in 7.2, for one or two document types (likely freelance contracts and leases, per Market Segments), built to prove the trust hypothesis in Objective — not to acquire users or generate revenue (payments explicitly excluded). Rough shape: define/spec pass, then incremental build with the standing citation rule enforced from the first flag shipped, not added later.

Future versions, not this one: payments/billing, OCR for scanned documents, sharing documents between users, additional document types beyond the first one or two, broader legal-advice framing (would need to clear the same trust bar DoNotPay failed on).
