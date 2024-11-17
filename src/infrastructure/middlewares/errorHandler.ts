import { Request, Response, NextFunction } from 'express';

// Clase de error personalizada para manejar errores específicos
export class AppError extends Error {
  public readonly statusCode: number;

  constructor(message: string, statusCode: number = 400) {
    super(message);
    this.statusCode = statusCode;
  }
}

// Middleware de manejo de errores
export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction): void {
  // Si es una instancia de AppError, devolver el mensaje y el código de estado correspondiente
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ error: err.message });
  } else {
    // Para errores no controlados, usar un mensaje genérico
    console.error(err); // Log para desarrolladores
    res.status(500).json({ error: 'Internal server error' });
  }
}
