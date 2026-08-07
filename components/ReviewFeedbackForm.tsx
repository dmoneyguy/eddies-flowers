"use client";

// Private feedback form on /review. Deliberately NOT a review gate: it sits
// beside an equally prominent public-review link and is offered to every
// visitor regardless of what they intend to say. Google's guideline is "Don't
// discourage or prohibit negative reviews or selectively solicit positive
// reviews from customers" — so we never ask how the visit went and then decide
// which door to show. Both doors, every time.
//
// Posts to the existing /api/lead endpoint using the contact_form source, with
// extras marking it as post-visit feedback. No schema change required.
//
// State machine: idle → submitting → success | error

import { useState, type FormEvent } from "react";
import { track } from "@vercel/analytics";

type State =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "success" }
  | { kind: "error"; message: string };

export function ReviewFeedbackForm() {
  const [state, setState] = useState<State>({ kind: "idle" });

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (state.kind === "submitting") return;

    const fd = new FormData(e.currentTarget);
    const name = String(fd.get("name") || "").trim();
    const email = String(fd.get("email") || "").trim();
    const message = String(fd.get("message") || "").trim();
    const website = String(fd.get("website") || ""); // honeypot

    if (!message) {
      setState({ kind: "error", message: "Tell us what happened — even a sentence helps." });
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setState({ kind: "error", message: "Please enter a valid email so we can reply." });
      return;
    }
    if (website) {
      setState({ kind: "success" }); // bot — show success, do not POST
      return;
    }

    setState({ kind: "submitting" });
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          source: "contact_form",
          name: name || "Guest",
          email,
          message,
          extras: { kind: "post_visit_feedback", channel: "review_card_qr" },
        }),
      });
      if (!res.ok) throw new Error("bad status");
      track("review_feedback_submitted");
      setState({ kind: "success" });
    } catch {
      setState({
        kind: "error",
        message: "Something went wrong on our end. Please call us on (978) 883-4026.",
      });
    }
  }

  if (state.kind === "success") {
    return (
      <p className="text-base text-charcoal-black">
        <strong>Thank you — this came straight to us.</strong> A person reads every one of
        these, and you&apos;ll hear back.
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <input
          id="rf-name" aria-label="Your name (optional)"
          name="name" type="text" autoComplete="name" placeholder="Your name (optional)"
          className="w-full rounded-lg border border-border bg-white px-4 py-3 text-base text-charcoal-black placeholder:text-text-muted"
        />
        <input
          id="rf-email" aria-label="Your email address"
          name="email" type="email" autoComplete="email" required placeholder="Email"
          className="w-full rounded-lg border border-border bg-white px-4 py-3 text-base text-charcoal-black placeholder:text-text-muted"
        />
      </div>
      <textarea
        id="rf-message" aria-label="Tell us what happened"
        name="message" required rows={4} maxLength={2000}
        placeholder="What happened? Good or bad — we'd rather know."
        className="w-full rounded-lg border border-border bg-white px-4 py-3 text-base text-charcoal-black placeholder:text-text-muted"
      />
      <input
        type="text" name="website" tabIndex={-1} autoComplete="off"
        aria-label="Leave this field empty"
        aria-hidden="true" className="hidden"
      />
      {state.kind === "error" && (
        <p role="alert" className="text-sm font-medium text-rustic-brown">{state.message}</p>
      )}
      <button
        type="submit" disabled={state.kind === "submitting"}
        className="w-full rounded-full bg-charcoal-black px-6 py-3 text-base font-semibold text-white disabled:opacity-60 sm:w-auto"
      >
        {state.kind === "submitting" ? "Sending…" : "Send it to us"}
      </button>
    </form>
  );
}
