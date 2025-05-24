import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();


const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendRegistrationMail = async (toEmail, name, eventName) => {
  const mailOptions = {
    from: `"FISAT HORIZON" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: `Successfully Registered for ${eventName}`,
    text: `Hi ${name},\n\nYou're successfully registered for ${eventName}.\n\nStay tuned for more updates!\n\n- FISAT HORIZON`,
  };

  await transporter.sendMail(mailOptions);
};



export async function sendCertificateEmail({ to, name, event, pdfBuffer }) {
  const mailOptions = {
    from: `"FISAT HORIZON" <${process.env.EMAIL_USER}>`,
    to,
    subject: `Your Certificate for ${event}`,
    text: `Hi ${name},\n\nThanks for participating in ${event}. Please find your certificate attached.`,
    attachments: [
      {
        filename: `${name}-${event}.pdf`,
        content: pdfBuffer,
        contentType: 'application/pdf',
      },
    ],
  };

  await transporter.sendMail(mailOptions);
}

export async function sendMeetingMail({ to, name, event, meetingLink, date, time }) {
  const formattedDate = new Date(date).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const mailOptions = {
    from: `"FISAT HORIZON" <${process.env.EMAIL_USER}>`,
    to,
    subject: `Meeting Link for ${event}`,
    text: `Hi ${name},\n\nYou have successfully registered for the meeting "${event}".\n\n📅 Date: ${formattedDate}\n🕒 Time: ${time}\n🔗 Meeting Link: ${meetingLink}\n\nPlease be on time.\n\n- FISAT HORIZON`,
  };

  await transporter.sendMail(mailOptions);
}
