import { PrismaClient } from '@prisma/client';

// Inicializa uma instância única do PrismaClient para toda a aplicação
const prisma = new PrismaClient();

export default prisma; 