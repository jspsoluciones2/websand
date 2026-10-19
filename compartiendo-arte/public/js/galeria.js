/**
 * Galería de fotografías reales del proceso formativo 2023.
 *
 * Responsabilidades:
 * - Construye las tarjetas (4:3 con object-fit: cover, alturas uniformes).
 * - Barra de filtros por categoría accesible (aria-pressed dentro de un group).
 * - Lightbox con teclado (Escape, flechas), focus trap, retorno de foco al
 *   botón que lo abrió y precarga de las imágenes vecinas.
 * - Animaciones GSAP discretas y opcionales. Si el CDN de GSAP no carga, la
 *   galería se ve y funciona igual: el estado oculto solo lo aplica gsap.from()
 *   y nunca el CSS.
 *
 * Los `alt` se generan con un patrón honesto (frase de categoría + posición),
 * porque el CSV no trae descripciones. Conviene reemplazarlos por descripciones
 * reales redactadas por el cliente cuando estén disponibles.
 */
import { GALERIA, CATEGORIAS, urlMiniatura, urlGrande } from './config.js';

const CONSULTA_MOVIMIENTO = '(prefers-reduced-motion: reduce)';

export function initGaleria() {
  const grid = document.getElementById('galeria-grid');
  if (!grid) return;

  const fotos = prepararFotos();
  const tarjetas = montarTarjetas(grid, fotos);
  const estado = {
    categoria: 'todas',
    visibles: tarjetas.slice(),
    tarjetas,
    fotos,
    limpiarEntrada: () => {},
  };

  montarFiltros(estado);
  montarLightbox(grid, estado);

  // Cuando GSAP toma el control del transform quitamos la transición CSS de
  // transform para que no amortigüe cada frame; box-shadow y border-color se
  // siguen transicionando por CSS.
  if (gsapDisponible()) grid.classList.add('galeria--gsap');

  estado.limpiarEntrada = animarEntrada(tarjetas);
  animarHover(tarjetas);
}

/** Devuelve la instancia de GSAP si el CDN cargó; si no, null. */
function gsapDisponible() {
  return typeof window !== 'undefined' && window.gsap ? window.gsap : null;
}

/**
 * Normaliza GALERIA y calcula, por foto, el alt con su posición dentro de la
 * categoría ("… — fotografía N de TOTAL").
 */
function prepararFotos() {
  const totales = {};
  GALERIA.forEach((foto) => {
    totales[foto.categoria] = (totales[foto.categoria] || 0) + 1;
  });

  const contador = {};
  return GALERIA.map((foto, indice) => {
    contador[foto.categoria] = (contador[foto.categoria] || 0) + 1;
    const categoria = CATEGORIAS.find((c) => c.id === foto.categoria);
    const frase = categoria ? categoria.fraseAlt : 'Proceso formativo 2023';
    return {
      indice,
      categoria: foto.categoria,
      alt: `${frase} — fotografía ${contador[foto.categoria]} de ${totales[foto.categoria]}`,
    };
  });
}

/** Construye una tarjeta (botón) por foto y las monta en el grid. */
function montarTarjetas(grid, fotos) {
  const fragmento = document.createDocumentFragment();
  const tarjetas = [];

  fotos.forEach((foto) => {
    const boton = document.createElement('button');
    boton.type = 'button';
    boton.className = 'galeria__item';
    boton.dataset.indice = String(foto.indice);
    boton.dataset.categoria = foto.categoria;
    boton.setAttribute('aria-label', `Ampliar fotografía: ${foto.alt}`);

    const img = document.createElement('img');
    img.src = urlMiniatura(foto);
    img.alt = foto.alt;
    // Dimensiones intrínsecas de la miniatura: evitan el salto de layout (CLS).
    img.width = 600;
    img.height = 450;
    img.loading = 'lazy';
    img.decoding = 'async';

    boton.appendChild(img);
    fragmento.appendChild(boton);
    tarjetas.push(boton);
  });

  grid.appendChild(fragmento);
  return tarjetas;
}

/** Crea los botones de filtro (Todas + categorías con sus conteos). */
function montarFiltros(estado) {
  const contenedor = document.getElementById('galeria-filtros');
  if (!contenedor) return;

  const opciones = [
    { id: 'todas', etiqueta: 'Todas', total: estado.fotos.length },
    ...CATEGORIAS.map((categoria) => ({
      id: categoria.id,
      etiqueta: categoria.etiqueta,
      total: estado.fotos.filter((foto) => foto.categoria === categoria.id).length,
    })),
  ];

  const botones = [];
  opciones.forEach((opcion) => {
    const boton = document.createElement('button');
    boton.type = 'button';
    boton.className = 'galeria__filtro';
    boton.dataset.categoria = opcion.id;
    boton.textContent = `${opcion.etiqueta} (${opcion.total})`;
    boton.setAttribute('aria-pressed', String(opcion.id === 'todas'));

    boton.addEventListener('click', () => {
      if (estado.categoria === opcion.id) return;
      estado.categoria = opcion.id;
      botones.forEach((b) => b.setAttribute('aria-pressed', String(b === boton)));
      aplicarFiltro(estado, opcion.id);
    });

    contenedor.appendChild(boton);
    botones.push(boton);
  });
}

