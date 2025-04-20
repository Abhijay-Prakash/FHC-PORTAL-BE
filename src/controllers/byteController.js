import ByteRegistration from '../models/ByteRegistration.js';
import User from '../models/User.js';



export const getParticipantsByDomain = async (req, res) => {
  const { domain } = req.query;

  try {
   
    const participants = await ByteRegistration.find({ domain })
      .populate("user", "name email");

    if (!participants.length) {
      return res.status(404).json({ message: "No participants found for this domain" });
    }

    res.status(200).json(participants);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};





export const registerForByteClass = async (req, res) => {
    const { domain } = req.body;  

    try {
      const user = await User.findById(req.user._id);
  

      const existingRegistration = await ByteRegistration.findOne({ user, domain });
      if (existingRegistration) {
        return res.status(400).json({ message: 'User is already registered for this class' });
      }
  
   
      const byteRegistration = new ByteRegistration({
        user: user,
        domain,
        attendance: []  
      });
  
      await byteRegistration.save();
      res.status(201).json({ message: 'User successfully registered for the BYTE class', byteRegistration });
  
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
  


export const getMyByteRegistration = async (req, res) => {
    try {
      const userId = req.user.id; // populated by authMiddleware
  
      const registration = await ByteRegistration.findOne({ user: userId });
  
      if (registration) {
        return res.status(200).json({
          registered: true,
          domain: registration.domain,
        });
      }
  
      return res.status(200).json({ registered: false });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Server error' });
    }
  };