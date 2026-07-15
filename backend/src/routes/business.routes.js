import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import * as controller from '../controllers/business.controller.js';
import upload from '../middleware/upload.js';

const router = Router();

// All business routes require authentication
router.use(authenticate);

// GET /api/businesses/mine — must be before /:id to avoid param clash
router.get('/mine', controller.getMine);

router.get('/', controller.getAll);
router.get('/:id', controller.getOne);           // ← fetch single business by id
router.post('/', upload.array('images'), controller.create);
router.put('/:id', upload.array('images'), controller.update);
router.delete('/:id', controller.remove);

export default router;
