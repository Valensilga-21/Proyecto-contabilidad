    function registrarViaje() {
        var formData = {
            "num_comision": document.getElementById("num_comision").value,
            "fecha_inicio": document.getElementById("fecha_inicio").value,
            "fecha_fin": document.getElementById("fecha_fin").value,
            "ruta": document.getElementById("ruta").value,
            "estado_viaje": document.getElementById("estado_viaje").value
        };

        if (validarCampos()) {
            $.ajax({
                url: urlRegistroViaje,
                type: "POST",
                data: formData, // Enviar directamente el objeto sin `JSON.stringify`
                success: function(result) {
                    Swal.fire({
                        title: "¡Excelente!",
                        text: "Se guardó correctamente",
                        icon: "success"
                    });
                    $('#viajeRegister').modal('hide');
                },
                error: function(error) {
                    Swal.fire({
                        title: "¡Error!",
                        text: "No se guardó",
                        icon: "error"
                    });
                }
            });
        } else {
            Swal.fire({
                title: "¡Error!",
                text: "Llene todos los campos correctamente",
                icon: "error"
            });
        }
    }

    function validarCampos(){
        var num_comisionV = document.getElementById("num_comision");
        var fecha_inicioV = document.getElementById("fecha_inicio");
        var fecha_finV = document.getElementById("fecha_fin");
        var rutaV = document.getElementById("ruta");

        return validateNumComision(num_comisionV) && validateFecha(fecha_inicioV) 
        && validateFechaFin(fecha_finV) && validateRuta(rutaV);
    }

    //Validacion número de comisión
    function validateNumComision(num_comisionV) {
        let num_comision = document.getElementById("num_comision").value;
        let validationDocument = document.getElementById("validation-comision");

        let messageDoc = '';

        if (num_comision.length === 0) {
            messageDoc = 'Este es un campo obligatorio';
            validationDocument.classList.remove('text-success');
            validationDocument.classList.add("text-danger");
        } else if (!/^\d+$/.test(num_comision)) {
            messageDoc = 'El número de comisión debe contener solo números.';
            validationDocument.classList.remove('text-success');
            validationDocument.classList.add("text-danger");
        } else {
            messageDoc = ''; // Puedes dejar un mensaje vacío o indicar que es válido.
            validationDocument.classList.remove('text-danger');
            validationDocument.classList.add('text-success');
        }

        validationDocument.textContent = messageDoc;
    }

    //VALIDAR FECHA INICIO
    function validateFecha(fecha_inicioV) {
        let fecha = document.getElementById("fecha_inicio").value;
        let validationMessage = document.getElementById("validation-fecha_inicio");

        let messageFechaInicio = '';

        // Expresión regular para validar formato YYYY-MM-DD
        let regexFecha = /^\d{4}-\d{2}-\d{2}$/;

        if (fecha.length === 0) {
            message = 'Este es un campo obligatorio';
            validationMessage.classList.remove('text-success');
            validationMessage.classList.add("text-danger");
        } else if (!regexFecha.test(fecha)) {
            message = 'Formato de fecha inválido. Use AAAA-MM-DD';
            validationMessage.classList.remove('text-success');
            validationMessage.classList.add("text-danger");
        } else {
            let dateObject = new Date(fecha);
            let isValidDate = !isNaN(dateObject.getTime());

            if (!isValidDate) {
                message = 'Ingrese una fecha válida.';
                validationMessage.classList.remove('text-success');
                validationMessage.classList.add("text-danger");
            } else {
                message = '';
                validationMessage.classList.remove('text-danger');
                validationMessage.classList.add('text-success');
            }
        }

        validationMessage.textContent = messageFechaInicio;
    }

    //VALIDAR FECHA FIN
    function validateFechaFin(fecha_finV) {
        let fecha = document.getElementById("fecha_inicio").value;
        let validationMessage = document.getElementById("validation-fecha_fin");

        let messageFechaFin = '';

        let regexFecha = /^\d{4}-\d{2}-\d{2}$/;

        if (fecha.length === 0) {
            message = 'Este es un campo obligatorio';
            validationMessage.classList.remove('text-success');
            validationMessage.classList.add("text-danger");
        } else if (!regexFecha.test(fecha)) {
            message = 'Formato de fecha inválido. Use AAAA-MM-DD';
            validationMessage.classList.remove('text-success');
            validationMessage.classList.add("text-danger");
        } else {
            let dateObject = new Date(fecha);
            let isValidDate = !isNaN(dateObject.getTime());

            if (!isValidDate) {
                message = 'Ingrese una fecha válida.';
                validationMessage.classList.remove('text-success');
                validationMessage.classList.add("text-danger");
            } else {
                message = '';
                validationMessage.classList.remove('text-danger');
                validationMessage.classList.add('text-success');
            }
        }

        validationMessage.textContent = messageFechaFin;
    }

    //VALIDACION RUTA
    function validateRuta(rutaV) {
        let ruta = document.getElementById("ruta").value;
        let validationMessage = document.getElementById("validation-ruta");

        let messageRuta = '';

        if (ruta.length === 0) {
            messageRuta = 'Este es un campo obligatorio.';
            validationMessage.classList.remove('text-success');
            validationMessage.classList.add("text-danger");
        } else if (ruta.length > 350) {
            messageRuta = 'La ruta no debe exceder los 350 caracteres.';
            validationMessage.classList.remove('text-success');
            validationMessage.classList.add("text-danger");
        } else {
            messageRuta = '';
            validationMessage.classList.remove('text-danger');
            validationMessage.classList.add('text-success');
        }

        validationMessage.textContent = messageRuta;
    }
