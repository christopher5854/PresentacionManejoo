const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 600;
canvas.height = 400;

let player, bullets = [], enemies = [];
let keys = {};
let score = 0;
let level = 1;
let enemySpeed = 1;
let gameRunning = false;

document.addEventListener("keydown", e => keys[e.key] = true);
document.addEventListener("keyup", e => keys[e.key] = false);

function startGame(){
    document.getElementById("instructionModal").style.display="none";
    init();
    gameRunning = true;
    loop();
}

function restartGame(){
    document.getElementById("gameOver").style.display="none";
    score = 0;
    level = 1;
    enemySpeed = 1;
    init();
    gameRunning = true;
    loop();
}

function init(){
    player = {x:280, y:350, width:40, height:30, speed:6};
    bullets = [];
    enemies = [];
    createEnemies();
}

function createEnemies(){
    for(let r=0;r<3;r++){
        for(let c=0;c<7;c++){
            enemies.push({
                x:60 + c*70,
                y:40 + r*60,
                alive:true
            });
        }
    }
}

function drawPlayer(){
    ctx.fillStyle="#ffe81f";
    ctx.beginPath();
    ctx.moveTo(player.x,player.y);
    ctx.lineTo(player.x+20,player.y-30);
    ctx.lineTo(player.x+40,player.y);
    ctx.closePath();
    ctx.fill();
}

function drawBullets(){
    ctx.fillStyle="#ff0000";
    bullets.forEach(b=>{
        ctx.fillRect(b.x,b.y,4,12);
    });
}

function drawEnemies(){
    enemies.forEach(e=>{
        if(e.alive){
            ctx.fillStyle="#ff0000";
            ctx.fillRect(e.x,e.y,30,30);
        }
    });
}

function update(){
    if(keys["ArrowLeft"] && player.x>0) player.x -= player.speed;
    if(keys["ArrowRight"] && player.x<560) player.x += player.speed;

    if(keys[" "]){
        bullets.push({x:player.x+18,y:player.y-20});
        keys[" "] = false;
    }

    bullets.forEach(b=> b.y -= 7);

    enemies.forEach(e=>{
        if(e.alive) e.y += enemySpeed*0.1;
    });

    checkCollision();

    if(enemies.every(e=>!e.alive)){
        level++;
        enemySpeed += 0.3;
        enemies = [];
        createEnemies();
    }

    document.getElementById("score").innerText = score;
    document.getElementById("level").innerText = level;
    document.getElementById("speed").innerText = level+"x";
}

function checkCollision(){

    // Bala vs enemigo
    bullets.forEach(b=>{
        enemies.forEach(e=>{
            if(e.alive &&
               b.x < e.x + 30 &&
               b.x + 4 > e.x &&
               b.y < e.y + 30 &&
               b.y + 12 > e.y){

                e.alive = false;
                b.y = -100;
                score += 10;
            }
        });
    });

    // Enemigo vs jugador
    enemies.forEach(e=>{
        if(e.alive &&
           player.x < e.x + 30 &&
           player.x + player.width > e.x &&
           player.y < e.y + 30 &&
           player.y + player.height > e.y){

            gameRunning = false;
            document.getElementById("gameOver").style.display="flex";
        }
    });
}

function loop(){
    if(!gameRunning) return;
    ctx.clearRect(0,0,600,400);
    drawPlayer();
    drawBullets();
    drawEnemies();
    update();
    requestAnimationFrame(loop);
}