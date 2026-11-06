<?php
/**
 * Procesa el formulario de contacto de index.html.
 * - Valida los campos
 * - Verifica el token de Cloudflare Turnstile
 * - Envía el correo a info@promaticmedia.cl
 *
 * La Secret Key de Turnstile se lee desde config.local.php (no versionado).
 * Ver config.local.example.php.
 */

declare(strict_types=1);

const MAIL_TO = 'info@promaticmedia.cl';

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

function responder(int $status, bool $ok, string $mensaje): void
{
    http_response_code($status);
    echo json_encode(['ok' => $ok, 'message' => $mensaje], JSON_UNESCAPED_UNICODE);
    exit;
}

// Elimina saltos de línea para evitar inyección de cabeceras.
function limpiar(string $valor, int $max): string
{
    $valor = trim(preg_replace('/[\r\n\t]+/', ' ', $valor) ?? '');
    return mb_substr($valor, 0, $max);
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    header('Allow: POST');
    responder(405, false, 'Método no permitido.');
}

// --- Configuración ---
$configPath = __DIR__ . '/config.local.php';
$config = is_file($configPath) ? require $configPath : [];
$secret = is_array($config) ? ($config['turnstile_secret'] ?? '') : '';
$mailFrom = is_array($config) ? ($config['mail_from'] ?? 'no-reply@promaticmedia.cl') : 'no-reply@promaticmedia.cl';

if ($secret === '') {
    error_log('enviar.php: falta turnstile_secret en config.local.php');
    responder(500, false, 'El formulario no está configurado. Escríbenos directamente a ' . MAIL_TO . '.');
}

// --- Honeypot: si viene con contenido es un bot; respondemos OK sin enviar ---
if (!empty($_POST['website'])) {
    responder(200, true, '¡Gracias! Un consultor se contactará pronto.');
}

// --- Validación de campos ---
$nombre  = limpiar((string)($_POST['nombre'] ?? ''), 100);
$empresa = limpiar((string)($_POST['empresa'] ?? ''), 150);
$correo  = limpiar((string)($_POST['correo'] ?? ''), 150);
$token   = (string)($_POST['cf-turnstile-response'] ?? '');

if ($nombre === '' || $empresa === '' || $correo === '') {
    responder(422, false, 'Por favor completa todos los campos.');
}
if (!filter_var($correo, FILTER_VALIDATE_EMAIL)) {
    responder(422, false, 'El correo ingresado no es válido.');
}
if ($token === '') {
    responder(422, false, 'Por favor completa la verificación de seguridad.');
}

// --- Verificación Turnstile ---
$payload = http_build_query([
    'secret'   => $secret,
    'response' => $token,
    'remoteip' => $_SERVER['HTTP_CF_CONNECTING_IP'] ?? $_SERVER['REMOTE_ADDR'] ?? '',
]);
$verifyUrl = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
$respuesta = false;

if (function_exists('curl_init')) {
    $ch = curl_init($verifyUrl);
    curl_setopt_array($ch, [
        CURLOPT_POST           => true,
        CURLOPT_POSTFIELDS     => $payload,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT        => 10,
    ]);
    $respuesta = curl_exec($ch);
    curl_close($ch);
} else {
    $respuesta = @file_get_contents($verifyUrl, false, stream_context_create([
        'http' => [
            'method'  => 'POST',
            'header'  => "Content-Type: application/x-www-form-urlencoded\r\n",
            'content' => $payload,
            'timeout' => 10,
        ],
    ]));
}

$resultado = $respuesta ? json_decode((string)$respuesta, true) : null;
if (empty($resultado['success'])) {
    error_log('enviar.php: Turnstile rechazó el token: ' . json_encode($resultado['error-codes'] ?? 'sin respuesta'));
    responder(403, false, 'No pudimos verificar que eres humano. Recarga la página e inténtalo de nuevo.');
}

// --- Envío del correo ---
$asunto = '=?UTF-8?B?' . base64_encode('Nuevo contacto web: ' . $nombre . ' (' . $empresa . ')') . '?=';

$cuerpo = "Nuevo mensaje desde el formulario de promaticmedia.cl\n\n"
        . "Nombre:  {$nombre}\n"
        . "Empresa: {$empresa}\n"
        . "Correo:  {$correo}\n\n"
        . 'Fecha: ' . date('Y-m-d H:i:s') . "\n"
        . 'IP: ' . ($_SERVER['HTTP_CF_CONNECTING_IP'] ?? $_SERVER['REMOTE_ADDR'] ?? 'desconocida') . "\n";

$cabeceras = implode("\r\n", [
    'From: Promatic Media Web <' . $mailFrom . '>',
    'Reply-To: ' . $correo,
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: 8bit',
    'X-Mailer: PHP/' . PHP_VERSION,
]);

if (!mail(MAIL_TO, $asunto, $cuerpo, $cabeceras, '-f' . $mailFrom)) {
    error_log('enviar.php: mail() falló');
    responder(500, false, 'No pudimos enviar tu mensaje. Inténtalo más tarde o escríbenos a ' . MAIL_TO . '.');
}

responder(200, true, '¡Mensaje enviado! Un consultor se contactará pronto.');
