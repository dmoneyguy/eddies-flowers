-- 228_eddies_flowers_leads_product_request_source.sql
--
-- Adds 'product_request' to the source CHECK constraint on
-- control_plane.eddies_flowers_leads.
--
-- STATUS: ALREADY APPLIED IN PRODUCTION. The live eddiesflower.com site has
-- been writing product_request rows for some time, so the constraint on the
-- production database already carries this value. This file exists so the
-- repository's migration history matches the database rather than silently
-- diverging from it — verified 7 August 2026 against the live constraint
-- definition, which reads:
--
--   CHECK (source = ANY (ARRAY['contact_form','sms_signup','loyalty_signup',
--   'careers','wholesale_inquiry','newsletter','launch_waitlist',
--   'product_request']))
--
-- Re-running this file is safe and is a no-op in effect.

ALTER TABLE control_plane.eddies_flowers_leads
  DROP CONSTRAINT IF EXISTS eddies_flowers_leads_source_check;

ALTER TABLE control_plane.eddies_flowers_leads
  ADD CONSTRAINT eddies_flowers_leads_source_check CHECK (
    source IN (
      'contact_form',
      'sms_signup',
      'loyalty_signup',
      'careers',
      'wholesale_inquiry',
      'newsletter',
      'launch_waitlist',
      'product_request'
    )
  );
