import fs from 'fs/promises';
import path from 'path';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

const templatePath = path.resolve('templates', 'exodex_1.png');

export async function generateCertificateBuffer({ name, event }) {
  const backgroundBytes = await fs.readFile(templatePath);
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([842, 595]); // A4 landscape in pts

  const backgroundImage = await pdfDoc.embedPng(backgroundBytes);
  page.drawImage(backgroundImage, {
    x: 0,
    y: 0,
    width: 842,
    height: 595,
  });


  const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontSize = 32;


  const nameWidth = font.widthOfTextAtSize(name, fontSize);
  const certificateWidth = 842;
  const nameX = (certificateWidth - nameWidth) / 2;
  const nameY = 595-320;

  page.drawText(name, {
    x: nameX,
    y: nameY,
    size: 28,
    font,
    color: rgb(1, 1, 1),
  });

  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
}
