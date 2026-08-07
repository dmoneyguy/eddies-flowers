// Location preview — premium dark section. Now surfaces hours, phone, email
// alongside the address so the page works as a self-contained "Visit us"
// card for users + crawlers.

import Image from "next/image";
import {
  STREET_ADDRESS,
  ADDRESS_LOCALITY,
  ADDRESS_REGION,
  POSTAL_CODE,
  ADDRESS_FULL,
  PHONE_DISPLAY,
  PHONE_TEL_HREF,
  CONTACT_EMAIL,
  CONTACT_EMAIL_HREF,
  HOURS_DISPLAY,
  HOURS_DAYS_DISPLAY,
} from "@/lib/contact";

const LICENSE_NUMBER = process.env.NEXT_PUBLIC_LICENSE_NUMBER || "MRN284579";

export function LocationPreview() {
  const mapsUrl = `https://www.google.com/maps?q=${encodeURIComponent(ADDRESS_FULL)}&output=embed`;
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(ADDRESS_FULL)}`;

  return (
    <section
      id="visit"
      className="relative isolate overflow-hidden bg-charcoal-deep px-6 py-24 sm:py-32"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(circle at 10% 0%, rgba(115,190,68,0.10), transparent 50%), radial-gradient(circle at 100% 100%, rgba(255,208,15,0.05), transparent 60%)",
        }}
      />

      <div className="mx-auto grid max-w-6xl gap-14 lg:grid-cols-2 lg:items-center">
        <div data-reveal>
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-leaf-green-soft">
            Where to find us
          </p>
          <h2 className="display mt-4 text-balance text-4xl font-medium text-white sm:text-5xl">
            Visit us when{" "}
            <span className="italic font-light text-leaf-green-soft">
              we open
            </span>
            .
          </h2>

          {/* Address */}
          <div className="mt-10 flex items-start gap-4">
            <Image
              src="/icons/location.svg"
              alt=""
              width={28}
              height={28}
              className="mt-1 brightness-0 invert"
              aria-hidden="true"
            />
            <div>
              <p className="text-xl font-semibold text-white">
                Eddie&apos;s Flowers Dispensary
              </p>
              <p className="mt-1 text-white/70">{STREET_ADDRESS}</p>
              <p className="text-white/70">
                {ADDRESS_LOCALITY}, {ADDRESS_REGION} {POSTAL_CODE}
              </p>
            </div>
          </div>

          {/* Hours · Phone · Email — three-up info strip */}
          <dl className="mt-8 grid gap-x-8 gap-y-5 sm:grid-cols-3">
            <div>
              <dt className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/40">
                Planned Hours
              </dt>
              <dd className="mt-1 text-sm font-medium text-white">
                {HOURS_DISPLAY}
              </dd>
              <dd className="text-xs text-white/55">{HOURS_DAYS_DISPLAY}</dd>
            </div>
            <div>
              <dt className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/40">
                Phone
              </dt>
              <dd className="mt-1">
                <a
                  href={PHONE_TEL_HREF}
                  className="inline-flex min-h-11 items-center text-sm font-medium text-white hover:text-leaf-green-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf-green"
                >
                  {PHONE_DISPLAY}
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/40">
                Email
              </dt>
              <dd className="mt-1">
                <a
                  href={CONTACT_EMAIL_HREF}
                  className="inline-flex min-h-11 items-center break-all text-sm font-medium text-white hover:text-leaf-green-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf-green"
                >
                  {CONTACT_EMAIL}
                </a>
              </dd>
            </div>
          </dl>

          <a
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-10 inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white transition-colors hover:border-leaf-green-soft hover:text-leaf-green-soft"
          >
            Get directions
            <span aria-hidden="true">→</span>
          </a>

          <div className="mt-10 inline-flex items-center gap-3 rounded-full border border-leaf-green/30 bg-leaf-green/10 px-4 py-2">
            <span
              className="flex h-5 w-5 items-center justify-center rounded-full bg-leaf-green text-[10px] font-bold text-white"
              aria-hidden="true"
            >
              ✓
            </span>
            <span className="text-xs font-medium text-white/80">
              MA Licensed Adult-Use Retailer ·{" "}
              <span className="font-mono text-white">{LICENSE_NUMBER}</span>{" "}
              <span className="text-white/50">(Provisional)</span>
            </span>
          </div>
        </div>

        <div
          data-reveal
          className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-2xl"
        >
          <div className="absolute left-4 top-4 z-10 rounded-full bg-white/95 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-charcoal-deep shadow-md">
            Opening Soon
          </div>
          <iframe
            src={mapsUrl}
            title="Map showing Eddie's Flowers Dispensary at 23 Rindge State Road, Ashburnham, MA"
            width="100%"
            height="380"
            style={{ border: 0 }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </div>
      </div>
    </section>
  );
}
