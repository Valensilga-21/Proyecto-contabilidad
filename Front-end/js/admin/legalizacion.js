//------------------------------------------------------------------------------
//SECCION LEGALIZACION
//------------------------------------------------------------------------------

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
            Swal.fire({
                title: "¡Éxito!",
                text: "Legalización registrada correctamente.",
                icon: "success",
                timer: 1500,
                showConfirmButton: false
            }).then(() => {
                $('#legaRegister').modal('hide');
                listarLegalizaciones();
            });
        }        
    });
}

function cargarFormulario() {
    cargarViaje();
}

function cargarViaje() {
    let urlListaViaje = "http://localhost:8080/api/v1/LCDSena/viaje/";
    $.ajax({
        url: urlListaViaje,
        type: "GET",
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("userToken")
        },
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

// Función para listar legalizaciones Admin
function listarLegalizacionAdmin() {

    var filtro = document.getElementById("texto").value;
    var fecha_soli = document.getElementById("filtroFecha").value;
    var estadoL = document.getElementById("estadoFiltro").value;

    var urlListaLega = "";

    if(fecha_soli !== "") {
        urlListaLega = urlFiltroLega + "busqueda/fecha/" + fecha_soli;
    } else if (estadoL !== "") {
        urlListaLega = urlFiltroLega + "busqueda/estadosA/" + estadoL;
    } else if (filtro !== "") {
        urlListaLega = urlFiltroLega + "busquedaFiltro/" + filtro;
    }else {
        urlListaLega = urlFiltroLega;
    }
    
    $.ajax({
        url: urlListaLega,
        type: "GET",
        success: function (result) {
            var cuerpoTabla = document.getElementById("legaTableAdmin").getElementsByTagName('tbody')[0];
            var mensaje = document.getElementById("mensajeSinResultados");

            cuerpoTabla.innerHTML = ""; // Limpiar la tabla
        
            if (result.length === 0) {
                // Mostrar mensaje fuera de la tabla
                mensaje.style.display = "block";
                return;
            }
        
            // Ocultar el mensaje si hay resultados
            mensaje.style.display = "none";

            for (var i = 0; i < result.length; i++) {
                var usuario = result[i]["usuario"] || {}; // Verificar si el usuario existe
                var viajeA = result[i]["viaje"] || {};
                
                // Asignar valores predeterminados si no están disponibles
                var num_comision = viajeA["num_comision"] || "No disponible";
                var nombre_usuario = usuario["nombre_usuario"] || "No disponible";
                var cargo = usuario["cargo"] || "No disponible";
                var centro = usuario["centro"] || "No disponible";
                var fecha_soli = result[i]["fecha_soli"] || "No disponible";
                var estado_lega = result[i]["estado_lega"] || "No disponible";

                // Crear fila de la tabla
                var trRegistro = document.createElement("tr");
                trRegistro.innerHTML = `
                    <td>${num_comision}</td>
                    <td>${nombre_usuario}</td>
                    <td>${cargo}</td>
                    <td>${centro}</td>
                    <td>${fecha_soli}</td>
                    <td>${estado_lega}</td>
                    <td class="text-center align-middle">
                        <i class="btn fa-regular fa-file-lines fa-lg Editar" style="color: #39a800;" onclick="openEditModalL('${result[i]["id_legalizacion"]}')"></i>
                    </td>
                `;
                cuerpoTabla.appendChild(trRegistro);
            }
        },
        error: function (errorLista) {
            Swal.fire({
                title: "Error",
                text: "Hubo un error al cargar los datos.",
                icon: "error"
            });
        }
    });
}

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("filtroFecha").addEventListener("change", listarLegalizacionAdmin);
    document.getElementById("estadoFiltro").addEventListener("change", listarLegalizacionAdmin);
    document.getElementById("texto").addEventListener("input", listarLegalizacionAdmin);
});

function limpiar() {
    document.getElementById("filtroFecha").value = "";
    listarLegalizacionAdmin();
}

//Método para aprobar la legalizacion
function cambiaEstadoAprobada(nuevoEstado) {
    var idLegalizacion = document.getElementById('legaId').value;

    $.ajax({
        url: urlIdLega + idLegalizacion + "/estado",
        type: "PUT",
        contentType: "application/json",
        data: JSON.stringify({ estado: nuevoEstado }),
        success: function (response) {
            $('#editLegalizacion').modal('hide');
            listarLegalizacionAdmin();
            Swal.fire({
                title: "Éxito",
                text: "La legalización ha sido " + nuevoEstado.toLowerCase() + ".",
                icon: "success"
            });
        },
        error: function (error) {
            Swal.fire({
                title: "Error",
                text: "No se pudo cambiar el estado: " + error.responseText,
                icon: "error"
            });
        }
    });
}

function cambiaEstadoRechazada() {
    var idLegalizacion = document.getElementById('legaId').value;
    var motivo = document.getElementById('moti_devolucionE').value;

    if (!motivo || motivo.trim() === "") {
        Swal.fire({
            title: "Campo requerido",
            text: "Por favor ingresa el motivo de la devolución.",
            icon: "warning"
        });
        return;
    }

    $.ajax({
        url: urlIdLega + idLegalizacion + "/estado/rechazar",
        type: "PUT",
        contentType: "application/json",
        data: JSON.stringify({ moti_devolucion: motivo }), // <-- corregido aquí
        success: function (response) {
            Swal.fire({
                title: "Éxito",
                text: "La legalización ha sido rechazada.",
                icon: "success"
            }).then(() => {
                $('#editLegalizacion').modal('hide');
                listarLegalizacionAdmin();
            })
        },
        error: function (error) {
            Swal.fire({
                title: "Error",
                text: "No se pudo cambiar el estado: " + error.responseText,
                icon: "error"
            });
        }
    });
}

function openEditModalL(id) {
    $.ajax({
        url: urlIdLega + id,
        type: 'GET',
        success: function (data) {
            if (!data) {
                console.error("No se recibieron datos válidos.");
                return;
            }

            var usuario = data.usuario || {}; 
            var viaje = data.viaje || {}; 

            // Llenar los campos del formulario
            document.getElementById('legaId').value = data.id_legalizacion || "";
            document.getElementById('num_comisionE').value = viaje.num_comision || "";
            document.getElementById('nombre_usuarioE').value = usuario.nombre_usuario || "No disponible";
            document.getElementById('fecha_inicioE').value = viaje.fecha_inicio || "";
            document.getElementById('fecha_finE').value = viaje.fecha_fin || "";
            document.getElementById('rutaE').value = viaje.ruta || "";
            document.getElementById('moti_devolucionE').value = data.moti_devolucion || "";

            // Establecer el ID de la legalización en el botón de descarga
            document.getElementById('downloadButton').setAttribute('data-id', data.id_legalizacion);

            // Abrir el modal
            $('#editLegalizacion').modal('show');
        },
        error: function (error) {
            console.error('Error al obtener los datos de la legalización:', error);
        }
    });
}

// Función para obtener el ID de la legalización seleccionada
function getSelectedLegalizacionId() {
    return document.getElementById('downloadButton').getAttribute('data-id');
}

// Evento de descarga
document.getElementById("downloadButton").addEventListener("click", function() {
    const selectedId = getSelectedLegalizacionId(); // Obtener el ID de la legalización seleccionada
    if (selectedId) {
        window.location.href = `http://localhost:8080/api/v1/LCDSena/legalizacion/download/${selectedId}`; // Asegúrate de que la URL sea correcta
    } else {
        console.error("ID de legalización no disponible.");
    }
});

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
    listarLegalizacionAdmin();
    cargarFormulario();
});