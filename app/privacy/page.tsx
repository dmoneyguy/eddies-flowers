// Privacy Policy — v1 scope. Reviewed by counsel before Part 1G publish.
// Plain-language wherever possible; legal precision where it matters.

import { Footer } from "@/components/Footer";

export const metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <>
      <main id="main" className="bg-white px-6 py-16">
        <article className="prose prose-charcoal mx-auto max-w-2xl text-charcoal-black">
          <h1 className="text-4xl font-bold">Privacy Policy</h1>
          <p className="mt-2 text-sm text-charcoal-black/60">
            Last updated: May 26, 2026
          </p>

          <h2 className="mt-10 text-2xl font-bold">Who we are</h2>
          <p className="mt-3 leading-relaxed">
            Eddie&apos;s Flowers Dispensary (&quot;Eddie&apos;s Flowers,&quot; &quot;we,&quot; &quot;us&quot;) is a
            Massachusetts-licensed adult-use marijuana retailer (License #MR284579,
            Provisional) preparing to open at 23 Rindge State Road, Ashburnham, MA
            01430. This site is operated by Legacy Operations on behalf of Eddie&apos;s
            Flowers, Inc.
          </p>

          <h2 className="mt-8 text-2xl font-bold">What we collect</h2>
          <p className="mt-3 leading-relaxed">
            On this site (eddiesflower.com) we only collect what you give us
            voluntarily. Today that&apos;s a single form: the launch waitlist signup.
            When you submit it, we collect:
          </p>
          <ul className="mt-3 list-disc pl-6 leading-relaxed">
            <li>Your email address (required)</li>
            <li>Your name (optional)</li>
            <li>
              Your IP address and browser user-agent, captured automatically when you
              submit the form (for spam prevention)
            </li>
            <li>The date and time of your signup</li>
          </ul>
          <p className="mt-3 leading-relaxed">
            We do <strong>not</strong> use ad-tracking pixels, third-party cookies, or
            session-replay tools. We use Vercel Analytics in privacy-friendly mode to
            count anonymous page views — no personal data is shared with us by that
            service.
          </p>

          <h2 className="mt-8 text-2xl font-bold">How we use it</h2>
          <ul className="mt-3 list-disc pl-6 leading-relaxed">
            <li>To email you when the dispensary opens (the entire reason for this form).</li>
            <li>To send you opening-related updates if anything changes about the timeline.</li>
            <li>
              We do <strong>not</strong> share, sell, or rent your email address. We do
              <strong> not</strong> add you to a marketing list outside of the
              opening-update purpose described above.
            </li>
          </ul>

          <h2 className="mt-8 text-2xl font-bold">Where it&apos;s stored</h2>
          <p className="mt-3 leading-relaxed">
            Signup data is stored in a Postgres database operated by Legacy Operations
            (hosted on Neon, infrastructure in the US). Emails are sent via Resend
            (US-based transactional email provider).
          </p>

          <h2 className="mt-8 text-2xl font-bold">Your rights</h2>
          <p className="mt-3 leading-relaxed">
            You can ask us to delete your information at any time by emailing{" "}
            <a
              className="text-leaf-green underline hover:no-underline"
              href="mailto:hello@eddiesflower.com"
            >
              hello@eddiesflower.com
            </a>
            . We&apos;ll remove your record within 30 days and confirm by reply. You can
            also ask for a copy of what we have on you — same email, same turnaround.
          </p>

          <h2 className="mt-8 text-2xl font-bold">Children</h2>
          <p className="mt-3 leading-relaxed">
            This site and Eddie&apos;s Flowers Dispensary are for adults 21 and over.
            We do not knowingly collect information from anyone under 21. If you
            believe a child has provided us with information, email us at the address
            above and we&apos;ll delete it.
          </p>

          <h2 className="mt-8 text-2xl font-bold">Changes to this policy</h2>
          <p className="mt-3 leading-relaxed">
            If we change this policy, we&apos;ll update the &quot;last updated&quot; date at the top
            and post the new version here. Major changes that affect how we use your
            data will be communicated to you by email before they take effect.
          </p>

          <h2 className="mt-8 text-2xl font-bold">Contact</h2>
          <p className="mt-3 leading-relaxed">
            Questions? Email{" "}
            <a
              className="text-leaf-green underline hover:no-underline"
              href="mailto:hello@eddiesflower.com"
            >
              hello@eddiesflower.com
            </a>
            .
          </p>
        </article>
      </main>
      <Footer />
    </>
  );
}
