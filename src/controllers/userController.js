import { createUser, findUserByEmail, findUserByResetToken, setResetToken, updatePassword } from "../models/user.js";
import crypto from 'crypto';
import nodemailer from 'nodemailer';


export const register = async (req, res) => {
  const { email, password } = req.body;
  if (findUserByEmail(email)){
    return res.status(400).json({ message: 'User with this email already exists' });
  };
  const user = await createUser({ email, password });
  req.login(user, error => {
    if (error) return res.status(500).json({ message: 'Login failed' });
    res.json({ message: 'Registered successfully', user: { id: user.id, email: user.email } })
  })
};

export const login = (req, res) => {
  res.json({ message: 'Logged in successfully', user: { id: req.user.id, email: req.user.email } })
};

export const logout = (req, res, next) => {
  req.logout(error => {
    if (error) return next(error);
    res.json({ message: 'Logged out successfully' })
  })
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = findUserByEmail(email);
  if (!user) return res.status(400).json({ message: 'User with this email doenst exists' });

  const token = crypto.randomBytes(20).toString('hex');
  setResetToken(user, token, Date.now() + 3600000);

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const resetUrl = `http://localhost:3001/auth/reset/${token}`;
  try {
    await transporter.sendMail({
    to: user.email,
    subject: 'Password Reset',
    text: `Follow the link to reset your password: ${resetUrl}`
  });
  res.json({ message: 'New password sent' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to send reset email. Try again' })
    console.log(error)
  }
};

export const resetPassword = async (req, res) => {
  const user = findUserByResetToken(req.params.token);
  if (!user) return res.status(400).json({ message: 'Invalid token' });

  const { password } = req.body;
  console.log(req.body)
  if (!password || typeof password !== 'string' || !password.trim()) {
    return res.status(400).json({ message: 'Invalid password' });
  }
  await updatePassword(user, password);

  res.json({ message: 'Password has been reset' })
}