/**
 * Certificates lookup: form validation, fetch to the Worker API
 * and result states (loading / found / not found / error).
 * Result area is announced via aria-live="polite".
 */
import { CONFIG } from './config.js';

export function initCertificados() {
  const form = document.getElementById('certificados-form');
  const input = document.getElementById('certificados-doc');
  const resultado = document.getElementById('certificados-resultado');
  if (!form || !input || !resultado) return;

  // Digits only while typing.
  input.addEventListener('input', () => {
    input.value = input.value.replace(/\D/g, '');
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const doc = input.value.trim();
    if (!/^\d{6,15}$/.test(doc)) {
      renderError('Ingresa un número de documento válido (solo dígitos, 6 a 15 números).');
      input.focus();
      return;
    }

    renderCargando();

    try {
      const respuesta = await fetch(`${CONFIG.API_BASE}${CONFIG.API_CERTIFICADO}?doc=${encodeURIComponent(doc)}`, {
        headers: { Accept: 'application/json' },
      });

      if (respuesta.status === 429) {
        renderError('Demasiadas consultas. Espera un momento e intenta de nuevo.');
        return;
      }
      if (!respuesta.ok) throw new Error(`HTTP ${respuesta.status}`);

      const datos = await respuesta.json();
      if (datos.encontrado) renderCertificado(datos.certificado);
      else renderNoEncontrado(datos.mensaje);
    } catch {
      renderError('No pudimos completar la consulta. Revisa tu conexión e intenta de nuevo.');
    }
  });

  // ----- Result renderers -----

  function renderCargando() {
    resultado.innerHTML = '<div class="spinner" role="status" aria-label="Consultando certificado"></div>';
  }

  function renderCertificado(cert) {
    const fecha = new Date(cert.fecha).toLocaleDateString('es-CO', {
      year: 'numeric', month: 'long', day: 'numeric',
    });

    const botonDescarga = cert.url
      ? `<a class="boton boton--dorado" href="${cert.url}" download target="_blank" rel="noopener">
           Descargar PDF
         </a>`
      : `<button class="boton boton--deshabilitado" disabled title="Sistema de emisión en preparación">
           Descargar PDF
         </button>
         <p style="font-size:.85rem; color:var(--gris); margin-top:var(--esp-2);">
           El sistema de emisión de certificados está en preparación.
         </p>`;

    resultado.innerHTML = `
      <div class="certificado-tarjeta">
        <h3>Certificado encontrado</h3>
        <dl>
          <dt>Participante</dt><dd>${cert.nombre}</dd>
          <dt>Taller / actividad</dt><dd>${cert.taller}</dd>
          <dt>Fecha</dt><dd>${fecha}</dd>
        </dl>
        ${botonDescarga}
      </div>`;
  }

  function renderNoEncontrado(mensaje) {
    resultado.innerHTML = `
      <div class="mensaje-estado mensaje-estado--info" role="status">
        <p>${mensaje}</p>
        <p style="margin-top:var(--esp-2);"><a href="#contacto" style="color:var(--amarillo);">Contáctanos para recibir ayuda →</a></p>
      </div>`;
  }

  function renderError(mensaje) {
    resultado.innerHTML = `
      <div class="mensaje-estado mensaje-estado--error" role="alert">
        ${mensaje}
      </div>`;
  }
}
