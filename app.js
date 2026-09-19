
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js';

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const mobile = window.matchMedia('(max-width: 760px)').matches;

const projects = [
  {
    key:'ildav',
    n:'01',
    title:'IldavBotV2',
    type:'AUTOMATION SYSTEM',
    role:'Conception & développement complet',
    color:'#62e6ff',
    summary:'Un pipeline d’automatisation qui transforme des signaux Telegram en ordres structurés, validés, exécutés et supervisés.',
    proof:'De Telegram jusqu’au dashboard : un système multi-service complet, avec exécution MT5 ou paper trading.',
    challenge:'Transformer des messages hétérogènes en ordres structurés, contrôlés et observables, tout en gardant un mode paper trading pour tester le pipeline.',
    contrib:[
      'Parsing et validation des signaux Telegram',
      'Exécution MT5 et mode paper trading',
      'API Flask sécurisée pour le contrôle local',
      'Dashboard Node.js / Express / Socket.IO',
      'Gestion d’erreurs, reconnexion et configuration'
    ],
    result:'Pipeline de bout en bout pour réceptionner, valider, exécuter et superviser les signaux dans une architecture découpée en services.',
    stack:['Python','Flask','Node.js','Express','Socket.IO','Telegram API','MT5'],
    github:'https://github.com/Davinoildevert/IldavBotV2',
    tags:['Telegram','Parser','Validation','MT5','Flask API','Dashboard']
  },
  {
    key:'cvconnect',
    n:'02',
    title:'CVconnectV2',
    type:'BACKEND PLATFORM',
    role:'Réalisation de l’intégralité du backend',
    color:'#a88cff',
    summary:'Le backend complet d’une plateforme CV : authentification, rôles, CRUD, génération PDF, notifications et messagerie.',
    proof:'I built the entire backend — architecture, sécurité d’accès et fonctionnalités métiers.',
    challenge:'Structurer un backend unique pour plusieurs domaines fonctionnels tout en gardant les responsabilités séparées et les accès contrôlés.',
    contrib:[
      'Architecture routes / controllers / models / middlewares',
      'Authentification JWT, bcrypt et rôles utilisateurs',
      'CRUD CV, filtrage et génération PDF avec Puppeteer',
      'Favoris, notifications, suggestions et messagerie',
      'Persistance JSON de la version publique'
    ],
    result:'Backend complet et modulaire couvrant le cycle d’usage principal de la plateforme et prêt à évoluer vers une base de données dédiée.',
    stack:['TypeScript','Node.js','Express','JWT','Puppeteer','REST API'],
    github:'https://github.com/Davinoildevert/CVconnectV2',
    tags:['Frontend','REST API','JWT','Controllers','PDF','Storage']
  },
  {
    key:'kiosk',
    n:'03',
    title:'Restaurant Kiosk',
    type:'JAVA INTEGRATION',
    role:'Chef de projet · développement & intégration',
    color:'#ffc875',
    summary:'Une borne Java reliée à un backend REST, une base SQLite et une documentation Swagger/OpenAPI.',
    proof:'Responsabilité projet + intégration Front ↔ Back + documentation d’API.',
    challenge:'Faire communiquer proprement un client JavaFX avec un backend REST tout en gardant une API testable et documentée par l’équipe.',
    contrib:[
      'Supervision technique et suivi du projet',
      'Participation au développement applicatif',
      'Intégration frontend JavaFX ↔ backend REST',
      'Mise en place de Swagger / OpenAPI'
    ],
    result:'V1 fonctionnelle reliant interface, logique serveur et données, avec endpoints documentés pour faciliter l’intégration et les tests.',
    stack:['Java','Javalin','JavaFX','SQLite','REST','Swagger / OpenAPI'],
    github:'https://github.com/Davinoildevert/DevP_Java',
    tags:['JavaFX','REST','Javalin','SQLite','OpenAPI']
  },
  {
    key:'boat',
    n:'04',
    title:'Battle Boat',
    type:'AUTONOMOUS SYSTEM',
    role:'Responsable software · contribution hardware',
    color:'#90d8ff',
    summary:'Un système autonome réel : GPS, Pixhawk, QGroundControl, navigation et essais terrain.',
    proof:'Projet récompensé par le Prix de l’Innovation.',
    challenge:'Obtenir une navigation suffisamment stable sur un système réel où logiciel, capteurs, contrôleur de vol et conditions terrain interagissent.',
    contrib:[
      'Responsabilité principale sur la partie software',
      'Configuration Pixhawk et QGroundControl',
      'Travail sur la navigation GPS et diagnostics',
      'Coordination avec l’intégration hardware et essais terrain'
    ],
    result:'Projet présenté à la Battle Boat / AI Toulon Regatta et récompensé par le Prix de l’Innovation.',
    stack:['Pixhawk','QGroundControl','GPS','Tests terrain','Integration HW/SW'],
    github:'',
    tags:['GPS','Pixhawk','QGroundControl','Navigation','Field Tests']
  },
  {
    key:'connect4',
    n:'05',
    title:'Puissance 4 Server',
    type:'NETWORK PROGRAMMING',
    role:'Développement complet de la partie serveur',
    color:'#ff7b86',
    summary:'Un serveur TCP en C qui garde l’état de partie cohérent entre deux clients et gère erreurs, replay et déconnexions.',
    proof:'Complete server-side implementation — la partie client a été réalisée par un autre membre.',
    challenge:'Maintenir un état de partie cohérent entre deux clients connectés et traiter proprement les erreurs de protocole ou de connexion.',
    contrib:[
      'Implémentation complète du serveur TCP',
      'Gestion de deux joueurs et identifiants uniques',
      'Validation des coups, tours, victoire et match nul',
      'Replay, erreurs, déconnexions et protocole réseau'
    ],
    result:'Serveur jouable de bout en bout. La partie client a été réalisée par un autre membre de l’équipe.',
    stack:['C','TCP Sockets','Client / Server','Network Protocol'],
    github:'https://github.com/Davinoildevert/Puissance_4',
    tags:['Client A','TCP Server','Game State','Protocol','Client B']
  },
  {
    key:'kikiri',
    n:'06',
    title:'Kikiri Game',
    type:'WEB PRODUCT',
    role:'Conception & développement complet',
    color:'#ff8fb4',
    summary:'Un produit web personnel avec plateau interactif, zones de pari, timer de 30 secondes et historique.',
    proof:'Personal project — designed and developed end-to-end.',
    challenge:'Synchroniser une interface riche avec une logique de partie temporisée tout en gardant un modèle d’état clair côté client.',
    contrib:[
      'Architecture frontend et composants de jeu',
      'Zones de paris et plateau interactif',
      'Timer de 30 secondes et transitions de manche',
      'Historique et gestion de l’état visuel'
    ],
    result:'Projet personnel complet orienté expérience utilisateur, développé en Next.js / React / TypeScript.',
    stack:['Next.js','React','TypeScript','Tailwind CSS'],
    github:'https://github.com/Davinoildevert/kikiri_game',
    tags:['Betting UI','Game State','30s Timer','Round Logic','History']
  }
];

