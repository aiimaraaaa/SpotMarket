// ============================================================
// PANEL DE COMERCIO
// ============================================================

const userData = JSON.parse(localStorage.getItem("spotmarket_user") || "{}");
const nombreComercio = document.getElementById("nombreComercio");
if (nombreComercio && userData.nombre) {
  nombreComercio.textContent = userData.nombre;
}

// ============================================================
// AVATAR Y MENÚ DESPLEGABLE
// ============================================================

// Mostrar iniciales en el avatar
const avatar = document.getElementById("avatarIniciales");
const userNameDisplay = document.getElementById("userNameDisplay");
if (avatar && userData.nombre) {
  const iniciales = userData.nombre
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
  avatar.textContent = iniciales || "U";
}
if (userNameDisplay && userData.nombre) {
  userNameDisplay.textContent = userData.nombre;
}

// Toggle del menú
function toggleDropdown(event) {
  event.stopPropagation();
  const dropdown = document.getElementById("dropdownMenu");
  if (dropdown) {
    dropdown.classList.toggle("show");
  }
}

// Cerrar menú al hacer clic fuera
document.addEventListener("click", function () {
  const dropdown = document.getElementById("dropdownMenu");
  if (dropdown) {
    dropdown.classList.remove("show");
  }
});

// ============================================================
// CERRAR SESIÓN
// ============================================================
document
  .getElementById("cerrarSesion")
  ?.addEventListener("click", async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:4004/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      if (response.ok) {
        localStorage.removeItem("spotmarket_sesion");
        localStorage.removeItem("spotmarket_user");
        window.location.href = "login.html";
      }
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  });

// ============================================================
// CARGAR DATOS DEL COMERCIO
// ============================================================
async function cargarDatosComercio() {
  try {
    const tiendas = await apiFetch(`/tiendas?usuarioId=${userData.id}`);
    if (tiendas.length > 0) {
      const tienda = tiendas[0];
      document.getElementById("nombreTienda").textContent = tienda.nombre;
      document.getElementById("totalProductos").textContent =
        tienda.Productos?.length || 0;
    }
  } catch (error) {
    console.error("Error al cargar datos del comercio:", error);
  }
}

cargarDatosComercio();
