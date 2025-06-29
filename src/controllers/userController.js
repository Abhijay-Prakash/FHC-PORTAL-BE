import User,{SKILLS_ENUM} from '../models/User.js';
//first half for users, second half for admin panel 








//for profile page
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('eventsAttended');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};




export const addSkills = async (req, res) => {
  try {
    const { skills } = req.body;

    if (!Array.isArray(skills)) {
      return res.status(400).json({ message: "Skills should be an array of strings" });
    }

    const invalidSkills = skills.filter(skill => !SKILLS_ENUM.includes(skill));
    if (invalidSkills.length > 0) {
      return res.status(400).json({
        message: `Invalid skills: ${invalidSkills.join(', ')}`
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $addToSet: { skills: { $each: skills } } },
      { new: true }
    );

    res.status(200).json({ message: "Skills updated successfully", user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};











//for admin 
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


export const changeRole = async(req,res) =>{
  const {id} = req.params;
  const {newRole} = req.body;

  if (!['admin', 'execom', 'member'].includes(newRole)) {
    return res.status(400).json({ message: 'Invalid role' });
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(id, { role: newRole }, { new: true });
    if (!updatedUser) return res.status(404).json({ message: 'User not found' });

    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: 'Error updating role', error: err });
  }

};
