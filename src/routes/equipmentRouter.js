import express from 'express';
import {
  createEquipment,
  getEquipments,
  getEquipmentById,
  updateMaintenance,
  deleteEquipment
} from '../controllers/equipmentController.js';

const router = express.Router();

// Registrar un equipo
router.post('/', createEquipment);

// Obtener lista de equipos
router.get('/', getEquipments);

// Obtener un equipo por ID
router.get('/:id', getEquipmentById);

// Actualizar mantenimiento de un equipo
router.put('/:id/maintenance', updateMaintenance);

// Eliminar un equipo
router.delete('/:id', deleteEquipment);

export default router;
