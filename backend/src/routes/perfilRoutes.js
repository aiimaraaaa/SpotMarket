import express from 'express';
import {
    obtenerPerfiles,
    obtenerPerfilPorId,
    crearPerfil,
    actualizarPerfil,
    eliminarPerfil,
} from '../controllers/perfilController.js';

const router = express.Router();


router.get('/', obtenerPerfiles);
router.get('/:id', obtenerPerfilPorId);
router.post('/', crearPerfil);
router.put('/:id', actualizarPerfil);
router.delete('/:id', eliminarPerfil);

export default router;