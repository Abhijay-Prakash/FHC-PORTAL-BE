import Event from '../models/Event.js';
import User from '../models/User.js';
import { sendRegistrationMail,sendMeetingMail } from '../services/mailService.js';


//general stuff
//admin at the bottom
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





//admin features below this


export const addEvent = async (req, res) => {
  try {
 

    const { title, description, category, date, time, location, capacity, tags } = req.body;

  
    const newEvent = new Event({
      title,
      description,
      category,
      date,
      time,
      location,
      capacity,
      tags
    });

 
    await newEvent.save();

    return res.status(201).json({
      message: "Event created successfully",
      event: newEvent
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server error, event could not be created"
    });
  }
};


export const getAllRegistrations = async (req, res) => {
  const { eventId } = req.body; 

  if (!eventId) {
    return res.status(400).json({ message: 'Event ID is required' });
  }

  try {
    const event = await Event.findById(eventId)
      .populate('registeredUsers', 'name email class semester')
      .populate('attendedUsers', 'name email');

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.status(200).json({
      eventId: event._id,
      title: event.title,
      date: event.date,
      registeredUsers: event.registeredUsers,
      attendedUsers: event.attendedUsers
    });
  } catch (err) {
    res.status(500).json({ message: 'Internal server error' });
  }
};


export const updateRegistrationStatus = async (req,res) => {
  try{
    const {eventId} = req.params;
    const {status} = req.body;

    const allowedStatuses = ['Upcoming', 'Open', 'Closed', 'Full', 'Completed', 'Cancelled'];
     if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid registration status provided' });
    }

    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    event.registrationStatus = status;
    await event.save();

    res.status(200).json({
      message: `Registration status updated to '${status}'`,
      event,
    });



  }catch(err){
    console.error('Error updating registration status',err.message);
    res.status(500).json({message:'Internal server error'});
  }

};