import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import Joi from 'joi';

const prisma = new PrismaClient();

const SALTOS_BCRYPT = process.env.SALTOS_BCRYPT || 10;
const SALTOS = parseInt(SALTOS_BCRYPT);

// ✅ Esquema para crear usuario
const createUserSchema = Joi.object({
    name: Joi.string().required(),
    password: Joi.string().min(6).required(),
    email: Joi.string().email().required()
});

// ✅ Esquema para obtener o eliminar usuario por ID
const userIdSchema = Joi.object({
    id: Joi.number().required()
});

// ✅ Crear usuario
const createUser = async (req, res) => {
    try {
        const { error, value } = createUserSchema.validate(req.body);

        if (error) {
            return res.status(400).json({
                message: "Datos de entrada inválidos",
                details: error.details
            });
        }

        const { name, password, email } = value;

        // Verificar si el usuario ya existe
        const userExists = await prisma.user.findUnique({
            where: { email }
        });

        if (userExists) {
            return res.status(409).json({
                message: "El usuario ya existe"
            });
        }

        // Hash de la contraseña
        const hashedPassword = await bcrypt.hash(password, SALTOS);

        // Crear el usuario
        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword
            }
        });

        return res.status(201).json({
            message: "Usuario creado exitosamente",
            user: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email
            }
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Error al crear usuario"
        });
    }
};

// ✅ Obtener todos los usuarios
const getAllUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true
            }
        });

        return res.status(200).json({
            message: "Usuarios obtenidos exitosamente",
            users
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Error al obtener usuarios"
        });
    }
};

// ✅ Obtener usuario por ID
const getUserById = async (req, res) => {
    try {
        const { error, value } = userIdSchema.validate(req.params);

        if (error) {
            return res.status(400).json({
                message: "Datos de entrada inválidos",
                details: error.details
            });
        }

        const { id } = value;

        // Buscar el usuario
        const user = await prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                email: true
            }
        });

        if (!user) {
            return res.status(404).json({
                message: "Usuario no encontrado"
            });
        }

        return res.status(200).json({
            message: "Usuario encontrado exitosamente",
            user
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Error al obtener usuario"
        });
    }
};

// ✅ Eliminar usuario por ID
const deleteUser = async (req, res) => {
    try {
        const { error, value } = userIdSchema.validate(req.params);

        if (error) {
            return res.status(400).json({
                message: "Datos de entrada inválidos",
                details: error.details
            });
        }

        const { id } = value;

        // Buscar el usuario antes de eliminar
        const userExists = await prisma.user.findUnique({
            where: { id }
        });

        if (!userExists) {
            return res.status(404).json({
                message: "Usuario no encontrado"
            });
        }

        // Eliminar usuario
        await prisma.user.delete({
            where: { id }
        });

        return res.status(200).json({
            message: "Usuario eliminado exitosamente"
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Error al eliminar usuario"
        });
    }
};

export default {
    createUser,
    getAllUsers,
    getUserById,
    deleteUser
};
