// Founder note — first-person from Eddie. Adds a brief "where we are" status
// line and a soft-CTA reference to the waitlist + 10% founder discount so the
// flow from "story" to "join the list" is unbroken.

export function FounderNote() {
  return (
    <section
      id="from-eddie"
      className="bg-warm-beige px-6 py-20 sm:py-24"
    >
      <div className="mx-auto max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-rustic-brown">
          A note from Eddie
        </p>

        <div className="mt-6 space-y-5 text-lg leading-relaxed text-charcoal-black sm:text-xl">
          <p>Hi — I&apos;m Eddie.</p>
          <p>
            After a long road, we&apos;re almost ready. Eddie&apos;s Flowers
            Dispensary opens Summer 2026 at 23 Rindge State Road, right here in
            Ashburnham.
          </p>
          <p>
            I built this place because I wanted somewhere folks could walk in,
            ask real questions, and find something that actually works for them.
            No pressure. No marketing-speak. Just good flowers, honest answers,
            and a friendly conversation.
          </p>
          <p>
            <a href="#waitlist" className="text-leaf-green underline decoration-leaf-green/40 underline-offset-4 hover:decoration-leaf-green">
              Join the waitlist
            </a>{" "}
            and I&apos;ll send you a 10% founder-discount code the day we open. No
            spam, no list-selling — just one note from me when the doors open.
          </p>
        </div>

        <p
          className="mt-8 text-2xl font-bold italic text-leaf-green sm:text-3xl"
          style={{
            fontFamily:
              "'Brush Script MT', 'Snell Roundhand', 'Apple Chancery', cursive",
          }}
        >
          — Eddie
        </p>
      </div>
    </section>
  );
}
