import { Tienda, Usuario, Producto } from '../models/index.js';
import { Op } from 'sequelize';


const CATEGORIAS_PERMITIDAS = ['carniceria', 'verduleria', 'fruteria', 'lacteos', 'panaderia', 'bebidas', 'infusiones', 'almacen'];


export async function obtenerTiendas(req, res) {
    try {
        const { categoria, busqueda } = req.query;
        const filtro = {};


        if (categoria && categoria !== 'todas') {
            if (!CATEGORIAS_PERMITIDAS.includes(categoria)) {
                return res.status(400).json({ error: 'Categoría no válida. Solo alimentos: carniceria, verduleria, fruteria, lacteos, panaderia, bebidas, infusiones, almacen' });
            }
            filtro.categoria = categoria;
        }


        if (busqueda) {
            filtro.nombre = { [Op.like]: `%${busqueda}%` };
        }

        const tiendas = await Tienda.findAll({
            where: filtro,
            order: [['createdAt', 'DESC']],
            include: [
                { model: Usuario, attributes: ['id', 'nombre', 'email'] },
                { model: Producto, attributes: ['id', 'nombre', 'precio'] },
            ],
        });

        res.json(tiendas);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'No se pudieron obtener las tiendas' });
    }
}

export async function obtenerTiendaPorId(req, res) {
    try {
        const tienda = await Tienda.findByPk(req.params.id, {
            include: [
                { model: Usuario, attributes: ['id', 'nombre', 'email'] },
                { model: Producto, attributes: ['id', 'nombre', 'precio'] },
            ],
        });

        if (!tienda) {
            return res.status(404).json({ error: 'Tienda no encontrada' });
        }

        res.json(tienda);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'No se pudo obtener la tienda' });
    }
}

export async function crearTienda(req, res) {
    try {
        const { nombre, categoria, direccion, descripcion, whatsapp, latitud, longitud, logo, usuarioId } = req.body;


        if (!nombre || !categoria || !direccion || !usuarioId) {
            return res.status(400).json({ error: 'Nombre, categoría, dirección y usuario son obligatorios' });
        }


        if (!CATEGORIAS_PERMITIDAS.includes(categoria)) {
            return res.status(400).json({ error: 'Categoría no válida. Solo alimentos: carniceria, verduleria, fruteria, lacteos, panaderia, bebidas, infusiones, almacen' });
        }


        const usuario = await Usuario.findByPk(usuarioId);
        if (!usuario) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        const tiendaExistente = await Tienda.findOne({ where: { usuarioId } });
        if (tiendaExistente) {
            return res.status(400).json({ error: 'Este usuario ya tiene una tienda registrada' });
        }

        const tienda = await Tienda.create({
            nombre,
            categoria,
            direccion,
            descripcion,
            whatsapp,
            latitud,
            longitud,
            logo,
            usuarioId,
        });

        res.status(201).json(tienda);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'No se pudo crear la tienda' });
    }
}


export async function actualizarTienda(req, res) {
    try {
        const tienda = await Tienda.findByPk(req.params.id);
        if (!tienda) {
            return res.status(404).json({ error: 'Tienda no encontrada' });
        }

        const { nombre, categoria, direccion, descripcion, whatsapp, latitud, longitud, logo } = req.body;


        if (categoria && !CATEGORIAS_PERMITIDAS.includes(categoria)) {
            return res.status(400).json({ error: 'Categoría no válida. Solo alimentos.' });
        }

        await tienda.update({
            nombre: nombre || tienda.nombre,
            categoria: categoria || tienda.categoria,
            direccion: direccion || tienda.direccion,
            descripcion: descripcion || tienda.descripcion,
            whatsapp: whatsapp || tienda.whatsapp,
            latitud: latitud || tienda.latitud,
            longitud: longitud || tienda.longitud,
            logo: logo || tienda.logo,
        });

        res.json(tienda);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'No se pudo actualizar la tienda' });
    }
}


export async function eliminarTienda(req, res) {
    try {
        const tienda = await Tienda.findByPk(req.params.id);
        if (!tienda) {
            return res.status(404).json({ error: 'Tienda no encontrada' });
        }

        await tienda.destroy();
        res.json({ mensaje: 'Tienda eliminada correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'No se pudo eliminar la tienda' });
    }
}