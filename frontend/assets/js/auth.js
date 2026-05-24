import { auth } from "./firebase.js";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

function register(email, password, fullName) {
    createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        updateProfile(userCredential.user, {
        displayName: fullName
        });

        alert("Registration successful!");
        window.location.href = "../../frontend/home.html";
    })
    .catch((error) => {
        alert(error.message)
    })
}

function login(email, password) {
    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // console.log("User logged in:", userCredential.user);
      alert("Login successful!");
      window.location.href = "../../frontend/home.html";
    })
    .catch((error) => {
      alert(error.message);
    });
}

function logout() {
  signOut(auth)
    .then(() => {
      alert("Logged out successfully")
      window.location.href = "../../login&register.html"
    })
    .catch((error) => alert(error.message));
}

export {register, login, logout};