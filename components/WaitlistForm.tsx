"use client";

// Email + phone capture form. SMS-first cannabis brands convert harder on
// phone than email — both fields are offered but only one is required.
// Honeypot for bots, optimistic submit, fires a Vercel Analytics event on
// success so we can attribute waitlist conversions to traffic sources.
//
// State machine: idle → submitting → success | error

import { useState, type FormEvent } from "react";
import { track } from "@vercel/analytics";

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
    const phone = String(fd.get("phone") || "").trim();
    const website = String(fd.get("website") || ""); // honeypot

    if (!email && !phone) {
      setState({
        kind: "error",
        message: "Please enter your email or phone — at least one.",
      });
      return;
    }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
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
        body: JSON.stringify({ email, name, phone, website }),
      });

      const data: { ok?: boolean; error?: string } = await res
        .json()
        .catch(() => ({ ok: false, error: "Network error" }));

      if (res.ok && data.ok) {
        // Fire analytics — lets us measure waitlist conversion vs. raw visits
        try {
          track("waitlist_signup", {
            has_email: Boolean(email),
            has_phone: Boolean(phone),
            has_name: Boolean(name),
          });
        } catch {
          // Analytics is best-effort, never block the success state.
        }
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
          You&apos;re on the list.
        </p>
        <p className="mt-3 text-base text-charcoal-black/80">
          We&apos;ll reach out the day the doors open. You&apos;re a founding member.
        </p>
        <p className="mt-4 text-xs text-charcoal-black/50">
          — Eddie
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
      {/* Honeypot — visually hidden, off-screen, autocomplete off. */}
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
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          autoComplete="email"
          maxLength={254}
          className="w-full rounded-lg border-2 border-charcoal-black/15 bg-white px-4 py-3 text-base text-charcoal-black placeholder:text-charcoal-black/40 focus:border-leaf-green focus:outline-none"
          placeholder="you@example.com"
        />
      </div>

      <div>
        <label
          htmlFor="phone"
          className="mb-2 block text-sm font-semibold text-charcoal-black"
        >
          Phone <span className="font-normal text-charcoal-black/50">(optional, for opening-day text)</span>
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          autoComplete="tel"
          maxLength={20}
          inputMode="tel"
          className="w-full rounded-lg border-2 border-charcoal-black/15 bg-white px-4 py-3 text-base text-charcoal-black placeholder:text-charcoal-black/40 focus:border-leaf-green focus:outline-none"
          placeholder="(978) 555-0123"
        />
      </div>

      <button
        type="submit"
        disabled={state.kind === "submitting"}
        className="w-full rounded-full bg-leaf-green px-6 py-4 text-base font-semibold text-white shadow-sm transition-colors hover:bg-leaf-green/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf-green disabled:cursor-not-allowed disabled:opacity-60 sm:text-lg"
      >
        {state.kind === "submitting" ? "Adding you…" : "Save my spot on the list"}
      </button>

      {state.kind === "error" && (
        <p role="alert" className="text-sm font-medium text-red-700">
          {state.message}
        </p>
      )}

      <p id="waitlist-microcopy" className="text-xs text-charcoal-black/60">
        By submitting you confirm you are 21+ and agree we can email or text you
        about Eddie&apos;s Flowers opening. Msg & data rates may apply. Reply STOP
        to opt out. Unsubscribe anytime. We will never sell or share your info.
      </p>
    </form>
  );
}
