import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

const users = [];
console.log(users)

export const createUser = async ({email, password, googleId = null}) => {
  const passwordHash = password ? await bcrypt.hash(password, 10) : null;
  const user = {
    id: uuidv4(),
    email,
    passwordHash,
    googleId,
    resetToken: null,
    resetTokenExp: null,
  }
  users.push(user);
  return user;
};

export const findUserByEmail = email => {
  return users.find(user => user.email === email);
};

export const findUserById = id => {
  return users.find(user => user.id === id);
};

export const findUserByGoogleId = googleId => {
  return users.find(user => user.googleId === googleId);
};

export const findUserByResetToken = token => {
  const now = Date.now();
  return users.find(user => user.resetToken === token && user.resetTokenExp > now);
};

export const setResetToken = (user, token, exp) => {
  user.resetToken = token;
  user.resetTokenExp = exp;
};

export const validatePassword = async (user, password) => {
  if (!user.passwordHash) return false;
  return bcrypt.compare(password, user.passwordHash);
}

export const updatePassword = async (user, password) => {
  user.passwordHash = await bcrypt.hash(password, 10);
  user.resetToken = null;
  user.resetTokenExp = null;
}