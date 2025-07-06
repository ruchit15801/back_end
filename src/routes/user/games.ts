import { Router } from 'express';
import { addGame, getGames } from '../../controller/user/games';

const router = Router();

router.post('/', addGame);
router.get('/', getGames);

export default router; 