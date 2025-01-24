// Importar las funciones necesarias de Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getAuth} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
import { getFirestore, doc, collection, onSnapshot,} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js";

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

//Lista de usuarios
function listaUsuariosPDF(){
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

            row.insertCell(0).textContent = userData.num_documento;
            row.insertCell(1).textContent = userData.nombre_usuario;
            row.insertCell(2).textContent = userData.email;
            row.insertCell(3).textContent = userData.centro;
            row.insertCell(4).textContent = userData.cargo;

        });
        
    });
}

listaUsuariosPDF();