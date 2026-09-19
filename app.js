
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { ASSETS, projects } from './portfolio-data.js';

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const mobile = window.matchMedia('(max-width: 760px)').matches;
const gltfLoader = new GLTFLoader();
const assetCache = new Map();

window.enterSystem = () => {
  const intro = document.getElementById('intro');
  intro.classList.add('is-hidden');
  setTimeout(() => intro.setAttribute('aria-hidden','true'), 900);
};

const revealObserver = new IntersectionObserver((entries)=>{
  for(const entry of entries){
    if(entry.isIntersecting){
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  }
},{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>revealObserver.observe(el));

const projectsWrap = document.getElementById('projectsWrap');
projectsWrap.innerHTML = projects.map((p,i)=>`
  <article class="project ${i%2 ? 'reverse':''} reveal" style="--project:${p.color}" data-project="${p.key}">
    <div class="project-visual">
      <span class="visual-label">${p.n} / ${p.type}</span>
      <canvas id="scene-${p.key}" aria-label="Scène 3D du projet ${p.title}"></canvas>
      <div class="scene-loading" id="loading-${p.key}"><span></span> LOADING 3D ASSETS</div>
      <div class="visual-caption">
        ${p.stack.slice(0,5).map(t=>`<span>${t}</span>`).join('')}
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
      <div class="project-tech">${p.stack.map(t=>`<span>${t}</span>`).join('')}</div>
    </div>
  </article>
`).join('');
document.querySelectorAll('.project.reveal').forEach(el=>revealObserver.observe(el));

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

function makeRenderer(canvas){
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: !mobile,
    alpha: true,
    powerPreference: 'high-performance'
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, mobile ? 1.25 : 1.75));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;
  renderer.shadowMap.enabled = !mobile;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  return renderer;
}

function prepareScene(renderer, scene, accent){
  const pmrem = new THREE.PMREMGenerator(renderer);
  const env = new RoomEnvironment(renderer);
  scene.environment = pmrem.fromScene(env, .04).texture;
  env.dispose();
  pmrem.dispose();

  scene.add(new THREE.HemisphereLight(0xb9d7ff,0x0a0c12,1.45));
  const key = new THREE.DirectionalLight(0xffffff,3.2);
  key.position.set(5,8,5);
  key.castShadow = true;
  key.shadow.mapSize.set(1024,1024);
  scene.add(key);

  const rim = new THREE.PointLight(accent,8,18);
  rim.position.set(-5,3,4);
  scene.add(rim);

  const fill = new THREE.PointLight(0x586aff,3.6,16);
  fill.position.set(5,-2,-2);
  scene.add(fill);
}

function resize(renderer,camera,canvas){
  const w = canvas.clientWidth || canvas.parentElement.clientWidth;
  const h = canvas.clientHeight || canvas.parentElement.clientHeight;
  const dpr = renderer.getPixelRatio();
  if(canvas.width !== Math.floor(w*dpr) || canvas.height !== Math.floor(h*dpr)){
    renderer.setSize(w,h,false);
    camera.aspect = w/h;
    camera.updateProjectionMatrix();
  }
}

function tuneObject(root){
  root.traverse(o=>{
    if(o.isMesh){
      o.castShadow = true;
      o.receiveShadow = true;
      const mats = Array.isArray(o.material) ? o.material : [o.material];
      mats.filter(Boolean).forEach(m=>{
        if('envMapIntensity' in m) m.envMapIntensity = 1.15;
        if('roughness' in m && m.roughness < .16) m.roughness = .16;
        m.needsUpdate = true;
      });
    }
  });
  return root;
}

function normalizeObject(root,target=2){
  const box = new THREE.Box3().setFromObject(root);
  const size = new THREE.Vector3();
  const center = new THREE.Vector3();
  box.getSize(size);
  box.getCenter(center);
  const max = Math.max(size.x,size.y,size.z) || 1;
  const scale = target/max;
  root.scale.setScalar(scale);
  const box2 = new THREE.Box3().setFromObject(root);
  const center2 = new THREE.Vector3();
  box2.getCenter(center2);
  root.position.x -= center2.x;
  root.position.z -= center2.z;
  root.position.y -= box2.min.y;
  return root;
}

