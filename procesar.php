<?php
// Verifica si se envió el formulario
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Obtén el token de reCAPTCHA
    $recaptcha_response = $_POST['g-recaptcha-response'];

    // Verifica que el token no esté vacío
    if (empty($recaptcha_response)) {
        echo "Error: El token de reCAPTCHA está vacío.";
        exit;
    }

    // Tu clave secreta de reCAPTCHA
    $secret_key = "6LfHZ8gqAAAAAIjt5GxNDp8XQ8wQtxado2GFZXpx"; // Reemplaza con tu clave secreta

    // URL de la API de Google reCAPTCHA
    $url = "https://www.google.com/recaptcha/api/siteverify";

    // Datos para enviar a Google
    $data = [
        'secret' => $secret_key,
        'response' => $recaptcha_response
    ];

    // Configura la solicitud HTTP
    $options = [
        'http' => [
            'header' => "Content-type: application/x-www-form-urlencoded\r\n",
            'method' => 'POST',
            'content' => http_build_query($data)
        ]
    ];

    // Realiza la solicitud a Google
    $context = stream_context_create($options);
    $result = file_get_contents($url, false, $context);

    if ($result === FALSE) {
        // Manejo de errores
        echo "Error al realizar la solicitud a la API de Google.";
        error_log("Error al realizar la solicitud a la API de Google.");
        exit;
    }

    // Procesa la respuesta de Google
    $response = json_decode($result, true);

    if ($response['success']) {
        // El reCAPTCHA es válido
        echo "¡Captcha válido! El usuario es humano.";
    } else {
        // El reCAPTCHA no es válido
        echo "Error: Captcha no válido. Posible bot.";
        // Agrega logs para depurar
        error_log("reCAPTCHA error: " . print_r($response, true));
    }
}
?>