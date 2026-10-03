/**
 * Navbar behavior: compact on scroll, scroll-spy for active link,
 * and accessible mobile menu (hamburger) with Esc-to-close.
 */
export function initNavbar() {
  const navbar = document.getElementById('navbar');
  const hamburguesa = document.getElementById('hamburguesa');
  const menuMovil = document.getElementById('menu-movil');
  if (!navbar) return;

  // Elevated shadow when the pill scrolls with the page.
  window.addEventListener(
    'scroll',
    () => navbar.classList.toggle('desplazada', window.scrollY > 40),
    { passive: true }
  );

  // Scroll-spy: highlight the link of the section in view.
  const enlaces = Array.from(document.querySelectorAll('#navbar-enlaces a[href^="#"]'));
  if ('IntersectionObserver' in window && enlaces.length) {
    const secciones = enlaces
      .map((a) => document.querySelector(a.getAttribute('href')))
      .filter(Boolean);

    const observador = new IntersectionObserver(
      (entradas) => {
        entradas.forEach((entrada) => {
          if (!entrada.isIntersecting) return;
          enlaces.forEach((a) =>
            a.classList.toggle('activo', a.getAttribute('href') === `#${entrada.target.id}`)
          );
        });
      },
      { rootMargin: '-40% 0px -55% 0px' }
    );
    secciones.forEach((s) => observador.observe(s));
  }

  // Mobile menu.
  if (!hamburguesa || !menuMovil) return;

  const alternarMenu = (abrir) => {
    const abierto = abrir ?? menuMovil.classList.toggle('abierto');
    menuMovil.classList.toggle('abierto', abierto);
    hamburguesa.setAttribute('aria-expanded', String(abierto));
    hamburguesa.setAttribute(
      'aria-label',
      abierto ? 'Cerrar menú de navegación' : 'Abrir menú de navegación'
    );
    document.body.style.overflow = abierto ? 'hidden' : '';
  };

  hamburguesa.addEventListener('click', () => alternarMenu());

  menuMovil.addEventListener('click', (e) => {
    if (e.target.tagName === 'A') alternarMenu(false);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menuMovil.classList.contains('abierto')) {
      alternarMenu(false);
      hamburguesa.focus();
    }
  });
}
