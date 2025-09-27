import Mailjet from "node-mailjet";
import dotenv from "dotenv";

dotenv.config();

// Initialize Mailjet client
const mailjet = Mailjet.apiConnect(
  process.env.MAILJET_API_KEY,
  process.env.MAILJET_API_SECRET
);

// ====================
// Helper: Send Registration Mail
// ====================
export const sendRegistrationMail = async (toEmail, name, eventName) => {
  try {
    await mailjet.post("send", { version: "v3.1" }).request({
      Messages: [
        {
          From: {
            Email: process.env.MAILJET_SENDER_EMAIL,
            Name: "FISAT HORIZON",
          },
          To: [
            {
              Email: toEmail,
              Name: name,
            },
          ],
          Subject: `Successfully Registered for ${eventName}`,
          TextPart: `Hi ${name},

You're successfully registered for ${eventName}. We're excited to have you with us!

📌 What to expect:
- Event updates will be shared via this email.
- Certificates of participation will be sent after the event.
- Stay connected for resources, session recordings, and future opportunities.

Looking forward to seeing you at ${eventName}!

- Team FISAT HORIZON`,
        },
      ],
    });
    console.log(`Registration email sent to ${toEmail}`);
  } catch (err) {
    console.error("Error sending registration email:", err);
  }
};

// ====================
// Helper: Send Certificate Email
// ====================
export async function sendCertificateEmail({ to, name, event, pdfBuffer }) {
  try {
    await mailjet.post("send", { version: "v3.1" }).request({
      Messages: [
        {
          From: {
            Email: process.env.MAILJET_SENDER_EMAIL,
            Name: "FISAT HORIZON",
          },
          To: [
            {
              Email: to,
              Name: name,
            },
          ],
          Subject: `Your Certificate for participating in ${event}`,
          TextPart: `Hi ${name},

Thank you for participating in ${event}. Your enthusiastic participation contributed to the energy and excitement of the event!

Please find your Certificate of Participation attached.

Keep learning, keep building!

Warm regards,
Team FISAT HORIZON`,
          Attachments: [
            {
              ContentType: "application/pdf",
              Filename: `${name}-Certificate.pdf`,
              Base64Content: pdfBuffer.toString("base64"),
            },
          ],
        },
      ],
    });
    console.log(`Certificate email sent to ${to}`);
  } catch (err) {
    console.error("Error sending certificate email:", err);
  }
}

// ====================
// Helper: Send Meeting Mail
// ====================
export async function sendMeetingMail({ to, name, event, meetingLink, date, time }) {
  const formattedDate = new Date(date).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  try {
    await mailjet.post("send", { version: "v3.1" }).request({
      Messages: [
        {
          From: {
            Email: process.env.MAILJET_SENDER_EMAIL,
            Name: "FISAT HORIZON",
          },
          To: [
            {
              Email: to,
              Name: name,
            },
          ],
          Subject: `Meeting Link for ${event}`,
          TextPart: `Hi ${name},

You have successfully registered for the meeting "${event}".

📅 Date: ${formattedDate}
🕒 Time: ${time}
🔗 Meeting Link: ${meetingLink}

Please be on time.

- FISAT HORIZON`,
        },
      ],
    });
    console.log(`Meeting email sent to ${to}`);
  } catch (err) {
    console.error("Error sending meeting email:", err);
  }
}

// ====================
// BYTE Classes: Registration Mail
// ====================
export const sendByteRegistrationMail = async (to, name) => {
  try {
    await mailjet.post("send", { version: "v3.1" }).request({
      Messages: [
        {
          From: {
            Email: process.env.MAILJET_SENDER_EMAIL,
            Name: "FISAT HORIZON",
          },
          To: [
            {
              Email: to,
              Name: name,
            },
          ],
          Subject: `BYTE Class Registration Successful`,
          TextPart: `Hi ${name},

You're successfully registered for the BYTE classes.

Once your payment is verified by the admin, you will receive another email with the WhatsApp group link.

Thank you for joining us!

- FISAT HORIZON`,
        },
      ],
    });
    console.log(`BYTE registration email sent to ${to}`);
  } catch (err) {
    console.error("Error sending BYTE registration email:", err);
  }
};

// ====================
// BYTE Classes: Payment Confirmation
// ====================
export const sendBytePaymentConfirmationMail = async (to, name, whatsappLink) => {
  try {
    await mailjet.post("send", { version: "v3.1" }).request({
      Messages: [
        {
          From: {
            Email: process.env.MAILJET_SENDER_EMAIL,
            Name: "FISAT HORIZON",
          },
          To: [
            {
              Email: to,
              Name: name,
            },
          ],
          Subject: `BYTE Payment Verified – WhatsApp Group Link Inside`,
          TextPart: `Hi ${name},

Your payment for the BYTE class has been successfully verified.

Please join the official WhatsApp group to stay updated:
${whatsappLink}

Welcome aboard, and happy learning!

- FISAT HORIZON`,
        },
      ],
    });
    console.log(`BYTE payment confirmation email sent to ${to}`);
  } catch (err) {
    console.error("Error sending BYTE payment email:", err);
  }
};
