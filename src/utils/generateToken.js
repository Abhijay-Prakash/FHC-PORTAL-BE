import jwt from "jsonwebtoken";

// Function to generate and return a JWT token
const generateToken = (userId) => {
  const token = jwt.sign({ userId: userId.toString() }, process.env.JWT_SECRET, {
    expiresIn: '15d', // Token expires in 15 days
  });
  console.log('Generated token for user:', token);
  return token; // Return the generated token
};

export default generateToken;
