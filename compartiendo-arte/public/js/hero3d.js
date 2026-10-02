/**
 * "El lienzo vivo" — Three.js particle field in brand colors
 * for the hero section. Initialized after window load, paused when
 * the hero leaves the viewport, skipped for prefers-reduced-motion.
 */
const COLOR_LETRAS = [0xdb141c, 0x082e8e, 0xf6c150, 0xe7ac23, 0x8697c6];

export function initHero3D() {
  const fondo = document.getElementById('hero-fondo');
  const canvas = document.getElementById('hero-canvas');
  if (!fondo || !canvas) return;

  // Reduced motion: keep the static CSS gradient, no 3D at all.
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (!window.WebGLRenderingContext) return;

  import('https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js')
    .then((THREE) => montarEscena(THREE, fondo, canvas))
    .catch(() => {
      /* CDN unavailable: the static gradient hero remains as fallback. */
    });
}

function montarEscena(THREE, fondo, canvas) {
  fondo.hidden = false;

  const escena = new THREE.Scene();
  escena.fog = new THREE.FogExp2(0x06070a, 0.055);

  const camara = new THREE.PerspectiveCamera(60, fondo.clientWidth / fondo.clientHeight, 0.1, 100);
  camara.position.set(0, 0, 14);

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(fondo.clientWidth, fondo.clientHeight);

  // --- Particle field in brand colors ---
  const TOTAL = 1800;
  const posiciones = new Float32Array(TOTAL * 3);
  const colores = new Float32Array(TOTAL * 3);
  const velocidades = new Float32Array(TOTAL);
  const color = new THREE.Color();

  for (let i = 0; i < TOTAL; i++) {
    posiciones[i * 3] = (Math.random() - 0.5) * 36;      // x
    posiciones[i * 3 + 1] = (Math.random() - 0.5) * 22;  // y
    posiciones[i * 3 + 2] = (Math.random() - 0.5) * 16;  // z

    color.setHex(COLOR_LETRAS[i % COLOR_LETRAS.length]);
    colores[i * 3] = color.r;
    colores[i * 3 + 1] = color.g;
    colores[i * 3 + 2] = color.b;

    velocidades[i] = 0.15 + Math.random() * 0.45;
  }

  const geometria = new THREE.BufferGeometry();
  geometria.setAttribute('position', new THREE.BufferAttribute(posiciones, 3));
  geometria.setAttribute('color', new THREE.BufferAttribute(colores, 3));

  const material = new THREE.PointsMaterial({
    size: 0.14,
    vertexColors: true,
    transparent: true,
    opacity: 0.85,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
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

  // --- Resize ---
  window.addEventListener('resize', () => {
    camara.aspect = fondo.clientWidth / fondo.clientHeight;
    camara.updateProjectionMatrix();
    renderer.setSize(fondo.clientWidth, fondo.clientHeight);
  }, { passive: true });

  // --- Animation loop ---
  const reloj = new THREE.Clock();
  const base = posiciones.slice();

  function animar() {
    requestAnimationFrame(animar);
    if (!visible) return;

    const t = reloj.getElapsedTime();
    const attr = geometria.attributes.position;

    for (let i = 0; i < TOTAL; i++) {
      // Gentle floating: sine drift over the base position.
      attr.array[i * 3 + 1] = base[i * 3 + 1] + Math.sin(t * velocidades[i] + i) * 0.55;
      attr.array[i * 3] = base[i * 3] + Math.cos(t * velocidades[i] * 0.6 + i * 0.5) * 0.3;
    }
    attr.needsUpdate = true;

    puntos.rotation.y = t * 0.03;

    actual.x += (objetivo.x - actual.x) * 0.04;
    actual.y += (objetivo.y - actual.y) * 0.04;
    camara.position.x = actual.x * 1.6;
    camara.position.y = -actual.y * 1.2;
    camara.lookAt(0, 0, 0);

    renderer.render(escena, camara);
  }

  animar();
}
