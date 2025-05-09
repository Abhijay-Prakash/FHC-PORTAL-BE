import jwt from "jsonwebtoken";
import mongoose from "mongoose"; // Import mongoose to use ObjectId

const generateTokenAndSetCookie = (userId, res) => {
    const token = jwt.sign({ userId: userId.toString() }, process.env.JWT_SECRET, {
      expiresIn: '15d',
    });
    console.log('Setting token for user:', userId);

    res.cookie('jwt', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'None',
      maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days
    });
  };
  
  export default generateTokenAndSetCookie;