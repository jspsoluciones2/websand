/**
 * Sección de videos y shorts del canal de YouTube.
 *
 * Decisiones de rendimiento:
 * - Cada tarjeta es una miniatura de i.ytimg.com, no un iframe. Un iframe de
 *   YouTube pesa cerca de 1 MB de JavaScript; con dieciséis tarjetas la página
 *   sería inusable.
 * - El reproductor real se crea recién al abrir el visor y se destruye al
 *   cerrarlo (y al cambiar de video), así no queda audio sonando de fondo.
 * - La vista previa del hover monta un único iframe mudo, sin controles y en
 *   bucle, solo en dispositivos con puntero fino. En celular no existe hover:
 *   se ve la miniatura y se reproduce al tocar.
 *
 * Accesibilidad:
 * - Las tarjetas son botones con etiqueta explícita.
 * - El visor atrapa el foco, acepta Escape y flechas, y lo devuelve a la
 *   tarjeta que lo abrió.
 * - Con `prefers-reduced-motion` no hay carril ni vista previa automática.
 */
import {
  VIDEOS,
  SHORTS,
  esEmbebible,
  urlVideoYouTube,
  urlMiniaturaVideo,
  urlMiniaturaVideoAlterna,
  urlEmbedVideo,
  urlEmbedPreview,
} from './config.js';

const CONSULTA_MOVIMIENTO = '(prefers-reduced-motion: reduce)';
const CONSULTA_PUNTERO = '(hover: hover) and (pointer: fine)';

/** Deriva del carril en píxeles por segundo. Más lenta que la galería. */
const VELOCIDAD_CARRIL = 20;

/** Copias máximas del bloque para cubrir pantallas muy anchas. */
const MAX_VUELTAS = 8;

/** Espera antes de montar la vista previa, para no castigar el paso del mouse. */
const RETARDO_PREVIEW = 450;

export function initVideos() {
  const contenedor = document.getElementById('videos-carril');
  if (!contenedor) return;

  const estado = {
    lista: [],
    posicion: 0,
    elementoFoco: null,
  };

  montarCarril(contenedor);
  montarShorts();
  montarVisor(estado);
  observarCarril(contenedor, () => detenerPreview());
  activarPreviews(contenedor);
}

/** Devuelve true si la vista previa automática tiene sentido en este equipo. */
function puedePrevisualizar() {
  if (window.matchMedia(CONSULTA_MOVIMIENTO).matches) return false;
  return window.matchMedia(CONSULTA_PUNTERO).matches;
}

/**
 * Marca la miniatura como cargada. `cloneNode` no copia listeners, así que las
 * copias del bucle tienen que volver a engancharse o quedan invisibles.
 */
function marcarCargada(img) {
  if (img.complete && img.naturalWidth > 0) {
    img.classList.add('cargada');
    return;
  }
  img.addEventListener('load', () => img.classList.add('cargada'), { once: true });
}

/**
 * Miniatura de YouTube con respaldo. `hqdefault` viene con bandas negras
 * (es 4:3); el `object-fit: cover` las recorta. Si faltara, se usa la 320×180.
 */
function crearMiniatura(item) {
  const img = document.createElement('img');
  img.alt = '';
  img.width = 1280;
  img.height = 720;
  img.loading = 'lazy';
  img.decoding = 'async';

  let alterna = false;
  img.addEventListener('error', () => {
    if (alterna) return;
    alterna = true;
    img.src = urlMiniaturaVideoAlterna(item.id);
  });

  img.src = urlMiniaturaVideo(item.id);
  marcarCargada(img);
  return img;
}

