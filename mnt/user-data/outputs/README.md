# Portfolio · Soren Pigeau

Portfolio statique avec un hero 3D minimaliste : nuage de petits points violets dérivant doucement en arrière-plan, avec parallax 3D à la souris.

## 📂 Structure

```
portfolio/
├── index.html
├── style.css
├── main.js
└── assets/
    └── photo.png   ← (à ajouter) ta photo de profil
```

**Aucune installation, aucun build.** Ouvre `index.html` dans un navigateur ou pousse les fichiers sur GitHub Pages.

## 🚀 Déploiement GitHub Pages

1. Crée un dépôt nommé `soren-pigeau.github.io` (URL → `https://soren-pigeau.github.io`).

2. Pousse les fichiers à la racine :
   ```bash
   git init
   git add .
   git commit -m "Portfolio v3"
   git branch -M main
   git remote add origin https://github.com/Soren-Pigeau/soren-pigeau.github.io.git
   git push -u origin main
   ```

3. Settings → Pages → Source : `Deploy from a branch` → branche `main` → `/ (root)` → Save.

4. Attends 1-2 minutes. Le site est en ligne.

⚠️ Après chaque push, fais un **Ctrl + Shift + R** sur ta page pour vider le cache du navigateur, sinon tu verras l'ancienne version.

## 📸 Ajouter ta photo

Place ton fichier nommé **exactement** `photo.png` dans le dossier `assets/`.

Format conseillé : portrait 800×1000 px, < 500 ko.

Sans photo, la silhouette stylisée s'affiche automatiquement.

## 🎨 Personnalisation rapide

Toutes les couleurs sont dans les variables CSS au début de `style.css` :

```css
:root {
  --accent: #7c3aed;     /* violet principal */
  --accent-2: #4f8ef7;   /* gradient (bleu) */
}
```

Pour changer la couleur des particules, ouvre `main.js` et cherche :
```js
uColor:  { value: new THREE.Color('#7c3aed') },
uColor2: { value: new THREE.Color('#a78bfa') },
```

## 🛠️ Tester en local

```bash
# Avec Python
python -m http.server 8000

# Ou avec npx (Node.js)
npx serve
```
Puis ouvrir http://localhost:8000.
