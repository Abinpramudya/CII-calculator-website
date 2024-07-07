// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, setDoc, doc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

function showMessage(message, elementId) {
    const messageElement = document.createElement('p');
    messageElement.textContent = message;
    messageElement.style.color = 'red';
    const form = document.getElementById('signin-form');
    const existingMessage = document.getElementById(elementId);
    if (existingMessage) {
        form.removeChild(existingMessage);
    }
    messageElement.id = elementId;
    form.appendChild(messageElement);
}

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAMuLs8WnhMp3lsC1ZbcPnibA-mNiR3B18",
    authDomain: "cii-web-calculator.firebaseapp.com",
    projectId: "cii-web-calculator",
    storageBucket: "cii-web-calculator.appspot.com",
    messagingSenderId: "949662714907",
    appId: "1:949662714907:web:dc89c0b95a3c09eb933cbe"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const signIn = document.getElementById('signin-button');
signIn.addEventListener('click', (event) => {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const auth = getAuth();

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            showMessage('Login is successful', 'signInMessage');
            const user = userCredential.user;
            localStorage.setItem('loggedInUserId', user.uid);
            window.location.href = 'index.html';
        })
        .catch((error) => {
            const errorCode = error.code;
            if (errorCode === 'auth/invalid-credential') {
                showMessage('Incorrect Email or Password', 'signInMessage');
            } else {
                showMessage('Account does not exist', 'signInMessage');
            }
        });
});
