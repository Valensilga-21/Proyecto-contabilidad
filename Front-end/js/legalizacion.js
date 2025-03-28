function seleccionarViaje(viaje) {
    let viajesGuardados = localStorage.getItem("viajes");
    let viajes = viajesGuardados ? JSON.parse(viajesGuardados) : [];

    // Agregar el nuevo viaje solo si no está en la lista
    if (!viajes.some(v => v.id_viaje === viaje.id_viaje)) {
        viajes.push(viaje);
        localStorage.setItem("viajes", JSON.stringify(viajes));
    }
}

// Función para cargar los viajes almacenados en el select
function cargarOpcionesDeViaje() {
    let viajesGuardados = localStorage.getItem("viajes");
    let viajes = viajesGuardados ? JSON.parse(viajesGuardados) : [];

    let selectViaje = document.getElementById("id_viaje"); // Asegúrate de que el ID sea el correcto
    selectViaje.innerHTML = "<option value=''>Seleccione una comisión</option>"; 

    viajes.forEach(viaje => {
        let option = document.createElement("option");
        option.value = viaje.id_viaje;
        option.textContent = `Comisión #${viaje.numero_comision} - ID: ${viaje.id_viaje}`;
        selectViaje.appendChild(option);
    });
}


// Función para registrar la legalización
function registrarLegalizacion() {
    var token = localStorage.getItem("userToken");
    var userId = localStorage.getItem("userId");

    if (!token || !userId) {
        Swal.fire("¡Error!", "Debe iniciar sesión.", "error");
        return;
    }

    // Obtener el viaje seleccionado
    var selectViaje = document.getElementById("id_viaje");
    var viajeId = selectViaje.value;

    if (!viajeId) {
        Swal.fire("¡Error!", "Seleccione un viaje antes de registrar.", "error");
        return;
    }

    var fileInput = document.getElementById("file");
    var file = fileInput.files[0];

    if (!file) {
        Swal.fire("¡Error!", "Debe subir un archivo.", "error");
        return;
    }

    var formData = new FormData();
    formData.append("moti_devolucion", document.getElementById("moti_devolucion").value.trim());
    formData.append("fecha_soli", document.getElementById("fecha_soli").value);
    formData.append("estado_lega", document.getElementById("estado_lega").value);
    formData.append("file", file);
    formData.append("id_usuario", userId);
    formData.append("id_viaje", viajeId);

    $.ajax({
        url: "http://localhost:8080/api/v1/LCDSena/legalizacion/?" + new Date().getTime(),
        type: "POST",
        data: formData,
        processData: false,
        contentType: false,
        headers: { "Authorization": "Bearer " + token },
        success: function(result) {
            Swal.fire("¡Éxito!", "Legalización registrada correctamente.", "success");
            $('#legaRegister').modal('hide');
            console.log("Legalización guardada para el viaje:", viajeId);
        },
        error: function(xhr, status, error) {
            Swal.fire("¡Error!", "No se pudo registrar la legalización.", "error");
            console.log("Error en la petición:", xhr.responseText);
        }
    });
}

function cargarFormulario() {
    cargarViaje();
}

function cargarViaje() {
    let urlViaje = "http://localhost:8080/api/v1/LCDSena/viaje/listaViajes";
    $.ajax({
        url: urlViaje,
        type: "GET",
        success: function (result) {
            let selectViaje = document.getElementById("id_viaje");
            selectViaje.innerHTML = "<option value=''>Seleccione una comisión</option>"; 
        
            result.forEach(viaje => {
                let option = document.createElement("option");
                option.value = viaje.id_viaje;
                option.textContent = viaje.num_comision;
                selectViaje.appendChild(option);
            });
        
            selectViaje.addEventListener("change", function () {
                if (this.value) {
                    llenarDatosViaje(this.value);
                }
            });
        },
        error: function(xhr) {
            console.log("Error al cargar los viajes:", xhr.responseText);
        }
    });
}

function llenarDatosViaje(idViaje) {
    let urlDetalles = `http://localhost:8080/api/v1/LCDSena/viaje/${idViaje}`;
    
    $.ajax({
        url: urlDetalles,
        type: "GET",
        success: function (data) {
            document.getElementById("fecha_inicio").value = data.fecha_inicio;
            document.getElementById("fecha_fin").value = data.fecha_fin;
            document.getElementById("ruta").value = data.ruta;
        },
        error: function(xhr) {
            console.log("Error al obtener los detalles del viaje:", xhr.responseText);
        }
    });
}

