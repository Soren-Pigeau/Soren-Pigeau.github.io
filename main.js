/* =========================================================
   SOREN PIGEAU · PORTFOLIO 3D
   main.js · ES module

   3D minimaliste : nuage de points violets minuscules
   en arrière-plan de TOUT le site. Pas de bloom, pas de
   halo, juste des étoiles violettes très discrètes qui
   dérivent doucement avec parallax à la souris.
   ========================================================= */

import * as THREE from 'three';

/* =========================================================
   ANNÉE FOOTER
   ========================================================= */
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* =========================================================
   LOADER
   ========================================================= */
function hideLoader() {
  const l = document.getElementById('loader');
  if (l) l.classList.add('is-hidden');
}
setTimeout(hideLoader, 1500);

/* =========================================================
   SMOOTH SCROLL (natif via CSS) + interception des liens
   ========================================================= */
document.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener('click', (e) => {
    const id = a.getAttribute('href');
    if (id === '#') return;
    const target = document.querySelector(id);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* =========================================================
   NAVBAR : glassmorphism au scroll + lien actif
   ========================================================= */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 8);
}, { passive: true });

const navLinks = document.querySelectorAll('.nav-links a');
const linkById = new Map();
navLinks.forEach((l) => {
  const id = l.getAttribute('href')?.replace('#', '');
  if (id) linkById.set(id, l);
});

const navObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      navLinks.forEach((l) => l.classList.remove('is-active'));
      linkById.get(entry.target.id)?.classList.add('is-active');
    }
  });
}, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });
document.querySelectorAll('main section[id]').forEach((s) => navObserver.observe(s));

/* =========================================================
   REVEAL UNIVERSEL : IntersectionObserver natif
   ========================================================= */
const revealTargets = document.querySelectorAll(
  '.section-head, .about-grid, .search-lead, .search-card, ' +
  '.projects-intro, .project, .all-projects, ' +
  '.skills-col, .timeline-item, .contact-inner'
);
revealTargets.forEach((el) => el.classList.add('reveal'));

const revealObserver = new IntersectionObserver((entries, obs) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      obs.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
revealTargets.forEach((el) => revealObserver.observe(el));

/* =========================================================
   COMPÉTENCES : effet de vague (stagger)
   ========================================================= */
const skillsObserver = new IntersectionObserver((entries, obs) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const pills = entry.target.querySelectorAll('.skills-list li');
      pills.forEach((pill, i) => {
        setTimeout(() => pill.classList.add('is-visible'), i * 50);
      });
      obs.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });
document.querySelectorAll('.skills-col').forEach((c) => skillsObserver.observe(c));

/* =========================================================
   TIMELINE : ligne qui se dessine au scroll
   ========================================================= */
const timeline = document.getElementById('timeline');
const timelineProgress = document.getElementById('timeline-progress');
if (timeline && timelineProgress) {
  const updateTimeline = () => {
    const rect = timeline.getBoundingClientRect();
    const vh = window.innerHeight;
    const start = vh * 0.7;
    const end = vh * 0.3;
    const total = rect.height + (start - end);
    const scrolled = start - rect.top;
    const progress = Math.max(0, Math.min(1, scrolled / total));
    timelineProgress.style.height = (rect.height * progress) + 'px';
  };
  window.addEventListener('scroll', updateTimeline, { passive: true });
  window.addEventListener('resize', updateTimeline);
  updateTimeline();
}

/* =========================================================
   TILT 3D sur les cards
   ========================================================= */
