import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createSale = async (req, res) => {
  try {
    const { memberId, supplementId, quantity, totalPrice } = req.body;
    const sale = await prisma.sale.create({
      data: { memberId, supplementId, quantity, totalPrice }
    });

    // Reducir el stock del suplemento
    await prisma.supplement.update({
      where: { id: supplementId },
      data: { stock: { decrement: quantity } }
    });

    res.status(201).json(sale);
  } catch (error) {
    res.status(400).json({ error: 'Error creating sale' });
  }
};

export const getSales = async (req, res) => {
  try {
    const sales = await prisma.sale.findMany({
      include: {
        member: true,
        supplement: true
      }
    });
    res.status(200).json(sales);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching sales' });
  }
};

export const deleteSale = async (req, res) => {
  try {
    const { id } = req.params;

    // Obtener la venta antes de eliminarla para restaurar el stock
    const sale = await prisma.sale.findUnique({
      where: { id: parseInt(id) },
    });

    if (!sale) {
      return res.status(404).json({ error: 'Sale not found' });
    }

    // Restaurar el stock del suplemento eliminado
    await prisma.supplement.update({
      where: { id: sale.supplementId },
      data: { stock: { increment: sale.quantity } }
    });

    // Eliminar la venta
    await prisma.sale.delete({
      where: { id: parseInt(id) },
    });

    res.status(200).json({ message: 'Sale deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting sale' });
  }
};
