import { Router } from 'express';
import { getGameById, getGames } from '../../controller/user/games';

const router = Router();

router.get('/', getGames);
router.get('/:id', getGameById);

export default router; 