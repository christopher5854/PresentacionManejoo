// Archivo JS extraído de OnePiece.php para la lógica del juego de adivinar personajes de One Piece

// Character data with clues
const characters = [
    {
        id: "1",
        name: "Monkey D Luffy",
        clues: [
            "Este pirata tiene el mismo apellido que el héroe de la marina más grande",
            "Su abuelo intentó hacer de él un marine a golpes",
            "Perdió un hermano en la Guerra de Marineford",
            "Su fruta del diablo era custodiada por CP9",
            "Es inmune a los ataques eléctricos debido a su poder"
        ]
    },
    {
        id: "2",
        name: "Roronoa Zoro",
        clues: [
            "Prometió nunca perder una pelea después de una derrota contra un shichibukai",
            "Se sacrificó por su capitán ante el usuario de la Nikyu Nikyu no Mi",
            "Tiene una cicatriz que recorre todo su torso",
            "Entrenó con el ex-Shichibukai 'Mihawk'",
            "Usa 3 katanas xd"
        ]
    },
    {
        id: "3",
        name: "Nami",
        clues: [
            "Fue adoptada por una marine que odiaba a los piratas",
            "Robó mapas del Grand Line desde muy joven",
            "Su pueblo natal fue controlado por gyojins",
            "Su arma actual fue creada por un cyborg",
            "Puede predecir cambios climáticos con precisión sobrenatural"
        ]
    },
    {
        id: "4",
        name: "Usopp",
        clues: [
            "Su alter ego tiene una recompensa mayor que la suya",
            "Derrotó a un oficial de CP9 usando plantas",
            "Su madre murió esperando el regreso de un pirata",
            "Creó munición especial usando insectos gigantes",
            "Despertó el Haki de Observación en Dressrosa"
        ]
    },
    {
        id: "5",
        name: "Sanji",
        clues: [
            "Es el tercer hijo de una familia real del North Blue",
            "Fue modificado genéticamente pero el proceso 'falló'",
            "Trabajó en un restaurante flotante en el East Blue",
            "Su familia puede crear soldados artificiales",
            "Tiene hermanos que no sienten emociones"
        ]
    },
    {
        id: "6",
        name: "Tony-Tony Chopper",
        clues: [
            "Fue rechazado tanto por humanos como por su especie original",
            "Su mentor fue un ex-pirata conocido como 'doctor charlatán'",
            "No es un mapache",
            "Su forma Monster Point es incontrolable sin medicación",
            "Tiene la recompensa mas baja de su tripulación"
        ]
    },
    {
        id: "7",
        name: "Nico Robin",
        clues: [
            "Sobrevivió al Buster Call de su isla natal",
            "Fue criada por arqueólogos que estudiaban el Siglo Vacío",
            "Trabajó para Crocodile bajo un nombre código",
            "Es la única persona viva que puede leer textos antiguos",
            "Su madre murió tratando de proteger conocimiento prohibido"
        ]
    },
    {
        id: "8",
        name: "Franky",
        clues: [
            "Construyó barcos de guerra para el Gobierno Mundial siendo niño",
            "Se modificó a sí mismo usando metal de un barco marino",
            "Su mentor construyó el barco del Rey de los Piratas",
            "Funciona con cola como combustible",
            "Guardó los planos de un arma ancestral durante años"
        ]
    },
    {
        id: "9",
        name: "Brook",
        clues: [
            "Fue capitán de una banda musical pirata",
            "Prometió reunirse con una ballena después de dar la vuelta al mundo",
            "Estuvo vagando solo en el Triángulo Florian por décadas",
            "Su sombra fue robada por uno de los Shichibukai",
            "Puede separar su alma de su cuerpo esquelético"
        ]
    },
    {
        id: "10",
        name: "Jinbe",
        clues: [
            "Fue el capitán de los Piratas del Sol",
            "Protegió a Luffy durante su crisis mental post-guerra",
            "Renunció a su título de Shichibukai por sus principios",
            "Practicó Fish-Man Karate bajo el agua durante años",
            "Hizo un pacto de sangre con Big Mom que luego rompió"
        ]
    },
    {
        id: "290",
        name: "Portgas D Ace",
        clues: [
            "Su verdadero padre fue el anterior Rey de los Piratas",
            "Fue criado por bandidos de montaña",
            "Se convirtió en comandante de división a los 20 años",
            "Su fruta del diablo es de tipo Logia elemental",
            "Murió protegiendo a su hermano adoptivo"
        ]
    },
    {
        id: "54",
        name: "Trafalgar D Water Law",
        clues: [
            "Sobrevivió a la enfermedad del plomo blanco",
            "Fue salvado por un ex-marine que se convirtió en pirata",
            "Su fruta del diablo le permite realizar 'cirugías' sin tocar",
            "Lleva las iniciales de su salvador tatuadas en las manos",
            "Formó una alianza temporal con los Sombrero de Paja"
        ]
    },
    {
        id: "59",
        name: "Eustass Kid",
        clues: [
            "Perdió un brazo enfrentándose a uno de los Yonko",
            "Su fruta del diablo atrae y repele metales",
            "Tiene la misma recompensa inicial que el futuro Rey de los Piratas",
            "Formó una alianza con otros dos capitanes contra Big Mom",
            "Su tripulación fue diezmada por Kaido"
        ]
    },
    {
        id: "70",
        name: "Boa Hancock",
        clues: [
            "Fue esclava de los Dragones Celestiales en su juventud",
            "Es la emperatriz de una isla solo de mujeres",
            "Su belleza puede petrificar a sus enemigos",
            "Esconde una marca de esclavitud en su espalda",
            "Se enamoró del primer hombre inmune a sus poderes"
        ]
    },
    {
        id: "81",
        name: "Dracule Mihawk",
        clues: [
            "Es conocido como el espadachín más fuerte del mundo",
            "Vive solo en un castillo en ruinas",
            "Su espada negra es una de las 12 Saijo O Wazamono",
            "Entrenó al futuro espadachín más fuerte de los Sombrero de Paja",
            "Solía duelar regularmente con un Yonko pelirrojo"
        ]
    },
    {
        id: "82",
        name: "Crocodile",
        clues: [
            "Intentó apoderarse de un reino de Alabasta",
            "Perdió ante un novato en Alabasta",
            "Su mano izquierda fue reemplazada por un gancho dorado",
            "Puede crear y controlar arena a voluntad",
            "Ayudó a escapar de Impel Down junto a otros prisioneros"
        ]
    },
    {
        id: "365",
        name: "Donquixote Doflamingo",
        clues: [
            "Es un ex-Dragón Celestial que perdió su estatus",
            "Controlaba un reino desde las sombras usando hilos",
            "Mató a su propio padre y hermano",
            "Dirigía un imperio criminal desde Dressrosa",
            "Su fruta del diablo le permite controlar a las personas como marionetas"
        ]
    },
    {
        id: "97",
        name: "Charlotte Katakuri",
        clues: [
            "Nunca había perdido una pelea hasta enfrentar a Sombrero de Paja",
            "Puede ver unos segundos en el futuro",
            "Esconde su boca deformada detrás de una bufanda",
            "Es el hijo favorito de una Yonko",
            "Su cuerpo está hecho de un dulce pegajoso"
        ]
    },
    {
        id: "623",
        name: "Marco",
        clues: [
            "Fue la mano derecha del hombre más fuerte del mundo",
            "Sus llamas azules pueden curar heridas",
            "Participó en la Guerra de Marineford para salvar a un hermano",
            "Ahora protege la isla natal de su ex-capitán",
            "Su fruta Zoan es de tipo mitológico"
        ]
    },
    {
        id: "590",
        name: "Yamato",
        clues: [
            "Se considera el hijo de uno de los Yonko",
            "Fue encadenado a una isla durante 20 años",
            "Idolatra a un samurai que murió hace décadas",
            "Su fruta Zoan mitológica controla hielo y frío",
            "Ayudó a derrotar a su propio padre"
        ]
    }
];

