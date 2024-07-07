// Import the functions you need from the SDKs you need
import{initializeApp} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import{getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import{getFirestore, setDoc, doc} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js"

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

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

const signUp = document.getElementById('signup-button');
signUp.addEventListener('click', (event) => {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const company = document.getElementById('company').value;
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const auth = getAuth();
    const db = getFirestore();

    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            const userData = {
                email: email,
                company: company,
                username: username
            };
            const docRef = doc(db, "users", user.uid);
            setDoc(docRef, userData)
                .then(() => {
                    showMessage('Account created successfully! Redirecting to login...', 'signUpMessage');
                    setTimeout(() => {
                        window.location.href = 'signin.html';
                    }, 3000); // Redirect after 3 seconds
                })
                .catch((error) => {
                    console.error("Error writing document", error);
                    showMessage('Error writing document', 'signUpMessage');
                });
        })
        .catch((error) => {
            const errorCode = error.code;
            if (errorCode === 'auth/email-already-in-use') {
                showMessage('Email address already in use!', 'signUpMessage');
            } else {
                showMessage('Unable to create user', 'signUpMessage');
            }
        });
});

function showMessage(message, elementId) {
    const messageElement = document.createElement('p');
    messageElement.textContent = message;
    messageElement.style.color = 'red';
    const form = document.getElementById('signup-form');
    const existingMessage = document.getElementById(elementId);
    if (existingMessage) {
        form.removeChild(existingMessage);
    }
    messageElement.id = elementId;
    form.appendChild(messageElement);
}
