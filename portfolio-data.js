export const KENNEY_BASE = "https://raw.githubusercontent.com/shorepine/kenney/3694c6879e487c108f55677be7dd2ca75b07cc3b";

export const ASSETS = {
  // Premium CC-BY assets
  macbook: "https://raw.githubusercontent.com/Itssanthoshhere/Macbook-Landing-Page/8db2f8ad05c2143b487e493734123b800aa8a52f/public/models/macbook-transformed.glb",
  desktop: "https://raw.githubusercontent.com/basedcatx/3d-portfolio/25578bef88a61ce434c6f934e2dc62d385f615c9/public/models/desktop_computer.glb",
  kioskPremium: "https://raw.githubusercontent.com/soyandresdev/the-frontend-projects/4b2a59bcfbe7a9592d939945891fc3bd530eb71d/workspace/02-landingpage_3d_restaurant/public/assets/kiosk.glb",
  boatPremium: "https://raw.githubusercontent.com/macenteno63/Dredge/06c263243f5cc970e3f37924b1b7f88ffb3dd2c0/public/boat.glb",
  dicePremium: "https://raw.githubusercontent.com/mohsen-ameli/3d-backgammon/17181a9b9fa27ec79db3a3b9992f4b8ee796e766/frontend/public/models/rust_dice.glb",

  // Lightweight CC0 support assets
  monitor: `${KENNEY_BASE}/3d/furniture/computerScreen.glb`,
  keyboard: `${KENNEY_BASE}/3d/furniture/computerKeyboard.glb`,
  desk: `${KENNEY_BASE}/3d/furniture/desk.glb`,
  roundTable: `${KENNEY_BASE}/3d/furniture/tableRound.glb`,
  computer: `${KENNEY_BASE}/3d/space-station/computer.glb`,
  computerSystem: `${KENNEY_BASE}/3d/space-station/computer-system.glb`,
  computerWide: `${KENNEY_BASE}/3d/space-station/computer-wide.glb`,
  stationScreen: `${KENNEY_BASE}/3d/space-station/computer-screen.glb`,
  factoryScreen: `${KENNEY_BASE}/3d/factory/screen-wide.glb`,
  panel: `${KENNEY_BASE}/3d/factory/screen-panel-wide.glb`,
  buoy: `${KENNEY_BASE}/3d/watercraft/buoy.glb`,
  buoyFlag: `${KENNEY_BASE}/3d/watercraft/buoy-flag.glb`,
  coin: `${KENNEY_BASE}/3d/prototype/coin.glb`
}

