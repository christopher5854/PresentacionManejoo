// JavaScript para la presentación personal de Matías Morales

document.addEventListener('DOMContentLoaded', function() {
    // Inicializar animaciones
    initializeAnimations();
    
    // Inicializar barras de habilidades
    initializeSkillBars();
    
    // Agregar efectos de scroll
    addScrollEffects();
    
    // Agregar efectos de hover
    addHoverEffects();
});

// Función para inicializar animaciones
function initializeAnimations() {
    // Animación de entrada para las tarjetas de características
    const featureCards = document.querySelectorAll('.feature-card');
    
    featureCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            card.style.transition = 'all 0.6s ease-out';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 200);
    });
    
    // Animación de entrada para los highlights
    const highlightItems = document.querySelectorAll('.highlight-item');
    
    highlightItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateX(-30px)';
        
        setTimeout(() => {
            item.style.transition = 'all 0.6s ease-out';
            item.style.opacity = '1';
            item.style.transform = 'translateX(0)';
        }, index * 300);
    });
}

// Función para inicializar las barras de habilidades
function initializeSkillBars() {
    const skillFills = document.querySelectorAll('.skill-fill');
    
    skillFills.forEach((fill, index) => {
        const level = fill.getAttribute('data-level');
        fill.style.width = '0%';
        
        // Animar las barras después de un delay
        setTimeout(() => {
            fill.style.width = level + '%';
        }, 1000 + (index * 200));
    });
}

// Función para agregar efectos de scroll
function addScrollEffects() {
    let scrollTimeout;
    
    window.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        
        // Agregar clase de efecto de scroll
        document.body.classList.add('scrolling');
        
        scrollTimeout = setTimeout(() => {
            document.body.classList.remove('scrolling');
        }, 150);
    });
    
    // Efecto de parallax para el header
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const heroHeader = document.querySelector('.hero-header');
        
        if (heroHeader) {
            heroHeader.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
    });
}

// Función para agregar efectos de hover
function addHoverEffects() {
    // Efecto de partículas en las tarjetas de características
    const featureCards = document.querySelectorAll('.feature-card');
    
    featureCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            addParticleEffect(card);
        });
    });
    
    // Efecto de boost en los highlights
    const highlightItems = document.querySelectorAll('.highlight-item');
    
    highlightItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            addBoostEffect(item);
        });
    });
}

// Función para agregar efecto de partículas
function addParticleEffect(element) {
    const particles = document.createElement('div');
    particles.className = 'particles';
    particles.innerHTML = '✨';
    particles.style.cssText = `
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 20px;
        color: #ffd23f;
        pointer-events: none;
        animation: particleFloat 1s ease-out forwards;
        z-index: 10;
    `;
    
    element.appendChild(particles);
    
    setTimeout(() => {
        particles.remove();
    }, 1000);
}

// Función para agregar efecto de boost
function addBoostEffect(element) {
    element.style.transform = 'scale(1.05)';
    element.style.boxShadow = '0 15px 35px rgba(0, 0, 0, 0.2)';
    
    setTimeout(() => {
        element.style.transform = 'scale(1)';
        element.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.1)';
    }, 200);
}

// Función para agregar efecto de "power-up" al cargar la página
function addPowerUpEffect() {
    const title = document.querySelector('.hero-title');
    if (title) {
        title.style.animation = 'powerUp 2s ease-out';
        
        setTimeout(() => {
            title.style.animation = 'glow 2s ease-in-out infinite alternate';
        }, 2000);
    }
}

// Llamar función de power-up al cargar
window.addEventListener('load', addPowerUpEffect);

// Función para agregar efecto de "item box" al hacer hover en las tarjetas
function addItemBoxEffect(card) {
    const itemBox = document.createElement('div');
    itemBox.className = 'item-box';
    itemBox.innerHTML = '💡';
    itemBox.style.cssText = `
        position: absolute;
        top: -10px;
        right: -10px;
        width: 30px;
        height: 30px;
        background: #ffd23f;
        border: 3px solid #0066cc;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 16px;
        font-weight: bold;
        animation: itemBoxFloat 0.5s ease-out;
        z-index: 5;
    `;
    
    card.appendChild(itemBox);
    
    setTimeout(() => {
        itemBox.remove();
    }, 500);
}

