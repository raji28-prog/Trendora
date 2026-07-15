import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import * as controller from '../controllers/review.controller.js';

const router = Router();
router.use(authenticate);
router.get('/', controller.getAll);
router.post('/', controller.create);

export default router;
