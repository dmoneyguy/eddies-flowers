"use client";

// Shared lead-capture form used by /careers, /wholesale, and /press.
// Same UX as the main waitlist but with role-specific copy + message field.
// Posts to /api/lead with a source param matching the schema enum.

import { useState, type FormEvent } from "react";
import { track } from "@vercel/analytics";

export type LeadSource = "careers" | "wholesale_inquiry" | "contact_form";

type State =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "success" }
  | { kind: "error"; message: string };

interface LeadFormProps {
  source: LeadSource;
  submitLabel: string;
  successHeading: string;
  successBody: string;
  /** Optional placeholder for the message textarea */
  messagePlaceholder?: string;
  /** Whether the message field is required */
  messageRequired?: boolean;
  /** Optional company/org field — when set, adds a field labeled with this string */
  orgLabel?: string;
}

export function LeadForm({
  source,
  submitLabel,
  successHeading,
  successBody,
  messagePlaceholder = "Anything we should know?",
  messageRequired = false,
  orgLabel,
}: LeadFormProps) {
  const [state, setState] = useState<State>({ kind: "idle" });

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (state.kind === "submitting") return;

    const form = e.currentTarget;
    const fd = new FormData(form);
    const name = String(fd.get("name") || "").trim();
    const email = String(fd.get("email") || "").trim();
    const phone = String(fd.get("phone") || "").trim();
    const message = String(fd.get("message") || "").trim();
    const org = String(fd.get("org") || "").trim();
    const website = String(fd.get("website") || ""); // honeypot

    if (!name) {
      setState({ kind: "error", message: "Your name is required." });
      return;
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setState({ kind: "error", message: "Please enter a valid email address." });
      return;
    }
    if (messageRequired && !message) {
      setState({ kind: "error", message: "Please add a quick message." });
      return;
    }
    if (website) {
      setState({ kind: "success" });
      return;
    }

    setState({ kind: "submitting" });

    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ source, name, email, phone, message, org, website }),
      });

      const data: { ok?: boolean; error?: string } = await res
        .json()
        .catch(() => ({ ok: false, error: "Network error" }));

      if (res.ok && data.ok) {
        try {
          track("lead_submit", { source });
        } catch {
          // best-effort
        }
        setState({ kind: "success" });
        form.reset();
      } else {
        setState({
          kind: "error",
          message: data.error || "Something went wrong. Please try again.",
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
        <p className="text-2xl font-bold text-charcoal-black">{successHeading}</p>
        <p className="mt-3 text-base text-charcoal-black/80">{successBody}</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4">
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
        <label htmlFor={`website-${source}`}>
          Leave this field empty
          <input
            type="text"
            id={`website-${source}`}
            name="website"
            tabIndex={-1}
            autoComplete="off"
          />
        </label>
      </div>

      <div>
        <label htmlFor={`name-${source}`} className="mb-2 block text-sm font-semibold text-charcoal-black">
          Your name
        </label>
        <input
          type="text"
          id={`name-${source}`}
          name="name"
          required
          autoComplete="name"
          maxLength={120}
          className="w-full rounded-lg border-2 border-charcoal-black/15 bg-white px-4 py-3 text-base text-charcoal-black placeholder:text-charcoal-black/40 focus:border-leaf-green focus:outline-none"
        />
      </div>

      {orgLabel && (
        <div>
          <label htmlFor={`org-${source}`} className="mb-2 block text-sm font-semibold text-charcoal-black">
            {orgLabel}
          </label>
          <input
            type="text"
            id={`org-${source}`}
            name="org"
            autoComplete="organization"
            maxLength={200}
            className="w-full rounded-lg border-2 border-charcoal-black/15 bg-white px-4 py-3 text-base text-charcoal-black placeholder:text-charcoal-black/40 focus:border-leaf-green focus:outline-none"
          />
        </div>
      )}

      <div>
        <label htmlFor={`email-${source}`} className="mb-2 block text-sm font-semibold text-charcoal-black">
          Email
        </label>
        <input
          type="email"
          id={`email-${source}`}
          name="email"
          required
          autoComplete="email"
          maxLength={254}
          className="w-full rounded-lg border-2 border-charcoal-black/15 bg-white px-4 py-3 text-base text-charcoal-black placeholder:text-charcoal-black/40 focus:border-leaf-green focus:outline-none"
        />
      </div>

      <div>
        <label htmlFor={`phone-${source}`} className="mb-2 block text-sm font-semibold text-charcoal-black">
          Phone <span className="font-normal text-charcoal-black/50">(optional)</span>
        </label>
        <input
          type="tel"
          id={`phone-${source}`}
          name="phone"
          autoComplete="tel"
          maxLength={20}
          inputMode="tel"
          className="w-full rounded-lg border-2 border-charcoal-black/15 bg-white px-4 py-3 text-base text-charcoal-black placeholder:text-charcoal-black/40 focus:border-leaf-green focus:outline-none"
        />
      </div>

      <div>
        <label htmlFor={`message-${source}`} className="mb-2 block text-sm font-semibold text-charcoal-black">
          Message {messageRequired ? "" : <span className="font-normal text-charcoal-black/50">(optional)</span>}
        </label>
        <textarea
          id={`message-${source}`}
          name="message"
          rows={4}
          maxLength={2000}
          placeholder={messagePlaceholder}
          className="w-full rounded-lg border-2 border-charcoal-black/15 bg-white px-4 py-3 text-base text-charcoal-black placeholder:text-charcoal-black/40 focus:border-leaf-green focus:outline-none"
        />
      </div>

      <button
        type="submit"
        disabled={state.kind === "submitting"}
        className="w-full rounded-full bg-leaf-green px-6 py-4 text-base font-semibold text-white shadow-sm transition-colors hover:bg-leaf-green/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf-green disabled:cursor-not-allowed disabled:opacity-60 sm:text-lg"
      >
        {state.kind === "submitting" ? "Sending…" : submitLabel}
      </button>

      {state.kind === "error" && (
        <p role="alert" className="text-sm font-medium text-red-700">
          {state.message}
        </p>
      )}

      <p className="text-xs text-charcoal-black/60">
        We respect your privacy. Your info will only be used to follow up about this inquiry.
      </p>
    </form>
  );
}
