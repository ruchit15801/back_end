import { Router } from 'express';
import { adminSignup, adminSignin, adminProfile, refreshToken } from '../controller/admin/auth';
import { addGame, updateGame, deleteGame, getAllGames, getGameById } from '../controller/admin/games';
import { getAllContacts, getContactById } from '../controller/admin/contact';
import {
    addAd,
    updateAd,
    deleteAd,
    getAllAds,
    getAdById,
    toggleAdStatus,
    getAdsAnalytics,
    recordImpression,
    recordClick
} from '../controller/admin/ads';
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
router.post('/getGames', authenticateAdmin, getAllGames);
router.get('/games/:gameId', authenticateAdmin, getGameById);
router.put('/games/:gameId', authenticateAdmin, updateGame);
router.delete('/games/:gameId', authenticateAdmin, deleteGame);

// Contact management routes (protected)
router.get('/contacts', authenticateAdmin, getAllContacts);
router.get('/contacts/:contactId', authenticateAdmin, getContactById);

// Ads management routes (protected)
router.post('/ads', authenticateAdmin, addAd);
router.get('/ads', authenticateAdmin, getAllAds);
router.get('/ads/analytics', authenticateAdmin, getAdsAnalytics);
router.get('/ads/:adId', authenticateAdmin, getAdById);
router.put('/ads/:adId', authenticateAdmin, updateAd);
router.delete('/ads/:adId', authenticateAdmin, deleteAd);
router.patch('/ads/:adId/toggle', authenticateAdmin, toggleAdStatus);
router.post('/ads/:adId/impression', authenticateAdmin, recordImpression);
router.post('/ads/:adId/click', authenticateAdmin, recordClick);

export default router;
