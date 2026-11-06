<?php
/**
 * Copia este archivo como config.local.php en el servidor y completa los valores.
 * config.local.php está en .gitignore: nunca subas tu Secret Key al repositorio.
 */
return [
    // Secret Key de Cloudflare Turnstile (panel de Cloudflare > Turnstile > tu sitio)
    'turnstile_secret' => 'TU_SECRET_KEY',

    // Remitente de los correos. Debe ser una casilla del dominio para evitar spam.
    'mail_from' => 'no-reply@promaticmedia.cl',
];