async function loadAsset(url,size=2){
  if(!assetCache.has(url)){
    assetCache.set(url,new Promise((resolve,reject)=>{
      gltfLoader.load(url,gltf=>{
        tuneObject(gltf.scene);
        resolve(gltf.scene);
      },undefined,reject);
    }));
  }
  const source = await assetCache.get(url);
  const clone = source.clone(true);
  tuneObject(clone);
  return normalizeObject(clone,size);
}

function pivotObject(object){
  const pivot = new THREE.Group();
  pivot.add(object);
  return pivot;
}

function groundDisc(color=0x172033,r=5){
  const mat = new THREE.MeshPhysicalMaterial({
    color,
    roughness:.45,
    metalness:.25,
    transparent:true,
    opacity:.82,
    clearcoat:.35,
    clearcoatRoughness:.3
  });
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(r,r,.14,64),mat);
  mesh.position.y=-.08;
  mesh.receiveShadow=true;
  return mesh;
}

function glow(color,opacity=.65){
  return new THREE.MeshBasicMaterial({color,transparent:true,opacity});
}

function particle(color=0xffffff,r=.05){
  return new THREE.Mesh(new THREE.SphereGeometry(r,18,12),glow(color,.95));
}

function line(a,b,color,opacity=.45){
  return new THREE.Line(
    new THREE.BufferGeometry().setFromPoints([a,b]),
    new THREE.LineBasicMaterial({color,transparent:true,opacity})
  );
}

function makeRing(radius,color,opacity=.35){
  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(radius,.018,8,96),
    new THREE.MeshBasicMaterial({color,transparent:true,opacity})
  );
  ring.rotation.x=Math.PI/2;
  return ring;
}

class AssetScene {
  constructor(canvas,accent,setup){
    this.canvas=canvas;
    this.renderer=makeRenderer(canvas);
    this.scene=new THREE.Scene();
    this.camera=new THREE.PerspectiveCamera(37,1,.1,100);
    this.camera.position.set(7.4,5.3,8.2);
    this.clock=new THREE.Clock();
    this.active=false;
    this.pointer={x:0,y:0};
    this.update=()=>{};
    prepareScene(this.renderer,this.scene,accent);
    this.root=new THREE.Group();
    this.scene.add(this.root);

    const floor = groundDisc(0x0c1220,5.3);
    this.scene.add(floor);

    canvas.addEventListener('pointermove',e=>{
      const r=canvas.getBoundingClientRect();
      this.pointer.x=((e.clientX-r.left)/r.width-.5)*2;
      this.pointer.y=((e.clientY-r.top)/r.height-.5)*-2;
    },{passive:true});

    this.observer=new IntersectionObserver(([entry])=>{
      this.active=entry.isIntersecting;
      if(this.active) this.render();
    },{threshold:.03});
    this.observer.observe(canvas);

    setup(this).then(fn=>{
      this.update=fn || (()=>{});
      const l=document.getElementById('loading-'+canvas.id.replace('scene-',''));
      if(l) l.classList.add('done');
    }).catch(err=>{
      console.warn('3D asset scene failed',canvas.id,err);
      const l=document.getElementById('loading-'+canvas.id.replace('scene-',''));
      if(l){l.textContent='3D FALLBACK MODE';l.classList.add('done');}
    });
  }
  render(){
    if(!this.active)return;
    resize(this.renderer,this.camera,this.canvas);
    const t=this.clock.getElapsedTime();
    this.update(t,this.pointer);
    if(!reducedMotion){
      const tx=7.4+this.pointer.x*.28;
      const ty=5.3+this.pointer.y*.18;
      this.camera.position.x += (tx-this.camera.position.x)*.025;
      this.camera.position.y += (ty-this.camera.position.y)*.025;
    }
    this.camera.lookAt(0,.85,0);
    this.renderer.render(this.scene,this.camera);
    requestAnimationFrame(()=>this.render());
  }
}

