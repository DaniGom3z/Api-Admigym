import express from 'express';
import cors from 'cors';

const appConfig = () => {
    const app = express();
    app.disable('x-powered-by');
    app.use(cors());
    app.use(express.json());
    return app;
};

export default appConfig;