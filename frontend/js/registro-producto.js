const CATEGORIA_LABEL = {
  carnes: " Carnes",
  verduras: " Verduras",
  frutas: " Frutas",
  lacteos: " Lácteos",
  panaderia: " Panadería",
  bebidas: " Bebidas",
  infusiones: " Infusiones",
  secos: " Secos y granos",
  conservas: " Conservas",
  huevos: " Huevos",
  almacen: " Almacén",
};

async function cargarTiendas() {
  const select = document.getElementById("tienda");
  if (!select) return;

  try {
    const tiendas = await apiFetch("/tiendas");

    if (tiendas.length === 0) {
      select.innerHTML =
        '<option value="">No hay comercios registrados todavía</option>';
      return;
    }

    select.innerHTML =
      '<option value="">Elegí tu comercio</option>' +
      tiendas
        .map((t) => `<option value="${t.id}">${t.nombre}</option>`)
        .join("");
  } catch (error) {
    select.innerHTML =
      '<option value="">No se pudieron cargar los comercios</option>';
    console.error(error);
  }
}

const previewImg = document.getElementById("previewImg");
const previewNombre = document.getElementById("previewNombre");
const previewCategoria = document.getElementById("previewCategoria");
const previewPrecio = document.getElementById("previewPrecio");

document.getElementById("nombre").addEventListener("input", (e) => {
  previewNombre.textContent = e.target.value || "Nombre del producto";
});

document.getElementById("categoria").addEventListener("change", (e) => {
  previewCategoria.textContent = CATEGORIA_LABEL[e.target.value] || "Categoría";
});

document.getElementById("precio").addEventListener("input", (e) => {
  previewPrecio.textContent = e.target.value
    ? formatPrice(Number(e.target.value))
    : "$0";
});

document.getElementById("foto").addEventListener("change", async (e) => {
  const file = e.target.files[0];
  if (file) {
    previewImg.src = await fileToBase64(file);
  }
});

const form = document.getElementById("formProducto");
const formMsg = document.getElementById("formMsg");

function mostrarMensaje(texto, tipo) {
  formMsg.textContent = texto;
  formMsg.className = `form-msg is-visible form-msg--${tipo}`;
}

if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const fotoInput = document.getElementById("foto");
    if (!fotoInput.files[0]) {
      mostrarMensaje("Subí una foto del producto.", "error");
      return;
    }

    const image = await fileToBase64(fotoInput.files[0]);

    const payload = {
      tiendaId: document.getElementById("tienda").value,
      nombre: document.getElementById("nombre").value.trim(),
      categoria: document.getElementById("categoria").value,
      precio: Number(document.getElementById("precio").value),
      descripcion: document.getElementById("descripcion").value.trim(),
      imagen: image,
    };

    if (!payload.tiendaId) {
      mostrarMensaje("Elegí a qué comercio pertenece el producto.", "error");
      return;
    }

    try {
      await apiFetch("/productos", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      mostrarMensaje(
        " ¡Producto publicado! Ya se ve en el catálogo.",
        "success",
      );
      form.reset();
      previewImg.src = "";
      previewNombre.textContent = "Nombre del producto";
      previewCategoria.textContent = "Categoría";
      previewPrecio.textContent = "$0";

      setTimeout(() => {
        window.location.href = "index.html";
      }, 2000);
    } catch (error) {
      mostrarMensaje(error.message || "Error al publicar el producto", "error");
    }
  });
}

cargarTiendas();
