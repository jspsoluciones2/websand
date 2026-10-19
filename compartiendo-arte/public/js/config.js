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
    youtube: "",
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