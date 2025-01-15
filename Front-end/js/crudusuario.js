import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getDatabase, ref, get,} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-database.js";
import {doc, onSnapshot, QuerySnapshot } from "firebase/firestore";
import firebase from "firebase/compat/app";

const firebaseConfig = {
    apiKey: "AIzaSyCKTJxwwP2roq8DioEyhrBWMNN34f2JB6Y",
    authDomain: "lcd-contabilidad.firebaseapp.com",
    projectId: "lcd-contabilidad",
    storageBucket: "lcd-contabilidad.firebasestorage.app",
    messagingSenderId: "289220346007",
    appId: "1:289220346007:web:b9034c2734e3602830a9d2",
    measurementId: "G-2LDHTHRHNY"
};


const app = initializeApp(firebaseConfig);
const db = firebase.firestore();

db.collection("users").get().then((QuerySnapshot) => {
    QuerySnapshot.forEach((doc) =>{
        console.log(`${doc.id} => ${doc.data()}`);
    });
});
/*
const database = getDatabase(app);

// Cargar usuarios
function loadUsers() {
    const userTableBody = document.getElementById('tablaUsuarios');
    userTableBody.innerHTML = ''; // Limpiar la tabla antes de cargar

    const usersRef = ref(database, 'users'); // Referencia a la colección de usuarios

    get(usersRef).then((snapshot) => {
        if (snapshot.exists()) {
            snapshot.forEach((childSnapshot) => {
                const userData = childSnapshot.val();
                const userId = childSnapshot.key;
                const row = userTableBody.insertRow();

                row.innerHTML = `
                    <td>${userId}</td>
                    <td>${userData.num_documento || 'N/A'}</td>
                    <td>${userData.nombre_usuario}</td>
                    <td>${userData.email}</td>
                    <td>${userData.cargo || 'N/A'}</td>
                    <td>${userData.centro || 'N/A'}</td>
                    <td>
                        <button onclick="editUser ('${userId}')">Editar</button>
                        <button onclick="deleteUser ('${userId}')">Eliminar</button>
                    </td>
                `;
            });
        } else {
            console.log("No hay usuarios disponibles.");
        }
    }).catch((error) => {
        console.error('Error al cargar usuarios: ', error);
    });
}

window.onload = function(){
    loadUsers();
}*/