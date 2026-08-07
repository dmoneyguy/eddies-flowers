"use client";

// Specialized careers form — captures more structured data than the generic
// LeadForm: which roles they want, availability, years of cannabis/retail
// experience, MA residency, and a short "why Eddie's" answer. All structured
// fields are packed into the metadata JSONB column on submission.

import { useState, type FormEvent } from "react";
import { track } from "@vercel/analytics";

const ROLES = [
  { value: "budtender",       label: "Budtender" },
  { value: "keyholder",       label: "Keyholder / Shift Lead" },
  { value: "cannabis_tech",   label: "Cannabis Tech / Inventory" },
  { value: "compliance",      label: "Compliance & Admin" },
  { value: "delivery",        label: "Delivery / Driver" },
  { value: "security",        label: "Security" },
  { value: "other",           label: "Something else" },
] as const;

const AVAILABILITY = [
  { value: "full_time",       label: "Full-time" },
  { value: "part_time",       label: "Part-time" },
  { value: "either",          label: "Either works" },
  { value: "weekends_only",   label: "Weekends only" },
] as const;

const EXPERIENCE = [
  { value: "none",            label: "No cannabis or retail experience" },
  { value: "retail_only",     label: "Retail experience, no cannabis" },
  { value: "lt_1y",           label: "Cannabis experience — less than a year" },
  { value: "1_to_3y",         label: "Cannabis experience — 1–3 years" },
  { value: "gt_3y",           label: "Cannabis experience — 3+ years" },
] as const;

type State =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "success" }
  | { kind: "error"; message: string };

