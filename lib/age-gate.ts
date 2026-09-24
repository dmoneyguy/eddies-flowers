// Server-side age gate — Massachusetts CCC compliance.
//
// 935 CMR 500.105(4)(b)13 prohibits "Operation of any website ... that fails
// to verify that the entrant is 21 years of age or older." Until 24 September
// 2026 this site's gate was a client-side overlay: the full page copy shipped
// in the server HTML, a <noscript> rule displayed all of it with no gate, and
// "I'm under 21" was not remembered, so a reload let the visitor click Yes.
//
// How it works now:
//   - proxy.ts runs before every route. A request without ef_age_ok=1 gets
//     ONLY the self-contained page rendered by renderGateHtml() below. No site
//     HTML, no Next.js scripts, no header, no footer. Crawlers get the same.
//   - "I'm 21 or older" POSTs the attestation to /api/age-gate (which records
//     it in control_plane.eddies_flowers_age_gate_attestations and sets the
//     cookie), the page also sets the cookie itself, then reloads.
//   - "I'm under 21" shows the denial screen and sets the session cookie
//     ef_age_denied=1. While that cookie exists the proxy serves the denial
//     screen on every route and /api/age-gate refuses to set ef_age_ok, so the
//     gate cannot be passed for the rest of the browser session.
//   - With JavaScript off, everything is hidden except the line "You must be
//     21 or older and have JavaScript enabled to enter this site."
//
// WHAT THIS GATE DOES *NOT* DO — read before adding copy behind it.
// Passing the gate does not unlock otherwise-prohibited content. 500.105(4)(a)
// is the PERMITTED list; (4)(b) is the PROHIBITED list; and (4)(a)7 permits
// advertising only where it is "not otherwise prohibited in ... (4)(b)". The
// CCC's Bulletin on Advertising Activities (21 May 2024) is explicit:
// "Minimal interaction by the Consumer, such as verifying that they are over
// 21 years old via a website's age gate ... does not make the communication
// personalized." So discounts, coupons, loyalty/rewards/points/referral
// programmes, "sale"/"deal" language and price comparison stay OFF this site
// regardless of the gate — (4)(b)18 and (4)(b)20.
//
// The gate wording below is the approved wording. Do not change it casually.

export const AGE_OK_COOKIE = "ef_age_ok";
export const AGE_DENIED_COOKIE = "ef_age_denied";
/** 30 days, in seconds. */
export const AGE_OK_MAX_AGE = 60 * 60 * 24 * 30;

const LICENSE_NUMBER = process.env.NEXT_PUBLIC_LICENSE_NUMBER || "MR284579";

/**
 * Paths the proxy lets through without the age cookie. Keep this list short:
 * everything not on it is gated.
 *
 *   /robots.txt           crawler rules only, no copy
 *   /api/age-gate         the attestation endpoint the gate itself calls
 *   /_next/static/*       hashed build assets (CSS/JS/fonts) for the gated
 *                         pages; the gate page itself loads none of them
 *   /_next/image          the image optimiser; it only returns images and
 *                         fetches its source without the visitor's cookies
 *   image / font files    the logo and favicon the gate draws, the neutral
 *                         social card (og.png), and the photos next/image
 *                         needs. Images only — no text files.
 */
const IMAGE_OR_FONT = /\.(?:svg|png|jpe?g|webp|avif|gif|ico|woff2?)$/i;

export function isGateExempt(pathname: string): boolean {
  if (pathname === "/robots.txt") return true;
  if (pathname === "/api/age-gate") return true;
  if (pathname.startsWith("/_next/static/")) return true;
  if (pathname === "/_next/image") return true;
  return IMAGE_OR_FONT.test(pathname);
}

