/* =========================================================
   SOREN PIGEAU · PORTFOLIO 3D
   main.js · ES module
   La 3D est totalement indépendante des autres librairies.
   Si quoi que ce soit plante, le diagnostic en haut à droite
   affiche le détail.
   ========================================================= */

import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';

/* =========================================================
   PANNEAU DE DIAGNOSTIC
   ========================================================= */
const diag = (() => {
  const el = document.getElementById('diag');
  const rows = {};
  const set = (key, ok, label) => {
    if (!rows[key]) {
      const row = document.createElement('div');
      row.className = 'row';
      const lbl = document.createElement('span');
      const val = document.createElement('span');
      row.append(lbl, val);
      el.appendChild(row);
      rows[key] = { lbl, val };
    }
    rows[key].lbl.textContent = label || key;
    rows[key].val.textContent = ok ? '✓' : '✗';
    rows[key].val.className = ok ? 'ok' : 'ko';
  };
  const error = (msg) => {
    const e = document.createElement('div');
    e.className = 'err';
    e.textContent = msg;
    el.appendChild(e);
    el.classList.remove('hidden');
  };
  const hide = () => el.classList.add('hidden');
  return { set, error, hide };
})();

// 1. Présence des libs externes
diag.set('three', true, 'Three.js');
diag.set('gsap', !!window.gsap, 'GSAP');

// 2. WebGL disponible ?
const testCanvas = document.createElement('canvas');
const webgl = !!(testCanvas.getContext('webgl2') || testCanvas.getContext('webgl'));
diag.set('webgl', webgl, 'WebGL');

/* =========================================================
   ANNÉE FOOTER
   ========================================================= */
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* =========================================================
   LOADER : on le fait disparaître dans tous les cas
   ========================================================= */
function hideLoader() {
  const l = document.getElementById('loader');
  if (l) l.classList.add('is-hidden');
}
// Au plus tard après 2s (au cas où Three.js serait lent)
setTimeout(hideLoader, 2000);

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
   REVEAL UNIVERSEL : IntersectionObserver natif (pas de GSAP)
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
   COMPÉTENCES : effet de vague (stagger via setTimeout)
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
    // Progression : commence quand le haut atteint 70% du viewport,
    // termine quand le bas atteint 30%
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
    console.warn('⚠️ photo.jpg introuvable — silhouette affichée à la place.');
  });
  photoImg.addEventListener('load', () => console.log('✓ Photo chargée'));
}

/* =========================================================
   HERO : RÉVÉLATION DU TEXTE (sans dépendance GSAP)
   On utilise simplement les classes CSS .is-visible
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
   HERO 3D · Three.js (entièrement isolé)
   ========================================================= */
let threeRunning = false;
const canvas = document.getElementById('hero-canvas');