// ---------- Intro ----------
window.enterSystem = () => {
  const intro = document.getElementById('intro');
  intro.classList.add('is-hidden');
  setTimeout(() => intro.setAttribute('aria-hidden','true'), 900);
};

// ---------- Reveals ----------
const revealObserver = new IntersectionObserver((entries)=>{
  for(const entry of entries){
    if(entry.isIntersecting){
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  }
},{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>revealObserver.observe(el));

// ---------- Project HTML ----------
const projectsWrap = document.getElementById('projectsWrap');
projectsWrap.innerHTML = projects.map((p,i)=>`
  <article class="project ${i%2 ? 'reverse':''} reveal" style="--project:${p.color}" data-project="${p.key}">
    <div class="project-visual">
      <span class="visual-label">${p.n} / ${p.type}</span>
      <canvas id="scene-${p.key}" aria-label="Illustration 3D conceptuelle du projet ${p.title}"></canvas>
      <div class="visual-caption">
        ${p.tags.map(t=>`<span>${t}</span>`).join('')}
      </div>
    </div>
    <div class="project-copy">
      <span class="project-kicker">${p.n} / ${p.type}</span>
      <h3 class="project-title">${p.title}</h3>
      <p class="project-role">MY ROLE — ${p.role}</p>
      <p class="project-summary">${p.summary}</p>
      <div class="project-proof">${p.proof}</div>
      <div class="project-actions">
        <button class="project-link" data-open-project="${p.key}">OPEN CASE STUDY ↗</button>
        ${p.github ? `<a class="project-link" href="${p.github}" target="_blank" rel="noreferrer">SOURCE CODE ↗</a>` : ''}
      </div>
      <div class="project-tech">${p.stack.slice(0,6).map(t=>`<span>${t}</span>`).join('')}</div>
    </div>
  </article>
`).join('');
document.querySelectorAll('.project.reveal').forEach(el=>revealObserver.observe(el));

// ---------- Drawer ----------
const drawer = document.getElementById('drawer');
const drawerPanel = drawer.querySelector('.drawer-panel');

function openProject(key){
  const p = projects.find(x=>x.key===key);
  if(!p) return;
  document.getElementById('drawerKicker').textContent = `SYSTEM ${p.n} / ${p.type}`;
  document.getElementById('drawerTitle').textContent = p.title;
  document.getElementById('drawerRole').textContent = `MY ROLE — ${p.role}`;
  document.getElementById('drawerChallenge').textContent = p.challenge;
  document.getElementById('drawerContribution').innerHTML = p.contrib.map(x=>`<li>${x}</li>`).join('');
  document.getElementById('drawerResult').textContent = p.result;
  document.getElementById('drawerStack').innerHTML = p.stack.map(x=>`<span>${x}</span>`).join('');
  document.getElementById('drawerActions').innerHTML = p.github ? `<a href="${p.github}" target="_blank" rel="noreferrer">VIEW GITHUB ↗</a>` : '';
  drawer.classList.add('open');
  drawer.setAttribute('aria-hidden','false');
  document.body.classList.add('modal-open');
  drawerPanel.scrollTop = 0;
}
function closeProject(){
  drawer.classList.remove('open');
  drawer.setAttribute('aria-hidden','true');
  document.body.classList.remove('modal-open');
}
window.closeProject = closeProject;
document.addEventListener('click',(e)=>{
  const trigger = e.target.closest('[data-open-project]');
  if(trigger) openProject(trigger.dataset.openProject);
  if(e.target===drawer) closeProject();
});
document.addEventListener('keydown',(e)=>{ if(e.key==='Escape') closeProject(); });

// ---------- Three.js helpers ----------
function makeRenderer(canvas, alpha=true){
  const renderer = new THREE.WebGLRenderer({canvas,antialias:!mobile,alpha,powerPreference:'high-performance'});
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, mobile ? 1.35 : 1.8));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.shadowMap.enabled = !mobile;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  return renderer;
}
function resize(renderer,camera,canvas){
  const w = canvas.clientWidth || canvas.parentElement.clientWidth;
  const h = canvas.clientHeight || canvas.parentElement.clientHeight;
  const needResize = canvas.width !== Math.floor(w * renderer.getPixelRatio()) || canvas.height !== Math.floor(h * renderer.getPixelRatio());
  if(needResize){
    renderer.setSize(w,h,false);
    camera.aspect = w/h;
    camera.updateProjectionMatrix();
  }
}
function basicLights(scene,accent=0x90d8ff){
  scene.add(new THREE.HemisphereLight(0x9fb8da,0x05070d,1.25));
  const key = new THREE.DirectionalLight(0xffffff,2.25);
  key.position.set(4,6,5);
  key.castShadow = true;
  scene.add(key);
  const rim = new THREE.PointLight(accent,5,12);
  rim.position.set(-4,3,2);
  scene.add(rim);
}
function material(color,metal=.3,rough=.45,emissive=0x000000,emissiveIntensity=0){
  return new THREE.MeshStandardMaterial({color,metalness:metal,roughness:rough,emissive,emissiveIntensity});
}
function box(w,h,d,color,opts={}){
  const m = new THREE.Mesh(new THREE.BoxGeometry(w,h,d), material(color,opts.metal??.25,opts.rough??.5,opts.emissive??0x000000,opts.ei??0));
  m.castShadow = true;m.receiveShadow=true;return m;
}
function glowSphere(r,color){
  const mat = new THREE.MeshBasicMaterial({color,transparent:true,opacity:.95});
  return new THREE.Mesh(new THREE.SphereGeometry(r,24,16),mat);
}
function lineBetween(a,b,color,opacity=.55){
  const geo = new THREE.BufferGeometry().setFromPoints([a,b]);
  return new THREE.Line(geo,new THREE.LineBasicMaterial({color,transparent:true,opacity}));
}
function cylinder(r1,r2,h,color,segments=32){
  const m = new THREE.Mesh(new THREE.CylinderGeometry(r1,r2,h,segments),material(color,.25,.45));
  m.castShadow=true;m.receiveShadow=true;return m;
}

