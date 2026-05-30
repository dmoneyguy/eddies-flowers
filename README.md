# Eddie's Flowers Dispensary — eddiesflower.com

Pre-launch marketing site for Eddie's Flowers Dispensary, a Massachusetts-licensed adult-use cannabis retailer opening at 23 Rindge State Road, Ashburnham, MA (MA CCC license **MRN284579**, provisional). Operated by Legacy Operations on behalf of Iyad "Eddie" Jamal.

v1 is a single-page Coming Soon with email-waitlist capture and three legal pages. The full retail experience (menu, age gate, Sweed link-out, loyalty, careers, wholesale) is v2 once the dispensary opens.

## Stack

- **Next.js 16** (App Router) on Vercel
- **TypeScript** + **Tailwind CSS v4** (CSS-first `@theme` config)
- **Drizzle ORM** + **@neondatabase/serverless** writing to `control_plane.eddies_flowers_leads` on the LegacyOS Neon instance
- **Resend** for transactional email (waitlist acknowledgment + internal lead notifications)
- **@vercel/analytics** free tier
- Brand assets (logos, fonts, icons) sourced from the infibrain brand book delivered April 2026

## Local dev

```bash
cp .env.example .env.local   # fill in real values from 1Password
npm install
npm run dev                  # http://localhost:3000
```

You'll need at least `DATABASE_URL_WRITE` and `RESEND_API_KEY` for the waitlist endpoint to function. The page renders fine without them, but `/api/waitlist` will return 5xx.

## Deploy

This repo is connected to Vercel project `prj_joEKzBfdUg38RCMhdIdJZ7q7s1d9` on team `team_C2MTOGwrC3jHRm9HlY5w7sCE`. Pushing the `feat/next16-rebuild` branch creates a preview; merging to `main` deploys to production at `https://eddiesflower.com` (DNS via Google Cloud DNS, registrar Squarespace).

## Schema

The migration that creates `control_plane.eddies_flowers_leads` and `control_plane.eddies_flowers_age_gate_attestations` is **migration 227** in the `legacy-ops-control-plane` monorepo's `migrations/` folder (slots in after 226_campaigns_template_extensions, which landed in PR #261). A copy of the same SQL lives at `migrations/227_eddies_flowers_leads.sql` in this repo for reference, but the canonical version is in the control-plane repo.

Schema changes always happen by writing a NEW numbered migration in the control-plane monorepo, applying to Neon, and committing the .sql to the repo. Never edit `lib/db/schema.ts` in isolation.

## Compliance

Footer carries the MA CCC adult-use marijuana retailer boilerplate disclosure and the license number `MRN284579 (Provisional)`. Pre-publish (Part 8), Cowork re-verifies the exact disclosure text against masscannabiscontrol.com to catch any 2026 regulatory updates.
