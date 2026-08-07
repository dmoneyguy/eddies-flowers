"use client";

// SiteHeader — the site's only navigation.
//
// WHY THIS EXISTS. Until 7 August 2026 this site had no navigation at all:
// no <nav>, no <header>, and the only route links anywhere on the page were
// in the footer, nine phone screens down. Careers, the FAQ, the wholesale and
// press pages were effectively unreachable for anyone who landed on the home
// page — including people arriving specifically to apply for a job.
//
// It replaces the sticky decorative marquee, which occupied 54px of a 844px
// phone viewport permanently to repeat the address. Same pixels, same sticky
// band, but now they navigate. The marquee still runs once, lower down, where
// it reads as brand texture rather than as a fixed toolbar.
//
// Design rules held here:
//   - Transparent over the hero, solid once scrolled. The hero is the strongest
//     thing on the page and a bar sitting on it flattens the first impression.
//   - Tap-to-call is always visible. For a local shop the phone is a primary
//     action, not a footer detail.
//   - Every target is at least 44px. Apple's minimum, and this is phone-first.
//   - The mobile sheet traps focus, closes on Escape, closes on route change,
//     and locks background scroll. A menu that strands a keyboard user is worse
//     than no menu.

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { PHONE_DISPLAY, PHONE_TEL_HREF } from "@/lib/contact";

type NavItem = { href: string; label: string };

const NAV: NavItem[] = [
  { href: "/menu", label: "Menu" },
  { href: "/first-visit", label: "First visit" },
  { href: "/#visit", label: "Visit" },
  { href: "/careers", label: "Careers" },
  { href: "/faq", label: "FAQ" },
];

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const panelRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  // Solid background only once we're off the hero.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the sheet whenever the route changes.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const close = useCallback(() => {
    setOpen(false);
    toggleRef.current?.focus();
  }, []);

  // Escape to close, Tab trapped inside the panel, background scroll locked.
  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
        return;
      }
      if (e.key !== "Tab") return;
      const focusables = panelRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled])',
      );
      if (!focusables || focusables.length === 0) return;
      const first = focusables[0]!;
      const last = focusables[focusables.length - 1]!;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKey);
    // Move focus into the sheet so a keyboard user isn't left behind it.
    window.setTimeout(() => {
      panelRef.current?.querySelector<HTMLElement>("a[href]")?.focus();
    }, 40);

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, close]);

  return (
    <header
      className={
        "fixed inset-x-0 top-0 z-50 transition-colors duration-300 " +
        (scrolled || open
          ? "border-b border-white/10 bg-charcoal-deep/95 backdrop-blur-md"
          : "bg-transparent")
      }
    >
      <nav
        aria-label="Main"
        className="mx-auto flex h-14 max-w-6xl items-center justify-between px-3 sm:h-16 sm:px-6"
      >
        <Link
          href="/"
          className="flex h-11 items-center gap-2 rounded-lg px-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf-green"
          aria-label="Eddie's Flowers Dispensary — home"
        >
          <Image
            src="/icons/cannabis-leaf.svg"
            alt=""
            width={24}
            height={24}
            aria-hidden="true"
            style={{ filter: "brightness(0) invert(1)" }}
          />
          <span className="display text-base font-medium text-white sm:text-lg">
            Eddie&apos;s Flowers
          </span>
        </Link>

        {/* Desktop links */}
        <ul className="hidden items-center gap-1 lg:flex">
          {NAV.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="flex h-11 items-center rounded-lg px-3 text-sm font-medium text-white/80 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf-green"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-1">
          <a
            href={PHONE_TEL_HREF}
            className="flex h-11 min-w-11 items-center justify-center gap-2 rounded-lg px-2 text-sm font-medium text-white/80 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf-green"
            aria-label={`Call Eddie's Flowers on ${PHONE_DISPLAY}`}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92Z" />
            </svg>
            <span className="hidden sm:inline">{PHONE_DISPLAY}</span>
          </a>

          <Link
            href="/#waitlist"
            className="hidden h-11 items-center rounded-full bg-leaf-green px-5 text-sm font-semibold text-white transition-colors hover:bg-leaf-green-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf-green md:inline-flex"
          >
            Get my invite
          </Link>

          <button
            ref={toggleRef}
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="site-menu"
            className="flex h-11 w-11 items-center justify-center rounded-lg text-white transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf-green lg:hidden"
          >
            <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              aria-hidden="true"
            >
              {open ? (
                <>
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </>
              ) : (
                <>
                  <path d="M3 12h18" />
                  <path d="M3 6h18" />
                  <path d="M3 18h18" />
                </>
              )}
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile sheet */}
      <div
        id="site-menu"
        ref={panelRef}
        hidden={!open}
        className="border-t border-white/10 bg-charcoal-deep lg:hidden"
      >
        <ul className="px-3 py-2">
          {NAV.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="flex min-h-14 items-center rounded-lg px-3 text-lg font-medium text-white/90 transition-colors hover:bg-white/5 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf-green"
              >
                {item.label}
              </Link>
            </li>
          ))}
          <li>
            <Link
              href="/wholesale"
              className="flex min-h-14 items-center rounded-lg px-3 text-lg font-medium text-white/90 transition-colors hover:bg-white/5 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf-green"
            >
              Brands &amp; wholesale
            </Link>
          </li>
        </ul>
        <div className="px-6 pb-6 pt-1">
          <Link
            href="/#waitlist"
            className="flex min-h-14 w-full items-center justify-center rounded-full bg-leaf-green px-6 text-base font-semibold text-white transition-colors hover:bg-leaf-green-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf-green"
          >
            Get my Grand Opening invite
          </Link>
          <p className="mt-3 text-center text-xs text-white/45">
            23 Rindge State Road, Ashburnham MA · Opening soon
          </p>
        </div>
      </div>
    </header>
  );
}
