import express from 'express';
import {
    obtenerTiendas,
    obtenerTiendaPorId,
    crearTienda,
    actualizarTienda,
    eliminarTienda,
} from '../controllers/tiendaController.js';

const router = express.Router();


router.get('/', obtenerTiendas);
router.get('/:id', obtenerTiendaPorId);
router.post('/', crearTienda);
router.put('/:id', actualizarTienda);
router.delete('/:id', eliminarTienda);

export default router;