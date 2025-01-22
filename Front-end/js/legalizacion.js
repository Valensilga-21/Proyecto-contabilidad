// Importar las funciones necesarias de Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getFirestore, collection, query, getDocs, where, addDoc, onSnapshot, updateDoc, doc } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";

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

const registrarLegalizacion = async (num_comision) => {
    try {
        const viajesCollection = collection(db, "viajes");
        const q = query(viajesCollection, where ("num_comision", "==", num_comision));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            Swal.fire({
                title: "!Oops!",
                text: "No se encontró un viaje con ese número de comisión.",
                icon: "error",
                confirmButtonColor: "#ff0000"
            });
            return;
        }

        const viajeData = querySnapshot.docs[0].data();
        const viajeId = querySnapshot.docs[0].id;

        const legalizacion = {
            num_comision: viajeData.num_comision,
            fecha_inicio: viajeData.fecha_inicio,
            fecha_fin: viajeData.fecha_fin,
            ruta: viajeData.ruta,
            estado: viajeData.estado = "completada"
        };

        await addDoc(collection(db, "legalizaciones"), legalizacion);

        Swal.fire({
            icon: "success",
            position: "top-end",
            title: "Tu legalización ha sido registrada exitosamente.",
            showConfirmButton: false,
            timer: 2000
        });
    } catch (error) {
        Swal.fire({
            title: "!Oops!",
            text: "Hubo un problema al registrar la legalización, por favor intenta de nuevo.",
            icon: "error",
            confirmButtonColor: "#ff0000"
        });
    }      
};

document.getElementById("registrar").addEventListener("click", () => {
    const num_comision = document.getElementById("num_comision").value;
    registrarLegalizacion(num_comision);
})

const cargarComisiones = async () => {
    const viajesCollection = collection(db, "viajes");
    const querySnapshot = await getDocs(viajesCollection);
    const selectComision = document.getElementById("num_comision");

    querySnapshot.forEach((doc) => {
        const viajeData = doc.data();
        const option = document.createElement("option");
        option.value = viajeData.num_comision;
        option.textContent = viajeData.num_comision;
        selectComision.appendChild(option);
    });
};

cargarComisiones();

document.getElementById("num_comision").addEventListener("change", async (event) => {
    const num_comisionSeleccionada = event.target.value;

    // Buscar el viaje correspondiente
    const viajesCollection = collection(db, "viajes");
    const q = query(viajesCollection, where("num_comision", "==", num_comisionSeleccionada));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
        const viajeData = querySnapshot.docs[0].data();
        document.getElementById("fecha_inicio").value = viajeData.fecha_inicio;
        document.getElementById("fecha_fin").value = viajeData.fecha_fin;
        document.getElementById("ruta").value = viajeData.ruta;
        document.getElementById("estado").value = viajeData.estado;
    } else {
        // Limpiar los campos si no se encuentra el viaje
        document.getElementById("fecha_inicio").value = "";
        document.getElementById("fecha_fin").value = "";
        document.getElementById("ruta").value = "";
    }
});

