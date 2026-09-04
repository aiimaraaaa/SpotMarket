import { body, param } from "express-validator";
import Producto from "../../models/productoModel.js";
import Tienda from "../../models/tiendaModel.js";

const CATEGORIAS_PERMITIDAS = [
  "carnes",
  "verduras",
  "frutas",
  "lacteos",
  "panaderia",
  "bebidas",
  "infusiones",
  "secos",
  "conservas",
  "huevos",
  "almacen",
];

export const validarCrearProducto = [
  body("nombre")
    .notEmpty()
    .withMessage("El nombre del producto es obligatorio")
    .isLength({ min: 3 })
    .withMessage("El nombre debe tener al menos 3 caracteres"),

  body("precio")
    .notEmpty()
    .withMessage("El precio es obligatorio")
    .isFloat({ min: 0 })
    .withMessage("El precio debe ser un número mayor o igual a 0"),

  body("categoria")
    .notEmpty()
    .withMessage("La categoría es obligatoria")
    .isIn(CATEGORIAS_PERMITIDAS)
    .withMessage(
      `Categoría no válida. Permitidas: ${CATEGORIAS_PERMITIDAS.join(", ")}`,
    ),

  body("tiendaId")
    .notEmpty()
    .withMessage("La tienda es obligatoria")
    .isInt()
    .withMessage("La tienda debe ser un número")
    .custom(async (tiendaId) => {
      const tienda = await Tienda.findByPk(tiendaId);
      if (!tienda) {
        throw new Error("La tienda no existe");
      }
      return true;
    }),
];

export const validarProductoId = [
  param("id")
    .isInt()
    .withMessage("El ID debe ser un número entero")
    .custom(async (id) => {
      const producto = await Producto.findByPk(id);
      if (!producto) {
        throw new Error("El producto no existe");
      }
      return true;
    }),
];