function initHero3D() {
  if (!webgl) {
    diag.error('WebGL non disponible sur cet appareil.');
    return;
  }

  const PARTICLE_COUNT = 3000;

  /* ----- Renderer ----- */
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance',
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x080808, 1);

  /* ----- Scène + caméra ----- */
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    55, window.innerWidth / window.innerHeight, 0.1, 100
  );
  camera.position.set(0, 0, 5);

  /* ----- Génération des positions (sphère & tore) ----- */
  const spherePositions = new Float32Array(PARTICLE_COUNT * 3);
  const torusPositions  = new Float32Array(PARTICLE_COUNT * 3);
  const layers          = new Float32Array(PARTICLE_COUNT);
  const sizes           = new Float32Array(PARTICLE_COUNT);
  const randoms         = new Float32Array(PARTICLE_COUNT);

  const RADIUS_SPHERE = 1.6;
  const TORUS_R = 1.5;
  const TORUS_r = 0.55;

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const i3 = i * 3;

    // Sphère uniforme
    const u = Math.random();
    const v = Math.random();
    const theta = 2 * Math.PI * u;
    const phi = Math.acos(2 * v - 1);
    const layerOffset = (Math.random() - 0.5) * 0.3;
    spherePositions[i3]     = (RADIUS_SPHERE + layerOffset) * Math.sin(phi) * Math.cos(theta);
    spherePositions[i3 + 1] = (RADIUS_SPHERE + layerOffset) * Math.sin(phi) * Math.sin(theta);
    spherePositions[i3 + 2] = (RADIUS_SPHERE + layerOffset) * Math.cos(phi);

    // Tore paramétrique
    const tu = Math.random() * Math.PI * 2;
    const tv = Math.random() * Math.PI * 2;
    const tOffset = (Math.random() - 0.5) * 0.15;
    torusPositions[i3]     = (TORUS_R + (TORUS_r + tOffset) * Math.cos(tv)) * Math.cos(tu);
    torusPositions[i3 + 1] = (TORUS_R + (TORUS_r + tOffset) * Math.cos(tv)) * Math.sin(tu);
    torusPositions[i3 + 2] = (TORUS_r + tOffset) * Math.sin(tv);

    layers[i]  = Math.floor(Math.random() * 3);
    sizes[i]   = 6 + Math.random() * 10;
    randoms[i] = Math.random();
  }

  /* ----- Geometry ----- */
  const geometry = new THREE.BufferGeometry();
  const initPos = new Float32Array(PARTICLE_COUNT * 3); // tous à 0,0,0
  geometry.setAttribute('position',   new THREE.BufferAttribute(initPos, 3));
  geometry.setAttribute('aSpherePos', new THREE.BufferAttribute(spherePositions, 3));
  geometry.setAttribute('aTorusPos',  new THREE.BufferAttribute(torusPositions, 3));
  geometry.setAttribute('aLayer',     new THREE.BufferAttribute(layers, 1));
  geometry.setAttribute('aSize',      new THREE.BufferAttribute(sizes, 1));
  geometry.setAttribute('aRandom',    new THREE.BufferAttribute(randoms, 1));

  /* ----- Shader Material ----- */
  const uniforms = {
    uTime:      { value: 0 },
    uMorph:     { value: 0 },
    uReveal:    { value: 0 },
    uMouse:     { value: new THREE.Vector2(0, 0) },
    uPixel:     { value: renderer.getPixelRatio() },
    uColdColor: { value: new THREE.Color('#4f8ef7') },
    uWarmColor: { value: new THREE.Color('#7c3aed') },
  };

  const vertexShader = /* glsl */`
    uniform float uTime;
    uniform float uMorph;
    uniform float uReveal;
    uniform vec2  uMouse;
    uniform float uPixel;

    attribute vec3  aSpherePos;
    attribute vec3  aTorusPos;
    attribute float aLayer;
    attribute float aSize;
    attribute float aRandom;

    varying float vDepth;
    varying float vRandom;

    float easeOutCubic(float x) { return 1.0 - pow(1.0 - x, 3.0); }

    void main() {
      // Morph sphère ↔ tore
      float morph = smoothstep(0.0, 1.0, uMorph);
      vec3 morphedPos = mix(aSpherePos, aTorusPos, morph);

      // Bruit organique
      float n = aRandom * 6.2831;
      vec3 noiseOffset = vec3(
        sin(uTime * 0.6 + n)        * 0.06,
        cos(uTime * 0.5 + n * 1.3)  * 0.06,
        sin(uTime * 0.7 + n * 0.7)  * 0.06
      );
      morphedPos += noiseOffset;

      // Reveal : explosion depuis (0,0,0)
      float reveal = easeOutCubic(uReveal);
      vec3 finalPos = mix(vec3(0.0), morphedPos, reveal);

      // Parallax 3D selon la couche
      float layerSpeed = 0.06 + aLayer * 0.05;
      finalPos.x += uMouse.x * layerSpeed;
      finalPos.y += uMouse.y * layerSpeed;

      // Rotation lente globale
      float rot = uTime * 0.08;
      float cs = cos(rot);
      float sn = sin(rot);
      vec3 rotatedPos = vec3(
        finalPos.x * cs - finalPos.z * sn,
        finalPos.y,
        finalPos.x * sn + finalPos.z * cs
      );

      vec4 mvPos = modelViewMatrix * vec4(rotatedPos, 1.0);
      gl_Position = projectionMatrix * mvPos;

      // Taille selon Z
      float dist = -mvPos.z;
      gl_PointSize = aSize * (300.0 / dist) * uPixel * reveal;

      vDepth = clamp((rotatedPos.z + 2.0) * 0.25, 0.0, 1.0);
      vRandom = aRandom;
    }
  `;

  const fragmentShader = /* glsl */`
    uniform vec3  uColdColor;
    uniform vec3  uWarmColor;
    uniform float uTime;

    varying float vDepth;
    varying float vRandom;

    void main() {
      vec2 uv = gl_PointCoord - 0.5;
      float dist = length(uv);
      float core = smoothstep(0.5, 0.0, dist);
      float halo = smoothstep(0.5, 0.15, dist);
      float alpha = core * 0.9 + halo * halo * 0.35;
      if (alpha < 0.01) discard;
      vec3 color = mix(uColdColor, uWarmColor, vDepth);
      float twinkle = 0.85 + 0.15 * sin(uTime * 2.0 + vRandom * 12.0);
      color *= twinkle;
      gl_FragColor = vec4(color, alpha);
    }
  `;

  const material = new THREE.ShaderMaterial({
    uniforms,
    vertexShader,
    fragmentShader,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  const points = new THREE.Points(geometry, material);
  scene.add(points);

  /* ----- Post-processing ----- */
  const renderScene = new RenderPass(scene, camera);
  const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    0.8, 0.4, 0.2
  );
  const outputPass = new OutputPass();
  const composer = new EffectComposer(renderer);
  composer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  composer.setSize(window.innerWidth, window.innerHeight);
  composer.addPass(renderScene);
  composer.addPass(bloomPass);
  composer.addPass(outputPass);

  /* ----- Souris (lerp pour adoucir) ----- */
  const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
  window.addEventListener('mousemove', (e) => {
    mouse.tx = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.ty = -((e.clientY / window.innerHeight) * 2 - 1);
  });

  /* ----- Pause hors viewport ----- */
  let renderActive = true;
  const heroSection = document.querySelector('.hero');
  const heroObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => { renderActive = entry.isIntersecting; });
  }, { threshold: 0 });
  heroObserver.observe(heroSection);

  /* ----- Boucle d'animation ----- */
  const clock = new THREE.Clock();
  const startTime = performance.now();
  const REVEAL_DURATION = 1500;       // 1.5s explosion
  const MORPH_PERIOD = 8000;          // 8s pour un cycle sphère→tore→sphère

  function animate() {
    requestAnimationFrame(animate);
    if (!renderActive) return;

    const t = clock.getElapsedTime();
    uniforms.uTime.value = t;

    // Reveal manuel (sans GSAP)
    const elapsed = performance.now() - startTime;
    const revealT = Math.min(1, elapsed / REVEAL_DURATION);
    uniforms.uReveal.value = 1 - Math.pow(1 - revealT, 3); // cubic out

    // Morphing sphère ↔ tore (sin oscillation)
    const morphPhase = (elapsed % MORPH_PERIOD) / MORPH_PERIOD;
    uniforms.uMorph.value = 0.5 - 0.5 * Math.cos(morphPhase * 2 * Math.PI);

    // Lerp souris
    mouse.x += (mouse.tx - mouse.x) * 0.05;
    mouse.y += (mouse.ty - mouse.y) * 0.05;
    uniforms.uMouse.value.set(mouse.x, mouse.y);

    composer.render();
  }
  animate();
  threeRunning = true;
  diag.set('3d', true, '3D running');

  /* ----- Resize debounced ----- */
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      composer.setSize(w, h);
      bloomPass.setSize(w, h);
      uniforms.uPixel.value = renderer.getPixelRatio();
    }, 150);
  });
}

/* =========================================================
   DÉMARRAGE
   ========================================================= */
try {
  initHero3D();
} catch (e) {
  console.error('Three.js error:', e);
  diag.set('3d', false, '3D running');
  diag.error('Three.js : ' + e.message);
  if (canvas) canvas.style.display = 'none';
}

revealHeroText();
hideLoader();

// Cache le panneau de diag après 8s si tout est vert
setTimeout(() => {
  const allOk = !document.querySelector('#diag .ko') && !document.querySelector('#diag .err');
  if (allOk) diag.hide();
}, 8000);
