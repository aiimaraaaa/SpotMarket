import express from "express";
import { registrar, iniciarSesion } from "../controllers/authController.js";
import {
  validarRegistro,
  validarLogin,
} from "../middlewares/validations/authValidation.js";
import { validate } from "../middlewares/validate.js";

const router = express.Router();

router.post("/registro", validarRegistro, validate, registrar);
router.post("/login", validarLogin, validate, iniciarSesion);

export default router;
