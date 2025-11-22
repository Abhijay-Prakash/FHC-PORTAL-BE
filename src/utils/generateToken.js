import jwt from "jsonwebtoken";


const generateToken = (userId) => {
  const token = jwt.sign({ userId: userId.toString() }, process.env.JWT_SECRET, {
    expiresIn: '15d', 
  });
  console.log('Generated token for user:', token);
  return token; 
};

export default generateToken;
