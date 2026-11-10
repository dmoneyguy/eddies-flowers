// /shop/* — reverse proxy to the Sweed storefront.
//
// Spec (Sweed, Ellen Macdonald's updated instructions, confirmed 2026-11-10):
//   every request under https://eddiesflower.com/shop is forwarded to
//   https://web-ui-prime.sweedpos.com/shop with the full path and query
//   string unchanged, and carries the header  X-Forwarded-Host: eddiesflower.com
//   Sweed picks the store from that header, so it is the bare domain on every
//   host this site answers on (www, apex, previews), never the incoming host.
//
// WHY A ROUTE HANDLER AND NOT A next.config REWRITE. An external rewrite is
// proxied by Vercel's edge, which sets X-Forwarded-Host to the incoming host
// (www.eddiesflower.com, or a preview URL). Sweed needs exactly
// "eddiesflower.com", and a route handler is the one place we set it ourselves.
//
// PUBLIC STATE STAYS CLOSED. On the production deployment this route answers
// 404 unless SHOP_PROXY_LIVE=true is set in the Vercel Production environment.
// That variable is the go-live switch, flipped only once the CCC permits
// operations. Preview deployments always proxy, so the wiring can be checked
// before then. Until Sweed maps the store, the upstream answers
// 404 "Store is not found" — that page arriving here means forwarding works.

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const SWEED_ORIGIN = "https://web-ui-prime.sweedpos.com";
const FORWARDED_HOST = "eddiesflower.com";
const UPSTREAM_TIMEOUT_MS = 30_000;

// Local testing only: point the proxy at a stand-in upstream. Ignored on every
// Vercel deployment (VERCEL is set there), so no deployment can be repointed.
const UPSTREAM_ORIGIN = process.env.VERCEL
  ? SWEED_ORIGIN
  : (process.env.SHOP_PROXY_UPSTREAM_ORIGIN || SWEED_ORIGIN).replace(/\/+$/, "");

// Never forwarded upstream: hop-by-hop headers, the host (fetch sets it from
// the target URL), our own forwarding headers (set below), and anything
// Vercel or Next.js add for their own use — some carry tokens.
const DROP_REQUEST_HEADERS = new Set([
  "host",
  "connection",
  "keep-alive",
  "proxy-authenticate",
  "proxy-authorization",
  "proxy-connection",
  "te",
  "trailer",
  "transfer-encoding",
  "upgrade",
  "content-length",
  "forwarded",
  "x-forwarded-host",
  "x-forwarded-proto",
  "x-forwarded-port",
]);
const DROP_REQUEST_PREFIXES = ["x-vercel-", "x-middleware-", "x-invoke-", "x-nextjs-", "x-matched-path"];

// fetch() hands back a decoded body, so the upstream's encoding and length no
// longer describe it; Vercel re-compresses on the way out.
const DROP_RESPONSE_HEADERS = new Set([
  "connection",
  "keep-alive",
  "transfer-encoding",
  "content-encoding",
  "content-length",
]);

function proxyLive(): boolean {
  if (process.env.VERCEL_ENV !== "production") return true;
  return process.env.SHOP_PROXY_LIVE === "true";
}

// Drop Vercel's own cookies (deployment-protection session and share links);
// everything else — Sweed's cart and session cookies — goes through.
function filterCookies(cookie: string): string {
  return cookie
    .split(";")
    .map((c) => c.trim())
    .filter((c) => c && !c.toLowerCase().startsWith("_vercel"))
    .join("; ");
}

async function proxy(request: Request): Promise<Response> {
  if (!proxyLive()) {
    return new Response("Not Found", {
      status: 404,
      headers: { "content-type": "text/plain; charset=utf-8", "x-robots-tag": "noindex" },
    });
  }

  // Path and query as they arrived. The route only matches /shop and
  // /shop/..., so the pathname always begins "/shop" and the target host
  // cannot change. (Next.js hands route handlers a URL rebuilt from its parsed
  // query: distinct keys keep their order, but a key repeated around others is
  // grouped — x=1&y=2&x=3 becomes x=1&x=3&y=2 — and a bare "flag" becomes
  // "flag=". Both mean the same thing to any query parser.)
  const incoming = new URL(request.url);
  const target = `${UPSTREAM_ORIGIN}${incoming.pathname}${incoming.search}`;

  const headers = new Headers();
  request.headers.forEach((value, key) => {
    const k = key.toLowerCase();
    if (DROP_REQUEST_HEADERS.has(k)) return;
    if (DROP_REQUEST_PREFIXES.some((p) => k.startsWith(p))) return;
    if (k === "cookie") {
      const kept = filterCookies(value);
      if (kept) headers.set("cookie", kept);
      return;
    }
    headers.set(key, value);
  });
  headers.set("x-forwarded-host", FORWARDED_HOST);
  headers.set("x-forwarded-proto", "https");

  const method = request.method.toUpperCase();
  const hasBody = method !== "GET" && method !== "HEAD";

  let upstream: Response;
  try {
    upstream = await fetch(target, {
      method,
      headers,
      body: hasBody ? await request.arrayBuffer() : undefined,
      redirect: "manual",
      cache: "no-store",
      signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
    });
  } catch (err) {
    console.error("[shop-proxy] upstream request failed", { target, err: String(err) });
    return new Response("Bad Gateway", {
      status: 502,
      headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "no-store" },
    });
  }

  const out = new Headers();
  upstream.headers.forEach((value, key) => {
    const k = key.toLowerCase();
    if (DROP_RESPONSE_HEADERS.has(k) || k === "set-cookie") return;
    out.append(key, value);
  });
  // Set-Cookie must be copied one by one; forEach would fold them together.
  for (const c of upstream.headers.getSetCookie()) out.append("set-cookie", c);

  // A redirect that names Sweed's host is sent back as a path on ours, so the
  // visitor never leaves eddiesflower.com.
  const location = out.get("location");
  if (location?.startsWith(UPSTREAM_ORIGIN)) {
    out.set("location", location.slice(UPSTREAM_ORIGIN.length) || "/");
  }

  // Where this request went, for checking the wiring. Sweed's address is public.
  out.set("x-eddies-proxy-upstream", target);

  const noBody = method === "HEAD" || upstream.status === 204 || upstream.status === 304;
  return new Response(noBody ? null : upstream.body, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers: out,
  });
}

export const GET = proxy;
export const HEAD = proxy;
export const POST = proxy;
export const PUT = proxy;
export const PATCH = proxy;
export const DELETE = proxy;
export const OPTIONS = proxy;
