import express from 'express';
import { getUserProfile } from '../controllers/userController.js';
import protectRoute from '../middleware/protectRoute.js';
import { getAllMembers } from '../controllers/userController.js';


const router = express.Router();

router.get('/profile', protectRoute,getUserProfile);
router.get('/members', protectRoute,getAllMembers);

export default router;

