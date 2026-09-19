# Davino Ildevert — Software Engineering Portfolio

Portfolio personnel de **Davino Ildevert ANDRIANARIVONY**, élève ingénieur en 4e année à l’ISEN Méditerranée.

## Direction V5

La V5 a été reconstruite comme un **showroom éditorial 3D**, et non comme un CV animé :

- interface claire et recruiter-friendly
- hero avec un vrai modèle 3D de MacBook
- une scène spécifique par projet
- vrais modèles GLB pour les objets principaux
- éclairage PBR / environnement Three.js
- animations de données et mouvements caméra discrets
- chargement 3D **à la demande** lorsque les projets approchent du viewport
- responsive, fallback WebGL et respect de `prefers-reduced-motion`

## Représentation des projets

Les visuels 3D sont des **illustrations conceptuelles** : ils servent à rendre l’architecture ou le contexte du projet immédiatement compréhensible, sans prétendre être des captures réelles.

- **IldavBotV2** — MacBook + flux Telegram / validation / exécution / API
- **CVconnectV2** — poste central + modules Auth / CV / PDF / Social
- **Restaurant Kiosk** — vrai modèle de kiosk + backend REST / SQLite / OpenAPI
- **Battle Boat** — vrai modèle de bateau + trajectoire GPS / navigation
- **Puissance 4 Server** — deux ordinateurs + serveur + grille réseau
- **Kikiri** — vrais dés 3D + table de jeu + timer / historique

## Stack du portfolio

- HTML / CSS / JavaScript
- Three.js
- GLTFLoader + Draco + Meshopt
- WebGL
- GitHub Pages

## Assets et licences

Les principaux modèles proviennent de Sketchfab sous **CC BY 4.0**, avec attribution complète dans [CREDITS.md](./CREDITS.md).

Des éléments secondaires Kenney sous **CC0** sont également utilisés.

## GitHub Pages

Dans GitHub :

1. **Settings**
2. **Pages**
3. **Build and deployment**
4. Source : **Deploy from a branch**
5. Branch : **main**
6. Folder : **/ (root)**
7. **Save**

URL attendue : `https://davinoildevert.github.io/portfolio/`