class SceneController{
  constructor(canvas,setup,accent){
    this.canvas=canvas;
    this.scene=new THREE.Scene();
    this.renderer=makeRenderer(canvas,true);
    this.camera=new THREE.PerspectiveCamera(38,1,.1,100);
    this.camera.position.set(6,5.3,8.3);
    this.clock=new THREE.Clock();
    this.active=false;
    this.pointer={x:0,y:0};
    basicLights(this.scene,accent);
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(30,30),new THREE.MeshStandardMaterial({color:0x070b14,roughness:.9,metalness:.08,transparent:true,opacity:.6}));
    floor.rotation.x=-Math.PI/2;floor.position.y=-2.35;floor.receiveShadow=true;this.scene.add(floor);
    this.group=new THREE.Group();this.scene.add(this.group);
    this.updateFn=setup(this);
    this.onPointer=(e)=>{
      const r=canvas.getBoundingClientRect();
      this.pointer.x=((e.clientX-r.left)/r.width-.5)*2;
      this.pointer.y=((e.clientY-r.top)/r.height-.5)*-2;
    };
    canvas.addEventListener('pointermove',this.onPointer);
    this.observer=new IntersectionObserver(([entry])=>{this.active=entry.isIntersecting;if(this.active)this.render();},{threshold:.03});
    this.observer.observe(canvas);
  }
  render(){
    if(!this.active)return;
    resize(this.renderer,this.camera,this.canvas);
    const t=this.clock.getElapsedTime();
    if(this.updateFn) this.updateFn(t,this.pointer);
    if(!reducedMotion){
      this.camera.position.x += ((6 + this.pointer.x*.25)-this.camera.position.x)*.03;
      this.camera.position.y += ((5.3 + this.pointer.y*.2)-this.camera.position.y)*.03;
    }
    this.camera.lookAt(0,0,0);
    this.renderer.render(this.scene,this.camera);
    requestAnimationFrame(()=>this.render());
  }
}

