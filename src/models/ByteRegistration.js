import mongoose from "mongoose";

const byteRegistrationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  domain: {
    type: String,
    required: true,
    enum: ['webdev', 'backend', 'react', 'ml'] 
  },
  
  classDates: [{ type: Date }],

  attendance: [
    {
      date: { type: Date, required: true },
      attended: { type: Boolean, default: false }
    }
  ]
});


byteRegistrationSchema.index({ user: 1, domain: 1 }, { unique: true });

export default mongoose.model('ByteRegistration', byteRegistrationSchema);
