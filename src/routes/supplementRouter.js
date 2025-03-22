import express from 'express';
import { 
  createSupplement, 
  getSupplements, 
  getSupplementById, 
  deleteSupplement 
} from '../controllers/supplementController.js';

const router = express.Router();

// Registrar suplemento
router.post('/', createSupplement); 

// Obtener todos los suplementos
router.get('/', getSupplements); 

// Obtener suplemento por ID
router.get('/:id', getSupplementById); 

// Eliminar suplemento
router.delete('/:id', deleteSupplement); 

export default router;
