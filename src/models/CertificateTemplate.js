import mongoose from 'mongoose';

const certificateTemplateSchema = new mongoose.Schema({
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true,
    index: true,
  },
  name: { type: String, required: true, trim: true, maxlength: 80 },
  contentType: { type: String, enum: ['image/png', 'image/jpeg'], required: true },
  image: { type: Buffer, required: true },
  recipients: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  namePlacement: {
    x: { type: Number, default: 0.2, min: 0, max: 1 },
    y: { type: Number, default: 0.42, min: 0, max: 1 },
    width: { type: Number, default: 0.6, min: 0, max: 1 },
    height: { type: Number, default: 0.12, min: 0, max: 1 },
  },
  nameColor: { type: String, enum: ['white', 'black'], default: 'white' },
  emailSubject: {
    type: String,
    trim: true,
    maxlength: 180,
    default: 'Your certificate for {{eventName}}',
  },
  emailBody: {
    type: String,
    maxlength: 10000,
    default: 'Hi {{name}},\n\nThank you for taking part in {{eventName}}. We appreciate your contribution. Your certificate is attached.\n\nBest,\nFISAT HORIZON',
  },
}, { timestamps: true });

certificateTemplateSchema.index({ event: 1, name: 1 });

export default mongoose.model('CertificateTemplate', certificateTemplateSchema);
