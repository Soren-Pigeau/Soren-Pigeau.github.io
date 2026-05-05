# 📁 Dossier assets

Place ici les ressources statiques du portfolio (images, icônes, etc.).

## 📸 Photo de profil

Place ton fichier nommé **exactement** `photo.png` dans ce dossier.

Le portfolio le chargera automatiquement à l'adresse `assets/photo.png`.

### Formats acceptés

Le code charge `assets/photo.png` par défaut. Si tu utilises un autre format
(`.jpg`, `.webp`), modifie la ligne dans `index.html` :

```html
<img src="assets/photo.png" ... />
```

### Conseils

- **Format** : portrait ou carré (le cadre est en ratio 3:4)
- **Dimensions** : 800×1000 px ou 1000×1000 px
- **Poids** : < 500 ko (compresse via [squoosh.app](https://squoosh.app) si besoin)

Sans photo, une silhouette stylisée s'affiche automatiquement.
