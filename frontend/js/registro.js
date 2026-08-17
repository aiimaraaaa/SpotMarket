const FORMOSA_CENTER = [-26.1849, -58.1731];

const mapa = L.map("mapaRegistro").setView(FORMOSA_CENTER, 14);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "&copy; OpenStreetMap",
  maxZoom: 18,
}).addTo(mapa);

let marcador = null;

mapa.on("click", (e) => {
  const { lat, lng } = e.latlng;

  document.getElementById("lat").value = lat;
  document.getElementById("lng").value = lng;
  document.getElementById("coordsTexto").textContent =
    `Ubicación elegida: ${lat.toFixed(5)}, ${lng.toFixed(5)}`;

  if (marcador) {
    marcador.setLatLng(e.latlng);
  } else {
    marcador = L.marker(e.latlng).addTo(mapa);
  }
});

const form = document.getElementById("formTienda");
const formMsg = document.getElementById("formMsg");

function mostrarMensaje(texto, tipo) {
  formMsg.textContent = texto;
  formMsg.className = `form-msg is-visible form-msg--${tipo}`;
}

if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const lat = document.getElementById("lat").value;
    const lng = document.getElementById("lng").value;

    if (!lat || !lng) {
      mostrarMensaje("Elegí la ubicación de tu comercio en el mapa.", "error");
      return;
    }

    const userData = JSON.parse(
      localStorage.getItem("spotmarket_user") || "{}",
    );
    if (!userData.id) {
      mostrarMensaje(
        "Debés iniciar sesión antes de registrar una tienda.",
        "error",
      );
      return;
    }

    const logoInput = document.getElementById("logo");
    const logo = logoInput.files[0]
      ? await fileToBase64(logoInput.files[0])
      : null;

    const payload = {
      nombre: document.getElementById("nombre").value.trim(),
      categoria: document.getElementById("categoria").value,
      direccion: document.getElementById("direccion").value.trim(),
      whatsapp: document.getElementById("whatsapp").value.trim(),
      descripcion: document.getElementById("descripcion").value.trim(),
      latitud: Number(lat),
      longitud: Number(lng),
      logo,
      usuarioId: userData.id,
    };

    try {
      await apiFetch("/tiendas", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      mostrarMensaje(
        "✅ ¡Comercio registrado! Ya podés subir tus productos.",
        "success",
      );
      form.reset();
      if (marcador) {
        mapa.removeLayer(marcador);
        marcador = null;
      }
      document.getElementById("coordsTexto").textContent =
        "Todavía no elegiste una ubicación.";

      setTimeout(() => {
        window.location.href = "registro-producto.html";
      }, 2000);
    } catch (error) {
      mostrarMensaje(error.message || "Error al registrar la tienda", "error");
    }
  });
}
