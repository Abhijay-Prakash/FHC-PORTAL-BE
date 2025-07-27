import Event from '../../models/Event.js';
import User from '../../models/User.js';

export const getUserStats = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId).populate('eventsAttended').populate('eventsRegistered');

    const totalRegistered = user.eventsRegistered.length;
    const totalAttended = user.eventsAttended.length;

    res.json({
      totalRegistered,
      totalAttended
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch user stats", error: err.message });
  }
};

export const getUpcomingUserEvents = async (req, res) => {
  try {
    const userId = req.user._id;

    const events = await Event.find({
      date: { $gte: new Date() },
      registeredUsers: userId
    })
      .sort({ date: 1 })
      .limit(5)
      .select('title date time location');

    res.json(events);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch upcoming user events", error: err.message });
  }
};


