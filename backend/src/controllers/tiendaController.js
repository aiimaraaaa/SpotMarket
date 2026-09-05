import express from "express";
import {
  obtenerTiendas,
  obtenerTiendaPorId,
  crearTienda,
  actualizarTienda,
  eliminarTienda,
} from "../controllers/tiendaController.js";
import {
  validarCrearTienda,
  validarTiendaId,
} from "../middlewares/validations/tiendaValidation.js";
import { validate } from "../middlewares/validate.js";
import {
  authMiddleware,
  verificarRol,
} from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", obtenerTiendas);
router.get("/:id", validarTiendaId, validate, obtenerTiendaPorId);

router.post(
  "/",
  authMiddleware,
  verificarRol(["comercio", "admin"]),
  validarCrearTienda,
  validate,
  crearTienda,
);

router.put(
  "/:id",
  authMiddleware,
  verificarRol(["comercio", "admin"]),
  validarTiendaId,
  validate,
  actualizarTienda,
);

router.delete(
  "/:id",
  authMiddleware,
  verificarRol(["comercio", "admin"]),
  validarTiendaId,
  validate,
  eliminarTienda,
);

export default router;
