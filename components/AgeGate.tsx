"use client";

// Age gate splash — Massachusetts CCC compliance.
//
// MA framework (post-April 2026): cannabis content (including discount /
// loyalty messaging) on a dispensary website is permitted, but the audience
// must be reasonably expected to be 21+. The site-side enforcement is an
// affirmative attestation gate before the user reaches the cannabis content.
//
// Flow:
//   1. On first visit, full-screen splash blocks the page. No cannabis copy
//      visible — only the lockup, two buttons, and a 21+ disclosure.
//   2. User clicks "I'm 21 or older" → POST /api/age-gate with a generated
//      session token + age attestation. We persist the token + expiry in
//      localStorage so they don't get re-prompted for 30 days.
//   3. User clicks "I'm under 21" → polite block screen with a redirect link
//      out (drugfree.org). No way to bypass.
//
// This component is mounted by AgeGateProvider, which decides whether to
// render based on localStorage state.

import { useEffect, useState } from "react";
import Image from "next/image";

interface AgeGateProps {
  onConfirm: () => void;
}

export function AgeGate({ onConfirm }: AgeGateProps) {
  const [denied, setDenied] = useState(false);
  const [busy, setBusy] = useState(false);

  // Lock body scroll while the gate is up
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  async function confirm() {
    if (busy) return;
    setBusy(true);

    // Generate a session token (crypto.randomUUID is widely supported)
    const sessionToken =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2, 12)}`;

    const now = Date.now();
    const expiresMs = 30 * 24 * 60 * 60 * 1000; // 30 days
    const payload = {
      sessionToken,
      attestedAge21OrOver: true,
      expiresAt: new Date(now + expiresMs).toISOString(),
    };

    // Fire-and-forget audit log — never block UI on the network
    try {
      void fetch("/api/age-gate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        keepalive: true,
      });
    } catch {
      // ignore — localStorage is the source of truth client-side
    }

    try {
      localStorage.setItem(
        "ef-age-gate",
        JSON.stringify({ token: sessionToken, expiresAt: now + expiresMs, ok: true }),
      );
    } catch {
      // Some users disable storage; we still let them through this session
    }

    // Smooth out: small delay so the click registers visually
    setTimeout(onConfirm, 80);
  }

  if (denied) {
    return (
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="ag-denied-title"
        className="mesh-canvas fixed inset-0 z-[100] flex flex-col items-center justify-center px-6 text-center"
      >
        <Image
          src="/logo-secondary.svg"
          alt=""
          width={520}
          height={300}
          priority
          aria-hidden="true"
          className="h-auto w-[180px] opacity-60 sm:w-[240px]"
        />
        <p className="mt-8 text-xs font-semibold uppercase tracking-[0.32em] text-leaf-green-soft">
          Sorry
        </p>
        <h2
          id="ag-denied-title"
          className="display mt-3 max-w-xl text-balance text-4xl font-medium text-white sm:text-5xl"
        >
          You must be{" "}
          <span className="italic font-light text-leaf-green-soft">21 or older</span>{" "}
          to enter this site.
        </h2>
        <p className="mt-6 max-w-md text-balance text-base text-white/65">
          We&apos;ll see you when you&apos;re 21. Thanks for stopping by.
        </p>
        <a
          href="https://drugfree.org"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-10 inline-flex items-center gap-2 rounded-full border border-white/20 px-7 py-3.5 text-base font-semibold text-white transition-colors hover:border-leaf-green-soft hover:text-leaf-green-soft"
        >
          Visit drugfree.org
          <span aria-hidden="true">→</span>
        </a>
      </div>
    );
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="ag-title"
      className="mesh-canvas fixed inset-0 z-[100] flex flex-col items-center justify-center px-6 text-center"
    >
      <Image
        src="/logo-secondary.svg"
        alt="Eddie's Flowers Dispensary"
        width={520}
        height={300}
        priority
        className="h-auto w-[200px] sm:w-[280px]"
      />
      <p className="mt-10 text-xs font-semibold uppercase tracking-[0.32em] text-leaf-green-soft">
        Welcome
      </p>
      <h2
        id="ag-title"
        className="display mt-3 max-w-2xl text-balance text-4xl font-medium text-white sm:text-5xl"
      >
        Are you{" "}
        <span className="italic font-light text-leaf-green-soft">21 or older</span>?
      </h2>
      <p className="mt-5 max-w-md text-balance text-base text-white/65">
        This website is intended for adults age 21 and older.
        By entering you confirm you meet this age requirement.
      </p>

      <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
        <button
          type="button"
          onClick={confirm}
          disabled={busy}
          className="glow-leaf inline-flex items-center gap-2 rounded-full bg-leaf-green px-8 py-4 text-base font-semibold text-white sm:text-lg disabled:cursor-wait disabled:opacity-60"
        >
          I&apos;m 21 or older
          <span aria-hidden="true">→</span>
        </button>
        <button
          type="button"
          onClick={() => setDenied(true)}
          className="inline-flex items-center gap-2 rounded-full border border-white/20 px-8 py-4 text-base font-semibold text-white transition-colors hover:border-white/40"
        >
          I&apos;m under 21
        </button>
      </div>

      <p className="mt-10 max-w-md text-balance text-[11px] uppercase tracking-[0.16em] text-white/35">
        Massachusetts Licensed Adult-Use Marijuana Retailer #MRN284579 (Provisional)
        · Keep marijuana products out of reach of children
      </p>
    </div>
  );
}
