/*Run this script only when you have to increment the semester....new sem starting time only.....*/

import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import connectDB from './config/db.js';     
import User from './models/User.js';   


const incrementSemester = async () => {
  try {
    await connectDB();  

    console.log(' Increasing semester by 1 for all eligible users...');

    const result = await User.updateMany(
      { semester: { $lt: 8 } },   
      { $inc: { semester: 1 } }     
    );

    console.log(` Semesters updated for ${result.modifiedCount} users.`);
  } catch (error) {
    console.error(' Error incrementing semesters:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log(' MongoDB disconnected. Script complete.');
    process.exit(0);
  }
};

incrementSemester();
