import fs from 'fs/promises';
import path from 'path';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

const templatePath = path.resolve('templates', 'certificate-template.jpg');

export async function generateCertificateBuffer({ name, event }) {
  const backgroundBytes = await fs.readFile(templatePath);
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([842, 595]); // A4 landscape in pts

  const backgroundImage = await pdfDoc.embedJpg(backgroundBytes);
  page.drawImage(backgroundImage, {
    x: 0,
    y: 0,
    width: 842,
    height: 595,
  });

  const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  // Replace these with actual coordinates from Figma
  const nameX = 270;
  const nameY = 595-320;

  page.drawText(name, {
    x: nameX,
    y: nameY,
    size: 28,
    font,
    color: rgb(0, 0, 0),
  });

  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
}
