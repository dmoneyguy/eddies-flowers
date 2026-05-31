"use client";

// AgeGateProvider — mounts once at the root. Reads the localStorage flag and
// only renders the AgeGate splash if the user hasn't attested in the last
// 30 days. Renders nothing on the server (no SEO impact — search engines
// reach the underlying page; live human visitors see the gate first).

import { useEffect, useState } from "react";
import { AgeGate } from "./AgeGate";

type State = "loading" | "gate" | "open";

export function AgeGateProvider() {
  const [state, setState] = useState<State>("loading");

  useEffect(() => {
    try {
      const raw = localStorage.getItem("ef-age-gate");
      if (raw) {
        const parsed = JSON.parse(raw) as { ok?: boolean; expiresAt?: number };
        if (parsed.ok && parsed.expiresAt && parsed.expiresAt > Date.now()) {
          setState("open");
          return;
        }
      }
    } catch {
      // fall through to gate
    }
    setState("gate");
  }, []);

  if (state !== "gate") return null;
  return <AgeGate onConfirm={() => setState("open")} />;
}
