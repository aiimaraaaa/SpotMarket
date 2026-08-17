import { Usuario, Perfil } from '../models/index.js';


export async function registrar(req, res) {
    try {
        const { nombre, email, contrasena, rol } = req.body;


        if (!nombre || !email || !contrasena) {
            return res.status(400).json({ error: 'Nombre, email y contraseña son obligatorios' });
        }

        const usuarioExistente = await Usuario.findOne({ where: { email } });
        if (usuarioExistente) {
            return res.status(400).json({ error: 'Este email ya está registrado' });
        }

        const usuario = await Usuario.create({
            nombre,
            email,
            contrasena, 
            rol: rol || 'cliente', 
        });

        res.status(201).json({
            id: usuario.id,
            nombre: usuario.nombre,
            email: usuario.email,
            rol: usuario.rol,
            mensaje: 'Usuario creado exitosamente',
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'No se pudo registrar el usuario' });
    }
}

export async function iniciarSesion(req, res) {
    try {
        // Obtener email y contraseña del cuerpo de la petición
        const { email, contrasena } = req.body;

        // Validar que los campos estén completos
        if (!email || !contrasena) {
            return res.status(400).json({ error: 'Email y contraseña son obligatorios' });
        }

        // Buscar el usuario por email
        const usuario = await Usuario.findOne({ where: { email } });
        if (!usuario) {
            return res.status(401).json({ error: 'Email o contraseña incorrectos' });
        }

        // Verificar la contraseña
        if (usuario.contrasena !== contrasena) {
            return res.status(401).json({ error: 'Email o contraseña incorrectos' });
        }
        res.json({
            id: usuario.id,
            nombre: usuario.nombre,
            email: usuario.email,
            rol: usuario.rol,
            mensaje: 'Inicio de sesión exitoso',
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'No se pudo iniciar sesión' });
    }
}