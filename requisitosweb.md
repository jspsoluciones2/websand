# Requisitos y Estructura Web — Corporación Artística y Cultural Compartiendo Arte

> Documento de requerimientos funcionales y de estructura. La identidad visual está definida en `estiloweb.md`. Contenidos reales (textos, fotos) se definirán después.

---

## 1. Objetivo del sitio

Sitio web institucional de alto impacto visual e interactividad, que muestre la identidad cultural de la Corporación, sus servicios formativos, su gestión (certificados) y canales de contacto directos. Audiencia principal: **familias de comunidades rurales de Norte de Santander**, mayoría desde celular.

---

## 2. Decisiones confirmadas

| Tema | Decisión |
|---|---|
| Hosting | **Cloudflare Workers** (assets estáticos + endpoint de certificados) |
| Dominio (inicial) | El gratuito que entrega Cloudflare: `*.workers.dev` (migrable a dominio propio después) |
| Logo | Cargado por **URL externa** (configurable en una constante/variable del proyecto, para poder actualizarlo sin tocar código) |
| Certificados | Se **consultan con el número de documento** del participante; el resultado se **descarga en PDF**. La emisión/generación del certificado se definirá más adelante |
| Estructura | One-page principal + página de políticas (ver §3) |
| Widget de contacto | Botón flotante inferior derecho con 3 opciones (WhatsApp, Asistente IA, Correo/Tally) |
| Interactividad | GSAP + Three.js: intro en primera carga + efectos de scroll |

---

## 3. Mapa del sitio (sitemap)

```
/ (one-page principal, navegación por anclas)
│
├── 1. Navbar (fijo)
├── 2. Inicio (Hero)                     #inicio
├── 3. Sobre Nosotros                    #sobrenosotros
│      ├── Misión
│      ├── Visión
│      └── Valores (6)
├── 4. Servicios                         #servicios
├── 5. Galería                           #galeria
├── 6. Certificados                      #certificados
├── 7. Contacto                          #contacto
├── 8. Footer
│
├── [Widget flotante de contacto — presente en todas las vistas]
│
/politicas  (página legal independiente)
       ├── Política de Tratamiento de Datos Personales
       ├── Aviso de Privacidad
       └── Términos y Condiciones del sitio
```

---

## 4. Estructura detallada por sección

### 4.1 Navbar (fija, se compacta al hacer scroll)
- Logo (por URL) a la izquierda → clic vuelve a #inicio.
- Enlaces (desktop): Inicio · Sobre Nosotros · Servicios · Galería · Certificados · Contacto.
- CTA destacado a la derecha (ej. "Contáctanos" o inscripción).
- Móvil: hamburguesa → panel deslizante a pantalla completa con los mismos enlaces.
- Indicador visual del enlace activo según sección visible (scroll-spy).
- Accesible por teclado; cierra con `Esc`.

