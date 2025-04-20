import jwt from "jsonwebtoken";
import User from "../models/User.js";
import mongoose from "mongoose"; 

export const isAdmin = (req, res, next) => {
  if (req.user?.role === 'admin') {
    return next();
  }

  return res.status(403).json({ message: 'Access denied. Admins only.' });
};
