import { body } from "express-validator";
import Usuario from "../../models/usuarioModel.js";

export const validarRegistro = [
  body("nombre")
    .notEmpty()
    .withMessage("El nombre es obligatorio")
    .isLength({ min: 2 })
    .withMessage("El nombre debe tener al menos 2 caracteres"),

  body("email")
    .notEmpty()
    .withMessage("El email es obligatorio")
    .isEmail()
    .withMessage("El email debe ser válido")
    .custom(async (email) => {
      const usuario = await Usuario.findOne({ where: { email } });
      if (usuario) {
        throw new Error("El email ya está registrado");
      }
      return true;
    }),

  body("contrasena")
    .notEmpty()
    .withMessage("La contraseña es obligatoria")
    .isLength({ min: 6 })
    .withMessage("La contraseña debe tener al menos 6 caracteres"),

  body("rol")
    .optional()
    .isIn(["admin", "comercio", "cliente"])
    .withMessage("Rol no válido"),
];

export const validarLogin = [
  body("email")
    .notEmpty()
    .withMessage("El email es obligatorio")
    .isEmail()
    .withMessage("El email debe ser válido"),

  body("contrasena").notEmpty().withMessage("La contraseña es obligatoria"),
];
