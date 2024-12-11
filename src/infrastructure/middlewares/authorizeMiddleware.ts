import { Request, Response, NextFunction } from "express";
import { AuthorizeUserUseCase } from "../../application/use-cases/AuthorizeUserUseCase"; // Ajusta la ruta si es necesario
import { AuthorizeUserDto } from "../../application/dtos/authorize-user.dto";
import { Role } from "../../domain/entities/Role";

interface AuthenticatedRequest extends Request {
  user?: { id: number; role: Role };
}

 
const authorizeUserUseCase = new AuthorizeUserUseCase();

 
function authorizationMiddleware(requiredAction: string) {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
       
      if (!req.user) {
        res.status(401).json({ message: "Unauthorized: User information is missing." });
        return;
      }

      const userId = req.user.id;  
      const userRole = req.user.role;  

       
      const authorizeUserDto = new AuthorizeUserDto(userId, userRole, requiredAction);

       
      const isAuthorized = await authorizeUserUseCase.execute(authorizeUserDto);

       
      if (isAuthorized) {
        next();   
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