/** Construye la tarjeta 16:9 de un video del carril. */
function crearTarjeta(item, indice) {
  const contenedor = document.createElement('div');
  contenedor.className = 'video';

  const interno = esEmbebible(item.id);
  const boton = document.createElement(interno ? 'button' : 'a');
  boton.className = 'video__boton';

  if (interno) {
    boton.type = 'button';
    boton.dataset.tipo = 'video';
    boton.dataset.indice = String(indice);
    boton.setAttribute(
      'aria-label',
      `Reproducir video: ${item.titulo}${item.duracion ? ` (${item.duracion})` : ''}`
    );
  } else {
    // YouTube no permite embeberlo: enlace directo, sin reproductor roto.
    boton.href = urlVideoYouTube(item.id);
    boton.target = '_blank';
    boton.rel = 'noopener noreferrer';
    boton.classList.add('video__boton--externo');
    boton.setAttribute('aria-label', `Ver en YouTube: ${item.titulo}`);
  }

  boton.appendChild(crearMiniatura(item));

  if (item.duracion) {
    const duracion = document.createElement('span');
    duracion.className = 'video__duracion';
    duracion.textContent = item.duracion;
    duracion.setAttribute('aria-hidden', 'true');
    boton.appendChild(duracion);
  }

  const play = document.createElement('span');
  play.className = 'video__play';
  play.setAttribute('aria-hidden', 'true');
  play.innerHTML = `<span>${interno ? '▶' : '↗'}</span>`;
  boton.appendChild(play);

  const titulo = document.createElement('p');
  titulo.className = 'video__titulo';
  titulo.textContent = item.titulo;

  contenedor.appendChild(boton);
  contenedor.appendChild(titulo);

  return contenedor;
}

/** Arma el carril y su copia para el bucle sin costura. */
function montarCarril(contenedor) {
  const envoltura = document.createElement('div');
  envoltura.className = 'videos__carril-envoltura';

  const carril = document.createElement('div');
  carril.className = 'videos__carril videos__carril--izq';

  VIDEOS.forEach((item, indice) => carril.appendChild(crearTarjeta(item, indice)));

  envoltura.appendChild(carril);
  contenedor.appendChild(envoltura);

  duplicarCarril(carril, contenedor.clientWidth);
}

/**
 * Repite el bloque hasta cubrir el ancho visible y después lo duplica: el
 * desplazamiento de media anchura equivale a un bloque exacto.
 */
function duplicarCarril(carril, anchoVisible) {
  const originales = [...carril.children];
  if (!originales.length) return;

  // Con movimiento reducido la sección es una grilla estática: sin copias.
  if (window.matchMedia(CONSULTA_MOVIMIENTO).matches) return;

  const ancho = () => carril.getBoundingClientRect().width;

  const clonar = (nodo) => {
    const clon = nodo.cloneNode(true);
    clon.classList.add('video--clon');
    clon.setAttribute('aria-hidden', 'true');
    // El foco vive en el botón, no en la envoltura.
    const boton = clon.querySelector('button');
    if (boton) boton.setAttribute('tabindex', '-1');
    marcarCargada(clon.querySelector('img'));
    return clon;
  };

  let vueltas = 1;
  while (ancho() > 0 && ancho() < anchoVisible && vueltas < MAX_VUELTAS) {
    originales.forEach((nodo) => carril.appendChild(clonar(nodo)));
    vueltas++;
  }

  if (ancho() === 0) return;

  [...carril.children].forEach((nodo) => carril.appendChild(clonar(nodo)));

  const mitad = ancho() / 2;
  if (mitad > 0) {
    carril.style.setProperty('--duracion', `${(mitad / VELOCIDAD_CARRIL).toFixed(1)}s`);
  }
}

