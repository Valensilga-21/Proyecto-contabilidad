function registrarViaje() {
    var token = localStorage.getItem("userToken");
    var userId = localStorage.getItem("userId"); // Recuperar ID del usuario

    if (!userId) {
        Swal.fire({
            title: "¡Error!",
            text: "El usuario no ha iniciado sesión correctamente.",
            icon: "error"
        });
        return;
    }

    var formData = {
        num_comision: document.getElementById("num_comision").value.trim(),
        fecha_inicio: document.getElementById("fecha_inicio").value,
        fecha_fin: document.getElementById("fecha_fin").value,
        ruta: document.getElementById("ruta").value,
        estado_viaje: document.getElementById("estado_viaje").value,
        id_usuario: userId
    };

    // Validar que todos los campos estén llenos
    if (!formData.num_comision || !formData.fecha_inicio || !formData.fecha_fin || !formData.ruta) {
        Swal.fire({
            title: "¡Error!",
            text: "¡Llene todos los campos correctamente!",
            icon: "error"
        });
        return;
    }

    $.ajax({
        url: "http://localhost:8080/api/v1/LCDSena/viaje/",
        type: "POST",
        data: JSON.stringify(formData),
        contentType: "application/json",
        headers: { "Authorization": "Bearer " + token },
        success: function(result) {
        console.log("Respuesta del backend:", result); // Verifica la estructura de la respuesta

        if (result.viaje && result.viaje.id_viaje) {
                let viaje = {
                id_viaje: result.viaje.id_viaje, // Acceder correctamente al ID
                    num_comision: formData.num_comision,
                    fecha_inicio: formData.fecha_inicio,
                    fecha_fin: formData.fecha_fin,
                    ruta: formData.ruta,
                    estado_viaje: formData.estado_viaje,
                    id_usuario: formData.id_usuario
                };

                // Almacenar el viaje en localStorage en formato JSON
                localStorage.setItem("viaje", JSON.stringify(viaje));

                console.log("Viaje almacenado en localStorage:", viaje);
            } else {
                console.log("Error: la respuesta del backend no contiene 'id_viaje'.");
            }

            Swal.fire({
                title: "¡Éxito!",
                text: "Viaje registrado correctamente.",
                icon: "success"
            });

            $('#viajeRegister').modal('hide');
        },
        error: function(xhr, status, error) {
            console.log("Error en la petición:", xhr.responseText);
            Swal.fire({
                title: "¡Error!",
                text: "No se pudo registrar el viaje. Verifica tu sesión e intenta nuevamente.",
                icon: "error"
            });
        }
    });
}


// Función para listar viajes Usuario
function listarViajes() {
    $.ajax({
        url: urlListaViajes,
        type: "GET",
        success: function (result) {
            var cuerpoTabla = document.getElementById("viajesTable").getElementsByTagName('tbody')[0];
            cuerpoTabla.innerHTML = ""; // Limpiar la tabla

            for (var i = 0; i < result.length; i++) {
                var estado = result[i]["estado_viaje"].toLowerCase();
                
                // Definir color del texto según el estado
                var colorEstado = "";
                if (estado === "cancelado") {
                    colorEstado = "red";
                } else if (estado === "pendiente") {
                    colorEstado = "orange";
                } else if (estado === "completado") {
                    colorEstado = "green";
                }

                // Crear fila de la tabla
                var trRegistro = document.createElement("tr");
                trRegistro.innerHTML = `
                    <td>${result[i]["num_comision"]}</td>
                    <td>${result[i]["fecha_inicio"]}</td>
                    <td>${result[i]["fecha_fin"]}</td>
                    <td>${result[i]["ruta"]}</td>
                    <td style="color: ${colorEstado};">${result[i]["estado_viaje"]}</td>
                    <td class="text-center align-middle">
                        <i class="btn fas fa-edit Editar text-warning" onclick="openEditModal('${result[i]["id_viaje"]}')"></i>
                    </td>
                `;
                cuerpoTabla.appendChild(trRegistro);
            }
        },
        error: function (errorLista) {
            Swal.fire({
                title: "Error",
                text: "Hubo un error al cargar los datos." + errorLista,
                icon: "error"
            });
        }
    });
}

