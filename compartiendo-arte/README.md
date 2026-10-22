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
        ├── galeria.js      → galería de fotos reales: carriles, filtros y lightbox
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
- **VIDEOS** / **SHORTS**: selección del canal de YouTube (`id`, `titulo`, `duracion`).
- **esEmbebible()**: consulta la lista `SIN_EMBED` de videos que YouTube no deja reproducir dentro del sitio.
- **CANAL_YOUTUBE**: URL del canal, usada por el botón de cierre de la sección.

También hay contenedores preparados con comentarios en el HTML:
`#tally-form-container`, `#tally-modal-container` y `#ai-assistant-container`.

## Fotos de la galería

Las 53 fotografías reales del proceso formativo 2023 están declaradas en
`public/js/config.js` como `GALERIA`, agrupadas por categoría en `CATEGORIAS`
(clausura, vestuario e invitación). Los datos salen de `urlsIMG.csv`, que es un
insumo local y **no se versiona**; para actualizar la galería se regenera ese
array.

- Los `publicId` no llevan extensión, para que Cloudinary elija el mejor
  formato (`f_auto`) al servir.
- `urlMiniatura()` pide 600×450 con recorte centrado; `urlGrande()` pide la
  versión de hasta 1600 px para el lightbox.
- Los `alt` se componen con la frase de la categoría y la posición
  ("… — fotografía 3 de 12"), porque el CSV no trae descripciones. Conviene
  reemplazarlos por descripciones reales cuando el cliente las entregue.

Comportamiento de `public/js/galeria.js`:

- Dos carriles horizontales que se desplazan en sentidos opuestos con
  `@keyframes` de CSS. Se detienen cuando la sección sale de pantalla, al pasar
  el mouse o al llegar con el teclado, y `prefers-reduced-motion` los convierte
  en una grilla estática (dos columnas en celular, sin copias).
- Cada carril duplica su contenido para que el bucle no tenga costura; las
  copias son `aria-hidden` y `tabindex="-1"`, así que el teclado y el lector de
  pantalla recorren cada foto una sola vez.
- El lightbox navega solo las fotos del filtro activo, atrapa el foco, acepta
  Escape y flechas, muestra categoría y contador, y devuelve el foco a la
  tarjeta al cerrar.
- GSAP (CDN, `gsap` + `ScrollTrigger`) solo aporta el revelado de entrada y el
  fundido al cambiar de filtro. Si el CDN falla, la galería se ve y funciona
  igual: el movimiento de los carriles no depende de GSAP.

## Videos y shorts

La sección "En movimiento" toma el canal `@compartiendoarte`. Los datos viven
en `public/js/config.js` como `VIDEOS` (16 piezas 16:9) y `SHORTS` (5 piezas
verticales); salen de `COMPARTIENDO_ARTE_videos_y_shorts.csv`, que es un insumo
local y **no se versiona**.

- El CSV original trae 27 videos, pero varios repiten el mismo título con
  distinta duración. La lista publicada es una selección curada para que el
  carril no se lea como un error; el resto sigue disponible en el canal con el
  botón "Ver todo el canal".
