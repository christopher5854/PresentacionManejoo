const gameArea = document.getElementById("gameArea");
const player = document.getElementById("player");
const startBtn = document.getElementById("startBtn");
const restartBtn = document.getElementById("restartBtn");
const recordDisplay = document.getElementById("record");
const exitBtn = document.getElementById("exitBtn");
const exitBtnGame = document.getElementById("exitBtnGame");


let score = 0;
let lives = 3;
let baseSpeed = 1.2;    
let currentSpeed = 1;   
let spawnRate = 1200;     
let playerSpeed = 6.5;
let gameRunning = false;
let keys = {};
let enemies = [];
let bullets = [];
let spawnInterval = null;
let gameStarted = false;

document.getElementById("startBtn").addEventListener("click", function() {
    document.getElementById("startScreen").style.display = "none";
    gameStarted = true;
    iniciarJuego(); // Llama a tu función principal
});

document.addEventListener("keydown", e => {
    if (e.code === "Space") e.preventDefault();
    keys[e.code] = true;
});
document.addEventListener("keyup", e => keys[e.code] = false);

startBtn.addEventListener("click", startGame);
restartBtn.addEventListener("click", restartGame);
exitBtnGame.addEventListener("click", exitGame);
exitBtn.addEventListener("click", exitGame)

function exitGame() {
    window.location.href = "IndexPer.html";
}


// -----------------------------

function resetGame() {
    // Reinicia variables
    score = 0;
    enemySpeed = 2;
    enemies = [];
    gameOver = false;

    // Reinicia posición del jugador si tienes una
    player.x = canvas.width / 2 - 25;
}

function startGame() {
    if (gameRunning) return;

    score = 0;
    lives = 3;
    baseSpeed = 1.2;
    currentSpeed = 1;
    spawnRate = 1200;
    enemies = [];
    bullets = [];
    gameRunning = true;

    document.getElementById("score").textContent = score;
    document.getElementById("lives").textContent = lives;

    document.getElementById("gameOverScreen").classList.add("hidden");
    startBtn.classList.add("hidden");

    gameArea.innerHTML = "";
    gameArea.appendChild(player);
    player.style.left = (gameArea.clientWidth / 2 - 25) + "px";

    startSpawning();

    requestAnimationFrame(gameLoop);
}

// -----------------------------

function startSpawning() {
    clearInterval(spawnInterval);
    spawnInterval = setInterval(spawnEnemy, spawnRate);
}

// -----------------------------

function spawnEnemy() {
    if (!gameRunning) return;

    const enemy = document.createElement("div");
    enemy.classList.add("enemy");
    enemy.style.left = Math.random() * (gameArea.clientWidth - 50) + "px";
    enemy.style.top = "0px";
    gameArea.appendChild(enemy);
    enemies.push(enemy);
}

// -----------------------------

function shoot() {
    if (!gameRunning) return;

    const bullet = document.createElement("div");
    bullet.classList.add("bullet");
    bullet.style.left = player.offsetLeft + 22 + "px";
    bullet.style.top = player.offsetTop + "px";
    gameArea.appendChild(bullet);
    bullets.push(bullet);
}

// -----------------------------

function gameLoop() {
    if (!gameRunning) return;

    // Movimiento jugador
    if (keys["ArrowLeft"] && player.offsetLeft > 0) {
        player.style.left = player.offsetLeft - playerSpeed + "px";
    }
    if (keys["ArrowRight"] && player.offsetLeft < gameArea.clientWidth - 50) {
        player.style.left = player.offsetLeft + playerSpeed + "px";
    }
    if (keys["Space"]) {
        shoot();
        keys["Space"] = false;
    }

    // Movimiento balas
    bullets.forEach((bullet, i) => {
        bullet.style.top = bullet.offsetTop - 8 + "px";
        if (bullet.offsetTop < 0) {
            bullet.remove();
            bullets.splice(i,1);
        }
    });

    // Movimiento enemigos
    enemies.forEach((enemy, ei) => {
        enemy.style.top = enemy.offsetTop + currentSpeed + "px";

        if (enemy.offsetTop > gameArea.clientHeight) {
            enemy.remove();
            enemies.splice(ei,1);
            loseLife();
        }

        bullets.forEach((bullet, bi) => {
            if (isColliding(enemy, bullet)) {
                enemy.remove();
                bullet.remove();
                enemies.splice(ei,1);
                bullets.splice(bi,1);
                score += 10;
                document.getElementById("score").textContent = score;

                increaseDifficulty(); // 🔥 AUMENTO DINÁMICO
            }
        });
    });

    requestAnimationFrame(gameLoop);
}

// -----------------------------

function increaseDifficulty() {
    // Cada 50 puntos aumenta velocidad
    if (score % 50 === 0) {
        currentSpeed += 0.4;

        // También aumenta frecuencia de aparición
        if (spawnRate > 400) {
            spawnRate -= 100;
            startSpawning();
        }
    }
}

// -----------------------------

function loseLife() {
    lives--;
    document.getElementById("lives").textContent = lives;
    if (lives <= 0) endGame();
}

// -----------------------------

function endGame() {
    gameRunning = false;
    clearInterval(spawnInterval);

    enemies.forEach(e => e.remove());
    bullets.forEach(b => b.remove());
    enemies = [];
    bullets = [];

    document.getElementById("finalScoreText").textContent = score;

    let currentRecord = parseInt(recordDisplay.textContent);
    if (score > currentRecord) {
        recordDisplay.textContent = score;
        document.getElementById("newRecordText").classList.remove("hidden");
    } else {
        document.getElementById("newRecordText").classList.add("hidden");
    }

    document.getElementById("gameOverScreen").classList.remove("hidden");
}

// -----------------------------

function restartGame() {
    // Ocultar pantalla Game Over
    document.getElementById("gameOverScreen").classList.add("hidden");

    // Resetear variables
    score = 0;
    lives = 3;
    baseSpeed = 1.2;
    currentSpeed = 1;
    spawnRate = 1200;
    enemies = [];
    bullets = [];
    gameRunning = true;

    document.getElementById("score").textContent = score;
    document.getElementById("lives").textContent = lives;

    gameArea.innerHTML = "";
    gameArea.appendChild(player);
    player.style.left = (gameArea.clientWidth / 2 - 25) + "px";

    startSpawning();
    requestAnimationFrame(gameLoop);    
}

// -----------------------------

function isColliding(a, b) {
    return !(
        a.offsetTop > b.offsetTop + b.offsetHeight ||
        a.offsetTop + a.offsetHeight < b.offsetTop ||
        a.offsetLeft > b.offsetLeft + b.offsetWidth ||
        a.offsetLeft + a.offsetWidth < b.offsetLeft
    );
}
