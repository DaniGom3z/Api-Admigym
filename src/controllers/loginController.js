import { PrismaClient } from "@prisma/client";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();
const privateKey = process.env.SECRET_KEY;
const algorithm = process.env.ALGORITMO || 'HS256';




const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Buscar usuario por correo
        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            return res.status(400).json({
                message: "Credenciales incorrectas!"
            });
        }

        // Comparar la contraseña
        const isPasswordCorrect = bcrypt.compareSync(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({
                message: "Credenciales incorrectas!",
            });
        }

        // Generar token JWT
        const token = jwt.sign(
            { id: user.id, email: user.email },
            privateKey,
            { algorithm }
        );

        return res.status(200).json({
            message: "Acceso correcto",
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        console.error("Error en login:", error);
        return res.status(500).json({
            message: "Ocurrió un error al validar credenciales.",
            error: error.message
        });
    }
};

export default login;
