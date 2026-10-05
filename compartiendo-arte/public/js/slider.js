/**
 * Carrusel del hero (zona visual inicial).
 *
 * Sin dependencias: navega por clases, respeta prefers-reduced-motion,
 * detiene el auto-avance con hover o foco, funciona con teclado (← / →)
 * y no captura el scroll de la página.
 */
import { SLIDES } from './config.js';

const INTERVALO_MS = 6000;

export function initSlider() {
  const raiz = document.getElementById('hero-slider');
  if (!raiz) return;

  const slides = raiz.querySelectorAll('.hero__slide');
  if (slides.length === 0) return;

  const indicadores = raiz.querySelector('.hero__barras');
  const btnAnterior = raiz.querySelector('.hero__flecha--anterior');
  const btnSiguiente = raiz.querySelector('.hero__flecha--siguiente');

  const reducirMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let indice = 0;
  let temporizador = null;

  // Los indicadores se generan desde la fuente de verdad (CONFIG.SLIDES),
  // acotados al número de slides presentes en el HTML para no desalinearlos.
  const total = Math.min(SLIDES.length, slides.length);

  if (indicadores) {
    indicadores.innerHTML = '';
    for (let i = 0; i < total; i++) {
      const barra = document.createElement('button');
      barra.type = 'button';
      barra.className = 'hero__barra';
      barra.setAttribute('aria-label', `Mostrar imagen ${i + 1} de ${total}`);
      barra.addEventListener('click', () => mostrar(i));
      indicadores.appendChild(barra);
    }
  }

  function mostrar(nuevo) {
    indice = (nuevo + slides.length) % slides.length;

    slides.forEach((slide, i) => {
      const activa = i === indice;
      slide.classList.toggle('es-activa', activa);
      slide.setAttribute('aria-hidden', String(!activa));
    });

    if (indicadores) {
      indicadores.querySelectorAll('.hero__barra').forEach((barra, i) => {
        barra.classList.toggle('es-activa', i === indice);
        barra.setAttribute('aria-current', i === indice ? 'true' : 'false');
      });
    }
  }

  function detener() {
    if (temporizador !== null) {
      clearInterval(temporizador);
      temporizador = null;
    }
  }

  function iniciar() {
    detener();
    if (reducirMovimiento || document.hidden) return;
    temporizador = setInterval(() => mostrar(indice + 1), INTERVALO_MS);
  }

  function avanzar(delta) {
    mostrar(indice + delta);
    iniciar();
  }

  // Navegación
  if (btnAnterior) btnAnterior.addEventListener('click', () => avanzar(-1));
  if (btnSiguiente) btnSiguiente.addEventListener('click', () => avanzar(1));

  // Teclado: solo cuando el carrusel tiene el foco dentro.
  raiz.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
      avanzar(-1);
      e.preventDefault();
    }
    if (e.key === 'ArrowRight') {
      avanzar(1);
      e.preventDefault();
    }
  });

  // El auto-avance se detiene con hover y con foco dentro del carrusel.
  raiz.addEventListener('mouseenter', detener);
  raiz.addEventListener('mouseleave', iniciar);
  raiz.addEventListener('focusin', detener);
  raiz.addEventListener('focusout', iniciar);

  // No se avanza con la pestaña en segundo plano.
  document.addEventListener('visibilitychange', iniciar);

  mostrar(0);
  iniciar();
}