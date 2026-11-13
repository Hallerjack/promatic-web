# Promatic Media - Landing Page Corporativa

Sitio web corporativo para **Promatic Media**, empresa especializada en el diseño e implementación de infraestructura tecnológica inteligente, analítica comercial, domótica y telemetría corporativa.

## Características Principales

- **Diseño Responsivo y Moderno:** Interfaz fluida adaptable a dispositivos móviles, tablets y pantallas de escritorio.
- **Arquitectura CSS escalable:** Código estructurado bajo la metodología **BEM** (Block Element Modifier) para asegurar un mantenimiento sencillo y evitar colisiones de estilos.
- **Navbar Dinámico Inteligente:** Barra de navegación que transiciona de transparente a sólida con un fundido suave de logotipos (versión clara a oscura) al hacer scroll.
- **Carrusel Infinito:** Sección de clientes animada mediante CSS puro sin dependencias pesadas de JavaScript.
- **Animaciones al Scroll (AOS):** Elementos que aparecen fluidamente a medida que el usuario navega por la página.
- **Formulario de Contacto Seguro:** Integración con backend en **PHP**, protegido por **Cloudflare Turnstile** (alternativa a reCAPTCHA rápida y privada) y técnica *Honeypot* antispam. Respuestas dinámicas mediante Fetch API (AJAX).
- **Botones de Acción Rápida (FABs):** Accesos flotantes para volver arriba y contacto directo a WhatsApp.

## Stack Tecnológico

- **Frontend:** HTML5, CSS3 (Custom Properties, Flexbox, Grid), Vanilla JavaScript (ES6+).
- **Backend:** PHP 8.x (Procesamiento de correos y validación de seguridad).
- **Librerías & APIs:**
  - [AOS (Animate On Scroll)](https://michalsnik.github.io/aos/)
  - [FontAwesome 6](https://fontawesome.com/)
  - [Cloudflare Turnstile](https://developers.cloudflare.com/turnstile/)

## Estructura del Proyecto

```text
web_promaticmedia/
├── index.html                 # Vista principal de la Landing Page
├── enviar.php                 # Lógica de procesamiento y envío de correos
├── config.local.example.php   # Plantilla de variables de entorno para PHP
├── assets/
│   ├── css/
│   │   └── style.css          # Hoja de estilos principal (Metodología BEM)
│   ├── js/
│   │   └── script.js          # Control de animaciones, navbar y peticiones del formulario
│   └── img/                   # Recursos gráficos (Logos, videos, favicon)
```

## Instalación y Configuración Local

Para visualizar el diseño del sitio, basta con abrir el archivo `index.html` en tu navegador o usar extensiones como *Live Server* en VS Code. 

Sin embargo, **para que el formulario de contacto funcione**, necesitas un entorno con servidor PHP (como XAMPP, MAMP, Laragon o Docker).

### Configuración del Formulario (Cloudflare Turnstile & PHP)

1. Clona el repositorio en la carpeta pública de tu servidor local (ej. `htdocs`).
2. Duplica el archivo de configuración de ejemplo:
   ```bash
   cp config.local.example.php config.local.php
   ```
3. Edita el nuevo archivo `config.local.php`:
   - Agrega tu **Secret Key** proporcionada por el panel de Cloudflare Turnstile.
   - Configura el remitente del correo electrónico.
4. *Nota de Seguridad:* El archivo `config.local.php` **nunca** debe ser subido al repositorio (asegúrate de que esté incluido en tu archivo `.gitignore`).
5. En el archivo `index.html`, asegúrate de actualizar el atributo `data-sitekey` en el contenedor del captcha con tu clave pública de Cloudflare.

## Arquitectura CSS (Metodología BEM)

El proyecto utiliza BEM para estandarizar los componentes. Ejemplo:
- **Bloque:** `.navbar`
- **Elemento:** `.navbar__menu`
- **Modificador:** `.navbar--scrolled`

Además, se evitaron estilos en línea mediante JavaScript. Las interacciones (como el scroll o la apertura del menú hamburguesa) se gestionan añadiendo o quitando clases modificadoras BEM, delegando las transiciones visuales puramente a CSS para maximizar el rendimiento.

## Licencia

© 2026 Promatic Media. Todos los derechos reservados.