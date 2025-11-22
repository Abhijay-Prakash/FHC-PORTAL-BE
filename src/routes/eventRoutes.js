import express from 'express';

import { getAllEvents, registerForEvent, getRegisteredEvents} from '../controllers/event/userEventController.js';
import { addEvent,deleteEvent,getAllRegistrations,updateRegistrationStatus } from '../controllers/event/adminEventController.js';

import {protectRoute} from '../middleware/protectRoute.js';
import { isAdmin } from '../middleware/isAdmin.js';

const router = express.Router();


router.use(protectRoute);


router.get('/getEvents', getAllEvents);


router.post('/register', registerForEvent);  
router.get('/registered',  getRegisteredEvents);



router.post('/addEvent',addEvent)
router.post('/registrations',getAllRegistrations);
router.put('/:eventId/status',isAdmin,updateRegistrationStatus);
router.delete('/:eventId/delete',deleteEvent);
export default router;
