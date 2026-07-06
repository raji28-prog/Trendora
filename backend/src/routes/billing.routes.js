import { Router } from 'express';
import * as controller from '../controllers/billing.controller.js';

const router = Router();
router.get('/', controller.getSubscription);
router.post('/', controller.createOrUpdate);

export default router;
