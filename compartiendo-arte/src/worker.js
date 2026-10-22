/**
 * Cloudflare Worker — Compartiendo Arte
 * Serves the certificates lookup API. Static assets are served by the
 * Workers assets platform before this Worker runs (see wrangler.jsonc).
 *
 * Supabase access uses the service role key, which must live ONLY as a Worker
 * secret (`wrangler secret put SUPABASE_KEY`). It never reaches the browser:
 * exposing it would hand over the whole table, bypassing RLS.
 */

// Simple in-memory rate limiter: max requests per IP inside the window.
// NOTE: Workers isolates are ephemeral — this Map resets between isolates.
// For production-grade limiting use a KV binding or Cloudflare WAF rules.
const RATE_LIMIT_MAX = 20; // requests
const RATE_LIMIT_WINDOW_MS = 60_000; // 1 minute
const rateBuckets = new Map();

const SUPABASE_TIMEOUT_MS = 5_000;

const MENSAJE_NO_ENCONTRADO =
  "No encontramos un certificado asociado a ese número de documento. Verifica el número o contáctanos para recibir ayuda.";

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      // La respuesta depende del documento consultado: nunca cachear.
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    },
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

/**
 * Consulta exacta por documento. Devuelve null si no existe.
 * Lanza si la configuración falta o Supabase responde con error, para que el
 * llamador distinga "no existe" de "no pudimos consultar".
 */
async function buscarCertificado(env, documento) {
  const base = (env.SUPABASE_URL || "").replace(/\/+$/, "");
  const key = env.SUPABASE_KEY || "";

  if (!base || !key) {
    throw new Error("Falta SUPABASE_URL o SUPABASE_KEY en el entorno");
  }

  const consulta = new URL(`${base}/rest/v1/certificados`);
  consulta.searchParams.set("documento", `eq.${documento}`);
  consulta.searchParams.set("select", "nombre,url");
  consulta.searchParams.set("limit", "1");

  const respuesta = await fetch(consulta, {
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      Accept: "application/json",
    },
    signal: AbortSignal.timeout(SUPABASE_TIMEOUT_MS),
  });

  if (!respuesta.ok) {
    throw new Error(`Supabase respondió ${respuesta.status}`);
  }

  const filas = await respuesta.json();
  const fila = Array.isArray(filas) ? filas[0] : null;
  if (!fila) return null;

  return {
    nombre: typeof fila.nombre === "string" ? fila.nombre.trim() : "",
    url: typeof fila.url === "string" && fila.url ? fila.url : null,
  };
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === "GET" && url.pathname === "/api/certificado") {
      const ip = request.headers.get("CF-Connecting-IP") || "desconocida";

      if (isRateLimited(ip)) {
        return jsonResponse(
          { error: "Demasiadas consultas. Intenta de nuevo en un minuto." },
          429
        );
      }

      const documento = (url.searchParams.get("doc") || "").trim();

      // Validación: solo dígitos, 6 a 15. Evita cualquier inyección en la query.
      if (!/^\d{6,15}$/.test(documento)) {
        return jsonResponse(
          { error: "Ingresa un número de documento válido (solo dígitos, 6 a 15 números)." },
          400
        );
      }

      try {
        const certificado = await buscarCertificado(env, documento);

        if (certificado) {
          return jsonResponse({ encontrado: true, certificado });
        }

        return jsonResponse({ encontrado: false, mensaje: MENSAJE_NO_ENCONTRADO });
      } catch (error) {
        console.error("Error consultando certificados:", error?.message || error);
        return jsonResponse(
          {
            error:
              "No pudimos consultar el certificado en este momento. Intenta de nuevo en unos minutos.",
          },
          502
        );
      }
    }

    return new Response("No encontrado", { status: 404 });
  },
};