// Función para listar viajes Admin
function listarViajesAdmin() {

    var filtro = document.getElementById("texto").value;
    var urlViaje = filtro !== "" ? urlFiltrosViaje + "busquedaFiltro/" + filtro : urlFiltrosViaje;

    $.ajax({
        url: urlViaje,
        type: "GET",
        success: function (result) {
            var cuerpoTabla = document.getElementById("viajesTableAdmin").getElementsByTagName('tbody')[0];
            cuerpoTabla.innerHTML = ""; // Limpiar la tabla antes de llenarla

            for (var i = 0; i < result.length; i++) {
                var usuario = result[i]["usuario"] || {};
                
                // Asignar valores predeterminados si no están disponibles
                var num_comision = result[i]["num_comision"] || "No disponible";
                var nombre_usuario = usuario["nombre_usuario"] || "No disponible";
                var cargo = usuario["cargo"] || "No disponible";
                var centro = usuario["centro"] || "No disponible";
                var fecha_inicio = result[i]["fecha_inicio"] || "No disponible";
                var fecha_fin = result[i]["fecha_fin"] || "No disponible";
                var ruta = result[i]["ruta"] || "No disponible";

                // Crear fila de la tabla
                var trRegistro = document.createElement("tr");
                trRegistro.innerHTML = `
                    <td>${num_comision}</td>
                    <td>${nombre_usuario}</td>
                    <td>${cargo}</td>
                    <td>${centro}</td>
                    <td>${fecha_inicio}</td>
                    <td>${fecha_fin}</td>
                    <td>${ruta}</td>
                    <td class="text-center align-middle">
                        <i class="btn fa-regular fa-file-lines fa-lg Editar" style="color: #39a800;" onclick="openEditModal('${result[i]["id_viaje"]}')"></i>
                    </td>
                `;
                cuerpoTabla.appendChild(trRegistro);
            }
        },
        error: function (errorLista) {
            Swal.fire({
                title: "Error",
                text: "Hubo un error al cargar los datos. " + errorLista.responseText,
                icon: "error"
            });
        }
    });
}

$(document).ready(function () {
    document.getElementById("texto").addEventListener("input", listarViajesAdmin);

    listarViajesAdmin();
});

function openEditModal(id) {
    $.ajax({
        url: urlIdViaje + id,
        type: 'GET',
        success: function (data) {
            // Llenar los campos del formulario con los datos del usuario
            document.getElementById('viajeId').value = data.id_viaje;
            document.getElementById('num_comisionE').value = data.num_comision;
            document.getElementById('fecha_inicioE').value = data.fecha_inicio;
            document.getElementById('fecha_finE').value = data.fecha_fin;
            document.getElementById('rutaE').value = data.ruta;
            document.getElementById('estado_viajeE').value = data.estado_viaje;

            // Abrir el modal
            $('#editViaje').modal('show');
        },
        error: function (error) {
            console.error('Error al obtener los datos del viaje:', error);
        }
    });
}

function guardarCambios() {
    var id = document.getElementById('viajeId').value;
    var num_comisionE = document.getElementById('num_comisionE').value;
    var fecha_inicioE = document.getElementById('fecha_inicioE').value;
    var fecha_finE = document.getElementById('fecha_finE').value;
    var rutaE = document.getElementById('rutaE').value;
    var estado_viajeE = document.getElementById('estado_viajeE').value;

    // Verificar si el estado ya fue cancelado antes
    var estadoAnterior = document.getElementById('estado_viajeE').getAttribute('data-estado-anterior');

    if (estadoAnterior === "cancelado") {
        Swal.fire({
            title: "Acción no permitida",
            text: "No puedes modificar el estado después de haberlo cambiado a 'Cancelado'.",
            icon: "warning",
        });
        return; // Detener ejecución
    }

    if (estado_viajeE === "cancelado") {
        Swal.fire({
            title: "Confirmación",
            text: "Solo puedes cancelar el viaje una vez. ¿Estás seguro?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, cancelar",
            cancelButtonText: "No",
        }).then((result) => {
            if (result.isConfirmed) {
                // Marcar el estado como cancelado definitivamente
                document.getElementById('estado_viajeE').setAttribute('data-estado-anterior', "cancelado");

                // Continuar con la actualización
                enviarEdicion(id, num_comisionE, fecha_inicioE, fecha_finE, rutaE, estado_viajeE);
            }
        });
    } else {
        // Si el estado no es cancelado, proceder normalmente
        enviarEdicion(id, num_comisionE, fecha_inicioE, fecha_finE, rutaE, estado_viajeE);
    }
}

function enviarEdicion(id, num_comision, fecha_inicio, fecha_fin, ruta, estado_viaje) {
    var data = {
        num_comision: num_comision,
        fecha_inicio: fecha_inicio,
        fecha_fin: fecha_fin,
        ruta: ruta,
        estado_viaje: estado_viaje,
    };

    $.ajax({
        url: urlEditarViaje + id,
        type: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: function (response) {
            Swal.fire({
                title: "Éxito",
                text: "Viaje actualizado con éxito",
                icon: "success",
            });
            $('#editViaje').modal('hide');
            listarViajes();
            listarViajesAdmin();
        },
        error: function (xhr, status, error) {
            console.error('Error al actualizar el viaje:', xhr.responseText, status, error);
            Swal.fire({
                title: "Error",
                text: "Hubo un error al actualizar los datos: " + xhr.responseText,
                icon: "error"
            });
        }
    });
}

//Validacion número de comisión
function validateNumComision() {
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
function validateFecha() {
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
function validateFechaFin() {
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
function validateRuta() {
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