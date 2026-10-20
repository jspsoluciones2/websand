/**
 * Fuente única de verdad para las constantes configurables del sitio.
 * Cambia valores aquí sin tocar ningún otro archivo.
 */

export const CONFIG = {
  // Logotipo institucional (URL externa, ya optimizada por Cloudinary).
  // w_300 para navbar y footer; w_240 para favicon y og:image.
  LOGO_URL:
    "https://res.cloudinary.com/dvo5crvec/image/upload/f_auto,q_auto,w_300/ISOTIPO_odzqtv.png",

  // Logotipo pequeño para favicon y tarjeta social.
  LOGO_URL_SMALL:
    "https://res.cloudinary.com/dvo5crvec/image/upload/f_auto,q_auto,w_240/ISOTIPO_odzqtv.png",

  // Enlace directo a WhatsApp. Número pendiente de confirmación por el cliente.
  WHATSAPP_URL:
    "https://wa.me/573183084857?text=%C2%A1Hola!%20Quiero%20m%C3%A1s%20informaci%C3%B3n%20sobre%20la%20Corporaci%C3%B3n%20Compartiendo%20Arte",

  // Insertar aquí el código/URL del formulario de Tally cuando esté listo.
  TALLY_URL: "",

  // Insertar aquí el código de embed del asistente IA cuando esté listo.
  AI_EMBED_URL: "",

  // Perfiles de redes sociales. Insertar las URLs cuando el cliente las provea.
  SOCIAL_URLS: {
    tiktok: "",
    instagram: "",
    facebook: "",
    youtube: "https://www.youtube.com/@compartiendoarte",
  },

  // Endpoints de la API.
  API_BASE: "/api",
  API_CERTIFICADO: "/api/certificado",
};

/**
 * Imágenes del carrusel del hero (zona visual inicial).
 *
 * - Las URLs ya están transformadas por Cloudinary (w_2000, f_auto, q_auto).
 *   NO reescribir la ruta: aunque el original sea .png, f_auto puede servir
 *   JPEG/WebP y cambiar la extensión del archivo entregado.
 * - `ancho`/`alto` son las dimensiones intrínsecas para evitar CLS.
 * - `carga` define la prioridad de descarga: solo la primera imagen es "eager"
 *   porque es el LCP; las demás esperan en "lazy".
 *
 * Las mismas imágenes están declaradas en el HTML (para pintar el hero sin
 * depender de JavaScript y entregar el LCP cuanto antes). Este array es la
 * fuente de verdad del carrusel: slider.js genera los indicadores y sus
 * etiquetas a partir de él, así que al añadir o quitar una imagen hay que
 * actualizar también el <div class="hero__slides"> del HTML.
 */
export const SLIDES = [
  {
    src: "https://res.cloudinary.com/dvr2fk8w8/image/upload/f_auto,q_auto,c_limit,w_2000/Descubre_tu_talento_transforma_tu_mundo_ppdb3a.png",
    alt: "Descubre tu talento, transforma tu mundo: imagen de presentación de los procesos de formación artística.",
    ancho: 2000,
    alto: 1125,
    carga: "eager",
  },
  {
    src: "https://res.cloudinary.com/dvr2fk8w8/image/upload/f_auto,q_auto,c_limit,w_2000/Gemini_Generated_Image_exah8gexah8gexah_daoeuq.jpg",
    alt: "Imagen destacada de los talleres y actividades culturales de la Corporación.",
    ancho: 2000,
    alto: 1125,
    carga: "lazy",
  },
  {
    src: "https://res.cloudinary.com/dvr2fk8w8/image/upload/f_auto,q_auto,c_limit,w_2000/ChatGPT_Image_5_oct_2026_10_18_45_a.m._wwwl3y.png",
    alt: "Imagen destacada del trabajo de la Corporación con niños, niñas, adolescentes, jóvenes y adultos mayores.",
    ancho: 2000,
    alto: 800,
    carga: "lazy",
  },
];

/**
 * Categorías de la galería de fotografías reales.
 *
 * - `id` es el identificador interno y coincide con el que se deriva de la
 *   carpeta del publicId.
 * - `etiqueta` es el texto visible en la barra de filtros.
 * - `fraseAlt` alimenta el atributo alt de cada foto (el CSV no trae
 *   descripciones, así que se compone una frase honesta por categoría).
 */
