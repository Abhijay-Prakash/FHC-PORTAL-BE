
export const isAdmin = (req, res, next) => {
  if (req.user?.role === 'admin') {
    return next();
  }
  console.log("hello");

  return res.status(403).json({ message: 'Access denied. Admins only.' });
};
