import { auth } from "./firebase.js";
import { onAuthStateChanged, updateProfile } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

onAuthStateChanged(auth, (user) => {
  if (user) {
    document.getElementById("user-profile-name").textContent =
      user.displayName || "No Name";
    document.getElementById("edit-name-input").value =
      user.displayName || "No Name";
    document.getElementById("modal-email").value = user.email;
  } else {
    window.location.href = "login&register.html";
  }
});

document.getElementById("profile-edit-btn").addEventListener("click", async () => {
  const user = auth.currentUser
  const newName = document.getElementById("edit-name-input").value.trim()

  if (!user || !newName) return;

  try {
    await updateProfile(user, {
      displayName: newName
    });

    document.getElementById("user-profile-name").textContent = newName;
    alert("Profile updated successfully!");
  } catch (error) {
    alert(error.message);
  }
})