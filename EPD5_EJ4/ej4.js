(function($) {
    
    $.fn.sportValidator = function() {
        return this.each(function() {
            const $campos = $(this).find('[data-sport-type]');

            $campos.on('focus', function() {
                $(this)
                    .removeClass('sport-valid sport-invalid')
                    .addClass('sport-pending');
            });

            $campos.on('input blur change', function() {
                const $campo = $(this);
                const tipo = $campo.attr('data-sport-type');
                const valor = $campo.val().trim();

                let esValido = false;
                let mensaje = '';
                let claseMensaje = '';

                switch (tipo) {
                    case 'nombre':
                        if (valor.length < 2) {
                            mensaje = 'El nombre debe tener al menos 2 caracteres';
                            claseMensaje = 'sport-error';
                        } else if (valor.length > 50) {
                            mensaje = 'El nombre es demasiado largo para el sistema';
                            claseMensaje = 'sport-error';
                        } else {
                            esValido = true;
                            mensaje = 'Nombre válido para inscripción';
                            claseMensaje = 'sport-success';
                        }
                        break;

                    case 'email':
                        const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                        if (!regexEmail.test(valor)) {
                            mensaje = 'Formato de email incorrecto';
                            claseMensaje = 'sport-error';
                        } else {
                            esValido = true;
                            mensaje = 'Email de contacto correcto';
                            claseMensaje = 'sport-success';
                        }
                        break;

                    case 'edad':
                        const edad = parseInt(valor, 10);
                        const esEntero = /^\d+$/.test(valor);

                        if (!esEntero || valor === '') {
                            mensaje = 'Edad mínima: 16 años';
                            claseMensaje = 'sport-error';
                        } else if (edad < 16) {
                            mensaje = 'Edad mínima: 16 años';
                            claseMensaje = 'sport-error';
                        } else if (edad > 65) {
                            mensaje = 'Edad máxima: 65 años';
                            claseMensaje = 'sport-error';
                        } else {
                            esValido = true;
                            mensaje = 'Edad apropiada para actividades';
                            claseMensaje = 'sport-success';
                        }
                        break;

                    case 'actividad':
                        if (valor === '') {
                            mensaje = 'Debes elegir una actividad deportiva';
                            claseMensaje = 'sport-error';
                        } else {
                            esValido = true;
                            mensaje = 'Actividad seleccionada';
                            claseMensaje = 'sport-success';
                        }
                        break;

                    case 'experiencia':
                        if (valor === '') {
                            mensaje = 'Selecciona tu nivel de experiencia';
                            claseMensaje = 'sport-warning';
                        } else {
                            esValido = true;
                            mensaje = 'Nivel de experiencia registrado';
                            claseMensaje = 'sport-success';
                        }
                        break;
                }

                $campo.removeClass('sport-pending sport-valid sport-invalid');
                if (esValido) {
                    $campo.addClass('sport-valid');
                } else {
                    $campo.addClass('sport-invalid');
                }

                $campo.next('.sport-message').remove(); 

                const $divMensaje = $('<div>')
                    .addClass('sport-message ' + claseMensaje)
                    .text(mensaje);
                
                $divMensaje.insertAfter($campo); 
            });
        });
    };
})(jQuery);

$(document).ready(function() {
    $('#inscripcionDeportiva').sportValidator();
});