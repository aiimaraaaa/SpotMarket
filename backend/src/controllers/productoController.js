// Controlador de productos
import { Producto, Tienda, Categoria } from '../models/index.js';
import { Op } from 'sequelize';


const CATEGORIAS_PERMITIDAS = ['carnes', 'verduras', 'frutas', 'lacteos', 'panaderia', 'bebidas', 'infusiones', 'secos', 'conservas', 'huevos', 'almacen'];


export async function obtenerProductos(req, res) {
    try {
        const { categoria, busqueda, precioMin, precioMax, tiendaId, orden } = req.query;
        const filtro = {};


        if (categoria && categoria !== 'todas') {
            if (!CATEGORIAS_PERMITIDAS.includes(categoria)) {
                return res.status(400).json({ error: 'Categoría no válida. Solo alimentos: carnes, verduras, frutas, lacteos, panaderia, bebidas, infusiones, secos, conservas, huevos, almacen' });
            }
            filtro.categoria = categoria;
        }

        if (busqueda) {
            filtro.nombre = { [Op.like]: `%${busqueda}%` };
        }


        if (tiendaId) {
            filtro.tiendaId = tiendaId;
        }


        if (precioMin || precioMax) {
            filtro.precio = {};
            if (precioMin) filtro.precio[Op.gte] = parseFloat(precioMin);
            if (precioMax) filtro.precio[Op.lte] = parseFloat(precioMax);
        }

        let ordenamiento = [['createdAt', 'DESC']];
        if (orden === 'precio_asc') ordenamiento = [['precio', 'ASC']];
        if (orden === 'precio_desc') ordenamiento = [['precio', 'DESC']];
        if (orden === 'gustados') ordenamiento = [['me_gusta', 'DESC']];

        const productos = await Producto.findAll({
            where: filtro,
            order: ordenamiento,
            include: [
                { model: Tienda, attributes: ['id', 'nombre', 'direccion'] },
                { model: Categoria, attributes: ['id', 'nombre', 'emoji'], through: { attributes: [] } },
            ],
        });

        res.json(productos);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'No se pudieron obtener los productos' });
    }
}


export async function obtenerProductoPorId(req, res) {
    try {
        const producto = await Producto.findByPk(req.params.id, {
            include: [
                { model: Tienda, attributes: ['id', 'nombre', 'direccion'] },
                { model: Categoria, attributes: ['id', 'nombre', 'emoji'], through: { attributes: [] } },
            ],
        });

        if (!producto) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        res.json(producto);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'No se pudo obtener el producto' });
    }
}


export async function crearProducto(req, res) {
    try {
        const { nombre, precio, categoria, descripcion, imagen, tiendaId, categoriaIds } = req.body;


        if (!nombre || !precio || !categoria || !tiendaId) {
            return res.status(400).json({ error: 'Nombre, precio, categoría y tienda son obligatorios' });
        }

        if (!CATEGORIAS_PERMITIDAS.includes(categoria)) {
            return res.status(400).json({ error: 'Categoría no válida. Solo alimentos: carnes, verduras, frutas, lacteos, panaderia, bebidas, infusiones, secos, conservas, huevos, almacen' });
        }


        const tienda = await Tienda.findByPk(tiendaId);
        if (!tienda) {
            return res.status(404).json({ error: 'Tienda no encontrada' });
        }


        const producto = await Producto.create({
            nombre,
            precio,
            categoria,
            descripcion,
            imagen,
            tiendaId,
        });


        if (categoriaIds && categoriaIds.length > 0) {
            const categorias = await Categoria.findAll({ where: { id: categoriaIds } });
            await producto.setCategorias(categorias);
        }

        res.status(201).json(producto);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'No se pudo crear el producto' });
    }
}


export async function actualizarProducto(req, res) {
    try {
        const producto = await Producto.findByPk(req.params.id);
        if (!producto) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        const { nombre, precio, categoria, descripcion, imagen } = req.body;

        // Validar categoría si se envía
        if (categoria && !CATEGORIAS_PERMITIDAS.includes(categoria)) {
            return res.status(400).json({ error: 'Categoría no válida. Solo alimentos.' });
        }

        await producto.update({
            nombre: nombre || producto.nombre,
            precio: precio || producto.precio,
            categoria: categoria || producto.categoria,
            descripcion: descripcion || producto.descripcion,
            imagen: imagen || producto.imagen,
        });

        res.json(producto);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'No se pudo actualizar el producto' });
    }
}


export async function eliminarProducto(req, res) {
    try {
        const producto = await Producto.findByPk(req.params.id);
        if (!producto) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        await producto.destroy();
        res.json({ mensaje: 'Producto eliminado correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'No se pudo eliminar el producto' });
    }
}


export async function darMeGusta(req, res) {
    try {
        const producto = await Producto.findByPk(req.params.id);
        if (!producto) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        producto.me_gusta += 1;
        await producto.save();
        res.json(producto);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'No se pudo registrar el "me gusta"' });
    }
}



export async function darNoMeGusta(req, res) {
    try {
        const producto = await Producto.findByPk(req.params.id);
        if (!producto) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        producto.no_me_gusta += 1;
        await producto.save();
        res.json(producto);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'No se pudo registrar el "no me gusta"' });
    }
}