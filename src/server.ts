import express, { Request, Response } from 'express';
import dotenv from 'dotenv';

 

dotenv.config();

const app = express();
app.use(express.json());

 

// Ruta de prueba
app.get('/', (req: Request, res: Response) => {
  res.send('¡Bienvenido a BlogAPI!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
  console.log(`Documentación de API disponible en http://localhost:${PORT}/api-docs`);
});
