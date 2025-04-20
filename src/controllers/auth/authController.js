import bcrypt from 'bcrypt';
import User from '../../models/User.js';
import generateMembershipId  from '../../utils/idGenerator.js';
import { generateAvatar } from '../../utils/avatarGenerator.js';
import generateTokenAndSetCookie from '../../utils/generateToken.js';

//logout pending



export const register = async (req, res) => {
  const { name, email, phone, password, gender, semester, class: userClass } = req.body;

  if (!name || !email || !phone || !password || !gender || !semester || !userClass) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const profilePic = generateAvatar(name,gender)


    const newUser = new User({
      name,
      email,
      phone,
      password,
      gender, 
      semester,
      class: userClass,
      profilePic,
    });

    await newUser.save();
    generateTokenAndSetCookie(newUser._id, res);
    res.status(201).json({ message: 'User registered successfully' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};


export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    if(user.password!= password){
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    generateTokenAndSetCookie(user._id, res);
    res.status(200).json({ message: 'Login successful', user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
