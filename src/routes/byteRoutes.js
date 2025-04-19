import express from 'express';
import  protectRoute  from '../middleware/protectRoute.js';
import {getAttendanceByDate, getParticipantsByDomain,markAttendance, registerForByteClass} from '../controllers/byteController.js';

const router = express.Router();



router.get('/participants', protectRoute, getParticipantsByDomain);
router.post('/mark-attendance',protectRoute, markAttendance);
router.post('/register-byte',protectRoute,registerForByteClass);
router.get('/attendance',protectRoute,getAttendanceByDate);



export default router;
