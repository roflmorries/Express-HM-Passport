import bcrypt from 'bcrypt';
import { User } from './userModel.js';

const COLLECTION = 'users';

export const createUser = async ({ email, password, googleId = null }) => {
  const passwordHash = password ? await bcrypt.hash(password, 10) : null;
  const user = new User({ email, passwordHash, googleId });
  await user.save();
  return user;
};

export const findUserByEmail = async email => {
  return User.findOne({email});
};

export const findUserById = async id => {
  return User.findById(id);
};

export const findUserByGoogleId = async googleId => {
  return User.findOne({ googleId });
};

export const findUserByResetToken = async token => {
  return User.findOne({ resetToken: token, resetTokenExp: { $gt: Date.now() } });
};

export const setResetToken = async (user, token, exp) => {
  user.resetToken = token;
  user.resetTokenExp = exp;
  await user.save();
};

export const validatePassword = async (user, password) => {
  return user.validatePassword(password);
}

export const updatePassword = async (user, password) => {
  user.passwordHash = await bcrypt.hash(password, 10);
  user.resetToken = null;
  user.resetTokenExp = null;
  return user.save();
}