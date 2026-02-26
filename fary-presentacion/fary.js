// fary.js
// Utilidades
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

// Slogans aleatorios estilo casino
const slogans = [
  "Apostando el semestre",
  "El programa compila pero los bugs son más rápidos.",
  "Codifica, sufre y gana.",
  "Al Front no se le tiene miedo se le tiene respeto."
];

const sloganEl = $("#hero-slogan");
const changeSlogan = () => {
  const next = slogans[Math.floor(Math.random() * slogans.length)];
  sloganEl.textContent = next;
};

// Estado del juego Blackjack
let chips = 100;
let currentBet = 0;
let playerHand = [];
let dealerHand = [];
let gameInProgress = false;
let deck = [];

// Elementos del DOM para Blackjack
const chipsCountEl = $('#chips-count');
const betAmountEl = $('#bet-amount');
const dealerCardsEl = $('#dealer-cards');
const playerCardsEl = $('#player-cards');
const dealerScoreEl = $('#dealer-score');
const playerScoreEl = $('#player-score');
const resultMessageEl = $('#result-message');

const dealButton = $('#deal-button');
const hitButton = $('#hit-button');
const standButton = $('#stand-button');
const restartButton = $('#restart-button');
const chipButtons = $$('.chip-btn[data-value]');
const customChipInput = $('#custom-chip');
const customChipBtn = $('#custom-chip-btn');

// Suits y valores de cartas
const suits = ["♠️", "♥️", "♦️", "♣️"];
const values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];

// Inicializar baraja
function createDeck() {
  const deck = [];
  for (let suit of suits) {
    for (let value of values) {
      deck.push({ value, suit });
    }
  }
  return shuffleDeck(deck);
}

