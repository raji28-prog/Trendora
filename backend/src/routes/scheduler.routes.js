import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import * as controller from '../controllers/scheduler.controller.js';

const router = Router();
router.use(authenticate);
router.get('/', controller.getAll);
router.post('/', controller.create);
router.delete('/:id', controller.remove);

export default router;
