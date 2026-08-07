// Values — three short cards. Sits between the marquee and the founder note.
// Communicates the brand stance without marketing-speak. Glassmorphic on the
// charcoal canvas so it doesn't compete with the warm founder note next.

import Image from "next/image";

const VALUES = [
  {
    icon: "/icons/flower-bud.svg",
    title: "Curated, not stocked",
    body: "Every SKU on our shelf is one we'd hand to a friend. Quiet menu, quality over quantity.",
  },
  {
    icon: "/icons/trusted.svg",
    title: "Honest answers",
    body: "Real questions get real answers. No upsell, no scripts — just folks who actually know the flower.",
  },
  {
    // Was email.svg — an envelope, which means "contact us", on a card that is
    // about being local. location.svg is the pin, which is what it should have
    // been all along.
    icon: "/icons/location.svg",
    title: "Built for Ashburnham",
    body: "Run by locals in North Worcester County. We want to be your neighbor — your favorite Tuesday-afternoon errand.",
  },
];

export function Values() {
  return (
    <section className="relative isolate overflow-hidden bg-charcoal-deep px-6 py-24 sm:py-32">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(circle at 50% 0%, rgba(115,190,68,0.10), transparent 55%)",
        }}
      />

      <div data-reveal className="mx-auto max-w-2xl text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.32em] text-leaf-green-soft">
          What you&apos;ll find
        </p>
        <h2 className="display mt-4 text-balance text-4xl font-medium text-white sm:text-5xl">
          A different kind of{" "}
          <span className="italic font-light text-leaf-green-soft">dispensary</span>.
        </h2>
      </div>

      <div className="mx-auto mt-14 grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {VALUES.map((v, i) => (
          <div
            key={v.title}
            data-reveal
            style={{ transitionDelay: `${i * 80}ms` }}
            className="value-card relative overflow-hidden rounded-3xl p-8"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-leaf-green/15">
              <Image
                src={v.icon}
                alt=""
                width={24}
                height={24}
                className="brightness-0 invert"
                aria-hidden="true"
              />
            </div>
            <h3 className="display mt-6 text-2xl font-medium text-white">
              {v.title}
            </h3>
            <p className="mt-3 text-base leading-relaxed text-white/65">
              {v.body}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
