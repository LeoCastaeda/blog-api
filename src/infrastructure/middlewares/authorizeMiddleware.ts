import { Request, Response, NextFunction } from "express";
import { AuthorizeUserUseCase } from "../../application/use-cases/AuthorizeUserUseCase"; // Ajusta la ruta si es necesario
import { AuthorizeUserDto } from "../../application/dtos/authorize-user.dto";
import { Role } from "../../domain/entities/Role";

interface AuthenticatedRequest extends Request {
  user?: { id: number; role: Role };
}

// Instancia del caso de uso (fuera del middleware)
const authorizeUserUseCase = new AuthorizeUserUseCase();

// Middleware de autorización
function authorizationMiddleware(requiredAction: string) {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Verificar si el usuario está autenticado
      if (!req.user) {
        res.status(401).json({ message: "Unauthorized: User information is missing." });
        return;
      }

      const userId = req.user.id; // ID del usuario
      const userRole = req.user.role; // Rol del usuario

      // Crear el DTO para la autorización
      const authorizeUserDto = new AuthorizeUserDto(userId, userRole, requiredAction);

      // Ejecutar la lógica de autorización
      const isAuthorized = await authorizeUserUseCase.execute(authorizeUserDto);

      // Verificar si el usuario tiene permisos
      if (isAuthorized) {
        next(); // Continuar al siguiente middleware o controlador
      } else {
        res.status(403).json({ message: "Forbidden: You do not have permission to perform this action." });
      }
    } catch (error) {
      // Manejo de errores
      res.status(500).json({ message: error instanceof Error ? error.message : "An unknown error occurred." });
    }
  };
}

export default authorizationMiddleware;