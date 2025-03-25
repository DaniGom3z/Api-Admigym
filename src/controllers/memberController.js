import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import Joi from 'joi';

const prisma = new PrismaClient();

const SALTOS_BCRYPT = process.env.SALTOS_BCRYPT || 10;
const SALTOS = parseInt(SALTOS_BCRYPT);

const createMemberSchema = Joi.object({
    name: Joi.string().required(),
    number: Joi.string().min(6).required(),
    membership: Joi.object({  // Nested schema for membership data
        type: Joi.string().valid('mensual', 'diaria').required(),
        startDate: Joi.date().iso().required(),
        endDate: Joi.date().iso().greater(Joi.ref('startDate')).required(),
        price: Joi.number().positive().required()
    })
});

const memberIdSchema = Joi.object({
    id: Joi.number().required()
});

const createMember = async (req, res) => {
    try {
        const { error, value } = createMemberSchema.validate(req.body);

        if (error) {
            return res.status(400).json({
                message: "Datos de entrada inválidos",
                details: error.details
            });
        }

        const { name, number, membership } = value;

        const memberExists = await prisma.member.findUnique({
            where: { number }
        });

        if (memberExists) {
            return res.status(409).json({
                message: "El Miembro ya existe"
            });
        }

        // Use Prisma transaction to create both Member and Membership atomically
        const newMember = await prisma.$transaction(async (tx) => {
            const newMember = await tx.member.create({
                data: {
                    name,
                    number,
                },
            });

            let newMembership = null; // Initialize newMembership to null

            // Create membership if membership data was provided
            if (membership) {
                newMembership = await tx.membership.create({
                    data: {
                        type: membership.type,
                        startDate: new Date(membership.startDate),  // Ensure correct date format
                        endDate: new Date(membership.endDate),        // Ensure correct date format
                        price: membership.price,
                        user: { connect: { id: newMember.id } },
                    },
                });
            }

            return { newMember, newMembership };  // Return both newMember and newMembership
        });

        return res.status(201).json({
            message: "Miembro creado exitosamente",
            member: {
                id: newMember.newMember.id,
                name: newMember.newMember.name,
                number: newMember.newMember.number,
                membership: newMember.newMembership // Include membership in the response
            }
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Error al crear miembro"
        });
    }
};

const getAllMembers = async (req, res) => {
    try {
        const members = await prisma.member.findMany({
            select: {
                id: true,
                name: true,
                number: true,
                membership: true // Include the membership data in the select
            }
        });

        return res.status(200).json({
            message: "Miembros obtenidos exitosamente",
            members
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Error al obtener Miembros"
        });
    }
};

const getMemberById = async (req, res) => {
    try {
        const { error, value } = memberIdSchema.validate(req.params);

        if (error) {
            return res.status(400).json({
                message: "Datos de entrada inválidos",
                details: error.details
            });
        }

        const { id } = value;

        const member = await prisma.member.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                number: true,
                membership: true // Also include membership here
            }
        });

        if (!member) {
            return res.status(404).json({
                message: "Miembro no encontrado"
            });
        }

        return res.status(200).json({
            message: "Miembro encontrado exitosamente",
            member
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Error al obtener miembro"
        });
    }
};

const deleteMember = async (req, res) => {
    try {
        const { error, value } = memberIdSchema.validate(req.params);

        if (error) {
            return res.status(400).json({
                message: "Datos de entrada inválidos",
                details: error.details
            });
        }

        const { id } = value;

        const memberExists = await prisma.member.findUnique({
            where: { id }
        });

        if (!memberExists) {
            return res.status(404).json({
                message: "Miembro no encontrado"
            });
        }

        await prisma.member.delete({
            where: { id }
        });

        return res.status(200).json({
            message: "Miembro eliminado exitosamente"
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Error al eliminar miembro"
        });
    }
};

export default {
    createMember,
    getAllMembers,
    getMemberById,
    deleteMember
};