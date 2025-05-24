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
    enum: ['BYTE', 'Event', 'Workshop', 'Talk', 'Meetup', 'Competition', 'Hackathon','Training','Seminar','Conference','Other','Meeting'],
    required: true
  },
  date: {
    type: Date, // format->  "date": "2025-07-15T10:00:00Z",  
    required: true
  },
  time: {
    type: String, 
    required: true
    
  },
  location: {
    type: String, 
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
