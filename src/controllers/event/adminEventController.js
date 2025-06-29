import Event from '../../models/Event.js';
import User from '../../models/User.js';



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