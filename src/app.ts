import express, { Request, Response } from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import likeRoutes from './routes/likeRoutes';
import postRoutes from './routes/postRoutes';
import { setupSwagger } from './swagger';  
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

 
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

 
setupSwagger(app);
 
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/likes', likeRoutes);
app.use('/api/posts', postRoutes);

 
app.get('/', (req: Request, res: Response) => {
  res.send('API en funcionamiento');
});
 
app.use((err: any, req: Request, res: Response, next: Function) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

 
app.listen(PORT, () => {
  console.log(`Servidor en funcionamiento en el puerto ${PORT}`);
  console.log(`Documentación disponible en http://localhost:${PORT}/api-docs`);
});

export default app;
