/**
 * First-visit intro / preloader.
 * Runs the full animation only once per session (sessionStorage),
 * is skipped entirely for prefers-reduced-motion, and never blocks
 * content for more than ~2.5s.
 */
const FLAG_SESION = 'ca-intro-vista';
const DURACION_MAX_MS = 2500;

export function initIntro() {
  const preloader = document.getElementById('preloader');
  if (!preloader) return;

  const reducirMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const yaVista = sessionStorage.getItem(FLAG_SESION) === '1';

  if (reducirMovimiento || yaVista || !window.gsap) {
    eliminarPreloader(preloader);
    sessionStorage.setItem(FLAG_SESION, '1');
    return;
  }

  sessionStorage.setItem(FLAG_SESION, '1');
  document.body.style.overflow = 'hidden';

  const letras = preloader.querySelectorAll('.letra');
  const relleno = document.getElementById('preloader-relleno');
  const gsap = window.gsap;

  const tl = gsap.timeline({
    defaults: { ease: 'power2.out' },
    onComplete: () => {
      eliminarPreloader(preloader);
      document.body.style.overflow = '';
      revelarHero();
    },
  });

  tl.from(letras, { y: 40, opacity: 0, duration: 0.45, stagger: 0.12 })
    .from(preloader.querySelector('.preloader__frase'), { opacity: 0, duration: 0.35 }, '-=0.2')
    .to(relleno, { width: '100%', duration: 0.5, ease: 'power1.inOut' }, '-=0.3')
    .to(preloader, { yPercent: -100, duration: 0.6, ease: 'power3.inOut', delay: 0.15 });

  // Hard cap: whatever happens, the preloader disappears.
  setTimeout(() => {
    if (document.body.contains(preloader)) {
      tl.kill();
      eliminarPreloader(preloader);
      document.body.style.overflow = '';
      revelarHero();
    }
  }, DURACION_MAX_MS);
}

function eliminarPreloader(preloader) {
  preloader.remove();
}

function revelarHero() {
  const heroContenido = document.querySelector('.hero__contenido');
  if (!heroContenido || !window.gsap) return;
  gsap.from(heroContenido.children, {
    y: 30,
    opacity: 0,
    duration: 0.6,
    stagger: 0.12,
    ease: 'power2.out',
  });
}
