import { verifyToken } from "../helpers/jwt.helper.js";

export const authMiddleware = (req, res, next) => {
  try {
    // Obtener token de la cookie
    const token = req.cookies["token"];
    if (!token) {
      return res.status(401).json({ error: "No autenticado" });
    }

    // Verificar y decodificar token
    const decoded = verifyToken(token);

    // Almacenar datos del usuario en req.user
    req.user = decoded;

    next();
  } catch (error) {
    console.error("Error en authMiddleware:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const verificarRol = (rolesPermitidos) => {
  return (req, res, next) => {
    // Verificar que el usuario esté autenticado
    if (!req.user) {
      return res.status(401).json({ error: "No autenticado" });
    }

    // Verificar que el rol del usuario esté en la lista de permitidos
    if (!rolesPermitidos.includes(req.user.rol)) {
      return res.status(403).json({
        error: "Acceso denegado. Rol no autorizado",
        rolesPermitidos,
        rolUsuario: req.user.rol,
      });
    }

    next();
  };
};

export const verificarPropietario = (modelo, foreignKey = "usuarioId") => {
  return async (req, res, next) => {
    try {
      // Verificar que el usuario esté autenticado
      if (!req.user) {
        return res.status(401).json({ error: "No autenticado" });
      }

      // Si es admin, puede pasar directamente
      if (req.user.rol === "admin") {
        return next();
      }

      // Buscar el recurso por ID
      const recurso = await modelo.findByPk(req.params.id);
      if (!recurso) {
        return res.status(404).json({ error: "Recurso no encontrado" });
      }

      // Verificar que el usuario sea el propietario
      if (recurso[foreignKey] !== req.user.id) {
        return res.status(403).json({
          error: "No tienes permiso para modificar este recurso",
        });
      }

      // Almacenar el recurso en req para usarlo después
      req.recurso = recurso;
      next();
    } catch (error) {
      console.error("Error en verificarPropietario:", error);
      return res.status(500).json({ error: "Error interno del servidor" });
    }
  };
};
