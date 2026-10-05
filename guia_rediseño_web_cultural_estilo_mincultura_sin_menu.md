# Guía de actualización visual para una web cultural

## Inspirada visualmente en el portal actual de MinCultura, sin modificar el menú ni los contenidos existentes

### Objetivo

Actualizar visualmente una web cultural existente tomando como
**referencia estética y de composición** el portal actual del Ministerio
de las Culturas, las Artes y los Saberes de Colombia.

La web que se actualizará **YA TIENE SU PROPIO MENÚ, ESTRUCTURA DE
NAVEGACIÓN Y CONTENIDOS**.

Por tanto:

> **NO rediseñar, reemplazar, reorganizar ni proponer un menú nuevo.**
>
> **NO cambiar los textos existentes.**
>
> **NO inventar nuevas secciones de contenido.**
>
> **NO sustituir la identidad de la organización.**

La tarea consiste exclusivamente en llevar las secciones existentes a un
lenguaje visual institucional, cultural, editorial y contemporáneo
similar al de la referencia.

La página de referencia actualmente presenta, entre otros elementos
visuales, una gran zona visual inicial, noticias, destacados, ediciones
especiales, agenda, convocatorias, accesos culturales, sistemas de
información y un footer institucional.
citehttps://www.mincultura.gov.co/

------------------------------------------------------------------------

# 1. Regla principal del proyecto

La implementación debe seguir esta lógica:

``` text
MENÚ EXISTENTE
      ↓
SE CONSERVA
      ↓
MEJORAR VISUALMENTE EL RESTO DE LA WEB
```

No modificar:

-   estructura del menú;
-   nombres de las opciones;
-   jerarquía de navegación;
-   enlaces existentes;
-   textos;
-   contenido editorial;
-   URLs;
-   estructura funcional existente.

Sí se puede modificar:

-   colores;
-   tipografía;
-   tamaños;
-   espaciados;
-   fondos;
-   fotografías;
-   composición de tarjetas;
-   botones;
-   bordes;
-   iconografía;
-   proporciones;
-   tratamiento visual;
-   responsive;
-   animaciones discretas;
-   jerarquía visual;
-   apariencia del footer;
-   apariencia del hero/banner si existe.

------------------------------------------------------------------------

# 2. Referencia visual

La referencia principal es:

**https://www.mincultura.gov.co/**

La página actual utiliza una composición de portal cultural
institucional donde el contenido se organiza visualmente mediante
grandes imágenes, bloques editoriales, tarjetas, agenda, destacados y
accesos informativos. citehttps://www.mincultura.gov.co/

La guía oficial de usuario también evidencia el enfoque de accesibilidad
del portal y herramientas como ajuste de tamaño de texto y contraste.
citehttps://www.mincultura.gov.co/Paginas/guia-del-usuario.aspx

------------------------------------------------------------------------

# 3. Identidad cromática

## IMPORTANTE

En este proyecto **SÍ se utilizará la paleta cromática de referencia**,
porque coincide y armoniza con la identidad visual/logotipo de la
organización cultural que se está actualizando.

No sustituir estos colores por otra paleta.

El color institucional principal documentado para MinCultura es:

### Violeta institucional

``` text
HEX:  #4B3C8C
RGB:  75 / 60 / 140
CMYK: 85 / 85 / 4 / 0
```

El manual de identidad institucional identifica este violeta como el
color correspondiente al Ministerio de las Culturas, las Artes y los
Saberes.
citehttps://www.mincultura.gov.co/despacho/Documents/grupo-de-divulgacion-y-prensa/MinCultura_ManualMarca%20V6.pdf

### Amarillo

Utilizar:

``` text
HEX:  #FFCD00
RGB:  255 / 205 / 0
CMYK: 0 / 20 / 93 / 0
```

Este amarillo corresponde a la paleta institucional/gubernamental
utilizada en el sistema gráfico de referencia.
citehttps://www.mincultura.gov.co/despacho/Documents/grupo-de-divulgacion-y-prensa/MinCultura_ManualMarca%20V6.pdf

### Gris institucional

