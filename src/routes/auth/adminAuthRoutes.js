import express from 'express';
import { loginAdmin } from '../../controllers/auth/adminAuthController.js';
import protectRoute from '../../middleware/protectRoute.js';
import { isAdmin } from '../../middleware/isAdmin.js';

const router = express.Router();

router.post('/login',loginAdmin);



router.get('/admin-dashboard',protectRoute,isAdmin);

export default router;
