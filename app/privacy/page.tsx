// Privacy Policy.
//
// THIS PAGE MUST DESCRIBE THE FORMS AS THEY ACTUALLY ARE. 935 CMR
// 500.105(4)(b)1 prohibits anything false or misleading, and a privacy policy
// that claims there is only one form and that nothing is shared, while the
// forms forward opted-in contacts to Legacy Operations, is exactly that. If a
// form, a field, a consent box or a destination changes, change this page in
// the same PR:
//   components/WaitlistForm.tsx        -> /api/waitlist
//   components/ProductRequestForm.tsx  -> /api/product-request
//   components/CareersForm.tsx         -> /api/lead (source: careers)
//   components/LeadForm.tsx            -> /api/lead (wholesale_inquiry, contact_form)
//   components/ReviewFeedbackForm.tsx  -> /api/lead (contact_form, post-visit feedback)
//   lib/age-gate.ts + /api/age-gate    -> age-gate attestation + cookies

import Link from "next/link";

export const metadata = { title: "Privacy Policy" };

const h2 = "mt-10 text-2xl font-bold";
const h3 = "mt-6 text-lg font-semibold";
const p = "mt-3 leading-relaxed";
const ul = "mt-3 list-disc space-y-1 pl-6 leading-relaxed";
const a = "text-leaf-green-deep underline hover:no-underline";