Utilizar como gris oscuro:

``` text
HEX: #504F4E
RGB: 80 / 79 / 78
CMYK: 0 / 0 / 0 / 83
```

### Gris secundario

``` text
HEX: #888888
RGB: 136 / 136 / 136
```

### Blanco

``` text
HEX: #FFFFFF
RGB: 255 / 255 / 255
```

------------------------------------------------------------------------

# 4. Variables CSS de color

Implementar los colores centralizados:

``` css
:root {
  --brand-purple: #4B3C8C;
  --brand-yellow: #FFCD00;

  --text-primary: #504F4E;
  --text-secondary: #888888;

  --white: #FFFFFF;

  --surface-light: #F7F6F8;
  --surface-warm: #FAF8F2;

  --border-light: #E5E3E7;
}
```

No crear una segunda paleta que compita con la identidad.

------------------------------------------------------------------------

# 5. Proporción recomendada de color

Usar la paleta estratégicamente.

### Base

``` text
Blanco / neutros: 65–75 %
```

### Violeta

``` text
20–25 %
```

### Amarillo

``` text
5–10 %
```

El amarillo debe funcionar principalmente como:

-   acento;
-   indicador;
-   línea;
-   detalle;
-   botón secundario;
-   elemento de énfasis;
-   pequeño bloque visual.

El violeta debe ser el principal elemento cromático de identidad.

No llenar toda la página de violeta.

------------------------------------------------------------------------

# 6. Fondo general

El fondo general debe ser predominantemente:

``` text
#FFFFFF
```

Alternar ocasionalmente con:

``` text
#F7F6F8
```

o superficies neutras muy claras.

La intención es crear ritmo visual sin saturar.

------------------------------------------------------------------------

# 7. Tipografía

La tipografía debe ser moderna, institucional y muy legible.

## Familia recomendada

Utilizar:

``` text
Nunito Sans
```

La referencia institucional utiliza una tipografía de carácter
redondeado y accesible, y la documentación gráfica del sistema
identifica Nunito/Nunito Sans dentro de su lenguaje tipográfico.
citehttps://www.mincultura.gov.co/despacho/Documents/grupo-de-divulgacion-y-prensa/MinCultura_ManualMarca%20V6.pdf

Alternativa técnica si Nunito Sans no está disponible:

``` text
Inter
```

Pero la primera opción debe ser:

``` text
Nunito Sans
```

------------------------------------------------------------------------

# 8. Jerarquía tipográfica

## Títulos principales

``` css
font-weight: 800;
line-height: 1.05;
letter-spacing: -0.02em;
```

Tamaño:

``` text
Desktop: 42–64 px
Tablet: 36–48 px
Mobile: 30–38 px
```

## Títulos de sección

``` text
Desktop: 32–42 px
Mobile: 26–32 px
```

## Títulos de tarjetas

``` text
20–26 px
font-weight: 700–800
```

## Texto normal

``` text
16–18 px
line-height: 1.55–1.70
```

## Texto auxiliar

``` text
13–15 px
```

------------------------------------------------------------------------

# 9. No cambiar los textos

El rediseño NO debe reescribir:

-   títulos;
-   subtítulos;
-   descripciones;
-   botones;
-   etiquetas;
-   nombres de secciones;
-   nombres institucionales.

Los textos actuales permanecen.

Únicamente cambiar:

-   tamaño;
-   peso;
-   color;
-   alineación;
-   espaciado;
-   ubicación visual.

------------------------------------------------------------------------

# 10. Header existente

El header y menú existentes se mantienen.

La actualización visual puede intervenir únicamente en:

-   fondo;
-   altura;
-   espaciado;
-   tipografía;
-   estados hover;
-   estado activo;
-   buscador si ya existe;
-   iconos;
-   separación entre elementos.

### NO hacer

``` text
NO crear menú nuevo
NO agregar categorías
NO cambiar nombres
NO eliminar opciones
NO reorganizar navegación
```

------------------------------------------------------------------------

# 11. Hero / Banner principal

Si la web existente **ya tiene Hero o banner**, conservarlo y
rediseñarlo visualmente.

