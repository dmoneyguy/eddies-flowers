// Founder note — first-person from Eddie, country-store warm.
// Single block of prose, no founder photo per v1 spec — typography + the
// hand-signed "Eddie" sign-off carry the personal feel. Warm-beige background
// gives the section a "letter on cream paper" quality.

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
            After a long road, we&apos;re almost ready. Eddie&apos;s Flowers Dispensary
            opens soon at 23 Rindge State Road, right here in Ashburnham.
          </p>
          <p>
            I built this place because I wanted somewhere folks could walk in,
            ask real questions, and find something that actually works for them.
            No pressure. No marketing-speak. Just good flowers, honest answers,
            and a friendly conversation.
          </p>
          <p>
            Drop your email below if you want to be there when the doors open —
            I&apos;ll let you know.
          </p>
        </div>

        <p
          className="mt-8 text-2xl font-bold italic text-leaf-green sm:text-3xl"
          style={{
            // Hand-signed feel without shipping a script font for one word.
            // Falls back gracefully if the user has a cursive system font.
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
