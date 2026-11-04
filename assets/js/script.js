document.addEventListener("DOMContentLoaded", function() {
    
    // Inicializar AOS
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
    const navMenu = document.getElementById('navbar-menu');

    if(hamburger) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('navbar__menu--active');
        });
    }

    // Suavizar el scroll de navegación
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            if(navMenu.classList.contains('navbar__menu--active')) {
                navMenu.classList.remove('navbar__menu--active'); // Cierra en móvil
            }

            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            const navbarHeight = document.querySelector('.navbar').offsetHeight;
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - navbarHeight,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Control de Navbar dinámico y Botón Flotante en Scroll
    const navbar = document.getElementById('navbar');
    const btnUp = document.getElementById('btn-up');

    window.addEventListener('scroll', () => {
        // Lógica Navbar
        if (window.scrollY > 20) {
            navbar.classList.add('navbar--scrolled');
        } else {
            navbar.classList.remove('navbar--scrolled');
        }
        
        // Lógica Botón Volver Arriba (Aparece al bajar 300px)
        if (btnUp) {
            if (window.scrollY > 300) {
                btnUp.classList.add('floating-btn--visible');
            } else {
                btnUp.classList.remove('floating-btn--visible');
            }
        }
    });
});
