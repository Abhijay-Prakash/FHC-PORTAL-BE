import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  phone: String,
  password: { type: String, required: true },

  gender: {
    type: String,
    required: true,
  },


  profilePic: {
    type: String,
    required: true,
  },

  semester: {
    type: Number,
    required:true,
    min: 1,
    max:8
  },
  class: {
    type: String,
    enum: ['CSA','CSB','CSC','CSD','EC','EI','EE','ME','CE'],
    required: true,
  },
  
  membershipId: { 
    type: String, 
    unique: true, 
    sparse: true },


  role: {
    type: String,
    enum: ['participant', 'member', 'execom', 'admin'],
    default: 'participant',
  },

  eventsAttended: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Event' 
  }],
  
  eventsRegistered:[{
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Event'
  }]
}, {
  timestamps: true
});

userSchema.index({eventsAttended:1  });
userSchema.index({eventsRegistered:1  });

export default mongoose.model('User', userSchema);
