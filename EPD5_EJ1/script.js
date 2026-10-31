/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/ClientSide/javascript.js to edit this template
 */

$(document).ready(function () {
    const VELOCIDAD = 400;
    const OPACIDAD_ENCENDIDA = 1;
    const OPACIDAD_APAGADA = 0.2;
    const MENSAJES = {
        roja: 'Detén el vehículo',
        amarilla: 'Precaución',
        verde: 'Puedes pasar'
    };

    const $luces = $('.luz');
    const $botones = $('.botonLuz');
    const $mensaje = $('#mensajeEstado');

    let luzActiva = null;

    // Enciende la luz indicada y apaga las demás
    function mostrarLuz(nombre, velocidad) {
        luzActiva = nombre;

        $luces.each(function () {
            const $luz = $(this);
            const opacidad = $luz.data('luz') === nombre ? OPACIDAD_ENCENDIDA : OPACIDAD_APAGADA;
            // stop(true, false): cancela la animación anterior y vacía la cola
            $luz.stop(true, false).fadeTo(velocidad, opacidad);
        });

        $mensaje.text(MENSAJES[nombre]);
    }

    $botones.on('click', function () {
        const nombre = $(this).data('luz');
        if (nombre === luzActiva) {
            return; // la luz ya está seleccionada: no se reinicia su transición
        }
        mostrarLuz(nombre, VELOCIDAD);
    });

    // Zoom al pasar el ratón: clase CSS con transform y transición
    $luces
            .on('mouseenter', function () {
                $(this).addClass('luzZoom');
            })
            .on('mouseleave', function () {
                $(this).removeClass('luzZoom');
            });

    // Estado inicial: roja encendida, sin animación
    mostrarLuz('roja', 0);
});
