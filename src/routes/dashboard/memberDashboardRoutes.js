import express from 'express';
import {
  getUserStats,
  getUpcomingUserEvents
} from '../../controllers/dashboard/memberDashboardController.js';

import protectRoute from '../../middleware/protectRoute.js';

const router = express.Router();

router.get('members/stats', protectRoute, getUserStats);
router.get('members/events/upcoming', protectRoute, getUpcomingUserEvents);

export default router;