/** Muestra/oculta tarjetas según la categoría y hace un fade discreto. */
function aplicarFiltro(estado, categoria) {
  const visibles = [];
  estado.tarjetas.forEach((tarjeta) => {
    const coincide = categoria === 'todas' || tarjeta.dataset.categoria === categoria;
    tarjeta.hidden = !coincide;
    if (coincide) visibles.push(tarjeta);
  });
  estado.visibles = visibles;

  const gsap = gsapDisponible();
  if (!gsap) return;

  // La entrada inicial ya no sirve: matamos sus tweens y ScrollTriggers.
  gsap.killTweensOf(estado.tarjetas);
  estado.limpiarEntrada();

  if (window.matchMedia(CONSULTA_MOVIMIENTO).matches) return;

  gsap.fromTo(
    visibles,
    { autoAlpha: 0 },
    { autoAlpha: 1, duration: 0.22, ease: 'power1.out', overwrite: true, clearProps: 'opacity,visibility' }
  );
}

/**
 * Entrada de las tarjetas con GSAP: autoAlpha + un desplazamiento vertical
 * chico, con stagger, disparada por ScrollTrigger para las que están fuera de
 * pantalla. Con movimiento reducido las duraciones son 0 y no hay desplazamiento.
 * Devuelve una función que revierte todo (para limpiar al re-filtrar).
 */
function animarEntrada(tarjetas) {
  const gsap = gsapDisponible();
  if (!gsap) return () => {};

  const ScrollTrigger = window.ScrollTrigger;
  if (ScrollTrigger) gsap.registerPlugin(ScrollTrigger);

  const mm = gsap.matchMedia();
  mm.add({ reduceMotion: CONSULTA_MOVIMIENTO }, (context) => {
    const mover = !context.conditions.reduceMotion;
    const vars = {
      autoAlpha: 0,
      y: mover ? 18 : 0,
      duration: mover ? 0.5 : 0,
      ease: 'power2.out',
      stagger: mover ? { amount: 0.6 } : 0,
    };

    if (ScrollTrigger) {
      gsap.from(tarjetas, {
        ...vars,
        scrollTrigger: { trigger: '#galeria-grid', start: 'top 82%', once: true },
      });
    } else {
      gsap.from(tarjetas, vars);
    }
  });

  // matchMedia revierte por su cuenta los tweens y ScrollTriggers que creó.
  return () => mm.revert();
}

/** Micro-interacción de hover: solo un scale mínimo, dentro de 150–300 ms. */
function animarHover(tarjetas) {
  const gsap = gsapDisponible();
  if (!gsap || window.matchMedia(CONSULTA_MOVIMIENTO).matches) return;

  tarjetas.forEach((tarjeta) => {
    tarjeta.addEventListener('pointerenter', () => {
      gsap.to(tarjeta, { scale: 1.03, duration: 0.18, ease: 'power1.out', overwrite: 'auto' });
    });
    tarjeta.addEventListener('pointerleave', () => {
      gsap.to(tarjeta, { scale: 1, duration: 0.18, ease: 'power1.out', overwrite: 'auto' });
    });
  });
}

/**
 * Lightbox accesible. Navega sobre las tarjetas visibles (respetando el filtro),
 * atrapa el foco mientras está abierto y lo devuelve al elemento que lo abrió.
 */
function montarLightbox(grid, estado) {
  const lightbox = document.getElementById('lightbox');
  const imagen = document.getElementById('lightbox-imagen');
  const btnCerrar = document.getElementById('lightbox-cerrar');
  const btnPrev = document.getElementById('lightbox-prev');
  const btnSig = document.getElementById('lightbox-sig');
  if (!lightbox || !imagen || !btnCerrar || !btnPrev || !btnSig) return;

  const enfocables = [btnCerrar, btnPrev, btnSig];
  let posicion = 0;
  let elementoFoco = null;

  function precargar(destino) {
    const indice = estado.visibles[destino];
    if (indice === undefined) return;
    const precarga = new Image();
    precarga.src = urlGrande(estado.fotos[indice]);
  }

  function mostrar(destino) {
    const total = estado.visibles.length;
    if (!total) return;
    posicion = (destino + total) % total;
    const foto = estado.fotos[estado.visibles[posicion]];
    imagen.src = urlGrande(foto);
    imagen.alt = foto.alt;
    precargar(posicion - 1);
    precargar(posicion + 1);
  }

  function abrir(tarjeta) {
    const indice = Number(tarjeta.dataset.indice);
    const destino = estado.visibles.findIndex((t) => Number(t.dataset.indice) === indice);
    if (destino === -1) return;
    elementoFoco = document.activeElement;
    mostrar(destino);
    lightbox.classList.add('abierto');
    document.body.style.overflow = 'hidden';
    btnCerrar.focus();
  }

  function cerrar() {
    lightbox.classList.remove('abierto');
    document.body.style.overflow = '';
    if (elementoFoco && typeof elementoFoco.focus === 'function') elementoFoco.focus();
    elementoFoco = null;
  }

  grid.addEventListener('click', (e) => {
    const tarjeta = e.target.closest('.galeria__item[data-indice]');
    if (tarjeta) abrir(tarjeta);
  });

  btnCerrar.addEventListener('click', cerrar);
  btnPrev.addEventListener('click', () => mostrar(posicion - 1));
  btnSig.addEventListener('click', () => mostrar(posicion + 1));

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) cerrar();
  });

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('abierto')) return;

    if (e.key === 'Escape') {
      cerrar();
    } else if (e.key === 'ArrowLeft') {
      mostrar(posicion - 1);
    } else if (e.key === 'ArrowRight') {
      mostrar(posicion + 1);
    } else if (e.key === 'Tab') {
      // Focus trap: el foco cicla entre los controles del visor.
      e.preventDefault();
      const actual = enfocables.indexOf(document.activeElement);
      const siguiente = e.shiftKey
        ? (actual <= 0 ? enfocables.length - 1 : actual - 1)
        : (actual === -1 || actual === enfocables.length - 1 ? 0 : actual + 1);
      enfocables[siguiente].focus();
    }
  });
}
