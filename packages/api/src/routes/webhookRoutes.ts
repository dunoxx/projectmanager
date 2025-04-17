import { Router } from 'express';
import ProjectWebhookController from '../controllers/ProjectWebhookController';

const router = Router();

/**
 * Rotas para webhooks do Plane
 */

// Rota para webhooks de projeto
router.post('/plane/project/created', ProjectWebhookController.handleProjectCreated);
router.post('/plane/project/updated', ProjectWebhookController.handleProjectUpdated);
router.post('/plane/project/deleted', ProjectWebhookController.handleProjectDeleted);

// Outras rotas de webhooks podem ser adicionadas aqui

export default router; 