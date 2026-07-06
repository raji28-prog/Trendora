import { Router } from 'express';
import * as controller from '../controllers/dashboard.controller.js';

const router = Router();

router.get('/stats', controller.getStats);

export default router;
