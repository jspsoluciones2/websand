/**
 * Revelado discreto de los bloques al entrar en pantalla.
 * IntersectionObserver + una clase de CSS: sin dependencias externas.
 * Respeta prefers-reduced-motion y no oculta nada si el JS no corre,
 * porque el estado inicial solo se oculta cuando la raíz lleva .tiene-reveal.
 */
export function initReveal() {
  const objetivos = document.querySelectorAll('.reveal, .cabecera-seccion');
  if (!objetivos.length) return;

  const reducirMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reducirMovimiento || !('IntersectionObserver' in window)) {
    objetivos.forEach((el) => el.classList.add('es-visible'));
    return;
  }

  document.documentElement.classList.add('tiene-reveal');

  const observador = new IntersectionObserver(
    (entradas) => {
      entradas.forEach((entrada) => {
        if (!entrada.isIntersecting) return;
        entrada.target.classList.add('es-visible');
        observador.unobserve(entrada.target);
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
  );

  objetivos.forEach((el) => observador.observe(el));
}