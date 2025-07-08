import { Router } from 'express';
import {
    getAdsByPlacement,
    getAdsByCategory,
    getRandomAd,
    getAdsInfo
} from '../../controller/user/ads';

const router = Router();

// Get ads information
router.get('/info', getAdsInfo);

// Get ads by placement
router.get('/placement/:placement', getAdsByPlacement);

// Get ads by category
router.get('/category/:category', getAdsByCategory);

// Get random ad
router.get('/random', getRandomAd);

export default router; 