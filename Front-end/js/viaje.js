// Importar las funciones necesarias de Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getFirestore, collection, addDoc, doc, onSnapshot, updateDoc } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";

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
const db = getFirestore();

const modal = document.getElementById("myModal");

const registrarViaje = async (viaje) => {
    try {
        const docRef = await addDoc(collection(db, "viajes"), viaje);
        Swal.fire({
            icon: "success",
            position: "top-end",
            title: "Tu viaje ha sido registrado exitosamente.",
            showConfirmButton: false,
            timer: 2000
        })
    } catch (error) {
        Swal.fire({
            title: "!Oops!",
            text: "Hubo un problema al enviar al registrar el viaje, por favor intentalo de nuevo.",
            icon: "error",
            confirmButtonColor: "#ff0000"
        })
    }
};

document.getElementById("registrar").addEventListener("click", () => {
    const num_comision = document.getElementById("noComision").value;
    const fecha_inicio = document.getElementById("fecha_inicio").value;
    const fecha_fin = document.getElementById("fecha_fin").value;
    const ruta = document.getElementById("ruta").value;
    const estado = document.getElementById("estado").value;

    const viaje = {
        num_comision,
        fecha_inicio,
        fecha_fin,
        ruta,
        estado
    };

    registrarViaje(viaje);
});



//Lista de viajes
function listaViajes(){
    const tablaViajes = document.getElementById("tablaViajes").getElementsByTagName("tbody")[0];
    tablaViajes.innerHTML = "";

    const viajesCollection = collection(db, "viajes");
    onSnapshot(viajesCollection, (snapshot) => {
        snapshot.forEach((doc) => {
            const viajesData = doc.data();
            const row = tablaViajes.insertRow();

            row.insertCell(0).textContent = doc.id;
            row.insertCell(1).textContent = viajesData.num_comision;
            row.insertCell(2).textContent = viajesData.fecha_inicio;
            row.insertCell(3).textContent = viajesData.fecha_fin;
            row.insertCell(4).textContent = viajesData.ruta;
            row.insertCell(5).textContent = viajesData.estado;
            
            // Crear celda para botones
            let celdaOpcion = document.createElement("td");
           
            let botonEditar = document.createElement("btn");
            botonEditar.className = 'bx bx-edit-alt bx-sm';
            botonEditar.style.cursor = "pointer";
            botonEditar.style.color = "orange";
            botonEditar.style.justifyContent = "center";

            botonEditar.onclick = () => {
                document.getElementById("num_comisionU").value = viajesData.num_comision;
                document.getElementById("fecha_inicioU").value = viajesData.fecha_inicio;
                document.getElementById("fecha_finU").value = viajesData.fecha_fin;
                document.getElementById("rutaU").value = viajesData.ruta;
                document.getElementById("estadoU").value = viajesData.estado;

                document.getElementById("modalEditId").value = doc.id;

                const modal = new bootstrap.Modal(document.getElementById('myModalEdit'));
                modal.show();   
            };

            celdaOpcion.appendChild(botonEditar);
            celdaOpcion.appendChild(document.createTextNode(""));
            row.appendChild(celdaOpcion);
        });
    });
}

listaViajes();

//Asignar el id al botón "Guardar"
document.getElementById("editarViaje").addEventListener("click", async (event) => {
    event.preventDefault();

    const id = document.getElementById("modalEditId").value;
    const num_comision = document.getElementById("num_comisionU").value;
    const fecha_inicio = document.getElementById("fecha_inicioU").value;
    const fecha_fin = document.getElementById("fecha_finU").value;
    const ruta = document.getElementById("rutaU").value;
    const estado = document.getElementById("estadoU").value;

    //Actualizar los datos de los usuarios en la tabla users
    const viajesRef = doc(db, "viajes", id);
    await updateDoc(viajesRef, {
        num_comision,
        fecha_inicio,
        fecha_fin,
        ruta,
        estado
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