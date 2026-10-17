import mongoose from 'mongoose';
import Event from '../models/Event.js';
import User from '../models/User.js';
import CertificateTemplate from '../models/CertificateTemplate.js';
import CertificateDelivery from '../models/CertificateDelivery.js';
import { generateCertificateFromTemplate } from '../services/certificateService.js';
import { sendCertificateEmail } from '../services/mailService.js';

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

const validId = (value) => mongoose.isValidObjectId(value);
const DEFAULT_EMAIL_SUBJECT = 'Your certificate for {{eventName}}';
const DEFAULT_EMAIL_BODY = 'Hi {{name}},\n\nThank you for taking part in {{eventName}}. We appreciate your contribution. Your certificate is attached.\n\nBest,\nFISAT HORIZON';

function interpolateEmailText(value, variables) {
  return value.replace(/{{\s*(name|eventName|eventDate)\s*}}/gi, (_match, key) => variables[key.toLowerCase()] ?? '');
}

export async function listCertificateTemplates(req, res) {
  try {
    const { eventId } = req.params;
    if (!validId(eventId)) return res.status(400).json({ message: 'Invalid event ID.' });
    const event = await Event.findById(eventId).select('_id');
    if (!event) return res.status(404).json({ message: 'Event not found.' });

    const templates = await CertificateTemplate.find({ event: eventId })
      .select('name contentType recipients namePlacement nameColor emailSubject emailBody createdAt')
      .populate('recipients', 'name email class semester');
    return res.json({ templates });
  } catch (error) {
    console.error('Failed to list certificate templates:', error);
    return res.status(500).json({ message: 'Failed to load certificate templates.' });
  }
}

export async function uploadCertificateTemplate(req, res) {
  try {
    const { eventId } = req.params;
    const contentType = req.headers['content-type'];
    const name = String(req.query.name || '').trim();

    if (!validId(eventId)) return res.status(400).json({ message: 'Invalid event ID.' });
    if (!name || name.length > 80) return res.status(400).json({ message: 'Template name is required (up to 80 characters).' });
    if (!['image/png', 'image/jpeg'].includes(contentType)) {
      return res.status(400).json({ message: 'Upload a PNG or JPEG certificate image.' });
    }
    if (!Buffer.isBuffer(req.body) || req.body.length === 0) {
      return res.status(400).json({ message: 'Certificate image is required.' });
    }
    if (req.body.length > MAX_IMAGE_BYTES) {
      return res.status(413).json({ message: 'Certificate image must be 5 MB or smaller.' });
    }

    const event = await Event.findById(eventId).select('registeredUsers attendedUsers');
    if (!event) return res.status(404).json({ message: 'Event not found.' });

    const template = await CertificateTemplate.create({
      event: eventId,
      name,
      contentType,
      image: req.body,
    });
    return res.status(201).json({
      template: {
        _id: template._id,
        name: template.name,
        contentType: template.contentType,
        recipients: [],
        nameColor: template.nameColor,
        createdAt: template.createdAt,
      },
    });
  } catch (error) {
    console.error('Failed to upload certificate template:', error);
    return res.status(500).json({ message: 'Failed to save certificate template.' });
  }
}

export async function updateCertificateTemplateRecipients(req, res) {
  try {
    const { templateId } = req.params;
    const { recipientIds } = req.body;
    if (!validId(templateId)) return res.status(400).json({ message: 'Invalid template ID.' });
    if (!Array.isArray(recipientIds)) return res.status(400).json({ message: 'Recipient IDs must be an array.' });
    const template = await CertificateTemplate.findById(templateId);
    if (!template) return res.status(404).json({ message: 'Certificate template not found.' });

    const event = await Event.findById(template.event).select('registeredUsers attendedUsers');
    if (!event) return res.status(404).json({ message: 'The event for this template no longer exists.' });
    const allowedRecipientIds = new Set([
      ...event.registeredUsers.map((id) => String(id)),
      ...event.attendedUsers.map((id) => String(id)),
    ]);
    if (recipientIds.some((id) => !validId(id) || !allowedRecipientIds.has(id))) {
      return res.status(400).json({ message: 'One or more selected recipients are not registered for this event.' });
    }

    template.recipients = [...new Set(recipientIds)];
    await template.save();
    const updated = await CertificateTemplate.findById(templateId)
      .select('name contentType recipients namePlacement nameColor emailSubject emailBody createdAt')
      .populate('recipients', 'name email class semester');
    return res.json({ template: updated });
  } catch (error) {
    console.error('Failed to update certificate recipients:', error);
    return res.status(500).json({ message: 'Failed to update certificate recipients.' });
  }
}

