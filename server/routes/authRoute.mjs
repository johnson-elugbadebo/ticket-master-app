import express from 'express';
const router = express.Router();
import { loginLimiter } from '../middleware/loginLimiter.mjs';
import { handleLogin, handleRefreshToken, handleLogout } from '../controllers/authController.mjs';

router.post('/', loginLimiter, handleLogin);
router.get('/refresh', handleRefreshToken);
router.post('/logout', handleLogout);

export default router;
