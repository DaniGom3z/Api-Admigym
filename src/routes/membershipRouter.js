import express from 'express';
import { createMembership, getMemberships } from '../controllers/membershipController.js';

const router = express.Router();

router.post('/', createMembership); // Crear membresía
router.get('/', getMemberships);    // Obtener todas las membresías

export default router;
