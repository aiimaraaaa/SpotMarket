import { Perfil, Usuario } from '../models/index.js';

export async function obtenerPerfiles(req, res) {
    try {

        const perfiles = await Perfil.findAll({
            include: [{ model: Usuario, attributes: ['id', 'nombre', 'email'] }],
        });
        res.json(perfiles);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'No se pudieron obtener los perfiles' });
    }
}


export async function obtenerPerfilPorId(req, res) {
    try {

        const perfil = await Perfil.findByPk(req.params.id, {
            include: [{ model: Usuario, attributes: ['id', 'nombre', 'email'] }],
        });


        if (!perfil) {
            return res.status(404).json({ error: 'Perfil no encontrado' });
        }

        res.json(perfil);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'No se pudo obtener el perfil' });
    }
}

export async function crearPerfil(req, res) {
    try {

        const { dni, telefono, direccion, fecha_nacimiento, usuarioId } = req.body;


        if (!usuarioId) {
            return res.status(400).json({ error: 'El usuario es obligatorio' });
        }


        const usuario = await Usuario.findByPk(usuarioId);
        if (!usuario) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }


        const perfilExistente = await Perfil.findOne({ where: { usuarioId } });
        if (perfilExistente) {
            return res.status(400).json({ error: 'Este usuario ya tiene un perfil' });
        }


        const perfil = await Perfil.create({
            dni,
            telefono,
            direccion,
            fecha_nacimiento,
            usuarioId,
        });

        res.status(201).json(perfil);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'No se pudo crear el perfil' });
    }
}


export async function actualizarPerfil(req, res) {
    try {

        const perfil = await Perfil.findByPk(req.params.id);
        if (!perfil) {
            return res.status(404).json({ error: 'Perfil no encontrado' });
        }


        const { dni, telefono, direccion, fecha_nacimiento } = req.body;
        

        await perfil.update({
            dni: dni || perfil.dni,
            telefono: telefono || perfil.telefono,
            direccion: direccion || perfil.direccion,
            fecha_nacimiento: fecha_nacimiento || perfil.fecha_nacimiento,
        });

        res.json(perfil);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'No se pudo actualizar el perfil' });
    }
}


export async function eliminarPerfil(req, res) {
    try {
        // Buscar el perfil por su ID
        const perfil = await Perfil.findByPk(req.params.id);
        if (!perfil) {
            return res.status(404).json({ error: 'Perfil no encontrado' });
        }

        // Eliminar el perfil
        await perfil.destroy();
        res.json({ mensaje: 'Perfil eliminado correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'No se pudo eliminar el perfil' });
    }
}