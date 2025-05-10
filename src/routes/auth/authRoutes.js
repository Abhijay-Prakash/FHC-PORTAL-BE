import express from 'express';
import { register, login } from '../../controllers/auth/authController.js';
import protectRoute from '../../middleware/protectRoute.js';

const router = express.Router();
router.use(protectRoute);

router.post('/register', register);
router.post('/login', login);

export default router;
