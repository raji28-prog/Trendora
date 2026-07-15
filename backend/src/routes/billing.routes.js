import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import * as controller from '../controllers/billing.controller.js';

const router = Router();
router.use(authenticate);
router.get('/', controller.getSubscription);
router.post('/', controller.createOrUpdate);

export default router;
