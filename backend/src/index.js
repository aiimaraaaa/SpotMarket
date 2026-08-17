import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { conexion } from "./models/index.js";

import authRoutes from "./routes/authRoutes.js";
import perfilRoutes from "./routes/perfilRoutes.js";
import tiendaRoutes from "./routes/tiendaRoutes.js";
import productoRoutes from "./routes/productoRoutes.js";
import categoriaRoutes from "./routes/categoriaRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PUERTO = process.env.PUERTO || 4004;

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.use(express.static(path.join(__dirname, "../../frontend")));

app.use("/api/auth", authRoutes);
app.use("/api/perfiles", perfilRoutes);
app.use("/api/tiendas", tiendaRoutes);
app.use("/api/productos", productoRoutes);
app.use("/api/categorias", categoriaRoutes);

app.get("/api/health", (req, res) => {
  res.json({ ok: true, mensaje: "SpotMarket API funcionando" });
});

async function iniciarServidor() {
  try {
    console.log("🔄 Conectando a MySQL...");
    await conexion.authenticate();
    console.log("✅ Conexión a MySQL exitosa");

    console.log("🔄 Sincronizando modelos...");
    await conexion.sync({ alter: true });
    console.log("✅ Modelos sincronizados");

    app.listen(PUERTO, () => {
      console.log(` Servidor corriendo en http://localhost:${PUERTO}`);
      console.log(
        ` Frontend disponible en http://localhost:${PUERTO}/login.html`,
      );
      console.log("\n Endpoints disponibles:");
      console.log("   POST   /api/auth/registro");
      console.log("   POST   /api/auth/login");
      console.log("   GET    /api/perfiles");
      console.log("   POST   /api/perfiles");
      console.log("   GET    /api/tiendas");
      console.log("   POST   /api/tiendas");
      console.log("   GET    /api/productos");
      console.log("   POST   /api/productos");
      console.log("   GET    /api/categorias");
      console.log("   POST   /api/categorias");
      console.log("   GET    /api/health");
    });
  } catch (error) {
    console.error(" Error al iniciar el servidor:");
    console.error("   Mensaje:", error.message);
    console.error("   Detalle:", error);
    console.error("   Stack:", error.stack);
  }
}

iniciarServidor();
