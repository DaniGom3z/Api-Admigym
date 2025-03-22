import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Crear un equipo
export const createEquipment = async (req, res) => {
  try {
    const { name, maintenanceDate, lastMaintained, quantity } = req.body;
    const equipment = await prisma.equipment.create({
      data: { name, maintenanceDate, lastMaintained, quantity }
    });
    res.status(201).json(equipment);
  } catch (error) {
    res.status(400).json({ error: 'Error creating equipment' });
  }
};

// Obtener todos los equipos
export const getEquipments = async (req, res) => {
  try {
    const equipments = await prisma.equipment.findMany();
    res.status(200).json(equipments);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching equipments' });
  }
};

// Obtener un equipo por ID
export const getEquipmentById = async (req, res) => {
  try {
    const { id } = req.params;
    const equipment = await prisma.equipment.findUnique({
      where: { id: parseInt(id) }
    });

    if (!equipment) {
      return res.status(404).json({ error: 'Equipment not found' });
    }

    res.status(200).json(equipment);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching equipment' });
  }
};

// Actualizar el mantenimiento de un equipo
export const updateMaintenance = async (req, res) => {
  try {
    const { id } = req.params;
    const { maintenanceDate, lastMaintained } = req.body;

    const updatedEquipment = await prisma.equipment.update({
      where: { id: parseInt(id) },
      data: { maintenanceDate, lastMaintained }
    });

    res.status(200).json(updatedEquipment);
  } catch (error) {
    res.status(400).json({ error: 'Error updating equipment maintenance' });
  }
};

// Eliminar un equipo
export const deleteEquipment = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedEquipment = await prisma.equipment.delete({
      where: { id: parseInt(id) }
    });

    res.status(200).json({ message: 'Equipment deleted successfully', deletedEquipment });
  } catch (error) {
    res.status(400).json({ error: 'Error deleting equipment' });
  }
};
