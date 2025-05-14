import { generateCertificateBuffer } from '../services/certificateService.js';
import { sendCertificateEmail } from '../services/mailService.js';

export async function sendCertificate(req, res) {
  try {
    const { name, email, event } = req.body;

    const pdfBuffer = await generateCertificateBuffer({ name, event });

    await sendCertificateEmail({
      to: email,
      name,
      event,
      pdfBuffer,
    });

    res.status(200).json({ message: 'Certificate sent successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to send certificate.' });
  }
}
