import { getDB } from "../config/db.js";

export const getProtected = (req, res) => {
  res.json({
    message: 'Welcome to the protected route!',
    user: { id: req.user._id, email: req.user.email }
  })
}

export const getAllUsers = async (req, res) => {
  try {
    const db = getDB();
    const users = await db.collection('users').find({}, { 
      projection: { passwordHash: 0, resetToken: 0, resetTokenExp: 0 } 
    }).toArray();
    res.json({ users });
  } catch (error) {
    console.error(error);
  }
};