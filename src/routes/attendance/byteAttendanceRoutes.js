import express from "express";
import { markAttendance,getAttendanceByDate } from "../../controllers/attendance/byteAttendanceController.js";
import {protectRoute} from "../../middleware/protectRoute.js";
const router = express.Router()
router.post('/mark-attendance',protectRoute, markAttendance);
router.get('/attendance',protectRoute,getAttendanceByDate);

export default router;