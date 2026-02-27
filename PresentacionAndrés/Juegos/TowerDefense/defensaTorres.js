// ===============================
// Tower Defense Deluxe FINAL PRO
// ===============================


// ===== Cola circular =====

class CircularQueue{

constructor(capacity=256){

this.data=new Array(capacity);
this.capacity=capacity;
this.head=0;
this.tail=0;
this.size=0;

}

enqueue(item){

if(this.size===this.capacity)
this.expand();

this.data[this.tail]=item;
this.tail=(this.tail+1)%this.capacity;
this.size++;

}

expand(){

const old=this.toArray();

this.capacity*=2;
this.data=new Array(this.capacity);

for(let i=0;i<old.length;i++)
this.data[i]=old[i];

this.head=0;
this.tail=old.length;
this.size=old.length;

}

toArray(){

const arr=[];

for(let i=0;i<this.size;i++)
arr.push(this.data[(this.head+i)%this.capacity]);

return arr;

}

}



// ===== ENEMIGO =====

class Cozy{

constructor(path,hp,speed,reward){

this.path=path;
this.hp=hp;
this.maxHp=hp;

this.speed=speed/60;

this.reward=reward;

this.segment=0;
this.progress=0;

this.pos={...path[0]};

this.color="#ff5577";

this.slowFactor=1;

}


update(dt){

const from=this.path[this.segment];
const to=this.path[this.segment+1];

if(!to) return false;

const dx=to.x-from.x;
const dy=to.y-from.y;

const dist=Math.hypot(dx,dy);

this.progress+=this.speed*this.slowFactor*dt*60;

if(this.progress>=dist){

this.segment++;
this.progress=0;

if(this.segment>=this.path.length-1)
return false;

}

const s=this.progress/dist;

this.pos.x=from.x+dx*s;
this.pos.y=from.y+dy*s;

return true;

}


takeDamage(d){
this.hp-=d;
}

isDead(){
return this.hp<=0;
}

}



// ===== TORRE =====

class Tower{

constructor(x,y,type){

this.x=x;
this.y=y;
this.type=type;

if(type==="basic"){

this.range=80;
this.damage=10;
this.rate=0.6;
this.color="#00e0ff";
this.cost=50;

}

if(type==="slow"){

this.range=90;
this.damage=4;
this.rate=0.8;
this.color="#ffcc00";
this.cost=70;
this.slow=0.5;

}

if(type==="sniper"){

this.range=180;
this.damage=30;
this.rate=1.5;
this.color="#00ff99";
this.cost=120;

}

this.cooldown=0;

}

update(dt){

if(this.cooldown>0)
this.cooldown-=dt;

}

canFire(){
return this.cooldown<=0;
}

fire(target){

GAME.bullets.push(

new Bullet(
this.x,
this.y,
target,
this.damage,
this.color,
this.slow
)

);

this.cooldown=this.rate;

}

}



// ===== BALA =====

class Bullet{

constructor(x,y,target,damage,color,slow){

this.x=x;
this.y=y;

this.target=target;

this.damage=damage;
this.color=color;
this.slow=slow;

this.speed=300;
this.radius=5;

this.alive=true;

}

update(dt){

if(!this.target || this.target.isDead()){
this.alive=false;
return;
}

const dx=this.target.pos.x-this.x;
const dy=this.target.pos.y-this.y;

const dist=Math.hypot(dx,dy);

if(dist<10){

this.target.takeDamage(this.damage);

if(this.slow)
this.target.slowFactor=this.slow;

this.alive=false;

return;

}

this.x+=(dx/dist)*this.speed*dt;
this.y+=(dy/dist)*this.speed*dt;

}

}



// ===== GAME =====

const GAME={

towers:[],
enemies:[],
bullets:[],

money:200,
health:10,
score:0,

running:false,

selectedTower:"basic",

wave:0,

history:[],
redo:[],

path:[

{x:0,y:250},
{x:120,y:250},
{x:120,y:400},
{x:300,y:400},
{x:300,y:100},
{x:500,y:100},
{x:500,y:350},
{x:720,y:350}

]

};



// ===== CANVAS =====

const canvas=document.getElementById("game");
const ctx=canvas.getContext("2d");



// ===== GENERADOR DE OLEADAS =====

function generateWave(w){

let wave=[];

let cantidad=5+w*3;
let hp=20+w*15;
let speed=40+w*3;
let reward=10+w*2;

for(let i=0;i<cantidad;i++){

wave.push({

hp:hp+Math.random()*10,
speed:speed,
reward:reward

});

}

return wave;

}



// ===== SPAWN OLEADA =====

