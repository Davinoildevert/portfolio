
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js';
import { ASSETS, projects } from './portfolio-data.js';

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const mobile = window.matchMedia('(max-width: 780px)').matches;

const gltfLoader = new GLTFLoader();
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.7/');
gltfLoader.setDRACOLoader(dracoLoader);
gltfLoader.setMeshoptDecoder(MeshoptDecoder);
const assetCache = new Map();

// ---------- DOM / content ----------
const revealObserver = new IntersectionObserver((entries)=>{
  for (const entry of entries){
    if (entry.isIntersecting){
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
      <canvas id="scene-${p.key}" aria-label="Illustration 3D du projet ${p.title}"></canvas>
      <div class="scene-loading" id="loading-${p.key}"><span></span>CHARGEMENT DE LA SCÈNE 3D</div>
      <div class="visual-caption">
        ${p.stack.slice(0,5).map(t=>`<span>${t}</span>`).join('')}
      </div>
    </div>
    <div class="project-copy">
      <span class="project-kicker">${p.n} / ${p.type}</span>
      <h3 class="project-title">${p.title}</h3>
      <p class="project-role">MON RÔLE — ${p.role}</p>
      <p class="project-summary">${p.summary}</p>
      <div class="project-proof">${p.proof}</div>
      <div class="project-actions">
        <button class="project-link" data-open-project="${p.key}">VOIR L'ÉTUDE DE CAS ↗</button>
        ${p.github ? `<a class="project-link" href="${p.github}" target="_blank" rel="noreferrer">CODE SOURCE ↗</a>` : ''}
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
  document.getElementById('drawerKicker').textContent = `PROJET ${p.n} / ${p.type}`;
  document.getElementById('drawerTitle').textContent = p.title;
  document.getElementById('drawerRole').textContent = `MON RÔLE — ${p.role}`;
  document.getElementById('drawerChallenge').textContent = p.challenge;
  document.getElementById('drawerContribution').innerHTML = p.contrib.map(x=>`<li>${x}</li>`).join('');
  document.getElementById('drawerResult').textContent = p.result;
  document.getElementById('drawerStack').innerHTML = p.stack.map(x=>`<span>${x}</span>`).join('');
  document.getElementById('drawerActions').innerHTML = p.github ? `<a href="${p.github}" target="_blank" rel="noreferrer">VOIR SUR GITHUB ↗</a>` : '';
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

// ---------- renderer / asset helpers ----------
function makeRenderer(canvas){
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: !mobile,
    alpha: true,
    powerPreference: 'high-performance'
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, mobile ? 1.2 : 1.7));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.shadowMap.enabled = !mobile;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  return renderer;
}

function configureEnvironment(renderer,scene,accent=0x67d9ff,dark=true){
  const pmrem = new THREE.PMREMGenerator(renderer);
  const room = new RoomEnvironment(renderer);
  scene.environment = pmrem.fromScene(room,.035).texture;
  room.dispose();
  pmrem.dispose();

  scene.add(new THREE.HemisphereLight(dark?0xb8d7ff:0xffffff,dark?0x080a10:0xbfc7d2,dark?1.25:1.8));

  const key = new THREE.DirectionalLight(0xffffff,dark?3.3:4.4);
  key.position.set(5,8,6);
  key.castShadow=true;
  key.shadow.mapSize.set(1024,1024);
  scene.add(key);

  const rim = new THREE.PointLight(accent,dark?8:5,18);
  rim.position.set(-4,3,4);
  scene.add(rim);

  const fill = new THREE.PointLight(0x7b8cff,dark?3.5:2.4,18);
  fill.position.set(4,-1,-3);
  scene.add(fill);
}

function resize(renderer,camera,canvas){
  const w=canvas.clientWidth || canvas.parentElement.clientWidth || 1;
  const h=canvas.clientHeight || canvas.parentElement.clientHeight || 1;
  const dpr=renderer.getPixelRatio();
  if(canvas.width!==Math.floor(w*dpr) || canvas.height!==Math.floor(h*dpr)){
    renderer.setSize(w,h,false);
    camera.aspect=w/h;
    camera.updateProjectionMatrix();
  }
}

function tuneModel(root){
  root.traverse(o=>{
    if(o.isMesh){
      o.castShadow=true;
      o.receiveShadow=true;
      const mats=Array.isArray(o.material)?o.material:[o.material];
      mats.filter(Boolean).forEach(m=>{
        if('envMapIntensity' in m) m.envMapIntensity=1.2;
        if('roughness' in m) m.roughness=Math.max(.17,m.roughness ?? .4);
        if('metalness' in m) m.metalness=Math.min(.92,m.metalness ?? .2);
        m.needsUpdate=true;
      });
    }
  });
  return root;
}

function normalize(root,target=2.4){
  const box=new THREE.Box3().setFromObject(root);
  const size=new THREE.Vector3(); box.getSize(size);
  const max=Math.max(size.x,size.y,size.z)||1;
  root.scale.setScalar(target/max);
  const box2=new THREE.Box3().setFromObject(root);
  const center=new THREE.Vector3(); box2.getCenter(center);
  root.position.x-=center.x;
  root.position.z-=center.z;
  root.position.y-=box2.min.y;
  return root;
}

async function loadAsset(url,target=2.4){
  if(!assetCache.has(url)){
    assetCache.set(url,new Promise((resolve,reject)=>{
      gltfLoader.load(url,gltf=>resolve(tuneModel(gltf.scene)),undefined,reject);
    }));
  }
  const source=await assetCache.get(url);
  const clone=source.clone(true);
  tuneModel(clone);
  return normalize(clone,target);
}

function pivot(model){
  const p=new THREE.Group();
  p.add(model);
  return p;
}

function material(color,metal=.25,rough=.42,opts={}){
  return new THREE.MeshPhysicalMaterial({
    color,
    metalness:metal,
    roughness:rough,
    clearcoat:opts.clearcoat ?? .18,
    clearcoatRoughness:opts.clearcoatRoughness ?? .25,
    transparent:opts.transparent ?? false,
    opacity:opts.opacity ?? 1,
    emissive:opts.emissive ?? 0x000000,
    emissiveIntensity:opts.emissiveIntensity ?? 0
  });
}

function platform(radius=4.6,dark=true){
  const base=new THREE.Mesh(
    new THREE.CylinderGeometry(radius,radius,.13,96),
    material(dark?0x101520:0xe5e8ed,.18,dark?.44:.62,{clearcoat:.22})
  );
  base.position.y=-.07;
  base.receiveShadow=true;
  return base;
}

function line(a,b,color,opacity=.36){
  return new THREE.Line(
    new THREE.BufferGeometry().setFromPoints([a,b]),
    new THREE.LineBasicMaterial({color,transparent:true,opacity})
  );
}

function particle(color=0xffffff,r=.055){
  return new THREE.Mesh(
    new THREE.SphereGeometry(r,18,12),
    new THREE.MeshBasicMaterial({color,transparent:true,opacity:.95})
  );
}

function ring(radius,color,opacity=.3){
  const m=new THREE.Mesh(
    new THREE.TorusGeometry(radius,.018,8,120),
    new THREE.MeshBasicMaterial({color,transparent:true,opacity})
  );
  m.rotation.x=Math.PI/2;
  return m;
}

function makeCanvasTexture(title,lines=[],accent='#67d9ff',dark=true){
  const c=document.createElement('canvas');
  c.width=1024;c.height=512;
  const x=c.getContext('2d');
  x.clearRect(0,0,c.width,c.height);
  x.fillStyle=dark?'rgba(8,12,20,.96)':'rgba(246,244,238,.96)';
  x.fillRect(0,0,c.width,c.height);
  x.strokeStyle=accent;
  x.lineWidth=5;
  x.strokeRect(18,18,c.width-36,c.height-36);
  x.fillStyle=accent;
  x.font='700 34px system-ui';
  x.fillText(title.toUpperCase(),52,76);
  x.fillStyle=dark?'#eef5ff':'#17191f';
  x.font='700 50px system-ui';
  let yy=160;
  lines.forEach((v,i)=>{
    x.globalAlpha=i===0?1:.72;
    x.fillText(v,52,yy);
    yy+=72;
  });
  x.globalAlpha=1;
  const tex=new THREE.CanvasTexture(c);
  tex.colorSpace=THREE.SRGBColorSpace;
  tex.anisotropy=4;
  return tex;
}

function panel(title,lines,accent,w=2.25,h=1.12,dark=true){
  const tex=makeCanvasTexture(title,lines,accent,dark);
  const m=new THREE.Mesh(
    new THREE.PlaneGeometry(w,h),
    new THREE.MeshBasicMaterial({map:tex,transparent:true,side:THREE.DoubleSide})
  );
  return m;
}

function applyMacbookScreen(root){
  const tex=makeCanvasTexture('DAVINO',['SOFTWARE ENGINEERING','PYTHON  •  API  •  AUTOMATION'],'#3157ff',false);
  let found=false;
  root.traverse(o=>{
    if(o.isMesh && (o.name==='Object_123' || /screen/i.test(o.name))){
      o.material=new THREE.MeshBasicMaterial({map:tex});
      found=true;
    }
  });
  return found;
}

// ---------- lazy scene class ----------
class LazyScene{
  constructor(canvas,accent,setup,{dark=true,camera=[7.4,5.2,8.4],look=[0,.85,0]}={}){
    this.canvas=canvas;
    this.accent=accent;
    this.setup=setup;
    this.dark=dark;
    this.cameraPos=camera;
    this.look=new THREE.Vector3(...look);
    this.started=false;
    this.ready=false;
    this.active=false;
    this.pointer={x:0,y:0};
    this.update=()=>{};
    this.clock=new THREE.Clock();

    canvas.addEventListener('pointermove',e=>{
      const r=canvas.getBoundingClientRect();
      this.pointer.x=((e.clientX-r.left)/r.width-.5)*2;
      this.pointer.y=((e.clientY-r.top)/r.height-.5)*-2;
    },{passive:true});

    this.observer=new IntersectionObserver(([entry])=>{
      this.active=entry.isIntersecting;
      if(this.active){
        if(!this.started) this.start();
        else if(this.ready) this.render();
      }
    },{rootMargin:'220px 0px',threshold:.01});
    this.observer.observe(canvas);
  }

  async start(){
    this.started=true;
    this.renderer=makeRenderer(this.canvas);
    this.scene=new THREE.Scene();
    this.camera=new THREE.PerspectiveCamera(37,1,.1,100);
    this.camera.position.set(...this.cameraPos);
    configureEnvironment(this.renderer,this.scene,this.accent,this.dark);
    this.root=new THREE.Group();
    this.scene.add(this.root);
    this.root.add(platform(4.8,this.dark));

    try{
      this.update=await this.setup(this) || (()=>{});
      this.ready=true;
      const l=document.getElementById('loading-'+this.canvas.id.replace('scene-',''));
      if(l) l.classList.add('done');
      this.render();
    }catch(err){
      console.warn('3D scene failed:',this.canvas.id,err);
      this.ready=true;
      this.addFallback();
      const l=document.getElementById('loading-'+this.canvas.id.replace('scene-',''));
      if(l){l.innerHTML='<span></span>APERÇU 3D SIMPLIFIÉ';setTimeout(()=>l.classList.add('done'),700);}
      this.render();
    }
  }

  addFallback(){
    const orb=new THREE.Mesh(
      new THREE.IcosahedronGeometry(1.5,3),
      material(this.accent,.55,.18,{emissive:this.accent,emissiveIntensity:.08})
    );
    orb.position.y=.9;
    this.root.add(orb);
  }

  render(){
    if(!this.active || !this.ready)return;
    resize(this.renderer,this.camera,this.canvas);
    const t=this.clock.getElapsedTime();
    this.update(t,this.pointer);
    if(!reducedMotion){
      const tx=this.cameraPos[0]+this.pointer.x*.28;
      const ty=this.cameraPos[1]+this.pointer.y*.18;
      this.camera.position.x+=(tx-this.camera.position.x)*.025;
      this.camera.position.y+=(ty-this.camera.position.y)*.025;
    }
    this.camera.lookAt(this.look);
    this.renderer.render(this.scene,this.camera);
    requestAnimationFrame(()=>this.render());
  }
}

// ---------- project scenes ----------
async function ildavScene(s){
  const g=s.root;

  const laptop=pivot(await loadAsset(ASSETS.macbook,3.2));
  laptop.position.set(-1.5,.12,.55);
  laptop.rotation.y=.38;
  applyMacbookScreen(laptop);
  g.add(laptop);

  const desktop=pivot(await loadAsset(ASSETS.desktop,1.95));
  desktop.position.set(2.25,.10,-.95);
  desktop.rotation.y=-.55;
  g.add(desktop);

  const telegram=panel('INPUT',['TELEGRAM','SIGNAL'], '#67d9ff',1.55,.82);
  telegram.position.set(-3.1,2.1,-.6);telegram.rotation.y=.28;g.add(telegram);

  const validation=panel('PIPELINE',['PARSE','VALIDATE'], '#b695ff',1.75,.92);
  validation.position.set(.6,2.35,-1.2);validation.rotation.y=-.08;g.add(validation);

  const execution=panel('EXECUTION',['MT5 / PAPER','FLASK API'], '#67d9ff',1.9,.98);
  execution.position.set(3.05,2.0,.55);execution.rotation.y=-.42;g.add(execution);

  const pts=[
    new THREE.Vector3(-2.7,1.65,-.35),
    new THREE.Vector3(-1.0,1.15,.2),
    new THREE.Vector3(.45,1.65,-.6),
    new THREE.Vector3(1.7,1.25,-.25),
    new THREE.Vector3(2.8,1.5,.2)
  ];
  pts.slice(0,-1).forEach((p,i)=>g.add(line(p,pts[i+1],0x67d9ff,.28)));
  const packets=Array.from({length:10},(_,i)=>{
    const p=particle(i%3?0x67d9ff:0xb695ff,.05);g.add(p);return {p,o:i/10};
  });
  const r1=ring(2.55,0x67d9ff,.12);r1.position.y=.05;g.add(r1);

  return t=>{
    packets.forEach(x=>{
      const u=((t*.16)+x.o)%1;
      const seg=Math.min(pts.length-2,Math.floor(u*(pts.length-1)));
      x.p.position.lerpVectors(pts[seg],pts[seg+1],u*(pts.length-1)-seg);
    });
    laptop.position.y=.12+Math.sin(t*.65)*.025;
    validation.rotation.y=-.08+Math.sin(t*.4)*.025;
    r1.rotation.z=t*.07;
  };
}

async function cvconnectScene(s){
  const g=s.root;
  const server=pivot(await loadAsset(ASSETS.desktop,2.5));
  server.position.set(0,.12,-.35);server.rotation.y=-.12;g.add(server);

  const labels=[
    ['AUTH',['JWT','ROLES'],[-2.75,2.1,-.8],.35,'#b695ff'],
    ['CV',['CRUD','FILTER'],[2.6,2.3,-.8],-.34,'#67d9ff'],
    ['PDF',['PUPPETEER','EXPORT'],[-2.65,1.0,1.65],.52,'#ffc975'],
    ['SOCIAL',['NOTIFY','MESSAGING'],[2.55,1.05,1.65],-.52,'#ff8fb9']
  ];
  const centers=[];
  labels.forEach(([title,lines,pos,ry,color])=>{
    const p=panel(title,lines,color,1.75,.92);
    p.position.set(...pos);p.rotation.y=ry;g.add(p);
    const start=new THREE.Vector3(pos[0]*.68,pos[1]*.58,pos[2]*.55);
    const end=new THREE.Vector3(0,1.05,-.15);
    g.add(line(start,end,new THREE.Color(color).getHex(),.22));
    centers.push(start);
  });

  const reqs=centers.map((p,i)=>{const m=particle(i%2?0xb695ff:0x67d9ff,.055);g.add(m);return {m,start:p,o:i*.18}});
  const halo=ring(2.9,0xb695ff,.12);halo.position.y=.05;g.add(halo);

  return t=>{
    reqs.forEach((r,i)=>{
      const u=((t*.22)+r.o)%1;
      r.m.position.lerpVectors(r.start,new THREE.Vector3(0,1.05,-.15),u);
    });
    server.rotation.y=-.12+Math.sin(t*.35)*.035;
    halo.rotation.z=-t*.06;
  };
}

async function kioskScene(s){
  s.cameraPos=[7.7,5.1,8.8];
  const g=s.root;

  const kiosk=pivot(await loadAsset(ASSETS.kioskPremium,4.55));
  kiosk.position.set(-.65,.08,.05);
  kiosk.rotation.y=.34;
  g.add(kiosk);

  const backend=panel('BACKEND',['JAVA / JAVALIN','REST API'], '#ffc975',2.05,1.05);
  backend.position.set(2.85,2.0,-.8);backend.rotation.y=-.48;g.add(backend);

  const db=panel('DATA',['SQLITE','PERSISTENCE'], '#67d9ff',1.72,.9);
  db.position.set(2.8,.75,1.4);db.rotation.y=-.45;g.add(db);

  const docs=panel('DOCS',['SWAGGER','OPENAPI'], '#82d989',1.75,.9);
  docs.position.set(.75,2.8,-1.55);docs.rotation.y=-.15;g.add(docs);

  const pts=[
    new THREE.Vector3(.5,1.15,.2),
    new THREE.Vector3(1.55,1.35,-.15),
    new THREE.Vector3(2.35,1.55,-.45)
  ];
  pts.slice(0,-1).forEach((p,i)=>g.add(line(p,pts[i+1],0xffc975,.3)));
  const request=particle(0xffdc9e,.065);g.add(request);

  return t=>{
    const u=(t*.27)%1;
    if(u<.5)request.position.lerpVectors(pts[0],pts[1],u*2);
    else request.position.lerpVectors(pts[1],pts[2],(u-.5)*2);
    kiosk.position.y=.08+Math.sin(t*.55)*.018;
    docs.rotation.y=-.15+Math.sin(t*.35)*.025;
  };
}

async function boatScene(s){
  s.cameraPos=[7.8,4.5,9.2];
  s.look=new THREE.Vector3(0,.55,0);
  const g=s.root;

  // replace default pedestal with a reflective water plane
  g.children[0].visible=false;
  const water=new THREE.Mesh(
    new THREE.CircleGeometry(5.05,96),
    new THREE.MeshPhysicalMaterial({
      color:0x0b3556,
      roughness:.13,
      metalness:.03,
      transparent:true,
      opacity:.88,
      clearcoat:.7,
      clearcoatRoughness:.08
    })
  );
  water.rotation.x=-Math.PI/2;water.position.y=0;water.receiveShadow=true;g.add(water);

  const boat=pivot(await loadAsset(ASSETS.boatPremium,4.55));
  boat.position.set(-.3,.1,.0);
  boat.rotation.y=-.2;
  g.add(boat);

  const gpsPanel=panel('NAVIGATION',['GPS WAYPOINTS','PIXHAWK + QGC'], '#7cdfff',2.1,1.04);
  gpsPanel.position.set(2.75,2.2,-1.2);gpsPanel.rotation.y=-.45;g.add(gpsPanel);

  const wp=[
    [-3.2,.08,-2.0],[-1.7,.08,-.8],[.35,.08,-1.6],[2.4,.08,-.2],[1.7,.08,2.1]
  ];
  const buoys=[];
  for(let i=0;i<wp.length;i++){
    const b=pivot(await loadAsset(i===wp.length-1?ASSETS.buoyFlag:ASSETS.buoy,.55));
    b.position.set(...wp[i]);g.add(b);buoys.push(b);
    if(i<wp.length-1){
      g.add(line(new THREE.Vector3(...wp[i]).add(new THREE.Vector3(0,.25,0)),new THREE.Vector3(...wp[i+1]).add(new THREE.Vector3(0,.25,0)),0x7cdfff,.36));
    }
  }

  const gps1=ring(1.2,0x7cdfff,.33);gps1.position.set(-.3,.05,0);g.add(gps1);
  const gps2=ring(2.0,0x7cdfff,.12);gps2.position.set(-.3,.04,0);g.add(gps2);

  return t=>{
    boat.position.y=.1+Math.sin(t*.8)*.05;
    boat.rotation.z=Math.sin(t*.55)*.018;
    boat.rotation.y=-.2+Math.sin(t*.32)*.02;
    gps1.scale.setScalar(1+(Math.sin(t*1.55)+1)*.12);
    gps2.scale.setScalar(1+(Math.sin(t*1.1)+1)*.08);
    buoys.forEach((b,i)=>b.position.y=.08+Math.sin(t*.7+i)*.035);
  };
}

async function connect4Scene(s){
  const g=s.root;
  const left=pivot(await loadAsset(ASSETS.desktop,1.85));
  left.position.set(-3.1,.1,-.15);left.rotation.y=.52;g.add(left);
  const right=pivot(await loadAsset(ASSETS.desktop,1.85));
  right.position.set(3.1,.1,-.15);right.rotation.y=-.52;g.add(right);

  const server=pivot(await loadAsset(ASSETS.computerSystem,1.55));
  server.position.set(0,.12,-2.0);g.add(server);

  const board=new THREE.Group();board.position.set(0,.55,1.25);g.add(board);
  const frame=new THREE.Mesh(
    new THREE.BoxGeometry(3.35,2.55,.24),
    material(0x1d2e52,.46,.31,{clearcoat:.35})
  );
  frame.castShadow=true;board.add(frame);
  for(let y=0;y<5;y++)for(let x=0;x<7;x++){
    const h=new THREE.Mesh(new THREE.CylinderGeometry(.14,.14,.29,28),material(0x080b12,.08,.6));
    h.rotation.x=Math.PI/2;h.position.set((x-3)*.41,(y-2)*.41,.14);board.add(h);
  }
  for(let i=0;i<13;i++){
    const color=i%2?0xff7b86:0x6f9dff;
    const token=new THREE.Mesh(
      new THREE.CylinderGeometry(.12,.12,.045,32),
      material(color,.18,.24,{emissive:color,emissiveIntensity:.14})
    );
    token.rotation.x=Math.PI/2;
    token.position.set(((i*3)%7-3)*.41,(((i*5)%5)-2)*.41,.31);
    board.add(token);
  }

  const a=new THREE.Vector3(-2.25,.85,-.1);
  const mid=new THREE.Vector3(0,1.05,-1.25);
  const b=new THREE.Vector3(2.25,.85,-.1);
  g.add(line(a,mid,0x6f9dff,.35));g.add(line(mid,b,0xff7b86,.35));
  const packet=particle(0xffffff,.06);g.add(packet);

  return t=>{
    const u=(t*.25)%1;
    if(u<.5)packet.position.lerpVectors(a,mid,u*2);
    else packet.position.lerpVectors(mid,b,(u-.5)*2);
    board.rotation.y=Math.sin(t*.35)*.035;
  };
}

async function kikiriScene(s){
  s.cameraPos=[7.2,5.5,8.8];
  const g=s.root;

  const table=new THREE.Mesh(
    new THREE.CylinderGeometry(3.0,3.0,.3,64),
    material(0x26192a,.18,.34,{clearcoat:.4})
  );
  table.position.y=.14;table.receiveShadow=true;g.add(table);

  const dice=[];
  const poses=[[-1.15,.5,-.35,.3],[.15,.56,.45,-.5],[1.15,.48,-.5,.75]];
  for(let i=0;i<poses.length;i++){
    const d=pivot(await loadAsset(ASSETS.dicePremium,1.0));
    d.position.set(poses[i][0],poses[i][1],poses[i][2]);
    d.rotation.set(.15,poses[i][3],.1);g.add(d);dice.push(d);
  }

  const timer=panel('ROUND TIMER',['00 : 30','BETTING OPEN'], '#ff8fb9',2.15,1.05);
  timer.position.set(0,2.45,-1.2);timer.rotation.x=-.04;g.add(timer);

  const history=panel('HISTORY',['LAST ROUNDS','●  ●  ●  ●'], '#b695ff',1.75,.92);
  history.position.set(2.75,1.65,.2);history.rotation.y=-.5;g.add(history);

  const r=ring(2.35,0xff8fb9,.18);r.position.y=.32;g.add(r);
  const coinParticles=Array.from({length:9},(_,i)=>{
    const p=particle(i%2?0xff8fb9:0xffc975,.07);
    const a=i*Math.PI*2/9;p.position.set(Math.cos(a)*2.2,.46,Math.sin(a)*2.2);g.add(p);return {p,a};
  });

  return t=>{
    dice.forEach((d,i)=>{
      d.position.y=poses[i][1]+Math.sin(t*.75+i)*.04;
      d.rotation.y=poses[i][3]+Math.sin(t*.35+i)*.035;
    });
    r.rotation.z=t*.06;
    coinParticles.forEach((o,i)=>o.p.position.y=.46+Math.sin(t*1.2+i*.6)*.055);
  };
}

// ---------- hero ----------
async function heroScene(){
  const canvas=document.getElementById('heroCanvas');
  if(!canvas)return;

  const renderer=makeRenderer(canvas);
  const scene=new THREE.Scene();
  const camera=new THREE.PerspectiveCamera(35,1,.1,100);
  camera.position.set(7.3,4.7,9.0);
  configureEnvironment(renderer,scene,0x3157ff,false);

  const root=new THREE.Group();
  root.position.set(2.6,-.6,-.1);
  scene.add(root);

  const base=new THREE.Mesh(
    new THREE.CylinderGeometry(3.7,4.15,.42,96),
    material(0xe2e5ea,.35,.28,{clearcoat:.72,clearcoatRoughness:.14})
  );
  base.position.y=.05;base.receiveShadow=true;root.add(base);

  const laptop=pivot(await loadAsset(ASSETS.macbook,4.9));
  laptop.position.set(0,.27,0);
  laptop.rotation.y=-.48;
  applyMacbookScreen(laptop);
  root.add(laptop);

  const python=panel('PYTHON',['BACKEND','AUTOMATION'], '#3157ff',1.72,.9,false);
  python.position.set(-2.35,2.5,-.65);python.rotation.y=.36;root.add(python);

  const api=panel('APIs',['REST','INTEGRATION'], '#7d67e8',1.72,.9,false);
  api.position.set(2.4,2.45,-.8);api.rotation.y=-.36;root.add(api);

  const systems=panel('SYSTEMS',['SOFTWARE','END-TO-END'], '#15171c',1.95,.96,false);
  systems.position.set(1.95,1.0,2.1);systems.rotation.y=-.72;root.add(systems);

  const orbit1=ring(2.45,0x3157ff,.19);orbit1.position.y=.25;root.add(orbit1);
  const orbit2=ring(3.25,0x9a7dff,.10);orbit2.position.y=.23;root.add(orbit2);

  const motes=Array.from({length:12},(_,i)=>{
    const p=particle(i%2?0x3157ff:0x9a7dff,.045);root.add(p);return {p,o:i/12};
  });

  let px=0,py=0;
  window.addEventListener('pointermove',e=>{
    px=(e.clientX/innerWidth-.5)*2;
    py=(e.clientY/innerHeight-.5)*-2;
  },{passive:true});

  const loading=document.getElementById('heroLoading');
  if(loading)loading.classList.add('done');

  const clock=new THREE.Clock();
  function render(){
    resize(renderer,camera,canvas);
    const t=clock.getElapsedTime();
    if(!reducedMotion){
      root.rotation.y+=(px*.06-root.rotation.y)*.022;
      root.rotation.x+=(py*.022-root.rotation.x)*.022;
      laptop.position.y=.27+Math.sin(t*.45)*.025;
      python.position.y=2.5+Math.sin(t*.65)*.045;
      api.position.y=2.45+Math.sin(t*.65+1)*.045;
      systems.position.y=1.0+Math.sin(t*.55+2)*.035;
      orbit1.rotation.z=t*.055;orbit2.rotation.z=-t*.035;
      motes.forEach(o=>{
        const a=t*.28+o.o*Math.PI*2;
        o.p.position.set(Math.cos(a)*2.85,.6+Math.sin(a*1.8)*.25,Math.sin(a)*1.55);
      });
    }
    camera.lookAt(2.25,.95,0);
    renderer.render(scene,camera);
    requestAnimationFrame(render);
  }
  render();
}

// ---------- boot ----------
function webglAvailable(){
  try{
    const c=document.createElement('canvas');
    return !!(window.WebGLRenderingContext && (c.getContext('webgl')||c.getContext('experimental-webgl')));
  }catch(e){return false}
}

async function boot(){
  if(!webglAvailable()){
    document.body.classList.add('no-webgl');
    return;
  }

  heroScene().catch(err=>{
    console.warn('Hero 3D failed',err);
    const l=document.getElementById('heroLoading');
    if(l)l.classList.add('done');
  });

  const configs={
    ildav:{setup:ildavScene,accent:0x67d9ff,camera:[7.6,5.2,8.7]},
    cvconnect:{setup:cvconnectScene,accent:0xb695ff,camera:[7.5,5.3,8.5]},
    kiosk:{setup:kioskScene,accent:0xffc975,camera:[7.7,5.1,8.8]},
    boat:{setup:boatScene,accent:0x7cdfff,camera:[7.8,4.5,9.2],look:[0,.55,0]},
    connect4:{setup:connect4Scene,accent:0xff7b86,camera:[7.5,5.1,8.6]},
    kikiri:{setup:kikiriScene,accent:0xff8fb9,camera:[7.2,5.5,8.8]}
  };

  projects.forEach(p=>{
    const canvas=document.getElementById('scene-'+p.key);
    const cfg=configs[p.key];
    if(canvas && cfg)new LazyScene(canvas,cfg.accent,cfg.setup,{dark:true,camera:cfg.camera,look:cfg.look||[0,.85,0]});
  });
}
boot();

// active nav
const sections=[...document.querySelectorAll('main section[id]')];
const navLinks=[...document.querySelectorAll('.nav-links a')];
const navObs=new IntersectionObserver(entries=>{
  const visible=entries.filter(e=>e.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];
  if(!visible)return;
  navLinks.forEach(a=>a.style.color=a.getAttribute('href')==='#'+visible.target.id?'#111217':'');
},{threshold:[.25,.55]});
sections.forEach(s=>navObs.observe(s));
