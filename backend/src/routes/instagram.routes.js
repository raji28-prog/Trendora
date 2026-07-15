import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import * as controller from '../controllers/instagram.controller.js';

const router = Router();

// Public callback endpoint from Meta Graph OAuth
router.get('/callback', controller.handleMetaCallback);

// Authenticated Instagram endpoints
router.use(authenticate);
router.get('/auth-url', controller.getAuthUrl);
router.get('/accounts', controller.getConnectedAccounts);
router.post('/disconnect', controller.disconnectAccount);
router.get('/analytics', controller.getInstagramAnalytics);
router.get('/posts', controller.getRecentPosts);

export default router;
