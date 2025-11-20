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







//for admin 
export const getAllMembers = async (req, res) => {
  try {
    const members = await User.find({ role: { $in: ['member', 'execom', 'participant', 'admin'] } })
      .select('name email role profilePic createdAt semester class  phone'); // select extra fields
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



export const getUserGrowth = async (req, res) => {
  try {
  
    const rawData = await User.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);

   
    const monthNames = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    const filledData = [];
    let cumulative = 0;

    
    const now = new Date();
    const firstUser = rawData[0];
    const startYear = firstUser ? firstUser._id.year : now.getFullYear();
    const startMonth = firstUser ? firstUser._id.month : now.getMonth() + 1;

    let currentYear = startYear;
    let currentMonth = startMonth;

    let rawIndex = 0;

    while (
      currentYear < now.getFullYear() ||
      (currentYear === now.getFullYear() && currentMonth <= now.getMonth() + 1)
    ) {
      const monthStr = `${monthNames[currentMonth - 1]} ${currentYear}`;

      const currentRaw = rawData[rawIndex];

      if (
        currentRaw &&
        currentRaw._id.year === currentYear &&
        currentRaw._id.month === currentMonth
      ) {
        cumulative += currentRaw.count;
        filledData.push({
          month: monthStr,
          users: cumulative,
          newUsers: currentRaw.count 
        });
        rawIndex++;
      } else {
        
        filledData.push({
          month: monthStr,
          users: cumulative,
          newUsers: 0
        });
      }

 
      currentMonth++;
      if (currentMonth > 12) {
        currentMonth = 1;
        currentYear++;
      }
    }

    res.json({ monthly: filledData });
  } catch (error) {
    console.error("Error fetching user growth:", error);
    res.status(500).json({ message: "Failed to fetch user growth data" });
  }
};