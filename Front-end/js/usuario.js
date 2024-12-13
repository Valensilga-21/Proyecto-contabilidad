document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector(".needs-validation");

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    event.stopPropagation();

    let isValid = true;

    // Validar nombre de usuario
    const nombreUsuario = document.getElementById("nombre_usuario");
    if (nombreUsuario.value.trim() === "" || nombreUsuario.value.length > 100) {
      isValid = false;
      showError(nombreUsuario, "El nombre completo es obligatorio y debe tener hasta 100 caracteres.");
    } else {
      clearError(nombreUsuario);
    }

    // Validar cargo
    const cargo = document.getElementById("cargo");
    if (cargo.value === "") {
      isValid = false;
      showError(cargo, "Debe seleccionar un cargo.");
    } else {
      clearError(cargo);
    }

    // Validar documento
    const numDocumento = document.getElementById("num_documento");
    if (
      numDocumento.value.trim() === "" ||
      isNaN(numDocumento.value) ||
      numDocumento.value.length < 8 ||
      numDocumento.value.length > 11
    ) {
      isValid = false;
      showError(numDocumento, "El documento debe tener entre 8 y 11 caracteres numéricos.");
    } else {
      clearError(numDocumento);
    }

    // Validar contraseña
    const contra = document.getElementById("contra");
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    if (!passwordRegex.test(contra.value)) {
      isValid = false;
      showError(contra, "La contraseña debe tener al menos 8 caracteres, una letra mayúscula, un número y un carácter especial.");
    } else {
      clearError(contra);
    }

    // Validar confirmación de contraseña
    const confirmContra = document.getElementById("confirm_contra");
    if (confirmContra.value.trim() === "" || confirmContra.value !== contra.value) {
      isValid = false;
      showError(confirmContra, "Las contraseñas no coinciden.");
    } else {
      clearError(confirmContra);
    }

    // Validar correo electrónico
    const correoUsuario = document.getElementById("correo_usuario");
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (correoUsuario.value.trim() === "" || !emailRegex.test(correoUsuario.value)) {
      isValid = false;
      showError(correoUsuario, "Debe ingresar un correo electrónico válido.");
    } else {
      clearError(correoUsuario);
    }

    // Validar centro
    const centro = document.getElementById("centro");
    if (centro.value === "") {
      isValid = false;
      showError(centro, "Debe seleccionar un centro.");
    } else {
      clearError(centro);
    }

    if (isValid) {
      form.submit(); // Enviar el formulario si todo es válido
    }
  });

  function showError(input, message) {
    const parent = input.closest(".form-group");
    input.classList.add("is-invalid");
    let error = parent.querySelector(".invalid-feedback");
    if (!error) {
      error = document.createElement("div");
      error.className = "invalid-feedback";
      parent.appendChild(error);
    }
    error.textContent = message;
  }

  function clearError(input) {
    const parent = input.closest(".form-group");
    input.classList.remove("is-invalid");
    const error = parent.querySelector(".invalid-feedback");
    if (error) {
      parent.removeChild(error);
    }
  }
});
 