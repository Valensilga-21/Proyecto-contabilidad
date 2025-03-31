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
            // Si el usuario confirma, proceder a cerrar sesión
            const token = localStorage.getItem('token');

            $.ajax({
                url: 'http://localhost:8080/api/v1/LCDSena/usuario/cerrar-sesion', // Cambia esto a la URL de tu API
                type: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                success: function(response) {
                    // Eliminar el token del almacenamiento local
                    localStorage.removeItem('token');
                    // Redirigir a la página de inicio de sesión
                    window.location.href = '/Front-end/index.html'; // Cambia esto a la ruta de tu página de inicio de sesión
                },
                error: function(xhr, status, error) {
                    console.error('Error:', error);
                    // Aquí puedes manejar el error si es necesario
                }
            });
        }
    });
}