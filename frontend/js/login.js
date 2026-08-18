// LOGIN — Lógia de login y registro
const loginForm = document.getElementById("formLogin");
const loginMsg = document.getElementById("loginMsg");
const regForm = document.getElementById("formRegistro");
const regMsg = document.getElementById("regMsg");
const sesionActual = document.getElementById("sesionActual");

function mostrarMensaje(elemento, texto, tipo) {
  if (!elemento) return;
  elemento.textContent = texto;
  elemento.className = `form-msg is-visible form-msg--${tipo}`;
}

function mostrarSesion() {
  if (!sesionActual) return;
  const sesion = localStorage.getItem("spotmarket_sesion");
  sesionActual.textContent = sesion
    ? `✅ Sesión activa como: ${sesion}`
    : "No hay ninguna sesión activa.";
}

if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("clave").value;

    if (!email || !password) {
      mostrarMensaje(loginMsg, "Completá email y contraseña.", "error");
      return;
    }

    try {
      const data = await apiFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, contrasena: password }),
      });

      localStorage.setItem("spotmarket_sesion", data.nombre);
      localStorage.setItem("spotmarket_user", JSON.stringify(data));

      mostrarMensaje(loginMsg, `✅ ¡Bienvenido/a ${data.nombre}!`, "success");
      mostrarSesion();

      setTimeout(() => {
        window.location.href = "index.html";
      }, 1500);
    } catch (error) {
      mostrarMensaje(
        loginMsg,
        error.message || "Error al iniciar sesión",
        "error",
      );
    }
  });
}

if (regForm) {
  regForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nombre = document.getElementById("regNombre").value.trim();
    const email = document.getElementById("regEmail").value.trim();
    const password = document.getElementById("regPassword").value;
    const role = document.getElementById("regRole").value;

    if (!nombre || !email || !password) {
      mostrarMensaje(regMsg, "Todos los campos son obligatorios.", "error");
      return;
    }

    if (password.length < 6) {
      mostrarMensaje(
        regMsg,
        "La contraseña debe tener al menos 6 caracteres.",
        "error",
      );
      return;
    }

    try {
      await apiFetch("/auth/registro", {
        method: "POST",
        body: JSON.stringify({
          nombre,
          email,
          contrasena: password,
          rol: role,
        }),
      });

      mostrarMensaje(
        regMsg,
        "✅ Cuenta creada. ¡Ya podés iniciar sesión!",
        "success",
      );
      regForm.reset();

      setTimeout(() => {
        const loginTab = document.getElementById("pills-login-tab");
        if (loginTab) {
          const tab = new bootstrap.Tab(loginTab);
          tab.show();
        }
        setTimeout(() => {
          loginMsg.textContent = "";
          loginMsg.className = "form-msg";
        }, 500);
      }, 2000);
    } catch (error) {
      mostrarMensaje(regMsg, error.message || "Error al registrarse", "error");
    }
  });
}

mostrarSesion();
