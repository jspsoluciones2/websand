/**
 * Galería de fotografías reales del proceso formativo 2023.
 *
 * Presentación: dos carriles horizontales que se desplazan en sentidos
 * opuestos. Cada carril duplica su contenido para que el bucle no tenga
 * costura, y se pausa cuando la sección sale de pantalla, al pasar el mouse o
 * al llegar con el teclado (WCAG 2.2.2).
 *
 * Responsabilidades:
 * - Reparte las fotos alternando posición entre los dos carriles.
 * - Filtros por categoría que reconstruyen los carriles.
 * - Lightbox con teclado (Escape, flechas), focus trap, retorno de foco al
 *   botón que lo abrió y precarga de las imágenes vecinas.
 * - El movimiento de los carriles es CSS; GSAP solo aporta el revelado de
 *   entrada. Si el CDN de GSAP falla, la galería se ve y funciona igual.
 *
 * Los `alt` se generan con un patrón honesto (frase de categoría + posición),
 * porque el CSV no trae descripciones. Conviene reemplazarlos por descripciones
 * reales redactadas por el cliente cuando estén disponibles.
 */
import { GALERIA, CATEGORIAS, urlMiniatura, urlGrande } from './config.js';

const CONSULTA_MOVIMIENTO = '(prefers-reduced-motion: reduce)';

/** Velocidad de deriva de los carriles, en píxeles por segundo. */
const VELOCIDAD_CARRIL = 26;

/** Copias máximas de un bloque para cubrir pantallas anchas con filtros chicos. */
const MAX_VUELTAS = 8;

export function initGaleria() {
  const carriles = document.getElementById('galeria-carriles');
  if (!carriles) return;

  const estado = {
    categoria: 'todas',
    fotos: prepararFotos(),
    visibles: [],
  };

  montarFiltros(estado);
  montarLightbox(carriles, estado);
  render(estado);
  observarCarriles(carriles);
  animarEntrada(carriles);
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

/**
 * Marca la imagen para que salga del opacidad 0. `cloneNode` NO copia listeners,
 * así que esta función se aplica otra vez a cada copia del carril: sin eso los
 * clones se quedaban invisibles para siempre.
 */
function marcarCargada(img) {
  if (img.complete && img.naturalWidth > 0) {
    img.classList.add('cargada');
    return;
  }
  img.addEventListener('load', () => img.classList.add('cargada'), { once: true });
}

/** Construye la tarjeta (botón) de una foto. */
function crearTarjeta(foto) {
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
  img.src = urlMiniatura(foto);
  marcarCargada(img);

  boton.appendChild(img);
  return boton;
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
      render(estado, { animar: true });
    });

    contenedor.appendChild(boton);
    botones.push(boton);
  });
}

/**
 * Reconstruye los dos carriles con la categoría activa. Las tarjetas se crean
 * una sola vez (son las que navega el lightbox) y luego se clonan para el bucle.
 */
function render(estado, { animar = false } = {}) {
  const contenedor = document.getElementById('galeria-carriles');
  if (!contenedor) return;

  const seleccion = estado.categoria === 'todas'
    ? estado.fotos
    : estado.fotos.filter((foto) => foto.categoria === estado.categoria);

  const filas = [[], []];
  const tarjetas = new Map();

  seleccion.forEach((foto, posicion) => {
    const tarjeta = crearTarjeta(foto);
    tarjetas.set(foto.indice, tarjeta);
    filas[posicion % 2].push(tarjeta);
  });

  // El lightbox navega en el orden natural de la selección, no en el visual.
  estado.visibles = seleccion.map((foto) => tarjetas.get(foto.indice)).filter(Boolean);

  contenedor.replaceChildren();

  filas.forEach((fila, indiceFila) => {
    if (!fila.length) return;

    const envoltura = document.createElement('div');
    envoltura.className = 'galeria__carril-envoltura';

    const carril = document.createElement('div');
    carril.className = `galeria__carril galeria__carril--${indiceFila === 0 ? 'izq' : 'der'}`;
    fila.forEach((tarjeta) => carril.appendChild(tarjeta));

    envoltura.appendChild(carril);
    contenedor.appendChild(envoltura);

    duplicarCarril(carril, contenedor.clientWidth);
  });

  if (animar) animarCambio(contenedor);
}

/**
 * Clona una tarjeta para el bucle y la marca como decorativa: el teclado y el
 * lector de pantalla recorren solo la primera mitad, pero sigue siendo clicable
 * porque comparte data-indice con la original.
 */
