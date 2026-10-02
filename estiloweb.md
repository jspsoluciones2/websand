# Guía de Estilo Web — Corporación Artística y Cultural Compartiendo Arte

> Basada en la paleta del logotipo institucional, la armonía del círculo cromático y los estándares de accesibilidad WCAG 2.1 (contrastes calculados y verificados, no estimados).

---

## 1. Fundamento cromático (círculo cromático)

El logo contiene una **tríada de colores primarios** — rojo `#db141c`, amarillo `#f6c150` y azul `#082e8e` — que en el círculo cromático están separados ~120° (armonía **triádica**, la misma de la bandera de Colombia). Además, el **dorado `#e7ac23`** es casi complementario del azul (opuesto en la rueda al azul-violeta), por eso el logo ya lo usa como aura de la bailarina: es su pareja natural de acento.

**Estrategia de aplicación (regla 60-30-10):**

| Proporción | Color | Rol |
|---|---|---|
| 60% | Neutros cálidos (blanco, `#f0efed`, grises) | Fondos y superficies |
| 30% | Azul `#082e8e` | Color dominante: títulos, botones, navegación, enlaces |
| 10% | Rojo, amarillo y dorado | Acentos: CTAs, destacados, detalles, divisores |

El azul oscuro domina porque transmite confianza, educación e institucionalidad; el rojo y el amarillo se reservan para momentos de acción y calidez. Así el logo **nunca compite** con la interfaz: los primarios vivos aparecen en dosis pequeñas y el sitio se siente de la misma familia visual.

---

## 2. Paleta de colores (tokens)

### 2.1 Colores de marca (del logo)

| Token | HEX | Uso | Contraste verificado |
|---|---|---|---|
| `--azul` | `#082e8e` | Primario: títulos, enlaces, botones, cabeceras | 10.20:1 sobre fondo claro ✅ AAA |
| `--rojo` | `#db141c` | Acento/CTA: botones de acción, alertas de marca | 5.09:1 con blanco ✅ AA |
| `--amarillo` | `#f6c150` | Acento: badges, resaltados, foco sobre oscuro | 12.15:1 con negro ✅ AAA |
| `--dorado` | `#e7ac23` | Detalles: líneas divisorias, íconos, badges premium | 9.90:1 con negro ✅ AAA |
| `--negro` | `#06070a` | Texto principal, secciones oscuras | 17.53:1 sobre fondo claro ✅ AAA |
| `--gris` | `#515150` | Texto secundario, bordes | 6.92:1 sobre fondo claro ✅ AA |
| `--arena` | `#d1b087` | Fondos de tarjetas cálidas, bordes decorativos | 9.85:1 con negro ✅ AAA |

### 2.2 Variantes ajustadas para web (derivadas, no cambian la identidad)

| Token | HEX | Origen / uso |
|---|---|---|
| `--azul-oscuro` | `#06216b` | Hover del azul (14.61:1 con blanco ✅ AAA) |
| `--azul-tinte` | `#eef1f8` | Fondos de sección alternados, tarjetas informativas |
| `--azul-medio` | `#6185c1` | **Solo decorativo** (3.73:1 en texto — no apto texto normal) |
| `--azul-palido` | `#8697c6` | **Solo decorativo**; texto claro sobre negro ✅ AA (6.96:1) |
| `--rojo-oscuro` | `#b01015` | Hover del rojo y color semántico de error (7.16:1 con blanco ✅ AAA) |
| `--amarillo-tinte` | `#fdf6e3` | Fondos cálidos suaves (sección de valores, citas) |
| `--off-white` | `#f7f6f5` | Fondo general alternativo |
| `--texto-claro` | `#cfd4e8` | Texto secundario sobre secciones oscuras (13.66:1 ✅ AAA) |

### 2.3 Colores semánticos

| Token | HEX | Uso | Contraste |
|---|---|---|---|
| `--exito` | `#1e6b2e` | Mensajes de confirmación, formularios válidos | 6.57:1 con blanco ✅ AA |
| `--exito-tinte` | `#eaf3ea` | Fondo de mensajes de éxito (17.75:1 con negro ✅ AAA) |
| `--error` | `#b01015` | Errores de formulario (derivado del rojo de marca) | 7.16:1 con blanco ✅ AAA |
| `--alerta` | `#f6c150` | Advertencias — **siempre con texto negro** | 12.15:1 con negro ✅ AAA |
| `--info` | `#082e8e` | Notas informativas (reusa el azul de marca) | 11.72:1 con blanco ✅ AAA |

### 2.4 Fondos

