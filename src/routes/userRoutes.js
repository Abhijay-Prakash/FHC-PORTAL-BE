import express from 'express';
import { getUserProfile } from '../controllers/userController.js';
import protectRoute from '../middleware/protectRoute.js';
import { getAllMembers } from '../controllers/userController.js';
import { isAdmin } from '../middleware/isAdmin.js';
import { changeRole } from '../controllers/userController.js';


const router = express.Router();
router.use(protectRoute);
router.get('/profile',getUserProfile);
router.get('/members',getAllMembers);
router.patch('/:id/role',protectRoute,isAdmin, changeRole);

export default router;

