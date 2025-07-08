import { Router } from 'express';
import { submitContact } from '../../controller/user/contact';

const router = Router();

router.post('/submit', submitContact);

export default router; 