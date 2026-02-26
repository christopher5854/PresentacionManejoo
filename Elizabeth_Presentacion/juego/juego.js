const tablero = document.getElementById("tablero");
const movimientosTexto = document.getElementById("movimientos");
const resetBtn = document.getElementById("resetBtn");

let cartas = ["👑", "📚", "💻", "💃", "🍌", "✨"];
let baraja = [...cartas, ...cartas]; // duplicamos para hacer parejas
let cartasVolteadas = [];
let bloqueo = false;
let movimientos = 0;

// Función para barajar
function mezclar(array) {
  return array.sort(() => Math.random() - 0.5);
}

// Crear el tablero
function crearTablero() {
  tablero.innerHTML = "";
  baraja = mezclar(baraja);
  baraja.forEach((icono, index) => {
    const carta = document.createElement("div");
    carta.classList.add("carta");
    carta.dataset.icono = icono;
    carta.dataset.index = index;
    carta.textContent = icono;
    carta.addEventListener("click", voltearCarta);
    tablero.appendChild(carta);
  });
}

// Voltear carta
function voltearCarta() {
  if (bloqueo) return;
  if (this.classList.contains("volteada")) return;

  this.classList.add("volteada");
  cartasVolteadas.push(this);

  if (cartasVolteadas.length === 2) {
    verificarPareja();
  }
}

// Verificar si son pareja
function verificarPareja() {
  bloqueo = true;
  movimientos++;
  movimientosTexto.textContent = "Movimientos: " + movimientos;

  const [carta1, carta2] = cartasVolteadas;
  if (carta1.dataset.icono === carta2.dataset.icono) {
    cartasVolteadas = [];
    bloqueo = false;

    // Verificar si ganó
    const todasVolteadas = document.querySelectorAll(".carta.volteada");
    if (todasVolteadas.length === baraja.length) {
      setTimeout(() => {
        alert("🎉 ¡Ganaste en " + movimientos + " movimientos! 👑");
      }, 500);
    }
  } else {
    setTimeout(() => {
      carta1.classList.remove("volteada");
      carta2.classList.remove("volteada");
      cartasVolteadas = [];
      bloqueo = false;
    }, 1000);
  }
}

// Reiniciar juego
function reiniciarJuego() {
  movimientos = 0;
  movimientosTexto.textContent = "Movimientos: 0";
  cartasVolteadas = [];
  bloqueo = false;
  baraja = [...cartas, ...cartas];
  crearTablero();
}

// Eventos
resetBtn.addEventListener("click", reiniciarJuego);

// Iniciar
crearTablero();
