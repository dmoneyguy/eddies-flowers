"use client";

// Vendor intake for opening-day shelf (/wholesale). Posts to /api/vendor-intake.
// Sections: company & licence → contact → products (repeatable, with wholesale price) → reciprocal opportunity →
// marketing support & budget → terms & the Mon 10/19 vendor open house. Everything but company, name, email is optional;
// blanks are stored as "not stated", never zero.

import { useState, type FormEvent, type ReactNode } from "react";
import { track } from "@vercel/analytics";
import {
  FORMS,
  MG_FORMS,
  EFFECTS,
  LICENCE_TYPES,
  EQUITY_TAGS,
  RECIPROCAL_OPTIONS,
  MARKETING_SUPPORT,
  labelFor,
  type Form,
} from "@/lib/vendor-intake";

type State =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "success"; products: number }
  | { kind: "error"; message: string };

interface ProductDraft {
  key: number;
  brand: string;
  product_name: string;
  form: Form;
  size: string;
  potency: string;
  strain_type: string;
  effects: string[];
  wholesale_price: string;
  suggested_retail: string;
  case_pack: string;
}

const inputCls =
  "w-full rounded-lg border-2 border-charcoal-black/15 bg-white px-4 py-3 text-base text-charcoal-black placeholder:text-charcoal-black/40 focus:border-leaf-green focus:outline-none";
const labelCls = "mb-2 block text-sm font-semibold text-charcoal-black";
const hintCls = "font-normal text-charcoal-black/50";

let nextKey = 1;
function blankProduct(form: Form = "flower"): ProductDraft {
  return {
    key: nextKey++,
    brand: "",
    product_name: "",
    form,
    size: "",
    potency: "",
    strain_type: "",
    effects: [],
    wholesale_price: "",
    suggested_retail: "",
    case_pack: "",
  };
}

function Section({ n, title, sub, children }: { n: number; title: string; sub?: string; children: ReactNode }) {
  return (
    <fieldset className="space-y-4 border-t-2 border-charcoal-black/10 pt-6 first:border-t-0 first:pt-0">
      <legend className="text-lg font-extrabold text-charcoal-black">
        <span className="mr-2 text-rustic-brown">{n}.</span>
        {title}
      </legend>
      {sub && <p className="text-sm text-charcoal-black/70">{sub}</p>}
      {children}
    </fieldset>
  );
}

function Checks({
  name,
  values,
  selected,
  onChange,
}: {
  name: string;
  values: readonly string[];
  selected: string[];
  onChange: (next: string[]) => void;
}) {
  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
      {values.map((v) => {
        const on = selected.includes(v);
        return (
          <label
            key={v}
            className={`flex min-h-11 cursor-pointer items-center gap-3 rounded-lg border-2 px-3 py-2 text-sm ${
              on ? "border-leaf-green bg-leaf-green/10" : "border-charcoal-black/15 bg-white"
            }`}
          >
            <input
              type="checkbox"
              name={name}
              value={v}
              checked={on}
              onChange={() => onChange(on ? selected.filter((x) => x !== v) : [...selected, v])}
              className="h-5 w-5 accent-leaf-green"
            />
            <span className="text-charcoal-black">{labelFor(v)}</span>
          </label>
        );
      })}
    </div>
  );
}

function Radios({
  name,
  options,
  value,
  onChange,
}: {
  name: string;
  options: ReadonlyArray<[string, string]>;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map(([v, l]) => (
        <label
          key={v}
          className={`flex min-h-11 cursor-pointer items-center gap-2 rounded-lg border-2 px-4 py-2 text-sm ${
            value === v ? "border-leaf-green bg-leaf-green/10" : "border-charcoal-black/15 bg-white"
          }`}
        >
          <input
            type="radio"
            name={name}
            value={v}
            checked={value === v}
            onChange={() => onChange(v)}
            className="h-5 w-5 accent-leaf-green"
          />
          <span className="text-charcoal-black">{l}</span>
        </label>
      ))}
    </div>
  );
}