Si no tiene Hero pero posee un banner destacado equivalente, utilizar
ese componente como zona visual principal.

## Características

El Hero debe ser:

-   grande;
-   fotográfico;
-   emocional;
-   cultural;
-   profesional;
-   limpio;
-   editorial.

Proporción recomendada:

``` text
Desktop: 16:6 a 16:8
```

No es necesario convertirlo en una imagen excesivamente alta.

------------------------------------------------------------------------

# 12. Composición del Hero

Preferir:

``` text
┌───────────────────────────────────────────────┐
│                                               │
│  TEXTO EXISTENTE       IMAGEN CULTURAL        │
│                                               │
│  descripción existente                       │
│                                               │
│  [BOTÓN EXISTENTE]                            │
│                                               │
└───────────────────────────────────────────────┘
```

La posición del texto dependerá de la composición de la fotografía.

No mover el texto arbitrariamente.

El objetivo es conseguir:

``` text
imagen + espacio negativo + texto legible
```

------------------------------------------------------------------------

# 13. Fotografía del Hero

Las imágenes deben sentirse:

-   culturales;
-   colombianas;
-   humanas;
-   territoriales;
-   artísticas;
-   auténticas.

Ejemplos visuales:

-   danza;
-   música;
-   teatro;
-   artes plásticas;
-   niños y jóvenes;
-   artistas;
-   comunidades;
-   patrimonio;
-   eventos;
-   formación artística;
-   territorio.

Evitar fotografías corporativas genéricas.

------------------------------------------------------------------------

# 14. Overlay del Hero

Cuando sea necesario mejorar legibilidad:

``` css
background:
linear-gradient(
  90deg,
  rgba(0,0,0,.55) 0%,
  rgba(0,0,0,.20) 55%,
  rgba(0,0,0,0) 100%
);
```

El overlay debe ser sutil.

No oscurecer completamente la fotografía.

------------------------------------------------------------------------

# 15. Indicadores del slider

Si ya existe slider:

Mantenerlo funcional.

Visualmente:

``` text
● ○ ○ ○
```

o pequeñas barras.

Utilizar:

``` css
background: #FFFFFF;
```

para el indicador activo sobre fotografías.

También puede utilizarse:

``` css
background: #FFCD00;
```

cuando el contraste lo permita.

------------------------------------------------------------------------

# 16. Noticias

Si la web actual tiene una sección de noticias, conservar:

-   cantidad de noticias;
-   textos;
-   enlaces;
-   fechas;
-   categorías.

Modificar únicamente su presentación.

## Diseño recomendado

``` text
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│              │ │              │ │              │
│   IMAGEN     │ │   IMAGEN     │ │   IMAGEN     │
│              │ │              │ │              │
├──────────────┤ ├──────────────┤ ├──────────────┤
│ CATEGORÍA    │ │ CATEGORÍA    │ │ CATEGORÍA    │
│ TÍTULO       │ │ TÍTULO       │ │ TÍTULO       │
│ resumen      │ │ resumen      │ │ resumen      │
│ fecha        │ │ fecha        │ │ fecha        │
└──────────────┘ └──────────────┘ └──────────────┘
```

------------------------------------------------------------------------

# 17. Tarjetas de noticias

Características:

``` text
border-radius: 4–8px;
background: #FFFFFF;
border: 1px solid #E5E3E7;
```

La imagen debe ser protagonista.

Evitar tarjetas excesivamente redondeadas.

No utilizar:

-   glassmorphism;
-   sombras pesadas;
-   gradientes;
-   efectos 3D.

------------------------------------------------------------------------

# 18. Efecto hover

Utilizar una interacción mínima:

``` css
transition:
  transform 220ms ease,
  box-shadow 220ms ease;
```

Ejemplo:

``` css
.card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 24px rgba(80,79,78,.10);
}
```

No exagerar.

------------------------------------------------------------------------

# 19. Sección de destacados

Si existe una sección equivalente a "destacados", mantener sus
contenidos actuales.

Visualmente utilizar una composición editorial.

