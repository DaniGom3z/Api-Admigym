import express from 'express';
import { 
  createSale, 
  getSales, 
  deleteSale 
} from '../controllers/saleController.js';

const router = express.Router();

// Registrar venta
router.post('/', createSale);

// Obtener todas las ventas
router.get('/', getSales);

// Eliminar venta por ID
router.delete('/:id', deleteSale);

export default router;