| Token | HEX | Uso |
|---|---|---|
| `--fondo` | `#f0efed` | Fondo base del sitio (mismo del logo) |
| `--fondo-blanco` | `#ffffff` | Tarjetas, formularios, superficies elevadas |
| `--fondo-oscuro` | `#06070a` | Secciones de cierre, footer, llamados destacados |
| `--fondo-seccion-a` | `#ffffff` / `#f7f6f5` | Alternado de secciones |
| `--fondo-seccion-b` | `#eef1f8` | Alternado con tinte azul |
| `--fondo-calido` | `#fdf6e3` | Sección de valores / citas (calidez cultural) |

---

## 3. Tipografía

### 3.1 Familias (Google Fonts, gratuitas, buen soporte latino/ñ/tildes)

| Rol | Fuente | Pesos | Razón |
|---|---|---|---|
| Títulos (H1–H4, botones, navegación) | **Montserrat** | 600, 700, 800 | Sans-serif geométrica y gruesa: **armoniza con la palabra "COMPARTIENDO ARTE" del logo**, que es sans-serif muy gruesa |
| Texto de cuerpo, formularios | **Source Sans 3** | 400, 600 | Máxima legibilidad en pantalla, trazo humanista y cálido, ideal para lectura prolongada |
| Citas y testimonios | **Lora** (itálica) | 400 italic | Toque editorial/cultural para testimonios de la comunidad |

```css
--fuente-titulos: 'Montserrat', 'Segoe UI', Arial, sans-serif;
--fuente-cuerpo: 'Source Sans 3', 'Segoe UI', Arial, sans-serif;
--fuente-cita: 'Lora', Georgia, serif;
```

### 3.2 Escala tipográfica (base 16px)

| Nivel | Tamaño | Peso | Interlineado | Color |
|---|---|---|---|---|
| H1 (display) | 2.5rem (40px) | 800 | 1.15 | `--azul` |
| H2 | 2rem (32px) | 700 | 1.2 | `--azul` |
| H3 | 1.5rem (24px) | 700 | 1.25 | `--negro` |
| H4 | 1.25rem (20px) | 600 | 1.3 | `--negro` |
| Cuerpo | 1rem (16px) | 400 | 1.6 | `--negro` |
| Cuerpo grande (intro) | 1.125rem (18px) | 400 | 1.6 | `--gris` |
| Texto secundario | 0.9375rem (15px) | 400 | 1.5 | `--gris` |
| Botones / enlaces nav | 1rem | 600 | 1 | según estado |
| Caption / legal | 0.8125rem (13px) | 400 | 1.4 | `--gris` |

- **Párrafos: máx. 65–75 caracteres por línea** (medida ideal de lectura).
- Longitudes de texto en mayúsculas: solo títulos cortos y etiquetas (como hace el logo).

---

## 4. Botones

| Tipo | Fondo | Texto | Borde | Estados |
|---|---|---|---|---|
| **Primario** | `--azul` `#082e8e` | blanco | — | hover `#06216b` (AAA); foco anillo 3px `#f6c150` |
| **CTA / Acento** | `--rojo` `#db141c` | blanco | — | hover `#b01015` (AAA); foco anillo 3px `#f6c150` (7.07:1 sobre rojo ✅) |
| **Dorado (inscripciones / apoyar)** | `--dorado` `#e7ac23` | `#06070a` **negro** | — | hover `#bd781b`; nunca texto blanco sobre dorado |
| **Secundario (outline)** | transparente | `--azul` | 2px `--azul` | hover: fondo azul + texto blanco |
| **Fantasma (ghost)** | transparente | `--azul` | — | hover: fondo `--azul-tinte` |
| **Deshabilitado** | `#d6d4d1` | `--gris` `#515150` | — | cursor `not-allowed`, sin sombra |

Reglas de botones: padding `14px 28px`, radio `10px`, fuente Montserrat 600, tamaño ≥ 1rem, transition `0.2s ease`. Contraste mínimo entre fondo del botón y el fondo de la página: 3:1 (1.4.11 WCAG) — todas las variantes lo cumplen.

---

## 5. Títulos, texto y enlaces

- **H1/H2 en azul `#082e8e`** (10.20:1 sobre fondo claro ✅ AAA) — conecta con el isotipo y jerarquiza con color.
- **H3/H4 y cuerpo en negro `#06070a`** (17.53:1 ✅ AAA).
- Destacados dentro de texto: `--rojo` solo en palabras clave grandes o **negrita ≥ 18.66px** (como texto normal 5.09:1 ya cumple AA, pero se reserva para énfasis escaso).
- **Enlaces:** `--azul`, subrayado siempre; hover `--rojo` (5.09:1 ✅ AA); visitados `#06216b`.
- **Sobre secciones oscuras (`#06070a`):** títulos en `#ffffff`, texto en `--texto-claro` `#cfd4e8`, acentos en `--dorado` (9.90:1 ✅ AAA) — exactamente la relación logo/negro del isotipo.

---

## 6. Detalles de diseño

