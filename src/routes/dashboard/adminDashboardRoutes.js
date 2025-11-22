import express from 'express';
import {protectRoute} from '../../middleware/protectRoute.js';
import {isAdmin} from  '../../middleware/isAdmin.js';
import {
  getAdminStats,
  getUpcomingEvents,
  getRecentAttendance,
  getNewMembers,
  getByteAttendance
} from '../../controllers/dashboard/adminDashboardController.js';

const router = express.Router();

// Protect route and check admin before accessing
router.use(protectRoute);
router.use(isAdmin);

// Admin Dashboard Routes
router.get('/stats', getAdminStats);
router.get('/events/upcoming', getUpcomingEvents);
router.get('/attendance/recent', getRecentAttendance);
router.get('/members/new', getNewMembers);

// Byte Attendance Stats
router.get('/byte/attendance', getByteAttendance);

export default router;
