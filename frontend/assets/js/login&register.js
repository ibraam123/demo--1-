import {register, login, logout} from "./auth.js"

document.getElementById("create-account-btn").addEventListener("click", (e) => {
  e.preventDefault();
  register(document.getElementById("signup-email").value, 
  document.getElementById("signup-password").value,
  document.getElementById("signup-name").value)
})

document.getElementById("login-btn").addEventListener("click", (e) => {
  e.preventDefault();
  login(document.getElementById("email").value,
  document.getElementById("password").value)
})