async function setupIldav(s){
  s.camera.position.set(7.8,5.8,8.5);
  const g=s.root;

  const conveyor = pivotObject(await loadAsset(ASSETS.conveyor,4.2));
  conveyor.position.set(-.25,0,-.35);
  conveyor.rotation.y=-.10;
  g.add(conveyor);

  const machine = pivotObject(await loadAsset(ASSETS.machine,2.15));
  machine.position.set(1.2,.08,-1.05);
  machine.rotation.y=-.48;
  g.add(machine);

  const laptop = pivotObject(await loadAsset(ASSETS.laptop,1.8));
  laptop.position.set(-2.8,.44,.25);
  laptop.rotation.y=.48;
  g.add(laptop);

  const screen = pivotObject(await loadAsset(ASSETS.factoryScreen,1.55));
  screen.position.set(2.65,.7,.55);
  screen.rotation.y=-.42;
  g.add(screen);

  const apiNode = pivotObject(await loadAsset(ASSETS.computerSystem,1.55));
  apiNode.position.set(2.5,.15,-1.75);
  apiNode.rotation.y=-.25;
  g.add(apiNode);

  const flowPath=[
    new THREE.Vector3(-2.25,.95,.05),
    new THREE.Vector3(-1.3,.75,-.15),
    new THREE.Vector3(-.3,.7,-.25),
    new THREE.Vector3(.75,.75,-.45),
    new THREE.Vector3(1.6,.8,-.3),
    new THREE.Vector3(2.35,.95,.25)
  ];
  flowPath.slice(0,-1).forEach((p,i)=>g.add(line(p,flowPath[i+1],0x67d9ff,.22)));
  const packets=Array.from({length:9},(_,i)=>{
    const p=particle(i%3===0?0xb695ff:0x67d9ff,.055);
    g.add(p);
    return {mesh:p,offset:i/9};
  });

  const ring1=makeRing(2.25,0x67d9ff,.19);ring1.position.y=.15;g.add(ring1);
  const ring2=makeRing(3.3,0xb695ff,.09);ring2.position.y=.12;g.add(ring2);

  return t=>{
    packets.forEach(p=>{
      const u=((t*.15)+p.offset)%1;
      const seg=Math.min(flowPath.length-2,Math.floor(u*(flowPath.length-1)));
      const local=u*(flowPath.length-1)-seg;
      p.mesh.position.lerpVectors(flowPath[seg],flowPath[seg+1],local);
    });
    laptop.rotation.y=.48+Math.sin(t*.5)*.025;
    screen.rotation.y=-.42+Math.sin(t*.45)*.025;
    ring1.rotation.z=t*.12;ring2.rotation.z=-t*.07;
  };
}

async function setupCV(s){
  const g=s.root;
  const central=pivotObject(await loadAsset(ASSETS.computerSystem,2.5));
  central.position.set(0,.08,0);
  g.add(central);

  const positions=[[-2.8,.15,-1.35],[2.8,.15,-1.35],[-2.7,.15,1.5],[2.7,.15,1.5]];
  const urls=[ASSETS.computer,ASSETS.computerWide,ASSETS.stationScreen,ASSETS.computer];
  const nodes=[];
  for(let i=0;i<4;i++){
    const o=pivotObject(await loadAsset(urls[i],1.55));
    o.position.set(...positions[i]);
    o.rotation.y=i<2?(i?-.65:.65):(i?-.25:.25);
    g.add(o);nodes.push(o);
    g.add(line(new THREE.Vector3(positions[i][0]*.62,.62,positions[i][2]*.62),new THREE.Vector3(0,.78,0),0xb695ff,.20));
  }
  const requests=Array.from({length:8},(_,i)=>{
    const p=particle(i%2?0xc9baff:0x7edfff,.055);g.add(p);return {p,offset:i/8};
  });
  const paths=positions.map(pos=>[
    new THREE.Vector3(pos[0]*.82,.72,pos[2]*.82),
    new THREE.Vector3(pos[0]*.4,.8,pos[2]*.4),
    new THREE.Vector3(0,.9,0)
  ]);

  const halo=makeRing(2.6,0xb695ff,.16);halo.position.y=.12;g.add(halo);

  return t=>{
    requests.forEach((r,i)=>{
      const path=paths[i%paths.length];
      const u=((t*.2)+r.offset)%1;
      if(u<.5) r.p.position.lerpVectors(path[0],path[1],u*2);
      else r.p.position.lerpVectors(path[1],path[2],(u-.5)*2);
    });
    central.rotation.y=Math.sin(t*.4)*.05;
    halo.rotation.z=t*.1;
  };
}

