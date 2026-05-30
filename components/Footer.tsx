// Footer — visible on every page. License + MA compliance disclosure + Legacy attribution.
// Compliance language is the 2025 MA CCC boilerplate; will re-verify against
// masscannabiscontrol.com immediately before Part 8 publish.

import Link from "next/link";

const LICENSE_NUMBER = process.env.NEXT_PUBLIC_LICENSE_NUMBER || "MRN284579";

export function Footer() {
  return (
    <footer className="bg-charcoal-black px-6 py-12 text-white/80">
      <div className="mx-auto max-w-4xl space-y-6 text-sm leading-relaxed">
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
        <div className="flex flex-wrap gap-x-6 gap-y-2 border-t border-white/10 pt-6">
          <Link className="hover:text-leaf-green" href="/privacy">Privacy</Link>
          <Link className="hover:text-leaf-green" href="/terms">Terms</Link>
          <Link className="hover:text-leaf-green" href="/accessibility">Accessibility</Link>
        </div>
        <p className="text-white/40">Operated by Legacy Operations.</p>
      </div>
    </footer>
  );
}
