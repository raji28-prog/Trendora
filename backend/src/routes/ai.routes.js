import { Router } from 'express';
import * as controller from '../controllers/ai.controller.js';

const router = Router();
router.post('/generate', controller.generate);

export default router;