export const CATEGORIAS = [
  { id: "clausura", etiqueta: "Clausura", fraseAlt: "Clausura del proceso formativo 2023" },
  { id: "vestuario", etiqueta: "Vestuario", fraseAlt: "Proceso formativo 2023: vestuario" },
  { id: "invitacion", etiqueta: "Invitación", fraseAlt: "Sesión de fotos para la invitación del proceso formativo 2023" },
];

/**
 * Galería de fotografías reales del proceso formativo 2023.
 *
 * DE DÓNDE SALEN LOS DATOS:
 *   Provienen de `urlsIMG.csv` (raíz del repositorio), que NO se sirve en
 *   producción. Se parseó una sola vez y el resultado quedó embebido aquí como
 *   fuente única de verdad; para actualizar la galería hay que regenerar este
 *   array a partir del CSV.
 *
 * - `publicId` es el identificador de Cloudinary SIN extensión: se omite a
 *   propósito para que `f_auto` elija el mejor formato (WebP/AVIF) al servir.
 *   Forzar `.jpg` haría que Cloudinary respetara ese formato y se perdiera la
 *   entrega optimizada.
 * - `categoria` se deriva de la carpeta del publicId y coincide con un `id` de
 *   CATEGORIAS.
 *
 * Conteo verificado: 53 fotos (12 clausura + 29 vestuario + 12 invitación),
 * sin public_id duplicados y sin extensión.
 */
