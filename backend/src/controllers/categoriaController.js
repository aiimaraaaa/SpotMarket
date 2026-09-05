import { Categoria, Producto } from "../models/index.js";

export async function obtenerCategorias(req, res) {
  try {
    const categorias = await Categoria.findAll({
      include: [
        {
          model: Producto,
          attributes: ["id", "nombre", "precio"],
          through: { attributes: [] },
        },
      ],
    });
    res.json(categorias);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "No se pudieron obtener las categorías" });
  }
}

export async function obtenerCategoriaPorId(req, res) {
  try {
    const categoria = await Categoria.findByPk(req.params.id, {
      include: [
        {
          model: Producto,
          attributes: ["id", "nombre", "precio"],
          through: { attributes: [] },
        },
      ],
    });

    if (!categoria) {
      return res.status(404).json({ error: "Categoría no encontrada" });
    }

    res.json(categoria);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "No se pudo obtener la categoría" });
  }
}

export async function crearCategoria(req, res) {
  try {
    const { nombre, descripcion, emoji } = req.body;

    if (!nombre) {
      return res
        .status(400)
        .json({ error: "El nombre de la categoría es obligatorio" });
    }

    const categoria = await Categoria.create({ nombre, descripcion, emoji });
    res.status(201).json(categoria);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "No se pudo crear la categoría" });
  }
}

export async function actualizarCategoria(req, res) {
  try {
    const categoria = await Categoria.findByPk(req.params.id);
    if (!categoria) {
      return res.status(404).json({ error: "Categoría no encontrada" });
    }

    const { nombre, descripcion, emoji } = req.body;
    await categoria.update({ nombre, descripcion, emoji });

    res.json(categoria);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "No se pudo actualizar la categoría" });
  }
}

export async function eliminarCategoria(req, res) {
  try {
    const categoria = await Categoria.findByPk(req.params.id);
    if (!categoria) {
      return res.status(404).json({ error: "Categoría no encontrada" });
    }

    await categoria.destroy();
    res.json({ mensaje: "Categoría eliminada correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "No se pudo eliminar la categoría" });
  }
}
