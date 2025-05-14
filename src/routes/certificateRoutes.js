import express from 'express';
import { sendCertificate } from '../controllers/certificateController.js';

const router = express.Router();

router.post('/send-certificate', sendCertificate);

export default router;
