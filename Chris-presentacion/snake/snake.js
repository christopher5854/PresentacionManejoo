// Snake Game - JavaScript para el Equipo Mario Kart
// Desarrollado por Matias "El Forajido"

class SnakeGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        // Configuración del juego
        this.gridSize = 20;
        this.tileCount = 30; // 600/20 = 30 tiles
        
        // Estado del juego
        this.gameRunning = false;
        this.gamePaused = false;
        this.gameOver = false;
        
        // Serpiente
        this.snake = [
            {x: 15, y: 15}
        ];
        this.snakeLength = 1;
        
        // Dirección inicial
        this.dx = 0;
        this.dy = 0;
        this.nextDx = 0;
        this.nextDy = 0;
        
        // Comida - Ahora es un array para múltiples frutas
        this.foods = [];
        this.maxFoods = 3; // Máximo 3 frutas a la vez
        
        // Puntuación y nivel
        this.score = 0;
        this.level = 1;
        this.speed = 1;
        this.baseSpeed = 150;
        
        // Elementos del DOM
        this.currentScoreElement = document.getElementById('currentScore');
        this.highScoreElement = document.getElementById('highScore');
        this.currentLevelElement = document.getElementById('currentLevel');
        this.currentSpeedElement = document.getElementById('currentSpeed');
        this.finalScoreElement = document.getElementById('finalScore');
        this.finalHighScoreElement = document.getElementById('finalHighScore');
        
        // Overlays
        this.startOverlay = document.getElementById('startOverlay');
        this.pauseOverlay = document.getElementById('pauseOverlay');
        this.gameOverOverlay = document.getElementById('gameOverOverlay');
        
        // Botones
        this.startButton = document.getElementById('startButton');
        this.resumeButton = document.getElementById('resumeButton');
        this.restartButton = document.getElementById('restartButton');
        this.menuButton = document.getElementById('menuButton');
        
        // Cargar puntuación más alta
        this.highScore = this.loadHighScore();
        this.updateScoreDisplay();
        
        // Event listeners
        this.setupEventListeners();
        
        // Inicializar el juego
        this.init();
    }
    
    init() {
        // Generar frutas iniciales
        this.generateInitialFoods();
        
        // Dibujar el canvas inicial
        this.draw();
        
        // Mostrar overlay de inicio
        this.showStartOverlay();
    }
    
    setupEventListeners() {
        // Controles del teclado
        document.addEventListener('keydown', (e) => {
            this.handleKeyPress(e);
        });
        
        // Botones del juego
        this.startButton.addEventListener('click', () => {
            this.startGame();
        });
        
        this.resumeButton.addEventListener('click', () => {
            this.resumeGame();
        });
        
        this.restartButton.addEventListener('click', () => {
            this.restartGame();
        });
        
        this.menuButton.addEventListener('click', () => {
            this.goToMenu();
        });
    }
    
    handleKeyPress(e) {
        if (!this.gameRunning || this.gameOver) return;
        
        switch(e.key) {
            case 'ArrowUp':
                if (this.dy !== 1) { // No puede ir hacia abajo si va hacia arriba
                    this.nextDx = 0;
                    this.nextDy = -1;
                }
                break;
            case 'ArrowDown':
                if (this.dy !== -1) { // No puede ir hacia arriba si va hacia abajo
                    this.nextDx = 0;
                    this.nextDy = 1;
                }
                break;
            case 'ArrowLeft':
                if (this.dx !== 1) { // No puede ir hacia la derecha si va hacia la izquierda
                    this.nextDx = -1;
                    this.nextDy = 0;
                }
                break;
            case 'ArrowRight':
                if (this.dx !== -1) { // No puede ir hacia la izquierda si va hacia la derecha
                    this.nextDx = 1;
                    this.nextDy = 0;
                }
                break;
            case ' ':
                e.preventDefault();
                if (this.gameRunning && !this.gameOver) {
                    this.togglePause();
                }
                break;
        }
    }
    
    startGame() {
        this.gameRunning = true;
        this.gameOver = false;
        this.gamePaused = false;
        
        // Reiniciar valores
        this.snake = [{x: 15, y: 15}];
        this.snakeLength = 1;
        this.dx = 0;
        this.dy = 0;
        this.nextDx = 0;
        this.nextDy = 0;
        this.score = 0;
        this.level = 1;
        this.speed = 1;
        
        // Limpiar y regenerar frutas
        this.foods = [];
        this.generateInitialFoods();
        
        // Ocultar overlay de inicio
        this.hideStartOverlay();
        
        // Actualizar display
        this.updateScoreDisplay();
        
        // Iniciar loop del juego
        this.gameLoop();
    }
    
    togglePause() {
        if (this.gamePaused) {
            this.resumeGame();
        } else {
            this.pauseGame();
        }
    }
    
    pauseGame() {
        this.gamePaused = true;
        this.pauseOverlay.style.display = 'flex';
    }
    
    resumeGame() {
        this.gamePaused = false;
        this.pauseOverlay.style.display = 'none';
        this.gameLoop();
    }
    
    gameLoop() {
        if (!this.gameRunning || this.gamePaused || this.gameOver) return;
        
        // Actualizar dirección
        this.dx = this.nextDx;
        this.dy = this.nextDy;
        
        // Mover serpiente
        this.moveSnake();
        
        // Verificar colisiones
        if (this.checkCollision()) {
            this.gameOver = true;
            this.endGame();
            return;
        }
        
        // Verificar si come comida
        this.checkFood();
        
        // Mantener el número de frutas
        this.maintainFoodCount();
        
        // Dibujar
        this.draw();
        
        // Continuar loop
        setTimeout(() => {
            this.gameLoop();
        }, this.baseSpeed / this.speed);
    }
    
    moveSnake() {
        // Agregar nueva cabeza
        const newHead = {
            x: this.snake[0].x + this.dx,
            y: this.snake[0].y + this.dy
        };
        
        this.snake.unshift(newHead);
        
        // Remover cola si no creció
        if (this.snake.length > this.snakeLength) {
            this.snake.pop();
        }
    }
    
    checkCollision() {
        const head = this.snake[0];
        
        // Colisión con paredes
        if (head.x < 0 || head.x >= this.tileCount || head.y < 0 || head.y >= this.tileCount) {
            return true;
        }
        
        // Colisión con el propio cuerpo
        for (let i = 1; i < this.snake.length; i++) {
            if (head.x === this.snake[i].x && head.y === this.snake[i].y) {
                return true;
            }
        }
        
        return false;
    }
    
    checkFood() {
        const head = this.snake[0];
        
        // Verificar todas las frutas
        for (let i = this.foods.length - 1; i >= 0; i--) {
            const food = this.foods[i];
            if (head.x === food.x && head.y === food.y) {
                // Comer comida
                this.snakeLength++;
                this.score += 10;
                
                // Remover la fruta comida
                this.foods.splice(i, 1);
                
                // Verificar si sube de nivel
                if (this.score % 50 === 0) {
                    this.levelUp();
                }
                
                // Actualizar display
                this.updateScoreDisplay();
                break;
            }
        }
    }
    
    maintainFoodCount() {
        // Mantener siempre el número máximo de frutas
        while (this.foods.length < this.maxFoods) {
            this.foods.push(this.generateFood());
        }
    }
    
    generateInitialFoods() {
        // Generar frutas iniciales
        for (let i = 0; i < this.maxFoods; i++) {
            this.foods.push(this.generateFood());
        }
    }
    
    levelUp() {
        this.level++;
        this.speed = Math.min(this.speed + 0.2, 3); // Máximo 3x velocidad
        
        // Aumentar el número máximo de frutas cada 2 niveles
        if (this.level % 2 === 0 && this.maxFoods < 5) {
            this.maxFoods++;
        }
        
        // Efecto visual de level up
        this.showLevelUpEffect();
    }
    
    showLevelUpEffect() {
        // Cambiar color del canvas temporalmente
        this.ctx.fillStyle = '#00ff88';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Mostrar texto de level up
        this.ctx.fillStyle = '#1a1a2e';
        this.ctx.font = 'bold 30px Orbitron';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(`¡NIVEL ${this.level}!`, this.canvas.width / 2, this.canvas.height / 2);
        
        // Restaurar después de 500ms
        setTimeout(() => {
            this.draw();
        }, 500);
    }
    
    generateFood() {
        let newFood;
        let validPosition = false;
        let attempts = 0;
        const maxAttempts = 100;
        
        while (!validPosition && attempts < maxAttempts) {
            newFood = {
                x: Math.floor(Math.random() * this.tileCount),
                y: Math.floor(Math.random() * this.tileCount)
            };
            
            validPosition = true;
            
            // Verificar que no esté en la serpiente
            for (let segment of this.snake) {
                if (segment.x === newFood.x && segment.y === newFood.y) {
                    validPosition = false;
                    break;
                }
            }
            
            // Verificar que no esté en otra fruta
            if (validPosition) {
                for (let food of this.foods) {
                    if (food.x === newFood.x && food.y === newFood.y) {
                        validPosition = false;
                        break;
                    }
                }
            }
            
            attempts++;
        }
        
        // Si no se encontró posición válida, usar una posición aleatoria
        if (!validPosition) {
            newFood = {
                x: Math.floor(Math.random() * this.tileCount),
                y: Math.floor(Math.random() * this.tileCount)
            };
        }
        
        return newFood;
    }
    
    draw() {
        // Limpiar canvas
        this.ctx.fillStyle = '#1a1a2e';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Dibujar grid (opcional)
        this.drawGrid();
        
        // Dibujar serpiente
        this.drawSnake();
        
        // Dibujar todas las frutas
        this.drawFoods();
    }
    
    drawGrid() {
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        this.ctx.lineWidth = 1;
        
        for (let i = 0; i <= this.tileCount; i++) {
            // Líneas verticales
            this.ctx.beginPath();
            this.ctx.moveTo(i * this.gridSize, 0);
            this.ctx.lineTo(i * this.gridSize, this.canvas.height);
            this.ctx.stroke();
            
            // Líneas horizontales
            this.ctx.beginPath();
            this.ctx.moveTo(0, i * this.gridSize);
            this.ctx.lineTo(this.canvas.width, i * this.gridSize);
            this.ctx.stroke();
        }
    }
    
    drawSnake() {
        this.snake.forEach((segment, index) => {
            if (index === 0) {
                // Cabeza
                this.ctx.fillStyle = '#00ff88';
                this.ctx.fillRect(
                    segment.x * this.gridSize + 2,
                    segment.y * this.gridSize + 2,
                    this.gridSize - 4,
                    this.gridSize - 4
                );
                
                // Ojos
                this.ctx.fillStyle = '#1a1a2e';
                this.ctx.fillRect(
                    segment.x * this.gridSize + 6,
                    segment.y * this.gridSize + 6,
                    3,
                    3
                );
                this.ctx.fillRect(
                    segment.x * this.gridSize + 11,
                    segment.y * this.gridSize + 6,
                    3,
                    3
                );
            } else {
                // Cuerpo
                const alpha = 1 - (index * 0.1);
                this.ctx.fillStyle = `rgba(0, 255, 136, ${Math.max(alpha, 0.3)})`;
                this.ctx.fillRect(
                    segment.x * this.gridSize + 1,
                    segment.y * this.gridSize + 1,
                    this.gridSize - 2,
                    this.gridSize - 2
                );
            }
        });
    }
    
    drawFoods() {
        // Dibujar todas las frutas con diferentes colores
        const foodColors = ['#ff6b35', '#ffd23f', '#2ed573', '#ff4757', '#a55eea'];
        
        this.foods.forEach((food, index) => {
            const colorIndex = index % foodColors.length;
            const color = foodColors[colorIndex];
            
            // Manzana
            this.ctx.fillStyle = color;
            this.ctx.beginPath();
            this.ctx.arc(
                food.x * this.gridSize + this.gridSize / 2,
                food.y * this.gridSize + this.gridSize / 2,
                this.gridSize / 2 - 2,
                0,
                2 * Math.PI
            );
            this.ctx.fill();
            
            // Tallo
            this.ctx.fillStyle = '#2ed573';
            this.ctx.fillRect(
                food.x * this.gridSize + this.gridSize / 2 - 1,
                food.y * this.gridSize + 2,
                2,
                4
            );
            
            // Efecto de brillo
            this.ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
            this.ctx.beginPath();
            this.ctx.arc(
                food.x * this.gridSize + this.gridSize / 2 - 2,
                food.y * this.gridSize + this.gridSize / 2 - 2,
                3,
                0,
                2 * Math.PI
            );
            this.ctx.fill();
        });
    }
    
    endGame() {
        this.gameRunning = false;
        
        // Verificar si es nuevo récord
        if (this.score > this.highScore) {
            this.highScore = this.score;
            this.saveHighScore(this.highScore);
        }
        
        // Actualizar overlay de game over
        this.finalScoreElement.textContent = this.score;
        this.finalHighScoreElement.textContent = this.highScore;
        
        // Mostrar overlay de game over
        this.gameOverOverlay.style.display = 'flex';
    }
    
    restartGame() {
        this.gameOverOverlay.style.display = 'none';
        this.startGame();
    }
    
    goToMenu() {
        window.location.href = '../matias-index.html';
    }
    
    showStartOverlay() {
        this.startOverlay.style.display = 'flex';
    }
    
    hideStartOverlay() {
        this.startOverlay.style.display = 'none';
    }
    
    updateScoreDisplay() {
        this.currentScoreElement.textContent = this.score;
        this.highScoreElement.textContent = this.highScore;
        this.currentLevelElement.textContent = this.level;
        this.currentSpeedElement.textContent = this.speed.toFixed(1) + 'x';
    }
    
    saveHighScore(score) {
        localStorage.setItem('snakeHighScore', score.toString());
    }
    
    loadHighScore() {
        const saved = localStorage.getItem('snakeHighScore');
        return saved ? parseInt(saved) : 0;
    }
}

// Inicializar el juego cuando se cargue la página
document.addEventListener('DOMContentLoaded', () => {
    new SnakeGame();
});
