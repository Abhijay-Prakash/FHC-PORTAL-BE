import Event from '../../models/Event.js';
import User from '../../models/User.js';



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