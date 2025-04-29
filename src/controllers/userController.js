import User from '../models/User.js';


//for profile page
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('eventsAttended');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



//for admin panel
export const getAllMembers = async (req, res) => {
  try {
    const members = await User.find({ role: { $in: ['member', 'execom', 'participant', 'admin'] } })
      .select('name email role profilePic createdAt semester class'); // select extra fields
    res.status(200).json(members);
  } catch (error) {
    console.error('Error fetching members:', error);
    res.status(500).json({ message: 'Server error while fetching members' });
  }
};