async function setupKiosk(s){
  const g=s.root;
  const kiosk=pivotObject(await loadAsset(ASSETS.ticketMachine,2.9));
  kiosk.position.set(-1.45,.04,.15);
  kiosk.rotation.y=.25;
  g.add(kiosk);

  const register=pivotObject(await loadAsset(ASSETS.cashRegister,1.5));
  register.position.set(1.35,.02,.95);
  register.rotation.y=-.38;
  g.add(register);

  const backend=pivotObject(await loadAsset(ASSETS.computerSystem,1.6));
  backend.position.set(2.15,.05,-1.25);
  backend.rotation.y=-.48;
  g.add(backend);

  const panel=pivotObject(await loadAsset(ASSETS.panel,1.55));
  panel.position.set(.45,1.35,-1.35);
  panel.rotation.y=-.15;
  g.add(panel);

  const pts=[new THREE.Vector3(-.5,.65,.1),new THREE.Vector3(.55,.72,.15),new THREE.Vector3(1.55,.65,-.45)];
  pts.slice(0,-1).forEach((p,i)=>g.add(line(p,pts[i+1],0xffc975,.28)));
  const req=particle(0xffd88e,.065);g.add(req);

  return t=>{
    const u=(t*.25)%1;
    if(u<.5) req.position.lerpVectors(pts[0],pts[1],u*2);
    else req.position.lerpVectors(pts[1],pts[2],(u-.5)*2);
    kiosk.rotation.y=.25+Math.sin(t*.45)*.02;
    panel.rotation.y=-.15+Math.sin(t*.35)*.025;
  };
}

async function setupBoat(s){
  s.camera.position.set(7.6,4.7,8.8);
  const g=s.root;

  const water=new THREE.Mesh(
    new THREE.CircleGeometry(5.1,96),
    new THREE.MeshPhysicalMaterial({
      color:0x0a2946,roughness:.18,metalness:.05,transparent:true,opacity:.76,
      clearcoat:.35,clearcoatRoughness:.18
    })
  );
  water.rotation.x=-Math.PI/2;water.position.y=.02;water.receiveShadow=true;g.add(water);

  const boat=pivotObject(await loadAsset(ASSETS.boat,3.25));
  boat.position.set(-.4,.1,0);
  boat.rotation.y=-.2;
  g.add(boat);

  const waypoints=[];
  const wpPos=[[-3.1,.08,-2],[-1.8,.08,-.9],[.7,.08,-1.7],[2.8,.08,.1],[1.45,.08,2.1]];
  for(let i=0;i<wpPos.length;i++){
    const buoy=pivotObject(await loadAsset(i===wpPos.length-1?ASSETS.buoyFlag:ASSETS.buoy,.58));
    buoy.position.set(...wpPos[i]);g.add(buoy);waypoints.push(buoy);
    if(i<wpPos.length-1) g.add(line(new THREE.Vector3(...wpPos[i]).add(new THREE.Vector3(0,.26,0)),new THREE.Vector3(...wpPos[i+1]).add(new THREE.Vector3(0,.26,0)),0x67d9ff,.33));
  }

  const gps=makeRing(1.2,0x67d9ff,.4);gps.position.set(-.4,.12,0);g.add(gps);
  const gps2=makeRing(1.9,0x67d9ff,.16);gps2.position.set(-.4,.10,0);g.add(gps2);

  return t=>{
    boat.position.y=.1+Math.sin(t*.9)*.045;
    boat.rotation.z=Math.sin(t*.65)*.02;
    boat.rotation.y=-.2+Math.sin(t*.35)*.018;
    gps.scale.setScalar(1+(Math.sin(t*1.7)+1)*.16);
    gps2.scale.setScalar(1+(Math.sin(t*1.2)+1)*.12);
    waypoints.forEach((b,i)=>b.position.y=.08+Math.sin(t*.8+i)*.035);
  };
}

