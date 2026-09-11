# Redline

Read PIPELINE.md before any work.

Web app: user uploads a contract, lease, freelance agreement or terms of
service and gets back an analysis they can trust.

## Read before you act

- `research/summary.md` - the user research. Read before deciding what the
  product should do.
- `PRD.md` - the brief, once it exists. Read before building.

## Settled decisions - not open for reinterpretation

- Next.js App Router, TypeScript, npm.
- Supabase for auth and database. Schema changes are SQL migrations committed
  under `supabase/migrations/`. Never apply DDL straight to the hosted project.
- Deployed on Vercel.
- Model calls go through OpenRouter. Default model `anthropic/claude-sonnet-4.5`.
- The uploaded file is parsed in the browser. Only the extracted text is stored.
  The original file never leaves the client.

## Scope

Build exactly these, then stop:

- plain-English summary of the document
- clauses that could hurt the user, ranked by severity, each showing the exact
  source sentence
- a drafted counter-offer for each flagged clause
- a question box that answers only from the document
- an editable list of the user's own red lines, which drives the analysis
- a saved library of past documents

When something looks like the obvious next step and is not on that list, ask
before building it.

Excluded on purpose: payments, billing, OCR for scanned documents, and sharing
a document between users. This version exists to prove the analysis can be
trusted, and none of those make it more trustworthy. OCR would actively
undermine it, because a citation is worthless when the text it points at was
misread.

## Standing rules

- Every risk flag cites the exact sentence it came from. A flag whose source
  sentence cannot be shown is a bug, not a degraded result - fix it, do not
  ship it with the citation omitted.
- State only what the document says. Where the text does not support a claim,
  the product does not make it.
- Keep credentials in `.env.local`, which is gitignored. Never commit a secret,
  because a key is public the moment it is pushed and has to be rotated.
- Approved dependencies: next, react, typescript, tailwind,
  `@supabase/supabase-js`, and one browser-side PDF/DOCX text parser. Ask
  before adding any other dependency.