// Barajar baraja
function shuffleDeck(deck) {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

// Obtener valor de carta
function getCardValue(card) {
  if (card.value === "A") return 11;
  if (["J", "Q", "K"].includes(card.value)) return 10;
  return parseInt(card.value);
}

// Calcular valor de mano
function calculateHand(hand) {
  let total = 0;
  let aces = 0;
  
  for (let card of hand) {
    const value = getCardValue(card);
    if (value === 11) {
      aces++;
    }
    total += value;
  }
  
  // Ajustar valor de los ases si el total es mayor a 21
  while (total > 21 && aces > 0) {
    total -= 10;
    aces--;
  }
  
  return total;
}

// Crear elemento de carta
function createCardElement(card, isFaceDown = false) {
  const cardEl = document.createElement("div");
  cardEl.className = "card" + ((card.suit === "♥️" || card.suit === "♦️") ? " red" : "");
  
  if (isFaceDown) {
    cardEl.classList.add("back");
    cardEl.innerHTML = "";
  } else {
    // Formato más estilizado para las cartas
    cardEl.innerHTML = `
      <div class="card-value">${card.value}</div>
      <div class="card-suit">${card.suit}</div>
    `;
  }
  
  cardEl.dataset.value = getCardValue(card);
  return cardEl;
}

// Actualizar visualización de fichas y apuesta
function updateChipsDisplay() {
  chipsCountEl.textContent = chips;
  betAmountEl.textContent = currentBet;
}

// Mostrar mensaje de resultado
function showResultMessage(message, type) {
  resultMessageEl.textContent = message;
  resultMessageEl.className = `result-message ${type} show`;
  
  // Ocultar mensaje después de 3 segundos
  setTimeout(() => {
    resultMessageEl.classList.remove('show');
  }, 3000);
}

// Reiniciar juego completo (fichas a 100)
function fullResetGame() {
  chips = 100;
  currentBet = 0;
  updateChipsDisplay();
  resetRound();
  showResultMessage("¡Juego reiniciado! Fichas restauradas a 100", "push");
}

// Reiniciar ronda (pero mantener fichas)
function resetRound() {
  playerHand = [];
  dealerHand = [];
  gameInProgress = false;
  
  dealerCardsEl.innerHTML = '';
  playerCardsEl.innerHTML = '';
  dealerScoreEl.textContent = '';
  playerScoreEl.textContent = '';
  resultMessageEl.classList.remove('show');
  
  currentBet = 0;
  updateChipsDisplay();
  
  hitButton.disabled = true;
  standButton.disabled = true;
  dealButton.disabled = false;
}

// Iniciar nuevo juego
function startGame() {
  if (currentBet === 0) {
    showResultMessage("¡Primero haz una apuesta!", "lose");
    return;
  }
  
  if (currentBet > chips) {
    showResultMessage("¡No tienes suficientes fichas!", "lose");
    return;
  }
  
  // Restar apuesta de fichas
  chips -= currentBet;
  updateChipsDisplay();
  
  // Crear nueva baraja si es necesario
  if (deck.length < 10) {
    deck = createDeck();
  }
  
  // Repartir cartas
  playerHand = [deck.pop(), deck.pop()];
  dealerHand = [deck.pop(), deck.pop()];
  
  // Mostrar cartas del jugador
  playerCardsEl.innerHTML = '';
  playerHand.forEach((card, index) => {
    const cardEl = createCardElement(card);
    playerCardsEl.appendChild(cardEl);
    setTimeout(() => {
      cardEl.classList.add("flip");
      if (index === playerHand.length - 1) {
        const playerScore = calculateHand(playerHand);
        playerScoreEl.textContent = `Puntuación: ${playerScore}`;
      }
    }, 100 * index);
  });
  
  // Mostrar cartas de la casa (una boca abajo)
  dealerCardsEl.innerHTML = '';
  const dealerFirstCard = createCardElement(dealerHand[0]);
  dealerCardsEl.appendChild(dealerFirstCard);
  setTimeout(() => dealerFirstCard.classList.add("flip"), 100);
  
  const dealerSecondCard = createCardElement(dealerHand[1], true);
  dealerCardsEl.appendChild(dealerSecondCard);
  
  // Verificar blackjack
  const playerScore = calculateHand(playerHand);
  const dealerScore = calculateHand(dealerHand);
  
  if (playerScore === 21) {
    // Revelar carta de la casa
    setTimeout(() => {
      dealerSecondCard.classList.remove("back");
      dealerSecondCard.innerHTML = `
        <div class="card-value">${dealerHand[1].value}</div>
        <div class="card-suit">${dealerHand[1].suit}</div>
      `;
      dealerSecondCard.dataset.value = getCardValue(dealerHand[1]);
      
      const dealerScore = calculateHand(dealerHand);
      dealerScoreEl.textContent = `Puntuación: ${dealerScore}`;
      
      if (dealerScore === 21) {
        // Push - ambos tienen blackjack
        chips += currentBet; // Devolver apuesta
        updateChipsDisplay();
        showResultMessage("¡EMPATE! Ambos tienen Blackjack", "push");
      } else {
        // Jugador gana con blackjack
        const winAmount = Math.floor(currentBet * 2.5);
        chips += winAmount;
        updateChipsDisplay();
        showResultMessage(`¡BLACKJACK! Ganaste ${winAmount} fichas`, "win");
      }
      
      resetRound();
    }, 800);
    return;
  }
  
  gameInProgress = true;
  hitButton.disabled = false;
  standButton.disabled = false;
  dealButton.disabled = true;
}

// Turno del jugador - Pedir carta
function hit() {
  if (!gameInProgress) return;
  
  const newCard = deck.pop();
  playerHand.push(newCard);
  
  const cardEl = createCardElement(newCard);
  playerCardsEl.appendChild(cardEl);
  
  // Animación secuencial
  setTimeout(() => {
    cardEl.classList.add("flip");
    const playerScore = calculateHand(playerHand);
    playerScoreEl.textContent = `Puntuación: ${playerScore}`;
    
    // Verificar si el jugador llegó a 21 o se pasó
    if (playerScore === 21) {
      showResultMessage("¡Exactamente 21! Ganaste", "win");
      chips += currentBet * 2; // Ganar apuesta
      updateChipsDisplay();
      setTimeout(resetRound, 1500);
    } else if (playerScore > 21) {
      showResultMessage("¡Te pasaste! Pierdes tu apuesta", "lose");
      setTimeout(resetRound, 1500);
    }
  }, 100);
}

// Turno del jugador - Plantarse
function stand() {
  if (!gameInProgress) return;
  
  gameInProgress = false;
  hitButton.disabled = true;
  standButton.disabled = true;
  
  // Revelar carta de la casa
  const dealerCards = dealerCardsEl.querySelectorAll('.card');
  dealerCards[1].classList.remove("back");
  dealerCards[1].innerHTML = `
    <div class="card-value">${dealerHand[1].value}</div>
    <div class="card-suit">${dealerHand[1].suit}</div>
  `;
  dealerCards[1].dataset.value = getCardValue(dealerHand[1]);
  
  let dealerScore = calculateHand(dealerHand);
  dealerScoreEl.textContent = `Puntuación: ${dealerScore}`;
  
  // Turno de la casa - pedir hasta tener al menos 17
  const playDealer = () => {
    if (dealerScore < 17) {
      setTimeout(() => {
        const newCard = deck.pop();
        dealerHand.push(newCard);
        
        const cardEl = createCardElement(newCard);
        dealerCardsEl.appendChild(cardEl);
        
        setTimeout(() => {
          cardEl.classList.add("flip");
          dealerScore = calculateHand(dealerHand);
          dealerScoreEl.textContent = `Puntuación: ${dealerScore}`;
          
          playDealer();
        }, 300);
      }, 800);
    } else {
      // Determinar ganador
      const playerScore = calculateHand(playerHand);
      
      if (dealerScore > 21) {
        chips += currentBet * 2; // Ganar apuesta
        updateChipsDisplay();
        showResultMessage("¡La casa se pasó! Ganaste", "win");
      } else if (playerScore > dealerScore) {
        chips += currentBet * 2; // Ganar apuesta
        updateChipsDisplay();
        showResultMessage(`¡Ganaste! ${playerScore} vs ${dealerScore}`, "win");
      } else if (playerScore < dealerScore) {
        showResultMessage(`La casa gana ${dealerScore} vs ${playerScore}`, "lose");
      } else {
        chips += currentBet; // Push - devolver apuesta
        updateChipsDisplay();
        showResultMessage("¡EMPATE!", "push");
      }
      
      setTimeout(resetRound, 2500);
    }
  };
  
  playDealer();
}

// Botones de apuesta
chipButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const value = parseInt(btn.dataset.value);
    if (chips >= currentBet + value) {
      currentBet += value;
      updateChipsDisplay();
      btn.classList.add('pulse');
      setTimeout(() => btn.classList.remove('pulse'), 600);
    } else {
      showResultMessage("¡No tienes suficientes fichas!", "lose");
    }
  });
});

