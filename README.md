# Portfolio · Soren Pigeau

Mon portfolio personnel. Je suis étudiant en 2ᵉ année de BUT Informatique à l'IUT Toulouse, spécialité Data, et je cherche une alternance pour ma 3ᵉ année (rentrée 2026).

**En ligne :** [soren-pigeau.github.io](https://soren-pigeau.github.io)

\---

## Aperçu

Site one-page avec un hero 3D minimaliste : un nuage de petits points violets dérivant doucement en arrière-plan sur tout le site, avec parallax 3D à la souris. Palette noir + violet électrique, typographie soignée (Fraunces en display, Manrope en texte courant).

## Architecture

```
.
├── index.html          # Structure HTML et contenu
├── style.css           # Styles, palette, animations CSS
├── main.js             # Three.js + interactions (module ES)
├── README.md
└── assets/
    └── photo.png       # Photo de profil
```

Tout est statique, **zéro dépendance npm**, **zéro build**. Les fichiers sont servis tels quels par GitHub Pages.

## Stack

|Domaine|Outil|
|-|-|
|Markup|HTML5 sémantique|
|Style|CSS3 (variables, grid, glassmorphism, transitions)|
|3D|[Three.js 0.160](https://threejs.org/) (ShaderMaterial, BufferGeometry)|
|Animations|IntersectionObserver natif|
|Polices|Fraunces · Manrope · JetBrains Mono|
|Hébergement|GitHub Pages|

Three.js est chargé en **ES module via importmap** depuis le CDN unpkg, sans aucun bundler.

## Le hero 3D

Le canvas couvre tout le viewport en `position: fixed` (z-index 0). Il rend un nuage de **1500 particules** distribuées dans une coque sphérique 3D autour de la caméra.

Chaque particule possède :

* une position 3D
* un seed aléatoire (pour la dérive et le scintillement)
* une couche de profondeur (3 niveaux pour la parallax à la souris)
* une taille variable

Le rendu utilise un **ShaderMaterial custom** :

* *Vertex shader* — dérive organique via sin/cos, parallax à la souris, rotation lente du nuage entier, taille selon la perspective
* *Fragment shader* — disque doux violet, scintillement subtil

Pas de post-processing (pas de bloom, pas de halo) : c'est volontairement minimaliste pour ne pas surcharger la page.

## Sections

1. **Hero** — Présentation rapide, badge de disponibilité, CTA
2. **À propos** — Qui je suis, ma photo, mon parcours
3. **Recherche** — Période, rythme, domaines, mobilité pour mon alternance
4. **Projets** — Sélection de projets universitaires avec liens GitHub
5. **Compétences** — Langages, outils, BDD, domaines, langues
6. **Expériences** — Timeline de mes stages et jobs
7. **Contact** — Email, téléphone, LinkedIn, GitHub

## Lancer en local

Clone le dépôt puis sers les fichiers (un simple `file://` peut bloquer les ES modules) :

```bash
git clone https://github.com/Soren-Pigeau/soren-pigeau.github.io.git
cd soren-pigeau.github.io

# Avec Python
python -m http.server 8000

# Ou avec Node.js
npx serve
```

Puis ouvre [localhost:8000](http://localhost:8000).

## Personnaliser la photo

Place ton image dans `assets/photo.png` (format conseillé : portrait 800×1000 px, < 500 ko).
Sans photo, une silhouette stylisée s'affiche automatiquement.

## Performance

* Aucun framework, aucune dépendance externe sauf Three.js
* Particules avec `BufferGeometry` (un seul draw call)
* Animations CSS-driven via classes `.is-visible` (pas de JS au scroll)
* Pause automatique du rendu 3D quand l'onglet est masqué (`document.visibilitychange`)
* Resize debounced (150 ms)
* `pixelRatio` capé à 2 pour éviter le sur-rendu sur écrans Retina

## Licence

Code disponible sous licence MIT. Le contenu (texte, photos, projets) m'est personnel.

\---

Réalisé avec [Three.js](https://threejs.org/)

