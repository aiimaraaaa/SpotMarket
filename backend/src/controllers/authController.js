import { Usuario } from "../models/index.js";
import { hashPassword, comparePassword } from "../helpers/bcrypt.helper.js";
import { generateToken } from "../helpers/jwt.helper.js";

export async function registrar(req, res) {
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
    res.status(500).json({ error: "No se pudo registrar el usuario" });
  }
}

export async function iniciarSesion(req, res) {
  try {
    const { email, contrasena } = req.body;

    if (!email || !contrasena) {
      return res
        .status(400)
        .json({ error: "Email y contraseña son obligatorios" });
    }

    const usuario = await Usuario.findOne({ where: { email } });
    if (!usuario) {
      return res.status(401).json({ error: "Email o contraseña incorrectos" });
    }

    const validPassword = await comparePassword(contrasena, usuario.contrasena);
    if (!validPassword) {
      return res.status(401).json({ error: "Email o contraseña incorrectos" });
    }

    const token = generateToken({
      id: usuario.id,
      nombre: usuario.nombre,
      email: usuario.email,
      rol: usuario.rol,
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 1000 * 60 * 60,
    });

    res.json({
      id: usuario.id,
      nombre: usuario.nombre,
      email: usuario.email,
      rol: usuario.rol,
      mensaje: "Inicio de sesión exitoso",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "No se pudo iniciar sesión" });
  }
}

export async function cerrarSesion(req, res) {
  try {
    res.clearCookie("token");
    res.json({ mensaje: "Sesión cerrada exitosamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "No se pudo cerrar la sesión" });
  }
}