function spawnWave(){

GAME.wave++;

document.getElementById("waveNum").textContent=GAME.wave;
document.getElementById("waveCounter").textContent="("+GAME.wave+")";

let wave=generateWave(GAME.wave);

document.getElementById("nextWaveEnemies").textContent=wave.length;


let diff="Fácil";

if(GAME.wave>3) diff="Media";
if(GAME.wave>6) diff="Difícil";
if(GAME.wave>10) diff="Extrema";

document.getElementById("nextWaveDifficulty").textContent=diff;


let i=0;

let spawner=setInterval(()=>{

if(!GAME.running) return;

if(i>=wave.length){

clearInterval(spawner);
return;

}

let e=new Cozy(
GAME.path,
wave[i].hp,
wave[i].speed,
wave[i].reward
);

GAME.enemies.push(e);

i++;

},700);

GAME.running=true;

}



// ===== UPDATE =====

function update(dt){


// enemigos

for(let e of GAME.enemies){

let alive=e.update(dt);

if(!alive){

GAME.health--;
e.hp=0;

}

}


// torres

for(let t of GAME.towers){

t.update(dt);

let target=GAME.enemies.find(

e=>!e.isDead() &&
Math.hypot(e.pos.x-t.x,e.pos.y-t.y)<=t.range

);

if(target && t.canFire())
t.fire(target);

}


// balas

for(let b of GAME.bullets)
b.update(dt);


GAME.bullets=
GAME.bullets.filter(b=>b.alive);


GAME.enemies=
GAME.enemies.filter(e=>{

if(e.isDead()){

GAME.money+=e.reward;
GAME.score+=e.reward;

return false;

}

return true;

});



// HUD

document.getElementById("playerHealth").textContent=GAME.health;
document.getElementById("money").textContent=GAME.money;
document.getElementById("score").textContent=GAME.score;

document.getElementById("enemiesLeft").textContent=GAME.enemies.length;
document.getElementById("towersPlaced").textContent=GAME.towers.length;


if(GAME.health<=0){

GAME.running=false;

alert("GAME OVER");

}

}



// ===== DIBUJO =====

function draw(){

ctx.clearRect(0,0,canvas.width,canvas.height);


// camino

ctx.strokeStyle="#1e293b";
ctx.lineWidth=20;

ctx.beginPath();

GAME.path.forEach((p,i)=>{

if(i===0)
ctx.moveTo(p.x,p.y);
else
ctx.lineTo(p.x,p.y);

});

ctx.stroke();


// torres

for(let t of GAME.towers){

ctx.fillStyle=t.color;

ctx.beginPath();
ctx.arc(t.x,t.y,12,0,Math.PI*2);
ctx.fill();

}


// balas

for(let b of GAME.bullets){

ctx.fillStyle=b.color;

ctx.beginPath();
ctx.arc(b.x,b.y,b.radius,0,Math.PI*2);
ctx.fill();

}


// enemigos

for(let e of GAME.enemies){

ctx.fillStyle=e.color;

ctx.beginPath();
ctx.arc(e.pos.x,e.pos.y,10,0,Math.PI*2);
ctx.fill();

let hp=e.hp/e.maxHp;

ctx.fillStyle="green";

ctx.fillRect(
e.pos.x-10,
e.pos.y-16,
20*hp,
4
);

}

}



// ===== LOOP =====

let last=0;

function loop(t){

let dt=(t-last)/1000;
last=t;

if(GAME.running)
update(dt);

draw();

requestAnimationFrame(loop);

}

requestAnimationFrame(loop);



// ===== CLICK TORRES =====

canvas.addEventListener("click",e=>{

const rect=canvas.getBoundingClientRect();

let x=e.clientX-rect.left;
let y=e.clientY-rect.top;

let tower=new Tower(x,y,GAME.selectedTower);

if(GAME.money<tower.cost)
return alert("No dinero");


if(GAME.towers.some(t=>Math.hypot(t.x-x,t.y-y)<24))
return alert("Muy cerca de otra torre");


GAME.money-=tower.cost;

GAME.towers.push(tower);

GAME.history.push(tower);
GAME.redo=[];

});



// ===== BOTONES TORRES =====

document.querySelectorAll(".tower-btn")
.forEach(btn=>{

btn.onclick=()=>{

GAME.selectedTower=btn.dataset.type;

};

});



// ===== DESHACER =====

document.getElementById("undo").onclick=()=>{

if(GAME.history.length===0)
return;

let tower=GAME.history.pop();

GAME.towers=
GAME.towers.filter(t=>t!==tower);

GAME.money+=tower.cost;

GAME.redo.push(tower);

};



// ===== REHACER =====

document.getElementById("redo").onclick=()=>{

if(GAME.redo.length===0)
return;

let tower=GAME.redo.pop();

if(GAME.money<tower.cost)
return alert("No dinero");

GAME.money-=tower.cost;

GAME.towers.push(tower);

GAME.history.push(tower);

};



// ===== PAUSA =====

document.getElementById("pauseBtn").onclick=()=>{

GAME.running=!GAME.running;

document.getElementById("pauseBtn").textContent=
GAME.running?"⏸️ Pausar":"▶️ Reanudar";

};



// ===== INICIAR OLEADA =====

document
.getElementById("startWave")
.onclick=spawnWave;