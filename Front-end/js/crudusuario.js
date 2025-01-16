// Importar las funciones necesarias de Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getAuth,} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
import { getFirestore, doc, collection, onSnapshot, updateDoc } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";

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

            // Cambiar el color de la fila si el usuario está deshabilitado
            if (!userData.isActive) {
                row.style.backgroundColor = "lightgray"; // Color gris para usuarios deshabilitados
            }

            row.insertCell(0).textContent = doc.id;
            row.insertCell(1).textContent = userData.num_documento;
            row.insertCell(2).textContent = userData.nombre_usuario;
            row.insertCell(3).textContent = userData.email;
            row.insertCell(4).textContent = userData.centro;
            row.insertCell(5).textContent = userData.cargo;
            row.insertCell(6).textContent = "Usuario";
            row.insertCell(7).textContent = userData.isActive ? "Activo" : "Deshabilitado";

            // Crear celda para botones
            let celdaOpcion = document.createElement("td");

            // Botón Editar
            let botonEditar = document.createElement("btn");
            botonEditar.className = 'bx bx-edit-alt';
            botonEditar.style.cursor = "pointer";
            botonEditar.style.color = "orange";
            botonEditar.onclick = () => {
                document.getElementById("num_documento").value = userData.num_documento;
                document.getElementById("nombre_usuario").value = userData.nombre_usuario;
                document.getElementById("email").value = userData.email;
                document.getElementById("centro").value = userData.centro;
                document.getElementById("cargo").value = userData.cargo;

                modal.style.display = "block";
            };

            // Botón Habilitar/Deshabilitar
            let botonHabilitarDeshabilitar = document.createElement("btn");
            botonHabilitarDeshabilitar.style.cursor = "pointer";
            botonHabilitarDeshabilitar.onclick = async () => {
                // Alternar el estado del usuario
                const nuevoEstado = !userData.isActive; // Cambiar el estado
                await updateDoc(doc.ref, { isActive: nuevoEstado }); // Actualizar en Firestore

                // Cambiar el color de la fila
                row.style.backgroundColor = nuevoEstado ? "" : "lightgray"; // Cambiar a gris si se deshabilita

                // Cambiar el ícono y el color según el estado
                if (nuevoEstado) {
                    botonHabilitarDeshabilitar.className = 'bx bxs-toggle-left';
                    botonHabilitarDeshabilitar.style.color = "#39A800";
                    botonHabilitarDeshabilitar.title = "Deshabilitar usuario";
                } else {
                    botonHabilitarDeshabilitar.className = 'bx bxs-toggle-right';
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
            botonHabilitarDeshabilitar.className = userData.isActive ? 'bx bxs-toggle-left' : 'bx bxs-toggle-right'; // Cambiar ícono
            botonHabilitarDeshabilitar.style.color = userData.isActive ? "#39A800" : "grey"; // Cambiar color inicial
            botonHabilitarDeshabilitar.title = userData.isActive ? "Deshabilitar usuario" : "Habilitar usuario"; // Cambiar título

            celdaOpcion.appendChild(botonEditar);
            celdaOpcion.appendChild(document.createTextNode(""));
            celdaOpcion.appendChild(botonHabilitarDeshabilitar);
            row.appendChild(celdaOpcion);
        })
    })
}

listaUsuarios();
