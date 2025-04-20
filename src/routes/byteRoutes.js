import express from 'express';
import  protectRoute  from '../middleware/protectRoute.js';
import { getParticipantsByDomain, registerForByteClass,getMyByteRegistration} from '../controllers/byteController.js';

const router = express.Router();



router.get('/participants', protectRoute, getParticipantsByDomain);

router.get('/my-registration', protectRoute, getMyByteRegistration);


router.post('/register-byte',protectRoute,registerForByteClass);





export default router;
