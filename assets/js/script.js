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

    // Formulario de contacto (envío a enviar.php con Cloudflare Turnstile)
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');

    if (contactForm) {
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const submitBtnHtml = submitBtn.innerHTML;

        const mostrarEstado = (mensaje, tipo) => {
            formStatus.textContent = mensaje;
            formStatus.className = 'form-status form-status--' + tipo;
        };

        const resetTurnstile = () => {
            if (typeof turnstile !== 'undefined') {
                turnstile.reset(contactForm.querySelector('.cf-turnstile'));
            }
        };

        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            if (!contactForm.checkValidity()) {
                contactForm.reportValidity();
                return;
            }

            const formData = new FormData(contactForm);
            if (!formData.get('cf-turnstile-response')) {
                mostrarEstado('Por favor completa la verificación de seguridad.', 'error');
                return;
            }

            submitBtn.disabled = true;
            submitBtn.innerHTML = 'Enviando... <i class="fa-solid fa-spinner fa-spin"></i>';

            try {
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    body: formData,
                    headers: { 'Accept': 'application/json' }
                });
                const data = await response.json().catch(() => ({}));

                if (response.ok && data.ok) {
                    mostrarEstado(data.message || '¡Mensaje enviado! Un consultor se contactará pronto.', 'success');
                    contactForm.reset();
                } else {
                    mostrarEstado(data.message || 'No pudimos enviar tu mensaje. Inténtalo nuevamente.', 'error');
                }
            } catch (error) {
                mostrarEstado('Error de conexión. Revisa tu internet e inténtalo nuevamente.', 'error');
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML = submitBtnHtml;
                resetTurnstile(); // Cada token de Turnstile es de un solo uso
            }
        });
    }
});
