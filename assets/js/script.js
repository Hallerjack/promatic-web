document.addEventListener("DOMContentLoaded", function() {
    
    // Inicializar AOS (Animate On Scroll)
    if(typeof AOS !== 'undefined') {
        AOS.init({
            once: true,
            offset: 50,
            duration: 800,
            easing: 'ease-in-out'
        });
    }

    // Menú Hamburguesa para Móviles
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('nav-links');

    if(hamburger) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    // Suavizar el scroll de navegación
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            if(navLinks.classList.contains('active')) {
                navLinks.classList.remove('active'); // Cierra en móvil
            }

            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            const navbarHeight = document.querySelector('nav').offsetHeight;
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - navbarHeight,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Efecto visual en Navbar al hacer scroll
    const navbar = document.getElementById('navbar');
    const navContainer = document.querySelector('.nav-container');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 20) {
            navContainer.style.padding = "10px 24px";
            navbar.style.backgroundColor = "rgba(255, 255, 255, 0.95)";
            navbar.style.backdropFilter = "blur(10px)";
        } else {
            navContainer.style.padding = "15px 24px";
            navbar.style.backgroundColor = "var(--bg-white)";
            navbar.style.backdropFilter = "none";
        }
    });
});
