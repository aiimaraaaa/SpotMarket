const API_BASE = "http://localhost:4004/api";

async function apiFetch(endpoint, options = {}) {
  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
      },
      ...options,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Error en la petición");
    }

    return data;
  } catch (error) {
    console.error("Error en apiFetch:", error);
    throw error;
  }
}

function formatPrice(value) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function marcarNavActivo() {
  const actual = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav a").forEach((link) => {
    if (link.getAttribute("href") === actual) {
      link.classList.add("is-active");
    } else {
      link.classList.remove("is-active");
    }
  });
}

document.addEventListener("DOMContentLoaded", marcarNavActivo);
