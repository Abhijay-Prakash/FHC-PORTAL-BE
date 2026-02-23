import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();


const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  connectionTimeout: 15000,
  greetingTimeout: 10000,
  socketTimeout: 15000,
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




export async function sendCertificateEmail({ to, name, eventName,date,  pdfBuffer }) {
  const mailOptions = {
    from: `"FISAT HORIZON" <${process.env.EMAIL_USER}>`,
    to,
    subject: `Your Certificate for Participating  in EXODEX`,
    text: `Hi ${name},\n\n
Your enthusiastic participation and active involvement added great value to the event and contributed to its overall success. We truly appreciate your interest, energy, and willingness to engage in the experience.

Please find your Certificate of Participation attached to this email.

Keep exploring, keep building, and keep pushing your limits!

We look forward to seeing you in our upcoming initiatives.

Warm regards,
Team FISAT HORIZON`,

    attachments: [
      {
        filename: `${name}-Certificate.pdf`,
        content: pdfBuffer,
        contentType: 'application/pdf',
      },
    ],
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Certificate email sent to ${to}`);
  } catch (err) {
    console.error(`Error sending certificate email to ${to}:`, err);
  }
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
