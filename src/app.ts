import express from 'express';
import { errorHandler } from './infrastructure/middlewares/errorHandler';
//import userRoutes from './infrastructure/routes/userRoutes';

const app = express();

// Middlewares globales
app.use(express.json());

// Rutas
//app.use('/api/users', userRoutes);

// Middleware de manejo de errores (siempre debe ir al final)
app.use(errorHandler);

export default app;
