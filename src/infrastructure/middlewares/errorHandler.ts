import { Request, Response, NextFunction } from 'express';

 
export class AppError extends Error {
  public readonly statusCode: number;

  constructor(message: string, statusCode: number = 400) {
    super(message);
    this.statusCode = statusCode;
  }
}

 
export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction): void {
   
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ error: err.message });
  } else {
     
    console.error(err);  
    res.status(500).json({ error: 'Internal server error' });
  }
}