export async function updateCertificateTemplateSettings(req, res) {
  try {
    const { templateId } = req.params;
    const { namePlacement, nameColor, emailSubject, emailBody } = req.body;
    if (!validId(templateId)) return res.status(400).json({ message: 'Invalid template ID.' });
    const template = await CertificateTemplate.findById(templateId);
    if (!template) return res.status(404).json({ message: 'Certificate template not found.' });

    if (namePlacement !== undefined) {
      const { x, y, width, height } = namePlacement || {};
      if (![x, y, width, height].every(Number.isFinite)
        || x < 0 || y < 0 || width <= 0 || height <= 0
        || x + width > 1 || y + height > 1) {
        return res.status(400).json({ message: 'Name placement must be a valid area within the certificate image.' });
      }
      template.namePlacement = { x, y, width, height };
    }
    if (nameColor !== undefined) {
      if (!['white', 'black'].includes(nameColor)) {
        return res.status(400).json({ message: 'Name color must be white or black.' });
      }
      template.nameColor = nameColor;
    }
    if (emailSubject !== undefined) {
      if (typeof emailSubject !== 'string' || !emailSubject.trim() || emailSubject.length > 180) {
        return res.status(400).json({ message: 'Email subject must be between 1 and 180 characters.' });
      }
      template.emailSubject = emailSubject.trim();
    }
    if (emailBody !== undefined) {
      if (typeof emailBody !== 'string' || !emailBody.trim() || emailBody.length > 10000) {
        return res.status(400).json({ message: 'Email message must be between 1 and 10,000 characters.' });
      }
      template.emailBody = emailBody;
    }
    await template.save();
    return res.json({
      message: 'Certificate settings saved.',
      settings: {
        namePlacement: template.namePlacement,
        nameColor: template.nameColor,
        emailSubject: template.emailSubject,
        emailBody: template.emailBody,
      },
    });
  } catch (error) {
    console.error('Failed to update certificate template settings:', error);
    return res.status(500).json({ message: 'Failed to save certificate settings.' });
  }
}

export async function getCertificateTemplateImage(req, res) {
  try {
    const { templateId } = req.params;
    if (!validId(templateId)) return res.status(400).json({ message: 'Invalid template ID.' });
    const template = await CertificateTemplate.findById(templateId).select('image contentType');
    if (!template) return res.status(404).json({ message: 'Certificate template not found.' });
    res.set({ 'Content-Type': template.contentType, 'Cache-Control': 'private, max-age=300' });
    return res.send(template.image);
  } catch (error) {
    console.error('Failed to load certificate image:', error);
    return res.status(500).json({ message: 'Failed to load certificate image.' });
  }
}

export async function previewCertificateTemplate(req, res) {
  try {
    const { templateId } = req.params;
    if (!validId(templateId)) return res.status(400).json({ message: 'Invalid template ID.' });
    const template = await CertificateTemplate.findById(templateId);
    if (!template) return res.status(404).json({ message: 'Certificate template not found.' });

    const requestedUserId = req.query.userId;
    const recipientId = requestedUserId && validId(requestedUserId)
      ? requestedUserId
      : template.recipients[0];
    const recipient = recipientId ? await User.findById(recipientId).select('name') : null;
    const pdf = await generateCertificateFromTemplate({
      name: recipient?.name || 'Certificate Recipient',
      imageBytes: template.image,
      contentType: template.contentType,
      namePlacement: template.namePlacement,
      nameColor: template.nameColor,
    });

    res.set({ 'Content-Type': 'application/pdf', 'Content-Disposition': 'inline; filename="certificate-preview.pdf"' });
    return res.send(Buffer.from(pdf));
  } catch (error) {
    console.error('Failed to preview certificate template:', error);
    return res.status(500).json({ message: 'Failed to generate certificate preview.' });
  }
}

export async function deleteCertificateTemplate(req, res) {
  try {
    const { templateId } = req.params;
    if (!validId(templateId)) return res.status(400).json({ message: 'Invalid template ID.' });
    const template = await CertificateTemplate.findByIdAndDelete(templateId);
    if (!template) return res.status(404).json({ message: 'Certificate template not found.' });
    await CertificateDelivery.deleteMany({ template: templateId });
    return res.json({ message: 'Certificate template deleted.' });
  } catch (error) {
    console.error('Failed to delete certificate template:', error);
    return res.status(500).json({ message: 'Failed to delete certificate template.' });
  }
}

