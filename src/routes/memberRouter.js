import express from "express";
import Member from "../controllers/memberController.js";

const memberRoute = express.Router();

// ✅ Crear usuario (sin protección)
memberRoute.post("/", Member.createMember);


// ✅ Obtener todos los usuarios (protegida con JWT)
memberRoute.get("/",  Member.getAllMembers);

// ✅ Obtener usuario por ID (protegida con JWT)
memberRoute.get("/:id",  Member.getMemberById);

// ✅ Eliminar usuario por ID (protegida con JWT)
memberRoute.delete("/:id",  Member.deleteMember);

export default memberRoute;