function setupIldav(c){
  c.camera.position.set(7,5.6,8.8);
  const g=c.group;
  const phone=box(1.15,2.05,.18,0x16213a,{metal:.65,rough:.28});
  phone.position.set(-3.7,.45,0);phone.rotation.y=.18;g.add(phone);
  const screen=box(.95,1.68,.03,0x0b1424,{emissive:0x1f70aa,ei:.65});screen.position.set(-3.7,.48,.11);screen.rotation.y=.18;g.add(screen);
  const bubble=box(.66,.22,.05,0x229ED9,{emissive:0x229ED9,ei:.55});bubble.position.set(-3.65,.62,.18);bubble.rotation.y=.18;g.add(bubble);

  const parser=box(1.45,.78,1.0,0x1b3152,{emissive:0x62e6ff,ei:.22});parser.position.set(-1.5,.25,0);g.add(parser);
  const valid=box(1.35,.72,.95,0x17283f,{emissive:0x7bb4ff,ei:.18});valid.position.set(.35,.25,0);g.add(valid);
  const mt=box(1.05,.65,.85,0x203553,{emissive:0x90d8ff,ei:.15});mt.position.set(2.15,.75,-.7);g.add(mt);
  const paper=box(1.05,.65,.85,0x24283e,{emissive:0xa88cff,ei:.15});paper.position.set(2.15,-.3,.7);g.add(paper);
  const api=box(1.15,.7,.9,0x18343e,{emissive:0x62e6ff,ei:.18});api.position.set(3.65,.2,0);g.add(api);
  const dash=box(1.75,1.12,.13,0x10192b,{metal:.5,rough:.3});dash.position.set(5.15,.35,0);dash.rotation.y=-.35;g.add(dash);
  const dashScreen=box(1.5,.88,.025,0x0e2a3e,{emissive:0x62e6ff,ei:.5});dashScreen.position.set(5.12,.38,.1);dashScreen.rotation.y=-.35;g.add(dashScreen);

  const pts=[new THREE.Vector3(-3.1,.25,0),new THREE.Vector3(-2.2,.25,0),new THREE.Vector3(-.75,.25,0),new THREE.Vector3(1.03,.25,0),new THREE.Vector3(2.8,.2,0),new THREE.Vector3(4.35,.28,0)];
  pts.slice(0,-1).forEach((p,i)=>g.add(lineBetween(p,pts[i+1],0x62e6ff,.35)));
  const particles = Array.from({length:8},(_,i)=>{
    const s=glowSphere(.06,0x8ff4ff);g.add(s);return {mesh:s,offset:i/8};
  });
  return (t)=>{
    const cycle=6;
    particles.forEach(p=>{
      let u=((t/cycle)+p.offset)%1;
      const idx=Math.min(pts.length-2,Math.floor(u*(pts.length-1)));
      const local=(u*(pts.length-1))-idx;
      p.mesh.position.lerpVectors(pts[idx],pts[idx+1],local);
    });
    parser.rotation.y=Math.sin(t*.7)*.04;valid.rotation.y=-Math.sin(t*.8)*.035;dash.rotation.y=-.35+Math.sin(t*.45)*.03;dashScreen.rotation.y=dash.rotation.y;
  }
}

