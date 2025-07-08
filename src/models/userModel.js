import mongoose from "mongoose";
import bcrypt from 'bcrypt'

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String },
  googleId: { type: String, default: null },
  resetToken: { type: String, default: null },
  resetTokenExp: { type: Date, default: null }
});

userSchema.methods.validatePassword = function(password) {
  if (!this.passwordHash) return false;
  return bcrypt.compare(password, this.passwordHash);
};

export const User = mongoose.model('User', userSchema);