//Lista de legalizaciones
function listaLegalizaciones(){
    const tablaLegalizaciones = document.getElementById("tablaLegalizaciones").getElementsByTagName("tbody")[0];
    tablaLegalizaciones.innerHTML = "";

    const legalizacionesCollection = collection(db, "legalizaciones");
    onSnapshot(legalizacionesCollection, (snapshot) => {
        snapshot.forEach((doc) => {
            const legalizacionesData = doc.data();
            const row = tablaLegalizaciones.insertRow();

            row.insertCell(0).textContent = doc.id;
            row.insertCell(1).textContent = legalizacionesData.num_comision;
            row.insertCell(2).textContent = legalizacionesData.fecha_inicio;
            row.insertCell(3).textContent = legalizacionesData.fecha_fin;
            row.insertCell(4)
            row.insertCell(5).textContent = legalizacionesData.estado;
            
            // Crear celda editar
            let celdaOpcion = document.createElement("td");
           
            let botonEditar = document.createElement("btn");
            botonEditar.className = 'bx bx-edit-alt bx-sm';
            botonEditar.style.cursor = "pointer";
            botonEditar.style.color = "orange";
            botonEditar.style.justifyContent = "center";

            botonEditar.onclick = () => {
                
                const cargarComisiones = async () => {
                    const viajesCollection = collection(db, "viajes");
                    const querySnapshot = await getDocs(viajesCollection);
                    const selectComision = document.getElementById("num_comisionU");
                
                    querySnapshot.forEach((doc) => {
                        const viajeData = doc.data();
                        const option = document.createElement("option");
                        option.value = viajeData.num_comision;
                        option.textContent = viajeData.num_comision;
                        selectComision.appendChild(option);
                    });
                };

                document.getElementById("num_comisionU").addEventListener("change", async (event) => {
                    const num_comisionSeleccionada = event.target.value;
                
                    // Buscar el viaje correspondiente
                    const viajesCollection = collection(db, "viajes");
                    const q = query(viajesCollection, where("num_comision", "==", num_comisionSeleccionada));
                    const querySnapshot = await getDocs(q);
                
                    if (!querySnapshot.empty) {
                        const viajeData = querySnapshot.docs[0].data();
                        document.getElementById("fecha_inicioU").value = viajeData.fecha_inicio;
                        document.getElementById("fecha_finU").value = viajeData.fecha_fin;
                        document.getElementById("rutaU").value = viajeData.ruta;
                        document.getElementById("estadoU").value = viajeData.estado;
                    } else {
                        // Limpiar los campos si no se encuentra el viaje
                        document.getElementById("fecha_inicioU").value = "";
                        document.getElementById("fecha_finU").value = "";
                        document.getElementById("rutaU").value = "";
                    }
                });

                cargarComisiones();
                document.getElementById("num_comisionU").value = legalizacionesData.num_comision;
                document.getElementById("fecha_inicioU").value = legalizacionesData.fecha_inicio;
                document.getElementById("fecha_finU").value = legalizacionesData.fecha_fin;
                document.getElementById("rutaU").value = legalizacionesData.ruta;
                document.getElementById("estadoU").value = legalizacionesData.estado;

                // //Validación de campo Estado
                // const estadoSelect = document.getElementById("estadoU");
                // //Si el estado es "cancelado" no deja editar de los contrario no
                // if (legalizacionesData.estado === "cancelar") {
                //     estadoSelect.disabled = true;
                //     estadoSelect.style.backgroundColor = "lightgrey";
                // }else {
                //     estadoSelect.disabled = false;
                //     estadoSelect.style.backgroundColor = "white";
                // }

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

listaLegalizaciones();

//Editar Legalización
//Asignar el id al botón "Guardar"
document.getElementById("editarViaje").addEventListener("click", async (event) => {
    event.preventDefault();

    const id = document.getElementById("modalEditId").value;
    const num_comision = document.getElementById("num_comisionU").value;
    const fecha_inicio = document.getElementById("fecha_inicioU").value;
    const fecha_fin = document.getElementById("fecha_finU").value;
    const ruta = document.getElementById("rutaU").value;
    const estado = document.getElementById("estadoU").value = "completada"

    //Actualizar los datos de los viajes en la tabla viajes
    const legalizacionesRef = doc(db, "legalizaciones", id);
    await updateDoc(legalizacionesRef, {
        num_comision,
        fecha_inicio,
        fecha_fin,
        ruta,
        estado
    });

    listaLegalizaciones();
    //Cierra el modal una vez se actualizar el viaje
    const modal = bootstrap.Modal.getInstance(document.getElementById('myModalEdit'));
    modal.hide();

    Swal.fire({
        title: "!Éxito!",
        text: "Los cambios se han guardado",
        icon: "success",
        confirmButtonColor: "#00BB00",
    });
});

//Filtrar viajes
const filtrarLegalizacion = document.getElementById("filtrar"); 
filtrarLegalizacion.addEventListener("click", (event) => {
    event.preventDefault();
    const searchValue = document.getElementById("searchInput").value;
    filtrarLegalizaciones(searchValue);
});

// Filtros input search
async function filtrarLegalizaciones(searchValue) {
    const legalizacionesCollection = collection(db, "legalizaciones");
    const querySnapshot = await getDocs(legalizacionesCollection);
    const legalizacionesFiltradas = [];

    querySnapshot.forEach((doc) => {    
        const legalizacionesData = doc.data();
        if (
            legalizacionesData.num_comision.toString().includes(searchValue) ||
            legalizacionesData.fecha_inicio.includes(searchValue) ||
            legalizacionesData.fecha_fin.includes(searchValue) // Asegúrate de convertir a string
        ) {
            legalizacionesFiltradas.push({ id: doc.id, ...legalizacionesData });
        }
    });

    actualizarTabla(legalizacionesFiltradas);
}

//Actualiza la tabla cuando se ha filtrado un viaje   
function actualizarTabla(legalizaciones) {
    const tablaLegalizaciones = document.getElementById("tablaLegalizaciones").getElementsByTagName("tbody")[0];
    tablaLegalizaciones.innerHTML = ""; // Limpiar la tabla

    legalizaciones.forEach((legalizacion) => {
        const row = tablaLegalizaciones.insertRow();
        row.insertCell(0).textContent = legalizacion.id;
        row.insertCell(1).textContent = legalizacion.num_comision;
        row.insertCell(2).textContent = legalizacion.fecha_inicio;
        row.insertCell(3).textContent = legalizacion.fecha_fin;
        row.insertCell(4)
        row.insertCell(5).textContent = legalizacion.estado;

        // Crear celda editar
        let celdaOpcion = document.createElement("td");
           
        let botonEditar = document.createElement("btn");
        botonEditar.className = 'bx bx-edit-alt bx-sm';
        botonEditar.style.cursor = "pointer";
        botonEditar.style.color = "orange";
        botonEditar.style.justifyContent = "center";

        botonEditar.onclick = () => {
            const cargarComisiones = async () => {
                const viajesCollection = collection(db, "viajes");
                const querySnapshot = await getDocs(viajesCollection);
                const selectComision = document.getElementById("num_comisionU");
            
                querySnapshot.forEach((doc) => {
                    const viajeData = doc.data();
                    const option = document.createElement("option");
                    option.value = viajeData.num_comision;
                    option.textContent = viajeData.num_comision;
                    selectComision.appendChild(option);
                });
            };

            document.getElementById("num_comisionU").addEventListener("change", async (event) => {
                const num_comisionSeleccionada = event.target.value;
            
                // Buscar el viaje correspondiente
                const viajesCollection = collection(db, "viajes");
                const q = query(viajesCollection, where("num_comision", "==", num_comisionSeleccionada));
                const querySnapshot = await getDocs(q);
            
                if (!querySnapshot.empty) {
                    const viajeData = querySnapshot.docs[0].data();
                    document.getElementById("fecha_inicioU").value = viajeData.fecha_inicio;
                    document.getElementById("fecha_finU").value = viajeData.fecha_fin;
                    document.getElementById("rutaU").value = viajeData.ruta;
                    document.getElementById("estadoU").value = viajeData.estado;
                } else {
                    // Limpiar los campos si no se encuentra el viaje
                    document.getElementById("fecha_inicioU").value = "";
                    document.getElementById("fecha_finU").value = "";
                    document.getElementById("rutaU").value = "";
                }
            });

            cargarComisiones();
            document.getElementById("num_comisionU").value = legalizacion.num_comision;
            document.getElementById("fecha_inicioU").value = legalizacion.fecha_inicio;
            document.getElementById("fecha_finU").value = legalizacion.fecha_fin;
            document.getElementById("estadoU").value = legalizacion.estado;

            // //Validación de campo Estado
            // const estadoSelect = document.getElementById("estadoU");
            // //Si el estado es "cancelado" no deja editar de los contrario no
            // if (legalizacion.estado === "cancelar") {
            //     estadoSelect.disabled = true;
            // }else {
            //     estadoSelect.disabled = false;
            // }

            document.getElementById("modalEditId").value = legalizacion.id;

            const modal = new bootstrap.Modal(document.getElementById('myModalEdit'));
            modal.show();   
        };

        celdaOpcion.appendChild(botonEditar);
        celdaOpcion.appendChild(document.createTextNode(""));
        row.appendChild(celdaOpcion);
    });
}