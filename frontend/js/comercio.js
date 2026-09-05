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
      await apiFetch("/auth/logout", { method: "POST" });
      localStorage.removeItem("spotmarket_sesion");
      localStorage.removeItem("spotmarket_user");
      window.location.href = "login.html";
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      alert("Error al cerrar sesión");
    }
  });

async function cargarProductos() {
  try {
    // Obtener la tienda del usuario primero
    const tiendas = await apiFetch("/tiendas");
    const miTienda = tiendas.find((t) => t.usuarioId === userData.id);

    if (!miTienda) {
      document.getElementById("tablaProductos").innerHTML = `
                <tr><td colspan="7" class="text-center">
                    No tenés una tienda registrada. 
                    <a href="registro.html">Registrá tu tienda acá</a>
                </td></tr>
            `;
      return;
    }

    // Obtener productos de la tienda
    const productos = await apiFetch(`/productos?tiendaId=${miTienda.id}`);

    const tbody = document.getElementById("tablaProductos");
    if (productos.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" class="text-center">
                No tenés productos cargados. 
                <a href="registro-producto.html">Subí tu primer producto</a>
            </td></tr>`;
      return;
    }

    tbody.innerHTML = productos
      .map((p) => {
        const stockBadge =
          p.stock <= 5
            ? '<span class="badge-stock-bajo">Stock bajo</span>'
            : '<span class="badge-stock-normal">Stock disponible</span>';

        const ofertaBadge = p.en_oferta
          ? '<span class="badge-oferta">En oferta</span>'
          : "";

        return `
                <tr>
                    <td>${p.id}</td>
                    <td>${p.nombre}</td>
                    <td>$${p.precio}</td>
                    <td>${p.categoria}</td>
                    <td>${p.stock || 0} ${stockBadge}</td>
                    <td>${ofertaBadge || "—"}</td>
                    <td>
                        <button class="btn btn-warning btn-sm" onclick="editarProducto(${p.id})"></button>
                        <button class="btn btn-danger btn-sm" onclick="eliminarProducto(${p.id})"></button>
                    </td>
                </tr>
            `;
      })
      .join("");
  } catch (error) {
    console.error("Error al cargar productos:", error);
    document.getElementById("tablaProductos").innerHTML =
      '<tr><td colspan="7" class="text-center text-danger">Error al cargar productos</td></tr>';
  }
}

async function editarProducto(id) {
  try {
    const producto = await apiFetch(`/productos/${id}`);
    document.getElementById("productoId").value = producto.id;
    document.getElementById("pNombre").value = producto.nombre;
    document.getElementById("pPrecio").value = producto.precio;
    document.getElementById("pCategoria").value = producto.categoria;
    document.getElementById("pStock").value = producto.stock || 0;
    document.getElementById("pOferta").value = producto.en_oferta
      ? "true"
      : "false";

    const modal = new bootstrap.Modal(document.getElementById("modalProducto"));
    modal.show();
  } catch (error) {
    alert("Error al cargar producto: " + error.message);
  }
}

async function guardarProducto() {
  const id = document.getElementById("productoId").value;
  const data = {
    nombre: document.getElementById("pNombre").value.trim(),
    precio: parseFloat(document.getElementById("pPrecio").value),
    categoria: document.getElementById("pCategoria").value,
    stock: parseInt(document.getElementById("pStock").value) || 0,
    en_oferta: document.getElementById("pOferta").value === "true",
  };

  if (!data.nombre || !data.precio) {
    alert("Nombre y precio son obligatorios");
    return;
  }

  try {
    await apiFetch(`/productos/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
    alert("Producto actualizado");
    document
      .getElementById("modalProducto")
      .querySelector(".btn-close")
      .click();
    cargarProductos();
  } catch (error) {
    alert("Error: " + error.message);
  }
}

async function eliminarProducto(id) {
  if (!confirm("¿Eliminar este producto permanentemente?")) return;
  try {
    await apiFetch(`/productos/${id}`, { method: "DELETE" });
    alert("Producto eliminado");
    cargarProductos();
  } catch (error) {
    alert("Error: " + error.message);
  }
}

cargarProductos();
