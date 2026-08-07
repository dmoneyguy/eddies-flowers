// Drizzle schema MIRRORING migration 227_eddies_flowers_leads.sql.
// SOURCE OF TRUTH FOR SCHEMA = the SQL migration in the legacy-ops-control-plane repo.
// This file is the typed read interface only — schema changes happen by writing a new
// numbered migration, not by editing this file in isolation.

import {
  pgSchema,
  uuid,
  text,
  boolean,
  timestamp,
  jsonb,
  inet,
} from "drizzle-orm/pg-core";

export const controlPlane = pgSchema("control_plane");

export const eddiesFlowersLeads = controlPlane.table("eddies_flowers_leads", {
  id: uuid("id").primaryKey().defaultRandom(),
  source: text("source").notNull(), // CHECK constraint enforced at SQL level
  email: text("email"),
  phone: text("phone"),
  name: text("name"),
  message: text("message"),
  consentedToMarketing: boolean("consented_to_marketing").notNull().default(false),
  ageGateAttested: boolean("age_gate_attested").notNull().default(false),
  ipAddress: inet("ip_address"),
  userAgent: text("user_agent"),
  submittedAt: timestamp("submitted_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  status: text("status").notNull().default("new"),
  notes: text("notes"),
  metadata: jsonb("metadata").notNull().default({}),
});

export const eddiesFlowersAgeGateAttestations = controlPlane.table(
  "eddies_flowers_age_gate_attestations",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    sessionToken: text("session_token").notNull(),
    attestedAt: timestamp("attested_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    attestedAge21OrOver: boolean("attested_age_21_or_over").notNull(),
    ipAddress: inet("ip_address"),
    userAgent: text("user_agent"),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  },
);

export type LeadSource =
  | "contact_form"
  | "sms_signup"
  | "loyalty_signup"
  | "careers"
  | "wholesale_inquiry"
  | "newsletter"
  | "launch_waitlist"
  | "product_request";

export type LeadStatus = "new" | "contacted" | "converted" | "unsubscribed" | "spam";