function clonarTarjeta(tarjeta) {
  const clon = tarjeta.cloneNode(true);
  clon.classList.add('galeria__item--clon');
  clon.setAttribute('aria-hidden', 'true');
  clon.setAttribute('tabindex', '-1');
  // cloneNode no copia listeners: sin esto la copia se quedaría en opacidad 0.
  marcarCargada(clon.querySelector('img'));
  return clon;
}

/**
 * Prepara el bucle infinito: repite el bloque hasta cubrir el ancho visible y
 * después lo duplica. El desplazamiento de media anchura equivale a un bloque,
 * así que el salto final es imperceptible.
 */
function duplicarCarril(carril, anchoVisible) {
  const originales = [...carril.children];
  if (!originales.length) return;

  // Con movimiento reducido los carriles se vuelven una grilla estática: las
  // copias del bucle no se muestran y solo inflarían el DOM (el carril mide 0
  // porque pasa a display: contents y el bucle se dispararía al máximo).
  if (window.matchMedia(CONSULTA_MOVIMIENTO).matches) return;

  const ancho = () => carril.getBoundingClientRect().width;

  // Con filtros chicos (Clausura son 6 fotos por carril) un solo bloque podría
  // no cubrir la pantalla y se vería el hueco al final del recorrido.
  let vueltas = 1;
  while (ancho() > 0 && ancho() < anchoVisible && vueltas < MAX_VUELTAS) {
    originales.forEach((tarjeta) => carril.appendChild(clonarTarjeta(tarjeta)));
    vueltas++;
  }

  if (ancho() === 0) return;

  [...carril.children].forEach((nodo) => carril.appendChild(clonarTarjeta(nodo)));

  const mitad = ancho() / 2;
  if (mitad > 0) {
    carril.style.setProperty('--duracion', `${(mitad / VELOCIDAD_CARRIL).toFixed(1)}s`);
  }
}

/** Activa el movimiento solo mientras la sección está a la vista. */
function observarCarriles(contenedor) {
  const activar = (activo) => {
    contenedor.classList.toggle('galeria__carriles--activo', activo);
  };

  if (!('IntersectionObserver' in window)) {
    activar(true);
    return;
  }

  const observador = new IntersectionObserver(
    (entradas) => activar(entradas.some((entrada) => entrada.isIntersecting)),
    { rootMargin: '0px 0px -10% 0px' }
  );
  observador.observe(contenedor);
}

/**
 * Revelado de entrada con GSAP: opacidad + un desplazamiento corto, disparado
 * por ScrollTrigger. Los carriles no se tocan (su transform es de la animación
 * CSS): se anima la envoltura.
 */
function animarEntrada(contenedor) {
  const gsap = gsapDisponible();
  if (!gsap) return;

  const ScrollTrigger = window.ScrollTrigger;
  if (ScrollTrigger) gsap.registerPlugin(ScrollTrigger);

  const envolturas = [...contenedor.querySelectorAll('.galeria__carril-envoltura')];
  if (!envolturas.length) return;

  const mm = gsap.matchMedia();
  mm.add({ reduceMotion: CONSULTA_MOVIMIENTO }, (context) => {
    const mover = !context.conditions.reduceMotion;
    const vars = {
      autoAlpha: 0,
      x: mover ? -24 : 0,
      duration: mover ? 0.6 : 0,
      ease: 'power2.out',
      stagger: mover ? 0.12 : 0,
      clearProps: 'transform,opacity,visibility',
    };

    if (ScrollTrigger) {
      gsap.from(envolturas, {
        ...vars,
        scrollTrigger: { trigger: contenedor, start: 'top 82%', once: true },
      });
    } else {
      gsap.from(envolturas, vars);
    }
  });
}

/** Fundido corto al cambiar de filtro, ya que los carriles se reconstruyen. */
function animarCambio(contenedor) {
  const gsap = gsapDisponible();
  if (!gsap || window.matchMedia(CONSULTA_MOVIMIENTO).matches) return;

  const envolturas = [...contenedor.querySelectorAll('.galeria__carril-envoltura')];
  if (!envolturas.length) return;

  gsap.fromTo(
    envolturas,
    { autoAlpha: 0 },
    { autoAlpha: 1, duration: 0.28, ease: 'power1.out', stagger: 0.06, clearProps: 'opacity,visibility' }
  );
}

/**
 * Lightbox accesible. Navega sobre las tarjetas visibles (respetando el filtro),
 * atrapa el foco mientras está abierto y lo devuelve al elemento que lo abrió.
 */
function montarLightbox(contenedor, estado) {
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
    // Se devuelve el foco a la tarjeta que abrió el visor, no a `activeElement`:
    // en Safari y Firefox un clic con el mouse no enfoca el botón.
    elementoFoco = tarjeta;
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

  contenedor.addEventListener('click', (e) => {
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