async function setupConnect4(s){
  const g=s.root;
  const left=pivotObject(await loadAsset(ASSETS.computer,1.7));
  left.position.set(-3,.05,.15);left.rotation.y=.48;g.add(left);

  const right=pivotObject(await loadAsset(ASSETS.computerWide,1.7));
  right.position.set(3,.05,.15);right.rotation.y=-.48;g.add(right);

  const server=pivotObject(await loadAsset(ASSETS.computerSystem,2.1));
  server.position.set(0,.05,-1.65);g.add(server);

  const boardGroup=new THREE.Group();boardGroup.position.set(0,.45,1.15);g.add(boardGroup);
  const frame=new THREE.Mesh(new THREE.BoxGeometry(3.2,2.45,.22),new THREE.MeshStandardMaterial({color:0x202b45,metalness:.45,roughness:.35}));
  frame.castShadow=true;boardGroup.add(frame);
  for(let y=0;y<5;y++)for(let x=0;x<7;x++){
    const hole=new THREE.Mesh(new THREE.CylinderGeometry(.13,.13,.28,24),new THREE.MeshStandardMaterial({color:0x0b1020,roughness:.55}));
    hole.rotation.x=Math.PI/2;hole.position.set((x-3)*.39,(y-2)*.39,.13);boardGroup.add(hole);
  }
  for(let i=0;i<12;i++){
    const token=new THREE.Mesh(new THREE.CylinderGeometry(.115,.115,.04,28),new THREE.MeshStandardMaterial({
      color:i%2?0xff7b86:0x6f9dff,emissive:i%2?0x5f1c28:0x1c3b70,emissiveIntensity:.32,roughness:.28
    }));
    token.rotation.x=Math.PI/2;
    token.position.set(((i*3)%7-3)*.39,(((i*5)%5)-2)*.39,.28);
    boardGroup.add(token);
  }

  g.add(line(new THREE.Vector3(-2.2,.7,.15),new THREE.Vector3(-.7,.9,-.55),0x6f9dff,.34));
  g.add(line(new THREE.Vector3(2.2,.7,.15),new THREE.Vector3(.7,.9,-.55),0xff7b86,.34));
  const packet=particle(0xffffff,.065);g.add(packet);

  return t=>{
    const u=(t*.22)%1;
    if(u<.5) packet.position.lerpVectors(new THREE.Vector3(-2.2,.7,.15),new THREE.Vector3(-.65,.9,-.55),u*2);
    else packet.position.lerpVectors(new THREE.Vector3(.65,.9,-.55),new THREE.Vector3(2.2,.7,.15),(u-.5)*2);
    boardGroup.rotation.y=Math.sin(t*.4)*.035;
  };
}

async function setupKikiri(s){
  const g=s.root;
  const table=pivotObject(await loadAsset(ASSETS.roundTable,3.5));
  table.position.set(0,.02,0);g.add(table);

  const gameMachine=pivotObject(await loadAsset(ASSETS.gamblingMachine,2.3));
  gameMachine.position.set(2.75,.06,-.65);gameMachine.rotation.y=-.55;g.add(gameMachine);

  const coins=[];
  for(let i=0;i<10;i++){
    const coin=pivotObject(await loadAsset(ASSETS.coin,.38));
    const a=i*Math.PI*2/10;
    coin.position.set(Math.cos(a)*1.45,.65,Math.sin(a)*1.45);
    coin.rotation.y=a;g.add(coin);coins.push({coin,a});
  }

  const timer=makeRing(.9,0xff8fb9,.55);timer.position.set(0,1.75,0);timer.rotation.x=Math.PI/2;g.add(timer);
  const hand=new THREE.Mesh(new THREE.BoxGeometry(.045,.58,.035),new THREE.MeshBasicMaterial({color:0xffffff}));
  hand.geometry.translate(0,.27,0);hand.position.set(0,1.75,.03);g.add(hand);

  return t=>{
    hand.rotation.z=-t*.7;
    timer.rotation.z=t*.1;
    coins.forEach((c,i)=>{
      c.coin.position.y=.65+Math.sin(t*1.2+i*.5)*.045;
      c.coin.rotation.y=c.a+t*.22;
    });
  };
}