/** Bloque estático de shorts verticales. */
function montarShorts() {
  const contenedor = document.getElementById('videos-shorts');
  if (!contenedor) return;

  SHORTS.forEach((item, indice) => {
    const figura = document.createElement('div');
    figura.className = 'short';

    const interno = esEmbebible(item.id);
    const boton = document.createElement(interno ? 'button' : 'a');
    boton.className = 'short__boton';

    if (interno) {
      boton.type = 'button';
      boton.dataset.tipo = 'short';
      boton.dataset.indice = String(indice);
      boton.setAttribute('aria-label', `Reproducir short: ${item.titulo}`);
    } else {
      boton.href = urlVideoYouTube(item.id);
      boton.target = '_blank';
      boton.rel = 'noopener noreferrer';
      boton.classList.add('short__boton--externo');
      boton.setAttribute('aria-label', `Ver en YouTube: ${item.titulo}`);
    }

    boton.appendChild(crearMiniatura(item));

    const play = document.createElement('span');
    play.className = 'short__play';
    play.setAttribute('aria-hidden', 'true');
    play.innerHTML = `<span>${interno ? '▶' : '↗'}</span>`;
    boton.appendChild(play);

    const titulo = document.createElement('p');
    titulo.className = 'short__titulo';
    titulo.textContent = item.titulo;

    figura.appendChild(boton);
    figura.appendChild(titulo);
    contenedor.appendChild(figura);
  });
}

/** Activa el movimiento solo mientras la sección está a la vista. */
function observarCarril(contenedor, alSalir) {
  if (!('IntersectionObserver' in window)) {
    contenedor.classList.add('videos__carriles--activo');
    return;
  }

  const observador = new IntersectionObserver(
    (entradas) => {
      const visible = entradas.some((entrada) => entrada.isIntersecting);
      contenedor.classList.toggle('videos__carriles--activo', visible);
      if (!visible) alSalir();
    },
    { rootMargin: '0px 0px -10% 0px' }
  );
  observador.observe(contenedor);
}

/* ===== Vista previa silenciosa al pasar el mouse ===== */

let previewActiva = null;
let temporizadorPreview = 0;

function detenerPreview() {
  window.clearTimeout(temporizadorPreview);
  temporizadorPreview = 0;
  if (previewActiva) {
    const iframe = previewActiva.querySelector('.video__preview');
    if (iframe) iframe.remove();
    const boton = previewActiva.querySelector('.video__boton');
    if (boton) boton.classList.remove('con-preview');
    previewActiva = null;
  }
}

function activarPreviews(contenedor) {
  if (!puedePrevisualizar()) return;

  contenedor.addEventListener('pointerover', (evento) => {
    const boton = evento.target.closest('.video__boton');
    // Las tarjetas externas no tienen índice: no abren reproductor.
    if (!boton || !boton.dataset.indice) return;
    const tarjeta = boton.closest('.video');
    if (!tarjeta || tarjeta === previewActiva) return;
    if (tarjeta.contains(evento.relatedTarget)) return;

    detenerPreview();
    previewActiva = tarjeta;

    const indice = Number(boton.dataset.indice);
    const item = VIDEOS[indice];
    if (!item) return;

    temporizadorPreview = window.setTimeout(() => {
      if (previewActiva !== tarjeta || !document.body.contains(tarjeta)) return;
      if (tarjeta.querySelector('.video__preview')) return;

      const iframe = document.createElement('iframe');
      iframe.className = 'video__preview';
      iframe.src = urlEmbedPreview(item.id);
      iframe.title = `Vista previa: ${item.titulo}`;
      iframe.setAttribute('aria-hidden', 'true');
      iframe.setAttribute('tabindex', '-1');
      iframe.setAttribute('allow', 'autoplay; encrypted-media; picture-in-picture');
      boton.appendChild(iframe);
      boton.classList.add('con-preview');
    }, RETARDO_PREVIEW);
  });

  contenedor.addEventListener('pointerout', (evento) => {
    const boton = evento.target.closest('.video__boton');
    if (!boton) return;
    const tarjeta = boton.closest('.video');
    if (!tarjeta || tarjeta !== previewActiva) return;
    if (tarjeta.contains(evento.relatedTarget)) return;
    detenerPreview();
  });
}

/* ===== Visor ===== */

