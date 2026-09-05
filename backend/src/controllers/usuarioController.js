import { Usuario, Perfil, Tienda } from "../models/index.js";

export async function obtenerUsuarios(req, res) {
  try {
    const usuarios = await Usuario.findAll({
      attributes: { exclude: ["contrasena"] },
      include: [
        { model: Perfil, attributes: ["id", "dni", "telefono", "direccion"] },
        {
          model: Tienda,
          attributes: ["id", "nombre", "categoria", "direccion"],
        },
      ],
    });
    res.json(usuarios);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "No se pudieron obtener los usuarios" });
  }
}

export async function obtenerUsuarioPorId(req, res) {
  try {
    const usuario = await Usuario.findByPk(req.params.id, {
      attributes: { exclude: ["contrasena"] },
      include: [
        { model: Perfil, attributes: ["id", "dni", "telefono", "direccion"] },
        {
          model: Tienda,
          attributes: ["id", "nombre", "categoria", "direccion"],
        },
      ],
    });

    if (!usuario) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    res.json(usuario);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "No se pudo obtener el usuario" });
  }
}

export async function crearUsuario(req, res) {
  try {
    const { nombre, email, contrasena, rol } = req.body;

    if (!nombre || !email || !contrasena) {
      return res
        .status(400)
        .json({ error: "Nombre, email y contraseña son obligatorios" });
    }

    const usuarioExistente = await Usuario.findOne({ where: { email } });
    if (usuarioExistente) {
      return res.status(400).json({ error: "Este email ya está registrado" });
    }

    const hashedPassword = await hashPassword(contrasena);

    const usuario = await Usuario.create({
      nombre,
      email,
      contrasena: hashedPassword,
      rol: rol || "cliente",
    });

    res.status(201).json({
      id: usuario.id,
      nombre: usuario.nombre,
      email: usuario.email,
      rol: usuario.rol,
      mensaje: "Usuario creado exitosamente",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "No se pudo crear el usuario" });
  }
}

export async function actualizarUsuario(req, res) {
  try {
    const usuario = await Usuario.findByPk(req.params.id);
    if (!usuario) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const { nombre, email, rol } = req.body;

    await usuario.update({
      nombre: nombre || usuario.nombre,
      email: email || usuario.email,
      rol: rol || usuario.rol,
    });

    res.json({
      id: usuario.id,
      nombre: usuario.nombre,
      email: usuario.email,
      rol: usuario.rol,
      mensaje: "Usuario actualizado exitosamente",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "No se pudo actualizar el usuario" });
  }
}

export async function eliminarUsuario(req, res) {
  try {
    const usuario = await Usuario.findByPk(req.params.id);
    if (!usuario) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    await usuario.destroy();
    res.json({ mensaje: "Usuario eliminado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "No se pudo eliminar el usuario" });
  }
}