const STYLE = `
*,*::before,*::after{box-sizing:border-box}
html,body{margin:0;min-height:100%}
body{
  min-height:100vh;color:#fff;
  font-family:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;
  -webkit-font-smoothing:antialiased;
  background:
    radial-gradient(circle at 15% 20%,rgba(115,190,68,.18) 0%,transparent 35%),
    radial-gradient(circle at 85% 80%,rgba(255,208,15,.10) 0%,transparent 40%),
    radial-gradient(circle at 50% 50%,rgba(154,89,44,.06) 0%,transparent 60%),
    linear-gradient(135deg,#1a1a1a 0%,#2b2b2b 50%,#222 100%);
  background-color:#1a1a1a;
}
.ef-wrap{min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:48px 24px;text-align:center}
.ef-wrap[hidden]{display:none}
.ef-logo{width:200px;height:auto}
@media (min-width:640px){.ef-logo{width:280px}}
.ef-logo--dim{width:180px;opacity:.6}
@media (min-width:640px){.ef-logo--dim{width:240px}}
.ef-eyebrow{margin:40px 0 0;font-size:12px;font-weight:600;letter-spacing:.32em;text-transform:uppercase;color:#8ed05f}
.ef-title{margin:12px 0 0;max-width:42rem;font-family:"Fraunces",Georgia,"Times New Roman",serif;font-weight:500;font-size:36px;line-height:1.05;letter-spacing:-.02em}
@media (min-width:640px){.ef-title{font-size:48px}}
.ef-title em{font-weight:300;color:#8ed05f}
.ef-body{margin:20px 0 0;max-width:28rem;font-size:16px;line-height:1.6;color:rgba(255,255,255,.65)}
.ef-actions{margin-top:40px;display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:16px}
.ef-btn{display:inline-flex;align-items:center;gap:8px;min-height:48px;border-radius:9999px;padding:16px 32px;font:inherit;font-size:16px;font-weight:600;color:#fff;cursor:pointer;text-decoration:none}
@media (min-width:640px){.ef-btn{font-size:18px}}
.ef-btn--yes{border:0;background:#73be44;box-shadow:0 6px 18px rgba(115,190,68,.35)}
.ef-btn--yes:hover{background:#8ed05f}
.ef-btn--yes[disabled]{opacity:.6;cursor:wait}
.ef-btn--no{border:1px solid rgba(255,255,255,.2);background:transparent}
.ef-btn--no:hover{border-color:rgba(255,255,255,.4)}
.ef-btn:focus-visible{outline:2px solid #73be44;outline-offset:2px}
.ef-fine{margin:40px 0 0;max-width:28rem;font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:rgba(255,255,255,.35)}
.ef-msg{margin:24px 0 0;max-width:28rem;font-size:16px;line-height:1.6;color:#fff}
`;

function logo(dim: boolean, alt: string): string {
  return `<img class="ef-logo${dim ? " ef-logo--dim" : ""}" src="/logo-secondary.svg" width="520" height="300" alt="${alt}"${dim ? ' aria-hidden="true"' : ""}>`;
}

// Everything the "I'm 21 or older" / "I'm under 21" buttons do. Plain ES5 so
// it runs anywhere; no framework, no external script.
const SCRIPT = `
(function () {
  var MAX_AGE = ${AGE_OK_MAX_AGE};
  function setCookie(name, value, maxAge) {
    var c = name + "=" + value + "; Path=/; SameSite=Lax";
    if (maxAge) c += "; Max-Age=" + maxAge;
    if (location.protocol === "https:") c += "; Secure";
    document.cookie = c;
  }
  function token() {
    try { if (window.crypto && crypto.randomUUID) return crypto.randomUUID(); } catch (e) {}
    return Date.now() + "-" + Math.random().toString(36).slice(2, 12);
  }
  var gate = document.getElementById("ef-gate");
  var denied = document.getElementById("ef-denied");
  var yes = document.getElementById("ef-yes");
  var no = document.getElementById("ef-no");
  var cookieMsg = document.getElementById("ef-cookie-msg");
  if (!gate || !yes || !no) return;

  yes.addEventListener("click", function () {
    if (yes.disabled) return;
    if (navigator.cookieEnabled === false) { cookieMsg.hidden = false; return; }
    yes.disabled = true;
    var body = JSON.stringify({
      sessionToken: token(),
      attestedAge21OrOver: true,
      expiresAt: new Date(Date.now() + MAX_AGE * 1000).toISOString()
    });
    var done = false;
    function enter() {
      if (done) return;
      done = true;
      setCookie("${AGE_OK_COOKIE}", "1", MAX_AGE);
      location.reload();
    }
    // Never strand someone on a slow network: enter after 4s regardless.
    var t = setTimeout(enter, 4000);
    try {
      fetch("/api/age-gate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: body,
        credentials: "same-origin",
        keepalive: true
      }).then(function () { clearTimeout(t); enter(); }, function () { clearTimeout(t); enter(); });
    } catch (e) { clearTimeout(t); enter(); }
  });

  no.addEventListener("click", function () {
    // Session cookie: no Max-Age, so it lasts until the browser session ends.
    setCookie("${AGE_DENIED_COOKIE}", "1", 0);
    gate.hidden = true;
    denied.hidden = false;
    var h = document.getElementById("ef-denied-title");
    if (h) { h.setAttribute("tabindex", "-1"); h.focus(); }
  });
})();
`;

