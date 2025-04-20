import express from 'express';
import  protectRoute  from '../middleware/protectRoute.js';
import {getAttendanceByDate, getParticipantsByDomain,markAttendance, registerForByteClass} from '../controllers/byteController.js';

const router = express.Router();



router.get('/participants', protectRoute, getParticipantsByDomain);
router.get('/attendance',protectRoute,getAttendanceByDate);


router.post('/mark-attendance',protectRoute, markAttendance);
router.post('/register-byte',protectRoute,registerForByteClass);



export default router;
