import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import * as controller from '../controllers/gbp.controller.js';

const router = Router();
router.use(authenticate);
router.get('/', controller.getProfile);
router.put('/', controller.syncProfile);

export default router;