function setupCV(c){
  c.camera.position.set(6.6,5.5,8.5);
  const g=c.group;
  const core=box(1.7,2.1,1.35,0x1b1838,{emissive:0xa88cff,ei:.24});core.position.y=.25;g.add(core);
  for(let i=0;i<4;i++){
    const shelf=box(1.28,.11,1.02,0x2e2857,{emissive:0xa88cff,ei:.18});
    shelf.position.set(0,-.45+i*.45,.73);g.add(shelf);
  }
  const modules=[
    {p:[-3,1.35,0],c:0x2e244f},{p:[3,1.35,0],c:0x3a254f},{p:[-3,-1.05,0],c:0x22284a},{p:[3,-1.05,0],c:0x2a2148}
  ];
  const nodes=modules.map((m,i)=>{
    const b=box(1.45,.72,.85,m.c,{emissive:0xa88cff,ei:.16});b.position.set(...m.p);g.add(b);
    g.add(lineBetween(new THREE.Vector3(m.p[0]*.62,m.p[1]*.7,0),new THREE.Vector3(0,m.p[1]*.22,0),0xa88cff,.25));
    return b;
  });
  const requests=Array.from({length:6},(_,i)=>{const s=glowSphere(.065,0xd9cfff);g.add(s);return {mesh:s,a:i*Math.PI*2/6};});
  return (t)=>{
    requests.forEach((r,i)=>{
      const a=t*.65+r.a;
      r.mesh.position.set(Math.cos(a)*2.55,Math.sin(a*1.45)*1.25,.95*Math.sin(a*.6));
    });
    core.rotation.y=t*.13;
    nodes.forEach((n,i)=>n.rotation.y=Math.sin(t*.5+i)*.035);
  }
}

function setupKiosk(c){
  c.camera.position.set(7,5.8,8.5);
  const g=c.group;
  const stand=box(1.8,3.0,1.2,0x2f2b25,{metal:.45,rough:.35});stand.position.set(-2.7,-.1,0);stand.rotation.y=.18;g.add(stand);
  const screen=box(1.5,1.15,.06,0x1d2534,{emissive:0xffc875,ei:.28});screen.position.set(-2.58,.58,.69);screen.rotation.y=.18;g.add(screen);
  for(let r=0;r<2;r++)for(let col=0;col<2;col++){
    const tile=box(.45,.27,.02,[0xe8a96b,0x7db7ff,0x88d7b1,0xc58cff][r*2+col],{emissive:[0xe8a96b,0x7db7ff,0x88d7b1,0xc58cff][r*2+col],ei:.18});
    tile.position.set(-2.82+col*.55,.75-r*.36,.735);tile.rotation.y=.18;g.add(tile);
  }
  const api=box(1.45,1.35,1.1,0x35302a,{emissive:0xffc875,ei:.16});api.position.set(.2,.15,0);g.add(api);
  const db=cylinder(.82,.82,1.35,0x2a3448);db.position.set(2.7,.1,0);g.add(db);
  const swagger=box(1.25,.85,.08,0x172918,{emissive:0x76d66e,ei:.22});swagger.position.set(.25,1.75,-.4);swagger.rotation.x=-.08;g.add(swagger);
  g.add(lineBetween(new THREE.Vector3(-1.65,.15,0),new THREE.Vector3(-.55,.15,0),0xffc875,.4));
  g.add(lineBetween(new THREE.Vector3(.95,.15,0),new THREE.Vector3(1.85,.15,0),0xffc875,.4));
  const pulse=glowSphere(.07,0xffdf9b);g.add(pulse);
  return (t)=>{
    const u=(t*.24)%1;
    if(u<.5) pulse.position.lerpVectors(new THREE.Vector3(-1.6,.15,0),new THREE.Vector3(-.55,.15,0),u*2);
    else pulse.position.lerpVectors(new THREE.Vector3(.95,.15,0),new THREE.Vector3(1.85,.15,0),(u-.5)*2);
    db.rotation.y=t*.1;
  }
}

