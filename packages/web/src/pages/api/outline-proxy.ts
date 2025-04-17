import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';

// Constantes para a integração com o Outline
const OUTLINE_URL = process.env.OUTLINE_URL || 'https://app.outline.com';
const OUTLINE_SECRET = process.env.OUTLINE_SECRET || 'dummy-secret-for-development';

/**
 * API route que serve como proxy para o Outline
 * Gera tokens JWT para autenticação com o Outline
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { org: organizationSlug, project: projectId } = req.query;
    
    // Validar parâmetros
    if (!organizationSlug || !projectId) {
      return res.status(400).json({ 
        error: 'Parâmetros obrigatórios: org (organizationSlug) e project (projectId)' 
      });
    }

    // Em um ambiente real:
    // 1. Verificar se o usuário está autenticado
    // 2. Verificar se tem permissão para acessar essa organização e projeto
    // 3. Buscar dados reais do banco de dados

    // Gerar token JWT para autenticação com o Outline
    // Em produção, isso seria configurado com os segredos corretos
    const token = jwt.sign({
      sub: 'user-123', // ID do usuário atual
      name: 'Usuário Demonstração',
      email: 'demo@example.com',
      organizationId: organizationSlug,
      collectionId: projectId,
      // Tempo de expiração do token (1 hora)
      exp: Math.floor(Date.now() / 1000) + 60 * 60
    }, OUTLINE_SECRET);

    // Construir URL para o Outline com o token
    const redirectUrl = `${OUTLINE_URL}/auth/jwt?token=${token}`;
    
    // Responder com os dados necessários
    // O frontend decidirá como usar esses dados (redirecionamento ou iframe)
    return res.status(200).json({
      url: redirectUrl,
      organizationSlug,
      projectId,
      collectionId: `collection-${projectId}`, // Em produção, mapearia para um ID real no Outline
    });

  } catch (error) {
    console.error('Erro ao gerar proxy para o Outline:', error);
    return res.status(500).json({ error: 'Erro interno ao processar a requisição' });
  }
} 