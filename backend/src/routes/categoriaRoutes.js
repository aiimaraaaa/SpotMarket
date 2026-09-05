import express from "express";
import {
  obtenerCategorias,
  obtenerCategoriaPorId,
  crearCategoria,
  actualizarCategoria,
  eliminarCategoria,
} from "../controllers/categoriaController.js";
import {
  authMiddleware,
  verificarRol,
} from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", obtenerCategorias);
router.get("/:id", obtenerCategoriaPorId);

router.post("/", authMiddleware, verificarRol(["admin"]), crearCategoria);
router.put(
  "/:id",
  authMiddleware,
  verificarRol(["admin"]),
  actualizarCategoria,
);
router.delete(
  "/:id",
  authMiddleware,
  verificarRol(["admin"]),
  eliminarCategoria,
);

export default router;
