import { Router, Request, Response } from 'express';
import { authenticate } from './auth';
import axios from 'axios';
import { logger } from '../utils/logger';

const router = Router();
const PLANE_API_URL = process.env.PLANE_URL || 'http://plane:3000/api';

/**
 * Rotas para integração com o Plane
 * Estas rotas servem como proxy para a API do Plane,
 * adicionando autenticação e tratamento de erros
 */

// Buscar todos os projetos do usuário no Plane
router.get('/projects', authenticate, async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const { organizationSlug } = req.query;

    if (!organizationSlug) {
      return res.status(400).json({
        success: false,
        error: 'Slug da organização é obrigatório'
      });
    }

    // Chamar a API do Plane para buscar projetos
    const response = await axios.get(
      `${PLANE_API_URL}/workspaces/${organizationSlug}/projects`,
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
    logger.error('Erro ao buscar projetos do Plane:', error);
    return res.status(error.response?.status || 500).json({
      success: false,
      error: error.response?.data?.message || 'Erro ao comunicar com o Plane'
    });
  }
});

// Buscar detalhes de um projeto específico no Plane
router.get('/projects/:projectId', authenticate, async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params;
    const { organizationSlug } = req.query;

    if (!organizationSlug) {
      return res.status(400).json({
        success: false,
        error: 'Slug da organização é obrigatório'
      });
    }

    // Chamar a API do Plane para buscar detalhes do projeto
    const response = await axios.get(
      `${PLANE_API_URL}/workspaces/${organizationSlug}/projects/${projectId}`,
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
    logger.error('Erro ao buscar detalhes do projeto no Plane:', error);
    return res.status(error.response?.status || 500).json({
      success: false,
      error: error.response?.data?.message || 'Erro ao comunicar com o Plane'
    });
  }
});

// Buscar membros de um projeto no Plane
router.get('/projects/:projectId/members', authenticate, async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params;
    const { organizationSlug } = req.query;

    if (!organizationSlug) {
      return res.status(400).json({
        success: false,
        error: 'Slug da organização é obrigatório'
      });
    }

    // Chamar a API do Plane para buscar membros do projeto
    const response = await axios.get(
      `${PLANE_API_URL}/workspaces/${organizationSlug}/projects/${projectId}/members`,
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
    logger.error('Erro ao buscar membros do projeto no Plane:', error);
    return res.status(error.response?.status || 500).json({
      success: false,
      error: error.response?.data?.message || 'Erro ao comunicar com o Plane'
    });
  }
});

// Buscar tarefas de um projeto no Plane
router.get('/projects/:projectId/issues', authenticate, async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params;
    const { organizationSlug } = req.query;

    if (!organizationSlug) {
      return res.status(400).json({
        success: false,
        error: 'Slug da organização é obrigatório'
      });
    }

    // Chamar a API do Plane para buscar tarefas do projeto
    const response = await axios.get(
      `${PLANE_API_URL}/workspaces/${organizationSlug}/projects/${projectId}/issues`,
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
    logger.error('Erro ao buscar tarefas do projeto no Plane:', error);
    return res.status(error.response?.status || 500).json({
      success: false,
      error: error.response?.data?.message || 'Erro ao comunicar com o Plane'
    });
  }
});

export const planeRoutes = router; 