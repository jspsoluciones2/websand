/**
 * "Lienzo vivo" — warm bokeh dust in brand colors floating over the
 * cream paper hero (Portrait scrapbook adaptation). Normal blending,
 * low opacity, slow drift. Initialized after window load, paused when
 * the hero leaves the viewport, skipped for prefers-reduced-motion.
 */
const COLOR_LETRAS = [0xe7ac23, 0xdb141c, 0x082e8e, 0xf6c150, 0x8697c6, 0xe7ac23];

export function initHero3D() {
  const fondo = document.getElementById('hero-fondo');
  const canvas = document.getElementById('hero-canvas');
  if (!fondo || !canvas) return;

  // Reduced motion: no 3D at all — the calm paper hero stands alone.
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (!window.WebGLRenderingContext) return;

  import('https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js')
    .then((THREE) => montarEscena(THREE, fondo, canvas))
    .catch(() => {
      /* CDN unavailable: the cream hero remains as the graceful fallback. */
    });
}

function montarEscena(THREE, fondo, canvas) {
  fondo.hidden = false;

  const escena = new THREE.Scene();

  const camara = new THREE.PerspectiveCamera(60, fondo.clientWidth / fondo.clientHeight, 0.1, 100);
  camara.position.set(0, 0, 14);

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(fondo.clientWidth, fondo.clientHeight);

  // --- Soft bokeh dust in brand colors (golden-hour feel) ---
  const TOTAL = 1100;
  const posiciones = new Float32Array(TOTAL * 3);
  const colores = new Float32Array(TOTAL * 3);
  const escalas = new Float32Array(TOTAL);
  const color = new THREE.Color();

  for (let i = 0; i < TOTAL; i++) {
    posiciones[i * 3] = (Math.random() - 0.5) * 34;      // x
    posiciones[i * 3 + 1] = (Math.random() - 0.5) * 21;  // y
    posiciones[i * 3 + 2] = (Math.random() - 0.5) * 14;  // z

    color.setHex(COLOR_LETRAS[i % COLOR_LETRAS.length]);
    colores[i * 3] = color.r;
    colores[i * 3 + 1] = color.g;
    colores[i * 3 + 2] = color.b;

    escalas[i] = 0.15 + Math.random() * 0.85;
  }

  const geometria = new THREE.BufferGeometry();
  geometria.setAttribute('position', new THREE.BufferAttribute(posiciones, 3));
  geometria.setAttribute('color', new THREE.BufferAttribute(colores, 3));

  const material = new THREE.PointsMaterial({
    size: 0.16,
    vertexColors: true,
    transparent: true,
    opacity: 0.32,
    depthWrite: false,
    blending: THREE.NormalBlending,
  });

  const puntos = new THREE.Points(geometria, material);
  escena.add(puntos);

  // --- Mouse / touch parallax (lerped) ---
  const objetivo = { x: 0, y: 0 };
  const actual = { x: 0, y: 0 };

  window.addEventListener('pointermove', (e) => {
    objetivo.x = (e.clientX / window.innerWidth - 0.5) * 2;
    objetivo.y = (e.clientY / window.innerHeight - 0.5) * 2;
  }, { passive: true });

  // --- Pause when the hero is off-screen ---
  let visible = true;
  const observador = new IntersectionObserver(([entrada]) => {
    visible = entrada.isIntersecting;
  });
  observador.observe(fondo);

  window.addEventListener('resize', () => {
    camara.aspect = fondo.clientWidth / fondo.clientHeight;
    camara.updateProjectionMatrix();
    renderer.setSize(fondo.clientWidth, fondo.clientHeight);
  }, { passive: true });

  // --- Animation loop: slow golden-hour drift ---
  const reloj = new THREE.Clock();
  const base = posiciones.slice();

  function animar() {
    requestAnimationFrame(animar);
    if (!visible) return;

    const t = reloj.getElapsedTime();
    const attr = geometria.attributes.position;

    for (let i = 0; i < TOTAL; i++) {
      const vel = 0.1 + escalas[i] * 0.3;
      attr.array[i * 3 + 1] = base[i * 3 + 1] + Math.sin(t * vel + i) * 0.5;
      attr.array[i * 3] = base[i * 3] + Math.cos(t * vel * 0.55 + i * 0.4) * 0.28;
    }
    attr.needsUpdate = true;

    puntos.rotation.y = t * 0.02;

    actual.x += (objetivo.x - actual.x) * 0.03;
    actual.y += (objetivo.y - actual.y) * 0.03;
    camara.position.x = actual.x * 1.4;
    camara.position.y = -actual.y * 1;
    camara.lookAt(0, 0, 0);

    renderer.render(escena, camara);
  }

  animar();
}
