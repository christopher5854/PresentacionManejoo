// ===============================
// PRESENTACION PERSONAL GALACTICA
// ===============================


// ===== TEXTO ANIMADO =====

const titulo = document.querySelector("h1");

const texto = "🚀 Perfil Galáctico";

let i = 0;

titulo.textContent = "";

function escribir(){

if(i < texto.length){

titulo.textContent += texto[i];

i++;

setTimeout(escribir,80);

}

}

escribir();



// ===== EFECTO BRILLO =====

setInterval(()=>{

titulo.style.textShadow =
"0 0 10px cyan, 0 0 20px cyan, 0 0 40px #00ffff";

setTimeout(()=>{

titulo.style.textShadow =
"0 0 5px cyan";

},500);

},2000);



// ===== MENSAJE GALACTICO =====

console.log("⭐ Bienvenido al perfil galáctico ⭐");

console.log("Que la fuerza te acompañe 🚀");