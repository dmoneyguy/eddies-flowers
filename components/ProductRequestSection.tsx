// Product-request section — pre-launch customer feedback. Wraps the client form
// in a server-rendered shell (heading + microcopy) matching WaitlistSection.

import { ProductRequestForm } from "./ProductRequestForm";

export function ProductRequestSection() {
  return (
    <section id="requests" className="bg-leaf-green/5 px-6 py-20 sm:py-24">
      <div className="mx-auto max-w-xl">
        <p className="text-center text-sm font-semibold uppercase tracking-[0.2em] text-leaf-green">
          Help us stock the shelves
        </p>
        <h2 className="mt-3 text-center text-3xl font-bold text-charcoal-black sm:text-4xl">
          What do you want us to carry?
        </h2>
        <p className="mt-3 text-center text-base text-charcoal-black/70">
          We&apos;re building our opening menu around our neighbors. Tell us the products and brands
          you&apos;d love to see — it genuinely shapes what&apos;s on the shelf day one.
        </p>

        <div className="mt-8">
          <ProductRequestForm />
        </div>
      </div>
    </section>
  );
}
