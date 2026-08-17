const CATEGORIAS_TIENDAS = [
  "todas",
  "carniceria",
  "verduleria",
  "fruteria",
  "lacteos",
  "panaderia",
  "bebidas",
  "infusiones",
  "almacen",
];

const CATEGORIA_TIENDA_LABEL = {
  todas: "Todas",
  carniceria: "🥩 Carnicería",
  verduleria: "🥦 Verdulería",
  fruteria: "🍎 Frutería",
  lacteos: "🥛 Lácteos",
  panaderia: "🍞 Panadería",
  bebidas: "🧃 Bebidas",
  infusiones: "🧉 Infusiones",
  almacen: "🛒 Almacén",
};

const WHATSAPP_NUMBER = "5493704000000";
const FORMOSA_CENTER = [-26.1849, -58.1731];

document.getElementById("whatsappFab").href =
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hola, te vi en SpotMarket 👋")}`;

const mapa = L.map("mapa").setView(FORMOSA_CENTER, 13);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "&copy; OpenStreetMap",
  maxZoom: 18,
}).addTo(mapa);

let categoriaActiva = "todas";
let marcadores = {};

function renderChips() {
  const container = document.getElementById("categoriaChips");
  if (!container) return;

  container.innerHTML = "";
  CATEGORIAS_TIENDAS.forEach((cat) => {
    const chip = document.createElement("button");
    chip.type = "button";
    chip.className = "chip" + (cat === categoriaActiva ? " is-active" : "");
    chip.textContent = CATEGORIA_TIENDA_LABEL[cat];
    chip.addEventListener("click", () => {
      categoriaActiva = cat;
      renderChips();
      cargarTiendas();
    });
    container.appendChild(chip);
  });
}

async function cargarTiendas() {
  const lista = document.getElementById("tiendaList");
  if (!lista) return;

  lista.innerHTML = '<li class="tienda-list__vacio">Cargando comercios…</li>';

  const params = new URLSearchParams();
  if (categoriaActiva !== "todas") {
    params.set("categoria", categoriaActiva);
  }

  const busqueda = document.getElementById("filtroBusqueda");
  if (busqueda && busqueda.value.trim()) {
    params.set("busqueda", busqueda.value.trim());
  }

  try {
    const tiendas = await apiFetch(`/tiendas?${params.toString()}`);
    renderLista(tiendas);
    renderMarcadores(tiendas);
  } catch (error) {
    lista.innerHTML = `<li class="tienda-list__vacio">${error.message}</li>`;
  }
}

function renderLista(tiendas) {
  const lista = document.getElementById("tiendaList");
  if (!lista) return;

  if (tiendas.length === 0) {
    lista.innerHTML =
      '<li class="tienda-list__vacio">No hay comercios con esos filtros.</li>';
    return;
  }

  lista.innerHTML = "";
  tiendas.forEach((tienda) => {
    const item = document.createElement("li");
    item.innerHTML = `
            <button type="button" class="tienda-item" data-id="${tienda.id}">
                <span class="tienda-item__nombre">${tienda.nombre}</span>
                <span class="tienda-item__categoria">${CATEGORIA_TIENDA_LABEL[tienda.categoria] || tienda.categoria}</span>
                <span class="tienda-item__direccion">${tienda.direccion}</span>
            </button>
        `;
    item
      .querySelector("button")
      .addEventListener("click", () => enfocarTienda(tienda));
    lista.appendChild(item);
  });
}

function renderMarcadores(tiendas) {
  Object.values(marcadores).forEach((m) => mapa.removeLayer(m));
  marcadores = {};

  tiendas.forEach((tienda) => {
    if (tienda.latitud == null || tienda.longitud == null) return;

    const marcador = L.marker([tienda.latitud, tienda.longitud]).addTo(mapa);
    marcador.bindPopup(`
            <span class="popup-tienda__nombre">${tienda.nombre}</span>
            <span class="popup-tienda__categoria">${CATEGORIA_TIENDA_LABEL[tienda.categoria] || tienda.categoria}</span><br>
            ${tienda.direccion}
        `);
    marcadores[tienda.id] = marcador;
  });
}

function enfocarTienda(tienda) {
  document
    .querySelectorAll(".tienda-item")
    .forEach((el) => el.classList.remove("is-active"));
  document
    .querySelector(`.tienda-item[data-id="${tienda.id}"]`)
    ?.classList.add("is-active");

  if (tienda.latitud != null && tienda.longitud != null) {
    mapa.setView([tienda.latitud, tienda.longitud], 16);
    marcadores[tienda.id]?.openPopup();
  }
}

const filtroBusqueda = document.getElementById("filtroBusqueda");
if (filtroBusqueda) {
  filtroBusqueda.addEventListener("input", debounce(cargarTiendas, 350));
}

function debounce(fn, delay) {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

renderChips();
cargarTiendas();
