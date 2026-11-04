$(document).ready(function () {
    const formatoFecha = "dd/mm/yy";
    const ultimoDia = 4;
    const $formulario = $("#formulario-reserva");
    const $form = $formulario.find("form");
    const $resumen = $("#panel-resumen");
    const $fecha = $("#fecha");
    let confirmacionIntentada = false;
    let cambiandoPanel = false;

    const validadores = {
        nombre: valor => valor ? "" : "Introduce tu nombre y apellidos.",
        email: valor => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor)
            ? "" : "Introduce una dirección de email válida.",
        entradas: valor => {
            const cantidad = Number(valor);
            return Number.isInteger(cantidad) && cantidad >= 1 && cantidad <= 5
                ? "" : "Introduce un número entero de entradas entre 1 y 5.";
        },
        fecha: validarFecha,
        tipo: valor => valor ? "" : "Selecciona un tipo de entrada.",
        condiciones: () => $("#condiciones").prop("checked")
            ? "" : "Debes aceptar las condiciones de la reserva."
    };

    function validarFecha(valor) {
        const errorFormato = "Introduce una fecha válida con el formato dd/mm/aaaa.";
        if (!/^\d{2}\/\d{2}\/\d{4}$/.test(valor)) {
            return errorFormato;
        }

        let fecha;
        try {
            fecha = $.datepicker.parseDate(formatoFecha, valor);
        } catch {
            return errorFormato;
        }

        const inicio = new Date();
        inicio.setHours(0, 0, 0, 0);
        const fin = new Date(inicio);
        fin.setDate(fin.getDate() + ultimoDia);
        return fecha < inicio || fecha > fin
            ? "Selecciona un día entre hoy y los cuatro días siguientes."
            : "";
    }

    function validarCampo(campo) {
        const $campo = $("#" + campo);
        const $error = $("#error-" + campo);
        const mensaje = validadores[campo]($campo.val().trim());
        $campo.attr("aria-invalid", Boolean(mensaje));
        if (mensaje) {
            $error.stop(true, true).text(mensaje).fadeIn();
        } else if ($error.is(":visible")) {
            $error.stop(true, true).fadeOut();
        }
        return !mensaje;
    }

    function cambiarPanel($origen, $destino, $foco) {
        cambiandoPanel = true;
        $origen.slideUp(function () {
            $destino.slideDown(function () {
                cambiandoPanel = false;
                $foco.trigger("focus");
            });
        });
    }

    $fecha.datepicker({
        dateFormat: formatoFecha,
        minDate: 0,
        maxDate: "+4D",
        onSelect: function () {
            if (confirmacionIntentada) {
                validarCampo("fecha");
            }
        }
    });

    $form.on("input", "input:not([type='checkbox'])", revalidarCampo);
    $form.on("change", "select, input[type='checkbox']", revalidarCampo);

    function revalidarCampo() {
        if (confirmacionIntentada) {
            validarCampo($(this).attr("id"));
        }
    }

    $form.on("submit", function (evento) {
        evento.preventDefault();
        if (cambiandoPanel) {
            return;
        }
        confirmacionIntentada = true;
        const resultados = Object.keys(validadores).map(validarCampo);
        if (resultados.includes(false)) {
            return;
        }

        $("#resumen-nombre").text($("#nombre").val().trim());
        $("#resumen-email").text($("#email").val().trim());
        $("#resumen-fecha").text($fecha.val().trim());
        $("#resumen-tipo").text($("#tipo option:selected").text());
        $("#resumen-entradas").text(Number($("#entradas").val()));
        cambiarPanel($formulario, $resumen, $("#titulo-resumen"));
    });

    $("#modificar").on("click", function () {
        if (!cambiandoPanel) {
            cambiarPanel($resumen, $formulario, $("#nombre"));
        }
    });
});
