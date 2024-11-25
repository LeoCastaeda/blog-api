import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";

dotenv.config();

const app = express();
app.use(express.json()); // Middleware para parsear JSON

// Ruta de prueba
app.get("/", (req, res) => {
  res.send("¡Bienvenido a BlogAPI!");
});

// Registrar rutas de autenticación con el prefijo '/auth'
app.use("/auth", authRoutes);
app.use("/users", userRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
