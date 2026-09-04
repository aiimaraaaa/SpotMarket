import { validationResult } from "express-validator";

export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formattedErrors = errors.formatWith((err) => {
      return `${err.path}: ${err.msg}`;
    });

    return res.status(400).json({
      errores: formattedErrors.array(),
      mensaje: "Error de validación. Revisá los campos.",
    });
  }
  next();
};
