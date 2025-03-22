import express from 'express';
const loginRouter = express.Router();
import Login from '../controllers/loginController.js';


loginRouter.post('/', Login);

export default loginRouter;