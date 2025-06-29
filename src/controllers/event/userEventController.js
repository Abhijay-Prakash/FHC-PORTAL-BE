import Event from '../../models/Event.js';
import User from '../../models/User.js';
import { sendRegistrationMail,sendMeetingMail } from '../../services/mailService.js';



export const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const registerForEvent = async (req, res) => {
  const { eventId } = req.body;
  const userId = req.user._id;

  if (!eventId) {
    return res.status(400).json({ message: 'Event ID is required' });
  }

  try {
    const user = await User.findById(userId);
    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    
    if (event.registrationStatus !== 'Open') {
      return res.status(403).json({
        message: `Registration is currently ${event.registrationStatus.toLowerCase()} for this event`
      });
    }

    
    if (event.registeredUsers.includes(userId)) {
      return res.status(400).json({ message: 'User is already registered for this event' });
    }

   
    if (event.attendees >= event.capacity) {
      
      if (event.registrationStatus !== 'Full') {
        event.registrationStatus = 'Full';
        await event.save();
      }
      return res.status(400).json({ message: 'Event is full' });
    }


    event.registeredUsers.push(userId);
    event.attendees += 1;

    
    if (event.attendees >= event.capacity) {
      event.registrationStatus = 'Full';
    }

    await event.save();

    await User.findByIdAndUpdate(userId, {
      $addToSet: { eventsRegistered: eventId }
    });

    await sendRegistrationMail(user.email,user.name,event.title);

    
    if (event.category === 'Meeting') {
      const meetingLink = 'https://meet.google.com/ajs-nkqq-bdw'; 
      await sendMeetingMail({
        to: user.email,
        name: user.name,
        event: event.title,
        meetingLink,
        date: event.date,
        time: event.time,
      });
    }

    res.status(200).json({ message: 'Registered for event successfully' });
  } catch (err) {
    console.error("Error in event registration:", err.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};





export const getRegisteredEvents = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('eventsRegistered');

    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json({ events: user.eventsRegistered });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};





