import Event from '../models/Event.js';
import User from '../models/User.js';




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
    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    
    if (event.registeredUsers.includes(userId)) {
      return res.status(400).json({ message: 'User is already registered for this event' });
    }

    
    if (event.attendees >= event.capacity) {
      return res.status(400).json({ message: 'Event is full' });
    }

    event.registeredUsers.push(userId);
    event.attendees += 1;
    await event.save();

   
    await User.findByIdAndUpdate(userId, {
      $addToSet: { eventsRegistered: eventId }
    }, { new: true });

    res.status(200).json({ message: 'Registered for event successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



export const getAllRegistrations = async (req, res) => {
  const { eventId } = req.params; // Using params instead of body for eventId

  if (!eventId) {
    return res.status(400).json({ message: 'Event ID is required' });
  }

  try {
    const event = await Event.findById(eventId)
      .populate('registeredUsers', 'name email')
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


export const getRegisteredEvents = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('eventsRegistered');

    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json({ events: user.eventsRegistered });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};



//should prolly move this to attendance module or something along with byte's attendance fn
export const markAttendanceForEvent = async (req, res) => {
  const { eventId, userId } = req.body;

  if (!eventId || !userId) {
    return res.status(400).json({ message: 'Event ID and User ID are required' });
  }

  try {
  
    await User.findByIdAndUpdate(userId, {
      $addToSet: { eventsAttended: eventId }
    });

    await Event.findByIdAndUpdate(eventId, {
      $addToSet: { attendedUsers: userId }
    });

    res.status(200).json({ message: 'Attendance marked successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Internal server error' });
  }
};