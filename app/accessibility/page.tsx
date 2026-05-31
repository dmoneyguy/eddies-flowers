// Accessibility Statement — v1 scope.

import { Footer } from "@/components/Footer";

export const metadata = { title: "Accessibility Statement" };

export default function AccessibilityPage() {
  return (
    <>
      <main id="main" className="bg-white px-6 py-16">
        <article className="mx-auto max-w-2xl text-charcoal-black">
          <h1 className="text-4xl font-bold">Accessibility Statement</h1>
          <p className="mt-2 text-sm text-charcoal-black/60">
            Last updated: May 26, 2026
          </p>

          <h2 className="mt-10 text-2xl font-bold">Our commitment</h2>
          <p className="mt-3 leading-relaxed">
            Eddie&apos;s Flowers is committed to making this site usable by everyone,
            including people with disabilities. We target conformance with the{" "}
            <a
              className="text-leaf-green underline hover:no-underline"
              href="https://www.w3.org/TR/WCAG21/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Web Content Accessibility Guidelines 2.1, Level AA
            </a>
            .
          </p>

          <h2 className="mt-8 text-2xl font-bold">What we&apos;ve done</h2>
          <ul className="mt-3 list-disc pl-6 leading-relaxed">
            <li>Semantic HTML structure throughout (headings, landmarks, lists)</li>
            <li>Skip-to-content link for keyboard users</li>
            <li>Visible focus rings on all interactive elements</li>
            <li>Color contrast meeting WCAG AA on all body text</li>
            <li>Alt text on meaningful images; decorative images marked aria-hidden</li>
            <li>Form labels associated with inputs and validation messages announced to screen readers</li>
            <li>Respect for the user&apos;s <code>prefers-reduced-motion</code> setting</li>
            <li>Responsive design that works from 320px viewport up to large desktop</li>
          </ul>

          <h2 className="mt-8 text-2xl font-bold">Known limitations</h2>
          <p className="mt-3 leading-relaxed">
            The Google Maps embed on this page is provided by Google and inherits
            Google&apos;s accessibility characteristics. As an alternative, the address
            is available as text on the page and the &quot;Get directions&quot; link opens
            the standard Google Maps page that supports screen readers.
          </p>

          <h2 className="mt-8 text-2xl font-bold">Found a problem?</h2>
          <p className="mt-3 leading-relaxed">
            If you encounter an accessibility barrier on this site, please tell us.
            Email{" "}
            <a
              className="text-leaf-green underline hover:no-underline"
              href="mailto:hello@eddiesflower.com"
            >
              hello@eddiesflower.com
            </a>{" "}
            with a description of the issue and the URL or section where you ran
            into it. We&apos;ll respond within 5 business days and work to resolve the
            issue.
          </p>
        </article>
      </main>
      <Footer />
    </>
  );
}
