// Footer — visible on every page. License + MA compliance disclosure + Legacy
// attribution + nav to careers / press / wholesale / legal + contact strip.

import Link from "next/link";
import {
  STREET_ADDRESS,
  ADDRESS_LOCALITY,
  ADDRESS_REGION,
  POSTAL_CODE,
  PHONE_DISPLAY,
  PHONE_TEL_HREF,
  CONTACT_EMAIL,
  CONTACT_EMAIL_HREF,
  HOURS_DISPLAY,
  HOURS_DAYS_DISPLAY,
} from "@/lib/contact";

const LICENSE_NUMBER = process.env.NEXT_PUBLIC_LICENSE_NUMBER || "MRN284579";

export function Footer() {
  return (
    <footer className="bg-charcoal-black px-6 py-12 text-white/80">
      <div className="mx-auto max-w-4xl space-y-8 text-sm leading-relaxed">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-white/40">
              Work with us
            </p>
            <ul className="mt-2 space-y-1">
              <li>
                <Link className="inline-flex min-h-11 items-center hover:text-leaf-green focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf-green" href="/careers">Careers</Link>
              </li>
              <li>
                <Link className="inline-flex min-h-11 items-center hover:text-leaf-green focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf-green" href="/wholesale">Brands &amp; wholesale</Link>
              </li>
              <li>
                <Link className="inline-flex min-h-11 items-center hover:text-leaf-green focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf-green" href="/press">Press inquiries</Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-white/40">
              Contact
            </p>
            <ul className="mt-2 space-y-1">
              <li>
                <a className="inline-flex min-h-11 items-center hover:text-leaf-green focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf-green" href={PHONE_TEL_HREF}>{PHONE_DISPLAY}</a>
              </li>
              <li>
                <a className="break-all inline-flex min-h-11 items-center hover:text-leaf-green focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf-green" href={CONTACT_EMAIL_HREF}>{CONTACT_EMAIL}</a>
              </li>
              <li className="pt-1 text-white/55">{HOURS_DISPLAY}</li>
              <li className="text-white/45">{HOURS_DAYS_DISPLAY}</li>
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-white/40">
              Before you visit
            </p>
            <ul className="mt-2 space-y-1">
              <li>
                <Link className="inline-flex min-h-11 items-center hover:text-leaf-green focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf-green" href="/menu">Menu</Link>
              </li>
              <li>
                <Link className="inline-flex min-h-11 items-center hover:text-leaf-green focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf-green" href="/first-visit">Your first visit</Link>
              </li>
              <li>
                <Link className="inline-flex min-h-11 items-center hover:text-leaf-green focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf-green" href="/faq">Questions</Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-white/40">
              Visit
            </p>
            <p className="mt-2 text-white/70">{STREET_ADDRESS}</p>
            <p className="text-white/70">
              {ADDRESS_LOCALITY}, {ADDRESS_REGION} {POSTAL_CODE}
            </p>
          </div>
        </div>

        <div className="space-y-4 border-t border-white/10 pt-8">
          <p className="font-semibold text-white">
            Eddie&apos;s Flowers — Massachusetts Licensed Adult-Use Marijuana Retailer #
            {LICENSE_NUMBER} (Provisional). For adults 21 and older. Please consume responsibly.
          </p>
          <p className="text-white/60">
            There may be health risks associated with consumption of this product. This product
            has not been analyzed or approved by the Food and Drug Administration (FDA). There is
            limited information on the side effects of using this product, and there may be
            associated health risks. Marijuana use during pregnancy and breast-feeding may pose
            potential harms. It is against the law to drive or operate machinery when under the
            influence of this product. Keep out of reach of children. Marijuana can impair
            concentration, coordination, and judgment. The impairment effects of edibles may be
            delayed by two hours or more. In case of accidental ingestion or overconsumption,
            contact the National Poison Control Center hotline 1-800-222-1222 or call 9-1-1.
            This product may be illegal outside of Massachusetts.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-white/10 pt-6">
          <Link className="inline-flex min-h-11 items-center hover:text-leaf-green focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf-green" href="/faq">FAQ</Link>
          <Link className="inline-flex min-h-11 items-center hover:text-leaf-green focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf-green" href="/privacy">Privacy</Link>
          <Link className="inline-flex min-h-11 items-center hover:text-leaf-green focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf-green" href="/terms">Terms</Link>
          <Link className="inline-flex min-h-11 items-center hover:text-leaf-green focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf-green" href="/accessibility">Accessibility</Link>
          <span className="ml-auto text-white/40">Operated by Legacy Operations.</span>
        </div>
      </div>
    </footer>
  );
}
