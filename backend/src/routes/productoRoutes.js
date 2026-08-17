import express from 'express';
import {
    obtenerProductos,
    obtenerProductoPorId,
    crearProducto,
    actualizarProducto,
    eliminarProducto,
    darMeGusta,
    darNoMeGusta,
} from '../controllers/productoController.js';

const router = express.Router();


router.get('/', obtenerProductos);
router.get('/:id', obtenerProductoPorId);
router.post('/', crearProducto);
router.put('/:id', actualizarProducto);
router.delete('/:id', eliminarProducto);
router.post('/:id/me-gusta', darMeGusta);
router.post('/:id/no-me-gusta', darNoMeGusta);

export default router;