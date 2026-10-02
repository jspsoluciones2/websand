/**
 * Scroll effects with GSAP ScrollTrigger:
 * section reveals, card stagger and hero content parallax.
 * Respects prefers-reduced-motion (bails out early).
 */
export function initScrollAnimations() {
  if (!window.gsap || !window.ScrollTrigger) return;

  const gsap = window.gsap;
  gsap.registerPlugin(window.ScrollTrigger);

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const mm = gsap.matchMedia();

  // --- Section reveals (all screens) ---
  const reveals = gsap.utils.toArray('.reveal');
  if (reveals.length) {
    mm.add('(min-width: 0px)', () => {
      reveals.forEach((grupo) => {
        gsap.from(grupo, {
          y: 40,
          opacity: 0,
          duration: 0.7,
          ease: 'power2.out',
          scrollTrigger: { trigger: grupo, start: 'top 85%' },
        });
      });
    });
  }

  // --- Section headers rise ---
  const cabeceras = gsap.utils.toArray('.cabecera-seccion');
  if (cabeceras.length) {
    cabeceras.forEach((cab) => {
      gsap.from(cab.children, {
        y: 26,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power2.out',
        scrollTrigger: { trigger: cab, start: 'top 85%' },
      });
    });
  }

  // --- Hero content parallax (desktop pointer only, subtle) ---
  mm.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
    const heroContenido = document.querySelector('.hero__contenido');
    if (!heroContenido) return;
    gsap.to(heroContenido, {
      yPercent: 18,
      opacity: 0.35,
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      },
    });
  });
}
