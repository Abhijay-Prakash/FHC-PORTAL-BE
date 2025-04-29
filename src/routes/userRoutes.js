import express from 'express';
import { getUserProfile } from '../controllers/userController.js';
import protectRoute from '../middleware/protectRoute.js';
import { getAllMembers } from '../controllers/userController.js';
import { isAdmin } from '../middleware/isAdmin.js';
import { changeRole } from '../controllers/userController.js';


const router = express.Router();

router.get('/profile', protectRoute,getUserProfile);
router.get('/members', protectRoute,getAllMembers);
router.patch('/:id/role',protectRoute,isAdmin, changeRole);

export default router;

