# Portfolio · Soren Pigeau

Portfolio statique avec hero 3D animé en Three.js.

## 📂 Structure

```
portfolio/
├── index.html    ← page principale (HTML)
├── style.css     ← tous les styles
├── main.js       ← logique JS (3D + animations)
└── photo.jpg     ← (optionnel) ta photo de profil
```

**Aucune installation, aucun build.** Tout fonctionne en ouvrant `index.html` dans un navigateur ou en hébergeant ces fichiers sur n'importe quel hébergeur statique (GitHub Pages, Netlify, Vercel…).

## 🚀 Déploiement GitHub Pages

1. Crée un dépôt nommé `soren-pigeau.github.io` (URL → `https://soren-pigeau.github.io`).
   Ou n'importe quel nom (URL → `https://soren-pigeau.github.io/<nom>/`).

2. Pousse les 3 fichiers à la racine :
   ```bash
   git init
   git add index.html style.css main.js
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/Soren-Pigeau/soren-pigeau.github.io.git
   git push -u origin main
   ```

3. Settings → Pages → Source : `Deploy from a branch` → branche `main` → `/ (root)` → Save.

4. Attends 1-2 minutes. Le site est en ligne.

## 📸 Ajouter ta photo

Place un fichier nommé **exactement** `photo.jpg` à côté de `index.html`.
Format conseillé : portrait 800×1000px, < 300 ko.

Si ton fichier a un autre nom (ex: `Photo.jpg`, `photo.png`), modifie la ligne dans `index.html` :
```html
<img src="photo.jpg" ... />
```

Sans photo, une silhouette stylisée s'affiche automatiquement.

## 🔧 Diagnostic

Un panneau s'affiche en haut à droite au chargement. Il indique :
- Three.js : ✓ chargée
- GSAP : ✗ (normal, plus utilisée)
- WebGL : ✓ disponible
- 3D running : ✓ animation en cours

Le panneau disparaît automatiquement après 8 secondes si tout est OK.
S'il reste affiché avec une croix rouge, l'erreur est indiquée dessous.

## 🎨 Personnalisation rapide

Toutes les couleurs sont dans les variables CSS au début de `style.css` :
```css
:root {
  --accent: #7c3aed;     /* couleur principale (violet) */
  --accent-2: #4f8ef7;   /* gradient (bleu) */
  ...
}
```

## 🛠️ Tester en local

Pour reproduire les conditions de GitHub Pages localement :
```bash
# Avec Python
python -m http.server 8000

# Ou avec npx (Node.js)
npx serve
```
Puis ouvrir http://localhost:8000.
