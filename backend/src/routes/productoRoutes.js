import express from "express";
import {
  obtenerProductos,
  obtenerProductoPorId,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
  darMeGusta,
  darNoMeGusta,
} from "../controllers/productoController.js";
import {
  validarCrearProducto,
  validarProductoId,
} from "../middlewares/validations/productoValidation.js";
import { validate } from "../middlewares/validate.js";
import {
  authMiddleware,
  verificarRol,
} from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", obtenerProductos);
router.get("/:id", validarProductoId, validate, obtenerProductoPorId);

router.post(
  "/",
  authMiddleware,
  verificarRol(["comercio", "admin"]),
  validarCrearProducto,
  validate,
  crearProducto,
);

router.put(
  "/:id",
  authMiddleware,
  verificarRol(["comercio", "admin"]),
  validarProductoId,
  validate,
  actualizarProducto,
);

router.delete(
  "/:id",
  authMiddleware,
  verificarRol(["comercio", "admin"]),
  validarProductoId,
  validate,
  eliminarProducto,
);

router.post(
  "/:id/me-gusta",
  authMiddleware,
  validarProductoId,
  validate,
  darMeGusta,
);
router.post(
  "/:id/no-me-gusta",
  authMiddleware,
  validarProductoId,
  validate,
  darNoMeGusta,
);

export default router;
