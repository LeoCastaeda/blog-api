import { Request, Response, NextFunction } from "express";
import { AuthorizeUserUseCase } from "../../application/use-cases/AuthorizeUserUseCase";

const authorizeUserUseCase = new AuthorizeUserUseCase();

export function authorize(action: string) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validar si la acción es válida
      if (!action) {
        return res.status(400).json({ message: "Bad Request: Action is required" });
      }

      // Validar si el usuario está autenticado
      const user = req.user;
      if (!user) {
        return res.status(401).json({ message: "Unauthorized: User not authenticated" });
      }

      // Ejecutar el caso de uso para verificar la autorización
      const isAuthorized = await authorizeUserUseCase.execute({
        userId: user.id,
        userRole: user.role,
        action,
      });

      if (!isAuthorized) {
        return res.status(403).json({ message: "Forbidden: Insufficient permissions" });
      }

      next();
    } catch (error) {
      console.error("Error in authorization middleware:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
}