let currentCharacter = null;
let currentClueIndex = 0;
let attempts = 0;

function normalizeName(name) {
    return name.toLowerCase()
        .replace(/\s*d\s+/gi, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

// Function to check if guess matches character name
function isCorrectGuess(guess, characterName) {
    const normalizedGuess = normalizeName(guess);
    const normalizedName = normalizeName(characterName);
    const guessParts = normalizedGuess.split(' ');
    const nameParts = normalizedName.split(' ');
    if (normalizedGuess === normalizedName) return true;
    for (let guessPart of guessParts) {
        if (guessPart.length >= 3) {
            for (let namePart of nameParts) {
                if (namePart === guessPart || namePart.includes(guessPart) || guessPart.includes(namePart)) {
                    if (guessPart.length >= 4 || namePart.length <= 5) {
                        return true;
                    }
                }
            }
        }
    }
    const lastName = nameParts[nameParts.length - 1];
    if (lastName && normalizedGuess === lastName && lastName.length >= 3) {
        return true;
    }
    const firstName = nameParts[0];
    if (firstName && normalizedGuess === firstName && firstName.length >= 3) {
        return true;
    }
    return false;
}

function getCharacterImage(id) {
    if (!id) return null;
    return `imagenes/Personajes/${id}.jpg`;
}

function getNewClue() {
    currentCharacter = characters[Math.floor(Math.random() * characters.length)];
    currentClueIndex = 0;
    attempts = 0;
    document.getElementById('character-guess').value = '';
    document.getElementById('character-guess').disabled = false;
    document.getElementById('submit-guess').disabled = false;
    document.getElementById('guess-feedback').innerHTML = '';
    showNextClue();
}

function showNextClue() {
    if (currentCharacter && currentClueIndex < currentCharacter.clues.length) {
        const clueText = `Pista ${currentClueIndex + 1}: ${currentCharacter.clues[currentClueIndex]}`;
        document.getElementById('character-clue').textContent = clueText;
        currentClueIndex++;
    } else {
        document.getElementById('character-clue').textContent = "No hay más pistas disponibles. ¡Última oportunidad!";
    }
}

function submitGuess() {
    const guess = document.getElementById('character-guess').value.trim();
    if (!guess) {
        document.getElementById('guess-feedback').innerHTML = `
            <div style="color: #ff4757; text-align: center;">
                <p>Por favor, escribe un nombre antes de adivinar.</p>
            </div>
        `;
        return;
    }
    attempts++;
    if (isCorrectGuess(guess, currentCharacter.name)) {
        let feedbackHTML = `
            <div style="color: #0e5c12ff; font-weight: bold; margin-bottom: 15px; font-size: 18px; text-align: center;">
                🎉 ¡CORRECTO! Es ${currentCharacter.name}
            </div>
        `;
        const imageUrl = getCharacterImage(currentCharacter.id);
        if (imageUrl) {
            feedbackHTML += `
                <div style="text-align: center; margin: 15px 0;">
                    <img src="${imageUrl}" alt="${currentCharacter.name}" 
                         style="max-width: 250px; max-height: 250px; border-radius: 15px; border: 3px solid #00ff88; box-shadow: 0 4px 8px rgba(0,255,136,0.3);"
                         onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
                    <div style="display: none; text-align: center; margin: 15px 0; padding: 20px; background: #333; border-radius: 15px; border: 2px solid #00ff88;">
                        <p style="color: #00ff88; font-size: 16px; margin: 0;">📸 ${currentCharacter.name}</p>
                        <p style="color: #888; font-size: 12px; margin: 5px 0 0 0;">(Imagen no encontrada)</p>
                    </div>
                </div>
            `;
        } else {
            feedbackHTML += `
                <div style="text-align: center; margin: 15px 0; padding: 20px; background: #333; border-radius: 15px; border: 2px solid #00ff88;">
                    <p style="color: #00ff88; font-size: 16px; margin: 0;">📸 Imagen de ${currentCharacter.name}</p>
                    <p style="color: #888; font-size: 12px; margin: 5px 0 0 0;">(ID no configurado)</p>
                </div>
            `;
        }
        feedbackHTML += `
            <div style="margin-top: 15px; text-align: center; padding: 15px; background: linear-gradient(45deg, #2c3e50, #3498db); border-radius: 10px; border: 2px solid #00ff88;">
                <p style="color: #00ff88; font-size: 14px; margin: 8px 0;">Intentos: ${attempts}</p>
                <button onclick="getNewClue()" style="margin-top: 15px; padding: 12px 25px; background: linear-gradient(45deg, #ff6b35, #f7931e); color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 14px; font-weight: bold;">
                    Siguiente Personaje 🏴‍☠️
                </button>
            </div>
        `;
        document.getElementById('guess-feedback').innerHTML = feedbackHTML;
        document.getElementById('character-guess').disabled = true;
        document.getElementById('submit-guess').disabled = true;
    } else {
        if (currentClueIndex < currentCharacter.clues.length) {
            document.getElementById('guess-feedback').innerHTML = `
                <div style="color: #ff4757; margin-bottom: 15px; text-align: center;">
                    <p style="font-weight: bold; margin-bottom: 10px;">❌ Incorrecto</p>
                    <p style="margin-bottom: 10px; color: #fff;">Tu respuesta: "<span style="color: #ff4757;">${guess}</span>"</p>
                    <p style="margin-bottom: 15px;">¿Necesitas otra pista?</p>
                    <button onclick="showNextClue()" style="padding: 8px 20px; background: linear-gradient(45deg, #3742fa, #2f3542); color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: bold;">
                        💡 Mostrar siguiente pista
                    </button>
                </div>
            `;
        } else {
            document.getElementById('guess-feedback').innerHTML = `
                <div style="color: #ff4757; margin-bottom: 15px; text-align: center;">
                    <p style="font-weight: bold; margin-bottom: 10px;">❌ Incorrecto</p>
                    <p style="margin-bottom: 10px; color: #fff;">Tu respuesta: "<span style="color: #ff4757;">${guess}</span>"</p>
                    <p style="margin-bottom: 15px;">No hay más pistas. ¡El personaje era...</p>
                    <p style="color: #00ff88; font-size: 18px; font-weight: bold; margin-bottom: 15px;">${currentCharacter.name}</p>
                    <div style="padding: 10px; background: rgba(255,71,87,0.1); border-radius: 8px; border: 1px solid #ff4757;">
                        <p style="color: #fff; font-size: 14px; margin: 5px 0;">Intentos utilizados: ${attempts}</p>
                    </div>
                    <button onclick="getNewClue()" style="margin-top: 15px; padding: 12px 25px; background: linear-gradient(45deg, #ff6b35, #f7931e); color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 14px; font-weight: bold;">
                        Siguiente Personaje 🏴‍☠️
                    </button>
                </div>
            `;
        }
    }
}

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('character-guess').addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && !this.disabled) {
            submitGuess();
        }
    });
});
