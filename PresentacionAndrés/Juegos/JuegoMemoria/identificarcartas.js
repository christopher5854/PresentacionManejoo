const tablero = document.getElementById("tablero");
const movimientosTexto = document.getElementById("movimientos");
const resetBtn = document.getElementById("resetBtn");


let cartas = [

"🚀",
"🛸",
"🤖",
"⚔️",
"🌌",
"⭐"

];


let baraja = [...cartas,...cartas];

let cartasVolteadas=[];
let bloqueo=false;
let movimientos=0;



function mezclar(array){

return array.sort(()=>Math.random()-0.5);

}



function crearTablero(){

tablero.innerHTML="";

baraja=mezclar(baraja);

baraja.forEach((icono,index)=>{

const carta=document.createElement("div");

carta.classList.add("carta");

carta.dataset.icono=icono;

carta.textContent=icono;

carta.addEventListener("click",voltearCarta);

tablero.appendChild(carta);

});

}



function voltearCarta(){

if(bloqueo)return;

if(this.classList.contains("volteada"))return;

this.classList.add("volteada");

cartasVolteadas.push(this);



if(cartasVolteadas.length===2){

verificarPareja();

}

}



function verificarPareja(){

bloqueo=true;

movimientos++;

movimientosTexto.textContent="Movimientos: "+movimientos;



const [carta1,carta2]=cartasVolteadas;



if(carta1.dataset.icono===carta2.dataset.icono){

cartasVolteadas=[];

bloqueo=false;



const todas=document.querySelectorAll(".volteada");

if(todas.length===baraja.length){

setTimeout(()=>{

alert("🏆 ¡Victoria Galáctica!\nMovimientos: "+movimientos);

},500);

}

}

else{

setTimeout(()=>{

carta1.classList.remove("volteada");

carta2.classList.remove("volteada");

cartasVolteadas=[];

bloqueo=false;

},800);

}

}



function reiniciarJuego(){

movimientos=0;

movimientosTexto.textContent="Movimientos: 0";

cartasVolteadas=[];

bloqueo=false;

baraja=[...cartas,...cartas];

crearTablero();

}



resetBtn.addEventListener("click",reiniciarJuego);



crearTablero();