| Elemento | Especificación |
|---|---|
| Radio de bordes | Botones/inputs `10px` · Tarjetas `16px` · Chips/badges `999px` (las formas suaves transmiten la calidez e inclusión de la Corporación) |
| Sombras | Suaves y de tinta cálida: `0 2px 8px rgba(6,7,10,.08)` y `0 8px 24px rgba(6,7,10,.12)` |
| Divisores | Línea de 1px `--dorado` con punto central (replica el divisor del logo) |
| Foco (accesibilidad) | Anillo externo de 3px: `--azul` sobre fondos claros · `--amarillo` sobre fondos oscuros/azul (7.07:1 ✅) |
| Bordes de tarjetas | 1px `#e5e3e0` |
| Espaciado (escala 8pt) | 4, 8, 12, 16, 24, 32, 48, 64, 96 px |
| Iconografía | Íconos alusivos al logo: música (clave de sol, corcheas), teatro (máscaras), pintura (pincel) — trazos simples, 24px, color del texto |
| Fotografía | Priorizar imágenes de la comunidad y talleres con autorización; overlays oscuros `rgba(6,7,10,.55)` para texto sobre fotos |

---

## 7. Variables CSS (entrega al desarrollador)

```css
:root {
  /* Marca */
  --azul: #082e8e;
  --rojo: #db141c;
  --amarillo: #f6c150;
  --dorado: #e7ac23;
  --negro: #06070a;
  --gris: #515150;
  --arena: #d1b087;

  /* Variantes web */
  --azul-oscuro: #06216b;
  --azul-tinte: #eef1f8;
  --rojo-oscuro: #b01015;
  --amarillo-tinte: #fdf6e3;
  --off-white: #f7f6f5;
  --texto-claro: #cfd4e8;
  --borde: #e5e3e0;
  --deshabilitado: #d6d4d1;

  /* Semánticos */
  --exito: #1e6b2e;
  --exito-tinte: #eaf3ea;
  --error: #b01015;
  --alerta: #f6c150;
  --info: #082e8e;

  /* Fondos */
  --fondo: #f0efed;
  --fondo-blanco: #ffffff;
  --fondo-oscuro: #06070a;

  /* Tipografía */
  --fuente-titulos: 'Montserrat', 'Segoe UI', Arial, sans-serif;
  --fuente-cuerpo: 'Source Sans 3', 'Segoe UI', Arial, sans-serif;
  --fuente-cita: 'Lora', Georgia, serif;
}
```

---

## 8. Contrastes WCAG 2.1 verificados (evidencia)

Cálculo según fórmula oficial WCAG 2.1. AA = 4.5:1 texto normal / AAA = 7:1 / AA-large = 3:1 texto grande y componentes UI.

| Combinación | Ratio | Resultado |
|---|---|---|
| Negro `#06070a` sobre `#ffffff` | 20.14 | AAA |
| Negro `#06070a` sobre `#f0efed` | 17.53 | AAA |
| Blanco sobre azul `#082e8e` | 11.72 | AAA |
| Azul `#082e8e` sobre `#f0efed` | 10.20 | AAA |
| Negro sobre amarillo `#f6c150` | 12.15 | AAA |
| Negro sobre dorado `#e7ac23` | 9.90 | AAA |
| Dorado `#e7ac23` sobre negro | 9.90 | AAA |
| Gris `#515150` sobre `#f0efed` | 6.92 | AA |
| Blanco sobre rojo `#db141c` | 5.09 | AA |
| Rojo `#db141c` sobre blanco | 5.09 | AA |
| Blanco sobre rojo-oscuro `#b01015` | 7.16 | AAA |
| Azul sobre tinte `#eef1f8` | 10.37 | AAA |
| Texto-claro `#cfd4e8` sobre negro | 13.66 | AAA |
| Amarillo `#f6c150` sobre azul | 7.07 | AAA |
| **Blanco sobre dorado `#e7ac23`** | **2.03** | **❌ PROHIBIDO** |
| **Azul-medio `#6185c1` como texto** | 3.73 | ❌ solo decorativo / texto grande |
| **Dorado-tierra `#bd781b` como texto** | 3.58 | ❌ solo decorativo / texto grande |

---

## 9. Reglas rápidas (Do / Don't)

✅ **Hacer:**
- Texto sobre dorado o amarillo → siempre **negro**.
- Azul como color dominante; rojo/amarillo en pequeñas dosis.
- Dorado para líneas, íconos y detalles finos (como el aura del logo).
- Anillo de foco visible siempre (accesibilidad por teclado).

❌ **Evitar:**
- Texto blanco sobre dorado o amarillo (2.03:1 — ilegible).
- Usar `#6185c1` / `#8697c6` / `#bd781b` para texto de párrafos.
- Rojo `#db141c` sobre amarillo como texto normal (3.07:1, solo texto grande).
- Fondos puros saturados en secciones amplias: los primarios vivos van en botones y acentos, no en muros de color.
- Degradados que degraden el contraste del texto encima.
