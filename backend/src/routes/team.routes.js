import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import * as controller from '../controllers/team.controller.js';

const router = Router();
router.use(authenticate);
router.get('/', controller.getAll);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.delete('/:id', controller.remove);

export default router;
