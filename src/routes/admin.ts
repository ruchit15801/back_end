import { Router } from 'express';
import { adminSignup, adminSignin, adminProfile, refreshToken } from '../controller/admin/auth';
import { addGame, updateGame, deleteGame, getAllGames, getGameById } from '../controller/admin/games';
import { authenticateAdmin } from '../helper/auth';

const router = Router();

// Public routes (no authentication required)
router.post('/signup', adminSignup);
router.post('/signin', adminSignin);
router.post('/refresh-token', refreshToken);

// Protected routes (authentication required)
router.get('/profile', authenticateAdmin, adminProfile);

// Game management routes (protected)
router.post('/games', authenticateAdmin, addGame);
router.get('/games', authenticateAdmin, getAllGames);
router.get('/games/:gameId', authenticateAdmin, getGameById);
router.put('/games/:gameId', authenticateAdmin, updateGame);
router.delete('/games/:gameId', authenticateAdmin, deleteGame);

export default router;
