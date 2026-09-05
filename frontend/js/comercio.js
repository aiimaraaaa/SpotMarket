const userData = JSON.parse(localStorage.getItem("spotmarket_user") || "{}");
const nombreComercio = document.getElementById("nombreComercio");
if (nombreComercio && userData.nombre) {
  nombreComercio.textContent = userData.nombre;
}

document
  .getElementById("cerrarSesion")
  ?.addEventListener("click", async (e) => {
    e.preventDefault();

    try {
      await apiFetch("/auth/logout", {
        method: "POST",
      });

      localStorage.removeItem("spotmarket_sesion");
      localStorage.removeItem("spotmarket_user");
      window.location.href = "login.html";
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      alert("Error al cerrar sesión. Intentá de nuevo.");
    }
  });
