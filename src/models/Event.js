import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['BYTE', 'Event', 'Workshop', 'Talk', 'Meetup', 'Competition', 'Hackathon'],
    required: true
  },
  date: {
    type: Date, // Use Date type instead of String
    required: true
  },
  time: {
    type: String, // Store time as a string, or could be Date if you need to capture time as well
    required: true
  },
  location: {
    type: String, // Location field for storing event venue
    required: true
  },
  attendees: {
    type: Number,
    default: 0 
  },
  capacity: {
    type: Number,
    required: true 
  },
  tags: [{
    type: String
  }],
  registeredUsers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  attendedUsers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
});

eventSchema.index({ registeredUsers: 1 });
eventSchema.index({ attendedUsers: 1 });

export default mongoose.model('Event', eventSchema);
