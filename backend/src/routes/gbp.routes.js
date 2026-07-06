import { Router } from 'express';
import * as controller from '../controllers/gbp.controller.js';

const router = Router();
router.get('/', controller.getProfile);
router.put('/', controller.syncProfile);

export default router;
