import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';

/**
 * Middleware que valida os dados da requisição utilizando express-validator
 * Interrompe o processamento e retorna erros de validação se encontrados
 * @param req Request - Requisição Express
 * @param res Response - Resposta Express
 * @param next NextFunction - Função para continuar processamento
 */
export const validateRequest = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Erro de validação',
      errors: errors.array()
    });
  }
  
  next();
}; 