Ejemplo:

``` text
┌──────────────────────────────┬──────────────┐
│                              │              │
│       DESTACADO GRANDE       │  DESTACADO   │
│                              │  PEQUEÑO     │
│                              │              │
├──────────────────────────────┤──────────────┤
│       DESTACADO SECUNDARIO   │  DESTACADO   │
│                              │  PEQUEÑO     │
└──────────────────────────────┴──────────────┘
```

Utilizar el violeta y amarillo en pequeños detalles, no como relleno
obligatorio.

------------------------------------------------------------------------

# 20. Agenda / eventos

Si la web actual ya posee agenda:

Conservar exactamente:

-   eventos;
-   nombres;
-   fechas;
-   ubicación;
-   categorías;
-   enlaces.

Actualizar únicamente el componente.

Diseño recomendado:

``` text
┌──────────────────────────────────────────────┐
│ 15                                           │
│ OCTUBRE                                      │
│                                              │
│ TÍTULO EXISTENTE                             │
│ Descripción existente                        │
│                                              │
│ Ciudad · Lugar                               │
│                                              │
│                         [VER MÁS]             │
└──────────────────────────────────────────────┘
```

La fecha puede ser un elemento visual destacado.

------------------------------------------------------------------------

# 21. Convocatorias

Si existe esta sección, mantener el contenido actual.

Diseño:

``` text
┌─────────────────────────────────────┐
│ ETIQUETA / CATEGORÍA                │
│                                     │
│ TÍTULO EXISTENTE                    │
│ Descripción existente               │
│                                     │
│ Fecha / estado                      │
│                                     │
│ [BOTÓN EXISTENTE]                   │
└─────────────────────────────────────┘
```

Utilizar amarillo para destacar:

-   fechas;
-   estados;
-   indicadores;
-   llamadas importantes.

------------------------------------------------------------------------

# 22. Bloques informativos

Para cualquier bloque existente que no tenga equivalente exacto en
MinCultura:

Mantener su función y contenido.

Aplicar:

-   fondo limpio;
-   jerarquía tipográfica;
-   imagen cuando corresponda;
-   iconos lineales;
-   acentos violetas;
-   detalles amarillos;
-   separación generosa.

No inventar información.

------------------------------------------------------------------------

# 23. Iconografía

Utilizar una única familia de iconos.

Recomendación:

``` text
Lucide
```

o una biblioteca equivalente.

Características:

-   lineal;
-   simple;
-   grosor consistente;
-   sin efectos 3D.

Color principal:

``` text
#4B3C8C
```

Acento:

``` text
#FFCD00
```

------------------------------------------------------------------------

# 24. Botones

Los botones existentes conservan sus textos.

Modificar solamente el estilo.

## Primario

``` css
background: #4B3C8C;
color: #FFFFFF;
border: none;
border-radius: 4px;
padding: 12px 22px;
font-weight: 700;
```

## Secundario

``` css
background: transparent;
color: #4B3C8C;
border: 2px solid #4B3C8C;
border-radius: 4px;
```

## Acento

Cuando corresponda:

``` css
background: #FFCD00;
color: #504F4E;
```

No utilizar botones tipo cápsula como lenguaje general.

------------------------------------------------------------------------

# 25. Separadores

Usar:

``` css
border-color: #E5E3E7;
```

o bloques de color muy discretos.

También puede utilizarse una línea amarilla como recurso editorial:

``` css
height: 4px;
background: #FFCD00;
```

Esto debe utilizarse estratégicamente.

------------------------------------------------------------------------

# 26. Espaciado general

La web debe respirar mucho más que una web tradicional.

Usar:

``` text
8
16
24
32
48
64
80
96
120 px
```

Secciones principales:

``` css
padding-block:
clamp(56px, 7vw, 104px);
```

------------------------------------------------------------------------

# 27. Ancho del contenido

Usar aproximadamente:

``` css
.container {
  width: min(100% - 40px, 1280px);
  margin-inline: auto;
}
```

En pantallas grandes:

``` text
1200–1320 px
```

aproximadamente.

