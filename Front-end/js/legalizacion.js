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
        success: function (result) {
            Swal.fire({
                title: "¡Éxito!",
                text: "Legalización registrada correctamente.",
                icon: "success",
            }).then(() => {
                $('#legaRegister').modal('hide');
                listarLegalizacion(); // Si querés refrescar la tabla luego de registrar
            });
        },
        error: function (xhr, status, error) {
            console.log("Error en la petición:", xhr.responseText);
            Swal.fire({
                title: "¡Error!",
                text: "No se pudo registrar la legalización. Verifica tu sesión e intenta nuevamente.",
                icon: "error"
            });
        }      
    });
}

function cargarFormulario() {
    cargarViaje();
}

function cargarViaje() {
    let urlListaViaje = "http://localhost:8080/api/v1/LCDSena/viaje/usuario";
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

// Función para listar legalizaciones Usuario
function listarLegalizacion() {
    // var filtro = document.getElementById("texto").value;
    var estado = document.getElementById("estadoFilter").value;

    var urlListaFiltros = "";

    if (estado !== "") {
        urlListaFiltros = urlFiltroLega + "busqueda/estado/" + estado;
    } else {
        urlListaFiltros = urlListaLega;
    }

    $.ajax({
        url: urlListaFiltros,
        type: "GET",
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("userToken") // asegúrate de guardar el token al iniciar sesión
        },
        success: function (result) {
            var cuerpoTabla = document.getElementById("legaTable").getElementsByTagName('tbody')[0];
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
                var viaje = result[i]["viaje"] || {}; // Verificar si el usuario existe
                
                // Asignar valores predeterminados si no están disponibles
                var num_comision = viaje["num_comision"] || "No disponible";
                var fecha_inicio = viaje["fecha_inicio"] || "No disponible";
                var fecha_fin = viaje["fecha_fin"] || "No disponible";
                var ruta = viaje["ruta"] || "No disponible";
                var moti_devolucion = result[i]["moti_devolucion"] || "Ninguna";
                var estado_lega = result[i]["estado_lega"] || "No disponible";

                // Crear fila de la tabla
                var trRegistro = document.createElement("tr");
                trRegistro.innerHTML = `
                    <td>${num_comision}</td>
                    <td>${fecha_inicio}</td>
                    <td>${fecha_fin}</td>
                    <td>${ruta}</td>
                    <td>${moti_devolucion}</td>
                    <td>${estado_lega}</td>
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

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("estadoFilter").addEventListener("change", listarLegalizacion);
});

function openEditModal(id) {
    $.ajax({
        url: urlIdLega + id,
        type: 'GET',
        success: function (data) {
            if (!data) {
                console.error("No se recibieron datos válidos.");
                return;
            }

            const usuario = data.usuario || {};
            const viaje = data.viaje || {};

            document.getElementById('legaId').value = data.id_legalizacion || ""; // Establecer ID en el campo oculto
            document.getElementById('num_comisionE').value = viaje.num_comision || "";
            document.getElementById('nombre_usuarioE').value = usuario.nombre_usuario || "No disponible";
            document.getElementById('fecha_inicioE').value = viaje.fecha_inicio || "";
            document.getElementById('fecha_finE').value = viaje.fecha_fin || "";
            document.getElementById('rutaE').value = viaje.ruta || "";
            document.getElementById('moti_devolucionE').value = data.moti_devolucion || "";

            document.getElementById('downloadButton').setAttribute('data-id', data.id_legalizacion);

            $('#editLegalizacion').modal('show');
        },
        error: function (error) {
            console.error('Error al obtener los datos de la legalización:', error);
        }
    });
}


function getSelectedLegalizacionId() {
    return document.getElementById('downloadButton').getAttribute('data-id');
}

document.getElementById("downloadButton").addEventListener("click", function () {
    const selectedId = getSelectedLegalizacionId(); // Obtener el ID de la legalización seleccionada
    if (selectedId) {
        window.location.href = `http://localhost:8080/api/v1/LCDSena/legalizacion/download/${selectedId}`; // Asegúrate de que la URL sea correcta
    } else {
        console.error("ID de legalización no disponible.");
    }
});

function actualizarLegalizacion() {
    const id = $("#legaId").val(); // Recupera el ID del campo oculto
    const motivo = $("#moti_devolucionE").val(); // Asegúrate de usar el valor correcto del campo
    const archivo = $("#file")[0].files[0];
    const archivoEliminado = $("#archivoEliminado").val() === "true";

    const formData = new FormData();
    formData.append("moti_devolucion", motivo);
    formData.append("archivoEliminado", archivoEliminado);
    if (archivo) {
        formData.append("archivo", archivo);
    }

    $.ajax({
        url: `http://localhost:8080/api/v1/LCDSena/legalizacion/profile/${id}`,
        type: "PUT",
        data: formData,
        processData: false,
        contentType: false,
        success: function (response) {
            console.log("Actualización exitosa", response);
            $('#editLegalizacion').modal('hide'); // Cierra el modal
            listarLegalizacion(); // Recarga la lista de legalizaciones
        },
        error: function (xhr, status, error) {
            console.error("Error al actualizar:", xhr.responseText);
        }
    });
}

$("#removeFile").click(function () {
    $("#archivoEliminado").val("true");
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

function removeSelectedFileUpdate() {
    document.getElementById("file").value = "";
    document.getElementById("archivoEliminado").value = "true";
    document.getElementById("removeFile").classList.add("d-none");
}

document.addEventListener("DOMContentLoaded", function () {
    listarLegalizacion();
    cargarFormulario();
});