import bcrypt from 'bcrypt';
import { getDB } from '../config/db.js';
import { ObjectId } from 'mongodb';

const COLLECTION = 'users';

export const createUser = async ({email, password, googleId = null}) => {
  const passwordHash = password ? await bcrypt.hash(password, 10) : null;
  const user = {
    email,
    passwordHash,
    googleId,
    resetToken: null,
    resetTokenExp: null,
  }
  const db = getDB();
  const usersCollection = db.collection('users')
  try {
    const result = await usersCollection.insertOne(user);
    user._id = result.insertedId;
    return user
  } catch (error) {
    console.error(error);
  }
};

export const findUserByEmail = async email => {
  const db = getDB();
  return db.collection(COLLECTION).findOne({ email })
};

export const findUserById = async id => {
  const db = getDB();
  try {
    return db.collection(COLLECTION).findOne({ _id: new ObjectId(id) })
  } catch {
    return null
  }
};

export const findUserByGoogleId = async googleId => {
  const db = getDB();
  return db.collection(COLLECTION).findOne({ googleId });
};

export const findUserByResetToken = async token => {
  const db = getDB();
  const now = Date.now();
  return db.collection(COLLECTION).findOne({ resetToken: token, resetTokenExp: { $gt: now } });
};

export const setResetToken = async (user, token, exp) => {
  const db = getDB();
  await db.collection(COLLECTION).updateOne({ _id: user._id }, { $set: { resetToken: token, resetTokenExp: exp } })
  user.resetToken = token;
  user.resetTokenExp = exp;
};

export const validatePassword = async (user, password) => {
  if (!user.passwordHash) return false;
  return bcrypt.compare(password, user.passwordHash);
}

export const updatePassword = async (user, password) => {
  const db = getDB();
  const passwordHash = await bcrypt.hash(password, 10);
  await db.collection(COLLECTION).updateOne({ _id: user._id }, {$set: { passwordHash, resetToken: null, resetTokenExp: null }});
  user.passwordHash = passwordHash;
  user.resetToken = null;
  user.resetTokenExp = null;
}