import fs from 'fs/promises';
import path from 'path';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

const templatePath = path.resolve('templates', 'exodex_1.png');
//chummanpn
export async function generateCertificateBuffer({ name, event }) {
  const backgroundBytes = await fs.readFile(templatePath);
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([842, 595]); 

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

export async function generateCertificateFromTemplate({ name, imageBytes, contentType, namePlacement, nameColor }) {
  const pdfDoc = await PDFDocument.create();
  const image = contentType === 'image/png'
    ? await pdfDoc.embedPng(imageBytes)
    : await pdfDoc.embedJpg(imageBytes);
  const { width, height } = image.scale(1);
  const page = pdfDoc.addPage([width, height]);

  page.drawImage(image, { x: 0, y: 0, width, height });

  const placement = namePlacement || { x: 0.2, y: 0.42, width: 0.6, height: 0.12 };
  const boxWidth = width * placement.width;
  const boxHeight = height * placement.height;
  const boxX = width * placement.x;
  const boxTop = height * placement.y;
  const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const maximumFontSize = Math.min(40, boxHeight * 0.68);
  const maximumTextWidth = boxWidth * 0.92;
  const fontSize = Math.min(maximumFontSize, maximumTextWidth / Math.max(font.widthOfTextAtSize(name, 1), 1));
  const textWidth = font.widthOfTextAtSize(name, fontSize);

  page.drawText(name, {
    x: boxX + (boxWidth - textWidth) / 2,
    y: height - boxTop - boxHeight / 2 - fontSize * 0.32,
    size: fontSize,
    font,
    color: nameColor === 'black' ? rgb(0, 0, 0) : rgb(1, 1, 1),
  });

  return pdfDoc.save();
}
