import express from "express";
import {
  registrar,
  iniciarSesion,
  cerrarSesion,
} from "../controllers/authController.js";
import {
  validarRegistro,
  validarLogin,
} from "../middlewares/validations/authValidation.js";
import { validate } from "../middlewares/validate.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/registro", validarRegistro, validate, registrar);
router.post("/login", validarLogin, validate, iniciarSesion);

router.post("/logout", authMiddleware, cerrarSesion);

export default router;
