import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import * as controller from '../controllers/poster.controller.js';

const router = Router();
router.use(authenticate);
router.get('/', controller.getAll);
router.post('/', controller.create);

export default router;
