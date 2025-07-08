import { User } from "../models/userModel.js";

export const getProtected = (req, res) => {
  res.json({
    message: 'Welcome to the protected route!',
    user: { id: req.user.id, email: req.user.email }
  });
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, { passwordHash: 0, resetToken: 0, resetTokenExp: 0 });
    res.json({ users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
};