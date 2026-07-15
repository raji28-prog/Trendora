import { Router } from 'express';
import StudioController from '../controllers/studio.controller.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

// ── Public routes ────────────────────────────────────────────────────────────
router.get('/templates', StudioController.getTemplates);
router.get('/templates/categories', StudioController.getCategories);
router.get('/templates/:id', StudioController.getTemplate);
router.post('/templates/seed', StudioController.seedTemplates); // dev seeding

// ── Protected routes ─────────────────────────────────────────────────────────
router.use(authenticate);

// Designs
router.get('/designs', StudioController.getUserDesigns);
router.get('/designs/:id', StudioController.getDesign);
router.post('/designs', StudioController.createDesign);
router.put('/designs/:id', StudioController.updateDesign);
router.delete('/designs/:id', StudioController.deleteDesign);
router.post('/designs/:id/duplicate', StudioController.duplicateDesign);

// Assets
router.get('/assets', StudioController.getAssets);
router.post('/assets', StudioController.createAsset);
router.delete('/assets/:id', StudioController.deleteAsset);

export default router;
