// sonnia.js - Lógica Galáctica Completa
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

// --- SECCIÓN 1: SELECTOR DE FACCIÓN ---
const jediBtn = $("#btn-luminoso");
const sabaccBtn = $("#btn-sabacc");
const sithBtn = $("#btn-imperio");

const gameBtns = [jediBtn, sabaccBtn, sithBtn];

const changeFaction = (activeBtn, factionClass) => {
    gameBtns.forEach(btn => {
        if (btn) btn.classList.remove('active');
    });
    if (activeBtn) activeBtn.classList.add('active');
    document.body.className = '';
    document.body.classList.add(factionClass);
};

jediBtn?.addEventListener('click', () => changeFaction(jediBtn, 'theme-jedi'));
sabaccBtn?.addEventListener('click', () => changeFaction(sabaccBtn, 'theme-sabacc'));
sithBtn?.addEventListener('click', () => changeFaction(sithBtn, 'theme-sith'));


// --- SECCIÓN 2: LÓGICA DEL JUEGO ---
let chips = 90;
let currentBet = 0;
let playerHand = [];
let dealerHand = [];
let deck = [];
let gameInProgress = false;

// Elementos del DOM
const chipsDisplay = $('#chips-count');
const betDisplay = $('#bet-amount');
const resultMessage = $('#result-message');
const playerArea = $('#player-cards');
const dealerArea = $('#dealer-cards');

// Suits galácticos
const suits = ["🌌", "⚔️", "🛰️", "🛸"];
const values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];

function createDeck() {
    const newDeck = [];
    suits.forEach(s => values.forEach(v => newDeck.push({ v, s })));
    return newDeck.sort(() => Math.random() - 0.5);
}

function getCardValue(card) {
    if (card.v === "A") return 11;
    return ["J", "Q", "K"].includes(card.v) ? 10 : parseInt(card.v);
}

function calculateHand(hand) {
    let total = 0, aces = 0;
    hand.forEach(c => {
        let v = getCardValue(c);
        if (v === 11) aces++;
        total += v;
    });
    while (total > 21 && aces > 0) { total -= 10; aces--; }
    return total;
}

function updateUI() {
    if (chipsDisplay) chipsDisplay.textContent = chips;
    if (betDisplay) betDisplay.textContent = currentBet;
}

function render(showDealer = false) {
    if (!playerArea || !dealerArea) return;
    playerArea.innerHTML = '';
    dealerArea.innerHTML = '';

    playerHand.forEach(c => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `<div>${c.v}</div><div style="font-size:0.8rem">${c.s}</div>`;
        playerArea.appendChild(card);
    });

    dealerHand.forEach((c, i) => {
        const card = document.createElement('div');
        card.className = (i === 1 && !showDealer) ? 'card back' : 'card';
        if (i === 0 || showDealer) {
            card.innerHTML = `<div>${c.v}</div><div style="font-size:0.8rem">${c.s}</div>`;
        }
        dealerArea.appendChild(card);
    });

    const playerScoreEl = $('#player-score');
    if (playerScoreEl) playerScoreEl.textContent = `Poder: ${calculateHand(playerHand)}`;
}

function endGame() {
    gameInProgress = false;
    const dealBtn = $('#deal-button');
    const hitBtn = $('#hit-button');
    const standBtn = $('#stand-button');
    if (dealBtn) dealBtn.disabled = false;
    if (hitBtn) hitBtn.disabled = true;
    if (standBtn) standBtn.disabled = true;
    currentBet = 0;
    updateUI();
}

function showMessage(msg) {
    if (resultMessage) resultMessage.textContent = msg;
}


// --- SECCIÓN 3: BOTONES DE ACCIÓN DEL JUEGO ---

// Repartir
$('#deal-button')?.addEventListener('click', () => {
    if (currentBet <= 0) {
        showMessage("¡DEBES APOSTAR CRÉDITOS!");
        return;
    }
    if (currentBet > chips) {
        showMessage("¡SIN CRÉDITOS SUFICIENTES!");
        return;
    }

    chips -= currentBet;
    deck = createDeck();
    playerHand = [deck.pop(), deck.pop()];
    dealerHand = [deck.pop(), deck.pop()];
    gameInProgress = true;

    $('#deal-button').disabled = true;
    $('#hit-button').disabled = false;
    $('#stand-button').disabled = false;
    showMessage("");
    render();
    updateUI();
});

