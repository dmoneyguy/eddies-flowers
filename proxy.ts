// proxy.ts — the server-side age gate. (Next.js 16 renamed the `middleware`
// file convention to `proxy`; this is the same feature.)
//
// 935 CMR 500.105(4)(b)13: a website that "fails to verify that the entrant is
// 21 years of age or older" is a prohibited practice. So until the visitor has
// the ef_age_ok=1 cookie, EVERY route answers with the gate page and nothing
// else — the site's own HTML is never sent. That includes search-engine and AI
// crawlers: they see the gate, not the pages behind it.
//
// See lib/age-gate.ts for the gate page, the cookie names and the short list
// of exempt paths.

import { NextResponse, type NextRequest } from "next/server";
import {
  AGE_DENIED_COOKIE,
  AGE_OK_COOKIE,
  isGateExempt,
  renderGateHtml,
} from "./lib/age-gate";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isGateExempt(pathname)) return NextResponse.next();

  const denied = request.cookies.get(AGE_DENIED_COOKIE)?.value === "1";
  const verified = request.cookies.get(AGE_OK_COOKIE)?.value === "1";

  // "I'm under 21" wins for the rest of the browser session, even over an
  // older ef_age_ok cookie.
  if (verified && !denied) return NextResponse.next();

  const noStore = {
    "Cache-Control": "private, no-store, max-age=0",
    Vary: "Cookie",
  };

  // Form endpoints: a JSON refusal rather than an HTML page.
  if (pathname.startsWith("/api/")) {
    return NextResponse.json(
      { ok: false, error: "Please confirm you are 21 or older to use this site." },
      { status: 403, headers: noStore },
    );
  }

  return new NextResponse(
    renderGateHtml({ denied, origin: request.nextUrl.origin }),
    {
      status: 200,
      headers: {
        ...noStore,
        "Content-Type": "text/html; charset=utf-8",
      },
    },
  );
}

// Runs on every path; isGateExempt() above decides what passes.
export const config = {
  matcher: "/:path*",
};
