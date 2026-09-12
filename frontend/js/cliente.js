// ============================================================
// PANEL DE CLIENTE
// ============================================================

const userData = JSON.parse(localStorage.getItem("spotmarket_user") || "{}");
const nombreCliente = document.getElementById("nombreCliente");
if (nombreCliente && userData.nombre) {
  nombreCliente.textContent = userData.nombre;
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
// CATÁLOGO DE PRODUCTOS (código desde index.js)
// ============================================================

const CATEGORIAS = [
  "todas",
  "carnes",
  "verduras",
  "frutas",
  "lacteos",
  "panaderia",
  "bebidas",
  "infusiones",
  "secos",
  "conservas",
  "huevos",
  "almacen",
];

const CATEGORIA_LABEL = {
  todas: "Todas",
  carnes: "Carnes",
  verduras: "Verduras",
  frutas: "Frutas",
  lacteos: " Lácteos",
  panaderia: "Panadería",
  bebidas: "Bebidas",
  infusiones: "Infusiones",
  secos: "Secos y granos",
  conservas: "Conservas",
  huevos: "Huevos",
  almacen: "Almacén",
};

let categoriaActiva = "todas";
let productoSeleccionado = null;

const grid = document.getElementById("productGrid");
const estado = document.getElementById("catalogEstado");
const chipsContainer = document.getElementById("categoriaChips");

// Renderizar chips
function renderChips() {
  if (!chipsContainer) return;
  chipsContainer.innerHTML = "";
  CATEGORIAS.forEach((cat) => {
    const chip = document.createElement("button");
    chip.type = "button";
    chip.className = "chip" + (cat === categoriaActiva ? " is-active" : "");
    chip.textContent = CATEGORIA_LABEL[cat] || cat;
    chip.addEventListener("click", () => {
      categoriaActiva = cat;
      renderChips();
      cargarProductos();
    });
    chipsContainer.appendChild(chip);
  });
}

// Cargar productos
async function cargarProductos() {
  if (!estado || !grid) return;
  estado.textContent = "Cargando productos…";
  grid.innerHTML = "";

  const params = new URLSearchParams();
  if (categoriaActiva !== "todas") {
    params.set("categoria", categoriaActiva);
  }

  const busqueda = document.getElementById("filtroBusqueda");
  if (busqueda && busqueda.value.trim()) {
    params.set("busqueda", busqueda.value.trim());
  }

  const precioMin = document.getElementById("filtroPrecioMin");
  const precioMax = document.getElementById("filtroPrecioMax");
  if (precioMin && precioMin.value) {
    params.set("precioMin", precioMin.value);
  }
  if (precioMax && precioMax.value) {
    params.set("precioMax", precioMax.value);
  }

  const orden = document.getElementById("filtroOrden");
  if (orden && orden.value) {
    params.set("orden", orden.value);
  }

  try {
    const productos = await apiFetch(`/productos?${params.toString()}`);
    renderProductos(productos);
  } catch (error) {
    if (estado) estado.textContent = "";
    if (grid) {
      grid.innerHTML = `<p class="catalog-vacio">${error.message}</p>`;
    }
  }
}

// Renderizar productos
function renderProductos(productos) {
  if (!grid) return;
  if (!productos || productos.length === 0) {
    if (estado) estado.textContent = "";
    grid.innerHTML =
      '<p class="catalog-vacio">No encontramos productos con esos filtros.</p>';
    return;
  }

  if (estado) {
    estado.textContent = `${productos.length} producto${productos.length === 1 ? "" : "s"} encontrado${productos.length === 1 ? "" : "s"}`;
  }

  grid.innerHTML = "";
  productos.forEach((producto) => {
    const card = document.createElement("article");
    card.className = "product-card";
    card.innerHTML = `
            <img class="product-card__img" src="${producto.imagen || ""}" alt="${producto.nombre}">
            <div class="product-card__body">
                <span class="product-card__categoria">${producto.categoria || ""}</span>
                <span class="product-card__nombre">${producto.nombre || ""}</span>
                <span class="product-card__tienda">${producto.Tienda ? producto.Tienda.nombre : ""}</span>
                <div class="product-card__footer">
                    <span class="product-card__precio">${formatPrice(producto.precio || 0)}</span>
                    <span class="product-card__likes">👍 ${producto.me_gusta || 0}</span>
                </div>
            </div>
        `;
    card.addEventListener("click", () => abrirModal(producto));
    grid.appendChild(card);
  });
}

const modalOverlay = document.getElementById("modalOverlay");

function abrirModal(producto) {
  if (!modalOverlay) return;
  productoSeleccionado = producto;

  const modalImagen = document.getElementById("modalImagen");
  const modalCategoria = document.getElementById("modalCategoria");
  const modalNombre = document.getElementById("modalNombre");
  const modalPrecio = document.getElementById("modalPrecio");
  const modalDescripcion = document.getElementById("modalDescripcion");
  const modalTienda = document.getElementById("modalTienda");
  const modalDireccion = document.getElementById("modalDireccion");
  const modalLikeCount = document.getElementById("modalLikeCount");
  const modalDislikeCount = document.getElementById("modalDislikeCount");

  if (modalImagen) modalImagen.src = producto.imagen || "";
  if (modalCategoria) modalCategoria.textContent = producto.categoria || "";
  if (modalNombre) modalNombre.textContent = producto.nombre || "";
  if (modalPrecio) modalPrecio.textContent = formatPrice(producto.precio || 0);
  if (modalDescripcion)
    modalDescripcion.textContent = producto.descripcion || "";
  if (modalTienda)
    modalTienda.textContent = producto.Tienda ? producto.Tienda.nombre : "";
  if (modalDireccion)
    modalDireccion.textContent = producto.Tienda
      ? producto.Tienda.direccion
      : "";
  if (modalLikeCount) modalLikeCount.textContent = producto.me_gusta || 0;
  if (modalDislikeCount)
    modalDislikeCount.textContent = producto.no_me_gusta || 0;

  modalOverlay.classList.add("is-open");
}

function cerrarModal() {
  if (modalOverlay) {
    modalOverlay.classList.remove("is-open");
  }
  productoSeleccionado = null;
}

const modalCerrar = document.getElementById("modalCerrar");
if (modalCerrar) {
  modalCerrar.addEventListener("click", cerrarModal);
}

if (modalOverlay) {
  modalOverlay.addEventListener("click", (e) => {
    if (e.target === modalOverlay) cerrarModal();
  });
}

function yaVoto(productoId) {
  const votos = JSON.parse(localStorage.getItem("spotmarket_votos") || "{}");
  return votos[productoId];
}

function guardarVoto(productoId, tipo) {
  const votos = JSON.parse(localStorage.getItem("spotmarket_votos") || "{}");
  votos[productoId] = tipo;
  localStorage.setItem("spotmarket_votos", JSON.stringify(votos));
}

async function votar(tipo) {
  if (!productoSeleccionado) return;
  if (yaVoto(productoSeleccionado.id)) {
    alert("Ya votaste este producto.");
    return;
  }

  try {
    const endpoint = tipo === "like" ? "me-gusta" : "no-me-gusta";
    const actualizado = await apiFetch(
      `/productos/${productoSeleccionado.id}/${endpoint}`,
      { method: "POST" },
    );
    guardarVoto(productoSeleccionado.id, tipo);

    const likeCount = document.getElementById("modalLikeCount");
    const dislikeCount = document.getElementById("modalDislikeCount");
    if (likeCount) likeCount.textContent = actualizado.me_gusta || 0;
    if (dislikeCount) dislikeCount.textContent = actualizado.no_me_gusta || 0;
  } catch (error) {
    alert(error.message);
  }
}

const modalLike = document.getElementById("modalLike");
const modalDislike = document.getElementById("modalDislike");

if (modalLike) {
  modalLike.addEventListener("click", () => votar("like"));
}
if (modalDislike) {
  modalDislike.addEventListener("click", () => votar("dislike"));
}

const filtersForm = document.getElementById("filtersForm");
if (filtersForm) {
  filtersForm.addEventListener("submit", (e) => e.preventDefault());
}

const filtroBusqueda = document.getElementById("filtroBusqueda");
if (filtroBusqueda) {
  filtroBusqueda.addEventListener("input", debounce(cargarProductos, 350));
}

const filtroOrden = document.getElementById("filtroOrden");
if (filtroOrden) {
  filtroOrden.addEventListener("change", cargarProductos);
}

const filtroPrecioMin = document.getElementById("filtroPrecioMin");
const filtroPrecioMax = document.getElementById("filtroPrecioMax");
if (filtroPrecioMin) {
  filtroPrecioMin.addEventListener("change", cargarProductos);
}
if (filtroPrecioMax) {
  filtroPrecioMax.addEventListener("change", cargarProductos);
}

function debounce(fn, delay) {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

renderChips();
cargarProductos();
