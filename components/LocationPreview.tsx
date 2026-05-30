// Location preview — address + small Google Maps embed.
// Maps embed uses the public "embed" URL (no API key required for basic embeds).
// CSP in next.config.ts already allowlists maps.google.com / www.google.com in frame-src.

import Image from "next/image";

export function LocationPreview() {
  const address = "23 Rindge State Road, Ashburnham, MA 01430";
  const mapsUrl = `https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`;
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;

  return (
    <section id="visit" className="bg-charcoal-black px-6 py-20 sm:py-24">
      <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-leaf-green">
            Where to find us
          </p>
          <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
            Visit us when we open.
          </h2>

          <div className="mt-8 flex items-start gap-4">
            <Image
              src="/icons/location.svg"
              alt=""
              width={28}
              height={28}
              className="mt-1 brightness-0 invert"
              aria-hidden="true"
            />
            <div>
              <p className="text-lg font-semibold text-white">Eddie&apos;s Flowers Dispensary</p>
              <p className="mt-1 text-white/70">23 Rindge State Road</p>
              <p className="text-white/70">Ashburnham, MA 01430</p>
            </div>
          </div>

          <a
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 rounded-full border-2 border-white/20 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:border-leaf-green hover:text-leaf-green"
          >
            Get directions
            <span aria-hidden="true">→</span>
          </a>
        </div>

        <div className="overflow-hidden rounded-2xl border-2 border-white/10 bg-white/5 shadow-lg">
          <iframe
            src={mapsUrl}
            title="Map showing 23 Rindge State Road, Ashburnham, MA"
            width="100%"
            height="320"
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
