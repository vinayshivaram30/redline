# PIPELINE.md - project ledger (router + dashboard read this; keep formats)

## Project
- name: Redline
- created: 2026-08-28
- idea: reads a contract, lease, freelance agreement or ToS and tells the reader what they're actually signing - plain-English summary, risky clauses ranked by severity with exact source sentence, a drafted counter-offer per clause, and a question box that answers only from the document.
- Supabase project: `redline` (ref `aahentkawcejrvngvhve`, org `unbebhtffhswmvfsjnzn`, ap-south-1, free tier); URL/anon key in `.env.local` (gitignored, not in repo)

## Artifacts
| artifact | path | produced by | date | status |
|---|---|---|---|---|
| scope / settled decisions | CLAUDE.md | manual (Vinay) | 2026-08-28 | current |
| discovery research (4 sourced agents + synthesis) | research/summary.md | project-pipeline research agents (Sonnet) | 2026-09-11 | current |
| edge validation (counter-offer + grounded Q&A vs competitors) | research/agent5-edge-validation.md | research agent (Sonnet) | 2026-09-11 | current |
| strategy | - | - | missing |
| PRD | PRD.md | create-prd | 2026-09-11 | current |
| spec | docs/SPEC.md | spec-driven-development | 2026-09-11 | current |
| implementation plan | tasks/plan.md | planning-and-task-breakdown | 2026-09-11 | current |
| task list | TASKS.md / tasks/todo.md | planning-and-task-breakdown | 2026-09-11 | current |

status: current | stale (superseded by a later ask) | draft

## Asks
| date | ask | route | outcome |
|---|---|---|---|
| 2026-09-11 | onboard existing repo into pipeline | onboard-project | ledger + tasks created, no code/artifacts fabricated |
| 2026-09-11 | discovery research (4 parallel agents) | research only | research/summary.md - pain validated, competitive risk flagged (free lookalikes exist), edge = counter-offer drafting + grounded Q&A |
| 2026-09-11 | validate counter-offer + grounded Q&A edge vs competitors | 1 research agent | no product checked (9 checked) confirmed to combine both; combo not found anywhere among consumer-tier competitors - edge holds, proceed to PRD |
| 2026-09-11 | write PRD | create-prd | PRD.md - 8-section PRD from research/summary.md + agent5-edge-validation.md + CLAUDE.md scope; flags market-segment choice and "does the counter-offer land" as unvalidated assumptions |
| 2026-09-11 | spec pass on PRD | spec-driven-development (Phase 1: Specify) | docs/SPEC.md - draft, 4 open questions need human review before Phase 2 (Plan): first document type, test framework, auth method, doc size limit/parser choice |
| 2026-09-11 | resolve spec open questions | Vinay confirmed defaults | freelance contracts + leases locked; Vitest+Playwright, Supabase email/password, 50pg/25k word cap, pdfjs-dist+mammoth confirmed; docs/SPEC.md -> current |
| 2026-09-11 | plan + task breakdown | planning-and-task-breakdown | tasks/plan.md (15 tasks, 6 phases, 4 checkpoints) + TASKS.md/tasks/todo.md; highest-risk work (citation integrity) sequenced first to fail fast |
| 2026-09-11 | build Task 1: scaffold | incremental-implementation | Next.js/TS/Tailwind scaffold + Supabase client; build+lint clean; ponytail-review: no findings |
| 2026-09-11 | build Task 2: auth | incremental-implementation | Supabase email/password auth, protected /documents route, created Supabase project `redline`; e2e (Playwright) 3/3 passing; ponytail-review found 2 (unused getSession wrapper, premature Vitest install) - both fixed before commit |
| 2026-09-11 | build Task 3: documents schema | incremental-implementation | supabase/migrations/0001_documents.sql applied to dev project; RLS verified live (owner-only insert/read via REST API, default auth.uid() catches a client that omits user_id, anon sees nothing); ponytail-review: no findings |
