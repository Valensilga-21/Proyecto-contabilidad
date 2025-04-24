//Listado inicio admin
function listarInicioAdmin() {
    $.ajax({
        url: urlListaViajes,
        type: "GET",
        success: function (result) {
            console.log("Respuesta recibida:", result);
            var cuerpoTabla = document.getElementById("inicioAdminTable").getElementsByTagName('tbody')[0];
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
                var legalizacion = result[i]["legalizacion"] || {};
                var usuario = result[i]["usuario"] || {}; // Verificar si el usuario existe
                
                // Asignar valores predeterminados si no están disponibles
                var num_comision = result[i]["num_comision"] || "No disponible";
                var nombre_usuario = usuario["nombre_usuario"] || "No disponible";
                var fecha_inicio = result[i]["fecha_inicio"] || "No disponible";
                var fecha_fin = result[i]["fecha_fin"] || "No disponible";
                var ruta = result[i]["ruta"] || "No disponible";
                var moti_devolucion = legalizacion["moti_devolucion"] || "Ninguna";
                var estado_lega = legalizacion["estado_lega"] || "No disponible";

                // Crear fila de la tabla
                var trRegistro = document.createElement("tr");
                trRegistro.innerHTML = `
                    <td>${num_comision}</td>
                    <td>${nombre_usuario}</td>
                    <td>${fecha_inicio}</td>
                    <td>${fecha_fin}</td>
                    <td>${ruta}</td>
                    <td>${moti_devolucion}</td>
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

//Listado inicio usuario
function listarInicioUser() {
    $.ajax({
        url: urlListaViajes + "usuario",
        type: "GET",
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("userToken")
        },
        success: function (result) {
            console.log("Respuesta recibida:", result);
            var cuerpoTabla = document.getElementById("inicioUserTable").getElementsByTagName('tbody')[0];
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
                var legalizacionU = result[i]["legalizacion"] || {};
                
                // Asignar valores predeterminados si no están disponibles
                var num_comisionU = result[i]["num_comision"] || "No disponible";
                var fecha_inicioU = result[i]["fecha_inicio"] || "No disponible";
                var fecha_finU = result[i]["fecha_fin"] || "No disponible";
                var rutaU = result[i]["ruta"] || "No disponible";
                var moti_devolucionU = legalizacionU["moti_devolucion"] || "Ninguna";
                var estado_legaU = legalizacionU["estado_lega"] || "No disponible";

                // Crear fila de la tabla
                var trRegistro = document.createElement("tr");
                trRegistro.innerHTML = `
                    <td>${num_comisionU}</td>
                    <td>${fecha_inicioU}</td>
                    <td>${fecha_finU}</td>
                    <td>${rutaU}</td>
                    <td>${moti_devolucionU}</td>
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

//Contadores Admin
async function obtenerContadores() {
    try {
        let registradas = await fetch(urlCompletas).then(res => res.json());
        let pendientes = await fetch(urlPendientes).then(res => res.json());
        let vencidas = await fetch(urlVencidas).then(res => res.json());

        document.getElementById('registradas').innerText = `${registradas}`;
        document.getElementById('pendientes').innerText = `${pendientes}`;
        document.getElementById('vencidas').innerText = `${vencidas}`;
    } catch (error) {
        console.error("Error obteniendo los contadores:", error);
    }
}

// Llamar a la función cuando se cargue la página
document.addEventListener('DOMContentLoaded', obtenerContadores);
