// Animación de las barras de habilidades cuando se cargan
document.addEventListener('DOMContentLoaded', function() {
    const skillBars = document.querySelectorAll('.skill-fill');
    
    const animateSkills = () => {
        skillBars.forEach(bar => {
            const level = bar.getAttribute('data-level');
            bar.style.width = '0%';
            setTimeout(() => {
                bar.style.width = level + '%';
            }, 500);
        });
    };

    // Observador para animar cuando la sección sea visible
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateSkills();
                observer.unobserve(entry.target);
            }
        });
    });

    const skillsSection = document.querySelector('.skills-section');
    if (skillsSection) {
        observer.observe(skillsSection);
    }
});

// JavaScript simplificado - sin efectos de scroll problemáticos

// Animación suave para las tarjetas al hacer scroll
const animateOnScroll = () => {
    const elements = document.querySelectorAll('.feature-card, .highlight-item, .skill-category');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1
    });

    elements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });
};

// Inicializar animaciones cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', animateOnScroll);

// Efecto de escritura para el título
const typeWriter = (element, text, speed = 100) => {
    let i = 0;
    element.innerHTML = '';
    
    const timer = setInterval(() => {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
        } else {
            clearInterval(timer);
        }
    }, speed);
};

// Aplicar efecto de escritura al título cuando la página cargue
window.addEventListener('load', () => {
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const originalText = heroTitle.textContent;
        typeWriter(heroTitle, originalText, 150);
    }
});
