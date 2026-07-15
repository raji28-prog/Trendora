import { Router } from 'express';
import * as controller from '../controllers/service.controller.js';

const router = Router();

// Services routes
router.get('/', controller.getAllServices);
router.post('/', controller.createService);
router.put('/:id', controller.updateService);
router.delete('/:id', controller.deleteService);

// Categories routes
router.get('/categories', controller.getAllCategories);
router.post('/categories', controller.createCategory);

// Packages routes
router.get('/packages', controller.getAllPackages);
router.post('/packages', controller.createPackage);

export default router;
