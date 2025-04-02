//Listado inicio admin
function listarInicioAdmin() {
    $.ajax({
        url: urlListaViajes,
        type: "GET",
        success: function (result) {
            var cuerpoTabla = document.getElementById("inicioAdminTable").getElementsByTagName('tbody')[0];
            cuerpoTabla.innerHTML = ""; // Limpiar la tabla antes de llenarla

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
                    <td>${estado_lega}</td>
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