export default function PrivacyPage() {
  return (
    <main id="main" className="bg-white px-6 py-16">
      <article className="prose prose-charcoal mx-auto max-w-2xl text-charcoal-black">
        <h1 className="text-4xl font-bold">Privacy Policy</h1>
        <p className="mt-2 text-sm text-charcoal-black/60">
          Last updated: September 24, 2026
        </p>

        <h2 className={h2}>Who we are</h2>
        <p className={p}>
          Eddie&apos;s Flowers Dispensary (&quot;Eddie&apos;s Flowers,&quot; &quot;we,&quot;
          &quot;us&quot;) is a Massachusetts-licensed adult-use marijuana retailer (License
          #MR284579, Provisional) preparing to open at 23 Rindge State Road, Ashburnham, MA
          01430. This site is operated by Legacy Operations on behalf of Eddie&apos;s Flowers,
          Inc.
        </p>

        <h2 className={h2}>What we collect, form by form</h2>
        <p className={p}>
          We only collect what you type into a form, plus a few technical details captured
          automatically when you submit one. There are six forms on this site.
        </p>

        <h3 className={h3}>1. Grand Opening invitation (home page)</h3>
        <ul className={ul}>
          <li>Your name (optional)</li>
          <li>Your email address and/or mobile phone number (at least one is required)</li>
          <li>
            An email opt-in box, ticked by default, that reads: &quot;Keep me in the loop —
            email me news, events, and updates from Eddie&apos;s Flowers and the Legacy
            Operations family of brands that powers this site. I can unsubscribe
            anytime.&quot; You can untick it before you submit.
          </li>
          <li>
            A separate text-message opt-in box, never ticked by default, for occasional texts
            from Eddie&apos;s Flowers and Legacy Operations. Message and data rates may apply;
            reply STOP to opt out.
          </li>
        </ul>

        <h3 className={h3}>2. Product request (home page and /menu)</h3>
        <ul className={ul}>
          <li>The product or brand you want us to carry (required)</li>
          <li>A brand and a category (optional)</li>
          <li>Your email address and mobile number (both optional)</li>
          <li>
            The same email opt-in box as above, ticked by default and used only if you leave
            an email, and the same text-message opt-in box, never ticked by default.
          </li>
        </ul>

        <h3 className={h3}>3. Careers application (/careers)</h3>
        <ul className={ul}>
          <li>Your name, email address and phone number (phone optional)</li>
          <li>The roles you&apos;re interested in, your availability and your experience</li>
          <li>Whether you live in Massachusetts and whether you are 21 or older</li>
          <li>A short answer to &quot;Why Eddie&apos;s Flowers?&quot; (optional)</li>
        </ul>

        <h3 className={h3}>4. Wholesale and brand inquiry (/wholesale)</h3>
        <ul className={ul}>
          <li>Your name, brand or company, email address and phone number (phone optional)</li>
          <li>Your message</li>
        </ul>

        <h3 className={h3}>5. Press inquiry (/press)</h3>
        <ul className={ul}>
          <li>Your name, publication or outlet, email address and phone number (phone optional)</li>
          <li>Your message</li>
        </ul>

        <h3 className={h3}>6. Visit feedback (/review)</h3>
        <ul className={ul}>
          <li>Your name (optional), your email address and your message</li>
        </ul>

        <h3 className={h3}>Captured automatically when you submit any form</h3>
        <ul className={ul}>
          <li>Your IP address and browser user-agent (for spam prevention)</li>
          <li>The page you submitted from, and the date and time</li>
          <li>
            For the invitation and product-request forms, the exact wording of each opt-in
            box you saw and whether you ticked it, so we can show what you agreed to
          </li>
        </ul>

        <h3 className={h3}>The age check</h3>
        <p className={p}>
          When you click &quot;I&apos;m 21 or older,&quot; we record a random session code,
          your confirmation that you are 21 or older, your IP address, your browser
          user-agent and an expiry date, and we set a cookie called <code>ef_age_ok</code>{" "}
          that lasts 30 days so you are not asked again. If you click &quot;I&apos;m under
          21,&quot; we set a cookie called <code>ef_age_denied</code> that lasts until you
          close your browser. Both are first-party cookies needed for the site to work.
        </p>

        <h3 className={h3}>Analytics and third-party content</h3>
        <p className={p}>
          We do <strong>not</strong> use advertising pixels or session-replay tools. We use
          Vercel Web Analytics to count page views and form submissions in aggregate. Pages
          with a map load an embedded Google Map from Google, which is covered by
          Google&apos;s own privacy policy and may set its own cookies.
        </p>

        <h2 className={h2}>How we use it, and who we share it with</h2>
        <ul className={ul}>
          <li>
            <strong>Invitation and product requests.</strong> To send you the Grand Opening
            date and to act on your request. If you leave the email box ticked, we and the
            Legacy Operations family of brands may email you news, events and updates until
            you unsubscribe. If you tick the text box, Eddie&apos;s Flowers and Legacy
            Operations may text you until you reply STOP. Contacts from these two forms are
            added to the customer database run by Legacy Operations, which operates this
            site and those brands, together with your opt-in choices.
          </li>
          <li>
            <strong>Careers, wholesale, press and feedback.</strong> Only to follow up on
            that application, inquiry or message. These are not added to any marketing
            list.
          </li>
          <li>
            <strong>Service providers.</strong> Our website host (Vercel), database (Neon),
            email provider (Resend) and the messaging services Legacy Operations uses to
            send email and texts process this information on our behalf.
          </li>
          <li>
            We do <strong>not</strong> sell or rent your information.
          </li>
        </ul>

        <h2 className={h2}>Where it&apos;s stored</h2>
        <p className={p}>
          Form data is stored in a Postgres database operated by Legacy Operations (hosted on
          Neon, infrastructure in the US). Emails are sent via Resend, a US-based email
          provider.
        </p>

        <h2 className={h2}>Your choices and rights</h2>
        <p className={p}>
          Unsubscribe from any marketing email with the link in it, and reply STOP to any
          text. You can also ask us to delete your information at any time by emailing{" "}
          <a className={a} href="mailto:hello@eddiesflower.com">
            hello@eddiesflower.com
          </a>
          . We&apos;ll remove your record within 30 days and confirm by reply. You can also
          ask for a copy of what we have on you — same email, same turnaround.
        </p>

        <h2 className={h2}>Children</h2>
        <p className={p}>
          This site and Eddie&apos;s Flowers Dispensary are for adults 21 and over. We do not
          knowingly collect information from anyone under 21. If you believe someone under
          21 has provided us with information, email us at the address above and we&apos;ll
          delete it.
        </p>

        <h2 className={h2}>Changes to this policy</h2>
        <p className={p}>
          If we change this policy, we&apos;ll update the &quot;last updated&quot; date at the
          top and post the new version here. Major changes that affect how we use your data
          will be communicated to you by email before they take effect.
        </p>

        <h2 className={h2}>Contact</h2>
        <p className={p}>
          Questions? Email{" "}
          <a className={a} href="mailto:hello@eddiesflower.com">
            hello@eddiesflower.com
          </a>
          . See also our <Link className={a} href="/terms">Terms of Service</Link>.
        </p>
      </article>
    </main>
  );
}