### 4.2 Inicio (Hero)
| Bloque | Descripción |
|---|---|
| Fondo | Escena Three.js (concepto "El lienzo vivo" — partículas/íconos del isotipo con paralaje al mouse) |
| Titular | Frase de impacto + eslogan institucional |
| Subtítulo | Una línea de contexto (texto pendiente) |
| CTA primario | Acción principal (hacia #contacto o WhatsApp) |
| CTA secundario | Enlace suave (ej. "Conócenos" → #sobrenosotros) |
| Indicador | Flecha/animación de "desliza para descubrir" |

### 4.3 Sobre Nosotros
| Bloque | Descripción |
|---|---|
| Intro | Párrafo breve de presentación (texto pendiente) |
| Misión | Tarjeta/bloque con el texto institucional |
| Visión | Tarjeta/bloque con el texto institucional |
| Valores | 6 tarjetas (Compromiso, Respeto, Cultura, Inclusión, Educación, Responsabilidad) con ícono y descripción corta |
| Opcional | Contadores animados (beneficiarios, talleres, años) — datos pendientes |

### 4.4 Servicios
- Grid de tarjetas por línea artística (música, danza, teatro, artes plásticas — las 4 artes del isotipo).
- Cada tarjeta: ícono del logo, nombre del servicio/taller, descripción corta, CTA a #contacto o WhatsApp.
- Animación de entrada escalonada al hacer scroll; hover 3D/parallax.
- Cantidad real de servicios: pendiente de contenido.

### 4.5 Galería
- Grid responsive con fotos de talleres/actividades.
- Filtros por categoría (categorías pendientes de contenido).
- Lightbox con navegación por teclado y gestos táctiles.
- Lazy-loading de imágenes.
- Aviso discreto de autorización de imágenes (protección de menores, Ley 1581).

### 4.6 Certificados
**Flujo de consulta (público objetivo: participante o su acudiente):**
1. Campo único: número de documento.
2. Botón "Consultar" → estado de carga.
3. Resultado:
   - **Encontrado:** vista del certificado (nombre, curso/taller, fecha) + botón **"Descargar PDF"**.
   - **No encontrado:** mensaje neutro e informativo (sin revelar si el número existe), con enlace a contacto para soporte.
   - **Error:** mensaje con reintento.
- Implementación: **endpoint en Cloudflare Worker** que recibe el número de documento y devuelve la referencia al PDF. Sin listado público, sin búsqueda por nombre.
- Nota técnica: limitar intentos por IP (rate limit) para evitar consultas masivas de números; respuesta uniforme en caso negativo.
- **Pendiente (fase posterior):** cómo se emite/genera el PDF del certificado.

### 4.7 Contacto
| Bloque | Descripción |
|---|---|
| Formulario | Embebido de **Tally** (código por definir) con checkbox de autorización de tratamiento de datos (Ley 1581) y casilla de imágenes cuando aplique |
| Datos | Dirección (Km 14, Vereda Agua Blanca, Vía Puerto Santander, Cúcuta), correo corpocarte@gmail.com, teléfonos |
| WhatsApp | Enlace directo con el mismo mensaje predefinido del widget |
| Redes | Íconos de redes oficiales (cuáles: pendiente) |
| Mapa | Opcional — embed de OpenStreetMap/Google Maps (decisión posterior) |

### 4.8 Footer
- Logo (URL) + una línea de misión.
- Enlaces a las secciones (columna).
- Enlace **"Políticas y Condiciones"** → `/politicas` (exigencia del documento institucional v1.0).
- Datos legales: NIT 901.527.000-1, dirección, correo, teléfono.
- Redes sociales.
- Línea inferior: © año + Corporación.

### 4.9 Página `/politicas` (Política de Tratamiento de Datos)
- Contiene los tres componentes del documento institucional v1.0 (30/09/2026): **Política de Tratamiento de Datos Personales** (marco Ley 1581/2012), **Aviso de Privacidad** y **Términos y Condiciones**.
- Encabezado con responsable (NIT), versión y fecha del documento.
- Canales para consultas/reclamos de datos (correo y teléfono oficiales).
- Enlazada desde el footer y referenciada en los consentimientos de formularios.

---

## 5. Widget flotante de contacto

**Posición:** fija, esquina **inferior derecha**, presente en todas las vistas. Etiqueta "Contáctanos" en desktop, solo icono en móvil. Al clic despliega menú vertical con 3 opciones:

| Opción | Especificación |
|---|---|
| **WhatsApp** | Icono oficial → `https://wa.me/<número>?text=<mensaje>`. Número en formato internacional sin `+` (pendiente confirmar: 573183084857). Mensaje predefinido URL-encoded. Abre en pestaña nueva con `rel="noopener"` |
| **Asistente IA** | Icono de robot → panel/modal con contenedor reservado (`<div id="ai-assistant-container">`) para el código de la plataforma externa (se insertará después) |
| **Correo** | Icono de sobre → modal con el **formulario Tally** embebido (mismo de #contacto) |

- Solo un panel abierto a la vez; clic fuera o `Esc` cierra.
- Animación sutil de atención (pulso GSAP), nunca invasiva.
- Accesible por teclado y lector de pantalla (`aria-expanded`, roles).
- Móvil: respeta `env(safe-area-inset-bottom)`, sin solaparse con nada.

---

## 6. Interactividad y alto impacto (GSAP + Three.js)

### 6.1 Animación de primera carga
- Preloader con wordmark + barra dorada (1–1.5s, skippable).
- Concepto **"El lienzo vivo"**: partículas/pinceladas en los colores del isotipo despiertan el hero; íconos del logo (clave de sol, corcheas, máscaras, pincel) flotan en 3D con paralaje al mouse.
- **Solo en la primera visita de la sesión** (`sessionStorage`).
- Duración total < 3 segundos.

### 6.2 Efectos de scroll (ScrollTrigger)
- Reveals por sección (fade/slide/stagger), parallax en hero y fondos, contadores animados, timeline de misión→visión→valores, navbar que se compacta.

### 6.3 Micro-interacciones
- Hover magnético en botones, cursor personalizado (solo desktop), transiciones del widget.

### 6.4 Rendimiento y accesibilidad (no negociable)
- `prefers-reduced-motion` → versión estática sin animaciones.
- Three.js móvil: low-poly, `pixelRatio` máx. 2, escena < 300KB, init diferido.
- `matchMedia()` para separar animaciones desktop/móvil.
- **LCP < 2.5s en 4G**; librerías 3D cargadas deferred/async.

---

## 7. Responsive y optimización móvil

- **Mobile-first** (audiencia rural, mayoritariamente celular, conexiones limitadas).
- Breakpoints: 360 / 768 / 1024 / 1440 px.
- Menú hamburguesa animado; imágenes `srcset` WebP/AVIF + lazy-loading.
- Touch targets ≥ 44×44 px; safe areas iOS.
- Sin scroll horizontal en 360px; widget y menú nunca solapados.

---

## 8. Decisiones pendientes

- [ ] Lenguaje/framework del frontend (el cliente indicará; debe ser compatible con Cloudflare Workers)
- [ ] Número de WhatsApp definitivo (¿318 308 4857, 323 892 0570?)
- [ ] Código del formulario Tally definitivo
- [ ] Plataforma del asistente IA + código de embed
- [ ] Cómo se emite/genera el PDF del certificado (fase posterior)
- [ ] URL definitiva del logo (recurso externo)
- [ ] Contenidos reales: textos, fotos autorizadas, listado de servicios, categorías de galería
- [ ] Redes sociales oficiales
- [ ] ¿Mapa de ubicación en contacto? ¿Sección "Apóyanos"? (opcional, a decidir)