async function processCertificateDeliveries(req, res, mode) {
  try {
    const { templateId } = req.params;
    if (!validId(templateId)) return res.status(400).json({ message: 'Invalid template ID.' });
    const template = await CertificateTemplate.findById(templateId)
      .populate('event', 'title date')
      .populate('recipients', 'name email');
    if (!template) return res.status(404).json({ message: 'Certificate template not found.' });
    if (template.recipients.length === 0) {
      return res.status(400).json({ message: 'Select at least one recipient before sending.' });
    }

    const staleSendingCutoff = new Date(Date.now() - 15 * 60 * 1000);
    await CertificateDelivery.updateMany(
      { template: templateId, status: 'sending', lastAttemptAt: { $lt: staleSendingCutoff } },
      { $set: { status: 'failed', lastError: 'Sending was interrupted before completion. Retry this delivery.' } }
    );

    const results = [];
    for (const recipient of template.recipients) {
      const deliveryKey = { template: template._id, user: recipient._id };
      try {
        try {
          await CertificateDelivery.updateOne(deliveryKey, {
            $setOnInsert: {
              event: template.event._id,
              recipientName: recipient.name,
              recipientEmail: recipient.email,
              status: 'pending',
              attempts: 0,
            },
          }, { upsert: true });
        } catch (error) {
          if (error.code !== 11000) throw error;
        }

        const claimStatus = mode === 'retry' ? 'failed' : 'pending';
        const delivery = await CertificateDelivery.findOneAndUpdate(
          { ...deliveryKey, status: claimStatus },
          {
            $set: {
              status: 'sending',
              recipientName: recipient.name,
              recipientEmail: recipient.email,
              lastAttemptAt: new Date(),
              lastError: '',
            },
            $inc: { attempts: 1 },
          },
          { new: true }
        );
        if (!delivery) {
          const existing = await CertificateDelivery.findOne(deliveryKey).select('status lastError');
          results.push({
            email: recipient.email,
            status: `skipped_${existing?.status || 'unknown'}`,
            message: existing?.lastError || undefined,
          });
          continue;
        }

        const pdfBuffer = await generateCertificateFromTemplate({
          name: recipient.name,
          imageBytes: template.image,
          contentType: template.contentType,
          namePlacement: template.namePlacement,
          nameColor: template.nameColor,
        });
        const eventDate = template.event.date
          ? new Date(template.event.date).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })
          : '';
        const variables = { name: recipient.name, eventname: template.event.title, eventdate: eventDate };
        await sendCertificateEmail({
          to: recipient.email,
          name: recipient.name,
          eventName: template.event.title,
          subject: interpolateEmailText(template.emailSubject || DEFAULT_EMAIL_SUBJECT, variables),
          text: interpolateEmailText(template.emailBody || DEFAULT_EMAIL_BODY, variables),
          pdfBuffer,
        });
        await CertificateDelivery.findByIdAndUpdate(delivery._id, {
          $set: { status: 'sent', sentAt: new Date(), lastError: '' },
        });
        results.push({ email: recipient.email, status: 'sent' });
      } catch (error) {
        console.error(`Failed to send certificate to ${recipient.email}:`, error);
        await CertificateDelivery.findOneAndUpdate(deliveryKey, {
          $set: { status: 'failed', lastError: String(error.message || 'Email delivery failed').slice(0, 2000) },
        });
        results.push({ email: recipient.email, status: 'failed', message: error.message });
      }
    }

    const sent = results.filter((result) => result.status === 'sent').length;
    const failed = results.filter((result) => result.status === 'failed').length;
    const skipped = results.length - sent - failed;
    return res.status(failed > 0 && sent === 0 && skipped === 0 ? 502 : 200).json({
      message: mode === 'retry'
        ? `Retry complete: ${sent} sent, ${failed} still failed, ${skipped} skipped.`
        : `Certificate sending complete: ${sent} sent, ${failed} failed, ${skipped} already handled or in progress.`,
      sent,
      failed,
      skipped,
      results,
    });
  } catch (error) {
    console.error('Failed to send certificates:', error);
    return res.status(500).json({ message: 'Failed to send certificates.' });
  }
}

export async function sendUsingCertificateTemplate(req, res) {
  return processCertificateDeliveries(req, res, 'send');
}

export async function retryFailedCertificateDeliveries(req, res) {
  return processCertificateDeliveries(req, res, 'retry');
}

export async function listCertificateDeliveries(req, res) {
  try {
    const { templateId } = req.params;
    if (!validId(templateId)) return res.status(400).json({ message: 'Invalid template ID.' });
    const template = await CertificateTemplate.findById(templateId).select('_id');
    if (!template) return res.status(404).json({ message: 'Certificate template not found.' });

    const deliveries = await CertificateDelivery.find({ template: templateId })
      .select('user recipientName recipientEmail status attempts lastAttemptAt sentAt lastError createdAt updatedAt')
      .populate('user', 'name email')
      .sort({ updatedAt: -1 });
    const counts = deliveries.reduce((result, delivery) => {
      result[delivery.status] = (result[delivery.status] || 0) + 1;
      return result;
    }, {});
    return res.json({ deliveries, counts });
  } catch (error) {
    console.error('Failed to load certificate delivery history:', error);
    return res.status(500).json({ message: 'Failed to load certificate delivery history.' });
  }
}
