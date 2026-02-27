// Archivo JS para la lógica del juego de adivinar personajes de Star Wars

const characters = [
    {
        id: "1",
        name: "Luke Skywalker",
        clues: [
            "Creció en un planeta desértico",
            "Es hijo de un poderoso villano",
            "Perdió una mano en un duelo con sable de luz",
            "Fue entrenado por un pequeño maestro Jedi",
            "Ayudó a destruir la primera Estrella de la Muerte"
        ]
    },
    {
        id: "2",
        name: "Darth Vader",
        clues: [
            "Respira con un sonido mecánico característico",
            "Antes fue un Jedi muy prometedor",
            "Es el padre de Luke Skywalker",
            "Trabaja para el Emperador",
            "Cayó al Lado Oscuro por miedo a perder a alguien"
        ]
    },
    {
        id: "3",
        name: "Princess Leia",
        clues: [
            "Es hermana gemela de Luke",
            "Fue líder de la Rebelión",
            "Creció como princesa en Alderaan",
            "Es hija de Darth Vader",
            "Nunca dejó de luchar contra el Imperio"
        ]
    },
    {
        id: "4",
        name: "Obi-Wan Kenobi",
        clues: [
            "Fue maestro de Anakin Skywalker",
            "Vivió oculto en Tatooine",
            "Derrotó a su antiguo aprendiz en Mustafar",
            "Entrenó a Luke",
            "Se convirtió en uno con la Fuerza"
        ]
    },
    {
        id: "5",
        name: "Yoda",
        clues: [
            "Habla de forma muy peculiar",
            "Fue Gran Maestro Jedi",
            "Vivió en Dagobah",
            "Entrenó a Luke Skywalker",
            "Es uno de los Jedi más poderosos"
        ]
    },
    {
        id: "6",
        name: "Han Solo",
        clues: [
            "Es capitán del Halcón Milenario",
            "Tiene un amigo wookiee",
            "Fue congelado en carbonita",
            "No creía en la Fuerza al inicio",
            "Es experto piloto"
        ]
    },
    {
        id: "7",
        name: "Chewbacca",
        clues: [
            "Es un wookiee",
            "Es copiloto del Halcón Milenario",
            "Se comunica con rugidos",
            "Es muy fuerte",
            "Es el mejor amigo de Han Solo"
        ]
    },
    {
        id: "8",
        name: "Palpatine",
        clues: [
            "También es conocido como Darth Sidious",
            "Fue Canciller antes de ser Emperador",
            "Manipuló la guerra desde ambos bandos",
            "Es maestro de Darth Vader",
            "Controló la caída de la República"
        ]
    }
];

let currentCharacter = null;
let currentClueIndex = 0;
let attempts = 0;

function normalizeName(name) {
    return name.toLowerCase()
        .replace(/\s+/g, ' ')
        .trim();
}

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
        }
        feedbackHTML += `
            <div style="margin-top: 15px; text-align: center; padding: 15px; background: linear-gradient(45deg, #2c3e50, #3498db); border-radius: 10px; border: 2px solid #00ff88;">
                <p style="color: #00ff88; font-size: 14px; margin: 8px 0;">Intentos: ${attempts}</p>
                <button onclick="getNewClue()" style="margin-top: 15px; padding: 12px 25px; background: linear-gradient(45deg, #ff6b35, #f7931e); color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 14px; font-weight: bold;">
                    Siguiente Personaje 🚀
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
                        Siguiente Personaje 🚀
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