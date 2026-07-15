import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { getConnectedAccounts } from '../controllers/instagram.controller.js';

const router = Router();
router.use(authenticate);

// Support both GET /api/social-accounts and GET /api/social-accounts/accounts
router.get('/', (req, res, next) => {
  if (!req.query.businessId) {
    req.query.businessId = 'mock-biz-id-1';
  }
  getConnectedAccounts(req, res, next);
});
router.get('/accounts', getConnectedAccounts);

export default router;
