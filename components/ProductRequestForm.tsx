"use client";

// Pre-launch customer feedback form — locals tell us which products & brands they
// want us to carry. POSTs to /api/product-request. Mirrors WaitlistForm patterns
// (honeypot, state machine, friendly states).

import { useState, type FormEvent } from "react";

type State =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "success" }
  | { kind: "error"; message: string };

const CATEGORIES = [
  "Flower",
  "Pre-rolls",
  "Vapes & Cartridges",
  "Concentrates",
  "Edibles",
  "Beverages",
  "Topicals",
  "Tinctures",
  "Accessories",
  "Other",
];

const inputCls =
  "w-full rounded-lg border-2 border-charcoal-black/15 bg-white px-4 py-3 text-base text-charcoal-black placeholder:text-charcoal-black/40 focus:border-leaf-green focus:outline-none";
const labelCls = "mb-2 block text-sm font-semibold text-charcoal-black";

export function ProductRequestForm() {
  const [state, setState] = useState<State>({ kind: "idle" });

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (state.kind === "submitting") return;

    const form = e.currentTarget;
    const fd = new FormData(form);
    const product = String(fd.get("product") || "").trim();
    const brand = String(fd.get("brand") || "").trim();
    const category = String(fd.get("category") || "").trim();
    const email = String(fd.get("email") || "").trim();
    const phone = String(fd.get("phone") || "").trim();
    const website = String(fd.get("website") || ""); // honeypot
    const marketingOptIn = fd.get("marketing_opt_in") === "on";
    const smsOptIn = fd.get("sms_opt_in") === "on";

    if (!product) {
      setState({ kind: "error", message: "Tell us at least one product or brand you'd like." });
      return;
    }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setState({ kind: "error", message: "That email doesn't look right — or leave it blank." });
      return;
    }
    if (smsOptIn && phone.replace(/\D/g, "").length < 10) {
      setState({ kind: "error", message: "Add your mobile number so we can text you — or uncheck the text option." });
      return;
    }
    if (website) {
      setState({ kind: "success" }); // bot — fake success
      return;
    }

    setState({ kind: "submitting" });
    try {
      const res = await fetch("/api/product-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product, brand, category, email, phone, website, marketing_opt_in: marketingOptIn, sms_opt_in: smsOptIn }),
      });
      const data: { ok?: boolean; error?: string } = await res
        .json()
        .catch(() => ({ ok: false, error: "Network error" }));
      if (res.ok && data.ok) {
        setState({ kind: "success" });
        form.reset();
      } else {
        setState({ kind: "error", message: data.error || "Something went wrong. Please try again." });
      }
    } catch {
      setState({ kind: "error", message: "Couldn't reach the server. Check your connection and try again." });
    }
  }

  if (state.kind === "success") {
    return (
      <div
        role="status"
        aria-live="polite"
        className="rounded-2xl border-2 border-leaf-green/30 bg-leaf-green/10 p-8 text-center"
      >
        <p className="text-2xl font-bold text-charcoal-black">Got it — thank you!</p>
        <p className="mt-2 text-charcoal-black/70">
          We&apos;re building our opening menu around what our neighbors actually want. If we bring
          it in, we&apos;ll let you know.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4" aria-describedby="request-microcopy">
      {/* Honeypot */}
      <div
        aria-hidden="true"
        style={{ position: "absolute", left: "-9999px", top: "auto", width: "1px", height: "1px", overflow: "hidden" }}
      >
        <label htmlFor="pr-website">
          Leave this field empty
          <input type="text" id="pr-website" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div>
        <label htmlFor="product" className={labelCls}>
          Product or brand you want <span className="font-normal text-charcoal-black/50">(required)</span>
        </label>
        <input
          type="text"
          id="product"
          name="product"
          required
          maxLength={300}
          className={inputCls}
          placeholder="e.g. a specific strain, a favorite brand, high-CBD gummies…"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="brand" className={labelCls}>
            Brand <span className="font-normal text-charcoal-black/50">(optional)</span>
          </label>
          <input type="text" id="brand" name="brand" maxLength={200} className={inputCls} placeholder="Any brand you love" />
        </div>
        <div>
          <label htmlFor="category" className={labelCls}>
            Category <span className="font-normal text-charcoal-black/50">(optional)</span>
          </label>
          <select id="category" name="category" defaultValue="" className={inputCls}>
            <option value="">Pick one…</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="pr-email" className={labelCls}>
          Your email <span className="font-normal text-charcoal-black/50">(optional — so we can tell you when it&apos;s in)</span>
        </label>
        <input type="email" id="pr-email" name="email" autoComplete="email" maxLength={254} className={inputCls} placeholder="you@example.com" />
      </div>

      <div>
        <label htmlFor="pr-phone" className={labelCls}>
          Mobile number <span className="font-normal text-charcoal-black/50">(optional — needed only if you want texts)</span>
        </label>
        <input type="tel" id="pr-phone" name="phone" autoComplete="tel" maxLength={40} className={inputCls} placeholder="(978) 555-0123" />
      </div>

      <label htmlFor="pr-marketing" className="flex items-start gap-3 rounded-lg bg-charcoal-black/[0.03] p-3 text-sm text-charcoal-black/80">
        <input type="checkbox" id="pr-marketing" name="marketing_opt_in" defaultChecked className="mt-0.5 h-5 w-5 shrink-0 accent-leaf-green" />
        <span>
          Keep me in the loop — email me news, events, and updates from Eddie&apos;s Flowers and the
          Legacy Operations family of brands that powers this site. I can unsubscribe anytime.{" "}
          <span className="text-charcoal-black/50">(Only used if you left an email above.)</span>
        </span>
      </label>

      <label htmlFor="pr-sms" className="flex items-start gap-3 rounded-lg bg-charcoal-black/[0.03] p-3 text-sm text-charcoal-black/80">
        <input type="checkbox" id="pr-sms" name="sms_opt_in" className="mt-0.5 h-5 w-5 shrink-0 accent-leaf-green" />
        <span>
          Text me too — occasional texts from Eddie&apos;s Flowers and Legacy Operations about new arrivals and events.{" "}
          <span className="text-charcoal-black/50">Msg &amp; data rates may apply. Reply STOP to opt out.</span>
        </span>
      </label>

      <button
        type="submit"
        disabled={state.kind === "submitting"}
        className="w-full rounded-full bg-leaf-green px-6 py-4 text-base font-semibold text-white shadow-sm transition-colors hover:bg-leaf-green/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf-green disabled:cursor-not-allowed disabled:opacity-60 sm:text-lg"
      >
        {state.kind === "submitting" ? "Sending…" : "Send my request"}
      </button>

      {state.kind === "error" && (
        <p role="alert" className="text-sm font-medium text-red-700">
          {state.message}
        </p>
      )}

      <p id="request-microcopy" className="text-xs text-charcoal-black/60">
        We read every request — it shapes what we stock on day one. We&apos;ll only email you if you
        left an address, and only about this.
      </p>
    </form>
  );
}
