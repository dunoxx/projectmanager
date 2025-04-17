import { Router, Request, Response } from 'express';
import { authenticate } from './auth';
import axios from 'axios';
import { logger } from '../utils/logger';
import authService from '../services/auth.service';

const router = Router();
const OUTLINE_API_URL = process.env.OUTLINE_URL || 'http://outline:3001/api';

/**
 * Rotas para integração com o Outline
 * Estas rotas servem como proxy para a API do Outline,
 * adicionando autenticação e tratamento de erros
 */

// Buscar todas as collections do Outline
router.get('/collections', authenticate, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const { organizationSlug } = req.query;

    if (!userId || !organizationSlug) {
      return res.status(400).json({
        success: false,
        error: 'Usuário ou organização não especificados'
      });
    }

    // Chamar a API do Outline para buscar collections
    const response = await axios.get(
      `${OUTLINE_API_URL}/collections`,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${req.headers.authorization?.split(' ')[1]}`
        }
      }
    );

    return res.json({
      success: true,
      data: response.data
    });
  } catch (error: any) {
    logger.error('Erro ao buscar collections do Outline:', error);
    return res.status(error.response?.status || 500).json({
      success: false,
      error: error.response?.data?.message || 'Erro ao comunicar com o Outline'
    });
  }
});

// Buscar detalhes de uma collection específica no Outline
router.get('/collections/:collectionId', authenticate, async (req: Request, res: Response) => {
  try {
    const { collectionId } = req.params;

    // Chamar a API do Outline para buscar detalhes da collection
    const response = await axios.get(
      `${OUTLINE_API_URL}/collections/${collectionId}`,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${req.headers.authorization?.split(' ')[1]}`
        }
      }
    );

    return res.json({
      success: true,
      data: response.data
    });
  } catch (error: any) {
    logger.error('Erro ao buscar detalhes da collection no Outline:', error);
    return res.status(error.response?.status || 500).json({
      success: false,
      error: error.response?.data?.message || 'Erro ao comunicar com o Outline'
    });
  }
});

// Buscar documentos de uma collection no Outline
router.get('/collections/:collectionId/documents', authenticate, async (req: Request, res: Response) => {
  try {
    const { collectionId } = req.params;

    // Chamar a API do Outline para buscar documentos da collection
    const response = await axios.get(
      `${OUTLINE_API_URL}/collections/${collectionId}/documents`,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${req.headers.authorization?.split(' ')[1]}`
        }
      }
    );

    return res.json({
      success: true,
      data: response.data
    });
  } catch (error: any) {
    logger.error('Erro ao buscar documentos da collection no Outline:', error);
    return res.status(error.response?.status || 500).json({
      success: false,
      error: error.response?.data?.message || 'Erro ao comunicar com o Outline'
    });
  }
});

// Buscar conteúdo de um documento específico
router.get('/documents/:documentId', authenticate, async (req: Request, res: Response) => {
  try {
    const { documentId } = req.params;

    // Chamar a API do Outline para obter o documento
    const response = await axios.get(
      `${OUTLINE_API_URL}/documents/${documentId}`,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${req.headers.authorization?.split(' ')[1]}`
        }
      }
    );

    return res.json({
      success: true,
      data: response.data
    });
  } catch (error: any) {
    logger.error('Erro ao buscar conteúdo do documento no Outline:', error);
    return res.status(error.response?.status || 500).json({
      success: false,
      error: error.response?.data?.message || 'Erro ao comunicar com o Outline'
    });
  }
});

// Gerar URL de login único no Outline
router.get('/auth-url', authenticate, (req: Request, res: Response) => {
  try {
    const { organizationSlug, collectionId } = req.query;
    const user = req.user;

    if (!user || !organizationSlug) {
      return res.status(400).json({
        success: false,
        error: 'Usuário ou organização não especificados'
      });
    }

    // Gerar URL de autenticação no Outline
    const outlineUser = {
      id: user.id,
      name: user.email.split('@')[0],
      email: user.email,
      organizationId: organizationSlug as string,
      role: 'member'
    };

    const authUrl = authService.generateOutlineAuthUrl(
      outlineUser,
      organizationSlug as string,
      collectionId as string
    );

    return res.json({
      success: true,
      data: { authUrl }
    });
  } catch (error: any) {
    logger.error('Erro ao gerar URL de autenticação para o Outline:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro ao gerar URL de autenticação'
    });
  }
});

// Criar uma nova collection no Outline
router.post('/collections', authenticate, async (req: Request, res: Response) => {
  try {
    const { name, description, color } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        error: 'Nome da collection é obrigatório'
      });
    }

    // Chamar a API do Outline para criar collection
    const response = await axios.post(
      `${OUTLINE_API_URL}/collections`,
      {
        name,
        description: description || '',
        color: color || '#4F46E5',
        permission: 'read_write'
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${req.headers.authorization?.split(' ')[1]}`
        }
      }
    );

    return res.status(201).json({
      success: true,
      data: response.data
    });
  } catch (error: any) {
    logger.error('Erro ao criar collection no Outline:', error);
    return res.status(error.response?.status || 500).json({
      success: false,
      error: error.response?.data?.message || 'Erro ao comunicar com o Outline'
    });
  }
});

// Criar um novo documento
router.post('/documents', authenticate, async (req: Request, res: Response) => {
  try {
    const { title, text, collectionId, parentDocumentId } = req.body;

    if (!title || !text || !collectionId) {
      return res.status(400).json({
        success: false,
        error: 'Título, conteúdo e ID da coleção são obrigatórios'
      });
    }

    // Chamar a API do Outline para criar o documento
    const response = await axios.post(
      `${OUTLINE_API_URL}/documents`,
      {
        title,
        text,
        collectionId,
        parentDocumentId: parentDocumentId || undefined,
        publish: true
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${req.headers.authorization?.split(' ')[1]}`
        }
      }
    );

    return res.json({
      success: true,
      data: response.data
    });
  } catch (error: any) {
    logger.error('Erro ao criar documento no Outline:', error);
    return res.status(error.response?.status || 500).json({
      success: false,
      error: error.response?.data?.message || 'Erro ao comunicar com o Outline'
    });
  }
});

export const outlineRoutes = router; 