export const GALERIA = [
  { publicId: "proceso-formativo-2023/FOTOS DE CLAUSURA/IMG_20231030_163736", categoria: "clausura" },
  { publicId: "proceso-formativo-2023/FOTOS DE CLAUSURA/IMG_20231030_163738", categoria: "clausura" },
  { publicId: "proceso-formativo-2023/FOTOS DE CLAUSURA/IMG_20231030_163752", categoria: "clausura" },
  { publicId: "proceso-formativo-2023/FOTOS DE CLAUSURA/IMG_20231030_163806_1", categoria: "clausura" },
  { publicId: "proceso-formativo-2023/FOTOS DE CLAUSURA/IMG_20231030_163806", categoria: "clausura" },
  { publicId: "proceso-formativo-2023/FOTOS DE CLAUSURA/IMG_20231030_165803", categoria: "clausura" },
  { publicId: "proceso-formativo-2023/FOTOS DE CLAUSURA/IMG_20231030_170658", categoria: "clausura" },
  { publicId: "proceso-formativo-2023/FOTOS DE CLAUSURA/IMG_20231030_172342_1", categoria: "clausura" },
  { publicId: "proceso-formativo-2023/FOTOS DE CLAUSURA/IMG_20231030_172342", categoria: "clausura" },
  { publicId: "proceso-formativo-2023/FOTOS DE CLAUSURA/IMG_20231030_172527_1", categoria: "clausura" },
  { publicId: "proceso-formativo-2023/FOTOS DE CLAUSURA/IMG_20231030_172527", categoria: "clausura" },
  { publicId: "proceso-formativo-2023/FOTOS DE CLAUSURA/IMG_20231030_172610", categoria: "clausura" },
  { publicId: "proceso-formativo-2023/FOTOS VESTUARIO/IMG_20231028_092851973", categoria: "vestuario" },
  { publicId: "proceso-formativo-2023/FOTOS VESTUARIO/IMG_20231028_092933139", categoria: "vestuario" },
  { publicId: "proceso-formativo-2023/FOTOS VESTUARIO/IMG_20231028_093317179", categoria: "vestuario" },
  { publicId: "proceso-formativo-2023/FOTOS VESTUARIO/IMG_20231028_093401626", categoria: "vestuario" },
  { publicId: "proceso-formativo-2023/FOTOS VESTUARIO/IMG_20231028_093913843", categoria: "vestuario" },
  { publicId: "proceso-formativo-2023/FOTOS VESTUARIO/IMG_20231028_093942910", categoria: "vestuario" },
  { publicId: "proceso-formativo-2023/FOTOS VESTUARIO/IMG_20231028_094201658", categoria: "vestuario" },
  { publicId: "proceso-formativo-2023/FOTOS VESTUARIO/IMG_20231028_094426366", categoria: "vestuario" },
  { publicId: "proceso-formativo-2023/FOTOS VESTUARIO/IMG_20231028_094517993", categoria: "vestuario" },
  { publicId: "proceso-formativo-2023/FOTOS VESTUARIO/IMG_20231028_094604402", categoria: "vestuario" },
  { publicId: "proceso-formativo-2023/FOTOS VESTUARIO/IMG_20231028_094703118_1", categoria: "vestuario" },
  { publicId: "proceso-formativo-2023/FOTOS VESTUARIO/IMG_20231028_094704966", categoria: "vestuario" },
  { publicId: "proceso-formativo-2023/FOTOS VESTUARIO/IMG_20231028_094716066", categoria: "vestuario" },
  { publicId: "proceso-formativo-2023/FOTOS VESTUARIO/IMG_20231102_150744865_BURST000_COVER_COMP", categoria: "vestuario" },
  { publicId: "proceso-formativo-2023/FOTOS VESTUARIO/IMG_20231102_153316", categoria: "vestuario" },
  { publicId: "proceso-formativo-2023/FOTOS VESTUARIO/IMG_20231102_153337", categoria: "vestuario" },
  { publicId: "proceso-formativo-2023/FOTOS VESTUARIO/IMG_20231102_153342", categoria: "vestuario" },
  { publicId: "proceso-formativo-2023/FOTOS VESTUARIO/IMG_20231102_154148", categoria: "vestuario" },
  { publicId: "proceso-formativo-2023/FOTOS VESTUARIO/IMG_20231102_154217", categoria: "vestuario" },
  { publicId: "proceso-formativo-2023/FOTOS VESTUARIO/IMG_20231102_154218", categoria: "vestuario" },
  { publicId: "proceso-formativo-2023/FOTOS VESTUARIO/IMG_20231102_154854", categoria: "vestuario" },
  { publicId: "proceso-formativo-2023/FOTOS VESTUARIO/IMG_20231102_154903", categoria: "vestuario" },
  { publicId: "proceso-formativo-2023/FOTOS VESTUARIO/IMG20231102150819", categoria: "vestuario" },
  { publicId: "proceso-formativo-2023/FOTOS VESTUARIO/IMG20231102152347_1", categoria: "vestuario" },
  { publicId: "proceso-formativo-2023/FOTOS VESTUARIO/IMG20231102153308", categoria: "vestuario" },
  { publicId: "proceso-formativo-2023/FOTOS VESTUARIO/IMG20231102155911", categoria: "vestuario" },
  { publicId: "proceso-formativo-2023/FOTOS VESTUARIO/IMG20231102155953", categoria: "vestuario" },
  { publicId: "proceso-formativo-2023/FOTOS VESTUARIO/IMG20231102155955_01", categoria: "vestuario" },
  { publicId: "proceso-formativo-2023/TOMA DE FOTOS PARA INVITACIÓN/HALLOWEEN", categoria: "invitacion" },
  { publicId: "proceso-formativo-2023/TOMA DE FOTOS PARA INVITACIÓN/IMG_20231012_154210905", categoria: "invitacion" },
  { publicId: "proceso-formativo-2023/TOMA DE FOTOS PARA INVITACIÓN/IMG_20231012_154212826", categoria: "invitacion" },
  { publicId: "proceso-formativo-2023/TOMA DE FOTOS PARA INVITACIÓN/IMG_20231012_154215069", categoria: "invitacion" },
  { publicId: "proceso-formativo-2023/TOMA DE FOTOS PARA INVITACIÓN/IMG_20231012_154220105", categoria: "invitacion" },
  { publicId: "proceso-formativo-2023/TOMA DE FOTOS PARA INVITACIÓN/IMG_20231012_155505862", categoria: "invitacion" },
  { publicId: "proceso-formativo-2023/TOMA DE FOTOS PARA INVITACIÓN/IMG_20231012_155535934", categoria: "invitacion" },
  { publicId: "proceso-formativo-2023/TOMA DE FOTOS PARA INVITACIÓN/IMG_20231012_155537896", categoria: "invitacion" },
  { publicId: "proceso-formativo-2023/TOMA DE FOTOS PARA INVITACIÓN/IMG_20231012_155544321", categoria: "invitacion" },
  { publicId: "proceso-formativo-2023/TOMA DE FOTOS PARA INVITACIÓN/IMG_20231012_160043441", categoria: "invitacion" },
  { publicId: "proceso-formativo-2023/TOMA DE FOTOS PARA INVITACIÓN/IMG_20231012_160057001", categoria: "invitacion" },
  { publicId: "proceso-formativo-2023/TOMA DE FOTOS PARA INVITACIÓN/IMG_20231012_160206347", categoria: "invitacion" },
  { publicId: "proceso-formativo-2023/FOTOS VESTUARIO/IMG_20231102_150854", categoria: "vestuario" },
];

