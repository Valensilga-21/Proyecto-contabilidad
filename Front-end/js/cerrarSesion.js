function cerrarSesion() {
    // Mostrar la alerta de confirmación
    Swal.fire({
        title: "¿Estás seguro?",
        text: "¡No podrás revertir esto!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, cerrar sesión",
        cancelButtonText: "Cancelar"
    }).then((result) => {
        if (result.isConfirmed) {
            const token = localStorage.getItem('token');

            $.ajax({
                url: 'http://localhost:8080/api/v1/LCDSena/usuario/cerrar-sesion',
                type: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                success: function(response) {
                    // Eliminar el token del almacenamiento local
                    localStorage.removeItem('token');
                    // Redirigir a la página de inicio de sesión
                    window.location.href = '/Front-end/index.html';
                },
                error: function(xhr, status, error) {
                    console.error('Error:', error);
                    Swal.fire({
                        title: "Error",
                        text: "No se pudo cerrar sesión. Inténtalo de nuevo.",
                        icon: "error"
                    });
                }
            });
        }
    });
}

function verificarSesion() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/Front-end/index.html'; // Redirigir a la página de inicio de sesión
    }
}

// Llama a la función de verificación al cargar la página
document.addEventListener("DOMContentLoaded", verificarSesion);

window.addEventListener('popstate', function(event) {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = '/Front-end/index.html'; // Redirigir a la página de inicio de sesión
    }
});