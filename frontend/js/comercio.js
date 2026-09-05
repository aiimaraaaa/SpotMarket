const userData = JSON.parse(localStorage.getItem("spotmarket_user") || "{}");
const nombreComercio = document.getElementById("nombreComercio");
if (nombreComercio && userData.nombre) {
  nombreComercio.textContent = userData.nombre;
}

document.getElementById("cerrarSesion")?.addEventListener("click", (e) => {
  e.preventDefault();
  localStorage.removeItem("spotmarket_sesion");
  localStorage.removeItem("spotmarket_user");
  window.location.href = "login.html";
});
//.
