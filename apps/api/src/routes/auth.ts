import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';

const prisma = new PrismaClient();
const router = Router();

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const changePasswordSchema = z.object({
  currentPassword: z.string().min(6),
  newPassword: z.string().min(6),
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = loginSchema.parse(req.body);

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(400).json({ message: 'Erro ao fazer login' });
  }
});

router.post('/change-password', async (req, res) => {
  try {
    const { currentPassword, newPassword } = changePasswordSchema.parse(req.body);
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ message: 'Não autorizado' });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    const isValidPassword = await bcrypt.compare(currentPassword, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ message: 'Senha atual incorreta' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    res.json({ message: 'Senha alterada com sucesso' });
  } catch (error) {
    res.status(400).json({ message: 'Erro ao alterar senha' });
  }
});

export const authRoutes = router; 