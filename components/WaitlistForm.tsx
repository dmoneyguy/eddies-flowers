"use client";

// Email capture form — single email field + optional name, honeypot for bots,
// optimistic submit with friendly states. POSTs to /api/waitlist (Part 1D).
//
// State machine: idle → submitting → success | error
// Spam defense: hidden 'website' honeypot field; bots fill it, humans don't.

import { useState, type FormEvent } from "react";

type State =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "success" }
  | { kind: "error"; message: string };

export function WaitlistForm() {
  const [state, setState] = useState<State>({ kind: "idle" });

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (state.kind === "submitting") return;

    const form = e.currentTarget;
    const fd = new FormData(form);
    const email = String(fd.get("email") || "").trim();
    const name = String(fd.get("name") || "").trim();
    const website = String(fd.get("website") || ""); // honeypot

    // Client-side guard. Real validation happens server-side.
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setState({ kind: "error", message: "Please enter a valid email address." });
      return;
    }
    if (website) {
      // Bot detected — show success state to not tip them off; do not POST.
      setState({ kind: "success" });
      return;
    }

    setState({ kind: "submitting" });

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name, website }),
      });

      const data: { ok?: boolean; error?: string } = await res
        .json()
        .catch(() => ({ ok: false, error: "Network error" }));

      if (res.ok && data.ok) {
        setState({ kind: "success" });
        form.reset();
      } else {
        setState({
          kind: "error",
          message:
            data.error || "Something went wrong. Please try again in a minute.",
        });
      }
    } catch {
      setState({
        kind: "error",
        message: "Couldn't reach the server. Check your connection and try again.",
      });
    }
  }

  if (state.kind === "success") {
    return (
      <div
        role="status"
        aria-live="polite"
        className="rounded-2xl border-2 border-leaf-green/30 bg-leaf-green/10 p-8 text-center"
      >
        <p className="text-2xl font-bold text-charcoal-black">
          Thanks — we&apos;ll be in touch.
        </p>
        <p className="mt-2 text-charcoal-black/70">
          You&apos;re on the list. We&apos;ll email you the day the doors open.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="space-y-4"
      aria-describedby="waitlist-microcopy"
    >
      {/* Honeypot — visually hidden, off-screen, autocomplete off. Bots fill, humans don't. */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          left: "-9999px",
          top: "auto",
          width: "1px",
          height: "1px",
          overflow: "hidden",
        }}
      >
        <label htmlFor="website">
          Leave this field empty
          <input
            type="text"
            id="website"
            name="website"
            tabIndex={-1}
            autoComplete="off"
          />
        </label>
      </div>

      <div>
        <label
          htmlFor="name"
          className="mb-2 block text-sm font-semibold text-charcoal-black"
        >
          Your name <span className="font-normal text-charcoal-black/50">(optional)</span>
        </label>
        <input
          type="text"
          id="name"
          name="name"
          autoComplete="given-name"
          maxLength={120}
          className="w-full rounded-lg border-2 border-charcoal-black/15 bg-white px-4 py-3 text-base text-charcoal-black placeholder:text-charcoal-black/40 focus:border-leaf-green focus:outline-none"
          placeholder="Eddie"
        />
      </div>

      <div>
        <label
          htmlFor="email"
          className="mb-2 block text-sm font-semibold text-charcoal-black"
        >
          Email <span className="font-normal text-charcoal-black/50">(required)</span>
        </label>
        <input
          type="email"
          id="email"
          name="email"
          required
          autoComplete="email"
          maxLength={254}
          className="w-full rounded-lg border-2 border-charcoal-black/15 bg-white px-4 py-3 text-base text-charcoal-black placeholder:text-charcoal-black/40 focus:border-leaf-green focus:outline-none"
          placeholder="you@example.com"
        />
      </div>

      <button
        type="submit"
        disabled={state.kind === "submitting"}
        className="w-full rounded-full bg-leaf-green px-6 py-4 text-base font-semibold text-white shadow-sm transition-colors hover:bg-leaf-green/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf-green disabled:cursor-not-allowed disabled:opacity-60 sm:text-lg"
      >
        {state.kind === "submitting" ? "Adding you…" : "Notify me when you open"}
      </button>

      {state.kind === "error" && (
        <p role="alert" className="text-sm font-medium text-red-700">
          {state.message}
        </p>
      )}

      <p id="waitlist-microcopy" className="text-xs text-charcoal-black/60">
        We&apos;ll only email you about Eddie&apos;s Flowers updates. Unsubscribe anytime.
      </p>
    </form>
  );
}
