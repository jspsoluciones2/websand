/**
 * Certificates lookup: form validation, call to the Worker API and result
 * states (loading / found / not found / error).
 *
 * The Worker owns the Supabase credentials: this file only ever asks for a
 * document number, so the service role key never reaches the browser.
 * Result area is announced via aria-live="polite".
 */
import { CONFIG } from './config.js';

const URL_API = `${CONFIG.API_BASE}${CONFIG.API_CERTIFICADO}`;

/** Escapa texto que viene de la base antes de inyectarlo como HTML. */
function escapar(texto) {
  return String(texto ?? "").replace(/[&<>"']/g, (caracter) => {
    switch (caracter) {
      case "&": return "&amp;";
      case "<": return "&lt;";
      case ">": return "&gt;";
      case '"': return "&quot;";
      default: return "&#39;";
    }
  });
}

/**
 * Cloudinary puede servir una versión liviana de la misma imagen. Solo se
 * reescribe cuando la URL sigue el patrón /upload/v<versión>/, para no tocar
 * una transformación que el cliente ya haya definido.
 */
function urlPrevia(url) {
  if (!/^https:\/\/res\.cloudinary\.com\//.test(url)) return url;
  if (!/\/upload\/v\d+\//.test(url)) return url;
  return url.replace("/upload/", "/upload/f_auto,q_auto,w_1400/");
}

/** Descarga el archivo real (no la miniatura) y cae a abrir la imagen si falla CORS. */
async function descargarImagen(url, documento) {
  const extension = (url.split("?")[0].match(/\.([a-z0-9]+)$/i) || [null, "png"])[1];
  const nombreArchivo = `certificado-compartiendo-arte-${documento}.${extension}`;

  try {
    const respuesta = await fetch(url, { mode: "cors" });
    if (!respuesta.ok) throw new Error(`HTTP ${respuesta.status}`);

    const blob = await respuesta.blob();
    const objeto = URL.createObjectURL(blob);
    const enlace = document.createElement("a");
    enlace.href = objeto;
    enlace.download = nombreArchivo;
    document.body.appendChild(enlace);
    enlace.click();
    enlace.remove();
    setTimeout(() => URL.revokeObjectURL(objeto), 10_000);
  } catch {
    // Sin permiso CORS no se puede armar el blob: se abre para guardar a mano.
    window.open(url, "_blank", "noopener");
  }
}

/** Enlaces de compartir. El texto lleva el nombre; la URL, la imagen pública. */
function enlacesCompartir(url, nombre) {
  const texto = `Certificado de ${nombre} — Corporación Compartiendo Arte`;
  const textoConUrl = `${texto}\n${url}`;

  return {
    whatsapp: `https://wa.me/?text=${encodeURIComponent(textoConUrl)}`,
    telegram: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(texto)}`,
    x: `https://twitter.com/intent/tweet?text=${encodeURIComponent(texto)}&url=${encodeURIComponent(url)}`,
  };
}

async function escribirPortapapeles(texto) {
  try {
    await navigator.clipboard.writeText(texto);
  } catch {
    // Fallback para navegadores sin permiso de portapapeles.
    const area = document.createElement("textarea");
    area.value = texto;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.opacity = "0";
    document.body.appendChild(area);
    area.select();
    document.execCommand("copy");
    area.remove();
  }
}

function avisarCopiado(nodo) {
  const original = nodo.textContent;
  nodo.textContent = "¡Copiado!";
  setTimeout(() => { nodo.textContent = original; }, 2000);
}

async function copiarEnlace(texto, boton) {
  await escribirPortapapeles(texto);
  avisarCopiado(boton);
}

/**
 * El menú de compartir del sistema sólo se ofrece en pantallas táctiles: ahí
 * reemplaza a los enlaces directos (llega a Instagram, Facebook y demás apps).
 * En escritorio los botones explícitos siguen siendo más previsibles.
 */
function puedeCompartirNativo() {
  if (typeof navigator.share !== "function") return false;
  return window.matchMedia("(hover: none) and (pointer: coarse)").matches;
}

/** Comparte la imagen real como archivo, con el enlace como respaldo. */
async function compartirNativo(url, previa, nombre, boton) {
  const etiqueta = boton.querySelector("[data-cert-etiqueta]") || boton;
  const original = etiqueta.textContent;
  const titulo = `Certificado de ${nombre} — Compartiendo Arte`;

  const restaurar = () => {
    boton.disabled = false;
    etiqueta.textContent = original;
  };

  boton.disabled = true;
  etiqueta.textContent = "Preparando…";

  let archivo = null;
  try {
    // Se comparte la versión liviana: la original pesa ~1 MB y demora el menú.
    const respuesta = await fetch(previa, { mode: "cors" });
    if (respuesta.ok) {
      const blob = await respuesta.blob();
      const tipo = blob.type || "image/png";
      const extension = tipo === "image/webp" ? "webp" : tipo === "image/jpeg" ? "jpg" : "png";
      archivo = new File([blob], `certificado-compartiendo-arte.${extension}`, { type: tipo });
    }
  } catch {
    // Sin archivo se comparte igual el enlace; nunca se bloquea la acción.
  }

  const datos = { title: titulo, text: titulo, url };
  if (archivo && navigator.canShare?.({ files: [archivo] })) datos.files = [archivo];

  try {
    await navigator.share(datos);
    restaurar();
  } catch (error) {
    // Cancelar el menú no es un error: no se hace nada.
    if (error?.name === "AbortError") {
      restaurar();
      return;
    }
    // Último recurso cuando el sistema rechaza el compartir.
    await escribirPortapapeles(url);
    restaurar();
    avisarCopiado(etiqueta);
  }
}

export function initCertificados() {
  const form = document.getElementById("certificados-form");
  const input = document.getElementById("certificados-doc");
  const resultado = document.getElementById("certificados-resultado");
  if (!form || !input || !resultado) return;

  const visor = prepararVisor();
  let ultimoDocumento = "";

  // Solo dígitos mientras se escribe.
  input.addEventListener("input", () => {
    input.value = input.value.replace(/\D/g, "");
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const documento = input.value.trim().replace(/^0+(?=\d)/, "");
    if (!/^\d{6,15}$/.test(documento)) {
      renderError("Ingresa un número de documento válido (solo dígitos, 6 a 15 números).");
      input.focus();
      return;
    }

    ultimoDocumento = documento;
    renderCargando();

    try {
      const respuesta = await fetch(`${URL_API}?doc=${encodeURIComponent(documento)}`, {
        headers: { Accept: "application/json" },
      });

      if (respuesta.status === 429) {
        renderError("Demasiadas consultas. Espera un momento e intenta de nuevo.");
        return;
      }
      if (!respuesta.ok) throw new Error(`HTTP ${respuesta.status}`);

      const datos = await respuesta.json();
      if (datos.encontrado) renderCertificado(datos.certificado, documento);
      else renderNoEncontrado(datos.mensaje);
    } catch {
      renderError("No pudimos completar la consulta. Revisa tu conexión e intenta de nuevo.");
    }
  });

  // ----- Result renderers -----

  function renderCargando() {
    resultado.innerHTML = '<div class="spinner" role="status" aria-label="Consultando certificado"></div>';
  }

  function renderCertificado(cert, documento) {
    const nombre = cert.nombre || "Participante";
    const nombreSeguro = escapar(nombre);

    if (!cert.url) {
      resultado.innerHTML = `
        <div class="certificado-tarjeta">
          <p class="certificado-tarjeta__etiqueta">Certificado a nombre de</p>
          <h3 class="certificado-tarjeta__nombre">${nombreSeguro}</h3>
          <p class="certificado-tarjeta__nota">
            Tu certificado está registrado, pero la imagen todavía no está disponible.
            <a href="#contacto">Escríbenos</a> y te lo enviamos.
          </p>
        </div>`;
      return;
    }

    const previa = urlPrevia(cert.url);
    const enlaces = enlacesCompartir(cert.url, nombre);
    // En táctil el menú del sistema reemplaza a los enlaces sueltos.
    const nativo = puedeCompartirNativo();

    resultado.innerHTML = `
      <div class="certificado-tarjeta">
        <p class="certificado-tarjeta__etiqueta">Certificado a nombre de</p>
        <h3 class="certificado-tarjeta__nombre">${nombreSeguro}</h3>
        <div class="certificado-acciones">
          <button type="button" class="boton boton--solido" data-cert="ver">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z"></path><circle cx="12" cy="12" r="3"></circle></svg>
            Ver certificado
          </button>
          <button type="button" class="boton boton--dorado" data-cert="descargar">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
            Descargar
          </button>
          ${nativo ? `<button type="button" class="boton boton--fantasma" data-cert="compartir">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>
            <span data-cert-etiqueta>Compartir</span>
          </button>` : ""}
        </div>
        ${nativo ? "" : `<div class="certificado-compartir">
          <span class="certificado-compartir__rotulo">Compartir</span>
          <a class="certificado-compartir__opcion" href="${enlaces.whatsapp}" target="_blank" rel="noopener noreferrer">WhatsApp</a>
          <a class="certificado-compartir__opcion" href="${enlaces.telegram}" target="_blank" rel="noopener noreferrer">Telegram</a>
          <a class="certificado-compartir__opcion" href="${enlaces.x}" target="_blank" rel="noopener noreferrer">X</a>
          <button type="button" class="certificado-compartir__opcion" data-cert="copiar">Copiar enlace</button>
        </div>`}
      </div>`;

    const ver = resultado.querySelector('[data-cert="ver"]');
    const descargar = resultado.querySelector('[data-cert="descargar"]');
    const copiar = resultado.querySelector('[data-cert="copiar"]');
    const compartir = resultado.querySelector('[data-cert="compartir"]');

    ver?.addEventListener("click", () => visor?.abrir(previa, nombre, ver));
    descargar?.addEventListener("click", () => descargarImagen(cert.url, documento));
    copiar?.addEventListener("click", () => copiarEnlace(cert.url, copiar));
    compartir?.addEventListener("click", () => compartirNativo(cert.url, previa, nombre, compartir));
  }

  function renderNoEncontrado(mensaje) {
    resultado.innerHTML = `
      <div class="mensaje-estado mensaje-estado--info" role="status">
        <p><strong>No encontramos tu certificado</strong></p>
        <p>${escapar(mensaje)}</p>
        <p class="mensaje-estado__ayuda">
          Revisa que el número esté completo y sin puntos.
          <a href="#contacto">Contáctanos para recibir ayuda →</a>
        </p>
      </div>`;
  }

  function renderError(mensaje) {
    resultado.innerHTML = `
      <div class="mensaje-estado mensaje-estado--error" role="alert">
        ${escapar(mensaje)}
      </div>`;
  }

  // Deja el foco en el campo cuando el usuario vuelve a la sección.
  return { enfocar: () => input.focus(), documento: () => ultimoDocumento };
}

/** Visor de la imagen del certificado. Reutiliza los estilos del lightbox. */
function prepararVisor() {
  const visor = document.getElementById("certificado-lightbox");
  if (!visor) return null;

  const imagen = visor.querySelector("#certificado-lightbox-imagen");
  const titulo = visor.querySelector("#certificado-lightbox-titulo");
  const cerrar = visor.querySelector("#certificado-lightbox-cerrar");
  const enlace = visor.querySelector("#certificado-lightbox-abrir");
  let focoPrevio = null;

  const cerrarVisor = () => {
    visor.classList.remove("abierto");
    visor.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    imagen.removeAttribute("src");
    enlace.setAttribute("href", "#");
    if (focoPrevio) focoPrevio.focus();
  };

  const abrir = (url, nombre, origen) => {
    focoPrevio = origen || document.activeElement;
    imagen.src = url;
    imagen.alt = `Certificado de ${nombre}`;
    titulo.textContent = nombre;
    enlace.href = url;
    visor.classList.add("abierto");
    visor.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    cerrar.focus();
  };

  cerrar.addEventListener("click", cerrarVisor);
  visor.addEventListener("click", (e) => {
    if (e.target === visor) cerrarVisor();
  });

  document.addEventListener("keydown", (e) => {
    if (!visor.classList.contains("abierto")) return;

    if (e.key === "Escape") {
      cerrarVisor();
      return;
    }

    // Dos controles: el foco cicla entre ellos y no se escapa al fondo.
    if (e.key === "Tab") {
      const enfocables = [cerrar, enlace].filter((el) => el && el.offsetParent !== null);
      if (!enfocables.length) return;
      e.preventDefault();
      const actual = enfocables.indexOf(document.activeElement);
      const paso = e.shiftKey ? -1 : 1;
      enfocables[(actual + paso + enfocables.length) % enfocables.length].focus();
    }
  });

  return { abrir };
}
