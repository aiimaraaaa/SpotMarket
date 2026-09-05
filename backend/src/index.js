import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { conexion } from "./models/index.js";

import authRoutes from "./routes/authRoutes.js";
import perfilRoutes from "./routes/perfilRoutes.js";
import tiendaRoutes from "./routes/tiendaRoutes.js";
import productoRoutes from "./routes/productoRoutes.js";
import categoriaRoutes from "./routes/categoriaRoutes.js";
import usuarioRoutes from "./routes/usuarioRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PUERTO = process.env.PUERTO || 4004;

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, "../../frontend")));

app.use("/api/auth", authRoutes);
app.use("/api/perfiles", perfilRoutes);
app.use("/api/tiendas", tiendaRoutes);
app.use("/api/productos", productoRoutes);
app.use("/api/categorias", categoriaRoutes);
app.use("/api/usuarios", usuarioRoutes);

app.get("/api/health", (req, res) => {
  res.json({ ok: true, mensaje: "SpotMarket API funcionando" });
});

async function iniciarServidor() {
  try {
    await conexion.authenticate();
    await conexion.sync({ alter: true });

    app.listen(PUERTO, () => {
      console.log(`Servidor corriendo en el puerto ${PUERTO}`);
    });
  } catch (error) {
    console.error("Error al iniciar el servidor:", error.message);
  }
}

iniciarServidor();