export const projects = [
  {
    key: "ildav",
    n: "01",
    title: "IldavBotV2",
    type: "AUTOMATION SYSTEM",
    role: "Conception & développement complet",
    color: "#67d9ff",
    summary: "Un pipeline Python qui transforme des signaux Telegram en ordres structurés, validés, exécutés et supervisés.",
    proof: "Telegram → parsing → validation → MT5 / paper trading → API Flask → dashboard.",
    challenge: "Transformer des messages hétérogènes en ordres structurés, contrôlés et observables, tout en gardant un mode paper trading pour tester le pipeline.",
    contrib: [
      "Parsing et validation des signaux Telegram",
      "Exécution MT5 et mode paper trading",
      "API Flask sécurisée pour le contrôle local",
      "Dashboard Node.js / Express / Socket.IO",
      "Gestion d’erreurs, reconnexion et configuration"
    ],
    result: "Pipeline de bout en bout pour réceptionner, valider, exécuter et superviser les signaux dans une architecture découpée en services.",
    stack: ["Python","Flask","Node.js","Express","Socket.IO","Telegram API","MT5"],
    github: "https://github.com/Davinoildevert/IldavBotV2"
  },
  {
    key: "cvconnect",
    n: "02",
    title: "CVconnectV2",
    type: "BACKEND PLATFORM",
    role: "Réalisation de l’intégralité du backend",
    color: "#b695ff",
    summary: "Le backend complet d’une plateforme CV : authentification, rôles, CRUD, génération PDF, notifications et messagerie.",
    proof: "I built the entire backend — architecture, contrôle d’accès et fonctionnalités métiers.",
    challenge: "Structurer un backend unique pour plusieurs domaines fonctionnels tout en gardant les responsabilités séparées et les accès contrôlés.",
    contrib: [
      "Architecture routes / controllers / models / middlewares",
      "Authentification JWT, bcrypt et rôles utilisateurs",
      "CRUD CV, filtrage et génération PDF avec Puppeteer",
      "Favoris, notifications, suggestions et messagerie",
      "Persistance JSON de la version publique"
    ],
    result: "Backend complet et modulaire couvrant le cycle d’usage principal de la plateforme.",
    stack: ["TypeScript","Node.js","Express","JWT","Puppeteer","REST API"],
    github: "https://github.com/Davinoildevert/CVconnectV2"
  },
  {
    key: "kiosk",
    n: "03",
    title: "Restaurant Kiosk",
    type: "JAVA INTEGRATION",
    role: "Chef de projet · développement & intégration",
    color: "#ffc975",
    summary: "Une borne Java reliée à un backend REST, une base SQLite et une documentation Swagger/OpenAPI.",
    proof: "Responsabilité projet + intégration Front ↔ Back + documentation d’API.",
    challenge: "Faire communiquer proprement un client JavaFX avec un backend REST tout en gardant une API testable et documentée.",
    contrib: [
      "Supervision technique et suivi du projet",
      "Participation au développement applicatif",
      "Intégration frontend JavaFX ↔ backend REST",
      "Mise en place de Swagger / OpenAPI"
    ],
    result: "V1 fonctionnelle reliant interface, logique serveur et données, avec endpoints documentés pour faciliter l’intégration et les tests.",
    stack: ["Java","Javalin","JavaFX","SQLite","REST","Swagger / OpenAPI"],
    github: "https://github.com/Davinoildevert/DevP_Java"
  },
  {
    key: "boat",
    n: "04",
    title: "Battle Boat",
    type: "AUTONOMOUS SYSTEM",
    role: "Responsable software · contribution hardware",
    color: "#7cdfff",
    summary: "Un système autonome réel : GPS, Pixhawk, QGroundControl, navigation et essais terrain.",
    proof: "Projet récompensé par le Prix de l’Innovation.",
    challenge: "Obtenir une navigation suffisamment stable sur un système réel où logiciel, capteurs, contrôleur et conditions terrain interagissent.",
    contrib: [
      "Responsabilité principale sur la partie software",
      "Configuration Pixhawk et QGroundControl",
      "Travail sur la navigation GPS et diagnostics",
      "Coordination avec l’intégration hardware et essais terrain"
    ],
    result: "Projet présenté à la Battle Boat / AI Toulon Regatta et récompensé par le Prix de l’Innovation.",
    stack: ["Pixhawk","QGroundControl","GPS","Tests terrain","Integration HW/SW"],
    github: ""
  },
  {
    key: "connect4",
    n: "05",
    title: "Puissance 4 Server",
    type: "NETWORK PROGRAMMING",
    role: "Développement complet de la partie serveur",
    color: "#ff7b86",
    summary: "Un serveur TCP en C qui garde l’état de partie cohérent entre deux clients et gère erreurs, replay et déconnexions.",
    proof: "Complete server-side implementation — la partie client a été réalisée par un autre membre.",
    challenge: "Maintenir un état de partie cohérent entre deux clients connectés et traiter proprement les erreurs de protocole ou de connexion.",
    contrib: [
      "Implémentation complète du serveur TCP",
      "Gestion de deux joueurs et identifiants uniques",
      "Validation des coups, tours, victoire et match nul",
      "Replay, erreurs, déconnexions et protocole réseau"
    ],
    result: "Serveur jouable de bout en bout. La partie client a été réalisée par un autre membre de l’équipe.",
    stack: ["C","TCP Sockets","Client / Server","Network Protocol"],
    github: "https://github.com/Davinoildevert/Puissance_4"
  },
  {
    key: "kikiri",
    n: "06",
    title: "Kikiri Game",
    type: "WEB PRODUCT",
    role: "Conception & développement complet",
    color: "#ff8fb9",
    summary: "Un produit web personnel avec plateau interactif, zones de pari, timer de 30 secondes et historique.",
    proof: "Personal project — designed and developed end-to-end.",
    challenge: "Synchroniser une interface riche avec une logique de partie temporisée tout en gardant un modèle d’état clair côté client.",
    contrib: [
      "Architecture frontend et composants de jeu",
      "Zones de paris et plateau interactif",
      "Timer de 30 secondes et transitions de manche",
      "Historique et gestion de l’état visuel"
    ],
    result: "Projet personnel complet orienté expérience utilisateur, développé en Next.js / React / TypeScript.",
    stack: ["Next.js","React","TypeScript","Tailwind CSS"],
    github: "https://github.com/Davinoildevert/kikiri_game"
  }
];