function montarVisor(estado) {
  const visor = document.getElementById('video-lightbox');
  const marco = document.getElementById('video-lightbox-marco');
  const btnCerrar = document.getElementById('video-lightbox-cerrar');
  const btnPrev = document.getElementById('video-lightbox-prev');
  const btnSig = document.getElementById('video-lightbox-sig');
  const tipo = document.getElementById('video-lightbox-tipo');
  const contador = document.getElementById('video-lightbox-contador');
  const titulo = document.getElementById('video-lightbox-titulo');
  if (!visor || !marco || !btnCerrar || !btnPrev || !btnSig) return;

  const enfocables = [btnCerrar, btnPrev, btnSig];

  function limpiarMarco() {
    // Quitar el iframe corta la reproducción y libera el reproductor.
    marco.replaceChildren();
  }

  function mostrar(destino) {
    const total = estado.lista.length;
    if (!total) return;

    estado.posicion = (destino + total) % total;
    const item = estado.lista[estado.posicion];
    const vertical = item.esShort === true;

    limpiarMarco();
    marco.classList.toggle('lightbox__marco--vertical', vertical);

    const iframe = document.createElement('iframe');
    iframe.src = urlEmbedVideo(item.id);
    iframe.title = item.titulo;
    iframe.setAttribute('allow', 'autoplay; encrypted-media; picture-in-picture; fullscreen');
    iframe.setAttribute('allowfullscreen', '');
    marco.appendChild(iframe);

    if (tipo) tipo.textContent = vertical ? 'Short' : 'Video';
    if (contador) contador.textContent = `${estado.posicion + 1} de ${total}`;
    if (titulo) titulo.textContent = item.titulo;
  }

  function abrir(tipoTarjeta, indice) {
    estado.lista = tipoTarjeta === 'short'
      ? SHORTS.map((item) => ({ ...item, esShort: true }))
      : VIDEOS;
    if (!estado.lista.length) return;

    estado.elementoFoco = document.querySelector(
      `.${tipoTarjeta === 'short' ? 'short__boton' : 'video__boton'}[data-indice="${indice}"][data-tipo="${tipoTarjeta}"]`
    ) || document.activeElement;

    mostrar(indice);
    visor.classList.add('abierto');
    document.body.style.overflow = 'hidden';
    btnCerrar.focus();
  }

  function cerrar() {
    visor.classList.remove('abierto');
    document.body.style.overflow = '';
    limpiarMarco();
    if (estado.elementoFoco && typeof estado.elementoFoco.focus === 'function') {
      estado.elementoFoco.focus();
    }
    estado.elementoFoco = null;
  }

  document.addEventListener('click', (evento) => {
    const tarjeta = evento.target.closest('[data-tipo][data-indice]');
    if (!tarjeta) return;
    // Solo las tarjetas de esta sección: la galería usa data-indice sin data-tipo.
    const tipoTarjeta = tarjeta.dataset.tipo;
    if (tipoTarjeta !== 'video' && tipoTarjeta !== 'short') return;
    abrir(tipoTarjeta, Number(tarjeta.dataset.indice));
  });

  btnCerrar.addEventListener('click', cerrar);
  btnPrev.addEventListener('click', () => mostrar(estado.posicion - 1));
  btnSig.addEventListener('click', () => mostrar(estado.posicion + 1));

  visor.addEventListener('click', (evento) => {
    if (evento.target === visor) cerrar();
  });

  document.addEventListener('keydown', (evento) => {
    if (!visor.classList.contains('abierto')) return;

    if (evento.key === 'Escape') {
      cerrar();
    } else if (evento.key === 'ArrowLeft') {
      mostrar(estado.posicion - 1);
    } else if (evento.key === 'ArrowRight') {
      mostrar(estado.posicion + 1);
    } else if (evento.key === 'Tab') {
      evento.preventDefault();
      const actual = enfocables.indexOf(document.activeElement);
      const siguiente = evento.shiftKey
        ? (actual <= 0 ? enfocables.length - 1 : actual - 1)
        : (actual === -1 || actual === enfocables.length - 1 ? 0 : actual + 1);
      enfocables[siguiente].focus();
    }
  });
}
