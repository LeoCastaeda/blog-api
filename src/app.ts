import express, { Request, Response } from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import likeRoutes from './routes/likeRoutes';
import postRoutes from './routes/postRoutes';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

// Rutas
app.use('/auth/register', authRoutes); 
app.use('/users', userRoutes);
app.use('/likes', likeRoutes);
app.use('/posts', postRoutes);

// Ruta principal
app.get('/', (req: Request, res: Response) => {
  res.send('API en funcionamiento');
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});

export default app;
