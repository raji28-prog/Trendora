import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import * as controller from '../controllers/dashboard.controller.js';

const router = Router();
router.use(authenticate);

router.get('/stats', controller.getStats);
router.get('/', controller.getStats);

export default router;