// Agregar efecto de item box al hacer hover
const featureCards = document.querySelectorAll('.feature-card');
featureCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        addItemBoxEffect(card);
    });
});

// CSS adicional para las nuevas animaciones
const additionalStyles = `
    @keyframes particleFloat {
        0% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
        }
        100% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0) translateY(-20px);
        }
    }
    
    @keyframes powerUp {
        0% {
            transform: scale(1);
        }
        50% {
            transform: scale(1.2);
        }
        100% {
            transform: scale(1);
        }
    }
    
    @keyframes itemBoxFloat {
        0% {
            transform: scale(0) rotate(0deg);
        }
        50% {
            transform: scale(1.2) rotate(180deg);
        }
        100% {
            transform: scale(1) rotate(360deg);
        }
    }
    
    .scrolling {
        transition: all 0.1s ease;
    }
    
    /* Efecto de brillo en las tarjetas */
    .feature-card::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
        transition: left 0.5s;
    }
    
    .feature-card:hover::before {
        left: 100%;
    }
    
    /* Efecto de rotación en los iconos */
    .feature-card:hover .feature-icon {
        animation: iconRotate 0.5s ease-out;
    }
    
    @keyframes iconRotate {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(360deg);
        }
    }
    
    /* Efecto de pulso en el perfil */
    .profile-img:hover {
        animation: profilePulse 0.5s ease-out;
    }
    
    @keyframes profilePulse {
        0% {
            transform: scale(1.05);
        }
        50% {
            transform: scale(1.1);
        }
        100% {
            transform: scale(1.05);
        }
    }
    
    /* Efecto de deslizamiento en las barras de habilidades */
    .skill-fill {
        position: relative;
        overflow: hidden;
    }
    
    .skill-fill::after {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
        animation: skillShine 2s ease-in-out infinite;
    }
    
    @keyframes skillShine {
        0% {
            left: -100%;
        }
        100% {
            left: 100%;
        }
    }
`;

// Agregar estilos adicionales al head
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);

// Función para agregar efecto de "drift" al hacer scroll
let scrollTimeout;
window.addEventListener('scroll', () => {
    clearTimeout(scrollTimeout);
    
    // Agregar clase de efecto de drift
    document.body.classList.add('scrolling');
    
    scrollTimeout = setTimeout(() => {
        document.body.classList.remove('scrolling');
    }, 150);
});

// Función para agregar efecto de "boost" al hacer clic en los elementos
function addClickBoostEffect(element) {
    element.style.transform = 'scale(1.1)';
    element.style.boxShadow = '0 0 20px rgba(255, 210, 63, 0.4)';
    
    setTimeout(() => {
        element.style.transform = 'scale(1)';
        element.style.boxShadow = '';
    }, 200);
}

// Agregar efecto de boost a los elementos clickeables
document.querySelectorAll('.feature-card, .highlight-item').forEach(element => {
    element.addEventListener('click', () => {
        addClickBoostEffect(element);
    });
});

// Función para agregar efecto de "power-up" al cargar la página
function addPageLoadEffects() {
    // Efecto de entrada para el título
    const title = document.querySelector('.hero-title');
    if (title) {
        title.style.animation = 'powerUp 2s ease-out';
        
        setTimeout(() => {
            title.style.animation = 'glow 2s ease-in-out infinite alternate';
        }, 2000);
    }
    
    // Efecto de entrada para la imagen de perfil
    const profileImg = document.querySelector('.profile-img');
    if (profileImg) {
        profileImg.style.animation = 'profileFloat 3s ease-in-out infinite';
    }
    
    // Efecto de entrada para las banderas
    const flags = document.querySelectorAll('.flag');
    flags.forEach((flag, index) => {
        flag.style.animation = `flagWave 2s ease-in-out infinite ${index * 0.5}s`;
    });
}

// Llamar función de efectos al cargar
window.addEventListener('load', addPageLoadEffects);
