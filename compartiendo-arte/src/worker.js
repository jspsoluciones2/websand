/**
 * Cloudflare Worker — Compartiendo Arte
 * Serves the certificates lookup API. Static assets are served by the
 * Workers assets platform before this Worker runs (see wrangler.jsonc).
 */

// Simple in-memory rate limiter: max requests per IP inside the window.
// NOTE: Workers isolates are ephemeral — this Map resets between isolates.
// For production-grade limiting use a KV binding or Cloudflare WAF rules.
const RATE_LIMIT_MAX = 10; // requests
const RATE_LIMIT_WINDOW_MS = 60_000; // 1 minute
const rateBuckets = new Map();

// Demo certificate registry.
// TODO: replace with a real data source (KV or D1 binding), e.g.:
//   const cert = await env.CERTIFICADOS_KV.get(docNumber, "json");
const CERTIFICADOS_DEMO = new Map([
  [
    "123456789",
    {
      nombre: "Participante Demo",
      taller: "Taller de Danza Folclórica",
      fecha: "2025-11-20",
      url: null, // null = PDF emission system pending
    },
  ],
]);

const MENSAJE_NO_ENCONTRADO =
  "No encontramos un certificado asociado a ese número de documento. Verifica el número o contáctanos para recibir ayuda.";

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
}

function isRateLimited(ip) {
  const now = Date.now();
  let bucket = rateBuckets.get(ip);
  if (!bucket || now - bucket.start > RATE_LIMIT_WINDOW_MS) {
    bucket = { start: now, count: 0 };
    rateBuckets.set(ip, bucket);
  }
  bucket.count += 1;
  return bucket.count > RATE_LIMIT_MAX;
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (request.method === "GET" && url.pathname === "/api/certificado") {
      const ip = request.headers.get("CF-Connecting-IP") || "desconocida";

      if (isRateLimited(ip)) {
        return jsonResponse(
          { error: "Demasiadas consultas. Intenta de nuevo en un minuto." },
          429
        );
      }

      const doc = (url.searchParams.get("doc") || "").trim();

      // Validate: digits only, 6-15 chars.
      if (!/^\d{6,15}$/.test(doc)) {
        return jsonResponse(
          { error: "Ingresa un número de documento válido (solo dígitos, 6 a 15 números)." },
          400
        );
      }

      // Lookup (demo registry until the emission system is defined).
      const certificado = CERTIFICADOS_DEMO.get(doc) || null;

      if (certificado) {
        return jsonResponse({ encontrado: true, certificado });
      }

      // Neutral response — never reveals whether the document number exists.
      return jsonResponse({ encontrado: false, mensaje: MENSAJE_NO_ENCONTRADO });
    }

    return new Response("No encontrado", { status: 404 });
  },
};