function setupBoat(c){
  c.camera.position.set(7.3,4.8,8.8);
  const g=c.group;
  const water = new THREE.Mesh(new THREE.PlaneGeometry(12,8,18,18),new THREE.MeshStandardMaterial({color:0x0b1e36,roughness:.28,metalness:.05,transparent:true,opacity:.78,wireframe:false}));
  water.rotation.x=-Math.PI/2;water.position.y=-1.55;water.receiveShadow=true;g.add(water);

  const hullGeom=new THREE.ConeGeometry(1.18,3.4,4);
  hullGeom.rotateZ(Math.PI/2);hullGeom.rotateY(Math.PI/4);
  const hull=new THREE.Mesh(hullGeom,material(0x1f3550,.55,.3,0x2d7ea5,.12));hull.scale.set(1,.52,.8);hull.position.set(-.3,-.6,0);hull.castShadow=true;g.add(hull);
  const deck=box(1.7,.3,1.35,0x25344a,{metal:.5,rough:.32});deck.position.set(-.25,.0,0);g.add(deck);
  const pix=box(.7,.32,.6,0x2a5670,{emissive:0x90d8ff,ei:.2});pix.position.set(-.2,.32,0);g.add(pix);
  const mast=cylinder(.05,.05,1.6,0xa9c4d8,12);mast.position.set(.15,1.1,0);g.add(mast);
  const gps=glowSphere(.13,0x90d8ff);gps.position.set(.15,1.95,0);g.add(gps);
  const wp=[new THREE.Vector3(-3,-1.48,-2),new THREE.Vector3(-1,-1.48,-.6),new THREE.Vector3(1.2,-1.48,-1.2),new THREE.Vector3(3.4,-1.48,1)];
  wp.slice(0,-1).forEach((p,i)=>g.add(lineBetween(p,wp[i+1],0x62e6ff,.5)));
  wp.forEach(p=>{const m=cylinder(.08,.18,.85,0x62e6ff,12);m.position.copy(p).add(new THREE.Vector3(0,.42,0));g.add(m)});
  const sonar=new THREE.Mesh(new THREE.RingGeometry(.7,.75,48),new THREE.MeshBasicMaterial({color:0x62e6ff,transparent:true,opacity:.45,side:THREE.DoubleSide}));
  sonar.rotation.x=-Math.PI/2;sonar.position.set(-.3,-1.42,0);g.add(sonar);
  return (t)=>{
    hull.rotation.y=Math.sin(t*.55)*.05;deck.rotation.z=Math.sin(t*.7)*.02;pix.rotation.z=deck.rotation.z;
    sonar.scale.setScalar(1+(Math.sin(t*1.8)+1)*.28);sonar.material.opacity=.18+(Math.sin(t*1.8)+1)*.13;
    gps.position.y=1.95+Math.sin(t*2)*.04;
  }
}