- Los títulos se reescribieron en oración ("Módulo 2 · Raíces y memorias en
  movimiento") porque los originales vienen en mayúsculas y con numeración
  interna. El título de YouTube queda a la vista al abrir el video o en el
  canal.
- **No todos los videos se pueden embeber.** YouTube responde con error 150
  (contenido marcado como "hecho para niños" o embedding desactivado por el
  canal) en 6 de los 16 videos y 3 de los 5 shorts. Esos ids están en
  `SIN_EMBED`: su tarjeta abre YouTube en una pestaña nueva y muestra `↗` en
  lugar del `▶`. Si el canal habilita el embedding, basta con quitar el id de
  esa lista.

Comportamiento de `public/js/videos.js`:

- Un solo carril 16:9 con la misma técnica que la galería (copias para el bucle
  sin costura, pausa fuera de pantalla, al pasar el mouse y con el teclado).
  Con `prefers-reduced-motion` pasa a grilla estática, sin copias ni vista
  previa automática.
- Los shorts van en un bloque estático 9:16 debajo, más chico: mezclar ambas
  proporciones en una misma fila rompe la alineación.
- Ninguna tarjeta es un iframe. Se usan miniaturas de `i.ytimg.com`
  (`hqdefault`, con `mqdefault` de respaldo) y el reproductor se crea recién al
  abrir el visor.
- Vista previa al pasar el mouse: un único iframe mudo, sin controles y en
  bucle, después de ~450 ms. Solo en equipos con puntero fino, nunca en celular
  ni con movimiento reducido. Al salir se destruye y no queda audio sonando.
- El visor usa `youtube-nocookie.com`, adapta el marco a 16:9 o 9:16, destruye
  el iframe al cerrar o al cambiar de video, atrapa el foco, acepta Escape y
  flechas, y devuelve el foco a la tarjeta de origen.

## Certificados

- La fuente de datos es la tabla `public.certificados` de Supabase
  (`nombre`, `documento` bigint, `url`). La imagen del certificado está alojada
  en Cloudinary y la URL viene en la fila.
- El navegador **nunca** habla con Supabase ni ve la service role key. Consulta
  `GET /api/certificado?doc=…` y el Worker hace la búsqueda exacta por
  documento con `select=nombre,url&limit=1`.
- La clave vive como secreto del Worker:
  `npx wrangler secret put SUPABASE_KEY`. La URL del proyecto está en `vars` de
  `wrangler.jsonc` (es pública, no hace falta ocultarla).
- Para desarrollo local, `.dev.vars` (ignorado por git) define `SUPABASE_KEY`.
  `npm run dev` levanta assets + Worker en el mismo puerto.
- El documento se valida en el Worker (solo dígitos, 6 a 15) y se normalizan
  ceros a la izquierda. La respuesta no repite el número y se envía con
  `Cache-Control: no-store`.
- Limitador en memoria de 20 consultas por minuto por IP. Sigue siendo un
  límite por isolate; para producción conviene una regla WAF de Cloudflare.
- La interfaz muestra el nombre, **Ver certificado** (visor con foco atrapado,
  Escape y enlace a la imagen completa), **Descargar** (blob con nombre
  `certificado-compartiendo-arte-<documento>.png`) y enlaces para compartir en
  WhatsApp, Telegram y X, más copiar el enlace. Si el documento no existe, el
  mensaje es explícito y ofrece contacto.
- Privacidad: cualquiera que conozca un número de documento puede ver ese
  certificado. Es inherente a la consulta pública; el limitador es la única
  mitigación y no conviene quitar el `no-store`.

## Notas de accesibilidad y rendimiento

- Tipografía del sistema sustituida por una sola familia web (Nunito Sans), con `preconnect` a `fonts.googleapis.com` y `fonts.gstatic.com`.
- La única dependencia externa de tiempo de ejecución es GSAP (`gsap` + `ScrollTrigger`) desde jsDelivr, solo para la entrada y los fundidos de la galería. Es opcional por diseño: si el CDN falla, todo sigue funcionando. El resto del movimiento es CSS + IntersectionObserver.
- Foco visible en todo el sitio (`:focus-visible`), enlace de salto al contenido y `aria-label` en todos los controles de icono.
- El carrusel expone `role="group"` + `aria-roledescription="carrusel"`, y las imágenes inactivas quedan fuera del árbol de accesibilidad con `aria-hidden="true"`.
- La sección de videos no carga ningún iframe de YouTube al abrir la página: sin interacción no hay cookies de terceros ni megabytes de reproductor. Las miniaturas se sirven desde `i.ytimg.com` con `loading="lazy"`.
- Las imágenes del hero declaran `width`/`height` para evitar CLS; la primera usa `loading="eager"` + `fetchpriority="high"` y las demás `loading="lazy"`.
- `prefers-reduced-motion` desactiva el auto-avance, el revelado y las transiciones.
- Mobile-first, probado desde 360px.

## Pendiente del cliente

- Revisar en YouTube Studio si el canal puede habilitar el embedding de los videos marcados como "hecho para niños" (hoy 9 piezas abren YouTube en otra pestaña).
- Confirmar si los títulos curados de los videos representan cada pieza o si prefieren otro criterio.
- Descripciones reales de cada fotografía para reemplazar los `alt` automáticos.
- URLs definitivas de redes sociales (hoy los enlaces son `#`).
- Número y mensaje definitivos de WhatsApp.
- PDFs del Régimen Tributario Especial (`public/documentos/*.pdf`).
- Código del formulario de intención de donación y del formulario de contacto (Tally).
- Código de embed del asistente de IA.