export function CareersForm() {
  const [state, setState] = useState<State>({ kind: "idle" });
  const [rolesSelected, setRolesSelected] = useState<string[]>([]);

  function toggleRole(value: string) {
    setRolesSelected((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
    );
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (state.kind === "submitting") return;

    const form = e.currentTarget;
    const fd = new FormData(form);
    const name = String(fd.get("name") || "").trim();
    const email = String(fd.get("email") || "").trim();
    const phone = String(fd.get("phone") || "").trim();
    const message = String(fd.get("message") || "").trim();
    const availability = String(fd.get("availability") || "").trim();
    const experience = String(fd.get("experience") || "").trim();
    const maResident = fd.get("ma_resident") === "yes";
    const ageEligible = fd.get("age_eligible") === "yes";
    const website = String(fd.get("website") || "");

    if (!name) {
      setState({ kind: "error", message: "Your name is required." });
      return;
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setState({ kind: "error", message: "Please enter a valid email address." });
      return;
    }
    if (!ageEligible) {
      setState({
        kind: "error",
        message: "MA cannabis retail roles require workers to be 21 or older.",
      });
      return;
    }
    if (rolesSelected.length === 0) {
      setState({
        kind: "error",
        message: "Pick at least one role that interests you.",
      });
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
        body: JSON.stringify({
          source: "careers",
          name,
          email,
          phone,
          message,
          org: "",
          website,
          // Pack structured fields into the lead row's metadata via a
          // custom metadata field. The /api/lead route doesn't currently
          // forward this — we'll route it through the message field
          // for now (concat) AND a dedicated extras field that the route
          // forwards into metadata.
          extras: {
            roles_interested: rolesSelected,
            availability,
            experience,
            ma_resident: maResident,
          },
        }),
      });

      const data: { ok?: boolean; error?: string } = await res
        .json()
        .catch(() => ({ ok: false, error: "Network error" }));

      if (res.ok && data.ok) {
        try {
          track("lead_submit", {
            source: "careers",
            roles: rolesSelected.length,
          });
        } catch {
          // best-effort
        }
        setState({ kind: "success" });
        form.reset();
        setRolesSelected([]);
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
        <p className="text-2xl font-bold text-charcoal-black">
          Thanks — application received.
        </p>
        <p className="mt-3 text-base text-charcoal-black/80">
          We&apos;ll be in touch as we schedule interviews. If you don&apos;t
          hear from us within two weeks, give us a nudge.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      {/* Honeypot */}
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
        <label htmlFor="careers-website">
          Leave this empty
          <input type="text" id="careers-website" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div>
        <label htmlFor="cf-name" className="mb-2 block text-sm font-semibold text-charcoal-black">
          Your name
        </label>
        <input
          id="cf-name"
          type="text"
          name="name"
          required
          autoComplete="name"
          maxLength={120}
          className="w-full rounded-lg border-2 border-charcoal-black/15 bg-white px-4 py-3 text-base text-charcoal-black focus:border-leaf-green focus:outline-none"
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="cf-email" className="mb-2 block text-sm font-semibold text-charcoal-black">
            Email
          </label>
          <input
            id="cf-email"
            type="email"
            name="email"
            required
            autoComplete="email"
            maxLength={254}
            className="w-full rounded-lg border-2 border-charcoal-black/15 bg-white px-4 py-3 text-base text-charcoal-black focus:border-leaf-green focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="cf-phone" className="mb-2 block text-sm font-semibold text-charcoal-black">
            Phone <span className="font-normal text-charcoal-black/50">(optional)</span>
          </label>
          <input
            id="cf-phone"
            type="tel"
            name="phone"
            autoComplete="tel"
            maxLength={20}
            inputMode="tel"
            className="w-full rounded-lg border-2 border-charcoal-black/15 bg-white px-4 py-3 text-base text-charcoal-black focus:border-leaf-green focus:outline-none"
          />
        </div>
      </div>

      <fieldset>
        <legend className="mb-3 text-sm font-semibold text-charcoal-black">
          Roles that interest you
        </legend>
        <div className="grid gap-2 sm:grid-cols-2">
          {ROLES.map((r) => {
            const selected = rolesSelected.includes(r.value);
            return (
              <label
                key={r.value}
                className={
                  "flex cursor-pointer items-center gap-3 rounded-lg border-2 px-4 py-3 text-sm font-medium transition-colors " +
                  (selected
                    ? "border-leaf-green bg-leaf-green/10 text-charcoal-black"
                    : "border-charcoal-black/15 bg-white text-charcoal-black/80 hover:border-leaf-green/50")
                }
              >
                <input
                  type="checkbox"
                  name="roles"
                  value={r.value}
                  checked={selected}
                  onChange={() => toggleRole(r.value)}
                  className="h-4 w-4 accent-leaf-green"
                />
                {r.label}
              </label>
            );
          })}
        </div>
      </fieldset>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="cf-availability" className="mb-2 block text-sm font-semibold text-charcoal-black">
            Availability
          </label>
          <select
            id="cf-availability"
            name="availability"
            required
            className="w-full rounded-lg border-2 border-charcoal-black/15 bg-white px-4 py-3 text-base text-charcoal-black focus:border-leaf-green focus:outline-none"
            defaultValue=""
          >
            <option value="" disabled>Pick one…</option>
            {AVAILABILITY.map((a) => (
              <option key={a.value} value={a.value}>{a.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="cf-experience" className="mb-2 block text-sm font-semibold text-charcoal-black">
            Experience
          </label>
          <select
            id="cf-experience"
            name="experience"
            required
            className="w-full rounded-lg border-2 border-charcoal-black/15 bg-white px-4 py-3 text-base text-charcoal-black focus:border-leaf-green focus:outline-none"
            defaultValue=""
          >
            <option value="" disabled>Pick one…</option>
            {EXPERIENCE.map((x) => (
              <option key={x.value} value={x.value}>{x.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <fieldset>
          <legend className="mb-2 text-sm font-semibold text-charcoal-black">
            Massachusetts resident?
          </legend>
          <div className="flex gap-3">
            <label className="inline-flex items-center gap-2 text-sm text-charcoal-black">
              <input type="radio" name="ma_resident" value="yes" required className="h-4 w-4 accent-leaf-green" />
              Yes
            </label>
            <label className="inline-flex items-center gap-2 text-sm text-charcoal-black">
              <input type="radio" name="ma_resident" value="no" className="h-4 w-4 accent-leaf-green" />
              No
            </label>
          </div>
        </fieldset>
        <fieldset>
          <legend className="mb-2 text-sm font-semibold text-charcoal-black">
            Are you 21+?
          </legend>
          <div className="flex gap-3">
            <label className="inline-flex items-center gap-2 text-sm text-charcoal-black">
              <input type="radio" name="age_eligible" value="yes" required className="h-4 w-4 accent-leaf-green" />
              Yes
            </label>
            <label className="inline-flex items-center gap-2 text-sm text-charcoal-black">
              <input type="radio" name="age_eligible" value="no" className="h-4 w-4 accent-leaf-green" />
              No
            </label>
          </div>
        </fieldset>
      </div>

      <div>
        <label htmlFor="cf-message" className="mb-2 block text-sm font-semibold text-charcoal-black">
          Why Eddie&apos;s Flowers?{" "}
          <span className="font-normal text-charcoal-black/50">(short, no pressure)</span>
        </label>
        <textarea
          id="cf-message"
          name="message"
          rows={4}
          maxLength={2000}
          placeholder="What draws you to working at a local dispensary?"
          className="w-full rounded-lg border-2 border-charcoal-black/15 bg-white px-4 py-3 text-base text-charcoal-black focus:border-leaf-green focus:outline-none"
        />
      </div>

      <button
        type="submit"
        disabled={state.kind === "submitting"}
        className="w-full rounded-full bg-leaf-green px-6 py-4 text-base font-semibold text-white shadow-sm transition-colors hover:bg-leaf-green/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf-green disabled:cursor-not-allowed disabled:opacity-60 sm:text-lg"
      >
        {state.kind === "submitting" ? "Sending…" : "Send my application"}
      </button>

      {state.kind === "error" && (
        <p role="alert" className="text-sm font-medium text-red-700">
          {state.message}
        </p>
      )}

      <p className="text-xs text-charcoal-black/60">
        We respect your privacy. Your application is reviewed by the Eddie&apos;s Flowers
        hiring team. You must be 21+ to work in MA cannabis retail.
      </p>
    </form>
  );
}
