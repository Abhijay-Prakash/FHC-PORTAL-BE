import User from '../models/User.js';

export const getUserProfile = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId).populate('eventsAttended');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
