// admin.js
const ADMIN_PASSWORD = "1234"; // <-- change-le

function loginAdmin(event) {
  if (event) event.preventDefault();

  const input = document.getElementById("adminPassword");
  const error = document.getElementById("error");

  if (!input) return;

  if (input.value === "1234") {
    sessionStorage.setItem("isAdmin", "true");
    if (error) error.textContent = "";

    // ✅ IMPORTANT : retourner à l'app
    window.location.href = "joueurs.html";
  } else {
    if (error) error.textContent = "❌ Code incorrect";
  }
}

// IMPORTANT: rendre la fonction visible au HTML (onclick)
window.loginAdmin = loginAdmin;