No extender textos a todo el ancho.

------------------------------------------------------------------------

# 28. Imágenes de tarjetas

Relación recomendada:

``` text
4:3
```

Ejemplo:

``` css
aspect-ratio: 4 / 3;
object-fit: cover;
```

Las imágenes deben tener alturas uniformes dentro de un mismo grid.

------------------------------------------------------------------------

# 29. Secciones con fondo violeta

Se pueden utilizar secciones completas en:

``` text
#4B3C8C
```

pero deben reservarse para momentos de alto impacto.

Dentro de ellas:

``` text
Texto: #FFFFFF
Acentos: #FFCD00
```

No utilizar violeta en todas las secciones.

------------------------------------------------------------------------

# 30. Secciones amarillas

El amarillo:

``` text
#FFCD00
```

debe utilizarse con moderación porque tiene mucha luminosidad.

Ejemplos:

-   franja;
-   indicador;
-   número de fecha;
-   etiqueta;
-   pequeño bloque;
-   CTA especial;
-   separador;
-   detalle gráfico.

Para texto sobre amarillo utilizar:

``` text
#504F4E
```

No utilizar texto blanco pequeño sobre amarillo.

------------------------------------------------------------------------

# 31. Footer

El footer es uno de los elementos que más debe actualizarse visualmente.

Debe conservar:

-   información existente;
-   enlaces existentes;
-   redes existentes;
-   contacto existente;
-   políticas existentes.

Pero su presentación debe ser más institucional y ordenada.

## Propuesta

``` text
┌─────────────────────────────────────────────────────┐
│                                                     │
│ LOGO EXISTENTE                                      │
│                                                     │
│ INFORMACIÓN        ENLACES         REDES / CONTACTO │
│ EXISTENTE          EXISTENTES      EXISTENTE        │
│                                                     │
├─────────────────────────────────────────────────────┤
│ enlaces legales / accesibilidad / copyright         │
└─────────────────────────────────────────────────────┘
```

------------------------------------------------------------------------

# 32. Footer: colores

Opción principal:

``` css
background: #4B3C8C;
color: #FFFFFF;
```

Acentos:

``` css
color: #FFCD00;
```

Texto secundario:

``` css
rgba(255,255,255,.82)
```

Separadores:

``` css
rgba(255,255,255,.20)
```

El footer debe generar un cierre visual fuerte.

------------------------------------------------------------------------

# 33. Footer en mobile

En mobile:

-   una columna;
-   bloques apilados;
-   enlaces fáciles de tocar;
-   separación amplia;
-   logo centrado o alineado según la identidad existente.

No comprimir toda la información.

------------------------------------------------------------------------

# 34. Responsive

## Desktop

``` text
≥ 1200 px
```

-   grids amplios;
-   hero panorámico;
-   tarjetas 3--4 columnas;
-   grandes espacios.

## Tablet

``` text
768–1199 px
```

-   grids de 2 columnas;
-   hero más compacto;
-   bloques adaptados.

## Mobile

``` text
< 768 px
```

-   una columna;
-   imágenes completas;
-   títulos más pequeños;
-   botones táctiles;
-   espacios reducidos pero generosos.

El menú existente será el encargado de resolver la navegación mobile.

------------------------------------------------------------------------

# 35. Animaciones

Animación discreta.

Utilizar:

``` text
fade
slide
hover
scale mínimo
```

Duración:

``` text
150–300 ms
```

Para entrada de secciones:

``` text
400–600 ms
```

Evitar:

-   parallax agresivo;
-   partículas;
-   3D;
-   rebotes;
-   animaciones permanentes;
-   scroll hijacking.

------------------------------------------------------------------------

# 36. Accesibilidad

Mantener el objetivo de una experiencia equivalente a un sitio
institucional accesible.

El portal de referencia declara alineación con WCAG 2.1 nivel AA y
ofrece funciones como ajuste de tamaño de texto y contraste.
citehttps://www.mincultura.gov.co/Paginas/guia-del-usuario.aspx

Aplicar:

