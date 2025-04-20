import User from '../../models/User.js';
import Event from '../../models/Event.js';
import ByteRegistration from '../../models/ByteRegistration.js';

export const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalEvents = await Event.countDocuments();
    const totalByteRegs = await ByteRegistration.countDocuments();

    const totalAttended = await Event.aggregate([
      { $unwind: "$attendedUsers" },
      { $group: { _id: null, count: { $sum: 1 } } }
    ]);

    const totalByteAttendance = await ByteRegistration.aggregate([
      { $unwind: "$attendance" },
      { $match: { "attendance.attended": true } },
      { $group: { _id: null, count: { $sum: 1 } } }
    ]);

    res.json({
      totalUsers,
      totalEvents,
      totalByteRegs,
      totalEventAttendance: totalAttended[0]?.count || 0,
      totalByteAttendance: totalByteAttendance[0]?.count || 0
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to load stats", error: err.message });
  }
};

export const getUpcomingEvents = async (req, res) => {
  try {
    const events = await Event.find({ date: { $gte: new Date() } })
      .sort({ date: 1 })
      .limit(5);

    res.json(events);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch events", error: err.message });
  }
};

export const getRecentAttendance = async (req, res) => {
  try {
    const recentEvents = await Event.find({ date: { $lte: new Date() } })
      .sort({ date: -1 })
      .limit(5)
      .select('title date attendedUsers');

    const data = recentEvents.map(event => ({
      title: event.title,
      date: event.date,
      attendanceCount: event.attendedUsers.length
    }));

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch attendance", error: err.message });
  }
};

export const getNewMembers = async (req, res) => {
  try {
    const newMembers = await User.find({ role: { $in: ['member', 'execom'] } })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name email role profilePic createdAt');

    res.json(newMembers);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch new members", error: err.message });
  }
};

export const getByteAttendance = async (req, res) => {
  try {
    const byteAttendances = await ByteRegistration.aggregate([
      { $unwind: "$attendance" },
      { $match: { "attendance.attended": true } },
      {
        $group: {
          _id: "$domain",
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    res.json(byteAttendances);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch byte attendance", error: err.message });
  }
};
