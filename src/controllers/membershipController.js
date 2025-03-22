import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createMembership = async (req, res) => {
  try {
    const { type, startDate, endDate, price, userId } = req.body;
    const membership = await prisma.membership.create({
      data: { type, startDate, endDate, price, userId }
    });
    res.status(201).json(membership);
  } catch (error) {
    res.status(400).json({ error: 'Error creating membership' });
  }
};

export const getMemberships = async (req, res) => {
  try {
    const memberships = await prisma.membership.findMany({
      include: { user: true }
    });
    res.status(200).json(memberships);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching memberships' });
  }
};
