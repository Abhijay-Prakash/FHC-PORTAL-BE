import express from 'express';

import protectRoute from '../middleware/protectRoute.js';
import { isAdmin } from '../middleware/isAdmin.js';
import { getAllMembers,changeRole } from '../controllers/userController.js';

import { addSkills,getUserProfile,updateSocialLinks } from '../controllers/userController.js';


const router = express.Router();
router.use(protectRoute);

//general
router.get('/profile',getUserProfile);
router.patch('/addSkills',addSkills);
router.patch('/updateSocialLinks',updateSocialLinks);


//for admin only
router.get('/members',isAdmin,getAllMembers);
router.patch('/:id/role',isAdmin, changeRole);

export default router;

