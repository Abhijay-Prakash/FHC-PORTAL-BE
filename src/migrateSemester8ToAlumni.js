import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import connectDB from './config/db.js';
import User from './models/User.js';

const migrateSemester8ToAlumni = async () => {
  try {
    await connectDB();

    const result = await User.updateMany(
      { semester: 8 },
      {
        $set: { isAlumni: true, passoutYear: 2026 },
        $unset: { semester: 1 },
      }
    );

    console.log(`Converted ${result.modifiedCount} semester 8 users to alumni (passout year 2026).`);
  } catch (error) {
    console.error('Error converting semester 8 users to alumni:', error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

migrateSemester8ToAlumni();