// Función para listar legalizaciones
function listarLegalizacion() {
    $.ajax({
        url: urlListaLega,
        type: "GET",
        success: function (result) {
            var cuerpoTabla = document.getElementById("legaTable").getElementsByTagName('tbody')[0];
            cuerpoTabla.innerHTML = ""; // Limpiar la tabla antes de llenarla

            for (var i = 0; i < result.length; i++) {
                var usuario = result[i]["usuario"] || {}; // Verificar si el usuario existe
                
                // Asignar valores predeterminados si no están disponibles
                var nombre_usuario = usuario["nombre_usuario"] || "No disponible";
                var username = usuario["username"] || "No disponible";
                var cargo = usuario["cargo"] || "No disponible";
                var centro = usuario["centro"] || "No disponible";
                var fecha_soli = result[i]["fecha_soli"] || "No disponible";

                // Crear fila de la tabla
                var trRegistro = document.createElement("tr");
                trRegistro.innerHTML = `
                    <td>${nombre_usuario}</td>
                    <td>${username}</td>
                    <td>${cargo}</td>
                    <td>${centro}</td>
                    <td>${fecha_soli}</td>
                    <td class="text-center align-middle">
                        <i class="btn fas fa-edit Editar text-warning" onclick="openEditModal('${result[i]["id_legalizacion"]}')"></i>
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

function openEditModal(id) {
    $.ajax({
        url: urlIdLega + id,
        type: 'GET',
        success: function (data) {
            if (!data) {
                console.error("No se recibieron datos válidos.");
                return;
            }

            // Verificar si `usuario` y `viaje` existen en la respuesta
            var usuario = data.usuario || {}; 
            var viaje = data.viaje || {}; 

            // Llenar los campos del formulario con los datos obtenidos
            document.getElementById('legaId').value = data.id_legalizacion || "";
            document.getElementById('num_comisionE').value = viaje.num_comision || "";
            document.getElementById('nombre_usuarioE').value = usuario.nombre_usuario || "No disponible";
            document.getElementById('fecha_inicioE').value = viaje.fecha_inicio || "";
            document.getElementById('fecha_finE').value = viaje.fecha_fin || "";
            document.getElementById('rutaE').value = viaje.ruta || "";
            document.getElementById('fileE').value = data.file || "";

            // Abrir el modal
            $('#editLegalizacion').modal('show');
        },
        error: function (error) {
            console.error('Error al obtener los datos de la legalización:', error);
        }
    });
}

//Input subir archivo
const fileInput = document.getElementById("file");
const removeButton = document.getElementById("removeFile");
const fileNameDisplay = document.getElementById("fileName");

fileInput.addEventListener("change", function () {
    if (this.files.length > 0) {
        fileNameDisplay.textContent = `Archivo seleccionado: ${this.files[0].name}`;
        removeButton.classList.remove("d-none"); // Mostrar botón "Quitar"
    } else {
        fileNameDisplay.textContent = "";
        removeButton.classList.add("d-none"); // Ocultar botón "Quitar"
    }
});

function removeSelectedFile() {
    fileInput.value = ""; // Limpiar el input file
    fileNameDisplay.textContent = "";
    removeButton.classList.add("d-none"); // Ocultar botón "Quitar"
}

    document.addEventListener("DOMContentLoaded", function() {
        listarLegalizacion();
        cargarFormulario();
    });

// function guardarCambios() {
//     var id = document.getElementById('viajeId').value;
//     var num_comisionE = document.getElementById('num_comisionE').value;
//     var fecha_inicioE = document.getElementById('fecha_inicioE').value;
//     var fecha_finE = document.getElementById('fecha_finE').value;
//     var rutaE = document.getElementById('rutaE').value;
//     var estado_viajeE = document.getElementById('estado_viajeE').value;

//     // Verificar si el estado ya fue cancelado antes
//     var estadoAnterior = document.getElementById('estado_viajeE').getAttribute('data-estado-anterior');

//     if (estadoAnterior === "cancelado") {
//         Swal.fire({
//             title: "Acción no permitida",
//             text: "No puedes modificar el estado después de haberlo cambiado a 'Cancelado'.",
//             icon: "warning",
//         });
//         return; // Detener ejecución
//     }

//     if (estado_viajeE === "cancelado") {
//         Swal.fire({
//             title: "Confirmación",
//             text: "Solo puedes cancelar el viaje una vez. ¿Estás seguro?",
//             icon: "warning",
//             showCancelButton: true,
//             confirmButtonText: "Sí, cancelar",
//             cancelButtonText: "No",
//         }).then((result) => {
//             if (result.isConfirmed) {
//                 // Marcar el estado como cancelado definitivamente
//                 document.getElementById('estado_viajeE').setAttribute('data-estado-anterior', "cancelado");

//                 // Continuar con la actualización
//                 enviarEdicion(id, num_comisionE, fecha_inicioE, fecha_finE, rutaE, estado_viajeE);
//             }
//         });
//     } else {
//         // Si el estado no es cancelado, proceder normalmente
//         enviarEdicion(id, num_comisionE, fecha_inicioE, fecha_finE, rutaE, estado_viajeE);
//     }
// }

// function enviarEdicion(id, num_comision, fecha_inicio, fecha_fin, ruta, estado_viaje) {
//     var data = {
//         num_comision: num_comision,
//         fecha_inicio: fecha_inicio,
//         fecha_fin: fecha_fin,
//         ruta: ruta,
//         estado_viaje: estado_viaje,
//     };

//     $.ajax({
//         url: urlEditarViaje + id,
//         type: 'PUT',
//         contentType: 'application/json',
//         data: JSON.stringify(data),
//         success: function (response) {
//             Swal.fire({
//                 title: "Éxito",
//                 text: "Viaje actualizado con éxito",
//                 icon: "success",
//             });
//             $('#editViaje').modal('hide');
//             listarViajes();
//         },
//         error: function (xhr, status, error) {
//             console.error('Error al actualizar el viaje:', xhr.responseText, status, error);
//             Swal.fire({
//                 title: "Error",
//                 text: "Hubo un error al actualizar los datos: " + xhr.responseText,
//                 icon: "error"
//             });
//         }
//     });
// }