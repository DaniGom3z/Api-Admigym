import { PrismaClient } from '@prisma/client';
import Joi from 'joi';

const prisma = new PrismaClient();

const membershipSchema = Joi.object({
    type: Joi.string().valid('mensual', 'diaria').required(),
    startDate: Joi.date().iso().required(),
    endDate: Joi.date().iso().greater(Joi.ref('startDate')).required(),
    price: Joi.number().positive().required(),
    memberId: Joi.number().integer().required()
});


export const createMembership = async (req, res) => {
    try {
        const { error, value } = membershipSchema.validate(req.body);

        if (error) {
            return res.status(400).json({
                message: "Datos de entrada inválidos",
                details: error.details
            });
        }

        const { type, startDate, endDate, price, memberId } = value;

        const membership = await prisma.membership.create({
            data: {
                type,
                startDate: new Date(startDate),
                endDate: new Date(endDate),
                price,
                user: { connect: { id: memberId } }
            }
        });

        return res.status(201).json({
            message: "Membresía creada exitosamente",
            membership
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Error al crear la membresía",
            error: error.message  // Add error message for easier debugging
        });
    }
};

export const getMemberships = async (req, res) => {
    try {
        const memberships = await prisma.membership.findMany({
            include: { user: true }  // Changed to user for the new schema
        });

        return res.status(200).json({
            message: "Membresías obtenidas exitosamente",
            memberships
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Error al obtener las membresías",
            error: error.message
        });
    }
};