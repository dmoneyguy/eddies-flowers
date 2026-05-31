// Neon serverless + Drizzle setup. Mirrors the pattern used in
// apps/legacy-ops in the control-plane monorepo.
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

const url = process.env.DATABASE_URL_WRITE;
if (!url && process.env.NODE_ENV !== "test") {
  // We don't crash the import — just surface clearly at runtime when the
  // /api/waitlist route tries to insert. Useful so `next build` doesn't fail
  // when previewing with missing env vars.
  // eslint-disable-next-line no-console
  console.warn(
    "[db] DATABASE_URL_WRITE is not set — waitlist inserts will fail at runtime.",
  );
}

const sql = neon(url || "postgres://placeholder@localhost/placeholder");
export const db = drizzle(sql, { schema });
export type DB = typeof db;
