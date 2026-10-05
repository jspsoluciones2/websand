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