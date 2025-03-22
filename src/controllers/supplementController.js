import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Crear un suplemento
export const createSupplement = async (req, res) => {
  try {
    const { name, price, stock } = req.body;
    const supplement = await prisma.supplement.create({
      data: { name, price, stock }
    });
    res.status(201).json(supplement);
  } catch (error) {
    res.status(400).json({ error: 'Error creating supplement' });
  }
};

// Obtener todos los suplementos
export const getSupplements = async (req, res) => {
  try {
    const supplements = await prisma.supplement.findMany();
    res.status(200).json(supplements);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching supplements' });
  }
};

// Obtener suplemento por ID
export const getSupplementById = async (req, res) => {
  const { id } = req.params;
  try {
    const supplement = await prisma.supplement.findUnique({
      where: { id: parseInt(id) },
    });
    if (supplement) {
      res.status(200).json(supplement);
    } else {
      res.status(404).json({ error: 'Supplement not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error fetching supplement by ID' });
  }
};

// Eliminar suplemento
export const deleteSupplement = async (req, res) => {
  const { id } = req.params;
  try {
    const supplement = await prisma.supplement.delete({
      where: { id: parseInt(id) },
    });
    res.status(200).json({ message: 'Supplement deleted successfully', supplement });
  } catch (error) {
    res.status(400).json({ error: 'Error deleting supplement' });
  }
};
