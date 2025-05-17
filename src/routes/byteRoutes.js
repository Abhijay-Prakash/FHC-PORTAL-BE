import express from 'express';
import  protectRoute  from '../middleware/protectRoute.js';
import { getParticipantsByDomain, registerForByteClass,getMyByteRegistration} from '../controllers/byteController.js';
import { getByteDashboardStats } from '../controllers/byteController.js';
import { isAdmin } from '../middleware/isAdmin.js';


const router = express.Router();


router.get('/dashboard-stats',protectRoute,isAdmin, getByteDashboardStats);

router.get('/participants',protectRoute,isAdmin,  getParticipantsByDomain);

router.get('/my-registration', protectRoute, getMyByteRegistration);


router.post('/register-byte',protectRoute,registerForByteClass);




export default router;
