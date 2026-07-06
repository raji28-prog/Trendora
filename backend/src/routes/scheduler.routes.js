import { Router } from 'express';
import * as controller from '../controllers/scheduler.controller.js';

const router = Router();
router.get('/', controller.getAll);
router.post('/', controller.create);
router.delete('/:id', controller.remove);

export default router;
