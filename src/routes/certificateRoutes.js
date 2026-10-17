import express from 'express';
import { sendCertificate,sendCertificateToAll } from '../controllers/certificateController.js';
import {
  deleteCertificateTemplate,
  getCertificateTemplateImage,
  listCertificateTemplates,
  previewCertificateTemplate,
  sendUsingCertificateTemplate,
  updateCertificateTemplateRecipients,
  updateCertificateTemplateSettings,
  uploadCertificateTemplate,
} from '../controllers/certificateTemplateController.js';
import {protectRoute} from '../middleware/protectRoute.js';
import { isAdmin } from '../middleware/isAdmin.js';

const router = express.Router();

router.use(protectRoute);
router.use(isAdmin);
router.post('/send-certificate', sendCertificate);
router.post('/send-all/:eventId',sendCertificateToAll);
router.get('/templates/:eventId', listCertificateTemplates);
router.post('/templates/:eventId', express.raw({ type: ['image/png', 'image/jpeg'], limit: '5mb' }), uploadCertificateTemplate);
router.patch('/templates/:templateId/recipients', updateCertificateTemplateRecipients);
router.patch('/templates/:templateId/settings', updateCertificateTemplateSettings);
router.get('/templates/:templateId/image', getCertificateTemplateImage);
router.get('/templates/:templateId/preview', previewCertificateTemplate);
router.post('/templates/:templateId/send', sendUsingCertificateTemplate);
router.delete('/templates/:templateId', deleteCertificateTemplate);
export default router;
