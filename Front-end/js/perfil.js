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


//Lista de usuarios
function listaUsuarios(){

    const userCollection = collection(db, "users");
    onSnapshot(userCollection, (snapshot) => {
        snapshot.forEach((doc) => {
            const userData = doc.data();

            document.getElementById("num_documento").value = userData.num_documento;
            document.getElementById("nombre_usuario").value = userData.nombre_usuario;
            document.getElementById("correo_usuario").value = userData.email;
            document.getElementById("centro").value = userData.centro;
            document.getElementById("cargo").value = userData.cargo;
        })
    })
}

listaUsuarios();