/* Base de entrega de Cloudinary (cuenta dvo5crvec, distinta de la del hero). */
const CLOUDINARY_BASE = "https://res.cloudinary.com/dvo5crvec/image/upload";

/* Miniatura 4:3 para la grilla; coincide con las dimensiones 600x450 del HTML. */
const TRANSFORM_MINIATURA = "f_auto,q_auto,c_fill,w_600,h_450,g_auto";

/* Versión grande para el lightbox: limita el ancho sin recortar. */
const TRANSFORM_GRANDE = "f_auto,q_auto,c_limit,w_1600";

/**
 * Codifica cada segmento de la ruta por separado. Los public_id contienen
 * espacios y acentos (p. ej. la carpeta "TOMA DE FOTOS PARA INVITACIÓN"); si se
 * codificara la ruta entera, Cloudinary no resolvería las barras separadoras.
 */
export const codificarRuta = (publicId) =>
  publicId.split("/").map(encodeURIComponent).join("/");

/** URL optimizada de la miniatura de una foto de la galería. */
export function urlMiniatura(foto) {
  return `${CLOUDINARY_BASE}/${TRANSFORM_MINIATURA}/${codificarRuta(foto.publicId)}`;
}

/** URL optimizada de la versión grande de una foto de la galería. */
export function urlGrande(foto) {
  return `${CLOUDINARY_BASE}/${TRANSFORM_GRANDE}/${codificarRuta(foto.publicId)}`;
}

/* ===== Videos y shorts del canal de YouTube ===== */

/**
 * Selección curada del canal. El CSV original trae 27 videos, pero varios
 * repiten el mismo título y el mismo proyecto con distinta duración; mostrar
 * los 27 en el carril hacía que la sección se leyera como un error. Esta lista
 * prioriza las piezas con identidad propia y ordena el recorrido: módulos,
 * memoria, muestra, clausura y convocatorias. El resto sigue disponible en el
 * canal (botón "Ver todo el canal").
 *
 * Para sumar una pieza basta con agregar `{ id, titulo, duracion }`: el id es
 * el fragmento `v=` de la URL de YouTube.
 */
export const VIDEOS = [
  { id: "O9M1ekZUNac", titulo: "Módulo 1 · Mi cuerpo, mi primera danza", duracion: "1:01" },
  { id: "l_EU2HU1ckM", titulo: "Módulo 2 · Raíces y memorias en movimiento", duracion: "1:17" },
  { id: "PB0-ANXa2_E", titulo: "Módulo 3 · Ritmos que nos unen", duracion: "1:49" },
  { id: "2IRfS6-MM9A", titulo: "Módulo 5 · La danza que inspira liderazgo", duracion: "1:27" },
  { id: "88Sn_P1Q_Fc", titulo: "Video memoria · Transforma tu vida a través de la danza", duracion: "6:28" },
  { id: "7VlMvit8R14", titulo: "Muestra artística del proceso formativo", duracion: "3:16" },
  { id: "LSQgRRRZJFc", titulo: "Clausura · Transforma tu vida a través de la danza", duracion: "5:34" },
  { id: "pesZSikVMHU", titulo: "Invitación a la clausura", duracion: "0:11" },
  { id: "j_xbctUKbho", titulo: "Resumen · Transformando culturas", duracion: "3:30" },
  { id: "1BKKNPWggJM", titulo: "Fénix · Transformando vidas a través de la pintura", duracion: "6:36" },
  { id: "YHZBdW-U1BI", titulo: "Ensayos del proceso formativo", duracion: "3:21" },
  { id: "7cYGB8KoNHM", titulo: "Proceso formativo en danza", duracion: "4:00" },
  { id: "w8FJ4CgqJoM", titulo: "Proceso formativo · Compartiendo Arte", duracion: "3:21" },
  { id: "mXIefShrhww", titulo: "ABC · Convocatoria para organizaciones comunitarias", duracion: "4:32" },
  { id: "1N_QRJJdSwY", titulo: "Fénix · Convocatoria ICBF", duracion: "2:54" },
  { id: "uaWJ0oUgO5c", titulo: "Inscripciones · Transformando culturas", duracion: "0:06" },
];