-   contraste adecuado;
-   foco visible;
-   navegación por teclado;
-   `alt` en imágenes;
-   HTML semántico;
-   botones accesibles;
-   formularios correctamente etiquetados;
-   `aria-label` cuando sea necesario;
-   reducción de movimiento;
-   textos legibles.

------------------------------------------------------------------------

# 37. Sistema de diseño

Crear variables:

``` css
:root {

  /* COLORS */
  --purple: #4B3C8C;
  --yellow: #FFCD00;
  --dark: #504F4E;
  --gray: #888888;
  --white: #FFFFFF;

  /* SURFACES */
  --surface: #F7F6F8;
  --border: #E5E3E7;

  /* SPACING */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 24px;
  --space-6: 32px;
  --space-7: 48px;
  --space-8: 64px;
  --space-9: 80px;
  --space-10: 96px;

  /* RADIUS */
  --radius-sm: 4px;
  --radius-md: 6px;
  --radius-lg: 8px;

  /* SHADOW */
  --shadow-soft:
    0 8px 24px rgba(80,79,78,.10);

  /* TRANSITION */
  --transition:
    220ms ease;
}
```

------------------------------------------------------------------------

# 38. Estética general

El resultado final debe sentirse:

**Cultural + institucional + editorial + humano + contemporáneo.**

Debe tener:

-   mucho aire;
-   fotografías protagonistas;
-   títulos fuertes;
-   colores institucionales;
-   tarjetas limpias;
-   composición editorial;
-   footer sólido;
-   navegación existente intacta.

------------------------------------------------------------------------

# 39. Lo que NO debe aparecer

No utilizar:

-   glassmorphism;
-   estética SaaS;
-   neón;
-   exceso de degradados;
-   3D;
-   sombras grandes;
-   botones completamente redondos;
-   exceso de animaciones;
-   fondos tecnológicos;
-   patrones de circuitos;
-   estética futurista;
-   dashboard administrativo.

La web debe ser cultural, no tecnológica.

------------------------------------------------------------------------

# 40. Qué se conserva exactamente

### Se conserva

``` text
MENÚ
TEXTOS
CONTENIDOS
ENLACES
ESTRUCTURA FUNCIONAL
MARCA
LOGO
INFORMACIÓN INSTITUCIONAL
```

### Se rediseña visualmente

``` text
HERO / BANNER
TIPOGRAFÍA
COLORES
TARJETAS
IMÁGENES
ESPACIADO
BOTONES
ICONOS
SECCIONES
DESTACADOS
AGENDA
CONVOCATORIAS
FOOTER
RESPONSIVE
ANIMACIONES
```

------------------------------------------------------------------------

# 41. Regla para secciones que no existen

No crear automáticamente todas las secciones de MinCultura.

Por ejemplo:

Si la web actual tiene:

``` text
Hero
Noticias
Galería
Quiénes somos
Proyectos
Contacto
Footer
```

se rediseñan esas secciones.

No agregar:

``` text
Agenda
Convocatorias
Sistemas de información
```

si no existen o no hacen parte del proyecto.

La referencia sirve para el **lenguaje visual**, no para imponer la
arquitectura de contenidos.

------------------------------------------------------------------------

# 42. Prompt maestro para implementar el rediseño

