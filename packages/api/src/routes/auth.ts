import { Router, Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User, JwtPayload, ApiResponse } from '../types';

// Simulação de banco de dados - em produção seria substituído por um ORM como Prisma
let users: User[] = [];

// Secret para assinatura JWT - em produção deve vir de variáveis de ambiente
const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-jwt-key';

export const authRouter = Router();

// Middleware para autenticação via JWT
export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Token de autenticação não fornecido'
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    req.user = { id: decoded.userId, email: decoded.email };
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: 'Token inválido ou expirado'
    });
  }
};

// Login
authRouter.post('/login', (req: Request, res: Response) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      error: 'Email e senha são obrigatórios'
    });
  }

  const user = users.find(u => u.email === email);
  
  if (!user || user.password !== password) {
    return res.status(401).json({
      success: false,
      error: 'Credenciais inválidas'
    });
  }

  const token = jwt.sign(
    { userId: user.id, email: user.email }, 
    JWT_SECRET, 
    { expiresIn: '24h' }
  );

  return res.json({
    success: true,
    data: {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    }
  });
});

// Registro
authRouter.post('/register', (req: Request, res: Response) => {
  const { email, password, name } = req.body;
  
  if (!email || !password || !name) {
    return res.status(400).json({
      success: false,
      error: 'Nome, email e senha são obrigatórios'
    });
  }

  if (users.some(u => u.email === email)) {
    return res.status(400).json({
      success: false,
      error: 'Email já cadastrado'
    });
  }

  const newUser: User = {
    id: Date.now().toString(),
    email,
    name,
    password,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  users.push(newUser);

  const token = jwt.sign(
    { userId: newUser.id, email: newUser.email }, 
    JWT_SECRET, 
    { expiresIn: '24h' }
  );

  return res.status(201).json({
    success: true,
    data: {
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name
      }
    }
  });
});

// Verificação do token atual
authRouter.get('/me', authenticate, (req: Request, res: Response) => {
  const userId = req.user?.id;
  const user = users.find(u => u.id === userId);
  
  if (!user) {
    return res.status(404).json({
      success: false,
      error: 'Usuário não encontrado'
    });
  }

  return res.json({
    success: true,
    data: {
      id: user.id,
      email: user.email,
      name: user.name
    }
  });
});

// Extensão do Express Request para incluir o usuário autenticado
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
      };
    }
  }
} 