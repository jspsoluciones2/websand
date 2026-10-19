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

/** Fotos que se muestran por tanda. Con 53 imágenes remotas conviene escalonar. */
const POR_TANDA = 12;

export function initGaleria() {
  const grid = document.getElementById('galeria-grid');
  if (!grid) return;

  const fotos = prepararFotos();
  const tarjetas = montarTarjetas(grid, fotos);
  const estado = {
    categoria: 'todas',
    coincidentes: tarjetas.slice(),
    visibles: [],
    tarjetas,
    fotos,
    limite: POR_TANDA,
    limpiarEntrada: () => {},
  };

  montarFiltros(estado);
  montarLightbox(grid, estado);
  montarBotonMas(estado);
  pintar(estado);

  estado.limpiarEntrada = animarEntrada(estado.visibles);
}

/** Devuelve la instancia de GSAP si el CDN cargó; si no, null. */
function gsapDisponible() {
  return typeof window !== 'undefined' && window.gsap ? window.gsap : null;
}

/**
 * Intercala las fotos de las distintas categorías (una de cada una por vuelta).
 * El CSV agrupa por carpeta, así que sin esto "Todas" abría con doce fotos del
 * mismo acto y la primera fila mostraba tres tomas casi idénticas.
 */
function intercalarPorCategoria(lista) {
  const grupos = new Map();
  lista.forEach((foto) => {
    if (!grupos.has(foto.categoria)) grupos.set(foto.categoria, []);
    grupos.get(foto.categoria).push(foto);
  });

  const colas = [...grupos.values()];
  const orden = [];
  let quedan = lista.length;
  while (quedan > 0) {
    colas.forEach((cola) => {
      if (cola.length) {
        orden.push(cola.shift());
        quedan--;
      }
    });
  }
  return orden;
}

/**
 * Normaliza GALERIA y calcula, por foto, el alt con su posición dentro de la
 * categoría ("… — fotografía N de TOTAL").
 */
function prepararFotos() {
  const base = intercalarPorCategoria(GALERIA);
  const totales = {};
  base.forEach((foto) => {
    totales[foto.categoria] = (totales[foto.categoria] || 0) + 1;
  });

  const contador = {};
  return base.map((foto, indice) => {
    contador[foto.categoria] = (contador[foto.categoria] || 0) + 1;
    const categoria = CATEGORIAS.find((c) => c.id === foto.categoria);
    const frase = categoria ? categoria.fraseAlt : 'Proceso formativo 2023';
    return {
      indice,
      // El publicId se conserva: sin él no se puede construir la URL de Cloudinary.
      publicId: foto.publicId,
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
    img.alt = foto.alt;
    // Dimensiones intrínsecas de la miniatura: evitan el salto de layout (CLS).
    img.width = 600;
    img.height = 450;
    img.loading = 'lazy';
    img.decoding = 'async';
    // El fundido se engancha antes de asignar src para no perder un load rápido
    // (caché) ni el caso en que la imagen ya esté completa.
    img.addEventListener('load', () => img.classList.add('cargada'), { once: true });
    img.src = urlMiniatura(foto);
    if (img.complete) img.classList.add('cargada');

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
      estado.limite = POR_TANDA;
      botones.forEach((b) => b.setAttribute('aria-pressed', String(b === boton)));
      calcularCoincidentes(estado);
      pintar(estado, { animar: true });
    });

    contenedor.appendChild(boton);
    botones.push(boton);
  });
}

/** Recalcula el conjunto de tarjetas que corresponden a la categoría activa. */
function calcularCoincidentes(estado) {
  estado.coincidentes = estado.tarjetas.filter(
    (tarjeta) => estado.categoria === 'todas' || tarjeta.dataset.categoria === estado.categoria
  );
}

/**
 * Pinta el estado: muestra la tanda actual, actualiza `estado.visibles` (que es
 * lo que navega el lightbox) y sincroniza el botón "Ver más".
 */
function pintar(estado, { animar = false } = {}) {
  // Se memoriza lo que ya estaba en pantalla: al destapar otra tanda solo
  // animamos las nuevas, para que las anteriores no parpadeen.
  const previas = new Set(estado.visibles);
  const mostradas = [];

  estado.tarjetas.forEach((tarjeta) => {
    tarjeta.hidden = true;
  });

  estado.coincidentes.forEach((tarjeta, indice) => {
    if (indice < estado.limite) {
      tarjeta.hidden = false;
      mostradas.push(tarjeta);
    }
  });

  estado.visibles = mostradas;

  const boton = document.getElementById('galeria-mas');
  if (boton) {
    const restantes = estado.coincidentes.length - mostradas.length;
    boton.hidden = restantes <= 0;
    boton.textContent = restantes > 0
      ? `Ver más fotografías (${restantes})`
      : 'Ver más fotografías';
  }

  if (animar) {
    const nuevas = mostradas.filter((tarjeta) => !previas.has(tarjeta));
    animarCambio(estado, nuevas.length ? nuevas : mostradas);
  }
}

/** Monta el botón de paginación progresiva. */
function montarBotonMas(estado) {
  const boton = document.getElementById('galeria-mas');
  if (!boton) return;

  boton.addEventListener('click', () => {
    estado.limite += POR_TANDA;
    pintar(estado, { animar: true });
  });
}

/** Fade corto al cambiar de filtro o al destapar otra tanda. */
function animarCambio(estado, mostradas) {
  const gsap = gsapDisponible();
  if (!gsap) return;

  // La entrada inicial ya no sirve: matamos sus tweens y ScrollTriggers.
  gsap.killTweensOf(estado.tarjetas);
  estado.limpiarEntrada();

  if (window.matchMedia(CONSULTA_MOVIMIENTO).matches) return;

  gsap.fromTo(
    mostradas,
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
      stagger: mover ? { amount: 0.5 } : 0,
      // Devuelve el control del transform al CSS para que el hover no pelee
      // contra un transform inline que dejó GSAP.
      clearProps: 'transform,opacity,visibility',
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
  const etiquetaCategoria = document.getElementById('lightbox-categoria');
  const contador = document.getElementById('lightbox-contador');
  if (!lightbox || !imagen || !btnCerrar || !btnPrev || !btnSig) return;

  const enfocables = [btnCerrar, btnPrev, btnSig];
  let posicion = 0;
  let elementoFoco = null;

  /** Nombre visible de la categoría a partir de su id. */
  const nombreCategoria = (id) => {
    const encontrada = CATEGORIAS.find((categoria) => categoria.id === id);
    return encontrada ? encontrada.etiqueta : 'Galería';
  };

  /**
   * `estado.visibles` guarda elementos del DOM (no índices), así que la foto se
   * resuelve por su data-indice, que es la posición en `estado.fotos`.
   */
  const fotoDe = (tarjeta) => estado.fotos[Number(tarjeta.dataset.indice)];

  function precargar(destino) {
    const total = estado.visibles.length;
    if (!total) return;
    const tarjeta = estado.visibles[(destino + total) % total];
    if (!tarjeta) return;
    const precarga = new Image();
    precarga.src = urlGrande(fotoDe(tarjeta));
  }

  function mostrar(destino) {
    const total = estado.visibles.length;
    if (!total) return;
    posicion = (destino + total) % total;
    const foto = fotoDe(estado.visibles[posicion]);
    imagen.src = urlGrande(foto);
    imagen.alt = foto.alt;
    if (etiquetaCategoria) etiquetaCategoria.textContent = nombreCategoria(foto.categoria);
    if (contador) contador.textContent = `${posicion + 1} de ${total}`;
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
