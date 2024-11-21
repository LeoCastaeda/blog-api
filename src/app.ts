import express, { Request, Response } from 'express';
import cors from 'cors'; // Si necesitas habilitar CORS
import authRoutes from './routes/authRoutes'; // Importa las rutas de autenticación
import userRoutes from './routes/userRoutes'; // Rutas de usuarios
import likeRoutes from './routes/likeRoutes'; // Rutas de likes (si las tienes)
import postRoutes from './routes/postRoutes'; // Rutas de publicaciones (si las tienes)

const app = express();
const port = process.env.PORT || 3000;

// Middleware para parsear el cuerpo de las solicitudes como JSON
app.use(express.json());

// Habilitar CORS si es necesario
app.use(cors());

// Usar las rutas en la aplicación
app.use('/auth', authRoutes); // Ruta base para autenticación
app.use('/users', userRoutes); // Ruta base para usuarios
app.use('/likes', likeRoutes); // Ruta base para likes
app.use('/posts', postRoutes); // Ruta base para publicaciones

// Ruta de prueba o fallback
app.get('/', (req: Request, res: Response) => {
  res.send('API en funcionamiento');
});

// Arrancar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});

export default app;