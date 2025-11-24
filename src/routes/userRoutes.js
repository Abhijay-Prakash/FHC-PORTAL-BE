import express from 'express';

import {protectRoute} from '../middleware/protectRoute.js';
import { isAdmin } from '../middleware/isAdmin.js';
import { getAllMembers,changeRole,getUserGrowth } from '../controllers/user/adminUserController.js'

import { addSkills,getUserProfile,updateSocialLinks } from '../controllers/user/userController.js';


const router = express.Router();
router.use(protectRoute);

//general
router.get('/profile',getUserProfile);
router.patch('/addSkills',addSkills);
router.patch('/updateSocialLinks',updateSocialLinks);


//for admin only
router.get('/members',isAdmin,getAllMembers);
router.get('/members/growth',isAdmin,getUserGrowth);
router.patch('/:id/role',isAdmin, changeRole);


export default router;

