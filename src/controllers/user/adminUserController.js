import User,{SKILLS_ENUM} from '../../models/User.js';
import mongoose from 'mongoose';
import Event from '../../models/Event.js';
import Project from '../../models/Project.js';
import ByteRegistration from '../../models/ByteRegistration.js';




export const getAllMembers = async (req, res) => {
  try {
    const members = await User.find({ isAlumni: { $ne: true }, role: { $in: ['member', 'execom', 'participant', 'admin'] } })
      .select('name email role profilePic createdAt semester class phone tags'); // select extra fields
    res.status(200).json(members);
  } catch (error) {
    console.error('Error fetching members:', error);
    res.status(500).json({ message: 'Server error while fetching members' });
  }
};

export const getAllAlumni = async (req, res) => {
  try {
    const alumni = await User.find({ isAlumni: true })
      .select('name email role profilePic createdAt passoutYear class phone tags')
      .sort({ passoutYear: -1, name: 1 });

    res.status(200).json(alumni);
  } catch (error) {
    console.error('Error fetching alumni:', error);
    res.status(500).json({ message: 'Server error while fetching alumni' });
  }
};

export const updateUserProfile = async (req, res) => {
  const { id } = req.params;
  const { name, email, phone, class: userClass, semester } = req.body;
  const updates = {};

  if (name !== undefined) {
    if (typeof name !== 'string' || !name.trim() || name.trim().length > 100) {
      return res.status(400).json({ message: 'Name must be between 1 and 100 characters.' });
    }
    updates.name = name.trim();
  }

  if (email !== undefined) {
    if (typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return res.status(400).json({ message: 'Enter a valid email address.' });
    }
    updates.email = email.trim().toLowerCase();
  }

  if (phone !== undefined) {
    if (typeof phone !== 'string' || phone.trim().length > 30) {
      return res.status(400).json({ message: 'Phone number must be 30 characters or fewer.' });
    }
    updates.phone = phone.trim();
  }

  if (userClass !== undefined) {
    const allowedClasses = ['CSA', 'CSB', 'CSC', 'CSD', 'EC', 'EI', 'EE', 'ME', 'CE', 'IMCA'];
    if (!allowedClasses.includes(userClass)) {
      return res.status(400).json({ message: 'Select a valid class.' });
    }
    updates.class = userClass;
  }

  if (semester !== undefined) {
    const semesterNumber = Number(semester);
    if (!Number.isInteger(semesterNumber) || semesterNumber < 1 || semesterNumber > 8) {
      return res.status(400).json({ message: 'Semester must be a whole number from 1 to 8.' });
    }
    updates.semester = semesterNumber;
  }

  if (!Object.keys(updates).length) {
    return res.status(400).json({ message: 'Provide at least one profile field to update.' });
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('name email phone class role profilePic createdAt semester tags isAlumni passoutYear');

    if (!updatedUser) return res.status(404).json({ message: 'User not found.' });
    return res.status(200).json(updatedUser);
  } catch (error) {
    if (error.code === 11000 && error.keyPattern?.email) {
      return res.status(409).json({ message: 'That email address is already in use.' });
    }
    if (error.name === 'CastError' || error.name === 'ValidationError') {
      return res.status(400).json({ message: 'The profile details are invalid.' });
    }
    console.error('Error updating user profile:', error);
    return res.status(500).json({ message: 'Server error while updating user profile.' });
  }
};

export const updateUserTags = async (req, res) => {
  const { id } = req.params;
  const { tags } = req.body;

  if (!Array.isArray(tags) || tags.length > 10 || tags.some((tag) => typeof tag !== 'string' || !tag.trim() || tag.trim().length > 40)) {
    return res.status(400).json({ message: 'Provide up to 10 non-empty tags, each no longer than 40 characters.' });
  }

  const normalizedTags = [];
  const seenTagKeys = new Set();
  for (const rawTag of tags) {
    const cleanedTag = rawTag.trim().replace(/\s+/g, ' ').replace(/\s*-\s*/g, '-');
    const formattedTag = /^ex[\s-]*chair$/i.test(cleanedTag)
      ? 'Ex-Chair'
      : cleanedTag.toLowerCase().replace(/(^|[\s-])([a-z])/g, (_, separator, letter) => `${separator}${letter.toUpperCase()}`);
    const tagKey = formattedTag.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (!seenTagKeys.has(tagKey)) {
      normalizedTags.push(formattedTag);
      seenTagKeys.add(tagKey);
    }
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: { tags: normalizedTags } },
      { new: true, runValidators: true }
    ).select('name tags');

    if (!updatedUser) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Error updating user tags:', error);
    res.status(500).json({ message: 'Server error while updating user tags' });
  }
};


export const changeRole = async(req,res) =>{
  const {id} = req.params;
  const {newRole} = req.body;

  if (!['participant', 'member', 'execom', 'admin'].includes(newRole)) {
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

export const deleteUser = async (req, res) => {
  const { id } = req.params;
  const session = await mongoose.startSession();

  try {
    let deletedUser;
    let deletedProjects = 0;
    let deletedByteRegistrations = 0;
    let removedEventRegistrations = 0;

    await session.withTransaction(async () => {
      const user = await User.findById(id).select('_id role name').session(session);
      if (!user) {
        const error = new Error('User not found.');
        error.statusCode = 404;
        throw error;
      }
      if (user._id.equals(req.user._id)) {
        const error = new Error('You cannot delete your own admin account.');
        error.statusCode = 400;
        throw error;
      }
      if (user.role === 'admin' && await User.countDocuments({ role: 'admin' }).session(session) <= 1) {
        const error = new Error('The last admin account cannot be deleted.');
        error.statusCode = 409;
        throw error;
      }

      const registrationEvents = await Event.find({ registeredUsers: user._id }).select('_id').session(session);
      removedEventRegistrations = registrationEvents.length;
      await Event.updateMany(
        { registeredUsers: user._id },
        { $pull: { registeredUsers: user._id, attendedUsers: user._id }, $inc: { attendees: -1 } },
        { session }
      );
      await Event.updateMany(
        { attendedUsers: user._id },
        { $pull: { attendedUsers: user._id } },
        { session }
      );

      const ownedProjects = await Project.deleteMany({ owner: user._id }, { session });
      deletedProjects = ownedProjects.deletedCount;
      const byteRegistrations = await ByteRegistration.deleteMany({ user: user._id }, { session });
      deletedByteRegistrations = byteRegistrations.deletedCount;
      await Project.updateMany(
        { $or: [{ teamMembers: user._id }, { 'joinRequests.user': user._id }] },
        { $pull: { teamMembers: user._id, joinRequests: { user: user._id } } },
        { session }
      );
      await User.deleteOne({ _id: user._id }, { session });
      deletedUser = user;
    });

    return res.status(200).json({
      message: `Deleted ${deletedUser.name}.`,
      id: deletedUser._id,
      deletedProjects,
      deletedByteRegistrations,
      removedEventRegistrations,
    });
  } catch (error) {
    if (error.statusCode) return res.status(error.statusCode).json({ message: error.message });
    if (error.name === 'CastError') return res.status(400).json({ message: 'Invalid user ID.' });
    console.error('Error deleting user:', error);
    return res.status(500).json({ message: 'Server error while deleting user.' });
  } finally {
    await session.endSession();
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