// Pedir carta
$('#hit-button')?.addEventListener('click', () => {
    if (!gameInProgress) return;
    playerHand.push(deck.pop());
    render();
    if (calculateHand(playerHand) > 21) {
        showMessage("💀 SOBRECARGA — EL IMPERIO GANA");
        endGame();
    }
});

// Plantarse
$('#stand-button')?.addEventListener('click', () => {
    if (!gameInProgress) return;

    while (calculateHand(dealerHand) < 17) dealerHand.push(deck.pop());
    render(true);

    const p = calculateHand(playerHand);
    const d = calculateHand(dealerHand);
    const dealerScoreEl = $('#dealer-score');
    if (dealerScoreEl) dealerScoreEl.textContent = `Poder: ${d}`;

    if (d > 21 || p > d) {
        showMessage("⚡ VICTORIA PARA LA ALIANZA");
        chips += currentBet * 2;
    } else if (p < d) {
        showMessage("☠ EL IMPERIO PREVALECE");
    } else {
        showMessage("⚖ EQUILIBRIO EN LA FUERZA");
        chips += currentBet;
    }

    endGame();
});

// Reiniciar juego completo
$('#restart-button')?.addEventListener('click', () => {
    chips = 90;
    currentBet = 0;
    playerHand = [];
    dealerHand = [];
    gameInProgress = false;

    if (playerArea) playerArea.innerHTML = '';
    if (dealerArea) dealerArea.innerHTML = '';

    const playerScoreEl = $('#player-score');
    const dealerScoreEl = $('#dealer-score');
    if (playerScoreEl) playerScoreEl.textContent = '';
    if (dealerScoreEl) dealerScoreEl.textContent = '';

    showMessage('');

    const dealBtn = $('#deal-button');
    const hitBtn = $('#hit-button');
    const standBtn = $('#stand-button');
    if (dealBtn) dealBtn.disabled = false;
    if (hitBtn) hitBtn.disabled = true;
    if (standBtn) standBtn.disabled = true;

    updateUI();
});


// --- SECCIÓN 4: BOTONES DE FICHAS ---
$$('.chip-btn[data-value]').forEach(btn => {
    btn.addEventListener('click', () => {
        const value = parseInt(btn.dataset.value);

        if (gameInProgress) {
            showMessage("¡NO PUEDES APOSTAR DURANTE EL DUELO!");
            return;
        }

        if (chips >= currentBet + value) {
            currentBet += value;
            updateUI();
            // Efecto visual de pulso
            btn.style.background = 'var(--accent)';
            btn.style.color = '#000';
            btn.style.boxShadow = '0 0 25px var(--accent)';
            setTimeout(() => {
                btn.style.background = 'transparent';
                btn.style.color = 'var(--accent)';
                btn.style.boxShadow = '0 0 8px var(--accent)';
            }, 300);
        } else {
            showMessage("¡SIN CRÉDITOS SUFICIENTES!");
        }
    });
});


// --- SECCIÓN 5: MODAL ---
const modal = $("#blackjack-modal");

window.addEventListener("DOMContentLoaded", () => {
    updateUI();

    // Abrir modal
    $("#open-blackjack")?.addEventListener("click", () => {
        if (modal) modal.style.display = "flex";
    });

    // Cerrar modal con X
    $("#close-blackjack")?.addEventListener("click", () => {
        if (modal) modal.style.display = "none";
        // Reset suave al cerrar
        currentBet = 0;
        gameInProgress = false;
        if (playerArea) playerArea.innerHTML = '';
        if (dealerArea) dealerArea.innerHTML = '';
        const playerScoreEl = $('#player-score');
        const dealerScoreEl = $('#dealer-score');
        if (playerScoreEl) playerScoreEl.textContent = '';
        if (dealerScoreEl) dealerScoreEl.textContent = '';
        showMessage('');
        const dealBtn = $('#deal-button');
        const hitBtn = $('#hit-button');
        const standBtn = $('#stand-button');
        if (dealBtn) dealBtn.disabled = false;
        if (hitBtn) hitBtn.disabled = true;
        if (standBtn) standBtn.disabled = true;
        updateUI();
    });

    // Cerrar modal al hacer click fuera
    window.addEventListener("click", (e) => {
        if (e.target === modal) {
            modal.style.display = "none";
            currentBet = 0;
            updateUI();
        }
    });

    // Animación de barras de habilidades
    $$(".skill-fill").forEach(el => {
        const level = el.getAttribute("data-level") || "0%";
        el.style.width = level;
    });
});