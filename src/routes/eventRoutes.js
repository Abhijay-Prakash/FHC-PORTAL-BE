import express from 'express';
import { getAllEvents, registerForEvent,addEvent ,getAllRegistrations, markAttendanceForEvent,getRegisteredEvents} from '../controllers/eventController.js';
import protectRoute from '../middleware/protectRoute.js';
const router = express.Router();

router.get('/getEvents', getAllEvents);
router.get('/getAllRegistrations',getAllRegistrations);
router.get('/registered', protectRoute, getRegisteredEvents);



router.post('/addEvent',addEvent)
router.post('/register', protectRoute,registerForEvent);    
router.post('/attendance',markAttendanceForEvent);



export default router;
