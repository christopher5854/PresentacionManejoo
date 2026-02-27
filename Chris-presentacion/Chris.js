// JavaScript para la presentación personal - Versión Optimizada Star Wars

document.addEventListener('DOMContentLoaded', function () {

    initializeAnimations();
    initializeSkillBars();
    addScrollEffects();
    addHoverEffects();

});

/* ============================= */
/* ANIMACIONES INICIALES */
/* ============================= */

function initializeAnimations() {

    const featureCards = document.querySelectorAll('.feature-card');
    const highlightItems = document.querySelectorAll('.highlight-item');

    featureCards.forEach((card, index) => {

        card.style.opacity = '0';
        card.style.transform = 'translateY(40px)';

        setTimeout(() => {
            card.style.transition = 'all 0.7s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 150);
    });

    highlightItems.forEach((item, index) => {

        item.style.opacity = '0';
        item.style.transform = 'translateX(-40px)';

        setTimeout(() => {
            item.style.transition = 'all 0.7s ease';
            item.style.opacity = '1';
            item.style.transform = 'translateX(0)';
        }, index * 200);
    });
}

/* ============================= */
/* SKILL BARS (CORREGIDO) */
/* ============================= */

function initializeSkillBars() {

    const skillFills = document.querySelectorAll('.skill-fill');

    skillFills.forEach((fill, index) => {

        const level = fill.style.getPropertyValue('--data-level');

        fill.style.width = '0%';

        setTimeout(() => {
            fill.style.transition = 'width 1.5s ease';
            fill.style.width = level;
        }, 800 + (index * 150));
    });
}

/* ============================= */
/* EFECTO SCROLL SUAVE */
/* ============================= */

function addScrollEffects() {

    let scrollTimeout;

    window.addEventListener('scroll', () => {

        clearTimeout(scrollTimeout);
        document.body.classList.add('scrolling');

        scrollTimeout = setTimeout(() => {
            document.body.classList.remove('scrolling');
        }, 150);
    });

    // 🔥 Quitamos el parallax que rompía el diseño
}

/* ============================= */
/* HOVER EFFECTS CONTROLADOS */
/* ============================= */

function addHoverEffects() {

    const featureCards = document.querySelectorAll('.feature-card');
    const highlightItems = document.querySelectorAll('.highlight-item');

    featureCards.forEach(card => {

        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-6px)';
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
        });

    });

    highlightItems.forEach(item => {

        item.addEventListener('mouseenter', () => {
            item.style.transform = 'translateX(8px)';
        });

        item.addEventListener('mouseleave', () => {
            item.style.transform = 'translateX(0)';
        });

    });
}

/* ============================= */
/* POWER UP HERO */
/* ============================= */

function addPageLoadEffects() {

    const title = document.querySelector('.hero-title');
    const profileImg = document.querySelector('.profile-img');

    if (title) {
        title.style.opacity = '0';
        title.style.transform = 'scale(0.8)';
        title.style.transition = 'all 1s ease';

        setTimeout(() => {
            title.style.opacity = '1';
            title.style.transform = 'scale(1)';
        }, 300);
    }

    if (profileImg) {
        profileImg.style.opacity = '0';
        profileImg.style.transform = 'scale(0.8)';
        profileImg.style.transition = 'all 1.2s ease';

        setTimeout(() => {
            profileImg.style.opacity = '1';
            profileImg.style.transform = 'scale(1)';
        }, 200);
    }
}

window.addEventListener('load', addPageLoadEffects);