// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import {getAuth, signInWithEmailAndPassword} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";

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

const signIn=document.getElementById('submitSignIn');
signIn.addEventListener('click', (event)=>{
   event.preventDefault();
   const email=document.getElementById('correo_usuario').value;
   const password=document.getElementById('contrasena').value;
   const auth=getAuth();

   signInWithEmailAndPassword(auth, email, password)

   .then((userCredential) => {
    const user = userCredential.user;
    Swal.fire({
        icon: "success",
        title: "Has iniciado sesión correctamente.",
        showConfirmButton: false,
        timer: 2000
    }).then(() => {
        localStorage.setItem('loggedInUserId', user.uid);
        window.location.href = 'inicio.html';
    });
})
   .catch((error)=>{
       const errorCode=error.code;
       if(errorCode==='auth/invalid-credential'){
        Swal.fire({
            title: "!Oops!",
            text: "Correo o contraseña incorrectos",
            icon: "error",
            confirmButtonColor: "#ff0000"
        })
       }
       else{
        Swal.fire({
            title: "!Oops!",
            text: "Usuario no encontrado",
            icon: "error",
            confirmButtonColor: "#ff0000"
        })
       }
   })
});

auth.signOut()
  .then(() => {
    window.location.href = '/iniciosesion';
  })
  .catch((error) => {
    console.error('Error al cerrar sesión', error.message);
});
