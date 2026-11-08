# Eddie's Flowers Dispensary — eddiesflower.com

Pre-launch marketing site for Eddie's Flowers Dispensary, a Massachusetts-licensed adult-use cannabis retailer opening at 23 Rindge State Road, Ashburnham, MA (MA CCC license **MRN284579**, provisional). Operated by Legacy Operations on behalf of Iyad "Eddie" Jamal.

v1 is a single-page Coming Soon with email-waitlist capture and three legal pages. The full retail experience (menu, age gate, Sweed link-out, loyalty, careers, wholesale) is v2 once the dispensary opens.

## Stack

- **Next.js 16** (App Router) on Vercel
- **TypeScript** + **Tailwind CSS v4** (CSS-first `@theme` config)
- **No database credential.** Every form write goes through the Legacy OS form intake (`POST /api/v1/eddies-forms/{kind}`, public and insert-only), which writes `control_plane.eddies_flowers_leads`, `eddies_flowers_age_gate_attestations`, `eddies_vendor_intakes` and `eddies_vendor_products`. See `lib/legacy-os.ts`. If the intake fails, `lib/fallback.ts` saves to the Legacy OS CRM and marks the ops email NOT SAVED.
- **Resend** for transactional email (waitlist acknowledgment + internal lead notifications)
- **@vercel/analytics** free tier
- Brand assets (logos, fonts, icons) sourced from the infibrain brand book delivered April 2026

## Local dev

```bash
cp .env.example .env.local   # fill in real values from 1Password
npm install
npm run dev                  # http://localhost:3000
```

You'll need `RESEND_API_KEY` for the notification and acknowledgment emails. Form rows go to Legacy OS at `LEGACY_OS_URL` (default `https://legacy-os.thelegacyops.com`; point it at a local or preview Legacy OS when testing). No database URL is needed or read.

## Deploy

This repo is connected to Vercel project `prj_joEKzBfdUg38RCMhdIdJZ7q7s1d9` on team `team_C2MTOGwrC3jHRm9HlY5w7sCE`. Pushing the `feat/next16-rebuild` branch creates a preview; merging to `main` deploys to production at `https://eddiesflower.com` (DNS via Google Cloud DNS, registrar Squarespace).

## Schema

The migration that creates `control_plane.eddies_flowers_leads` and `control_plane.eddies_flowers_age_gate_attestations` is **migration 227** in the `legacy-ops-control-plane` monorepo's `migrations/` folder (slots in after 226_campaigns_template_extensions, which landed in PR #261). A copy of the same SQL lives at `migrations/227_eddies_flowers_leads.sql` in this repo for reference, but the canonical version is in the control-plane repo.

Schema changes always happen by writing a NEW numbered migration in the control-plane monorepo, applying to Neon, and committing the .sql to the repo. A new or renamed form field also has to be added to the Legacy OS intake contract (`apps/legacy-ops/lib/eddies/site-forms/contract.ts`), which refuses fields it does not name.

## Compliance

Footer carries the MA CCC adult-use marijuana retailer boilerplate disclosure and the license number `MRN284579 (Provisional)`. Pre-publish (Part 8), Cowork re-verifies the exact disclosure text against masscannabiscontrol.com to catch any 2026 regulatory updates.