async function setupHero(){
  const canvas=document.getElementById('heroCanvas');
  const renderer=makeRenderer(canvas);
  const scene=new THREE.Scene();
  const camera=new THREE.PerspectiveCamera(38,1,.1,100);
  camera.position.set(7.5,5.5,9.6);
  prepareScene(renderer,scene,0x67d9ff);

  const root=new THREE.Group();
  root.position.set(1.6,-.35,-.25);
  scene.add(root);

  const platform=groundDisc(0x111827,4.9);
  root.add(platform);

  const desk=pivotObject(await loadAsset(ASSETS.desk,4.8));
  desk.position.set(0,.08,0);desk.rotation.y=-.08;root.add(desk);

  const laptop=pivotObject(await loadAsset(ASSETS.laptop,1.9));
  laptop.position.set(-1.0,1.15,.25);laptop.rotation.y=.28;root.add(laptop);

  const monitor=pivotObject(await loadAsset(ASSETS.monitor,2.1));
  monitor.position.set(1.05,1.15,-.2);monitor.rotation.y=-.18;root.add(monitor);

  const keyboard=pivotObject(await loadAsset(ASSETS.keyboard,1.15));
  keyboard.position.set(.15,.95,1.0);keyboard.rotation.y=.05;root.add(keyboard);

  const system=pivotObject(await loadAsset(ASSETS.computerSystem,1.7));
  system.position.set(2.55,.1,-1.15);system.rotation.y=-.38;root.add(system);

  const ringA=makeRing(2.15,0x67d9ff,.22);ringA.position.set(.25,.12,0);root.add(ringA);
  const ringB=makeRing(3.05,0xb695ff,.12);ringB.position.set(.25,.10,0);root.add(ringB);

  const orbit=[];
  const colors=[0x67d9ff,0xb695ff,0xffc975,0xff8fb9];
  for(let i=0;i<4;i++){
    const p=particle(colors[i],.065);root.add(p);orbit.push(p);
  }

  let px=0,py=0;
  window.addEventListener('pointermove',e=>{
    px=(e.clientX/innerWidth-.5)*2;
    py=(e.clientY/innerHeight-.5)*-2;
  },{passive:true});

  const clock=new THREE.Clock();
  function render(){
    resize(renderer,camera,canvas);
    const t=clock.getElapsedTime();
    if(!reducedMotion){
      root.rotation.y += ((px*.045)-root.rotation.y)*.02;
      root.rotation.x += ((py*.02)-root.rotation.x)*.02;
      laptop.rotation.y=.28+Math.sin(t*.42)*.015;
      monitor.rotation.y=-.18+Math.sin(t*.37)*.015;
      ringA.rotation.z=t*.085;ringB.rotation.z=-t*.052;
      orbit.forEach((p,i)=>{
        const a=t*.35+i*Math.PI/2;
        p.position.set(.25+Math.cos(a)*2.6,.55+Math.sin(a*1.8)*.32,Math.sin(a)*1.4);
      });
    }
    camera.lookAt(1.2,1.0,0);
    renderer.render(scene,camera);
    requestAnimationFrame(render);
  }
  render();
  const heroLoading=document.getElementById('heroLoading');
  if(heroLoading) heroLoading.classList.add('done');
}

function webglAvailable(){
  try{
    const c=document.createElement('canvas');
    return !!(window.WebGLRenderingContext && (c.getContext('webgl') || c.getContext('experimental-webgl')));
  }catch(e){return false}
}

async function boot3D(){
  if(!webglAvailable()){
    document.body.classList.add('no-webgl');
    return;
  }
  await setupHero().catch(err=>console.warn('Hero 3D failed',err));
  const setups={
    ildav:setupIldav,
    cvconnect:setupCV,
    kiosk:setupKiosk,
    boat:setupBoat,
    connect4:setupConnect4,
    kikiri:setupKikiri
  };
  const accents={
    ildav:0x67d9ff,
    cvconnect:0xb695ff,
    kiosk:0xffc975,
    boat:0x7cdfff,
    connect4:0xff7b86,
    kikiri:0xff8fb9
  };
  projects.forEach(p=>{
    const canvas=document.getElementById('scene-'+p.key);
    if(canvas) new AssetScene(canvas,accents[p.key],setups[p.key]);
  });
}
boot3D();

// nav state
const sections=[...document.querySelectorAll('main section[id]')];
const navLinks=[...document.querySelectorAll('.nav-links a')];
const navObs=new IntersectionObserver(entries=>{
  const visible=entries.filter(e=>e.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];
  if(!visible)return;
  navLinks.forEach(a=>a.style.color=a.getAttribute('href')==='#'+visible.target.id?'#fff':'');
},{threshold:[.25,.55]});
sections.forEach(s=>navObs.observe(s));
