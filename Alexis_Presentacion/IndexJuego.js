// ====== ESTADO ======
var board       = ['','','','','','','','',''];
var currentPlayer = 'X';
var gameActive  = true;
var mode        = 'pvp'; // 'pvp' o 'cpu'
var scoreX      = 0;
var scoreO      = 0;
var scoreTie    = 0;

// Combinaciones ganadoras
var winCombos = [
    [0,1,2],[3,4,5],[6,7,8], // filas
    [0,3,6],[1,4,7],[2,5,8], // columnas
    [0,4,8],[2,4,6]          // diagonales
];

// ====== CLICK EN CELDA ======
function handleClick(index) {
    if (!gameActive) return;
    if (board[index] !== '') return;
    if (mode === 'cpu' && currentPlayer === 'O') return;

    placeMove(index, currentPlayer);

    if (!gameActive) return;

    if (mode === 'cpu' && currentPlayer === 'O') {
        setTimeout(cpuMove, 400);
    }
}

function placeMove(index, player) {
    board[index] = player;

    var cells = document.querySelectorAll('.cell');
    cells[index].textContent = player;
    cells[index].classList.add('taken');
    cells[index].classList.add(player === 'X' ? 'x-cell' : 'o-cell');

    var result = checkWinner();

    if (result === 'win') {
        endGame(player, false);
    } else if (result === 'tie') {
        endGame(null, true);
    } else {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        updateTurnDisplay();
    }
}

// ====== CPU (minimax simple) ======
function cpuMove() {
    if (!gameActive) return;

    var best = bestMove();
    placeMove(best, 'O');
}

function bestMove() {
    // Intentar ganar
    for (var i = 0; i < 9; i++) {
        if (board[i] === '') {
            board[i] = 'O';
            if (checkWinFor('O')) { board[i] = ''; return i; }
            board[i] = '';
        }
    }
    // Bloquear al jugador
    for (var i = 0; i < 9; i++) {
        if (board[i] === '') {
            board[i] = 'X';
            if (checkWinFor('X')) { board[i] = ''; return i; }
            board[i] = '';
        }
    }
    // Centro
    if (board[4] === '') return 4;
    // Esquinas
    var corners = [0,2,6,8].filter(function(c){ return board[c] === ''; });
    if (corners.length > 0) return corners[Math.floor(Math.random() * corners.length)];
    // Cualquier libre
    var free = board.map(function(v,i){ return v===''?i:-1; }).filter(function(v){ return v>=0; });
    return free[Math.floor(Math.random() * free.length)];
}

function checkWinFor(player) {
    return winCombos.some(function(combo) {
        return combo.every(function(i){ return board[i] === player; });
    });
}

// ====== VERIFICAR GANADOR ======
function checkWinner() {
    for (var i = 0; i < winCombos.length; i++) {
        var combo = winCombos[i];
        if (board[combo[0]] !== '' &&
            board[combo[0]] === board[combo[1]] &&
            board[combo[1]] === board[combo[2]]) {

            // Marcar celdas ganadoras
            var cells = document.querySelectorAll('.cell');
            combo.forEach(function(idx){
                cells[idx].classList.add('win-cell');
            });
            return 'win';
        }
    }
    if (board.every(function(v){ return v !== ''; })) return 'tie';
    return null;
}

// ====== FIN DEL JUEGO ======
function endGame(winner, isTie) {
    gameActive = false;

    if (isTie) {
        scoreTie++;
        document.getElementById('scoreTie').textContent = scoreTie;
        document.getElementById('overlayTitle').textContent = '¡Empate!';
        document.getElementById('overlayMsg').textContent   = 'Nadie ganó esta vez...';
        document.getElementById('overlayTitle').style.color = '#fffa65';
    } else {
        if (winner === 'X') {
            scoreX++;
            document.getElementById('scoreX').textContent = scoreX;
        } else {
            scoreO++;
            document.getElementById('scoreO').textContent = scoreO;
        }
        document.getElementById('overlayTitle').textContent = '¡Ganó ' + winner + '!';
        document.getElementById('overlayMsg').textContent   =
            mode === 'cpu' && winner === 'O' ? '¡La CPU te venció! 🤖' : '¡Felicitaciones! 🎉';
        document.getElementById('overlayTitle').style.color = winner === 'X' ? '#2ed573' : '#ff4757';
    }

    setTimeout(function(){
        document.getElementById('gameOverlay').style.display = 'flex';
    }, 700);
}

// ====== TURNO DISPLAY ======
function updateTurnDisplay() {
    var el = document.getElementById('turnDisplay');
    if (mode === 'cpu' && currentPlayer === 'O') {
        el.textContent = 'Turno: CPU';
        el.className   = 'turn-display o';
    } else {
        el.textContent = 'Turno: ' + currentPlayer;
        el.className   = 'turn-display ' + currentPlayer.toLowerCase();
    }
}

// ====== RESET ======
function resetGame() {
    board         = ['','','','','','','','',''];
    currentPlayer = 'X';
    gameActive    = true;

    document.getElementById('gameOverlay').style.display = 'none';

    var cells = document.querySelectorAll('.cell');
    cells.forEach(function(cell) {
        cell.textContent = '';
        cell.className   = 'cell';
    });

    updateTurnDisplay();
}

// ====== MODO ======
function setMode(newMode) {
    mode = newMode;
    document.getElementById('btnPvP').classList.toggle('active', newMode === 'pvp');
    document.getElementById('btnCPU').classList.toggle('active', newMode === 'cpu');
    resetGame();
}

// ====== INICIO ======
updateTurnDisplay();