function num(v: string): number | null {
  const t = v.replace(/[$,%\s]/g, "");
  if (!t) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

export function VendorIntakeForm() {
  const [state, setState] = useState<State>({ kind: "idle" });
  const [licenceTypes, setLicenceTypes] = useState<string[]>([]);
  const [equity, setEquity] = useState<string[]>([]);
  const [products, setProducts] = useState<ProductDraft[]>([blankProduct()]);
  const [reciprocal, setReciprocal] = useState("");
  const [recipOptions, setRecipOptions] = useState<string[]>([]);
  const [support, setSupport] = useState<string[]>([]);
  const [samples, setSamples] = useState("");
  const [openHouse, setOpenHouse] = useState("");

  const update = (key: number, patch: Partial<ProductDraft>) =>
    setProducts((ps) => ps.map((p) => (p.key === key ? { ...p, ...patch } : p)));

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (state.kind === "submitting") return;
    const fd = new FormData(e.currentTarget);
    const get = (k: string) => String(fd.get(k) || "").trim();

    if (get("nickname")) {
      setState({ kind: "success", products: 0 });
      return;
    }
    const company = get("company_name");
    const name = get("contact_name");
    const email = get("contact_email");
    if (!company) return setState({ kind: "error", message: "Company name is required." });
    if (!name) return setState({ kind: "error", message: "Your name is required." });
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return setState({ kind: "error", message: "Please enter a valid email address." });
    }

    const filled = products.filter((p) => p.product_name.trim());
    const payload = {
      company_name: company,
      brand_names: get("brand_names"),
      licence_numbers: get("licence_numbers"),
      licence_types: licenceTypes,
      social_equity_tags: equity,
      contact_name: name,
      contact_title: get("contact_title"),
      contact_email: email,
      contact_phone: get("contact_phone"),
      website: get("website_url"),
      menu_url: get("menu_url"),
      reciprocal_interest: reciprocal || null,
      reciprocal_options: recipOptions,
      reciprocal_notes: get("reciprocal_notes"),
      marketing_support: support,
      launch_budget_usd: num(get("launch_budget_usd")),
      monthly_budget_usd: num(get("monthly_budget_usd")),
      launch_discount_pct: num(get("launch_discount_pct")),
      marketing_notes: get("marketing_notes"),
      payment_terms: get("payment_terms"),
      moq_notes: get("moq_notes"),
      delivery_notes: get("delivery_notes"),
      samples_available: samples === "" ? null : samples === "yes",
      open_house_plan: openHouse || null,
      notes: get("notes"),
      nickname: "",
      products: filled.map((p) => {
        const mg = MG_FORMS.has(p.form);
        return {
          brand: p.brand.trim() || null,
          product_name: p.product_name.trim(),
          form: p.form,
          size_grams: mg ? null : num(p.size),
          thc_mg: mg ? num(p.size) : null,
          thc_pct: mg || p.form === "topical" ? null : num(p.potency),
          size_label: p.size.trim() ? `${p.size.trim()}${mg ? "mg" : "g"}` : null,
          strain_type: p.strain_type || null,
          effects: p.effects,
          wholesale_price: num(p.wholesale_price),
          suggested_retail: num(p.suggested_retail),
          case_pack: num(p.case_pack),
        };
      }),
    };

    setState({ kind: "submitting" });
    try {
      const res = await fetch("/api/vendor-intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data: { ok?: boolean; error?: string } = await res
        .json()
        .catch(() => ({ ok: false, error: "Network error" }));
      if (res.ok && data.ok) {
        try {
          track("vendor_intake_submit", { products: filled.length });
        } catch {
          // best-effort
        }
        setState({ kind: "success", products: filled.length });
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        setState({ kind: "error", message: data.error || "Something went wrong. Please try again." });
      }
    } catch {
      setState({ kind: "error", message: "Couldn't reach the server. Check your connection and try again." });
    }
  }

  if (state.kind === "success") {
    return (
      <div role="status" aria-live="polite" className="rounded-2xl border-2 border-leaf-green/30 bg-leaf-green/10 p-8 text-center">
        <p className="text-2xl font-bold text-charcoal-black">Got it — your pitch is with our buyers.</p>
        <p className="mt-3 text-base text-charcoal-black/80">
          {state.products > 0
            ? `We received ${state.products} product${state.products === 1 ? "" : "s"}. `
            : ""}
          A confirmation is on its way to your inbox. Vendor open house: Monday 10/19, 12–5 PM, Ashburnham.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-8">
      <div aria-hidden="true" style={{ position: "absolute", left: "-9999px", width: "1px", height: "1px", overflow: "hidden" }}>
        <label htmlFor="vi-nickname">
          Leave this field empty
          <input type="text" id="vi-nickname" name="nickname" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <Section n={1} title="Your company" sub="MA-licensed cultivators, manufacturers, microbusinesses and craft co-ops.">
        <div>
          <label htmlFor="vi-company" className={labelCls}>Company (licensee) name</label>
          <input id="vi-company" name="company_name" required maxLength={200} autoComplete="organization" className={inputCls} />
        </div>
        <div>
          <label htmlFor="vi-brands" className={labelCls}>Brand name(s) <span className={hintCls}>(comma-separated)</span></label>
          <input id="vi-brands" name="brand_names" maxLength={600} className={inputCls} />
        </div>
        <div>
          <label htmlFor="vi-licence" className={labelCls}>CCC license number(s) <span className={hintCls}>(e.g. MP281234)</span></label>
          <input id="vi-licence" name="licence_numbers" maxLength={300} className={inputCls} />
        </div>
        <div>
          <span className={labelCls}>License type</span>
          <Checks name="licence_types" values={LICENCE_TYPES} selected={licenceTypes} onChange={setLicenceTypes} />
        </div>
        <div>
          <span className={labelCls}>Ownership <span className={hintCls}>(optional — we prioritize social equity &amp; local operators)</span></span>
          <Checks name="social_equity_tags" values={EQUITY_TAGS} selected={equity} onChange={setEquity} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="vi-web" className={labelCls}>Website <span className={hintCls}>(optional)</span></label>
            <input id="vi-web" name="website_url" type="url" inputMode="url" maxLength={300} className={inputCls} />
          </div>
          <div>
            <label htmlFor="vi-menu" className={labelCls}>Wholesale menu link <span className={hintCls}>(Apex, LeafLink, Drive…)</span></label>
            <input id="vi-menu" name="menu_url" type="url" inputMode="url" maxLength={500} className={inputCls} />
          </div>
        </div>
      </Section>

      <Section n={2} title="Contact">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="vi-name" className={labelCls}>Your name</label>
            <input id="vi-name" name="contact_name" required maxLength={120} autoComplete="name" className={inputCls} />
          </div>
          <div>
            <label htmlFor="vi-title" className={labelCls}>Title <span className={hintCls}>(optional)</span></label>
            <input id="vi-title" name="contact_title" maxLength={120} autoComplete="organization-title" className={inputCls} />
          </div>
          <div>
            <label htmlFor="vi-email" className={labelCls}>Email</label>
            <input id="vi-email" name="contact_email" type="email" required maxLength={254} autoComplete="email" className={inputCls} />
          </div>
          <div>
            <label htmlFor="vi-phone" className={labelCls}>Phone <span className={hintCls}>(optional)</span></label>
            <input id="vi-phone" name="contact_phone" type="tel" maxLength={30} autoComplete="tel" className={inputCls} />
          </div>
        </div>
      </Section>

      <Section
        n={3}
        title="Products you want on our shelf"
        sub="One row per SKU. Wholesale price per unit is what we price against the shelves around us — the more you fill in, the faster we can say yes."
      >
        {products.map((p, i) => {
          const mg = MG_FORMS.has(p.form);
          return (
            <div key={p.key} className="space-y-3 rounded-xl border-2 border-charcoal-black/10 bg-warm-beige/40 p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-charcoal-black">Product {i + 1}</span>
                {products.length > 1 && (
                  <button
                    type="button"
                    onClick={() => setProducts((ps) => ps.filter((x) => x.key !== p.key))}
                    className="min-h-11 px-2 text-sm font-semibold text-rustic-brown underline"
                  >
                    Remove
                  </button>
                )}
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label htmlFor={`vp-name-${p.key}`} className={labelCls}>Product name</label>
                  <input id={`vp-name-${p.key}`} value={p.product_name} maxLength={200} onChange={(e) => update(p.key, { product_name: e.target.value })} className={inputCls} placeholder="e.g. Gelato #41 3.5g" />
                </div>
                <div>
                  <label htmlFor={`vp-brand-${p.key}`} className={labelCls}>Brand <span className={hintCls}>(if different)</span></label>
                  <input id={`vp-brand-${p.key}`} value={p.brand} maxLength={120} onChange={(e) => update(p.key, { brand: e.target.value })} className={inputCls} />
                </div>
                <div>
                  <label htmlFor={`vp-form-${p.key}`} className={labelCls}>Category</label>
                  <select id={`vp-form-${p.key}`} value={p.form} onChange={(e) => update(p.key, { form: e.target.value as Form })} className={inputCls}>
                    {FORMS.map((f) => <option key={f} value={f}>{labelFor(f)}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor={`vp-size-${p.key}`} className={labelCls}>
                    {mg ? "Total THC per package (mg)" : "Net weight per unit (g)"}
                  </label>
                  <input id={`vp-size-${p.key}`} value={p.size} inputMode="decimal" maxLength={12} onChange={(e) => update(p.key, { size: e.target.value })} className={inputCls} placeholder={mg ? "e.g. 100" : "e.g. 3.5"} />
                </div>
                {!mg && p.form !== "topical" && (
                  <div>
                    <label htmlFor={`vp-thc-${p.key}`} className={labelCls}>THC % <span className={hintCls}>(optional)</span></label>
                    <input id={`vp-thc-${p.key}`} value={p.potency} inputMode="decimal" maxLength={8} onChange={(e) => update(p.key, { potency: e.target.value })} className={inputCls} />
                  </div>
                )}
                <div>
                  <label htmlFor={`vp-strain-${p.key}`} className={labelCls}>Type</label>
                  <select id={`vp-strain-${p.key}`} value={p.strain_type} onChange={(e) => update(p.key, { strain_type: e.target.value })} className={inputCls}>
                    <option value="">—</option>
                    {["indica", "sativa", "hybrid", "cbd", "balanced_ratio"].map((s) => <option key={s} value={s}>{labelFor(s)}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor={`vp-whs-${p.key}`} className={labelCls}>Wholesale price per unit ($)</label>
                  <input id={`vp-whs-${p.key}`} value={p.wholesale_price} inputMode="decimal" maxLength={12} onChange={(e) => update(p.key, { wholesale_price: e.target.value })} className={inputCls} placeholder="e.g. 14.00" />
                </div>
                <div>
                  <label htmlFor={`vp-srp-${p.key}`} className={labelCls}>Suggested retail ($) <span className={hintCls}>(optional)</span></label>
                  <input id={`vp-srp-${p.key}`} value={p.suggested_retail} inputMode="decimal" maxLength={12} onChange={(e) => update(p.key, { suggested_retail: e.target.value })} className={inputCls} />
                </div>
                <div>
                  <label htmlFor={`vp-case-${p.key}`} className={labelCls}>Units per case <span className={hintCls}>(optional)</span></label>
                  <input id={`vp-case-${p.key}`} value={p.case_pack} inputMode="numeric" maxLength={6} onChange={(e) => update(p.key, { case_pack: e.target.value })} className={inputCls} />
                </div>
              </div>
              <div>
                <span className={labelCls}>Best for <span className={hintCls}>(pick any)</span></span>
                <Checks name={`effects-${p.key}`} values={EFFECTS} selected={p.effects} onChange={(next) => update(p.key, { effects: next })} />
              </div>
            </div>
          );
        })}
        {products.length < 40 && (
          <button
            type="button"
            onClick={() => setProducts((ps) => [...ps, blankProduct(ps[ps.length - 1]?.form ?? "flower")])}
            className="min-h-11 w-full rounded-lg border-2 border-dashed border-charcoal-black/25 px-4 py-3 text-base font-semibold text-charcoal-black hover:border-leaf-green"
          >
            + Add another product
          </button>
        )}
      </Section>

      <Section
        n={4}
        title="Reciprocal opportunity"
        sub="Is there a two-way relationship here? Optional — product quality, price and fit for our customers come first."
      >
        <Radios
          name="reciprocal_interest"
          options={[["yes", "Yes"], ["maybe", "Open to talk"], ["no", "No"]]}
          value={reciprocal}
          onChange={setReciprocal}
        />
        <div>
          <span className={labelCls}>What could that look like?</span>
          <Checks name="reciprocal_options" values={RECIPROCAL_OPTIONS} selected={recipOptions} onChange={setRecipOptions} />
        </div>
        <div>
          <label htmlFor="vi-recip-notes" className={labelCls}>Details <span className={hintCls}>(optional)</span></label>
          <textarea id="vi-recip-notes" name="reciprocal_notes" rows={3} maxLength={2000} className={inputCls} placeholder="e.g. we own two stores in Worcester County; we have extraction capacity…" />
        </div>
      </Section>

      <Section
        n={5}
        title="Marketing support & budget"
        sub="What will you put behind your brand on our shelf? Leave blank if you're not sure yet."
      >
        <Checks name="marketing_support" values={MARKETING_SUPPORT} selected={support} onChange={setSupport} />
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label htmlFor="vi-launch" className={labelCls}>Launch budget ($)</label>
            <input id="vi-launch" name="launch_budget_usd" inputMode="decimal" maxLength={12} className={inputCls} />
          </div>
          <div>
            <label htmlFor="vi-monthly" className={labelCls}>Ongoing budget ($/month)</label>
            <input id="vi-monthly" name="monthly_budget_usd" inputMode="decimal" maxLength={12} className={inputCls} />
          </div>
          <div>
            <label htmlFor="vi-disc" className={labelCls}>Opening-order discount (%)</label>
            <input id="vi-disc" name="launch_discount_pct" inputMode="decimal" maxLength={6} className={inputCls} />
          </div>
        </div>
        <div>
          <label htmlFor="vi-mkt-notes" className={labelCls}>Details <span className={hintCls}>(optional)</span></label>
          <textarea id="vi-mkt-notes" name="marketing_notes" rows={3} maxLength={2000} className={inputCls} placeholder="e.g. monthly vendor day, 20% off week one funded by us, budtender training before launch…" />
        </div>
      </Section>

      <Section n={6} title="Terms & next step">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="vi-terms" className={labelCls}>Payment terms</label>
            <input id="vi-terms" name="payment_terms" maxLength={200} className={inputCls} placeholder="e.g. Net 30" />
          </div>
          <div>
            <label htmlFor="vi-moq" className={labelCls}>Minimum order</label>
            <input id="vi-moq" name="moq_notes" maxLength={500} className={inputCls} placeholder="e.g. $1,000 or 1 case per SKU" />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="vi-delivery" className={labelCls}>Delivery <span className={hintCls}>(days, lead time)</span></label>
            <input id="vi-delivery" name="delivery_notes" maxLength={500} className={inputCls} />
          </div>
        </div>
        <div>
          <span className={labelCls}>Samples available?</span>
          <Radios name="samples" options={[["yes", "Yes"], ["no", "No"]]} value={samples} onChange={setSamples} />
        </div>
        <div>
          <span className={labelCls}>Vendor open house — Monday 10/19, 12–5 PM, Ashburnham</span>
          <Radios
            name="open_house_plan"
            options={[["attending", "I'll be there"], ["teams", "Set up a Teams call"], ["neither", "Not yet"]]}
            value={openHouse}
            onChange={setOpenHouse}
          />
        </div>
        <div>
          <label htmlFor="vi-notes" className={labelCls}>Anything else? <span className={hintCls}>(optional)</span></label>
          <textarea id="vi-notes" name="notes" rows={3} maxLength={4000} className={inputCls} />
        </div>
      </Section>

      {state.kind === "error" && (
        <p role="alert" className="rounded-lg border-2 border-red-300 bg-red-50 px-4 py-3 text-sm font-semibold text-red-800">
          {state.message}
        </p>
      )}

      <button
        type="submit"
        disabled={state.kind === "submitting"}
        className="w-full rounded-full bg-leaf-green px-6 py-4 text-base font-semibold text-white shadow-sm transition-colors hover:bg-leaf-green/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf-green disabled:cursor-not-allowed disabled:opacity-60 sm:text-lg"
      >
        {state.kind === "submitting" ? "Sending…" : "Send your pitch"}
      </button>
      <p className="text-center text-xs text-charcoal-black/60">
        For licensed Massachusetts cannabis businesses only. We review every pitch; we don&apos;t sell or share your details.
      </p>
    </form>
  );
}
