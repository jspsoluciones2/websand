# Sitio Web — Corporación Compartiendo Arte

Sitio institucional de la Corporación Artística y Cultural Compartiendo Arte en Norte de Santander. JavaScript puro modular (sin frameworks), desplegado en Cloudflare Workers: assets estáticos + endpoint de API para la consulta de certificados.

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
        ├── config.js       ★ CONSTANTES CONFIGURABLES (WhatsApp, Tally, IA, logo)
        ├── main.js         → punto de entrada
        ├── intro.js        → preloader de primera visita
        ├── hero3d.js       → escena Three.js del hero
        ├── scroll-anim.js  → animaciones de scroll (GSAP)
        ├── navbar.js       → navegación y menú móvil
        ├── widget.js       → botón flotante de contacto
        ├── galeria.js      → galería de fotos (array FOTOS) + lightbox
        └── certificados.js → lógica de consulta de certificados
```

## Constantes configurables (`public/js/config.js`)

- **WHATSAPP_URL**: enlace directo de WhatsApp (número pendiente de confirmación por el cliente).
- **TALLY_URL**: código/URL del formulario de Tally (pendiente).
- **AI_EMBED_URL**: código de embed del asistente IA (pendiente).
- **LOGO_URL**: logo cargado desde Cloudinary por URL.

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

- Contrastes WCAG 2.1 verificados (ver `../estiloweb.md`).
- `prefers-reduced-motion` desactiva la intro, el 3D y las animaciones.
- Three.js se carga en diferido después del evento `load`.
- Mobile-first, probado desde 360px.
