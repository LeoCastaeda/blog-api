import express, { Request, Response } from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import likeRoutes from './routes/likeRoutes';
import postRoutes from './routes/postRoutes';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],}));

// Rutas
app.use('/auth/', authRoutes); 
app.use('/users', userRoutes);
app.use('/api/likes', likeRoutes);
app.use('/api', postRoutes);

// Ruta principal
app.get('/', (req: Request, res: Response) => {
  res.send('API en funcionamiento');
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});

export default app;
