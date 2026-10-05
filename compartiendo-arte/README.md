# Sitio Web — Corporación Compartiendo Arte

Sitio institucional de la Corporación Artística y Cultural Compartiendo Arte en Norte de Santander. JavaScript puro modular (sin frameworks, sin bundler, sin paso de build), desplegado en Cloudflare Workers: assets estáticos + endpoint de API para la consulta de certificados.

## Requisitos

- Node.js 18 o superior
- Wrangler (CLI de Cloudflare). Instalación global: `npm install -g wrangler`
- Sesión de Cloudflare activa: `wrangler login`

## Comandos

| Acción | Comando |
|---|---|
| Servidor local (http://localhost:8787) | `npm run dev` |
| Desplegar a producción (`*.workers.dev`) | `npm run deploy` |

## Estructura

```
compartiendo-arte/
├── wrangler.jsonc       → configuración de Cloudflare Workers
├── src/worker.js        → API /api/certificado (consulta por número de documento)
└── public/              → sitio estático
    ├── index.html       → página principal (one-page)
    ├── politicas.html   → políticas de datos, privacidad y términos
    ├── css/styles.css   → estilos (tokens de marca en :root)
    └── js/
        ├── config.js       ★ CONSTANTES CONFIGURABLES (WhatsApp, Tally, IA, logo, carrusel)
        ├── main.js         → punto de entrada
        ├── slider.js       → carrusel del hero (teclado, auto-avance, reduced motion)
        ├── reveal.js       → revelado de bloques al entrar en pantalla
        ├── navbar.js       → navegación, scroll-spy y menú móvil
        ├── widget.js       → botón flotante de contacto y modales
        ├── galeria.js      → galería de fotos (array FOTOS) + lightbox
        ├── social.js       → enlaces de redes sociales
        └── certificados.js → lógica de consulta de certificados
```

## Sistema visual

Los tokens de marca viven en `:root` dentro de `public/css/styles.css`:

| Token | Valor | Uso |
|---|---|---|
| `--purple` | `#4B3C8C` | Botones primarios, títulos, footer, sección de certificados |
| `--yellow` | `#FFCD00` | Acento y firma cromática (siempre con texto `--dark`) |
| `--dark` / `--gray` | `#504F4E` / `#888888` | Texto principal y secundario |
| `--surface` / `--surface-warm` | `#F7F6F8` / `#FAF8F2` | Fondos de apoyo y fichas de datos |
| `--border` | `#E5E3E7` | Bordes de tarjeta y separadores |
| `--shadow-soft` | `0 8px 24px rgba(80,79,78,.10)` | Elevación sutil en hover |

Espaciado en múltiplos de 4px (`--space-1` … `--space-11`), radios 4/6/8px
(`--radius-sm|md|lg`) y un único valor de transición (`--transition: 220ms ease`).
La tipografía es **Nunito Sans** (400/600/700/800) desde Google Fonts.

Están prohibidos —y no aparecen en el código— glassmorphism, 3D, partículas,
parallax agresivo, sombras pesadas, gradientes decorativos, botones cápsula,
efectos de fotos pegadas con cinta, rotación de tarjetas y estética SaaS/neón.

## Carrusel del hero

- Las tres imágenes están declaradas en `index.html` (así el LCP no depende de
  JavaScript) y también en el array `SLIDES` de `public/js/config.js`, que
  `slider.js` usa para generar los indicadores y las etiquetas accesibles.
- Overlay de legibilidad sobre la foto: un gradiente horizontal (oscuro a la
  izquierda → transparente a la derecha) más un velo vertical. En móvil el velo
  sube para mantener contraste AA sobre el texto a ancho completo.
- Auto-avance cada 6 s; se detiene con hover, con foco dentro del carrusel y
  cuando la pestaña pasa a segundo plano. Teclado `←` / `→`. Desactivado con
  `prefers-reduced-motion`.

## Revelado de secciones

`public/js/reveal.js` aplica una transición de entrada (opacidad + 22px de
desplazamiento) a `.reveal` y `.cabecera-seccion` con `IntersectionObserver`.
El estado inicial oculto se activa **solo** cuando el JS corre (clase
`tiene-reveal` en `<html>`), así que sin JavaScript el contenido queda visible.
Con `prefers-reduced-motion` no hay animación.

## Constantes configurables (`public/js/config.js`)

- **WHATSAPP_URL**: enlace directo de WhatsApp (número pendiente de confirmación por el cliente).
- **TALLY_URL**: código/URL del formulario de Tally (pendiente).
- **AI_EMBED_URL**: código de embed del asistente IA (pendiente).
- **LOGO_URL** / **LOGO_URL_SMALL**: logo desde Cloudinary con transformación automática de formato y ancho.
- **SLIDES**: imágenes del carrusel del hero (URL con `f_auto,q_auto,c_limit,w_2000`, `alt`, dimensiones y estrategia de carga).

También hay contenedores preparados con comentarios en el HTML:
`#tally-form-container`, `#tally-modal-container` y `#ai-assistant-container`.

## Fotos de la galería

Agregar entradas al array `FOTOS` en `public/js/galeria.js`:

```js
{ src: 'img/taller.jpg', alt: 'Descripción de la foto', categoria: 'Danza' }
```

Mientras esté vacío se muestran tarjetas de marcador de posición.

## Certificados

- La consulta se hace por **número de documento** contra `/api/certificado`.
- El registro de demostración vive en `src/worker.js` (Map `CERTIFICADOS_DEMO`); el documento `123456789` devuelve un certificado de ejemplo.
- La emisión real de PDFs y su fuente de datos (KV/D1) se definirá en una fase posterior.
- El endpoint incluye un limitador de intentos básico en memoria; para producción se recomienda reglas WAF de Cloudflare o un binding KV.

## Notas de accesibilidad y rendimiento

- Tipografía del sistema sustituida por una sola familia web (Nunito Sans), con `preconnect` a `fonts.googleapis.com` y `fonts.gstatic.com`.
- Cero dependencias externas en tiempo de ejecución: ni CDN de terceros, ni librerías de animación 3D, ni motores de *scrolling*. Todo el movimiento es CSS + IntersectionObserver.
- Foco visible en todo el sitio (`:focus-visible`), enlace de salto al contenido y `aria-label` en todos los controles de icono.
- El carrusel expone `role="group"` + `aria-roledescription="carrusel"`, y las imágenes inactivas quedan fuera del árbol de accesibilidad con `aria-hidden="true"`.
- Las imágenes del hero declaran `width`/`height` para evitar CLS; la primera usa `loading="eager"` + `fetchpriority="high"` y las demás `loading="lazy"`.
- `prefers-reduced-motion` desactiva el auto-avance, el revelado y las transiciones.
- Mobile-first, probado desde 360px.

## Pendiente del cliente

- Fotos reales de talleres para la galería (`FOTOS` en `galeria.js`).
- URLs definitivas de redes sociales (hoy los enlaces son `#`).
- Número y mensaje definitivos de WhatsApp.
- PDFs del Régimen Tributario Especial (`public/documentos/*.pdf`).
- Código del formulario de intención de donación y del formulario de contacto (Tally).
- Código de embed del asistente de IA.