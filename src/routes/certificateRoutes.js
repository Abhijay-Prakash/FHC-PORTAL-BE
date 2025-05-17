import express from 'express';
import { sendCertificate,sendCertificateToAll } from '../controllers/certificateController.js';

const router = express.Router();

router.post('/send-certificate', sendCertificate);
router.post('/send-all/:eventId',sendCertificateToAll);
export default router;
