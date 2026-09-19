# Davino // Engineering System — Portfolio

Portfolio personnel de Davino Ildevert ANDRIANARIVONY.

## V5 — Asset-based 3D portfolio

La V5 abandonne les simples volumes procéduraux comme visuels principaux et s'appuie sur de **vrais modèles 3D GLB**, chargés dans Three.js et composés dans des scènes propres à chaque projet.

### Direction
- accueil 3D avec vrai mobilier / ordinateur / écran
- scènes projet différentes selon le sujet
- éclairage PBR et environnement Three.js
- mouvements caméra légers et animation de données
- responsive et respect de `prefers-reduced-motion`
- fallback si WebGL n'est pas disponible

### Scènes
- **IldavBotV2** — laptop, chaîne de traitement, machine, API et écran de supervision
- **CVconnectV2** — système central et modules connectés
- **Restaurant Kiosk** — borne, caisse, backend et panneau API
- **Battle Boat** — vrai modèle de bateau, bouées et trajectoire GPS
- **Puissance 4 Server** — deux postes clients, serveur central et grille de jeu
- **Kikiri** — table, machine de jeu, jetons et timer

### Stack
- HTML / CSS / JavaScript
- Three.js
- GLTFLoader
- WebGL
- GitHub Pages

## 3D assets

Les modèles 3D utilisés proviennent de la bibliothèque **Kenney**, via une copie GitHub épinglée au commit :

`3694c6879e487c108f55677be7dd2ca75b07cc3b`

Kenney publie ses game assets sous licence **Creative Commons CC0**. L'attribution n'est pas obligatoire, mais elle est conservée ici volontairement.

Assets utilisés notamment :
- Furniture
- Space Station
- Factory
- Mini Arcade
- Watercraft
- Prototype

Source officielle : https://kenney.nl/

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