/**
 * The complete HTML document served in place of every gated route. It must
 * contain nothing but the gate: no page copy, no navigation, no links into
 * the site.
 */
export function renderGateHtml(opts: { denied: boolean; origin: string }): string {
  const { denied, origin } = opts;
  const ogImage = `${origin}/og.png`;
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Eddie's Flowers · Adults 21+</title>
<meta name="description" content="You must be 21 or older to enter this site.">
<meta name="theme-color" content="#1a1a1a">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Eddie's Flowers">
<meta property="og:title" content="Eddie's Flowers · Ashburnham, MA · Adults 21+">
<meta property="og:description" content="You must be 21 or older to enter this site.">
<meta property="og:image" content="${ogImage}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="Eddie's Flowers · Ashburnham, MA · Adults 21+">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Eddie's Flowers · Ashburnham, MA · Adults 21+">
<meta name="twitter:image" content="${ogImage}">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="icon" href="/icon-32.png" sizes="32x32" type="image/png">
<link rel="apple-touch-icon" href="/apple-icon.png">
<style>${STYLE}</style>
</head>
<body>
<noscript>
<style>.ef-js{display:none!important}</style>
<main class="ef-wrap">
${logo(false, "Eddie's Flowers Dispensary")}
<p class="ef-msg">You must be 21 or older and have JavaScript enabled to enter this site.</p>
</main>
</noscript>
<main id="ef-gate" class="ef-wrap ef-js" aria-labelledby="ef-title"${denied ? " hidden" : ""}>
${logo(false, "Eddie's Flowers Dispensary")}
<p class="ef-eyebrow">Welcome</p>
<h1 id="ef-title" class="ef-title">Are you <em>21 or older</em>?</h1>
<p class="ef-body">This website is intended for adults age 21 and older. By entering you confirm you meet this age requirement.</p>
<div class="ef-actions">
<button type="button" id="ef-yes" class="ef-btn ef-btn--yes">I'm 21 or older <span aria-hidden="true">→</span></button>
<button type="button" id="ef-no" class="ef-btn ef-btn--no">I'm under 21</button>
</div>
<p id="ef-cookie-msg" class="ef-msg" role="alert" hidden>Please enable cookies in your browser to enter this site.</p>
<p class="ef-fine">Massachusetts Licensed Adult-Use Marijuana Retailer #${LICENSE_NUMBER} (Provisional) · Keep marijuana products out of reach of children</p>
</main>
<main id="ef-denied" class="ef-wrap ef-js" aria-labelledby="ef-denied-title"${denied ? "" : " hidden"}>
${logo(true, "")}
<p class="ef-eyebrow">Sorry</p>
<h1 id="ef-denied-title" class="ef-title">You must be <em>21 or older</em> to enter this site.</h1>
<p class="ef-body">We'll see you when you're 21. Thanks for stopping by.</p>
<div class="ef-actions">
<a class="ef-btn ef-btn--no" href="https://drugfree.org" target="_blank" rel="noopener noreferrer">Visit drugfree.org <span aria-hidden="true">→</span></a>
</div>
</main>
${denied ? "" : `<script>${SCRIPT}</script>`}
</body>
</html>`;
}
