import jwt from 'jsonwebtoken'
import dotenv from 'dotenv';
dotenv.config()
const jwtSecret = process.env.SECRET_KEY;


const verificarJWT = (req, res, next) => {
    const token = req.get('Token');

    jwt.verify(token, jwtSecret, (err, decode) => {
        if (err) {
            return res.status(401).send({
                message: "Error al validar token.",
                error: err.message
            });
        }

        req.usuario = decode.usuario;
        next();
    })
};


export default verificarJWT;