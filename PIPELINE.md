# PIPELINE.md - project ledger (router + dashboard read this; keep formats)

## Project
- name: Redline
- created: 2026-08-28
- idea: reads a contract, lease, freelance agreement or ToS and tells the reader what they're actually signing - plain-English summary, risky clauses ranked by severity with exact source sentence, a drafted counter-offer per clause, and a question box that answers only from the document.

## Artifacts
| artifact | path | produced by | date | status |
|---|---|---|---|---|
| scope / settled decisions | CLAUDE.md | manual (Vinay) | 2026-08-28 | current |
| discovery research (4 sourced agents + synthesis) | research/summary.md | project-pipeline research agents (Sonnet) | 2026-09-11 | current |
| edge validation (counter-offer + grounded Q&A vs competitors) | research/agent5-edge-validation.md | research agent (Sonnet) | 2026-09-11 | current |
| strategy | - | - | missing |
| PRD | PRD.md | create-prd | 2026-09-11 | current |
| spec | - | - | missing |

status: current | stale (superseded by a later ask) | draft

## Asks
| date | ask | route | outcome |
|---|---|---|---|
| 2026-09-11 | onboard existing repo into pipeline | onboard-project | ledger + tasks created, no code/artifacts fabricated |
| 2026-09-11 | discovery research (4 parallel agents) | research only | research/summary.md - pain validated, competitive risk flagged (free lookalikes exist), edge = counter-offer drafting + grounded Q&A |
| 2026-09-11 | validate counter-offer + grounded Q&A edge vs competitors | 1 research agent | no product checked (9 checked) confirmed to combine both; combo not found anywhere among consumer-tier competitors - edge holds, proceed to PRD |
| 2026-09-11 | write PRD | create-prd | PRD.md - 8-section PRD from research/summary.md + agent5-edge-validation.md + CLAUDE.md scope; flags market-segment choice and "does the counter-offer land" as unvalidated assumptions |
