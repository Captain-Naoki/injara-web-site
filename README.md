# INJARA — site vitrine

Site vitrine statique d'INJARA, le logiciel de recrutement intelligent pour les PME africaines.
Disponible en français, anglais, allemand, espagnol et néerlandais.

## Lancer en local

```bash
python -m http.server 5173
```

Puis ouvrir http://localhost:5173. Une langue se force avec `?lang=en`, `de`, `es` ou `nl`.

## Structure

- `index.html` : page d'accueil (le français est le texte par défaut)
- `mentions-legales.html`, `politique-de-confidentialite.html` : pages légales
- `css/styles.css` : styles et animations
- `js/app.js` : langues, animations, formulaire
- `js/i18n/*.js` : traductions (une clé par texte)
- `assets/img` : logos et motifs ndop ; `assets/ill` : illustrations (unDraw, recolorées)

## Réglages utiles

- Transparence des filigranes sur fond blanc : variables `--wm-soleil` et `--wm-motifs` dans `css/styles.css`.
- Formulaire de démo / devis : envoyé à team@injara.site via FormSubmit (`CONFIG` en haut de `js/app.js`).

Les illustrations proviennent d'[unDraw](https://undraw.co/license) (licence libre, sans attribution requise).
