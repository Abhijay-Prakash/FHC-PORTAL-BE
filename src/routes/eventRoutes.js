import express from 'express';
import { getAllEvents, registerForEvent,addEvent ,getAllRegistrations, getRegisteredEvents} from '../controllers/eventController.js';
import protectRoute from '../middleware/protectRoute.js';
const router = express.Router();


router.use(protectRoute);


router.get('/getEvents', getAllEvents);
router.post('/registrations',getAllRegistrations);
router.get('/registered',  getRegisteredEvents);



router.post('/addEvent',addEvent)
router.post('/register', registerForEvent);    




export default router;