> Actualiza visualmente la web cultural existente tomando como
> referencia estética el portal actual del Ministerio de las Culturas,
> las Artes y los Saberes de Colombia.
>
> MUY IMPORTANTE:
>
> La web YA tiene menú, navegación, contenidos y textos.
>
> NO crear un menú nuevo.
>
> NO modificar el menú existente.
>
> NO cambiar nombres de opciones.
>
> NO reorganizar la navegación.
>
> NO reescribir textos.
>
> NO inventar contenidos.
>
> NO agregar secciones que no existan.
>
> El trabajo consiste exclusivamente en mejorar el lenguaje visual de
> las secciones actuales.
>
> Aplicar:
>
> -   estética cultural institucional;
> -   composición editorial;
> -   fotografías grandes y profesionales;
> -   hero/banner visualmente potente;
> -   tarjetas limpias;
> -   jerarquía tipográfica clara;
> -   espacios amplios;
> -   diseño responsive;
> -   footer institucional fuerte;
> -   animaciones discretas;
> -   accesibilidad.
>
> Utilizar EXACTAMENTE esta paleta:
>
> Violeta: #4B3C8C
>
> Amarillo: #FFCD00
>
> Gris oscuro: #504F4E
>
> Gris: #888888
>
> Blanco: #FFFFFF
>
> Utilizar Nunito Sans como tipografía principal.
>
> El violeta debe ser el color institucional dominante.
>
> El amarillo debe utilizarse como acento estratégico.
>
> El blanco debe dominar las superficies.
>
> Utilizar fotografías culturales auténticas, humanas y territoriales.
>
> Si existe un Hero o Banner, conservarlo funcionalmente pero mejorar
> radicalmente su composición visual, calidad fotográfica, proporción,
> jerarquía y legibilidad.
>
> Si existen noticias, destacados, eventos, convocatorias, galerías,
> proyectos u otras secciones, conservar exactamente su contenido y
> rediseñar únicamente su presentación visual.
>
> El footer existente debe conservar toda su información pero recibir
> una composición institucional moderna, preferiblemente con fondo
> #4B3C8C, texto blanco y acentos #FFCD00.
>
> No utilizar glassmorphism, neón, 3D, exceso de gradientes, sombras
> fuertes, botones tipo cápsula ni estética SaaS.
>
> El resultado debe parecer una web cultural institucional colombiana
> moderna, profesional, humana, editorial y visualmente poderosa.
>
> IMPORTANTE: adaptar el sistema visual a la web existente; no copiar
> literalmente la identidad, logotipo, textos, fotografías ni activos
> del Ministerio.

------------------------------------------------------------------------

# 43. Checklist final

## Estructura

-   [ ] Menú existente intacto.
-   [ ] Textos existentes intactos.
-   [ ] Enlaces existentes intactos.
-   [ ] No se agregaron secciones innecesarias.

## Identidad

-   [ ] #4B3C8C correctamente aplicado.
-   [ ] #FFCD00 correctamente aplicado.
-   [ ] #504F4E para texto principal.
-   [ ] #888888 para texto secundario.
-   [ ] Blanco como superficie principal.
-   [ ] Logo original respetado.

## Visual

-   [ ] Hero/banner profesional.
-   [ ] Fotografías de calidad.
-   [ ] Noticias con tarjetas consistentes.
-   [ ] Destacados bien jerarquizados.
-   [ ] Eventos/agenda bien organizados si existen.
-   [ ] Convocatorias bien organizadas si existen.
-   [ ] Footer institucional.

## Tipografía

-   [ ] Nunito Sans.
-   [ ] Títulos fuertes.
-   [ ] Buena legibilidad.
-   [ ] Interlineado correcto.
-   [ ] Jerarquía consistente.

## Responsive

-   [ ] Desktop.
-   [ ] Tablet.
-   [ ] Mobile.
-   [ ] Imágenes adaptables.
-   [ ] Botones táctiles.

## Accesibilidad

-   [ ] Contraste.
-   [ ] Focus visible.
-   [ ] Navegación teclado.
-   [ ] ALT.
-   [ ] HTML semántico.
-   [ ] Reducción de movimiento.

------------------------------------------------------------------------

# 44. Resultado objetivo

La web actual debe conservar su identidad y funcionamiento, pero
visualmente evolucionar hacia:

> **Una plataforma cultural institucional, moderna, editorial, elegante,
> colorida y humana, inspirada en el lenguaje visual de MinCultura,
> utilizando la misma paleta cromática definida para el proyecto, pero
> sin copiar su menú ni sus contenidos.**

La referencia de MinCultura se utiliza como **benchmark visual**,
especialmente para composición, jerarquía, fotografía, tratamiento de
secciones y sensación institucional. El sitio actual confirma que su
portada utiliza grandes áreas visuales y bloques como noticias,
destacados, agenda, convocatorias y sistemas de información.
citehttps://www.mincultura.gov.co/