/**
 * Shorts (video vertical 9:16). Se muestran en un bloque estático y chico, no
 * en el carril: mezclar 16:9 con 9:16 en una misma fila rompe la alineación.
 */
export const SHORTS = [
  { id: "zrHDEDQVW-c", titulo: "31 de julio de 2026" },
  { id: "lbYfpJc45tg", titulo: "Niños, niñas y adolescentes beneficiarios del proyecto" },
  { id: "gPZ9y2ViWGg", titulo: "Proceso formativo en danza" },
  { id: "-R1rEerz0VY", titulo: "Convocatoria · Transformando culturas" },
  { id: "bHI2ykuXESI", titulo: "Transforma tu vida a través de la danza" },
];

const YOUTUBE_THUMB = "https://i.ytimg.com/vi";

/**
 * Videos que YouTube no permite embeber (error 150: contenido marcado como
 * "hecho para niños" o embedding desactivado por el canal). No es un problema
 * del sitio y no se arregla con parámetros: el reproductor responde con un
 * cartel de error. Para esos, la tarjeta abre YouTube en una pestaña nueva.
 *
 * Si el canal habilita el embedding más adelante, basta con sacar el id de
 * esta lista.
 */
const SIN_EMBED = new Set([
  "7VlMvit8R14",
  "LSQgRRRZJFc",
  "pesZSikVMHU",
  "j_xbctUKbho",
  "YHZBdW-U1BI",
  "w8FJ4CgqJoM",
  "zrHDEDQVW-c",
  "lbYfpJc45tg",
  "gPZ9y2ViWGg",
]);

/** Indica si el video se puede reproducir dentro del sitio. */
export const esEmbebible = (id) => !SIN_EMBED.has(id);

/** URL pública del video en YouTube (para las tarjetas externas). */
export const urlVideoYouTube = (id) => `https://www.youtube.com/watch?v=${id}`;

/**
 * Miniatura de YouTube. Se usa `hqdefault` (480×360) y no `maxresdefault`
 * (1280×720) a propósito: la de alta resolución falta en algunos videos y
 * pesa cuatro veces más. A 420 px de ancho la diferencia no se nota y en
 * conexiones rurales el ahorro sí.
 */
export const urlMiniaturaVideo = (id) => `${YOUTUBE_THUMB}/${id}/hqdefault.jpg`;

/** Respaldo liviano por si `hqdefault` no estuviera disponible. */
export const urlMiniaturaVideoAlterna = (id) => `${YOUTUBE_THUMB}/${id}/mqdefault.jpg`;

/**
 * Reproductor del visor. `youtube-nocookie` evita cookies de YouTube hasta que
 * la persona decide reproducir: el sitio publica imágenes de menores.
 */
export const urlEmbedVideo = (id) =>
  `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1&playsinline=1`;

/**
 * Vista previa silenciosa para el hover del carril: sin controles, en bucle y
 * sin sonido, que es lo único que el navegador permite autoreproducir.
 */
export const urlEmbedPreview = (id) =>
  `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&mute=1&controls=0&loop=1&playlist=${id}&rel=0&modestbranding=1&playsinline=1`;

/** Canal institucional, destino del botón de cierre de la sección. */
export const CANAL_YOUTUBE = "https://www.youtube.com/@compartiendoarte";