// Apuesta personalizada
customChipBtn.addEventListener('click', () => {
  const value = parseInt(customChipInput.value) || 0;
  if (value > 0 && chips >= currentBet + value) {
    currentBet += value;
    updateChipsDisplay();
    customChipInput.value = '';
    customChipBtn.classList.add('pulse');
    setTimeout(() => customChipBtn.classList.remove('pulse'), 600);
  } else if (value <= 0) {
    showResultMessage("Ingresa un valor válido", "lose");
  } else {
    showResultMessage("¡No tienes suficientes fichas!", "lose");
  }
});

// Teclado
document.addEventListener('keydown', (e) => {
  if (e.key === ' ' && !e.ctrlKey && !e.altKey && !e.shiftKey) {
    e.preventDefault();
    if (dealButton.disabled === false) {
      startGame();
    }
  } else if (e.key.toLowerCase() === 'h') {
    hit();
  } else if (e.key.toLowerCase() === 'p') {
    stand();
  }
});

// Inicialización
window.addEventListener("DOMContentLoaded", () => {
  // Crear baraja inicial
  deck = createDeck();
  
  // Actualizar display inicial
  updateChipsDisplay();
  
  // slogan inicial aleatorio
  changeSlogan();

  // botones de juego
  const gameButtons = $$(".game-btn");
  const changeGameType = (gameType) => {
    // Eliminar todas las clases de juego
    document.body.className = '';
    
    // Añadir la clase del juego seleccionado
    if (gameType !== 'texas') {
      document.body.classList.add(`game-${gameType}`);
    } else {
      document.body.classList.add('game-texas');
    }
    
    // Actualizar botones activos
    gameButtons.forEach(btn => {
      btn.classList.remove('active');
      if (btn.dataset.game === gameType) {
        btn.classList.add('active');
      }
    });
  };

  gameButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      changeGameType(btn.dataset.game);
    });
  });

  // Botones principales del juego
  dealButton?.addEventListener("click", startGame);
  hitButton?.addEventListener("click", hit);
  standButton?.addEventListener("click", stand);
  restartButton?.addEventListener("click", fullResetGame);
  $("#slogan-button")?.addEventListener("click", changeSlogan);

  // Barras de habilidades que se llenan al hacer scroll
  function animateSkillBars(){
    $$(".skill-fill").forEach(el => {
      const level = el.getAttribute("data-level") || "0%";
      // solo si aún no se llenó
      if (el.style.width !== level){
        el.style.width = level;
      }
    });
  }

  // Observer para disparar la animación de barras cuando entren en viewport
  const barsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        animateSkillBars();
        // una vez animado, dejar de observar
        barsObserver.disconnect();
      }
    });
  }, { threshold: 0.25 });

  // observar una barra de ejemplo (todas viven en el mismo bloque)
  const firstBar = $(".skill-fill");
  if (firstBar) barsObserver.observe(firstBar);
});     
// --- Modal Blackjack ---
const blackjackModal = $("#blackjack-modal");
const openBlackjackBtn = $("#open-blackjack");
const closeBlackjackBtn = $("#close-blackjack");

openBlackjackBtn?.addEventListener("click", () => {
  blackjackModal.style.display = "flex";
});

closeBlackjackBtn?.addEventListener("click", () => {
  blackjackModal.style.display = "none";
  resetRound(); // reset al cerrar
});

// Cerrar modal al hacer clic fuera del contenido
window.addEventListener("click", (e) => {
  if (e.target === blackjackModal) {
    blackjackModal.style.display = "none";
    resetRound();
  }
});