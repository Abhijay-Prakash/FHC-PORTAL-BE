import mongoose from 'mongoose';

const certificateDeliverySchema = new mongoose.Schema({
  event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true, index: true },
  template: { type: mongoose.Schema.Types.ObjectId, ref: 'CertificateTemplate', required: true, index: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  recipientName: { type: String, required: true },
  recipientEmail: { type: String, required: true },
  status: { type: String, enum: ['pending', 'sending', 'sent', 'failed'], default: 'pending', index: true },
  attempts: { type: Number, default: 0, min: 0 },
  lastAttemptAt: { type: Date, default: null },
  sentAt: { type: Date, default: null },
  lastError: { type: String, default: '' },
}, { timestamps: true });

certificateDeliverySchema.index({ template: 1, user: 1 }, { unique: true });
certificateDeliverySchema.index({ template:  1, status: 1, updatedAt: -1 });

export default mongoose.model('CertificateDelivery', certificateDeliverySchema);
