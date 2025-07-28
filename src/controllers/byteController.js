import ByteRegistration from '../models/ByteRegistration.js';
import User from '../models/User.js';

import { sendByteRegistrationMail,sendBytePaymentConfirmationMail } from '../services/mailService.js';


//for admin-panel


export const verifyPayment = async (req, res) => {

  const { userId ,status} = req.body;

  if (!userId || typeof status !== 'boolean') {
    return res.status(400).json({ message: 'User ID and valid status (true/false) are required' });
  }

  try {
    const registration = await ByteRegistration.findOne({ user: userId });

    if (!registration) {
      return res.status(404).json({ message: 'Registration not found for this user' });
    }

    registration.paymentVerified = status;
    await registration.save();

    const whatsAppLink = 'set akkam later';
    await sendBytePaymentConfirmationMail(registration.user.email, registration.user.name, whatsAppLink);
    res.status(200).json({
      message: `Payment ${status ? 'verified' : 'unverified'} successfully`,
      registration,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error while updating payment status' });
  }

};



//for admin-panel
export const getParticipantsByDomain = async (req, res) => {
  const { domain } = req.query;

  if (!domain) {
    return res.status(400).json({ message: 'Domain is required' });
  }

  try {
    const participants = await ByteRegistration.find({ domain })
      .populate('user', 'name email semester class');  

    if (!participants || participants.length === 0) {
      return res.status(404).json({ message: 'No participants found for this domain' });
    }

    // Map over participants to structure the response as required
    const formattedParticipants = participants.map(participant => ({
      name: participant.user.name,
      email: participant.user.email,
      semester: participant.user.semester,
      class: participant.user.class,
      paymentVerified: participant.paymentVerified,
      userId: participant.user._id,
    }));

    res.status(200).json(formattedParticipants);
  } catch (err) {
    console.error('Error fetching participants:', err);
    res.status(500).json({ message: err.message });
  }
};



//for admin-panel
export const getByteDashboardStats = async (req, res) => {
  try {
    const domains = ['webdev', 'mern'];
    const stats = {};

    for (const domain of domains) {
      const count = await ByteRegistration.countDocuments({ domain });
      stats[domain] = count;
    }

    res.status(200).json(stats);
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
        attendance: [] ,
        paymentVerified: false,
      });
  
      await byteRegistration.save();
  
      await sendByteRegistrationMail(user.email, user.name);

      res.status(201).json({ message: 'User successfully registered for the BYTE class', byteRegistration });
  
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
  


export const getMyByteRegistration = async (req, res) => {
    try {
      const userId = req.user.id; 
  
      const registration = await ByteRegistration.findOne({ user: userId });
  
      if (registration) {
        return res.status(200).json({
          registered: true,
          domain: registration.domain,
          paymentVerified: registration.paymentVerified,
        });
      }
  
      return res.status(200).json({ registered: false });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Server error' });
    }
  };