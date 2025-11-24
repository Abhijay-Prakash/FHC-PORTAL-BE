import User,{SKILLS_ENUM} from '../../models/User.js';




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