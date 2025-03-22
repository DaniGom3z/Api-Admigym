import express from "express";
import User from "../controllers/userController.js";
import verificarJwt from '../middlewares/jwt.js';

const userRoute = express.Router();

// ✅ Crear usuario (sin protección)
userRoute.post("/", User.createUser);

// ✅ Obtener todos los usuarios (protegida con JWT)
userRoute.get("/", verificarJwt, User.getAllUsers);

// ✅ Obtener usuario por ID (protegida con JWT)
userRoute.get("/:id", verificarJwt, User.getUserById);

// ✅ Eliminar usuario por ID (protegida con JWT)
userRoute.delete("/:id", verificarJwt, User.deleteUser);

export default userRoute;
