import User,{SKILLS_ENUM} from '../../models/User.js';
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
      { skills},
      { new: true }
    );

    res.status(200).json({ message: "Skills updated successfully", user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



export const updateSocialLinks = async (req, res) => {
  try {
    const { githubLink, linkedinLink } = req.body;

    
    const urlRegex = /^https?:\/\/(www\.)?[a-zA-Z0-9./_-]+$/;
    if (
      (githubLink && !urlRegex.test(githubLink)) ||
      (linkedinLink && !urlRegex.test(linkedinLink))
    ) {
      return res.status(400).json({ message: "Invalid URL format" });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        ...(githubLink && { githubLink }),
        ...(linkedinLink && { linkedinLink }),
      },
      { new: true }
    );

    res.status(200).json({
      message: "Social links updated successfully",
      user
    });
  } catch (error) {
    console.error("Error updating social links:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};