function setupConnect4(c){
  c.camera.position.set(7.2,5.5,8.5);
  const g=c.group;
  const clientA=box(1.35,.85,.8,0x24314c,{emissive:0x6f9dff,ei:.16});clientA.position.set(-3.2,.7,0);g.add(clientA);
  const clientB=box(1.35,.85,.8,0x4a2530,{emissive:0xff7b86,ei:.16});clientB.position.set(3.2,.7,0);g.add(clientB);
  const server=box(1.55,2.3,1.05,0x272b38,{metal:.55,rough:.32});server.position.set(0,.2,0);g.add(server);
  for(let i=0;i<4;i++){const shelf=box(1.15,.14,.78,i%2?0x29405d:0x492b35,{emissive:i%2?0x6f9dff:0xff7b86,ei:.14});shelf.position.set(0,-.55+i*.45,.59);g.add(shelf)}
  g.add(lineBetween(new THREE.Vector3(-2.5,.7,0),new THREE.Vector3(-.85,.4,0),0x6f9dff,.55));
  g.add(lineBetween(new THREE.Vector3(.85,.4,0),new THREE.Vector3(2.5,.7,0),0xff7b86,.55));
  const board=new THREE.Group();board.position.set(0,-1.3,1.1);g.add(board);
  for(let y=0;y<4;y++)for(let x=0;x<7;x++){
    const ring=new THREE.Mesh(new THREE.TorusGeometry(.14,.035,8,24),new THREE.MeshBasicMaterial({color:0x5b6a80}));
    ring.position.set((x-3)*.36,(y-1.5)*.36,0);board.add(ring);
  }
  const tokens=Array.from({length:9},(_,i)=>{const s=new THREE.Mesh(new THREE.CylinderGeometry(.11,.11,.04,24),new THREE.MeshStandardMaterial({color:i%2?0xff7b86:0x6f9dff,emissive:i%2?0x7a2632:0x274d87,emissiveIntensity:.35}));s.rotation.x=Math.PI/2;s.position.set((i%7-3)*.36,((i*3)%4-1.5)*.36,.02);board.add(s);return s;});
  const packet=glowSphere(.07,0xffffff);g.add(packet);
  return (t)=>{
    const u=(t*.27)%1;
    if(u<.5) packet.position.lerpVectors(new THREE.Vector3(-2.45,.7,0),new THREE.Vector3(-.82,.4,0),u*2);
    else packet.position.lerpVectors(new THREE.Vector3(.82,.4,0),new THREE.Vector3(2.45,.7,0),(u-.5)*2);
    tokens.forEach((s,i)=>s.rotation.z=t*.15+i*.1);
  }
}

function setupKikiri(c){
  c.camera.position.set(6.8,5.6,8.5);
  const g=c.group;
  const board=box(4.5,.25,3.0,0x2e2334,{emissive:0xff8fb4,ei:.09,metal:.35,rough:.4});board.position.set(0,-.45,0);board.rotation.y=-.18;g.add(board);
  const zones=[
    [-1.25,0,0xff8fb4],[-.45,.65,0xa88cff],[.45,.65,0x6f9dff],[1.25,0,0x62e6ff],[.45,-.65,0xffc875],[-.45,-.65,0xff7b86]
  ];
  zones.forEach(([x,z,cx],i)=>{const m=new THREE.Mesh(new THREE.CylinderGeometry(.48,.48,.08,32),new THREE.MeshStandardMaterial({color:cx,emissive:cx,emissiveIntensity:.12,roughness:.45}));m.position.set(x,-.24,z);g.add(m)});
  const timer=new THREE.Mesh(new THREE.TorusGeometry(.72,.08,12,56),new THREE.MeshStandardMaterial({color:0xff8fb4,emissive:0xff8fb4,emissiveIntensity:.4,roughness:.32}));
  timer.position.set(0,1.55,0);timer.rotation.x=Math.PI/2;g.add(timer);
  const hand=box(.06,.6,.05,0xffffff,{emissive:0xffffff,ei:.25});hand.position.set(0,1.55,.03);hand.geometry.translate(0,.28,0);g.add(hand);
  const history=box(1.6,1.8,.09,0x151c2d,{emissive:0xa88cff,ei:.1});history.position.set(3.15,.3,-.4);history.rotation.y=-.4;g.add(history);
  for(let i=0;i<4;i++){const bar=box(1.08,.12,.02,[0xff8fb4,0xa88cff,0x62e6ff,0xffc875][i],{emissive:[0xff8fb4,0xa88cff,0x62e6ff,0xffc875][i],ei:.18});bar.position.set(3.06,.7-i*.34,-.33);bar.rotation.y=-.4;g.add(bar)}
  return (t)=>{
    hand.rotation.z=-t*.55;
    timer.rotation.z=t*.08;
    board.position.y=-.45+Math.sin(t*.65)*.025;
  }
}

