import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { findUserByEmail, findUserById, validatePassword } from "../models/user.js";

passport.use(new LocalStrategy(
  {usernameField: 'email'},
  async (email, password, done) => {
    console.log(`User email: ${email}`);
    console.log(`User password: ${password}`);
    const user = findUserByEmail(email);
    if (!user) return done(null, false, { message: 'User with this email doesnt exists' });
    const valid = await validatePassword(user, password);
    if (!valid) return done(null, false, { message: 'Incorrect password' });
    return done(null, user)
  }
));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  const user = findUserById(id);
  if (user) done(null, user);
  else done(null, false);
})