import express from 'express';
import { changePassword } from '../controllers/changePassword';

import { profileDetails } from '../controllers/profileController';
const router = express.Router();

router.get('/', profileDetails); 
router.post('/changePasword',changePassword)

export default router;
