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
    text: `Hi ${name},

You're successfully registered for ${eventName}. We're excited to have you with us!

📌 What to expect:
- Event updates will be shared with you via this email.
- Certificates of participation will be sent to this mail after the event.
- Stay connected for resources, session recordings, and future opportunities.

Looking forward to seeing you at ${eventName}!

- Team FISAT HORIZON
`,
  };

  await transporter.sendMail(mailOptions);
};




export async function sendCertificateEmail({ to, name, event, pdfBuffer }) {
  const mailOptions = {
    from: `"FISAT HORIZON" <${process.env.EMAIL_USER}>`,
    to,
    subject: `Your Certificate for  participating in horizon.Hack() 2025`,
    text: `Hi ${name},\n\n
Thank you for being a part of horizon.Hack( ), held as part of GENESIS 2025 and organized by FISAT HORIZON on July 10 & 11, 2025, at FISAT.

We truly appreciate your enthusiastic participation and the energy you brought to the event. Your involvement played a vital role in shaping the vibrant atmosphere of innovation, learning, and collaboration that defined GENESIS 2025.

Please find your Certificate of Participation attached to this email.
Keep learning, keep building!

Warm regards,  
Team FISAT HORIZON`,
    attachments: [
      {
        filename: `${name}-horizon.Hack().pdf`,
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



//byte stuff

export const sendByteRegistrationMail = async (to, name) => {
  const mailOptions = {
    from: `"FISAT HORIZON" <${process.env.EMAIL_USER}>`,
    to,
    subject: `BYTE Class Registration Successful`,
    text: `Hi ${name},\n\nYou're successfully registered for the BYTE classes.\n\nOnce your payment is verified by the admin, you will receive another email with the WhatsApp group link.\n\nThank you for joining us!\n\n- FISAT HORIZON`,
  };

  await transporter.sendMail(mailOptions);
};



export const sendBytePaymentConfirmationMail = async (to, name, whatsappLink) => {
  const mailOptions = {
    from: `"FISAT HORIZON" <${process.env.EMAIL_USER}>`,
    to,
    subject: `BYTE Payment Verified – WhatsApp Group Link Inside`,
    text: `Hi ${name},\n\nYour payment for the BYTE class has been successfully verified.\n\nPlease join the official WhatsApp group to stay updated:\n${whatsappLink}\n\nWelcome aboard, and happy learning!\n\n- FISAT HORIZON`,
  };

  await transporter.sendMail(mailOptions);
};
