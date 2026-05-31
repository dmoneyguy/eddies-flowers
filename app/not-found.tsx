import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Page Not Found",
  description: "This page doesn't exist yet — we're still building.",
};

export default function NotFound() {
  return (
    <main
      id="main"
      className="mesh-canvas relative isolate flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 py-20 text-center"
    >
      <div
        className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center opacity-[0.05]"
        aria-hidden="true"
      >
        <Image
          src="/icons/cannabis-leaf.svg"
          alt=""
          width={900}
          height={900}
          className="scale-150"
        />
      </div>

      <p className="text-xs font-semibold uppercase tracking-[0.32em] text-leaf-green-soft">
        404
      </p>
      <h1 className="display mt-4 text-balance text-5xl font-medium text-white sm:text-7xl">
        We&apos;re still{" "}
        <span className="italic font-light text-leaf-green-soft">building</span>{" "}
        this part.
      </h1>
      <p className="mt-6 max-w-md text-balance text-base text-white/70 sm:text-lg">
        The page you were looking for isn&apos;t here yet — but we&apos;re working on it.
        Eddie&apos;s Flowers Dispensary opens soon in Ashburnham, MA.
      </p>

      <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
        <Link
          href="/"
          className="glow-leaf inline-flex items-center gap-2 rounded-full bg-leaf-green px-7 py-3.5 text-base font-semibold text-white sm:text-lg"
        >
          Back to the home page
          <span aria-hidden="true">→</span>
        </Link>
        <Link
          href="/#waitlist"
          className="inline-flex items-center gap-2 rounded-full border border-white/20 px-7 py-3.5 text-base font-semibold text-white transition-colors hover:border-leaf-green-soft hover:text-leaf-green-soft"
        >
          Join the waitlist
        </Link>
      </div>
    </main>
  );
}
