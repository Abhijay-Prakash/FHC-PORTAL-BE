import express from 'express';
import  {markAttendanceForEvent}  from '../../controllers/attendance/eventAttendanceController.js';

const router = express.Router();

router.post('/attendance',markAttendanceForEvent);





export default router;
