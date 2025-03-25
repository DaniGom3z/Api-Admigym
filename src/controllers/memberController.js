import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import Joi from 'joi';

const prisma = new PrismaClient();

const SALTOS_BCRYPT = process.env.SALTOS_BCRYPT || 10;
const SALTOS = parseInt(SALTOS_BCRYPT);

const createMemberSchema = Joi.object({
    name: Joi.string().required(),
    number: Joi.string().min(6).required()
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

        const { name, number } = value;

        const memberExists = await prisma.member.findUnique({
            where: { number }
        });

        if (memberExists) {
            return res.status(409).json({
                message: "El Miembro ya existe"
            });
        }



        const newMember = await prisma.member.create({
            data: {
                name,
                number
            }
        });

        return res.status(201).json({
            message: "Miembro creado exitosamente",
            member: {
                id: newMember.id,
                name: newMember.name,
                number: newMember.number
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
                number: true
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
                number: true
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
