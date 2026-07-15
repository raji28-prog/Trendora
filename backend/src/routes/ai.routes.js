import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import * as controller from '../controllers/ai.controller.js';

const router = Router();
router.use(authenticate);
router.post('/generate', controller.generate);
router.post('/generate-content', controller.generateContent);
router.post('/generate-poster-content', controller.generatePosterContent);
router.post('/optimize-poster-prompt', controller.optimizePosterPrompt);
router.post('/generate-poster-image', controller.generatePosterImage);
router.get('/history', controller.getHistory);
router.post('/history/:id/duplicate', controller.duplicateHistory);
router.delete('/history/:id', controller.deleteHistory);
router.patch('/history/:id/actions', controller.updateHistoryActions);
router.post('/regenerate-field', controller.regenerateField);
router.get('/analytics', controller.getAnalytics);
router.post('/suggest-keywords', controller.suggestKeywords);

export default router;
