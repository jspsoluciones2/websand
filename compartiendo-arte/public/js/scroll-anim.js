/**
 * Scroll effects with GSAP ScrollTrigger — scrapbook language:
 * cards reveal like polaroids being pinned to the wall (rise + slight
 * rotation), section headers rise gently, the hero collage floats and
 * follows the pointer with depth. Respects prefers-reduced-motion.
 */
export function initScrollAnimations() {
  if (!window.gsap || !window.ScrollTrigger) return;

  const gsap = window.gsap;
  gsap.registerPlugin(window.ScrollTrigger);

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const mm = gsap.matchMedia();

  // --- Polaroid-style reveals: cards pinned to the wall ---
  const reveals = gsap.utils.toArray('.reveal');
  reveals.forEach((grupo) => {
    gsap.from(grupo, {
      y: 56,
      rotation: 1.8,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: { trigger: grupo, start: 'top 88%' },
    });
  });

  // --- Section headers: eyebrow, headline and tagline rise together ---
  const cabeceras = gsap.utils.toArray('.cabecera-seccion');
  cabeceras.forEach((cab) => {
    gsap.from(cab.children, {
      y: 30,
      opacity: 0,
      duration: 0.65,
      stagger: 0.09,
      ease: 'power2.out',
      scrollTrigger: { trigger: cab, start: 'top 86%' },
    });
  });

  // --- Gallery grid: staggered pin-in ---
  const gridGaleria = document.querySelector('#galeria-grid');
  if (gridGaleria && gridGaleria.children.length) {
    gsap.from(gridGaleria.children, {
      y: 48,
      rotation: (i) => (i % 2 === 0 ? -2.2 : 2),
      opacity: 0,
      duration: 0.7,
      stagger: 0.08,
      ease: 'power3.out',
      scrollTrigger: { trigger: gridGaleria, start: 'top 85%' },
    });
  }

  // --- Hero collage: gentle float + pointer parallax (desktop only) ---
  mm.add('(min-width: 1024px) and (pointer: fine)', () => {
    const polaroids = gsap.utils.toArray('.polaroid');
    if (!polaroids.length) return;

    // Independent float loop per polaroid.
    polaroids.forEach((p, i) => {
      gsap.to(p, {
        y: i % 2 === 0 ? 12 : -12,
        duration: 2.6 + i * 0.4,
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut',
      });
    });

    // Pointer parallax: each polaroid drifts at its own depth.
    const onMove = (e) => {
      const relX = e.clientX / window.innerWidth - 0.5;
      const relY = e.clientY / window.innerHeight - 0.5;
      polaroids.forEach((p) => {
        const profundo = parseFloat(p.dataset.profundo || '1') * 18;
        gsap.to(p, {
          x: relX * profundo,
          yPercent: gsap.getProperty(p, 'yPercent') || 0,
          duration: 0.9,
          ease: 'power2.out',
          overwrite: 'auto',
        });
      });
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  });

  // --- Hero content drifts back as you scroll (desktop) ---
  mm.add('(min-width: 1024px)', () => {
    const heroContenido = document.querySelector('.hero__contenido');
    if (!heroContenido) return;
    gsap.to(heroContenido, {
      yPercent: 14,
      opacity: 0.4,
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