function setupHero(){
  const canvas=document.getElementById('heroCanvas');
  const renderer=makeRenderer(canvas,true);
  const scene=new THREE.Scene();
  const camera=new THREE.PerspectiveCamera(42,1,.1,100);
  camera.position.set(0,0,9.3);
  const root=new THREE.Group();scene.add(root);
  scene.add(new THREE.AmbientLight(0xb8c7de,.65));
  const light=new THREE.PointLight(0x90d8ff,7,22);light.position.set(2.8,3,5);scene.add(light);
  const light2=new THREE.PointLight(0xa88cff,4,18);light2.position.set(-4,-1.5,3);scene.add(light2);

  const core=new THREE.Mesh(new THREE.IcosahedronGeometry(1.05,2),new THREE.MeshStandardMaterial({color:0x101d34,metalness:.72,roughness:.18,emissive:0x2a5f86,emissiveIntensity:.22,wireframe:false}));
  root.add(core);
  const wire=new THREE.Mesh(new THREE.IcosahedronGeometry(1.34,1),new THREE.MeshBasicMaterial({color:0x90d8ff,wireframe:true,transparent:true,opacity:.2}));
  root.add(wire);
  const ring1=new THREE.Mesh(new THREE.TorusGeometry(2.15,.018,8,120),new THREE.MeshBasicMaterial({color:0x90d8ff,transparent:true,opacity:.35}));
  ring1.rotation.x=.8;ring1.rotation.y=.2;root.add(ring1);
  const ring2=new THREE.Mesh(new THREE.TorusGeometry(2.8,.012,8,140),new THREE.MeshBasicMaterial({color:0xa88cff,transparent:true,opacity:.22}));
  ring2.rotation.x=1.25;ring2.rotation.y=-.55;root.add(ring2);

  const nodes=[];
  const colors=[0x90d8ff,0x6f9dff,0xa88cff,0x62e6ff,0xffc875,0xff8fb4];
  for(let i=0;i<6;i++){
    const angle=i*Math.PI*2/6;
    const r=i%2?3.3:2.85;
    const node=box(.42,.42,.42,colors[i],{emissive:colors[i],ei:.3,metal:.45,rough:.24});
    node.position.set(Math.cos(angle)*r,Math.sin(angle)*1.35,Math.sin(angle)*.7);
    root.add(node);
    scene.add(lineBetween(new THREE.Vector3(),node.position.clone(),colors[i],.17));
    nodes.push(node);
  }
  const stars=[];
  for(let i=0;i<(mobile?60:120);i++){
    const s=glowSphere(Math.random()*.018+.006,0x9bcdf0);
    s.position.set((Math.random()-.5)*15,(Math.random()-.5)*9,(Math.random()-.5)*8);
    s.material.opacity=Math.random()*.42+.08;scene.add(s);stars.push(s);
  }
  let pointerX=0,pointerY=0;
  window.addEventListener('pointermove',e=>{pointerX=(e.clientX/innerWidth-.5)*2;pointerY=(e.clientY/innerHeight-.5)*-2},{passive:true});
  const clock=new THREE.Clock();
  function render(){
    resize(renderer,camera,canvas);
    const t=clock.getElapsedTime();
    if(!reducedMotion){
      root.rotation.y=t*.09+pointerX*.07;
      root.rotation.x=Math.sin(t*.25)*.05+pointerY*.04;
      core.rotation.y=t*.18;wire.rotation.y=-t*.12;wire.rotation.x=t*.07;
      ring1.rotation.z=t*.08;ring2.rotation.z=-t*.045;
      nodes.forEach((n,i)=>{n.rotation.x=t*.18+i;n.rotation.y=-t*.22+i*.3});
    }
    renderer.render(scene,camera);
    requestAnimationFrame(render);
  }
  render();
}

function initProjectScenes(){
  const setups={ildav:setupIldav,cvconnect:setupCV,kiosk:setupKiosk,boat:setupBoat,connect4:setupConnect4,kikiri:setupKikiri};
  const accent={ildav:0x62e6ff,cvconnect:0xa88cff,kiosk:0xffc875,boat:0x90d8ff,connect4:0xff7b86,kikiri:0xff8fb4};
  projects.forEach(p=>{
    const canvas=document.getElementById('scene-'+p.key);
    if(canvas) new SceneController(canvas,setups[p.key],accent[p.key]);
  });
}

function webglAvailable(){
  try{
    const canvas=document.createElement('canvas');
    return !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
  }catch(e){return false}
}

if(webglAvailable()){
  setupHero();
  initProjectScenes();
}else{
  document.body.classList.add('no-webgl');
  document.querySelectorAll('canvas').forEach(c=>c.style.display='none');
}

// active nav highlighting
const sections=[...document.querySelectorAll('main section[id]')];
const navLinks=[...document.querySelectorAll('.nav-links a')];
const navObs=new IntersectionObserver(entries=>{
  const visible=entries.filter(e=>e.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];
  if(!visible)return;
  navLinks.forEach(a=>a.style.color=a.getAttribute('href')==='#'+visible.target.id?'#fff':'');
},{threshold:[.25,.55]});
sections.forEach(s=>navObs.observe(s));
