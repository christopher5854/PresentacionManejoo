
        const canvas = document.getElementById('tetris');
        const ctx = canvas.getContext('2d');
        const nextCanvas = document.getElementById('next-canvas');
        const nextCtx = nextCanvas.getContext('2d');

        const COLS = 10;
        const ROWS = 20;
        const BLOCK_SIZE = 30;

        // Colores de las piezas
        const COLORS = {
            0: '#000000',
            1: '#FF0000', // I
            2: '#00FF00', // O
            3: '#0000FF', // T
            4: '#FFFF00', // S
            5: '#FF00FF', // Z
            6: '#00FFFF', // J
            7: '#FFA500'  // L
        };

        // Definición de piezas Tetris
        const PIECES = {
            I: {
                shape: [
                    [0,0,0,0],
                    [1,1,1,1],
                    [0,0,0,0],
                    [0,0,0,0]
                ],
                color: 1
            },
            O: {
                shape: [
                    [2,2],
                    [2,2]
                ],
                color: 2
            },
            T: {
                shape: [
                    [0,3,0],
                    [3,3,3],
                    [0,0,0]
                ],
                color: 3
            },
            S: {
                shape: [
                    [0,4,4],
                    [4,4,0],
                    [0,0,0]
                ],
                color: 4
            },
            Z: {
                shape: [
                    [5,5,0],
                    [0,5,5],
                    [0,0,0]
                ],
                color: 5
            },
            J: {
                shape: [
                    [6,0,0],
                    [6,6,6],
                    [0,0,0]
                ],
                color: 6
            },
            L: {
                shape: [
                    [0,0,7],
                    [7,7,7],
                    [0,0,0]
                ],
                color: 7
            }
        };

        const PIECE_NAMES = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];

        let board = [];
        let currentPiece = null;
        let nextPiece = null;
        let score = 0;
        let level = 1;
        let lines = 0;
        let dropTime = 0;
        let dropInterval = 1000;
        let gameRunning = true;
        let isPaused = false;

        // Inicializar el tablero
        function initBoard() {
            board = [];
            for (let r = 0; r < ROWS; r++) {
                board[r] = [];
                for (let c = 0; c < COLS; c++) {
                    board[r][c] = 0;
                }
            }
        }

        // Dibujar un bloque
        function drawBlock(ctx, x, y, color) {
            ctx.fillStyle = COLORS[color];
            ctx.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
            ctx.strokeStyle = '#333';
            ctx.strokeRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
        }

        // Dibujar el tablero
        function drawBoard() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (let r = 0; r < ROWS; r++) {
                for (let c = 0; c < COLS; c++) {
                    if (board[r][c] > 0) {
                        drawBlock(ctx, c, r, board[r][c]);
                    }
                }
            }
        }

        // Dibujar la pieza actual
        function drawPiece(piece) {
            for (let r = 0; r < piece.shape.length; r++) {
                for (let c = 0; c < piece.shape[r].length; c++) {
                    if (piece.shape[r][c] > 0) {
                        drawBlock(ctx, piece.x + c, piece.y + r, piece.color);
                    }
                }
            }
        }

        // Dibujar la siguiente pieza
        function drawNextPiece() {
            nextCtx.clearRect(0, 0, nextCanvas.width, nextCanvas.height);
            if (nextPiece) {
                const offsetX = (4 - nextPiece.shape[0].length) / 2;
                const offsetY = (4 - nextPiece.shape.length) / 2;
                
                for (let r = 0; r < nextPiece.shape.length; r++) {
                    for (let c = 0; c < nextPiece.shape[r].length; c++) {
                        if (nextPiece.shape[r][c] > 0) {
                            nextCtx.fillStyle = COLORS[nextPiece.color];
                            nextCtx.fillRect((offsetX + c) * 30, (offsetY + r) * 30, 30, 30);
                            nextCtx.strokeStyle = '#333';
                            nextCtx.strokeRect((offsetX + c) * 30, (offsetY + r) * 30, 30, 30);
                        }
                    }
                }
            }
        }

        // Crear una nueva pieza
        function createPiece() {
            const pieceName = PIECE_NAMES[Math.floor(Math.random() * PIECE_NAMES.length)];
            const piece = JSON.parse(JSON.stringify(PIECES[pieceName]));
            piece.x = Math.floor(COLS / 2) - Math.floor(piece.shape[0].length / 2);
            piece.y = 0;
            return piece;
        }

        // Verificar colisión
        function isValidMove(piece, dx, dy) {
            for (let r = 0; r < piece.shape.length; r++) {
                for (let c = 0; c < piece.shape[r].length; c++) {
                    if (piece.shape[r][c] > 0) {
                        const newX = piece.x + c + dx;
                        const newY = piece.y + r + dy;
                        
                        if (newX < 0 || newX >= COLS || newY >= ROWS) {
                            return false;
                        }
                        
                        if (newY >= 0 && board[newY][newX] > 0) {
                            return false;
                        }
                    }
                }
            }
            return true;
        }

        // Rotar pieza
        function rotatePiece(piece) {
            const rotated = JSON.parse(JSON.stringify(piece));
            const size = rotated.shape.length;
            
            for (let r = 0; r < size; r++) {
                for (let c = 0; c < size; c++) {
                    rotated.shape[r][c] = piece.shape[size - 1 - c][r];
                }
            }
            
            if (isValidMove(rotated, 0, 0)) {
                return rotated;
            }
            return piece;
        }

        // Fijar pieza al tablero
        function placePiece(piece) {
            for (let r = 0; r < piece.shape.length; r++) {
                for (let c = 0; c < piece.shape[r].length; c++) {
                    if (piece.shape[r][c] > 0) {
                        const boardY = piece.y + r;
                        const boardX = piece.x + c;
                        if (boardY >= 0) {
                            board[boardY][boardX] = piece.color;
                        }
                    }
                }
            }
        }

        // Limpiar líneas completas
        function clearLines() {
            let linesCleared = 0;
            
            for (let r = ROWS - 1; r >= 0; r--) {
                let isComplete = true;
                for (let c = 0; c < COLS; c++) {
                    if (board[r][c] === 0) {
                        isComplete = false;
                        break;
                    }
                }
                
                if (isComplete) {
                    board.splice(r, 1);
                    board.unshift(new Array(COLS).fill(0));
                    linesCleared++;
                    r++; // Verificar la misma fila otra vez
                }
            }
            
            if (linesCleared > 0) {
                lines += linesCleared;
                score += linesCleared * 100 * level;
                level = Math.floor(lines / 10) + 1;
                dropInterval = Math.max(50, 1000 - (level - 1) * 50);
                updateScore();
            }
        }

        // Actualizar puntuación
        function updateScore() {
            document.getElementById('score').textContent = score;
            document.getElementById('level').textContent = level;
            document.getElementById('lines').textContent = lines;
        }

        // Verificar si el juego terminó
        function isGameOver() {
            return !isValidMove(currentPiece, 0, 0);
        }

        // Terminar juego
        function gameOver() {
            gameRunning = false;
            document.getElementById('final-score').textContent = `Puntuación Final: ${score}`;
            document.getElementById('game-over').style.display = 'flex';
        }

        // Reiniciar juego
        function restartGame() {
            initBoard();
            score = 0;
            level = 1;
            lines = 0;
            dropInterval = 1000;
            gameRunning = true;
            isPaused = false;
            currentPiece = createPiece();
            nextPiece = createPiece();
            updateScore();
            document.getElementById('game-over').style.display = 'none';
        }

        // Caída rápida
        function hardDrop() {
            while (isValidMove(currentPiece, 0, 1)) {
                currentPiece.y++;
                score += 2;
            }
            updateScore();
        }

        // Controles del teclado
        document.addEventListener('keydown', (e) => {
            if (!gameRunning) return;
            
            if (e.key === 'p' || e.key === 'P') {
                isPaused = !isPaused;
                return;
            }
            
            if (isPaused) return;
            
            switch(e.key) {
                case 'ArrowLeft':
                    if (isValidMove(currentPiece, -1, 0)) {
                        currentPiece.x--;
                    }
                    break;
                case 'ArrowRight':
                    if (isValidMove(currentPiece, 1, 0)) {
                        currentPiece.x++;
                    }
                    break;
                case 'ArrowDown':
                    if (isValidMove(currentPiece, 0, 1)) {
                        currentPiece.y++;
                        score += 1;
                        updateScore();
                    }
                    break;
                case 'ArrowUp':
                    currentPiece = rotatePiece(currentPiece);
                    break;
                case ' ':
                    hardDrop();
                    break;
            }
        });

        // Loop principal del juego
        function gameLoop(timestamp) {
            if (!gameRunning) return;
            
            if (!isPaused) {
                if (timestamp - dropTime > dropInterval) {
                    if (isValidMove(currentPiece, 0, 1)) {
                        currentPiece.y++;
                    } else {
                        placePiece(currentPiece);
                        clearLines();
                        currentPiece = nextPiece;
                        nextPiece = createPiece();
                        
                        if (isGameOver()) {
                            gameOver();
                            return;
                        }
                    }
                    dropTime = timestamp;
                }
                
                drawBoard();
                drawPiece(currentPiece);
                drawNextPiece();
            }
            
            requestAnimationFrame(gameLoop);
        }

        // Inicializar juego
        initBoard();
        currentPiece = createPiece();
        nextPiece = createPiece();
        updateScore();
        requestAnimatio