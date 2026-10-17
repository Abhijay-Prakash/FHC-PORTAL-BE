import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import User from '../models/User.js';
import { generateAvatar } from '../utils/avatarGenerator.js';

dotenv.config();

const applyChanges = process.argv.includes('--apply');
const legacyAvatarPattern = /^(https?:\/\/)?(avatar\.iran\.liara\.run|api\.dicebear\.com)\//i;

try {
  await connectDB();
  const users = await User.find({ profilePic: { $regex: legacyAvatarPattern } }).select('_id gender profilePic');
  console.log(`${applyChanges ? 'Updating' : 'Dry run:'} ${users.length} users with generated legacy avatars.`);

  if (applyChanges) {
    for (const user of users) {
      user.profilePic = generateAvatar(user.name, user.gender);
      await user.save({ validateBeforeSave: false });
    }
    console.log('Legacy generated avatars replaced. Custom uploaded photos were not changed.');
  } else {
    console.log('No database changes made. Run with --apply to replace these avatars.');
  }
} catch (error) {
  console.error('Could not replace legacy avatars:', error);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}
