// Importar las funciones necesarias de Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getAuth} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
import { getFirestore, doc, collection, onSnapshot, updateDoc, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyCKTJxwwP2roq8DioEyhrBWMNN34f2JB6Y",
    authDomain: "lcd-contabilidad.firebaseapp.com",
    projectId: "lcd-contabilidad",
    storageBucket: "lcd-contabilidad.firebasestorage.app",
    messagingSenderId: "289220346007",
    appId: "1:289220346007:web:b9034c2734e3602830a9d2",
    measurementId: "G-2LDHTHRHNY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth=getAuth();
const db=getFirestore();

const modal = document.getElementById("myModal");

//Lista de usuarios
function listaUsuarios(){
    const tablaUsuario = document.getElementById("userTable").getElementsByTagName("tbody")[0];
    tablaUsuario.innerHTML = "";

    const userCollection = collection(db, "users");
    onSnapshot(userCollection, (snapshot) => {
        snapshot.forEach((doc) => {
            const userData = doc.data();
            const row = tablaUsuario.insertRow();

            if (!userData.estado) {
                row.style.backgroundColor = "lightgray";
            }

            row.insertCell(0).textContent = doc.id;
            row.insertCell(1).textContent = userData.num_documento;
            row.insertCell(2).textContent = userData.nombre_usuario;
            row.insertCell(3).textContent = userData.email;
            row.insertCell(4).textContent = userData.centro;
            row.insertCell(5).textContent = userData.cargo;
            row.insertCell(6).textContent = userData.rol;
            row.insertCell(7).textContent = userData.estado ? "Activo" : "Deshabilitado";
            
            // Crear celda para botones
            let celdaOpcion = document.createElement("td");

           
            let botonEditar = document.createElement("btn");
            botonEditar.className = 'bx bx-edit-alt bx-sm';
            botonEditar.style.cursor = "pointer";
            botonEditar.style.color = "orange";
            botonEditar.style.justifyContent = "center";

            botonEditar.onclick = () => {
                document.getElementById("num_documentoU").value = userData.num_documento;
                document.getElementById("nombreCompletoU").value = userData.nombre_usuario;
                document.getElementById("correo_usuarioU").value = userData.email;
                document.getElementById("centroU").value = userData.centro;
                document.getElementById("cargoU").value = userData.cargo;
                document.getElementById("rolU").value = userData.rol;
                document.getElementById("contrasenaU").value = userData.password;
                document.getElementById("confirm_contraU").value = userData.confirm_contra;

                //Guardar el id del usuario en el modal
                document.getElementById("modalEditId").value = doc.id;

                //Abrir modal con boostrab y JQuery
                const modal = new bootstrap.Modal(document.getElementById('myModalEdit'));
                modal.show();   
            };

            // Botón Habilitar/Deshabilitar
            let botonHabilitarDeshabilitar = document.createElement("btn");
            botonHabilitarDeshabilitar.style.cursor = "pointer";
            botonHabilitarDeshabilitar.onclick = async () => {
                // Alternar el estado del usuario
                const nuevoEstado = !userData.estado;
                await updateDoc(doc.ref, { estado: nuevoEstado });

                row.style.backgroundColor = nuevoEstado ? "" : "red"; // Cambiar a gris si se deshabilita

                if (nuevoEstado) {
                    botonHabilitarDeshabilitar.className = 'bx bxs-toggle-left bx-sm';
                    botonHabilitarDeshabilitar.style.color = "#39A800";
                    botonHabilitarDeshabilitar.title = "Deshabilitar usuario";
                } else {
                    botonHabilitarDeshabilitar.className = 'bx bxs-toggle-right bx-sm';
                    botonHabilitarDeshabilitar.style.color = "grey";
                    botonHabilitarDeshabilitar.title = "Habilitar usuario";
                }

                Swal.fire({
                    title: "!Éxito!",
                    text: nuevoEstado ? "El usuario ha sido habilitado" : "El usuario ha sido deshabilitado",
                    icon: "success",
                    confirmButtonColor: "#00BB00",
                });
            };

            // Establecer el ícono inicial según el estado del usuario
            botonHabilitarDeshabilitar.className = userData.estado ? 'bx bxs-toggle-left bx-sm' : 'bx bxs-toggle-right bx-sm'; // Cambiar ícono
            botonHabilitarDeshabilitar.style.color = userData.estado ? "#39A800" : "grey"; // Cambiar color inicial
            botonHabilitarDeshabilitar.title = userData.estado ? "Deshabilitar usuario" : "Habilitar usuario"; // Cambiar título

            celdaOpcion.appendChild(botonEditar);
            celdaOpcion.appendChild(document.createTextNode(""));
            celdaOpcion.appendChild(botonHabilitarDeshabilitar);
            row.appendChild(celdaOpcion);
        });
    });
}

listaUsuarios();

//Asignar el id al botón "Guardar"
document.getElementById("editarUsuario").addEventListener("click", async (event) => {
    event.preventDefault();

    const id = document.getElementById("modalEditId").value;
    const num_documento = document.getElementById("num_documentoU").value;
    const nombre_usuario = document.getElementById("nombreCompletoU").value;
    const correo_usuario = document.getElementById("correo_usuarioU").value;
    const centro = document.getElementById("centroU").value;
    const cargo = document.getElementById("cargoU").value;
    const rol = document.getElementById("rolU").value;
    const contrasena = document.getElementById("contrasenaU").value;
    const confirm_contra = document.getElementById("confirm_contraU").value;

    //Actualizar los datos de los usuarios en la tabla users
    const userRef = doc(db, "users", id);
    await updateDoc(userRef, {
        num_documento,
        nombre_usuario,
        correo_usuario,
        centro,
        cargo,
        rol,
        contrasena,
        confirm_contra
    });

    //Cierra el modal una vez se actualizar el usuario
    const modal = bootstrap.Modal.getInstance(document.getElementById('myModalEdit'));
    modal.hide();

    Swal.fire({
        title: "!Éxito!",
        text: "Los cambios se han guardado",
        icon: "success",
        confirmButtonColor: "#00BB00",
    });
});

// Función para filtrar usuarios
async function filtrarUsuarios(nombre, correo, documento) {
    const userCollection = collection(db, "users");
    const q = query(
        userCollection,
        where("nombre_usuario", "==", nombre),
        where("email", "==", correo),
        where("num_documento", "==", documento)
    );

    try {
        const querySnapshot = await getDocs(q);
        const usuariosFiltrados = [];

        // Recorrer los documentos filtrados
        querySnapshot.forEach((doc) => {
            usuariosFiltrados.push({ id: doc.id, ...doc.data() });
        });

        // Actualizar la tabla con los resultados filtrados
        actualizarTabla(usuariosFiltrados);
    } catch (error) {
        console.error("Error al filtrar usuarios:", error);
    }
}

// Función para actualizar la tabla con los usuarios filtrados
function actualizarTabla(usuarios) {
    const tablaUsuario = document.getElementById("userTable").getElementsByTagName("tbody")[0];
    tablaUsuario.innerHTML = ""; // Limpiar la tabla

    usuarios.forEach((usuario) => {
        const row = tablaUsuario.insertRow();
        row.insertCell(0).textContent = usuario.id;
        row.insertCell(1).textContent = usuario.num_documento;
        row.insertCell(2).textContent = usuario.nombre_usuario;
        row.insertCell(3).textContent = usuario.email;
        row.insertCell(4).textContent = usuario.centro;
        row.insertCell(5).textContent = usuario.cargo;
        row.insertCell(6).textContent = usuario.rol;
        row.insertCell(7).textContent = usuario.estado ? "Activo" : "Deshabilitado";
    });
}

// Ejemplo de uso
const filtrarUser  = document.getElementById("filtrar");
filtrarUser .addEventListener("click", (event) => {
    event.preventDefault(); // Prevenir el comportamiento por defecto del botón
    const nombre = document.getElementById("nombreInput").value; // Suponiendo que tienes un input para el nombre
    const correo = document.getElementById("correoInput").value; // Suponiendo que tienes un input para el correo
    const documento = document.getElementById("documentoInput").value; // Suponiendo que tienes un input para el documento

    filtrarUsuarios(nombre, correo, documento);
});


//Limpia los campos de el modal
const limpiar = document.getElementById("limpiarEditar");
limpiar.addEventListener("click", (event) => {
    event.preventDefault();
    document.getElementById("nombreCompletoU").value = "";
    document.getElementById("num_documentoU").value = "";
    document.getElementById("centroU").value = "";
    document.getElementById("cargoU").value = "";
    document.getElementById("correo_usuarioU").value = "";
});

document.getElementById("filtrar").addEventListener("click", function() {
    const searchValue = document.getElementById("searchInput").value;
    filtrarUsuarios(searchValue);
});

document.getElementById("searchInput").addEventListener("input", function() {
    const searchValue = this.value;
    filtrarUsuarios(searchValue);
});