document.addEventListener("DOMContentLoaded", () => {

    const cards = document.querySelectorAll(".character-card");
    const modal = document.getElementById("characterModal");
    const closeBtn = document.querySelector(".close");
    const modalIcon = document.querySelector(".modal-icon");
    const modalTitle = document.querySelector(".modal-title");
    const statsContainer = document.querySelector(".stats-grid");
    const bioText = document.querySelector(".bio-text");

    // 🎵 Sonido sable láser
    const saberSound = new Audio("./Light saber.mp3");

    // 🌌 Datos de personajes
    const characters = {
        luke: {
            icon: "🔵",
            title: "Luke Skywalker",
            stats: {
                Fuerza: 95,
                Valentía: 90,
                Estrategia: 80,
                Esperanza: 100
            },
            bio: "Un granjero convertido en Jedi legendario. Portador de la esperanza de la galaxia."
        },
        vader: {
            icon: "🔴",
            title: "Darth Vader",
            stats: {
                Fuerza: 100,
                Maldad: 95,
                Poder: 98,
                Oscuridad: 100
            },
            bio: "El Lord Sith más temido del Imperio. Su respiración anuncia el destino."
        },
        leia: {
            icon: "👑",
            title: "Princesa Leia",
            stats: {
                Liderazgo: 95,
                Valentía: 92,
                Inteligencia: 90,
                Rebelión: 100
            },
            bio: "Líder rebelde y símbolo de resistencia en la galaxia."
        },
        han: {
            icon: "🚀",
            title: "Han Solo",
            stats: {
                Carisma: 95,
                Precisión: 85,
                Suerte: 90,
                Velocidad: 88
            },
            bio: "El contrabandista más famoso del espacio. Nunca le digas las probabilidades."
        },
        yoda: {
            icon: "🟢",
            title: "Maestro Yoda",
            stats: {
                Sabiduría: 100,
                Fuerza: 98,
                Paciencia: 100,
                Poder: 95
            },
            bio: "Pequeño en tamaño, inmenso en poder. Maestro de generaciones Jedi."
        },
        obiwan: {  // 🔥 IMPORTANTE: coincide con data-character="obiwan"
            icon: "⚔️",
            title: "Obi-Wan Kenobi",
            stats: {
                Defensa: 95,
                Honor: 100,
                Técnica: 92,
                Equilibrio: 90
            },
            bio: "Un Jedi noble y sabio. Mentor de héroes y guardián del equilibrio."
        }
    };

    // 🌠 Abrir modal
    cards.forEach(card => {
        card.addEventListener("click", (e) => {

            // Si hace click en el botón, no abrir modal
            if (e.target.classList.contains("view-btn")) return;

            const characterKey = card.getAttribute("data-character");
            const character = characters[characterKey];

            if (!character) {
                console.log("Personaje no encontrado:", characterKey);
                return;
            }

            // Reiniciar y reproducir sonido
            saberSound.currentTime = 0;
            saberSound.play().catch(() => {});

            modalIcon.textContent = character.icon;
            modalTitle.textContent = character.title;
            bioText.textContent = character.bio;

            // Limpiar stats
            statsContainer.innerHTML = "";

            // Color dinámico según personaje
            let barColor = "linear-gradient(90deg,#ffe81f,#ff0000)";

            if (characterKey === "vader") {
                barColor = "linear-gradient(90deg,#8b0000,#ff0000)";
            }
            if (characterKey === "obiwan") {
                barColor = "linear-gradient(90deg,#00c3ff,#0044ff)";
            }
            if (characterKey === "yoda") {
                barColor = "linear-gradient(90deg,#00ff88,#00aa44)";
            }

            // Crear stats dinámicos
            for (let stat in character.stats) {

                const value = character.stats[stat];

                const statDiv = document.createElement("div");
                statDiv.innerHTML = `
                    <strong>${stat}</strong>
                    <div style="background:#333;border-radius:10px;overflow:hidden;margin-top:5px;">
                        <div class="stat-bar-fill" style="
                            width:0%;
                            height:8px;
                            background:${barColor};
                            transition:1.2s;
                        "></div>
                    </div>
                `;

                statsContainer.appendChild(statDiv);

                setTimeout(() => {
                    statDiv.querySelector(".stat-bar-fill").style.width = value + "%";
                }, 200);
            }

            modal.style.display = "flex";

            // Animación cinematográfica
            const content = modal.querySelector(".modal-content");
            content.style.transform = "scale(0.7)";
            content.style.opacity = "0";

            setTimeout(() => {
                content.style.transform = "scale(1)";
                content.style.opacity = "1";
            }, 50);

            document.body.style.overflow = "hidden";
        });
    });

    // ❌ Cerrar modal
    closeBtn.addEventListener("click", closeModal);

    window.addEventListener("click", (e) => {
        if (e.target === modal) closeModal();
    });

    function closeModal() {
        const content = modal.querySelector(".modal-content");

        content.style.transform = "scale(0.7)";
        content.style.opacity = "0";

        setTimeout(() => {
            modal.style.display = "none";
        }, 300);

        document.body.style.overflow = "auto";
    }

});