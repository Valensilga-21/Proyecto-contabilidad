var urlBase = "http://localhost:8080/api/v1/LCDSena/";

//User
var urlUsuario = urlBase + "usuario/"
var urlRegistro = urlBase + "publico/usuario/"
var urlLogin = urlBase + "publico/usuario/"
var urlReporteUsarios = urlBase + "/pdfReporte/export-pdf";

// Restablecimiento contraseñas
var urlRestablecerContra = urlBase + "usuario/recuperarContrasena/";
var urlCambioRestablecerContrasena = urlBase + "usuario/cambioRestablecerContrasena/"

//Legalizacion
var urlLegalizacion = urlBase + "/legalizacion";

//Viaje
var urlViaje = urlBase + "/viaje";

var urlPdf = urlBase + "/Pdf"

document.addEventListener("DOMContentLoaded", function () {
    const buttons = document.querySelectorAll("button[data-accordion-target]");

    buttons.forEach(button => {
        button.addEventListener("click", function () {
            const targetId = this.getAttribute("data-accordion-target");
            const content = document.querySelector(targetId);
            const icon = this.querySelector("svg");

            // Cerrar todos los demás acordeones antes de abrir uno nuevo
            document.querySelectorAll("[id^='accordion-collapse-body']").forEach(item => {
                if (item !== content) {
                    item.classList.add("hidden");
                    const btn = document.querySelector(`button[data-accordion-target="#${item.id}"] svg`);
                    btn?.classList.remove("rotate-180");
                }
            });

            // Alternar visibilidad del contenido actual
            content.classList.toggle("hidden");

            // Rotar el ícono al abrir/cerrar
            icon.classList.toggle("rotate-180");
        });
    });
});
