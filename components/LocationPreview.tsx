// Location preview — darker charcoal, premium framed map, license badge
// alongside the address. Big serif H2 mirrors the hero so the page bookends.

import Image from "next/image";

const LICENSE_NUMBER = process.env.NEXT_PUBLIC_LICENSE_NUMBER || "MRN284579";

export function LocationPreview() {
  const address = "23 Rindge State Road, Ashburnham, MA 01430";
  const mapsUrl = `https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`;
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;

  return (
    <section
      id="visit"
      className="relative isolate overflow-hidden bg-charcoal-deep px-6 py-24 sm:py-32"
    >
      {/* Subtle ambient light from top-left */}
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

          <div className="mt-10 flex items-start gap-4">
            <Image
              src="/icons/location.svg"
              alt=""
              width={32}
              height={32}
              className="mt-1 brightness-0 invert"
              aria-hidden="true"
            />
            <div>
              <p className="text-xl font-semibold text-white">
                Eddie&apos;s Flowers Dispensary
              </p>
              <p className="mt-1 text-white/70">23 Rindge State Road</p>
              <p className="text-white/70">Ashburnham, MA 01430</p>
            </div>
          </div>

          <a
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white transition-colors hover:border-leaf-green-soft hover:text-leaf-green-soft"
          >
            Get directions
            <span aria-hidden="true">→</span>
          </a>

          {/* Compact license badge */}
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
          {/* Map overlay corner badge */}
          <div className="absolute left-4 top-4 z-10 rounded-full bg-white/95 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-charcoal-deep shadow-md">
            Opening Soon
          </div>
          <iframe
            src={mapsUrl}
            title="Map showing 23 Rindge State Road, Ashburnham, MA"
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
