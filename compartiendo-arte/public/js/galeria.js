/**
 * Data-driven photo gallery with lightbox.
 * To publish photos, add items to the FOTOS array:
 *   { src: 'img/taller.jpg', alt: 'Descripción', categoria: 'Danza' }
 * While empty, styled brand-color placeholder cards are shown.
 */
const FOTOS = [
  // { src: 'img/taller-danza.jpg', alt: 'Taller de danza folclórica', categoria: 'Danza' },
];

const TEXTO_PLACEHOLDER = 'Próximamente fotos de nuestros talleres';

export function initGaleria() {
  const grid = document.getElementById('galeria-grid');
  if (!grid) return;

  if (FOTOS.length === 0) {
    montarPlaceholders(grid);
    return;
  }
  montarFotos(grid);
  montarLightbox(grid);
}

function iconoCamara() {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('fill', 'none');
  svg.setAttribute('stroke', 'currentColor');
  svg.setAttribute('stroke-width', '1.5');
  svg.setAttribute('aria-hidden', 'true');
  svg.innerHTML =
    '<path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/>';
  return svg;
}

function montarPlaceholders(grid) {
  for (let i = 0; i < 6; i++) {
    const item = document.createElement('div');
    item.className = 'galeria__item';
    item.setAttribute('aria-hidden', 'true');

    const marcador = document.createElement('div');
    marcador.className = 'marcador';
    marcador.appendChild(iconoCamara());

    const texto = document.createElement('span');
    texto.textContent = TEXTO_PLACEHOLDER;
    marcador.appendChild(texto);

    item.appendChild(marcador);
    grid.appendChild(item);
  }
}

function montarFotos(grid) {
  FOTOS.forEach((foto, i) => {
    const boton = document.createElement('button');
    boton.type = 'button';
    boton.className = 'galeria__item';
    boton.setAttribute('aria-label', `Ampliar foto: ${foto.alt}`);
    boton.dataset.indice = String(i);

    const img = document.createElement('img');
    img.src = foto.src;
    img.alt = foto.alt;
    img.loading = 'lazy';
    boton.appendChild(img);
    grid.appendChild(boton);
  });
}

function montarLightbox(grid) {
  const lightbox = document.getElementById('lightbox');
  const imagen = document.getElementById('lightbox-imagen');
  const btnCerrar = document.getElementById('lightbox-cerrar');
  const btnPrev = document.getElementById('lightbox-prev');
  const btnSig = document.getElementById('lightbox-sig');
  if (!lightbox || !imagen) return;

  let indice = 0;

  function mostrar(i) {
    indice = (i + FOTOS.length) % FOTOS.length;
    imagen.src = FOTOS[indice].src;
    imagen.alt = FOTOS[indice].alt;
  }

  function abrir(i) {
    mostrar(i);
    lightbox.classList.add('abierto');
    document.body.style.overflow = 'hidden';
    btnCerrar.focus();
  }

  function cerrar() {
    lightbox.classList.remove('abierto');
    document.body.style.overflow = '';
  }

  grid.addEventListener('click', (e) => {
    const item = e.target.closest('.galeria__item[data-indice]');
    if (item) abrir(Number(item.dataset.indice));
  });

  btnCerrar.addEventListener('click', cerrar);
  btnPrev.addEventListener('click', () => mostrar(indice - 1));
  btnSig.addEventListener('click', () => mostrar(indice + 1));

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) cerrar();
  });

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('abierto')) return;
    if (e.key === 'Escape') cerrar();
    if (e.key === 'ArrowLeft') mostrar(indice - 1);
    if (e.key === 'ArrowRight') mostrar(indice + 1);
  });
}
