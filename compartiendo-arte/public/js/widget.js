/**
 * Floating contact widget: FAB + expandable menu with three
 * channels (WhatsApp link, AI assistant modal, email/Tally modal).
 * Accessible: keyboard, Esc-to-close, focus management, aria.
 */
export function initWidget() {
  const fab = document.getElementById('widget-fab');
  const menu = document.getElementById('widget-menu');
  if (!fab || !menu) return;

  const modales = Array.from(document.querySelectorAll('.widget-modal'));
  const reducirMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let menuAbierto = false;

  function alternarMenu(abrir) {
    menuAbierto = abrir ?? !menuAbierto;
    menu.classList.toggle('abierto', menuAbierto);
    fab.setAttribute('aria-expanded', String(menuAbierto));
  }

  fab.addEventListener('click', () => alternarMenu());

  // Close menu when clicking outside the widget.
  document.addEventListener('click', (e) => {
    if (menuAbierto && !document.getElementById('widget-contacto').contains(e.target)) {
      alternarMenu(false);
    }
  });

  // --- Modals ---
  function abrirModal(modal) {
    cerrarModales();
    modal.classList.add('abierto');
    document.body.style.overflow = 'hidden';
    alternarMenu(false);
    const boton = modal.querySelector('.widget-modal__cerrar');
    if (boton) boton.focus();
  }

  function cerrarModales() {
    modales.forEach((m) => m.classList.remove('abierto'));
    document.body.style.overflow = '';
  }

  const modalIa = document.getElementById('modal-ia');
  const modalCorreo = document.getElementById('modal-correo');
  const btnIa = document.getElementById('widget-ia-btn');
  const btnCorreo = document.getElementById('widget-correo-btn');

  if (btnIa && modalIa) btnIa.addEventListener('click', () => abrirModal(modalIa));
  if (btnCorreo && modalCorreo) btnCorreo.addEventListener('click', () => abrirModal(modalCorreo));

  modales.forEach((modal) => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal || e.target.closest('[data-cerrar-modal]')) {
        cerrarModales();
        fab.focus();
      }
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if (modales.some((m) => m.classList.contains('abierto'))) {
      cerrarModales();
      fab.focus();
    } else if (menuAbierto) {
      alternarMenu(false);
    }
  });

  // Subtle attention pulse on the FAB (skipped for reduced motion).
  if (!reducirMovimiento && window.gsap) {
    window.gsap.to(fab, {
      scale: 1.06,
      duration: 0.5,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      repeatDelay: 6,
      delay: 6,
    });
  }
}
