import { body, param } from "express-validator";
import Tienda from "../../models/tiendaModel.js";
import Usuario from "../../models/usuarioModel.js";

const CATEGORIAS_PERMITIDAS = [
  "carniceria",
  "verduleria",
  "fruteria",
  "lacteos",
  "panaderia",
  "bebidas",
  "infusiones",
  "almacen",
];

export const validarCrearTienda = [
  body("nombre")
    .notEmpty()
    .withMessage("El nombre de la tienda es obligatorio")
    .isLength({ min: 3 })
    .withMessage("El nombre debe tener al menos 3 caracteres"),

  body("categoria")
    .notEmpty()
    .withMessage("La categoría es obligatoria")
    .isIn(CATEGORIAS_PERMITIDAS)
    .withMessage(
      `Categoría no válida. Permitidas: ${CATEGORIAS_PERMITIDAS.join(", ")}`,
    ),

  body("direccion").notEmpty().withMessage("La dirección es obligatoria"),

  body("usuarioId")
    .notEmpty()
    .withMessage("El usuario es obligatorio")
    .isInt()
    .withMessage("El usuario debe ser un número")
    .custom(async (usuarioId) => {
      const usuario = await Usuario.findByPk(usuarioId);
      if (!usuario) {
        throw new Error("El usuario no existe");
      }
      const tienda = await Tienda.findOne({ where: { usuarioId } });
      if (tienda) {
        throw new Error("Este usuario ya tiene una tienda registrada");
      }
      return true;
    }),

  body("latitud")
    .optional()
    .isFloat({ min: -90, max: 90 })
    .withMessage("Latitud inválida"),

  body("longitud")
    .optional()
    .isFloat({ min: -180, max: 180 })
    .withMessage("Longitud inválida"),

  body("whatsapp")
    .optional()
    .isLength({ min: 8 })
    .withMessage("El teléfono debe tener al menos 8 dígitos"),
];

export const validarTiendaId = [
  param("id")
    .isInt()
    .withMessage("El ID debe ser un número entero")
    .custom(async (id) => {
      const tienda = await Tienda.findByPk(id);
      if (!tienda) {
        throw new Error("La tienda no existe");
      }
      return true;
    }),
];
