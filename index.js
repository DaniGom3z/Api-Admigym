import appConfig from './src/config/appConfig.js';
import userRouter from './src/routes/userRouter.js';
import membershipRouter from './src/routes/membershipRouter.js';
import equipmentRouter from './src/routes/equipmentRouter.js';
import supplementRouter from './src/routes/supplementRouter.js';
import saleRouter from './src/routes/saleRouter.js';
import loginRouter from './src/routes/loginRouter.js';
import { createServer } from 'http';

// Configurar la aplicación
const app = appConfig();
const PORT = process.env.PORT || 4000;

// Rutas de la API
app.use('/users', userRouter);
app.use('/memberships', membershipRouter);
app.use('/equipments', equipmentRouter);
app.use('/supplements', supplementRouter);
app.use('/sales', saleRouter);
app.use('/login', loginRouter);

// Crear servidor HTTP
const server = createServer(app);

// Iniciar el servidor
server.listen(PORT, () => {
    console.log(`🚀 Servidor en línea en http://localhost:${PORT}`);
});