document.querySelectorAll('[data-tilt]').forEach((el) => {
  const max = el.classList.contains('project') ? 8 : 5;
  el.addEventListener('mousemove', (e) => {
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(900px) rotateX(${-y * max}deg) rotateY(${x * max}deg) translateY(-4px)`;
    el.style.setProperty('--mx', `${(x + 0.5) * 100}%`);
    el.style.setProperty('--my', `${(y + 0.5) * 100}%`);
  });
  el.addEventListener('mouseleave', () => { el.style.transform = ''; });
});

/* =========================================================
   PHOTO : fallback automatique
   ========================================================= */
const photoImg = document.getElementById('profile-photo');
const photoFrame = document.getElementById('photo-frame');
if (photoImg && photoFrame) {
  photoImg.addEventListener('error', () => {
    photoFrame.classList.add('no-photo');
    console.warn('⚠️ Photo introuvable. Place ton fichier dans assets/photo.png');
  });
  photoImg.addEventListener('load', () => console.log('✓ Photo chargée'));
}

/* =========================================================
   HERO : RÉVÉLATION DU TEXTE
   ========================================================= */
function revealHeroText() {
  const chars = document.querySelectorAll('.hero-title .char');
  chars.forEach((c, i) => {
    setTimeout(() => c.classList.add('is-visible'), 400 + i * 40);
  });
  setTimeout(() => {
    document.querySelector('.hero-title .period')?.classList.add('is-visible');
  }, 400 + chars.length * 40 + 100);
  setTimeout(() => document.querySelector('.badge')?.classList.add('is-visible'), 300);
  setTimeout(() => document.querySelector('.hero-tagline')?.classList.add('is-visible'), 1000);
  setTimeout(() => document.querySelector('.hero-cta')?.classList.add('is-visible'), 1200);
  setTimeout(() => document.querySelector('.hero-meta')?.classList.add('is-visible'), 1400);
  setTimeout(() => document.getElementById('scroll-indicator')?.classList.add('is-visible'), 1800);
}

/* =========================================================
   CANVAS 3D · ARRIÈRE-PLAN MINIMALISTE DU SITE ENTIER

   - Petits points violets (1 à 3 pixels)
   - Pas de bloom, pas de halo : juste des points nets
   - Le canvas est position:fixed donc visible derrière TOUTES
     les sections, pas seulement le hero
   ========================================================= */
const canvas = document.getElementById('bg-canvas');

const testCanvas = document.createElement('canvas');
const webglOK = !!(testCanvas.getContext('webgl2') || testCanvas.getContext('webgl'));

function initBg3D() {
  if (!webglOK) {
    if (canvas) canvas.style.display = 'none';
    return;
  }

  // ----- Configuration -----
  const PARTICLE_COUNT = 1500;
  const RADIUS_MIN = 2.0;
  const RADIUS_MAX = 5.5;

  // ----- Renderer -----
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance',
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x080808, 1);

  // ----- Scène + caméra -----
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    55, window.innerWidth / window.innerHeight, 0.1, 100
  );
  camera.position.set(0, 0, 5);

  // ----- Génération des positions :
  //       nuage 3D sphérique avec 3 couches de profondeur -----
  const positions = new Float32Array(PARTICLE_COUNT * 3);
  const layers    = new Float32Array(PARTICLE_COUNT);
  const sizes     = new Float32Array(PARTICLE_COUNT);
  const randoms   = new Float32Array(PARTICLE_COUNT);

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const i3 = i * 3;

    // Direction aléatoire uniforme sur la sphère
    const u = Math.random();
    const v = Math.random();
    const theta = 2 * Math.PI * u;
    const phi = Math.acos(2 * v - 1);

    // Rayon aléatoire (biaisé vers l'extérieur pour aérer le centre)
    const r = RADIUS_MIN + Math.pow(Math.random(), 0.6) * (RADIUS_MAX - RADIUS_MIN);

    positions[i3]     = r * Math.sin(phi) * Math.cos(theta);
    positions[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i3 + 2] = r * Math.cos(phi);

    // Couche de profondeur (parallax)
    layers[i] = Math.floor(Math.random() * 3);

    // Taille TRÈS petite (0.6 à 1.6 multipliés par la perspective)
    sizes[i] = 0.6 + Math.random() * 1.0;

    // Seed aléatoire
    randoms[i] = Math.random();
  }

  // ----- Geometry -----
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('aLayer',   new THREE.BufferAttribute(layers, 1));
  geometry.setAttribute('aSize',    new THREE.BufferAttribute(sizes, 1));
  geometry.setAttribute('aRandom',  new THREE.BufferAttribute(randoms, 1));

  // ----- Shader Material : minimal, points pixel-perfect -----
  const uniforms = {
    uTime:   { value: 0 },
    uReveal: { value: 0 },
    uMouse:  { value: new THREE.Vector2(0, 0) },
    uPixel:  { value: renderer.getPixelRatio() },
    uColor:  { value: new THREE.Color('#7c3aed') },
    uColor2: { value: new THREE.Color('#a78bfa') },
  };

  const vertexShader = /* glsl */`
    uniform float uTime;
    uniform float uReveal;
    uniform vec2  uMouse;
    uniform float uPixel;

    attribute float aLayer;
    attribute float aSize;
    attribute float aRandom;

    varying float vRandom;
    varying float vDepth;

    void main() {
      vec3 pos = position;

      // Dérive organique très lente
      float n = aRandom * 6.2831;
      pos.x += sin(uTime * 0.20 + n)        * 0.06;
      pos.y += cos(uTime * 0.18 + n * 1.3)  * 0.06;
      pos.z += sin(uTime * 0.22 + n * 0.7)  * 0.04;

      // Parallax 3D selon la couche
      float layerSpeed = 0.03 + aLayer * 0.03; // 0.03 / 0.06 / 0.09
      pos.x += uMouse.x * layerSpeed;
      pos.y += uMouse.y * layerSpeed;

      // Rotation très lente du nuage
      float rot = uTime * 0.025;
      float cs = cos(rot);
      float sn = sin(rot);
      vec3 rotated = vec3(
        pos.x * cs - pos.z * sn,
        pos.y,
        pos.x * sn + pos.z * cs
      );

      vec4 mvPos = modelViewMatrix * vec4(rotated, 1.0);
      gl_Position = projectionMatrix * mvPos;

      // Taille : MINUSCULE (1 à 3 pixels typiquement)
      // Formule simple sans grosse multiplication par la perspective
      float dist = -mvPos.z;
      gl_PointSize = aSize * uPixel * uReveal * (5.0 / dist);

      vRandom = aRandom;
      vDepth = clamp((rotated.z + 5.0) * 0.12, 0.0, 1.0);
    }
  `;

  const fragmentShader = /* glsl */`
    uniform vec3  uColor;
    uniform vec3  uColor2;
    uniform float uTime;
    uniform float uReveal;

    varying float vRandom;
    varying float vDepth;

    void main() {
      vec2 uv = gl_PointCoord - 0.5;
      float dist = length(uv);

      // Disque doux SANS halo pour des points nets et minimalistes
      float alpha = smoothstep(0.5, 0.0, dist) * 0.9;
      if (alpha < 0.01) discard;

      // Variation subtile violet → violet clair
      vec3 color = mix(uColor, uColor2, vDepth * 0.4);

      // Twinkle léger (scintillement discret)
      float twinkle = 0.8 + 0.2 * sin(uTime * 1.2 + vRandom * 12.0);
      color *= twinkle;

      gl_FragColor = vec4(color, alpha * uReveal);
    }
  `;

  const material = new THREE.ShaderMaterial({
    uniforms,
    vertexShader,
    fragmentShader,
    transparent: true,
    depthWrite: false,
    // PAS de AdditiveBlending : ça rendait les points "lumineux"
    // qui s'additionnaient quand ils se superposaient. NormalBlending
    // garde des points discrets.
    blending: THREE.NormalBlending,
  });

  const points = new THREE.Points(geometry, material);
  scene.add(points);

  // ----- Souris (lerp pour adoucir) -----
  const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
  window.addEventListener('mousemove', (e) => {
    mouse.tx = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.ty = -((e.clientY / window.innerHeight) * 2 - 1);
  });

  // ----- Pause quand l'onglet est masqué -----
  let renderActive = true;
  document.addEventListener('visibilitychange', () => {
    renderActive = !document.hidden;
  });

  // ----- Boucle d'animation -----
  const clock = new THREE.Clock();
  const startTime = performance.now();
  const REVEAL_DURATION = 2500;

  function animate() {
    requestAnimationFrame(animate);
    if (!renderActive) return;

    uniforms.uTime.value = clock.getElapsedTime();

    // Fade-in progressif
    const elapsed = performance.now() - startTime;
    const t = Math.min(1, elapsed / REVEAL_DURATION);
    uniforms.uReveal.value = 1 - Math.pow(1 - t, 3);

    // Lerp souris
    mouse.x += (mouse.tx - mouse.x) * 0.04;
    mouse.y += (mouse.ty - mouse.y) * 0.04;
    uniforms.uMouse.value.set(mouse.x, mouse.y);

    // Rendu direct (pas de post-processing, pas de bloom)
    renderer.render(scene, camera);
  }
  animate();

  // ----- Resize debounced -----
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      uniforms.uPixel.value = renderer.getPixelRatio();
    }, 150);
  });
}

/* =========================================================
   DÉMARRAGE
   ========================================================= */
try {
  initBg3D();
} catch (e) {
  console.error('Three.js error:', e);
  if (canvas) canvas.style.display = 'none';
}

revealHeroText();
hideLoader();
