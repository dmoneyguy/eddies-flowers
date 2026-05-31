-- Migration 227 — Eddie's Flowers Dispensary lead capture + age-gate attestations
-- ============================================================================
-- Schema: control_plane
-- Tables:
--   * eddies_flowers_leads               — all consumer-side form submissions
--   * eddies_flowers_age_gate_attestations — 21+ attestation log (v2)
-- Indexes per discovery spec; CHECK constraints enforce source/status enums.
--
-- v1 site (Coming Soon, single page) only writes source='launch_waitlist'.
-- All other source values are scaffolded ahead for v2 (when the dispensary
-- opens and the full retail marketing site ships with /loyalty, /careers,
-- /wholesale, /contact forms).
--
-- NUMBERING NOTE (CORRECTED 2026-05-26):
--   Latest applied migration on production = 224.
--   CT Phase 1 prep migrations 224, 225, 226 landed in legacy-ops-control-plane
--   PR #261 (just merged). Eddie's Flowers slots in as 227.
--   Apply order: 227 runs after 226_campaigns_template_extensions.
--
-- BINDING SYNC RULE: this file is committed to dmoneyguy/legacy-ops-control-plane
-- migrations/ folder on a branch + PR alongside being applied to production Neon.
-- CT Phase 1 closed its repo-production sync via PR #261. Migration 227 keeps
-- the discipline in place from day one for Eddie's Flowers.
-- ============================================================================

BEGIN;

-- ----------------------------------------------------------------------------
-- Table 1: eddies_flowers_leads
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS control_plane.eddies_flowers_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source TEXT NOT NULL CHECK (
    source IN (
      'contact_form',
      'sms_signup',
      'loyalty_signup',
      'careers',
      'wholesale_inquiry',
      'newsletter',
      'launch_waitlist'
    )
  ),
  email TEXT,
  phone TEXT,
  name TEXT,
  message TEXT,
  consented_to_marketing BOOLEAN NOT NULL DEFAULT FALSE,
  age_gate_attested BOOLEAN NOT NULL DEFAULT FALSE,
  ip_address INET,
  user_agent TEXT,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  status TEXT NOT NULL DEFAULT 'new' CHECK (
    status IN ('new', 'contacted', 'converted', 'unsubscribed', 'spam')
  ),
  notes TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb
);

COMMENT ON TABLE control_plane.eddies_flowers_leads IS
  'All consumer-facing lead capture for Eddie''s Flowers Dispensary (Ashburnham MA, MRN284579). Source enum covers v1 launch_waitlist plus v2 forms.';

CREATE INDEX IF NOT EXISTS idx_eddies_leads_source
  ON control_plane.eddies_flowers_leads (source);

CREATE INDEX IF NOT EXISTS idx_eddies_leads_email_lower
  ON control_plane.eddies_flowers_leads (LOWER(email))
  WHERE email IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_eddies_leads_submitted
  ON control_plane.eddies_flowers_leads (submitted_at DESC);

CREATE INDEX IF NOT EXISTS idx_eddies_leads_status
  ON control_plane.eddies_flowers_leads (status)
  WHERE status != 'spam';

-- ----------------------------------------------------------------------------
-- Table 2: eddies_flowers_age_gate_attestations
-- ----------------------------------------------------------------------------
-- Not used by v1 (no cannabis content rendered, so no age gate). Created now
-- so v2 doesn't need a follow-up migration. Session token + expiry support
-- the planned 30-day cookie behaviour.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS control_plane.eddies_flowers_age_gate_attestations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_token TEXT NOT NULL,
  attested_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  attested_age_21_or_over BOOLEAN NOT NULL,
  ip_address INET,
  user_agent TEXT,
  expires_at TIMESTAMPTZ NOT NULL
);

COMMENT ON TABLE control_plane.eddies_flowers_age_gate_attestations IS
  'Age-gate attestations for Eddie''s Flowers Dispensary site. Used by v2 (post-launch retail site). Each row represents one 21+ attestation tied to a session cookie.';

CREATE INDEX IF NOT EXISTS idx_eddies_age_gate_session
  ON control_plane.eddies_flowers_age_gate_attestations (session_token);

-- Unconditional index. The earlier draft used a partial WHERE expires_at > NOW()
-- predicate, but PostgreSQL evaluates NOW() at index-creation time (frozen),
-- not at query time, which makes the partial misleading. Index every row.
CREATE INDEX IF NOT EXISTS idx_eddies_age_gate_expires
  ON control_plane.eddies_flowers_age_gate_attestations (expires_at);

COMMIT;

-- ----------------------------------------------------------------------------
-- Verification queries (run after apply)
-- ----------------------------------------------------------------------------
-- SELECT
--   table_name,
--   (SELECT count(*) FROM information_schema.columns
--      WHERE table_schema = 'control_plane' AND table_name = t.table_name) AS column_count
-- FROM information_schema.tables t
-- WHERE table_schema = 'control_plane'
--   AND table_name LIKE 'eddies_flowers_%';
--
-- Expected: 2 rows.
--   eddies_flowers_leads                       → 14 columns
--   eddies_flowers_age_gate_attestations       → 7 columns
