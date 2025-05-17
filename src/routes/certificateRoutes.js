import express from 'express';
import { sendCertificate,sendCertificateToAll } from '../controllers/certificateController.js';
import protectRoute from '../middleware/protectRoute.js';
import { isAdmin } from '../middleware/isAdmin.js';

const router = express.Router();

router.use(protectRoute);
router.use(isAdmin);
router.post('/send-certificate', sendCertificate);
router.post('/send-all/:eventId',sendCertificateToAll);
export default router;
